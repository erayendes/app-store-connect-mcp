import { describe, it, expect } from 'vitest';
import { ListToolsResultSchema, ToolSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  hoistDefs,
  expandDefs,
  measureSchema,
  estimateTokens,
  sharedDefsCeiling,
} from '../scripts/schema-defs.js';
import { toMcpTool } from '../src/core/registry.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';

const schemaFor = (name: string): unknown =>
  toMcpTool(OPERATIONS.find((o) => o.name === name)!).inputSchema;

/** Key-sorted serialization, so property order never decides equality. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_k, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(v as object).sort()) sorted[k] = (v as any)[k];
      return sorted;
    }
    return v;
  });
}

function refsIn(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== 'object') return found;
  if (Array.isArray(node)) {
    for (const item of node) refsIn(item, found);
    return found;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === '$ref' && typeof value === 'string') found.push(value);
    else refsIn(value, found);
  }
  return found;
}

describe('$defs hoisting', () => {
  it('expands back to the exact inline schema for every generated tool', () => {
    // The property that makes the two forms interchangeable: whatever a client
    // that resolves $ref sees must be byte-for-byte what an inlining client
    // sees. Checked across all 982 operations rather than a sample, because
    // the shapes that repeat are exactly the unusual ones.
    for (const op of OPERATIONS) {
      const inline = toMcpTool(op).inputSchema;
      const { schema, defs } = hoistDefs(inline);
      expect(canonical(expandDefs(schema, defs)), op.name).toBe(canonical(inline));
    }
  });

  it('leaves no dangling $ref behind', () => {
    for (const op of OPERATIONS) {
      const { schema, defs } = hoistDefs(toMcpTool(op).inputSchema);
      for (const ref of refsIn(schema).concat(refsIn(defs))) {
        expect(ref.startsWith('#/$defs/'), `${op.name}: ${ref}`).toBe(true);
        expect(defs, `${op.name}: ${ref}`).toHaveProperty(ref.slice('#/$defs/'.length));
      }
    }
  });

  it('is deterministic — same schema in, byte-identical output out', () => {
    // CI regenerates and diffs src/generated/, so a hoister whose result
    // depended on Map iteration order would produce phantom drift.
    for (const name of ['ci_workflows.create', 'subscriptions.update', 'app_infos.update']) {
      const inline = schemaFor(name);
      const first = hoistDefs(inline);
      const second = hoistDefs(inline);
      expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    }
  });

  it('never makes a schema larger', () => {
    // Indirection without reuse is pure cost, so a shape used once must stay
    // inline. If this ever fails the saving arithmetic has a sign error.
    for (const op of OPERATIONS) {
      const sizes = measureSchema(toMcpTool(op).inputSchema);
      expect(sizes.defsTokens, op.name).toBeLessThanOrEqual(sizes.inlineTokens);
      if (sizes.defCount === 0) expect(sizes.defsTokens, op.name).toBe(sizes.inlineTokens);
    }
  });

  it('keeps keywords sitting beside a $ref', () => {
    // JSON Schema 2020-12 applies $ref siblings; the expander has to agree
    // with a validator about which one wins.
    const expanded = expandDefs(
      { type: 'object', properties: { a: { $ref: '#/$defs/d0', description: 'mine' } } },
      { d0: { type: 'string', description: 'theirs', enum: ['x'] } }
    ) as any;
    expect(expanded.properties.a).toEqual({ type: 'string', description: 'mine', enum: ['x'] });
  });

  it('refuses a dangling reference instead of dropping it', () => {
    expect(() => expandDefs({ $ref: '#/$defs/nope' }, {})).toThrow(/Dangling/);
  });
});

/**
 * Decision tripwires, in the style of tests/ax-audit.test.ts's ratchets.
 *
 * `$defs` was investigated as a way to stop repeating shared shapes across the
 * 982 generated tools, and is NOT served. Two independent facts hold that
 * decision up, so each gets its own tripwire — the first is the load-bearing
 * one, and it is a fact about MCP, not about Apple's spec:
 *
 *   1. MCP cannot express a shared block. Every tool's inputSchema is its own
 *      JSON Schema resource, so `#/$defs/...` resolves only inside the tool
 *      carrying it. This is what makes the ~26.6% ceiling unreachable.
 *   2. What survives — duplication inside a SINGLE tool's schema — is ~1.9%,
 *      too little to justify a second serving mode.
 *
 * Fact 1 is the one that could change without anything in this repo changing,
 * and it is the change that would make the whole idea worth revisiting.
 *
 * BASELINES BELOW ARE DATED. They were last calibrated on 2026-08-04, after
 * 5a7cccd shortened the `id` and `next_url` descriptions. That commit moved
 * both percentages without touching a single shape: it cut ~11.6k tokens of
 * repeated prose, so the denominator fell from 156,986 to 145,400 tokens. The
 * self-contained saving is still the same 2,756 absolute tokens it always was,
 * and every corpus change since has moved them again — the fields[...] params,
 * then the `id` description AI-217 put back.
 * Recalibrate these baselines whenever the corpus moves —
 * a stale one turns a 0.3pp nudge into what looks like a 5pp collapse and
 * sends the investigation somewhere it should not go.
 */
describe('$defs decision tripwires', () => {
  it('MCP still has no document-level schema container', () => {
    // If a future SDK adds a shared-defs slot to the tools/list result, the
    // ~26.6% ceiling stops being hypothetical and this decision must be
    // re-read. Any new key here needs checking for that; it is not
    // automatically benign.
    const result = ListToolsResultSchema as unknown as { shape: Record<string, unknown> };
    expect(Object.keys(result.shape).sort()).toEqual(['_meta', 'nextCursor', 'tools']);

    // `tools` is a flat array of self-contained Tool objects — not a keyed
    // container that could grow a sibling `$defs`.
    const tools = result.shape.tools as any;
    expect(tools.constructor.name).toBe('ZodArray');
    const tool = ToolSchema as unknown as { shape: Record<string, unknown> };
    expect(Object.keys(tool.shape).sort()).toEqual([
      '_meta',
      'annotations',
      'description',
      'execution',
      'icons',
      'inputSchema',
      'name',
      'outputSchema',
      'title',
    ]);
    expect(Object.keys((tools.element as any).shape).sort()).toEqual(
      Object.keys(tool.shape).sort()
    );
  });

  it('gives a stray top-level $defs no meaning, and every ref to it dangles', () => {
    // The trap, made explicit. The SDK's result schema is LOOSE, so a $defs
    // sibling does ride along on the wire — which is why "it transmits fine"
    // is not evidence that it works. It is outside the Result contract (see
    // the shape pin above) and, decisively, outside every inputSchema's JSON
    // Schema resource. A tool pointing at it is pointing at nothing.
    const parsed = ListToolsResultSchema.parse({
      $defs: { shared: { type: 'string' } },
      tools: [
        {
          name: 'a',
          inputSchema: {
            type: 'object',
            properties: { a: { $ref: '#/$defs/shared' } },
          },
        },
      ],
    });

    expect(parsed).toHaveProperty('$defs'); // carried...
    expect(Object.keys((ListToolsResultSchema as any).shape)).not.toContain('$defs'); // ...but unmeant

    // Resolved within the tool's own resource — the only scope a client uses —
    // the reference has nothing to point at.
    const inputSchema = (parsed.tools as any[])[0].inputSchema;
    expect(() => expandDefs(inputSchema, {})).toThrow(/Dangling/);
  });

  it('pins the unreachable shared-$defs ceiling', () => {
    // Baseline at last calibration (2026-08-05, post AI-217): 31.2%.
    // Drift in EITHER direction means the corpus changed enough that the
    // trade-off deserves a fresh look — a collapse would mean there is nothing
    // left to want, a jump means the prize grew.
    //
    // Note the floor sits only ~0.6pp below the current value: another pass of
    // description shortening shrinks the denominator again and could trip this
    // without the duplication itself having changed. If that is why it fired,
    // recalibrate the baseline rather than reopening the decision.
    const byDomain = new Map<string, unknown[]>();
    for (const op of OPERATIONS) {
      const list = byDomain.get(op.domain) ?? [];
      list.push(toMcpTool(op).inputSchema);
      byDomain.set(op.domain, list);
    }
    let inline = 0;
    let ceiling = 0;
    for (const [, schemas] of byDomain) {
      inline += schemas.reduce<number>((sum, s) => sum + estimateTokens(s), 0);
      ceiling += sharedDefsCeiling(schemas);
    }
    const pct = (ceiling / inline) * 100;
    const message =
      `shared-$defs ceiling is now ${pct.toFixed(2)}% of schema tokens ` +
      `(baseline at last calibration, post AI-217: 31.2%)`;
    expect(pct, message).toBeGreaterThan(26);
    expect(pct, message).toBeLessThan(36);
  });

  it('pins the achievable self-contained saving', () => {
    // Baseline at last calibration (2026-08-05, post AI-217): 1.42%.
    //
    // The band's top is set where the number can actually reach it, which the
    // original 10% threshold was not. Measured on this corpus on 2026-08-04,
    // greedy intra-tool exact dedup with every overhead forced to zero — no
    // $ref cost, no $defs bookkeeping, physically unattainable but it bounds
    // the whole family — tops out at 6.46%. So 3% is reachable and 10% is not.
    let inline = 0;
    let withDefs = 0;
    for (const op of OPERATIONS) {
      const sizes = measureSchema(toMcpTool(op).inputSchema);
      inline += sizes.inlineTokens;
      withDefs += sizes.defsTokens;
    }
    const pct = ((inline - withDefs) / inline) * 100;
    const message =
      `self-contained $defs would now save ${pct.toFixed(2)}% of schema tokens ` +
      `(baseline at last calibration, post AI-217: 1.42%)`;
    expect(pct, message).toBeGreaterThan(1.2);
    expect(pct, message).toBeLessThan(3);
  });

  it('estimates tokens the way the rest of the repo does', () => {
    expect(estimateTokens({ a: 1 })).toBe(Math.round(JSON.stringify({ a: 1 }).length / 4));
  });
});

// validateBody (src/core/validate.ts) has no handling for $ref, $defs, or allOf:
// a schema node carrying only those keys produces zero errors, so a bad write
// body would silently pass validation. BODY_SCHEMAS must stay self-contained.
const FORBIDDEN = ['$ref', '$defs', 'allOf'];

function findForbidden(node: unknown, path: string, hits: string[]): void {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => findForbidden(item, `${path}[${i}]`, hits));
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (FORBIDDEN.includes(key)) hits.push(`${path}.${key}`);
    findForbidden(value, `${path}.${key}`, hits);
  }
}

describe('BODY_SCHEMAS stay self-contained', () => {
  it('contains no $ref, $defs, or allOf at any depth', () => {
    const hits: string[] = [];
    for (const [name, schema] of Object.entries(BODY_SCHEMAS)) {
      findForbidden(schema, name, hits);
    }
    expect(hits, [
      'validateBody in src/core/validate.ts cannot validate through $ref/$defs/allOf:',
      'such nodes produce zero errors and bad write bodies silently pass.',
      'Teach validate.ts these keywords (or inline them in scripts/generate.ts) before emitting them.',
      `Found at: ${hits.join(', ')}`,
    ].join(' ')).toEqual([]);
  });
});
