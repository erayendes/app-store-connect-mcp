/**
 * The MCPB manifest is a fifth place the same facts are written down.
 *
 * Two registries exist: `~/.claude.json`, which the agent reads, and the
 * Claude app's Connectors menu, which is fed by MCPB bundles instead. The
 * manifest is what puts Heimdall in the second one — and being hand-written
 * and rarely opened, it is exactly the kind of file that goes on describing a
 * flag that was renamed two releases ago.
 *
 * The version is not checked here: `scripts/build-mcpb.ts` stamps it from
 * package.json at build time, so the placeholder in the source file is
 * deliberate.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PROFILES } from '../src/profiles.js';

const manifest = JSON.parse(readFileSync('mcpb/manifest.json', 'utf8'));
const config = readFileSync('src/core/config.ts', 'utf8');

describe('the MCPB manifest describes this server', () => {
  it('launches the bundled entry point rather than reaching for npx', () => {
    // The whole point of a bundle is that it runs on a machine with no Node
    // toolchain and no npm. `npx -y @erayendes/asc-mcp` here would work on the
    // author's machine and nowhere else.
    expect(manifest.server.mcp_config.command).toBe('node');
    expect(manifest.server.mcp_config.args[0]).toContain('${__dirname}');
    expect(JSON.stringify(manifest.server.mcp_config)).not.toContain('npx');
  });

  it('passes the profile as the positional argument the CLI takes', () => {
    expect(manifest.server.mcp_config.args[1]).toBe('${user_config.profile}');
    expect(manifest.user_config.profile.required).toBe(true);
  });

  it.each(Object.entries(manifest.server.mcp_config.env as Record<string, string>))(
    '%s is a variable loadConfig reads',
    (name, value) => {
      expect(config, `${name} is set by the manifest and read by nothing`).toContain(name);
      // Every one is fed by a user_config field; a hardcoded value here would
      // be a setting nobody can change after install.
      const key = /^\$\{user_config\.([a-z_]+)\}$/.exec(value)?.[1];
      expect(key, `${name} is not wired to a user_config field`).toBeDefined();
      expect(Object.keys(manifest.user_config)).toContain(key);
    }
  );

  it('asks for nothing it cannot use', () => {
    // Every field either feeds an env var or is the profile argument.
    const wired = new Set(
      Object.values(manifest.server.mcp_config.env as Record<string, string>)
        .map((v) => /^\$\{user_config\.([a-z_]+)\}$/.exec(v)?.[1])
        .filter(Boolean)
    );
    wired.add('profile');
    expect(Object.keys(manifest.user_config).sort()).toEqual([...wired].sort());
  });

  it('marks the private key sensitive, so the host stores it in the keychain', () => {
    // Heimdall's one promise about credentials is that the .p8 does not sit in
    // a plain-text config. A manifest field that forgets this quietly breaks it.
    expect(manifest.user_config.private_key_path.sensitive).toBe(true);
  });

  it('only requires what a server can actually start without', () => {
    // The credential fields are optional on purpose: `asc-mcp setup` may have
    // written them already, and asking twice for a key that is in the Keychain
    // is how it ends up on disk instead.
    const required = Object.entries(manifest.user_config)
      .filter(([, field]) => (field as { required?: boolean }).required)
      .map(([name]) => name);
    expect(required).toEqual(['profile']);
  });

  it('claims a default profile that exists', () => {
    expect(PROFILES.map((p) => p.name)).toContain(manifest.user_config.profile.default);
  });
});
