/**
 * Agent-experience (AX) debt audit over the generated operation set.
 *
 * AI-201, AI-177, AI-202 and AI-203 all came out of a single live attempt at
 * one goal ("set the Turkish price of Ask Quran's weekly subscription to
 * 99.99 TRY"). None of them was a code bug — `npm test` was green the whole
 * time. They only appear when a real model chases a real goal, which is why
 * they were found by hand, one at a time.
 *
 * This module turns those four failure modes into counters over all 982
 * operations, so the same class of gap is measured instead of stumbled upon.
 * Everything here is static: no credentials, no network, deterministic.
 *
 *   AXIS1 findability  — operations still carrying Apple's boilerplate summary
 *   AXIS2 silent empty — id-valued filters with no hint about their value format
 *   AXIS3 opaque confirm — reference types a write preview cannot humanise
 *   AXIS4 path length  — writes that need a lookup first, lists that cannot be narrowed
 *
 * The counts are consumed two ways: `tests/ax-audit.test.ts` ratchets them so
 * debt can shrink but never grow, and `scripts/ax-report.ts` prints them with
 * names attached so there is an answer to "what do I fix next".
 */
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';
import { REF_RESOLVERS } from '../src/core/confirm.js';
import { CURATED } from './describe.js';
import type { Operation } from '../src/core/types.js';

/**
 * Below this, a description is Apple's one-line summary ("Create a subscription
 * price.") rather than something written for a user's vocabulary. A proxy, not
 * a truth — but a stable one, and it agrees with the curated set: every entry
 * in CURATED is comfortably longer.
 */
export const BOILERPLATE_MAX_CHARS = 70;

export interface OpFinding {
  name: string;
  domain: string;
  detail: string;
}

export interface TypeFinding {
  type: string;
  /** How many write body schemas reference this type. */
  uses: number;
}

export interface AxDebt {
  totalOps: number;
  totalWrites: number;
  totalLists: number;
  /** AXIS1 — operations whose description is still Apple boilerplate. */
  boilerplate: OpFinding[];
  /** AXIS2 — id-valued filter params with neither an enum nor a format hint. */
  unhintedIdFilters: OpFinding[];
  /** AXIS3 — reference types appearing in write bodies with no REF_RESOLVERS entry. */
  unresolvedRefTypes: TypeFinding[];
  /** AXIS4 — writes that cannot be called without first fetching an id. */
  writesNeedingLookup: OpFinding[];
  /** AXIS4 — list operations that accept no `filter[*]` at all. */
  unfilterableLists: OpFinding[];
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/**
 * Apple's spec words relationship filters this way and stops there. The clause
 * has to be the END of the description for the parameter to count as unhinted:
 * the generator appends its note rather than replacing the clause, so a rule
 * that only looked for the clause counted every fixed parameter as still
 * broken. That is how this axis sat at 84 through a fix that moved 20 of them —
 * a ratchet that cannot see its own progress is not a ratchet.
 */
const ID_FILTER_HINT = /id\(s\) of related '[^']*'\s*$/i;

function isWrite(op: Operation): boolean {
  return !op.readOnly;
}

/**
 * Collects the JSON:API resource types a body schema can contain. The generator
 * emits each `{type, id}` shape with `type` pinned to a single-value enum, so
 * the type name is readable straight off the schema.
 */
function collectSchemaTypes(schema: unknown, out: Set<string>): void {
  if (!isRecord(schema)) return;

  const props = schema.properties;
  if (isRecord(props)) {
    const typeProp = props.type;
    if (isRecord(typeProp) && Array.isArray(typeProp.enum)) {
      for (const t of typeProp.enum) if (typeof t === 'string') out.add(t);
    }
    for (const sub of Object.values(props)) collectSchemaTypes(sub, out);
  }

  if (schema.items) collectSchemaTypes(schema.items, out);
  if (Array.isArray(schema.oneOf)) for (const b of schema.oneOf) collectSchemaTypes(b, out);
}

/**
 * Deprecated operations are excluded by default because the registry never
 * loads them (`includeDeprecated` defaults to false), so no agent can reach
 * them and their debt is unpayable and unfelt. Counting them inflated every
 * axis — 59 of the boilerplate findings were on tools nobody can call — and an
 * inflated denominator makes the ratchet ceilings meaningless.
 */
const LOADABLE = OPERATIONS.filter((op) => !op.deprecated);

export function auditAx(operations: readonly Operation[] = LOADABLE): AxDebt {
  const writes = operations.filter(isWrite);
  const lists = operations.filter((op) => op.readOnly && op.name.endsWith('.list'));

  // AXIS1 — a curated description is by definition not boilerplate, so the
  // curated set is excluded rather than re-measured.
  const boilerplate: OpFinding[] = operations
    .filter((op) => !CURATED[op.name] && (op.description ?? '').length < BOILERPLATE_MAX_CHARS)
    .map((op) => ({ name: op.name, domain: op.domain, detail: op.description ?? '' }));

  // AXIS2 — this is the one that produced a confidently wrong answer: sending
  // filter_territory=["TR"] returns HTTP 200 with an empty list. The correct
  // value is "TUR", and nothing in the schema says so.
  const unhintedIdFilters: OpFinding[] = [];
  for (const op of operations) {
    for (const q of op.queryParams ?? []) {
      if (!q.name.startsWith('filter[')) continue;
      if (q.enum?.length) continue; // enum-guarded filters reject bad values loudly
      if (!ID_FILTER_HINT.test(q.description ?? '')) continue;
      unhintedIdFilters.push({
        name: op.name,
        domain: op.domain,
        detail: `${q.name} — "${q.description}"`,
      });
    }
  }

  // AXIS3 — every type here shows up in a confirmation prompt as a raw id
  // unless REF_RESOLVERS knows how to name it.
  const typeUses = new Map<string, number>();
  for (const op of writes) {
    const schema = op.bodyRef ? BODY_SCHEMAS[op.bodyRef] : undefined;
    if (!schema) continue;
    const types = new Set<string>();
    collectSchemaTypes(schema, types);
    for (const t of types) typeUses.set(t, (typeUses.get(t) ?? 0) + 1);
  }
  const unresolvedRefTypes: TypeFinding[] = [...typeUses.entries()]
    .filter(([type]) => !REF_RESOLVERS[type])
    .map(([type, uses]) => ({ type, uses }))
    .sort((a, b) => b.uses - a.uses || a.type.localeCompare(b.type));

  // AXIS4 — the shape that made the pricing flow four calls long.
  const writesNeedingLookup: OpFinding[] = writes
    .filter((op) => (op.pathParams ?? []).includes('id'))
    .map((op) => ({ name: op.name, domain: op.domain, detail: op.path }));

  const unfilterableLists: OpFinding[] = lists
    .filter((op) => !(op.queryParams ?? []).some((q) => q.name.startsWith('filter[')))
    .map((op) => ({ name: op.name, domain: op.domain, detail: op.path }));

  return {
    totalOps: operations.length,
    totalWrites: writes.length,
    totalLists: lists.length,
    boilerplate,
    unhintedIdFilters,
    unresolvedRefTypes,
    writesNeedingLookup,
    unfilterableLists,
  };
}

/** Groups findings by domain, biggest first — "where is the debt concentrated". */
export function byDomain(findings: readonly OpFinding[]): Array<[domain: string, count: number]> {
  const counts = new Map<string, number>();
  for (const f of findings) counts.set(f.domain, (counts.get(f.domain) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
