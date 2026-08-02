/**
 * The MCP clients setup can register profiles with.
 *
 * Every client speaks the same protocol and none of them share a config file,
 * so the only thing that travels between them is a command and its arguments.
 * Everything else — the path, the file format, the key the servers hang off —
 * is per client, and getting one wrong is silent: the server never starts and
 * the client says nothing.
 *
 * Each client is a list of targets rather than a single file, because two
 * products can share a name. "Claude" is Claude Code plus Claude Desktop, and a
 * machine may have either or both.
 *
 * Paths and key names below were read from each vendor's own documentation in
 * August 2026, not inferred. The three that surprise:
 *   - VS Code's key is `servers`, not `mcpServers`.
 *   - Codex is TOML, but its CLI writes it, so nothing here generates TOML.
 *   - ChatGPT desktop, Codex CLI and the Codex IDE extension share one file.
 */
import { execFileSync } from 'node:child_process';
import { accessSync, constants, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { homedir } from 'node:os';

/** `npx` rather than an absolute path: portable, and survives a reinstall. */
export const SERVER_COMMAND = 'npx';
export const serverArgs = (spec: string): string[] => ['-y', '@erayendes/asc-mcp', spec];
/** `monetization:iap,storekit` registers as `asc-monetization`. */
export const serverName = (spec: string): string => `asc-${spec.split(':', 1)[0]}`;

const home = (...parts: string[]): string => join(homedir(), ...parts);

/**
 * A place a client keeps its MCP servers.
 *
 * `cli` targets hand the work to a command the vendor ships — the safest option
 * because the vendor's own code owns the file format. `json` targets are edited
 * here, which is why they back up first.
 */
export type Target =
  | {
      kind: 'cli';
      /** Binary that must be on PATH for this target to exist. */
      bin: string;
      where: string;
      add: (name: string, spec: string) => string[];
      /** Absent when the CLI cannot enumerate or delete what it wrote. */
      list?: string[];
      remove?: (name: string) => string[];
    }
  | { kind: 'json'; path: string; where: string; key: string };

export interface McpClient {
  id: string;
  label: string;
  targets: Target[];
  /**
   * Key to use in a paste-in block when no target could write the file.
   * Only needed where it differs from the JSON target's key or there is no
   * JSON target at all — VS Code writes through its CLI but keys servers off
   * `servers`, so a block generated for it would otherwise be silently wrong.
   */
  manualKey?: string;
}

export const CLIENTS: McpClient[] = [
  {
    id: 'claude',
    label: 'Claude',
    // Claude Code and Claude Desktop read different files and neither sees the
    // other's. Registering in one and expecting the other to follow is the
    // single most common way to end up with "no MCP server configured".
    targets: [
      {
        kind: 'cli',
        bin: 'claude',
        where: '~/.claude.json',
        add: (name, spec) => ['mcp', 'add', '-s', 'user', name, '--', SERVER_COMMAND, ...serverArgs(spec)],
        list: ['mcp', 'list'],
        remove: (name) => ['mcp', 'remove', name],
      },
      {
        kind: 'json',
        path: home('Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
        where: '~/Library/Application Support/Claude/claude_desktop_config.json',
        key: 'mcpServers',
      },
    ],
  },
  {
    id: 'codex',
    label: 'Codex (ChatGPT)',
    // TOML, but `codex mcp add` writes it. Generating TOML by hand would risk
    // the comments and ordering in a config that also holds model settings.
    targets: [
      {
        kind: 'cli',
        bin: 'codex',
        where: '~/.codex/config.toml',
        add: (name, spec) => ['mcp', 'add', name, '--', SERVER_COMMAND, ...serverArgs(spec)],
        list: ['mcp', 'list'],
        remove: (name) => ['mcp', 'remove', name],
      },
    ],
  },
  {
    id: 'antigravity',
    label: 'Antigravity',
    // Antigravity 2.0, the IDE and the CLI all read this one file.
    targets: [
      {
        kind: 'json',
        path: home('.gemini', 'config', 'mcp_config.json'),
        where: '~/.gemini/config/mcp_config.json',
        key: 'mcpServers',
      },
    ],
  },
  {
    id: 'vscode',
    label: 'VS Code (Copilot)',
    manualKey: 'servers',
    // `--add-mcp` takes one JSON object, not a `--` separated command, and the
    // file it writes keys servers off `servers`. Both differ from every other
    // client here.
    targets: [
      {
        kind: 'cli',
        bin: 'code',
        where: 'VS Code user MCP config',
        add: (name, spec) => [
          '--add-mcp',
          JSON.stringify({ name, command: SERVER_COMMAND, args: serverArgs(spec) }),
        ],
      },
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    targets: [{ kind: 'json', path: home('.cursor', 'mcp.json'), where: '~/.cursor/mcp.json', key: 'mcpServers' }],
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    targets: [
      {
        kind: 'json',
        path: home('.codeium', 'windsurf', 'mcp_config.json'),
        where: '~/.codeium/windsurf/mcp_config.json',
        key: 'mcpServers',
      },
    ],
  },
];

/** The catch-all row. Has no targets, so it always prints and never writes. */
export const OTHER_CLIENT: McpClient = { id: 'other', label: 'Other / not listed', targets: [] };

/**
 * Is this command on PATH?
 *
 * Walks PATH rather than shelling out to `which`: no subprocess per client on
 * every setup run, and no `shell: true`, which Node now warns about because the
 * arguments are concatenated rather than escaped.
 */
const hasBinary = (bin: string): boolean =>
  (process.env.PATH ?? '').split(delimiter).some((d) => {
    if (!d) return false;
    try {
      accessSync(join(d, bin), constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });

/**
 * A JSON target counts as present when its *directory* exists, not the file.
 * A freshly installed Cursor has `~/.cursor/` and no `mcp.json` until someone
 * adds a server — requiring the file would report Cursor missing on exactly
 * the machines where setup has the most to do.
 */
const targetPresent = (t: Target): boolean =>
  t.kind === 'cli' ? hasBinary(t.bin) : existsSync(t.path) || existsSync(dirname(t.path));

/** Targets actually installed on this machine. A client with none is absent. */
export const presentTargets = (client: McpClient): Target[] => client.targets.filter(targetPresent);
export const isPresent = (client: McpClient): boolean => presentTargets(client).length > 0;

/** Where a present client keeps its config, for the picker hint. */
export function clientHint(client: McpClient): string {
  const present = presentTargets(client);
  if (!present.length) return 'not found';
  return present.map((t) => t.where).join(' + ');
}

/**
 * Profiles this client already has registered, keyed by server name.
 *
 * The value is the full argument (`monetization:iap`), not just the profile:
 * re-registering with the bare name would silently widen a config the user had
 * narrowed. Targets that cannot enumerate contribute nothing, which reads as
 * "not registered" and makes the next add a harmless overwrite.
 */
export function listRegistered(client: McpClient): Map<string, string> {
  const found = new Map<string, string>();
  for (const t of presentTargets(client)) {
    if (t.kind === 'cli') {
      if (!t.list) continue;
      try {
        const out = execFileSync(t.bin, t.list, { encoding: 'utf8' });
        for (const line of out.split('\n')) {
          const name = line.match(/^(asc-[a-z0-9-]+)\b/)?.[1];
          if (!name) continue;
          found.set(name, line.match(/@erayendes\/asc-mcp\s+(\S+)/)?.[1] ?? name.replace(/^asc-/, ''));
        }
      } catch {
        // Listing failed — treat as nothing registered rather than guessing.
      }
      continue;
    }
    const servers = readJsonServers(t);
    if (!servers) continue;
    for (const [name, entry] of Object.entries(servers)) {
      if (!name.startsWith('asc-')) continue;
      const args = (entry as { args?: unknown })?.args;
      const spec = Array.isArray(args) ? String(args[args.length - 1]) : name.replace(/^asc-/, '');
      found.set(name, spec);
    }
  }
  return found;
}

function readJsonServers(t: Extract<Target, { kind: 'json' }>): Record<string, unknown> | undefined {
  if (!existsSync(t.path)) return undefined;
  try {
    const doc = JSON.parse(readFileSync(t.path, 'utf8')) as Record<string, unknown>;
    return (doc[t.key] as Record<string, unknown>) ?? {};
  } catch {
    // Comments (JSONC) or a hand-broken file. The caller falls back to printing
    // rather than overwriting something it could not read.
    return undefined;
  }
}

export interface ChangeResult {
  ok: boolean;
  message: string;
}

/**
 * Register and unregister profiles with one client.
 *
 * Returns one line per change, in the order they happened. A failure never
 * aborts the rest: a broken Cursor config should not stop Claude from being
 * set up, and the caller prints a paste-in block for whatever failed.
 */
export function applyToClient(
  client: McpClient,
  toAdd: string[],
  toRemove: string[]
): { results: ChangeResult[]; needsManual: boolean } {
  const results: ChangeResult[] = [];
  let needsManual = false;

  for (const t of presentTargets(client)) {
    if (t.kind === 'cli') {
      for (const spec of toAdd) {
        const name = serverName(spec);
        try {
          // Re-registering the same name needs the old entry gone first.
          if (t.remove) {
            try {
              execFileSync(t.bin, t.remove(name), { stdio: 'ignore' });
            } catch {
              // Not registered yet — nothing to clear.
            }
          }
          execFileSync(t.bin, t.add(name, spec), { stdio: 'ignore' });
          results.push({ ok: true, message: `added ${name}${spec === name.slice(4) ? '' : ` (${spec})`}` });
        } catch (err) {
          needsManual = true;
          results.push({ ok: false, message: `add ${name}: ${firstLine(err)}` });
        }
      }
      for (const name of toRemove) {
        if (!t.remove) {
          needsManual = true;
          results.push({ ok: false, message: `remove ${name}: ${client.label} has no remove command — edit ${t.where}` });
          continue;
        }
        try {
          execFileSync(t.bin, t.remove(name), { stdio: 'ignore' });
          results.push({ ok: true, message: `removed ${name}` });
        } catch (err) {
          needsManual = true;
          results.push({ ok: false, message: `remove ${name}: ${firstLine(err)}` });
        }
      }
      continue;
    }

    const servers = readJsonServers(t);
    if (servers === undefined && existsSync(t.path)) {
      needsManual = true;
      results.push({ ok: false, message: `${t.where} could not be parsed (comments?) — add the block below by hand` });
      continue;
    }
    try {
      writeJsonServers(t, toAdd, toRemove);
      for (const spec of toAdd) results.push({ ok: true, message: `added ${serverName(spec)}${spec === serverName(spec).slice(4) ? '' : ` (${spec})`}` });
      for (const name of toRemove) results.push({ ok: true, message: `removed ${name}` });
    } catch (err) {
      needsManual = true;
      results.push({ ok: false, message: `${t.where}: ${firstLine(err)}` });
    }
  }

  return { results, needsManual };
}

/**
 * Rewrite a client's JSON config with the servers added and removed.
 *
 * Backs the file up first. JSON carries no comments, so the only thing a
 * round-trip loses is the user's indentation — recoverable from the copy, and
 * the reason the copy exists.
 */
function writeJsonServers(
  t: Extract<Target, { kind: 'json' }>,
  toAdd: string[],
  toRemove: string[]
): void {
  let doc: Record<string, unknown> = {};
  if (existsSync(t.path)) {
    doc = JSON.parse(readFileSync(t.path, 'utf8')) as Record<string, unknown>;
    copyFileSync(t.path, `${t.path}.bak`);
  } else {
    mkdirSync(dirname(t.path), { recursive: true });
  }
  const servers = (doc[t.key] as Record<string, unknown>) ?? {};
  for (const name of toRemove) delete servers[name];
  for (const spec of toAdd) {
    servers[serverName(spec)] = { command: SERVER_COMMAND, args: serverArgs(spec) };
  }
  doc[t.key] = servers;
  writeFileSync(t.path, `${JSON.stringify(doc, null, 2)}\n`);
}

/** What to paste when nothing could write it for you. */
export function manualBlock(client: McpClient, specs: string[]): string {
  const key =
    client.manualKey ?? client.targets.find((t) => t.kind === 'json')?.key ?? 'mcpServers';
  const entries = specs
    .map(
      (spec) =>
        `    ${JSON.stringify(serverName(spec))}: { "command": ${JSON.stringify(SERVER_COMMAND)}, ` +
        `"args": ${JSON.stringify(serverArgs(spec))} }`
    )
    .join(',\n');
  return `{\n  ${JSON.stringify(key)}: {\n${entries}\n  }\n}`;
}

const firstLine = (err: unknown): string => String((err as Error).message ?? err).split('\n')[0];
