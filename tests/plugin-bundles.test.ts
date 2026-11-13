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
      expect(json(`${entry.source}/.claude-plugin/plugin.json`).version).toBe(release);
    }
    for (const profile of PROFILES.filter((p) => p.name !== CORE_PROFILE)) {
      const path = `plugins/${profile.name}`;
      expect(json(`${path}/.mcp.json`).mcpServers[serverName(profile.name)].args).toEqual([
        '-y', `@erayendes/asc-mcp@${release}`, profile.name, '--with-core',
      ]);
      expect(files.get(resolve(path, 'README.md'))).toBe(readFileSync(`${path}/README.md`, 'utf8'));
    }
    expect(files.get(resolve('plugins/skill/skills/heimdall/SKILL.md'))).toEqual(readFileSync('skills/heimdall/SKILL.md'));
  });
});

describe('directory plugin bundles', () => {
  it('sources every plugin from its own folder, never the repository root', () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((entry) => entry.source)).size).toBe(entries.length);
    expect(entries.map((entry) => entry.source.slice('./plugins/'.length)).sort()).toEqual(readdirSync('plugins').sort());
    for (const entry of entries) {
      expect(entry.source).toMatch(/^\.\/plugins\/[a-z-]+$/);
      expect(resolve(entry.source)).not.toBe(resolve('.'));
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
