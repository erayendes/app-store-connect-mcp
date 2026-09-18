/**
 * Writes the Xcode plug-in layout: `.claude-plugin/marketplace.json` plus one
 * plug-in per profile under `plugins/<profile>/`.
 *
 * Xcode 27 installs MCP servers as plug-ins from a Git URL. A repository with a
 * single plug-in installs everything in it with no choice offered — measured:
 * a root `.mcp.json` carrying thirteen servers went in as one "1 Skill · 13
 * MCP Servers" entry and no per-server switch exists afterwards. A repository
 * with a marketplace gets a "Choose Plug-ins" sheet with a checkbox per entry,
 * which is the picker `setup` offers everywhere else. So each profile is its
 * own plug-in, and the repository root (the skill, `.claude-plugin/plugin.json`)
 * is the fourteenth.
 *
 * Generated from PROFILES so a profile cannot ship absent from Xcode or under a
 * name that differs from what `setup` registers. Run through `npm run generate`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVER_COMMAND, serverArgs, serverName } from '../src/clients.js';
import { PROFILES } from '../src/profiles.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, '.claude-plugin', 'plugin.json'), 'utf8'));
const { version, author, license, repository } = manifest;

/**
 * What Xcode prints in its plug-in list is the marketplace entry's `name`, so
 * that one is written for a person: "Heimdall | ASC App Info". The plug-in
 * manifests underneath keep the kebab-case `asc-app-info`, which is what the
 * Claude Code SDK accepts and what `setup` calls the same server elsewhere.
 */
const SPELLINGS: Record<string, string> = { testflight: 'TestFlight' };
const label = (profile: string): string =>
  SPELLINGS[profile] ??
  profile
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
const displayName = (area: string): string => `Heimdall | ASC ${area}`;

const write = (path: string, value: unknown) =>
  writeFileSync(resolve(root, path), JSON.stringify(value, null, 2) + '\n');

for (const p of PROFILES) {
  const name = serverName(p.name);
  mkdirSync(resolve(root, 'plugins', p.name, '.claude-plugin'), { recursive: true });
  write(`plugins/${p.name}/.claude-plugin/plugin.json`, {
    name,
    version,
    description: p.description,
    author,
    license,
    repository,
  });
  write(`plugins/${p.name}/.mcp.json`, {
    mcpServers: { [name]: { command: SERVER_COMMAND, args: serverArgs(p.name) } },
  });
}

write('.claude-plugin/marketplace.json', {
  name: 'heimdall',
  owner: author,
  metadata: {
    description: 'App Store Connect through Heimdall: one plug-in per area, plus the skill.',
    version,
  },
  plugins: [
    {
      name: displayName('Skill'),
      source: './',
      description:
        'The Heimdall skill: what the servers below can do, which one owns what, and how to stay ' +
        'inside the credential boundary. Install it with whichever areas you pick.',
      version,
    },
    ...PROFILES.map((p) => ({
      name: displayName(label(p.name)),
      source: `./plugins/${p.name}`,
      description: p.description,
      version,
    })),
  ],
});
