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
  | {
      kind: 'json';
      path: string;
      where: string;
      key: string;
      /**
       * Application bundle that proves the client is installed even before it
       * has written a config. Checked alongside the file, never instead of it:
       * a config can outlive the app, and an app can predate its config.
       */
      app?: string;
    };

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
    label: 'Claude (Code & Desktop)',
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
        app: 'Claude',
      },
    ],
  },
  {
    id: 'codex',
    label: 'Codex',
    // Not "Codex (ChatGPT)". This row covers the surfaces that read
    // ~/.codex/config.toml — the CLI, the IDE extension, and the Codex side of
    // the ChatGPT desktop app. ChatGPT's own connectors are a different thing
    // entirely: they accept only remote HTTPS servers, so nothing launched
    // through npx can appear there. Naming the row after ChatGPT would send
    // people looking for Heimdall in a list it can never be in.
    //
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
        app: 'Antigravity',
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
    targets: [
      {
        kind: 'json',
        path: home('.cursor', 'mcp.json'),
        where: '~/.cursor/mcp.json',
        key: 'mcpServers',
        app: 'Cursor',
      },
    ],
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
        app: 'Windsurf',
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

/** An app bundle, in either place macOS puts them. */
const hasApp = (name: string): boolean =>
  existsSync(`/Applications/${name}.app`) || existsSync(home('Applications', `${name}.app`));

/**
 * Is this client on the machine?
 *
 * A JSON client counts when its config exists *or* its application does.
 * Neither alone is enough: a freshly installed Cursor has no `mcp.json` yet,
 * and an uninstalled one leaves `~/.cursor/` behind with rules in it. Testing
 * the containing directory — the obvious shortcut — reports that leftover as
 * an installed Cursor and offers to configure an app that is not there.
 */
const targetPresent = (t: Target): boolean =>
  t.kind === 'cli' ? hasBinary(t.bin) : existsSync(t.path) || (t.app !== undefined && hasApp(t.app));

/** Targets actually installed on this machine. A client with none is absent. */
export const presentTargets = (client: McpClient): Target[] => client.targets.filter(targetPresent);
export const isPresent = (client: McpClient): boolean => presentTargets(client).length > 0;

/**
 * Targets to write when the user has chosen this client.
 *
 * Wider than `presentTargets` on purpose. The picker lets someone check a
 * client it did not find — installing Cursor tomorrow and configuring it today
 * is a reasonable thing to want — and a JSON config is created as easily as it
 * is edited. A CLI target still needs its binary: there is nothing to run.
 */
const writableTargets = (client: McpClient): Target[] =>
  client.targets.filter((t) => (t.kind === 'cli' ? hasBinary(t.bin) : true));

/**
 * Picker hint. Absence is worth saying; presence is already the checkbox, and
 * the config path is noise at the moment someone is choosing a client — it
 * matters later, in the line that reports what was written.
 */
export const clientHint = (client: McpClient): string | undefined => {
  // A client with no targets is the catch-all row. It cannot be missing —
  // there is nothing to look for — so "not found" would be a lie about it.
  if (!client.targets.length) return 'prints a block to paste';
  return isPresent(client) ? undefined : 'not found';
};


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
 * Returns one line per *change*, not per target. Claude writes two files, and
 * reporting each of them listed every profile twice — sixteen ticks for eight
 * profiles, next to eight for every other client, which reads as though the
 * others came up short. A profile is either registered with Claude or it is
 * not; which of its two configs took it is not the user's problem.
 *
 * A change counts as done only if every target took it, so a Desktop config
 * that failed while Claude Code succeeded still shows as a failure and still
 * gets its paste-in block. A failure never aborts the rest: a broken Cursor
 * config should not cost anyone a working Claude setup.
 */
export function applyToClient(
  client: McpClient,
  toAdd: string[],
  toRemove: string[]
): { results: ChangeResult[]; needsManual: boolean } {
  // Keyed by the change, so two targets doing the same thing collapse to one
  // line. Insertion order is the order the user picked, which is the order
  // they expect to read back.
  const outcomes = new Map<string, { label: string; ok: boolean; why: string[] }>();
  const record = (key: string, label: string, ok: boolean, why?: string): void => {
    const prev = outcomes.get(key) ?? { label, ok: true, why: [] };
    prev.ok &&= ok;
    if (why) prev.why.push(why);
    outcomes.set(key, prev);
  };
  const addLabel = (spec: string): string => {
    const name = serverName(spec);
    return `added ${name}${spec === name.slice(4) ? '' : ` (${spec})`}`;
  };

  for (const t of writableTargets(client)) {
    if (t.kind === 'cli') {
      for (const spec of toAdd) {
        const name = serverName(spec);
        try {
          // Add first. Removing up front is what re-registration needs, but
          // only when the add would otherwise be refused for the name already
          // being taken — do it unconditionally and a failing add has already
          // deleted a registration that was working, with nothing to put back.
          try {
            execFileSync(t.bin, t.add(name, spec), { stdio: 'ignore' });
          } catch (err) {
            if (!t.remove) throw err;
            // The add may have failed for a reason that has nothing to do with
            // the name being taken — a missing binary, a flag the CLI stopped
            // accepting. Clearing is a guess at that point, so its own failure
            // must not replace the add's error, which is the one that says
            // what actually went wrong.
            try {
              execFileSync(t.bin, t.remove(name), { stdio: 'ignore' });
            } catch {
              throw err;
            }
            execFileSync(t.bin, t.add(name, spec), { stdio: 'ignore' });
          }
          record(`add:${spec}`, addLabel(spec), true);
        } catch (err) {
          record(`add:${spec}`, addLabel(spec), false, firstLine(err));
        }
      }
      for (const name of toRemove) {
        if (!t.remove) {
          record(`rm:${name}`, `removed ${name}`, false, `${client.label} has no remove command — edit ${t.where}`);
          continue;
        }
        try {
          execFileSync(t.bin, t.remove(name), { stdio: 'ignore' });
          record(`rm:${name}`, `removed ${name}`, true);
        } catch (err) {
          record(`rm:${name}`, `removed ${name}`, false, firstLine(err));
        }
      }
      continue;
    }

    const servers = readJsonServers(t);
    const unreadable = servers === undefined && existsSync(t.path);
    let failure: string | undefined = unreadable
      ? `${t.where} could not be parsed (comments?)`
      : undefined;
    if (!failure) {
      try {
        writeJsonServers(t, toAdd, toRemove);
      } catch (err) {
        failure = `${t.where}: ${firstLine(err)}`;
      }
    }
    for (const spec of toAdd) record(`add:${spec}`, addLabel(spec), !failure, failure);
    for (const name of toRemove) record(`rm:${name}`, `removed ${name}`, !failure, failure);
  }

  const results = [...outcomes.values()].map(({ label, ok, why }) => ({
    ok,
    // Deduplicate: two targets failing the same way should say it once.
    message: ok ? label : `${label}: ${[...new Set(why)].join('; ')}`,
  }));
  return { results, needsManual: results.some((r) => !r.ok) };
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
