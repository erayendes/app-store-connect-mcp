import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { transformSync } from 'esbuild';
import { describe, expect, it } from 'vitest';
import { SERVER_COMMAND, profileLabel, serverName } from '../src/clients.js';
import { CORE_PROFILE, PROFILES } from '../src/profiles.js';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const marketplace = JSON.parse(readFileSync('.claude-plugin/marketplace.json', 'utf8'));
const entries: { name: string; source: string; version: string }[] = marketplace.plugins;

// What `claude plugin validate` and the Claude directory accept for a plug-in
// name: lowercase words joined by hyphens, and no word that only says what the
// thing is. A space is a hard error in the validator.
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const GENERIC_WORDS = ['mcp', 'plugin', 'claude'];
// Manifest fields the validator knows. A field outside this list is at best
// ignored and at worst rejected, so a new one is added here on purpose.
const MANIFEST_FIELDS = ['name', 'displayName', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'privacyPolicyUrl', 'keywords'];
const ENTRY_FIELDS = ['name', 'source', 'description', 'version'];

describe('plugin generation', () => {
  it.each(['8.7.6', '8.7.6-beta.12'])('regenerates every version from package.json at %s', (release) => {
    // Run the real generator against an in-memory output filesystem. The root
    // manifest deliberately retains its old version, as it does on a bump.
    const files = new Map<string, string | Buffer>();
    const require = createRequire(import.meta.url);
    const source = readFileSync('scripts/generate-xcode-plugins.ts', 'utf8')
      .replaceAll('import.meta.url', JSON.stringify(new URL('../scripts/generate-xcode-plugins.ts', import.meta.url).href));
    const { code } = transformSync(source, { loader: 'ts', format: 'cjs' });
    runInNewContext(code, {
      exports: {},
      require: (id: string) => {
        if (id === 'node:fs') return {
          readFileSync: (path: string, encoding: BufferEncoding) => path === resolve('package.json')
            ? JSON.stringify({ version: release }) : readFileSync(path, encoding),
          mkdirSync: () => {},
          rmSync: () => {},
          writeFileSync: (path: string, value: string) => files.set(path, value),
          copyFileSync: (from: string, to: string) => files.set(to, readFileSync(from)),
        };
        if (id === '../src/clients.js') return { SERVER_COMMAND, profileLabel, serverName };
        if (id === '../src/profiles.js') return { CORE_PROFILE, PROFILES };
        return require(id);
      },
    });
    const json = (path: string) => JSON.parse(String(files.get(resolve(path))));
    const generatedMarketplace = json('.claude-plugin/marketplace.json');
    expect(generatedMarketplace.metadata.version).toBe(release);
    expect(json('.claude-plugin/plugin.json').version).toBe(release);
    for (const entry of generatedMarketplace.plugins) {
      expect(entry.version).toBe(release);
      const committed = JSON.parse(readFileSync(join(entry.source, '.claude-plugin/plugin.json'), 'utf8'));
      expect(json(`${entry.source}/.claude-plugin/plugin.json`)).toEqual({ ...committed, version: release });
    }
    for (const profile of PROFILES.filter((p) => p.name !== CORE_PROFILE)) {
      const path = `plugins/${profile.name}`;
      expect(json(`${path}/.mcp.json`).mcpServers[serverName(profile.name)].args).toEqual([
        '-y', `@erayendes/asc-mcp@${release}`, profile.name, '--with-core',
      ]);
      // The README names the pinned version, so compare against the committed
      // copy with that one string moved to the release under test.
      expect(files.get(resolve(path, 'README.md'))).toBe(
        readFileSync(`${path}/README.md`, 'utf8').replaceAll(`@erayendes/asc-mcp@${version}`, `@erayendes/asc-mcp@${release}`),
      );
    }
    expect(files.get(resolve('plugins/skill/README.md'))).toBe(readFileSync('plugins/skill/README.md', 'utf8'));
    expect(generatedMarketplace).toEqual({
      ...marketplace,
      metadata: { ...marketplace.metadata, version: release },
      plugins: marketplace.plugins.map((entry: object) => ({ ...entry, version: release })),
    });
    expect(files.get(resolve('plugins/skill/skills/heimdall/SKILL.md'))).toEqual(readFileSync('skills/heimdall/SKILL.md'));
  });
});

describe('directory plugin bundles', () => {
  it('ships the listing icon in every plugin, since the directory takes it only on the first save', () => {
    const icon = readFileSync('assets/brand/heimdall-icon-square.png');
    for (const dir of readdirSync('plugins')) {
      expect(readFileSync(join('plugins', dir, '.claude-plugin', 'icon.png')).equals(icon), dir).toBe(true);
    }
  });

  it('sources every plugin from its own folder, never the repository root', () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((entry) => entry.source)).size).toBe(entries.length);
    expect(entries.map((entry) => entry.source.slice('./plugins/'.length)).sort()).toEqual(readdirSync('plugins').sort());
    for (const entry of entries) {
      expect(entry.source).toMatch(/^\.\/plugins\/[a-z-]+$/);
      expect(resolve(entry.source)).not.toBe(resolve('.'));
    }
  });

  it('names every plugin the way the validator and the directory accept', () => {
    expect(marketplace.name).toMatch(KEBAB);
    expect(marketplace.owner.name).toBeTruthy();
    expect(marketplace.metadata.description).toBeTruthy();
    expect(new Set(entries.map((entry) => entry.name)).size).toBe(entries.length);
    for (const entry of entries) {
      expect(Object.keys(entry).filter((key) => !ENTRY_FIELDS.includes(key)), entry.name).toEqual([]);
      const manifest = JSON.parse(readFileSync(join(entry.source, '.claude-plugin/plugin.json'), 'utf8'));
      expect(Object.keys(manifest).filter((key) => !MANIFEST_FIELDS.includes(key)), entry.source).toEqual([]);
      // The entry is what users install by, the manifest what loads; one name.
      expect(entry.name, entry.source).toBe(manifest.name);
      expect(manifest.name).toMatch(KEBAB);
      expect(manifest.name.split('-').filter((word: string) => GENERIC_WORDS.includes(word)), manifest.name).toEqual([]);
      expect(manifest.description, entry.source).toBeTruthy();
      expect(entry.description, entry.source).toBeTruthy();
      expect(manifest.author?.name, entry.source).toBeTruthy();
      expect(manifest.license, entry.source).toBe('MIT');
    }
  });

  it('shows in each README the exact command its .mcp.json runs', () => {
    for (const entry of entries) {
      if (!readdirSync(entry.source).includes('.mcp.json')) continue;
      const readme = readFileSync(join(entry.source, 'README.md'), 'utf8');
      const { mcpServers } = JSON.parse(readFileSync(join(entry.source, '.mcp.json'), 'utf8'));
      for (const server of Object.values(mcpServers) as { command: string; args: string[] }[]) {
        expect(readme, entry.source).toContain([server.command, ...server.args].join(' '));
      }
      // Only `setup` may go unpinned: it writes credentials, not a server entry.
      for (const line of readme.split('\n').filter((l) => l.startsWith('npx '))) {
        if (!line.endsWith(' setup')) expect(line, entry.source).toContain(`@erayendes/asc-mcp@${version} `);
      }
    }
  });

  it.each(entries)('carries no key material or credential settings in $source', (entry) => {
    const visit = (path: string): string[] => lstatSync(path).isDirectory()
      ? readdirSync(path).flatMap((child) => visit(join(path, child)))
      : [path];
    for (const file of visit(resolve(entry.source))) {
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toMatch(/-----BEGIN [A-Z ]*PRIVATE KEY-----/);
      expect(file.endsWith('.p8'), file).toBe(false);
      if (file.endsWith('.json')) expect(text, file).not.toMatch(/"(env|envFile)"|ASC_(KEY|ISSUER|PRIVATE)/);
    }
  });

  it('pins every server and manifest to the exact package version, including prereleases', () => {
    expect(marketplace.metadata.version).toBe(version);
    expect(JSON.parse(readFileSync('.claude-plugin/plugin.json', 'utf8')).version).toBe(version);
    let servers = 0;
    for (const entry of entries) {
      expect(entry.version, entry.name).toBe(version);
      const manifest = JSON.parse(readFileSync(join(entry.source, '.claude-plugin/plugin.json'), 'utf8'));
      expect(manifest.version, entry.source).toBe(version);
      if (!readdirSync(entry.source).includes('.mcp.json')) continue;
      const { mcpServers } = JSON.parse(readFileSync(join(entry.source, '.mcp.json'), 'utf8'));
      for (const server of Object.values(mcpServers) as { command: string; args: string[] }[]) {
        expect(server.command).toBe('npx');
        expect(server.args.slice(0, 2)).toEqual(['-y', `@erayendes/asc-mcp@${version}`]);
        servers++;
      }
    }
    expect(servers).toBe(entries.length - 1);
  });

  it.each(entries)('keeps $source self-contained, without symlinks or oversized files', (entry) => {
    const root = resolve(entry.source);
    const visit = (path: string) => {
      const local = relative(root, path);
      expect(isAbsolute(local) || local.split(/[\\/]/).includes('..'), path).toBe(false);
      const stat = lstatSync(path);
      expect(stat.isSymbolicLink(), path).toBe(false);
      if (stat.isDirectory()) {
        for (const child of readdirSync(path)) visit(join(path, child));
      } else {
        expect(stat.isFile(), path).toBe(true);
        expect(stat.size, path).toBeLessThanOrEqual(256 * 1024);
      }
    };
    visit(root);
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme.trim().split(/\s+/).length).toBeGreaterThanOrEqual(40);

    const manifest = JSON.parse(readFileSync(join(root, '.claude-plugin/plugin.json'), 'utf8'));
    // Default discovery keeps skills and MCP configuration inside the bundle;
    // adding a custom path needs an explicit containment check here.
    for (const field of ['skills', 'mcpServers', 'commands', 'agents', 'hooks', 'outputStyles']) {
      expect(manifest[field], `${entry.source}: ${field}`).toBeUndefined();
    }
  });
});
