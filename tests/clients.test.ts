/**
 * The client registry decides where a profile gets registered. Everything it
 * gets wrong is silent — a server written under the wrong key, or into the
 * wrong file, produces a client that starts fine and simply has no tools.
 *
 * The JSON tests run against real temp files rather than a mock, because the
 * failure that matters is what ends up on disk.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CLIENTS,
  OTHER_CLIENT,
  applyToClient,
  listRegistered,
  manualBlock,
  serverArgs,
  serverName,
  type McpClient,
} from '../src/clients.js';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'asc-clients-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

/** A stand-in for Cursor/Windsurf/Antigravity — same shape, writable path. */
const jsonClient = (file = 'mcp.json', key = 'mcpServers'): McpClient => ({
  id: 'temp',
  label: 'Temp',
  targets: [{ kind: 'json', path: join(dir, file), where: file, key }],
});

describe('the registry itself', () => {
  it('gives every client at least one target, and Other none', () => {
    for (const c of CLIENTS) expect(c.targets.length, c.label).toBeGreaterThan(0);
    // Other exists to print. A target would make it write somewhere real.
    expect(OTHER_CLIENT.targets).toEqual([]);
  });

  it('keeps Claude Code and Claude Desktop on one row but two files', () => {
    // They do not share a config. One row that wrote only one of them would
    // reproduce the exact failure this row exists to prevent.
    const claude = CLIENTS.find((c) => c.id === 'claude')!;
    expect(claude.targets).toHaveLength(2);
    expect(claude.targets.map((t) => t.kind).sort()).toEqual(['cli', 'json']);
  });

  it('writes VS Code servers under "servers", not "mcpServers"', () => {
    // VS Code is the only client that renamed the key. Getting this wrong is
    // invisible: the file is valid JSON and the server never loads.
    const vscode = CLIENTS.find((c) => c.id === 'vscode')!;
    expect(JSON.parse(manualBlock(vscode, ['monetization']))).toHaveProperty('servers');
    const cursor = CLIENTS.find((c) => c.id === 'cursor')!;
    expect(JSON.parse(manualBlock(cursor, ['monetization']))).toHaveProperty('mcpServers');
  });

  it('names a server after the profile, never the sub-profile spec', () => {
    expect(serverName('monetization:iap-offers,storekit')).toBe('asc-monetization');
    expect(serverName('webhooks')).toBe('asc-webhooks');
    // The spec still has to survive into the arguments, or narrowing is lost.
    expect(serverArgs('monetization:storekit').at(-1)).toBe('monetization:storekit');
  });

  it('emits a paste block that parses back to a runnable entry', () => {
    const doc = JSON.parse(manualBlock(CLIENTS[0], ['distribution:version']));
    expect(doc.mcpServers['asc-distribution']).toEqual({
      command: 'npx',
      args: ['-y', '@erayendes/asc-mcp', 'distribution:version'],
    });
  });
});

describe('writing a JSON client config', () => {
  it('creates the file when the client has never been configured', () => {
    const client = jsonClient();
    const { results, needsManual } = applyToClient(client, ['monetization'], []);
    expect(needsManual).toBe(false);
    expect(results.every((r) => r.ok)).toBe(true);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.mcpServers['asc-monetization'].args).toContain('monetization');
  });

  it('leaves every other server and top-level key alone', () => {
    // The user's file is not ours. Losing an unrelated server here would be
    // the worst possible outcome of a setup run.
    writeFileSync(
      join(dir, 'mcp.json'),
      JSON.stringify({ theme: 'dark', mcpServers: { github: { command: 'gh' } } })
    );
    applyToClient(jsonClient(), ['analytics'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.theme).toBe('dark');
    expect(doc.mcpServers.github).toEqual({ command: 'gh' });
    expect(doc.mcpServers['asc-analytics']).toBeDefined();
  });

  it('backs the file up before rewriting it', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {} }, null, 4));
    applyToClient(jsonClient(), ['webhooks'], []);
    expect(existsSync(join(dir, 'mcp.json.bak'))).toBe(true);
    // The backup is the only copy of the user's original indentation.
    expect(readFileSync(join(dir, 'mcp.json.bak'), 'utf8')).toContain('    ');
  });

  it('removes a server that is no longer chosen', () => {
    writeFileSync(
      join(dir, 'mcp.json'),
      JSON.stringify({ mcpServers: { 'asc-analytics': { command: 'npx' }, keep: {} } })
    );
    applyToClient(jsonClient(), [], ['asc-analytics']);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.mcpServers['asc-analytics']).toBeUndefined();
    expect(doc.mcpServers.keep).toBeDefined();
  });

  it('re-registers a narrowed profile under the same name', () => {
    applyToClient(jsonClient(), ['monetization'], []);
    applyToClient(jsonClient(), ['monetization:storekit'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(Object.keys(doc.mcpServers)).toEqual(['asc-monetization']);
    expect(doc.mcpServers['asc-monetization'].args.at(-1)).toBe('monetization:storekit');
  });

  it('refuses to touch a file it could not parse, and says so', () => {
    // Cursor and VS Code allow comments. JSON.parse does not. Overwriting here
    // would silently delete every server the user had.
    const withComments = '{\n  // my servers\n  "mcpServers": { "github": { "command": "gh" } }\n}';
    writeFileSync(join(dir, 'mcp.json'), withComments);
    const { results, needsManual } = applyToClient(jsonClient(), ['analytics'], []);
    expect(needsManual).toBe(true);
    expect(results[0].ok).toBe(false);
    expect(results[0].message).toMatch(/could not be parsed/);
    expect(readFileSync(join(dir, 'mcp.json'), 'utf8')).toBe(withComments);
  });

  it('honours a client that keys its servers differently', () => {
    applyToClient(jsonClient('vs.json', 'servers'), ['app-info'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'vs.json'), 'utf8'));
    expect(doc.servers['asc-app-info']).toBeDefined();
    expect(doc.mcpServers).toBeUndefined();
  });
});

describe('reading back what is registered', () => {
  it('reports the full argument, not just the profile name', () => {
    // Returning the bare name would make the next run re-register it wide and
    // silently undo the user's narrowing.
    applyToClient(jsonClient(), ['monetization:storekit,iap-offers'], []);
    expect(listRegistered(jsonClient()).get('asc-monetization')).toBe('monetization:storekit,iap-offers');
  });

  it('ignores servers that are not ours', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { github: { command: 'gh' } } }));
    expect(listRegistered(jsonClient()).size).toBe(0);
  });

  it('reads nothing from a config that does not exist yet', () => {
    expect(listRegistered(jsonClient('absent.json')).size).toBe(0);
  });
});
