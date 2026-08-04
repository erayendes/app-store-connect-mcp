/**
 * `$defs` deduplication for tool inputSchemas — and the measurement that says
 * whether it is worth serving.
 *
 * MCP (SEP-2106, revision 2026-07-28) lets an `inputSchema` be any JSON Schema
 * 2020-12 document, so `$defs` + `$ref` are legal inside one. What it does NOT
 * have is a document-level place to put schemas shared BETWEEN tools:
 * `ListToolsResult` is `{ tools: Tool[] }`, and each `Tool.inputSchema` is its
 * own JSON Schema *resource*.
 *
 * Resource scoping is the actual blocker. A `#/$defs/...` pointer is resolved
 * against the schema resource it appears in, so it can only ever name
 * something inside the one tool carrying it — no amount of server-side
 * bookkeeping changes that. Hosting a shared block behind a URL is not an
 * escape either: SEP-2106 says implementations MUST NOT auto-dereference
 * network URIs (opt-in fetching MAY be offered, off by default), so a served
 * tool cannot depend on it resolving. A shared block is not expressible.
 *
 * That is the whole ballgame for token cost: a shape can only be factored out
 * when ONE tool repeats it, because every served tool must carry its own copy
 * of whatever it references. `hoistDefs` therefore works per tool and only
 * emits a `$def` when doing so makes that tool's serialized schema smaller.
 *
 * Nothing here is imported by the server: this is build-time tooling that
 * feeds the token report in `generate.ts`. See docs in the task report for the
 * measured numbers behind that decision.
 */

/** Rough token cost of a schema — the same estimator the rest of the repo uses. */
export function estimateTokens(value: unknown): number {
  return Math.round(JSON.stringify(value).length / 4);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Key-sorted serialization, so two structurally identical schemas that were
 * built in a different property order still compare equal.
 */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(v as object).sort()) sorted[k] = (v as any)[k];
      return sorted;
    }
    return v;
  });
}

interface Slot {
  get: () => any;
  set: (value: any) => void;
}

/**
 * Every position below `root` that holds a subschema. Walk order is fixed
 * (properties in declaration order, then items, then the composition
 * keywords) so repeated runs see candidates in the same sequence.
 */
function subschemaSlots(root: any): Slot[] {
  const slots: Slot[] = [];

  const visit = (node: any): void => {
    if (!node || typeof node !== 'object') return;

    const push = (owner: any, key: string | number): void => {
      slots.push({ get: () => owner[key], set: (v) => (owner[key] = v) });
      visit(owner[key]);
    };

    if (node.properties && typeof node.properties === 'object') {
      for (const key of Object.keys(node.properties)) push(node.properties, key);
    }
    if (node.items && typeof node.items === 'object') push(node, 'items');
    for (const keyword of ['oneOf', 'anyOf', 'allOf'] as const) {
      if (Array.isArray(node[keyword])) {
        for (let i = 0; i < node[keyword].length; i++) push(node[keyword], i);
      }
    }
  };

  visit(root);
  return slots;
}

const refTo = (name: string): string => `{"$ref":"#/$defs/${name}"}`;

export interface HoistResult {
  /** The schema with repeated shapes replaced by `$ref`. */
  schema: Record<string, unknown>;
  /** Definitions the schema references. Empty when nothing was worth hoisting. */
  defs: Record<string, unknown>;
}

/**
 * Greedy factoring over a set of schemas that all share ONE `$defs` block,
 * largest genuine saving first.
 *
 * A candidate is only taken when it shrinks the serialized output, overheads
 * included: the definition itself is still paid for once, each site costs a
 * `$ref` object, and the first definition also pays for the `"$defs":{}`
 * wrapper. Indirection without reuse is pure cost, so a shape used once never
 * qualifies and small shapes rarely do.
 *
 * The loop re-scans after every hoist, which is what lets a definition
 * reference an earlier one (the `$defs` block is searched alongside the
 * schemas). Cycles are impossible: a hoisted shape is always a strict subtree
 * of anything that still contains it.
 *
 * Mutates `roots` in place.
 */
function greedyHoist(roots: any[]): Record<string, unknown> {
  const defs: Record<string, unknown> = {};
  let next = 0;

  for (;;) {
    const buckets = new Map<string, { size: number; slots: Slot[] }>();
    for (const root of [...roots, ...Object.values(defs)]) {
      for (const slot of subschemaSlots(root)) {
        const node = slot.get();
        if (!node || typeof node !== 'object' || Array.isArray(node)) continue;
        if (node.$ref) continue; // already factored out
        const key = canonical(node);
        let bucket = buckets.get(key);
        if (!bucket) buckets.set(key, (bucket = { size: JSON.stringify(node).length, slots: [] }));
        bucket.slots.push(slot);
      }
    }

    const name = `d${next}`;
    const perSite = refTo(name).length;
    // `"dN":` plus either the `,"$defs":{}` wrapper or a separating comma.
    const bookkeeping = name.length + 3 + (next === 0 ? 11 : 1);

    let best: { key: string; saving: number; slots: Slot[] } | undefined;
    for (const [key, bucket] of buckets) {
      const uses = bucket.slots.length;
      if (uses < 2) continue;
      const saving = uses * bucket.size - bucket.size - uses * perSite - bookkeeping;
      if (saving <= 0) continue;
      // Ties break on the canonical key so the result never depends on the
      // order Map happened to see the candidates in.
      if (!best || saving > best.saving || (saving === best.saving && key < best.key)) {
        best = { key, saving, slots: bucket.slots };
      }
    }
    if (!best) break;

    defs[name] = clone(best.slots[0].get());
    for (const slot of best.slots) slot.set({ $ref: `#/$defs/${name}` });
    next++;
  }

  return defs;
}

/**
 * Factors shapes that appear more than once inside a SINGLE schema into
 * `$defs`. This is the only form MCP can actually serve — see the note at the
 * top of the file.
 */
export function hoistDefs(input: unknown): HoistResult {
  const schema = clone(input) as Record<string, unknown>;
  const defs = greedyHoist([schema]);
  return { schema, defs };
}

/**
 * Tokens a single `$defs` block shared by every schema in `inputSchemas` would
 * save. This is the number the whole idea was worth on paper — and it is NOT
 * achievable, because MCP gives each tool its own schema resource. Recomputed
 * on every build so a future Apple spec that changes the arithmetic shows up
 * in the report instead of being assumed away.
 */
export function sharedDefsCeiling(inputSchemas: unknown[]): number {
  const roots: any[] = inputSchemas.map((s) => clone(s));
  const chars = (): number =>
    roots.reduce<number>((sum, root) => sum + JSON.stringify(root).length, 0);

  const before = chars();
  const defs = greedyHoist(roots);
  const after = chars() + (Object.keys(defs).length ? JSON.stringify(defs).length : 0);
  return Math.round((before - after) / 4);
}

/**
 * Inverse of `hoistDefs`: replaces every `#/$defs/...` reference with the shape
 * it points at, yielding the fully inlined schema again. Keywords sitting
 * beside a `$ref` (legal in 2020-12) win over the definition's own, matching
 * how a validator would apply them.
 */
export function expandDefs(schema: unknown, defs: Record<string, unknown>): unknown {
  const walk = (node: any, depth: number): any => {
    if (depth > 100) throw new Error('$ref expansion exceeded 100 levels — cyclic $defs?');
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map((item) => walk(item, depth + 1));

    if (typeof node.$ref === 'string') {
      if (!node.$ref.startsWith('#/$defs/')) {
        throw new Error(`Unsupported $ref "${node.$ref}" — only #/$defs/ is emitted.`);
      }
      const key = node.$ref.slice('#/$defs/'.length);
      if (!(key in defs)) throw new Error(`Dangling $ref "${node.$ref}".`);
      const { $ref: _ref, ...siblings } = node;
      return { ...walk(clone(defs[key]), depth + 1), ...siblings };
    }

    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) out[key] = walk(value, depth + 1);
    return out;
  };

  return walk(clone(schema), 0);
}

/** What a single tool schema would cost served inline vs. served with `$defs`. */
export interface SchemaSizes {
  inlineTokens: number;
  defsTokens: number;
  defCount: number;
}

export function measureSchema(inputSchema: unknown): SchemaSizes {
  const { schema, defs } = hoistDefs(inputSchema);
  const defCount = Object.keys(defs).length;
  const served = defCount ? { ...schema, $defs: defs } : schema;
  return {
    inlineTokens: estimateTokens(inputSchema),
    defsTokens: estimateTokens(served),
    defCount,
  };
}
