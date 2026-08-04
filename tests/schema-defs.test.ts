import { describe, it, expect } from 'vitest';
import { hoistDefs, expandDefs, measureSchema, estimateTokens } from '../scripts/schema-defs.js';
import { toMcpTool } from '../src/core/registry.js';
import { OPERATIONS } from '../src/generated/operations.js';

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

describe('$defs token budget', () => {
  /**
   * Decision tripwire, in the style of tests/ax-audit.ts's ratchets.
   *
   * `$defs` was investigated as a way to stop repeating shared shapes across
   * the 982 generated tools. It is not served, because MCP gives every tool
   * its own schema resource: a `#/$defs/...` pointer only resolves inside the
   * tool carrying it, so each served tool must embed its own copy and nothing
   * is shared. What survives is the duplication INSIDE one tool's schema,
   * measured at ~1.8% of inputSchema tokens and concentrated in a handful of
   * Xcode Cloud and app-info bodies — too little to justify a second serving
   * mode.
   *
   * If a future Apple spec pushes that past 10%, this fails and the decision
   * is worth re-reading rather than inheriting. `npm run generate` prints the
   * current figure per domain.
   */
  it('stays too small to be worth a second serving mode', () => {
    let inline = 0;
    let withDefs = 0;
    for (const op of OPERATIONS) {
      const sizes = measureSchema(toMcpTool(op).inputSchema);
      inline += sizes.inlineTokens;
      withDefs += sizes.defsTokens;
    }
    const pct = ((inline - withDefs) / inline) * 100;
    expect(pct, `self-contained $defs would now save ${pct.toFixed(2)}% of schema tokens`)
      .toBeLessThan(10);
  });

  it('estimates tokens the way the rest of the repo does', () => {
    expect(estimateTokens({ a: 1 })).toBe(Math.round(JSON.stringify({ a: 1 }).length / 4));
  });
});
