/**
 * The write gate's verdicts, driven the way the SDK drives them: `ask` mints
 * the state, `verify` (the seam's hook) decodes what the client echoes, and
 * `settle` judges the retry. tests/gate-eras.test.ts runs the same gate over
 * the wire in both protocol eras.
 */
import { describe, it, expect, vi } from 'vitest';
import type { ServerContext } from '@modelcontextprotocol/server';
import { createContinuations, createWriteGate } from '../src/core/confirm.js';

const checkbox = { message: 'preview', strong: false };
const typed = { message: 'preview', strong: true };

/** Just the slice of the handler context the gate reads. */
function ctx(state?: unknown, inputResponses?: Record<string, unknown>): ServerContext {
  return {
    mcpReq: { method: 'tools/call', requestState: () => state, inputResponses },
  } as unknown as ServerContext;
}

/** Ask, then decode the echoed state the way the server's verify hook does. */
async function prompt(args: unknown = { id: '1' }, preview = checkbox) {
  const gate = createWriteGate();
  const asked = await gate.ask(ctx(), 'beta_groups__delete', args, preview);
  const state = await gate.verify(asked.requestState!, ctx());
  return { gate, asked, state };
}

const accept = (content: Record<string, unknown>) => ({ confirm: { action: 'accept', content } });

describe('the write gate', () => {
  it('asks with a checkbox for an ordinary write and a typed field for a strong one', async () => {
    const { asked } = await prompt();
    expect(asked.resultType).toBe('input_required');
    expect((asked.inputRequests!.confirm as any).params.requestedSchema.properties.confirm.type).toBe('boolean');

    const strong = await prompt(undefined, typed);
    expect((strong.asked.inputRequests!.confirm as any).params.requestedSchema.properties.confirmation.type).toBe('string');
  });

  it('has nothing to settle on a first call, even one that brings its own answer', () => {
    // A client cannot skip the prompt by sending inputResponses up front.
    expect(createWriteGate().settle(ctx(undefined, accept({ confirm: true })), 'x', {})).toBeUndefined();
  });

  it('allows the write when the user ticks the box', async () => {
    const { gate, state } = await prompt();
    expect(gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '1' })).toMatchObject({ allowed: true });
  });

  it('blocks when the box is left unticked', async () => {
    const { gate, state } = await prompt();
    expect(gate.settle(ctx(state, accept({ confirm: false })), 'beta_groups__delete', { id: '1' })).toEqual({
      allowed: false,
      reason: 'the box was left unticked',
    });
  });

  it('reports the action when the user declines', async () => {
    const { gate, state } = await prompt();
    expect(gate.settle(ctx(state, { confirm: { action: 'decline' } }), 'beta_groups__delete', { id: '1' })).toEqual({
      allowed: false,
      reason: 'decline',
    });
  });

  it('takes CONFIRM in any case and padding on a strong write, and nothing else', async () => {
    const yes = await prompt(undefined, typed);
    expect(yes.gate.settle(ctx(yes.state, accept({ confirmation: '  confirm ' })), 'beta_groups__delete', { id: '1' })).toMatchObject({ allowed: true });

    const no = await prompt(undefined, typed);
    expect(no.gate.settle(ctx(no.state, accept({ confirmation: 'yes' })), 'beta_groups__delete', { id: '1' })).toEqual({
      allowed: false,
      reason: 'the answer was not CONFIRM',
    });
  });

  it('takes only a string for the typed answer, and no lookalike letters', async () => {
    for (const confirmation of [['CONFIRM'], 'CONFıRM', 'conſirm']) {
      const { gate, state } = await prompt(undefined, typed);
      expect(gate.settle(ctx(state, accept({ confirmation })), 'beta_groups__delete', { id: '1' })).toMatchObject({ allowed: false });
    }
  });

  it('refuses an answer that arrives after the prompt expired', async () => {
    vi.useFakeTimers();
    try {
      const { gate, state } = await prompt();
      vi.advanceTimersByTime(600_001);
      expect(gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '1' })).toMatchObject({ stale: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it('refuses a yes given for other arguments', async () => {
    const { gate, state } = await prompt({ id: '1' });
    const decision = gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '2' });
    expect(decision).toMatchObject({ allowed: false, stale: true });
    expect(decision?.reason).toMatch(/arguments changed/);
  });

  it('refuses a yes given for another tool', async () => {
    const { gate, state } = await prompt();
    expect(gate.settle(ctx(state, accept({ confirm: true })), 'apps__update', { id: '1' })).toMatchObject({ allowed: false, stale: true });
  });

  it('matches the arguments whatever order their keys arrive in', async () => {
    const { gate, state } = await prompt({ id: '1', body: { b: 1, a: [{ y: 2, x: 1 }] } });
    expect(
      gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { body: { a: [{ x: 1, y: 2 }], b: 1 }, id: '1' })
    ).toMatchObject({ allowed: true });
  });

  it('spends a yes once', async () => {
    const { gate, state } = await prompt();
    expect(gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '1' })).toMatchObject({ allowed: true });
    const again = gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '1' });
    expect(again).toMatchObject({ allowed: false, stale: true });
    expect(again?.reason).toMatch(/already used/);
  });

  it('spends the nonce even when the retry is refused, so a corrected retry cannot reuse it', async () => {
    const { gate, state } = await prompt();
    gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '2' });
    expect(gate.settle(ctx(state, accept({ confirm: true })), 'beta_groups__delete', { id: '1' })).toMatchObject({ stale: true });
  });

  it('rejects state minted by another process', async () => {
    const { asked } = await prompt();
    await expect(createWriteGate().verify(asked.requestState!, ctx())).rejects.toThrow();
  });

  it('rejects state whose body was edited', async () => {
    // Downgrading a typed confirmation to a checkbox is the edit worth trying.
    const { gate, asked } = await prompt(undefined, typed);
    const [v, body, mac] = asked.requestState!.split('.');
    const edited = Buffer.from(body, 'base64url').toString().replace('"strong":true', '"strong":false');
    expect(edited).toContain('"strong":false');
    await expect(gate.verify(`${v}.${Buffer.from(edited).toString('base64url')}.${mac}`, ctx())).rejects.toThrow();
  });
});

describe('continuing an approved write', () => {
  const args = { app: 'Hydramic', territory: 'USA', price: '29.99' };

  it('covers the same call again while it is unfinished, and only that call', () => {
    const c = createContinuations();
    expect(c.covers('pricing__equalize_price', args)).toBe(false);
    c.record('pricing__equalize_price', args, { ok: true, finished: false });
    expect(c.covers('pricing__equalize_price', { price: '29.99', territory: 'USA', app: 'Hydramic' })).toBe(true);
    expect(c.covers('pricing__equalize_price', { ...args, price: '39.99' })).toBe(false);
    expect(c.covers('pricing__make_offer', args)).toBe(false);
    c.record('pricing__equalize_price', args, { ok: false, partial: true });
    expect(c.covers('pricing__equalize_price', args)).toBe(true);
    c.record('pricing__equalize_price', args, { ok: true, written: 40 });
    expect(c.covers('pricing__equalize_price', args)).toBe(false);
  });

  it('lets one tool run without asking once the user ticked "don\'t ask again"', async () => {
    const c = createContinuations();
    c.allowTool('beta_groups__delete');
    expect(c.covers('beta_groups__delete', { id: 'any' })).toBe(true);
    expect(c.covers('beta_groups__update', { id: 'any' })).toBe(false);

    const gate = createWriteGate();
    const asked = await gate.ask(ctx(), 'beta_groups__delete', { id: '1' }, typed, undefined, true);
    const schema = (asked.inputRequests!.confirm as any).params.requestedSchema;
    expect(schema.properties.series.title).toMatch(/Don't ask again/);
    expect(schema.required).toEqual(['confirmation']);
    const state = await gate.verify(asked.requestState!, ctx());
    expect(gate.settle(ctx(state, accept({ confirmation: 'CONFIRM', series: true })), 'beta_groups__delete', { id: '1' })).toMatchObject({ allowed: true, series: true });
  });

  it('never starts from a finished write, and lapses after its window', () => {
    vi.useFakeTimers();
    try {
      const c = createContinuations(1_000);
      c.record('pricing__equalize_price', args, { ok: true });
      expect(c.covers('pricing__equalize_price', args)).toBe(false);
      c.record('pricing__equalize_price', args, { ok: true, finished: false });
      vi.advanceTimersByTime(1_001);
      expect(c.covers('pricing__equalize_price', args)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
