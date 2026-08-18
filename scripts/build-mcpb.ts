/**
 * Builds the .mcpb bundle — Heimdall as one file a person double-clicks.
 *
 * Two registries exist and only one of them is `~/.claude.json`. Profiles added
 * there work, and they do not appear in the Claude app's Connectors menu, which
 * is fed by MCPB bundles and remote connectors instead. This is what puts
 * Heimdall in that menu, with the credentials collected by a form rather than
 * by a terminal.
 *
 * Everything is inlined by esbuild, dependencies included, so the bundle has no
 * node_modules and needs no npx at run time. `package.json` and `skills/` are
 * copied beside it because two modules resolve them relative to themselves:
 * `VERSION` in server.ts and the packaged SKILL.md in skill.ts.
 *
 * One bundle serves one profile — that is an MCPB constraint, not a choice.
 * A person who wants two areas installs it twice, which is why the profile is
 * install-time configuration rather than something baked in here.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROFILES } from '../src/profiles.js';

/** Hand-written and version-controlled. Nothing writes back to it. */
const SOURCE = 'mcpb/manifest.json';
/** Staging: assembled fresh every run, ignored by git. */
const OUT = 'dist-mcpb/bundle';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// The manifest is the one file that is hand-written and version-controlled, so
// the version in it is a placeholder rather than a number to keep in step with
// package.json by hand — that is the drift the release pre-flight exists for.
const manifest = JSON.parse(readFileSync(SOURCE, 'utf8'));
manifest.version = pkg.version;

// MCPB's user_config has no enum, so the choice is a free-text field and the
// valid values have to be in the prose. Generated from the code rather than
// typed, because a profile renamed here and not there is an installer offering
// something that no longer exists.
manifest.user_config.profile.description =
  `${manifest.user_config.profile.description} One of: ${PROFILES.map((p) => p.name).join(', ')}. ` +
  `Narrow further with a colon, e.g. monetization:subscription-pricing.`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'server'), { recursive: true });

execFileSync(
  'npx',
  [
    'esbuild',
    'src/index.ts',
    '--bundle',
    '--platform=node',
    '--format=esm',
    '--target=node20',
    `--outfile=${join(OUT, 'server', 'index.js')}`,
    // esbuild's ESM output keeps `require` calls from CommonJS dependencies,
    // and ESM has no `require`. Without this the bundle throws on first import.
    "--banner:js=import{createRequire as __mcpbRequire}from'node:module';const require=__mcpbRequire(import.meta.url);",
  ],
  { stdio: 'inherit' }
);

cpSync('skills', join(OUT, 'skills'), { recursive: true });
// Only the fields the bundle actually reads. Shipping the whole file would put
// devDependencies and scripts in front of anyone who opens the bundle.
writeFileSync(
  join(OUT, 'package.json'),
  `${JSON.stringify({ name: pkg.name, version: pkg.version, type: pkg.type, license: pkg.license }, null, 2)}\n`
);
writeFileSync(join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const mcpb = (...args: string[]) =>
  execFileSync('npx', ['--yes', '@anthropic-ai/mcpb', ...args], { stdio: 'inherit' });

mcpb('validate', join(OUT, 'manifest.json'));
mcpb('pack', OUT, `dist-mcpb/heimdall-asc-${pkg.version}.mcpb`);

// Unsigned on purpose. `mcpb sign` wants a code-signing certificate, and an
// unsigned bundle installs with a warning rather than not at all — a warning
// that says what is true.
console.log(`\ndist-mcpb/heimdall-asc-${pkg.version}.mcpb — drag it onto Claude to install.`);
