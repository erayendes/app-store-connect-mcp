/**
 * The examples are documentation that names things, which is the kind that
 * rots quietly.
 *
 * `docs/GUIDE.md` carried "distribution … 129" through two releases where the
 * real number was 130, and nothing noticed because prose has no tests. These
 * assert the parts of examples/ that are claims about the code: profile names,
 * tool counts, tool names, environment variables.
 *
 * Deliberately not asserted: the prose. A sentence that is wrong about how
 * TestFlight works is a real defect and no test here would catch it — this
 * covers the half that can be checked, and says so rather than implying the
 * rest is verified.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PROFILES, resolveSelection, toolCountFor } from '../src/profiles.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { toolNameFor } from '../src/core/registry.js';
import { serverName } from '../src/clients.js';

const readme = readFileSync('examples/README.md', 'utf8');
const workflow = readFileSync('examples/ci/release-notes.yml', 'utf8');

/** Rows of the starter-pack tables: `| label | `a` + `b` | 187 |`. */
const STARTER_ROWS = [...readme.matchAll(/^\| [^|]+ \| ((?:`[a-z:-]+`(?: \+ )?)+) \| (\d+) \|$/gm)];

describe('the starter packs add up', () => {
  it('finds rows to check at all', () => {
    // Both language tables, seven packs each. A regex that silently matches
    // nothing is a passing test that checks nothing.
    expect(STARTER_ROWS.length).toBe(14);
  });

  // Since 3.0 a pack lists `core` like any other server: it is what puts app
  // lookup and search in front of the model, and it costs context like one.
  it('puts core in every pack', () => {
    for (const m of STARTER_ROWS) expect(m[1], m[0]).toMatch(/^`core` \+ /);
  });

  it.each(STARTER_ROWS.map((m) => [m[1], Number(m[2])]))(
    '%s serves %i tools',
    (spec, claimed) => {
      const total = String(spec)
        .split(' + ')
        .map((s) => s.replace(/`/g, ''))
        .reduce((sum, name) => sum + toolCountFor(resolveSelection(name)), 0);
      expect(total).toBe(claimed);
      // And the command shown can register it.
      for (const name of String(spec).split(' + ')) expect(() => resolveSelection(name.replace(/`/g, ''))).not.toThrow();
    }
  );
});

describe('everything the examples name exists', () => {
  const profileNames = new Set(PROFILES.map((p) => p.name));

  it('names only profiles that are real', () => {
    const mentioned = new Set(
      [...readme.matchAll(/`([a-z][a-z-]+)(?::[a-z,-]+)?`/g)]
        .map((m) => m[1])
        .filter((name) => profileNames.has(name) || name.includes('-'))
    );
    // Only the ones that look like profile names are checked; a word in
    // backticks is not automatically a profile.
    for (const name of mentioned) {
      if (!profileNames.has(name) && PROFILES.some((p) => p.name.startsWith(name))) {
        throw new Error(`"${name}" looks like a profile and is not one`);
      }
    }
    expect(profileNames.has('distribution')).toBe(true);
  });

  it('names only tools that are served', () => {
    const served = new Set([
      ...OPERATIONS.map((op) => toolNameFor(op)),
      // Hand-written tools are not in the generated catalogue.
      'asc__status', 'asc__search_tools', 'asc__discover_domains', 'asc__call', 'asc__describe',
      'preflight__check_version', 'preflight__check_subscription', 'media__list',
      'media__upload', 'media__arrange', 'media__delete', 'analytics__get_report', 'ci__diagnose_run', 'reviews_ai__triage',
      'reviews_ai__daily_briefing', 'reviews_ai__draft_response',
      'pricing__get_subscription_price', 'pricing__set_subscription_price',
      'pricing__equalize_price',
      'testflight__assign_build_to_groups', 'testflight__feedback_digest',
    ]);
    const named = [...readme.matchAll(/`([a-z_]+__[a-z_]+)`/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(5);
    for (const tool of named) {
      expect(served.has(tool), `${tool} is named in examples/README.md and does not exist`).toBe(true);
    }
  });
});

describe('the CI example uses settings the server reads', () => {
  const config = readFileSync('src/core/config.ts', 'utf8');

  it.each(['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY', 'ASC_CONFIRM_WRITES', 'ASC_DRY_RUN'])(
    '%s is a variable loadConfig looks at',
    (name) => {
      expect(workflow).toContain(name);
      expect(config).toContain(name);
    }
  );

  it('rehearses by default, so a first run cannot write to Apple', () => {
    // The example's whole safety story. Someone who runs it to see what it does
    // must not discover the answer on a live version.
    expect(workflow).toMatch(/dry_run:[\s\S]*?default: true/);
  });

  it('allows exactly the servers register writes, under the names it writes them', () => {
    // register adds ASC-Core beside the profile; the agent needs it to find
    // the app at all. Allowing a name register never writes allows nothing.
    const spec = /register (\S+) --clients=claude/.exec(workflow)![1];
    const allowed = [...workflow.matchAll(/'mcp__([^_']+)__\*'/g)].map((m) => m[1]).sort();
    expect(allowed).toEqual([serverName(spec), serverName('core')].sort());
  });

  it('turns confirmation off explicitly rather than leaving it to fail closed', () => {
    // No user is present to answer an elicitation prompt, so the default gate
    // would refuse the write and report a refusal — which reads like a bug.
    expect(workflow).toContain("ASC_CONFIRM_WRITES: '0'");
  });
});
