import { describe, it, expect, vi } from 'vitest';
import { confirmWrite, type WriteConfirmer } from '../src/core/confirm.js';

function confirmer(
  caps: { elicitation?: { form?: boolean } } | undefined,
  reply?: { action: string; content?: Record<string, unknown> }
): { c: WriteConfirmer; elicit: ReturnType<typeof vi.fn> } {
  const elicit = vi.fn().mockResolvedValue(reply ?? { action: 'cancel' });
  return {
    elicit,
    c: {
      getClientCapabilities: () => caps,
      elicitInput: elicit,
    },
  };
}

describe('confirmWrite', () => {
  it('fails closed by default when the client has no elicitation support', async () => {
    const { c, elicit } = confirmer({});
    const warn = vi.fn();

    const decision = await confirmWrite(c, 'subscriptions__update', warn);

    expect(decision).toEqual({ allowed: false, reason: 'no-elicitation' });
    expect(warn).not.toHaveBeenCalled();
    expect(elicit).not.toHaveBeenCalled();
  });

  it('proceeds and warns when unconfirmed writes were explicitly allowed', async () => {
    const { c, elicit } = confirmer({});
    const warn = vi.fn();

    const decision = await confirmWrite(c, 'subscriptions__update', warn, true);

    expect(decision.allowed).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(elicit).not.toHaveBeenCalled();
  });

  it('ignores allowUnconfirmed when elicitation IS available — still prompts', async () => {
    const { c, elicit } = confirmer(
      { elicitation: { form: true } },
      { action: 'accept', content: { confirm: true } }
    );

    const decision = await confirmWrite(c, 'subscriptions__update', vi.fn(), true);

    expect(decision.allowed).toBe(true);
    expect(elicit).toHaveBeenCalledTimes(1);
  });

  it('allows the write when the user accepts and checks confirm', async () => {
    const { c } = confirmer({ elicitation: { form: true } }, { action: 'accept', content: { confirm: true } });

    const decision = await confirmWrite(c, 'subscriptions__update', vi.fn());

    expect(decision.allowed).toBe(true);
  });

  it('blocks when the user accepts but leaves confirm unchecked', async () => {
    const { c } = confirmer({ elicitation: { form: true } }, { action: 'accept', content: { confirm: false } });

    const decision = await confirmWrite(c, 'subscriptions__update', vi.fn());

    expect(decision).toEqual({ allowed: false, reason: 'not confirmed' });
  });

  it('blocks and reports the action when the user declines', async () => {
    const { c } = confirmer({ elicitation: { form: true } }, { action: 'decline' });

    const decision = await confirmWrite(c, 'app_store_versions__delete', vi.fn());

    expect(decision).toEqual({ allowed: false, reason: 'decline' });
  });
});
