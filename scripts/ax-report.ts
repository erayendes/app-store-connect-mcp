/**
 * Human-readable agent-experience debt report.
 *
 *   npm run ax:report            summary + worst offenders per axis
 *   npm run ax:report -- --full  every finding, for piping into a fix session
 *
 * The ratchet in `tests/ax-audit.test.ts` says whether debt grew. This says
 * where it is, so "what should I curate next" has an answer that is not a
 * guess. Static and offline — no credentials, no network.
 */
import { auditAx, byDomain, type OpFinding } from './ax-audit.js';
import { REF_RESOLVERS } from '../src/core/confirm.js';

const full = process.argv.includes('--full');
const TOP = full ? Number.POSITIVE_INFINITY : 8;

const debt = auditAx();
const pct = (n: number, of: number) => `${Math.round((n / of) * 100)}%`;

function section(title: string, headline: string, why: string): void {
  console.log(`\n\x1b[1m${title}\x1b[0m  ${headline}`);
  console.log(`  ${why}`);
}

function listOps(findings: readonly OpFinding[], render: (f: OpFinding) => string): void {
  const shown = findings.slice(0, TOP);
  for (const f of shown) console.log(`    ${render(f)}`);
  if (findings.length > shown.length) {
    console.log(`    … ${findings.length - shown.length} more (--full to list)`);
  }
}

console.log(
  `\n\x1b[1mAgent-experience debt\x1b[0m — ${debt.totalOps} operations ` +
    `(${debt.totalWrites} writes, ${debt.totalLists} lists)`
);
console.log(
  'Four axes, from the four issues one live price change produced: ' +
    'AI-201 findability, AI-177 payload, AI-202 confirmation, AI-203 path length.'
);

section(
  'AXIS1 findability',
  `${debt.boilerplate.length}/${debt.totalOps} (${pct(debt.boilerplate.length, debt.totalOps)}) still on Apple's summary`,
  'A model matches intent against these strings. Apple\'s words are not the user\'s words.'
);
console.log('  worst domains: ' + byDomain(debt.boilerplate).slice(0, 6).map(([d, c]) => `${d} ${c}`).join(' · '));
listOps(debt.boilerplate, (f) => `${f.name}  —  "${f.detail}"`);

section(
  'AXIS2 silent empty results',
  `${debt.unhintedIdFilters.length} id-valued filter params with no format hint`,
  'A wrong value here returns HTTP 200 and an empty list — measured live: ' +
    'filter_territory="TR" gives nothing, "TUR" gives data, and nothing says why.'
);
listOps(debt.unhintedIdFilters, (f) => `${f.name}  ${f.detail}`);

section(
  'AXIS3 opaque confirmations',
  `${debt.unresolvedRefTypes.length} reference types unresolved ` +
    `(REF_RESOLVERS covers ${Object.keys(REF_RESOLVERS).length})`,
  'Each one shows up in a write confirmation as a raw id, so the user approves ' +
    'a change they cannot read.'
);
const refs = debt.unresolvedRefTypes.slice(0, TOP);
for (const t of refs) console.log(`    ${t.type}  (in ${t.uses} write bodies)`);
if (debt.unresolvedRefTypes.length > refs.length) {
  console.log(`    … ${debt.unresolvedRefTypes.length - refs.length} more (--full to list)`);
}

section(
  'AXIS4 path length',
  `${debt.writesNeedingLookup.length}/${debt.totalWrites} writes need an id first · ` +
    `${debt.unfilterableLists.length}/${debt.totalLists} lists accept no filter`,
  'Every lookup is a round trip a single-call competitor does not pay. ' +
    'An unfilterable list cannot be narrowed when it comes back too big.'
);
console.log('  lists that cannot be narrowed:');
listOps(debt.unfilterableLists, (f) => `${f.name}  ${f.detail}`);

console.log(
  `\nRatchet ceilings live in tests/ax-audit.test.ts. ` +
    `If a number above dropped, lower the ceiling to lock the win in.\n`
);
