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
import {
  accessSync,
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { createRequire } from 'node:module';
// A cycle (profiles.ts names servers through serverName), safe because
// neither module calls into the other while it is still loading.
import { resolveSelection } from './profiles.js';

/** `npx` rather than an absolute path: portable, and survives a reinstall. */
export const SERVER_COMMAND = 'npx';
/**
 * The package a registration runs. A beta writes `@beta`, so trying the beta
 * means its servers too, not only its setup; a stable release writes the bare
 * name, which moves a beta tester back to stable the next time setup runs.
 */
const VERSION = createRequire(import.meta.url)('../package.json').version as string;
export const PACKAGE = VERSION.includes('-') ? '@erayendes/asc-mcp@beta' : '@erayendes/asc-mcp';
export const serverArgs = (spec: string): string[] => ['-y', PACKAGE, spec];
/**
 * What an app gets when its entries are rewritten only to change channel. To
 * the user that is not a move of anything: running this setup sets up this
 * version, so that is all it says.
 */
export const HEIMDALL_VERSION = `Heimdall ${VERSION}`;
/** The package an entry runs, or undefined when it names none of ours. */
const packageOf = (text: string): string | undefined => text.match(/@erayendes\/asc-mcp(?:@\S+)?/)?.[0];
const SPELLINGS: Record<string, string> = { testflight: 'TestFlight' };
/** `app-info` -> `App Info`: a profile name the way a person reads it. */
export const profileLabel = (profile: string): string =>
  SPELLINGS[profile] ??
  profile
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

/**
 * `monetization:iap,storekit` registers as `ASC-Monetization`, `app-info` as
 * `ASC-AppInfo`.
 *
 * The config key is the name every client list shows, so it is written for a
 * person: one hyphen after the brand, the area run together the way Apple
 * writes TestFlight. Not `ASC App Info`: `claude mcp add` accepts only letters,
 * digits, `-` and `_`, `codex mcp add` little more, and Claude merges its two
 * configs by key — a spaced name in Desktop and another in Claude Code would
 * list the same server twice.
 */
export const serverName = (spec: string): string =>
  `ASC-${profileLabel(spec.split(':', 1)[0]).replace(/ /g, '')}`;

/** `ASC-AppInfo`, or `asc-app-info` as written before 2.5.0 -> `app-info`. */
export const profileOfServer = (name: string): string | undefined => {
  if (!/^asc-/i.test(name)) return undefined;
  const rest = name.slice(4);
  const spelled = Object.entries(SPELLINGS).find(([, v]) => v === rest)?.[0];
  return spelled ?? rest.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const home = (...parts: string[]): string => join(homedir(), ...parts);

/**
 * A place a client keeps its MCP servers.
 *
 * `cli` targets use the vendor command for writes. `json` targets are edited
 * here and backed up.
 */
export type Target =
  | {
      kind: 'cli';
      /** Binary that must be on PATH for this target to exist. */
      bin: string;
      where: string;
      add: (name: string, spec: string) => string[];
      /** A CLI operation that accepts the entire entry as one JSON argument. */
      addEntry?: (name: string, entry: Record<string, unknown>) => string[];
      /** Absent when the CLI cannot enumerate or delete what it wrote. */
      list?: string[];
      /**
       * The file the CLI writes, read directly instead of running `list`.
       * `claude mcp list` starts every server to health-check it, which took
       * ten seconds on a machine with a dozen servers; the file answers at once.
       */
      listFile?: { path: string; key: string };
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
      /**
       * A desktop app that keeps this file in memory and writes it back while
       * it runs — Claude Desktop does, every few seconds and on quit — so an
       * edit made while it is open is lost. Its process name.
       */
      heldBy?: string;
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
        addEntry: (name, entry) => ['mcp', 'add-json', '-s', 'user', name, JSON.stringify(entry)],
        list: ['mcp', 'list', '--json'],
        listFile: { path: home('.claude.json'), key: 'mcpServers' },
        remove: (name) => ['mcp', 'remove', name, '--scope', 'user'],
      },
      {
        kind: 'json',
        path: home('Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
        where: '~/Library/Application Support/Claude/claude_desktop_config.json',
        key: 'mcpServers',
        app: 'Claude',
        heldBy: 'Claude',
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
        list: ['mcp', 'list', '--json'],
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
        addEntry: (name, entry) => ['--add-mcp', JSON.stringify({ name, ...entry })],
        listFile: { path: process.platform === 'darwin'
          ? home('Library', 'Application Support', 'Code', 'User', 'mcp.json')
          : process.platform === 'win32'
            ? join(process.env.APPDATA ?? home('AppData', 'Roaming'), 'Code', 'User', 'mcp.json')
            : join(process.env.XDG_CONFIG_HOME ?? home('.config'), 'Code', 'User', 'mcp.json'), key: 'servers' },
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
 *
 * Windows needs both halves of this spelled out. Executables there are
 * `claude.cmd` or `claude.exe`, never bare `claude`, so looking for the plain
 * name found nothing — every CLI client read as absent and `register` reported
 * success having written nothing. And `X_OK` is not meaningful on Windows:
 * `accessSync` accepts it and answers about readability, so it was never the
 * part doing the work anyway.
 *
 * Found by putting the suite on a Windows runner, where three registration
 * tests failed with an empty call list.
 */
const hasBinary = (bin: string): boolean => {
  const windows = process.platform === 'win32';
  const names = windows
    ? [
        bin,
        ...(process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD')
          .split(';')
          .filter(Boolean)
          .map((ext) => bin + ext.toLowerCase()),
      ]
    : [bin];
  const mode = windows ? constants.F_OK : constants.X_OK;

  return (process.env.PATH ?? '').split(delimiter).some((d) => {
    if (!d) return false;
    return names.some((name) => {
      try {
        accessSync(join(d, name), mode);
        return true;
      } catch {
        return false;
      }
    });
  });
};

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
export const writableTargets = (client: McpClient): Target[] =>
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
 * A registration retains its target and complete entry. A target that cannot
 * enumerate contributes an unreadable marker, so setup cannot guess it is safe.
 */
export interface Registration {
  name: string;
  target: Target;
  /** Undefined when the client cannot give us its complete, original entry. */
  entry?: Record<string, unknown>;
  spec?: string;
  pkg?: string;
}

/** Env keys that pick which App Store Connect account a server signs in as. */
const isCredentialKey = (key: string): boolean =>
  key === 'ASC_KEY_ID' || key === 'ASC_ISSUER_ID' || key === 'ASC_CONFIG_DIR' || key.startsWith('ASC_PRIVATE_KEY');

const envOf = (reg: Registration): Record<string, unknown> => {
  const env = reg.entry?.env;
  return typeof env === 'object' && env !== null && !Array.isArray(env) ? env as Record<string, unknown> : {};
};

/** The sole rule for entries that setup must leave in the user's hands. */
export function isUserManaged(reg: Registration): boolean {
  return !reg.entry || !reg.pkg || !reg.spec || 'envFile' in reg.entry ||
    Object.keys(envOf(reg)).some(isCredentialKey);
}

/** The profile the core server runs: app lookup, tool search, the media tools. */
export const CORE_SPEC = 'core';
export const CORE_SERVER = serverName(CORE_SPEC);

/**
 * An entry as setup prints it: name, then spec, flags and env KEYS. Values
 * never: a flag's value may be a path, and an env value may be a secret.
 */
export function describeEntry(reg: Registration): string {
  const flags = (reg.entry?.args as string[] | undefined)?.filter((arg) => arg.startsWith('-') && arg !== '-y')
    .map((arg) => arg.replace(/=.*/, '=<hidden>')) ?? [];
  const env = Object.keys(envOf(reg));
  const parts = [...(reg.spec ? [reg.spec] : []), ...flags, ...(env.length ? [`env ${env.join(', ')}`] : [])];
  return `${reg.name}${parts.length ? ` (${parts.join('; ')})` : ''}`;
}

/** Whether a profile argument still names something this release serves. */
export function specResolves(spec: string): boolean {
  try {
    resolveSelection(spec);
    return true;
  } catch {
    return false;
  }
}

/**
 * An entry of ours whose profile argument no longer resolves: `app-info`,
 * `access:users` — names 3.0 renamed. Started, it serves the one-tool
 * tombstone; it is never what the user meant to keep.
 */
export const isDead = (reg: Registration): boolean => reg.spec !== undefined && !specResolves(reg.spec);

/**
 * The one rule for deleting a dead entry, shared by planning, unticking and
 * the write itself: dead, ours, read in full, and not user-managed — so
 * PR-A's registrationBlock still has the last word. Anything else that is
 * dead is reported and left where it is.
 */
export function deadAndDeletable(reg: Registration, block: ReturnType<typeof registrationBlock>): boolean {
  return isDead(reg) && !isUserManaged(reg) && block.canRemove(reg.name);
}

/** Whether an entry runs read-only, by flag or by env. */
const isReadOnly = (reg: Registration): boolean => {
  const env = envOf(reg).ASC_READ_ONLY;
  return (reg.entry?.args as string[] | undefined)?.includes('--read-only') === true ||
    (env !== undefined && env !== 'false' && env !== '0');
};

export type CoreDecision = { add: true; readOnly: boolean } | { add: false; reason: string };

/**
 * Whether ASC-Core may be registered into one config target, and how.
 *
 * Decided per target (Claude Code and Claude Desktop are two), over the full
 * entries: core is the server every profile there leans on for app lookup, so
 * it must not quietly open up what those profiles keep closed, nor sign in as
 * a different account than they do. So it takes the most restrictive setting
 * among them (one read-only entry makes core read-only), and it is withheld —
 * with the reason said — wherever the account cannot be shown to be the same:
 * entries that disagree, entries with credentials of their own (core would use
 * the shared config), or a config that could not be read in full.
 */
export function coreDecision(regs: Registration[]): CoreDecision {
  if (regs.some((r) => r.name === '*')) {
    return { add: false, reason: 'the config could not be read, so the account its servers use is unknown' };
  }
  // Ours, or possibly ours: an entry we could not read in full may be either.
  // A dead entry serves no tools, so core has nothing to match it on.
  const heimdall = regs.filter((r) => (!r.entry || r.pkg) && !isDead(r));
  const partial = heimdall.filter((r) => !r.entry || 'envFile' in r.entry);
  if (partial.length) {
    return {
      add: false,
      reason: `${partial.map((r) => r.name).join(', ')} could not be read in full, so the account it uses is unknown`,
    };
  }
  // Compared in memory and never printed: these are credential values.
  const accounts = new Set(heimdall.map((r) =>
    JSON.stringify(Object.entries(envOf(r)).filter(([k]) => isCredentialKey(k)).sort(([a], [b]) => a.localeCompare(b)))));
  if (accounts.size > 1) {
    return { add: false, reason: 'its Heimdall servers use different App Store Connect accounts' };
  }
  if (accounts.size === 1 && [...accounts][0] !== '[]') {
    return {
      add: false,
      reason: 'its Heimdall servers carry their own credentials and ASC-Core would use the shared ones, ' +
        'so they cannot be shown to be the same account',
    };
  }
  return { add: true, readOnly: heimdall.some(isReadOnly) };
}

/** Shared decision for planning, unticking and the final write. */
export function registrationBlock(entries: Registration[]) {
  const managed = entries.filter(isUserManaged);
  const names = new Set(managed.map((r) => r.name));
  const profiles = new Set(managed.map((r) => profileOfServer(r.name)));
  const unsafeUnreadable = managed.some((r) => r.name === '*' &&
    !(r.target.kind === 'cli' && r.target.bin === 'claude' && r.target.addEntry));
  return {
    managed,
    canAdd: (spec: string) => !unsafeUnreadable && !names.has(serverName(spec)) &&
      !profiles.has(spec.split(':', 1)[0]),
    canRemove: (name: string) => !names.has('*') && !names.has(name),
  };
}

/** The first non-option argument after our package is the profile spec. */
function entryParts(entry: Record<string, unknown>): { spec?: string; pkg?: string } {
  const args = entry.args;
  if (!Array.isArray(args) || !args.every((arg) => typeof arg === 'string')) return {};
  const at = args.findIndex((arg) => packageOf(arg) === arg);
  if (at < 0) return {};
  return { pkg: args[at], spec: args.slice(at + 1).find((arg) => !arg.startsWith('-')) };
}

/** Codex's normalized list is safe to round-trip only in its default stdio shape. */
function codexEntry(row: Record<string, unknown>): Record<string, unknown> | undefined {
  const transport = row.transport;
  if (!transport || typeof transport !== 'object' || Array.isArray(transport)) return undefined;
  const t = transport as Record<string, unknown>;
  const args = t.args;
  const empty = (value: unknown): boolean => value == null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
  if (t.type !== 'stdio' || t.command !== SERVER_COMMAND || !Array.isArray(args) || args.length < 3 ||
      !args.every((arg) => typeof arg === 'string') || args[0] !== '-y' ||
      packageOf(args[1]) !== args[1] || !args[2] || args[2].startsWith('-') ||
      profileOfServer(String(row.name)) !== args[2].split(':', 1)[0] ||
      !args.slice(3).every((arg) => arg.startsWith('-')) ||
      t.env != null || !empty(t.env_vars) || t.cwd != null ||
      (row.enabled !== undefined && row.enabled !== true) || !empty(row.disabled_reason) ||
      !empty(row.enabled_tools) || !empty(row.disabled_tools) ||
      !empty(row.startup_timeout_sec) || !empty(row.tool_timeout_sec) ||
      (row.required !== undefined && row.required !== false) ||
      Object.keys(t).some((key) => !['type', 'command', 'args', 'env', 'env_vars', 'cwd'].includes(key)) ||
      Object.keys(row).some((key) => !['name', 'transport', 'enabled', 'disabled_reason', 'enabled_tools',
        'disabled_tools', 'startup_timeout_sec', 'tool_timeout_sec', 'auth_status', 'required'].includes(key))) return undefined;
  return { command: SERVER_COMMAND, args: [...args] };
}

export function readRegistrations(client: McpClient): Registration[] {
  const found: Registration[] = [];
  for (const t of presentTargets(client)) {
    if (t.kind === 'cli' && t.listFile) {
      const servers = readJsonServers({ kind: 'json', where: t.where, ...t.listFile }, t.bin === 'code');
      if (!servers && existsSync(t.listFile.path)) found.push({ name: '*', target: t });
      else addServers(found, t, servers);
      continue;
    }
    if (t.kind === 'cli') {
      if (!t.list) {
        found.push({ name: '*', target: t });
        continue;
      }
      try {
        const rows = JSON.parse(execFileSync(t.bin, t.list, { encoding: 'utf8' })) as unknown;
        if (!Array.isArray(rows)) throw new Error('Invalid MCP list');
        for (const row of rows) {
          const name = (row as { name?: unknown })?.name;
          if (typeof name !== 'string' || !profileOfServer(name)) continue;
          const full = t.bin === 'codex' && row && typeof row === 'object' && !Array.isArray(row)
            ? codexEntry(row as Record<string, unknown>) : undefined;
          found.push({ name, target: t, entry: full, ...(full ? entryParts(full) : {}) });
        }
      } catch {
        found.push({ name: '*', target: t });
      }
      continue;
    }
    const servers = readJsonServers(t);
    if (!servers && existsSync(t.path)) found.push({ name: '*', target: t });
    else addServers(found, t, servers);
  }
  return found;
}

/** Existing callers that only need profile names still get the parsed spec. */
export function listRegistered(client: McpClient, stale?: Set<string>): Map<string, string> {
  const found = new Map<string, string>();
  for (const reg of readRegistrations(client)) {
    if (reg.name === '*') continue;
    found.set(reg.name, reg.spec ?? profileOfServer(reg.name)!);
    if (reg.pkg && reg.pkg !== PACKAGE) stale?.add(reg.name);
  }
  return found;
}

/** Heimdall-named entries in one config file, retaining every original field. */
function addServers(
  found: Registration[],
  target: Target,
  servers: Record<string, unknown> | undefined
): void {
  for (const [name, entry] of Object.entries(servers ?? {})) {
    if (!profileOfServer(name)) continue;
    const full = typeof entry === 'object' && entry !== null && !Array.isArray(entry)
      ? entry as Record<string, unknown> : undefined;
    found.push({ name, target, entry: full, ...(full ? entryParts(full) : {}) });
  }
}

/** Strip JSONC syntax without changing strings; VS Code uses this only for reading. */
function stripJsonc(text: string): string {
  let withoutComments = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && (i === 0 || !isEscaped(text, i))) quoted = !quoted;
    if (!quoted && char === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      withoutComments += '\n';
      continue;
    }
    if (!quoted && char === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      if (i === text.length) throw new Error('Unterminated JSONC comment');
      i++;
      withoutComments += ' ';
      continue;
    }
    withoutComments += char;
  }
  let clean = '';
  quoted = false;
  for (let i = 0; i < withoutComments.length; i++) {
    const char = withoutComments[i];
    if (char === '"' && (i === 0 || !isEscaped(withoutComments, i))) quoted = !quoted;
    if (!quoted && char === ',' && /^\s*[}\]]/.test(withoutComments.slice(i + 1))) continue;
    clean += char;
  }
  return clean;
}

function isEscaped(text: string, at: number): boolean {
  let slashes = 0;
  for (let i = at - 1; i >= 0 && text[i] === '\\'; i--) slashes++;
  return slashes % 2 === 1;
}

function readJsonServers(t: Extract<Target, { kind: 'json' }>, jsonc = false): Record<string, unknown> | undefined {
  if (!existsSync(t.path)) return undefined;
  try {
    const raw = readFileSync(t.path, 'utf8');
    const doc = JSON.parse(jsonc ? stripJsonc(raw) : raw) as unknown;
    if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) return undefined;
    const servers = (doc as Record<string, unknown>)[t.key];
    if (servers === undefined) return {};
    return typeof servers === 'object' && servers !== null && !Array.isArray(servers)
      ? servers as Record<string, unknown> : undefined;
  } catch {
    // A hand-broken file is left for the user rather than overwritten.
    return undefined;
  }
}

export interface ChangeResult {
  ok: boolean;
  message: string;
  /**
   * Deliberately not done — ASC-Core held back by its safety rule, a dead
   * entry left for the user. Not a failure: no paste-in block follows it.
   */
  withheld?: boolean;
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
  toRemove: string[],
  migrations: Map<string, string> = new Map(),
  /** Dead entries planned for deletion, name -> how the plan described them. */
  dead: Map<string, string> = new Map()
): { results: ChangeResult[]; needsManual: boolean } {
  // Keyed by the change, so two targets doing the same thing collapse to one
  // line. Insertion order is the order the user picked, which is the order
  // they expect to read back.
  const outcomes = new Map<string, { label: string; ok: boolean; why: string[]; withheld?: boolean }>();
  const record = (key: string, label: string, ok: boolean, why?: string): void => {
    const prev = outcomes.get(key) ?? { label, ok: true, why: [] };
    prev.ok &&= ok;
    if (why) prev.why.push(why);
    outcomes.set(key, prev);
  };
  const withhold = (key: string, label: string): void => {
    outcomes.set(key, { label, ok: false, why: [], withheld: true });
  };
  const addLabel = (spec: string, readOnly = false): string => {
    const name = serverName(spec);
    return `added ${name}${spec.includes(':') ? ` (${spec})` : ''}${readOnly ? ' (--read-only)' : ''}`;
  };
  const removeLabel = (name: string): string =>
    dead.has(name) ? `removed ${dead.get(name)} — its profile no longer exists` : `removed ${name}`;

  for (const t of writableTargets(client)) {
    const current = readRegistrations({ ...client, targets: [t] });
    const block = registrationBlock(current);
    // Decided again here, on what this target holds now, not trusted from the
    // plan: the file may have changed between the confirmation and the write.
    const core = toAdd.includes(CORE_SPEC) ? coreDecision(current) : undefined;
    const coreReadOnly = core?.add === true && core.readOnly;
    const extra = (spec: string): string[] => (spec === CORE_SPEC && coreReadOnly ? ['--read-only'] : []);
    const label = (spec: string): string => addLabel(spec, spec === CORE_SPEC && coreReadOnly);
    if (core && !core.add) withhold(`core:${t.where}`, `${CORE_SERVER} not added to ${t.where}: ${core.reason}`);
    const adding = toAdd.filter((spec) => spec !== CORE_SPEC || core?.add);
    // A dead entry is deleted only if it still is dead, ours and clean.
    const deadKept = new Set([...dead.keys()].filter((name) => {
      const reg = current.find((r) => r.name === name);
      return reg !== undefined && !deadAndDeletable(reg, block);
    }));
    for (const name of deadKept) {
      withhold(`dead:${name}`, `${dead.get(name)} left in place: it is no longer ours to delete`);
    }
    // A dead entry lives in the targets that have it; the others have nothing to remove.
    const removing = toRemove.filter((name) => !deadKept.has(name) &&
      (!dead.has(name) || current.some((r) => r.name === name)));
    if (t.kind === 'cli') {
      const failedMigrations = new Set<string>();
      const addEntry = (name: string, spec: string, entry: Record<string, unknown>): void => {
        const fallback = t.add(name, spec);
        const marker = fallback.indexOf(SERVER_COMMAND);
        const args = t.addEntry
          ? t.addEntry(name, entry)
          : marker >= 0 && typeof entry.command === 'string' && Array.isArray(entry.args)
            ? [...fallback.slice(0, marker), entry.command, ...entry.args as string[]]
            : fallback;
        // JSON CLI arguments can expose non-credential env values in process listings.
        execFileSync(t.bin, args, { stdio: 'ignore' });
      };
      for (const spec of adding) {
        const name = serverName(spec);
        if (!block.canAdd(spec)) {
          record(`add:${spec}`, label(spec), false, 'user-managed entry left unchanged');
          continue;
        }
        const old = current.find((r) => r.name === name || r.name === migrations.get(name));
        const next = nextEntry(old?.entry, spec, extra(spec));
        try {
          // Keep the old registration until the new add has actually failed.
          try {
            addEntry(name, spec, next);
          } catch (firstError) {
            if (!t.remove || !old?.entry || old.name !== name) throw firstError;
            try { execFileSync(t.bin, t.remove(name), { stdio: 'ignore' }); }
            catch { throw firstError; }
            try {
              addEntry(name, spec, next);
            } catch (retryError) {
              let restoreError: unknown;
              try { addEntry(name, old.spec!, old.entry); }
              catch (err) { restoreError = err; }
              if (restoreError) throw new Error(`new add failed; old entry was removed and restore failed (${cliError(restoreError)})`);
              throw retryError;
            }
          }
          record(`add:${spec}`, label(spec), true);
        } catch (err) {
          if (old && old.name !== name) failedMigrations.add(old.name);
          record(`add:${spec}`, label(spec), false, cliError(err));
        }
      }
      for (const name of removing) {
        if (!block.canRemove(name) || failedMigrations.has(name)) {
          record(`rm:${name}`, removeLabel(name), false,
            failedMigrations.has(name) ? 'new entry failed; old entry left unchanged' : 'user-managed entry left unchanged');
          continue;
        }
        if (!t.remove) {
          record(`rm:${name}`, removeLabel(name), false, `${client.label} has no remove command — edit ${t.where}`);
          continue;
        }
        try {
          execFileSync(t.bin, t.remove(name), { stdio: 'ignore' });
          record(`rm:${name}`, removeLabel(name), true);
        } catch (err) {
          record(`rm:${name}`, removeLabel(name), false, cliError(err));
        }
      }
      continue;
    }

    const servers = readJsonServers(t);
    const unreadable = servers === undefined && existsSync(t.path);
    let failure: string | undefined = unreadable
      ? `${t.where} could not be parsed (comments?)`
      : undefined;
    if (!failure && t.heldBy && isRunning(t.heldBy)) {
      // Written now, it would be overwritten within seconds: the app keeps
      // this file in memory and writes it back while it runs. Leave it and say
      // so; setup asks for the app to be closed before it gets here.
      record(`held:${t.where}`, `${t.heldBy} Desktop is open, so it was not changed. Quit it, then run setup again`, false);
      continue;
    }
    if (!failure) {
      try {
        const adds = adding.filter(block.canAdd);
        const removes = removing.filter(block.canRemove);
        if (adds.length || removes.length) {
          writeJsonServers(t, adds, removes, migrations, new Map(adds.map((spec) => [spec, extra(spec)])));
        }
      } catch (err) {
        failure = `${t.where}: ${firstLine(err)}`;
      }
    }
    for (const spec of adding) record(`add:${spec}`, label(spec), !failure && block.canAdd(spec),
      failure ?? (!block.canAdd(spec) ? 'user-managed entry left unchanged' : undefined));
    for (const name of removing) record(`rm:${name}`, removeLabel(name), !failure && block.canRemove(name),
      failure ?? (!block.canRemove(name) ? 'user-managed entry left unchanged' : undefined));
  }

  const results: ChangeResult[] = [...outcomes.values()].map(({ label, ok, why, withheld }) => ({
    ok,
    // Deduplicate: two targets failing the same way should say it once.
    message: ok || withheld ? label : `${label}: ${[...new Set(why)].join('; ')}`,
    ...(withheld ? { withheld } : {}),
  }));
  return { results, needsManual: results.some((r) => !r.ok && !r.withheld) };
}

/** The entry to write: the old one with package and spec moved, or a new one, plus any flags it must carry. */
function nextEntry(old: Record<string, unknown> | undefined, spec: string, extra: string[] = []): Record<string, unknown> {
  const base = old ? rewrittenEntry(old, spec) : { command: SERVER_COMMAND, args: serverArgs(spec) };
  const args = [...base.args as string[]];
  for (const flag of extra) if (!args.includes(flag)) args.push(flag);
  return { ...base, args };
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
  toRemove: string[],
  migrations: Map<string, string> = new Map(),
  extras: Map<string, string[]> = new Map()
): void {
  let doc: Record<string, unknown> = {};
  if (existsSync(t.path)) {
    doc = JSON.parse(readFileSync(t.path, 'utf8')) as Record<string, unknown>;
    copyFileSync(t.path, `${t.path}.bak`);
  } else {
    mkdirSync(dirname(t.path), { recursive: true });
  }
  const servers = (doc[t.key] as Record<string, unknown>) ?? {};
  const migrated = new Map(toAdd.map((spec) => [serverName(spec), servers[migrations.get(serverName(spec)) ?? '']]));
  for (const name of toRemove) delete servers[name];
  for (const spec of toAdd) {
    const name = serverName(spec);
    const existing = servers[name] ?? migrated.get(name);
    servers[name] = nextEntry(
      typeof existing === 'object' && existing !== null && !Array.isArray(existing)
        ? existing as Record<string, unknown> : undefined,
      spec,
      extras.get(spec)
    );
  }
  doc[t.key] = servers;
  writeAtomic(t.path, `${JSON.stringify(doc, null, 2)}\n`);
}

/** Replace only the package and profile tokens in a complete entry. */
function rewrittenEntry(entry: Record<string, unknown>, spec: string): Record<string, unknown> {
  const args = [...entry.args as string[]];
  const pkgAt = args.findIndex((arg) => packageOf(arg) === arg);
  const specAt = args.findIndex((arg, i) => i > pkgAt && !arg.startsWith('-'));
  args[pkgAt] = PACKAGE;
  args[specAt] = spec;
  return { ...entry, args };
}

/**
 * Write through a temp file and rename it into place, so an interrupted run
 * leaves either the old config or the new one — never half of ~/.claude.json.
 * Resolves symlinks first (dotfile managers link these files; renaming over
 * the link would replace it with a plain file) and keeps the file's mode,
 * since some clients keep their config 0600.
 */
function writeAtomic(path: string, text: string): void {
  const real = existsSync(path) ? realpathSync(path) : path;
  const tmp = `${real}.${process.pid}.tmp`;
  writeFileSync(tmp, text, existsSync(real) ? { mode: statSync(real).mode & 0o777 } : undefined);
  renameSync(tmp, real);
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
const cliError = (err: unknown): string => {
  if (err instanceof Error && err.message.startsWith('new add failed;')) return err.message;
  const status = typeof err === 'object' && err !== null ? (err as { status?: number }).status : undefined;
  return status === undefined ? 'CLI command failed' : `CLI exited ${status}`;
};

/** Whether a desktop app is running, by its process name. */
export function isRunning(name: string): boolean {
  try {
    if (process.platform === 'win32') {
      return execFileSync('tasklist', ['/FI', `IMAGENAME eq ${name}.exe`, '/NH'], { encoding: 'utf8' }).includes(`${name}.exe`);
    }
    // Not pgrep: on macOS it leaves out Claude Desktop's main process (it
    // lists the helpers only), so an open Desktop read as closed.
    const commands = execFileSync('ps', ['-axo', 'comm='], { encoding: 'utf8' }).split('\n');
    return isRunningIn(commands, name);
  } catch {
    return false;
  }
}

/** Whether this process runs inside the app: in a terminal or an agent the app started. */
export function insideApp(name: string): boolean {
  if (process.platform === 'win32') return false;
  let pid = process.ppid;
  for (let hops = 0; hops < 40 && pid > 1; hops++) {
    try {
      const [ppid, ...path] = execFileSync('ps', ['-o', 'ppid=,comm=', '-p', String(pid)], { encoding: 'utf8' })
        .trim()
        .split(/\s+/);
      if (path.join(' ').split('/').pop() === name) return true;
      pid = Number(ppid);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Claude Desktop keeps its settings file in memory and writes it back while it
 * runs, so setup can only change it while Desktop is closed. "inside" means
 * setup itself runs within Desktop, where quitting Desktop would end setup too.
 */
export function claudeDesktop(): 'closed' | 'open' | 'inside' {
  if (!isRunning('Claude')) return 'closed';
  return insideApp('Claude') ? 'inside' : 'open';
}

/** Whether a process list (one executable path per line) has this app's main process. */
export const isRunningIn = (commands: string[], name: string): boolean =>
  commands.some((c) => c.trim().split('/').pop() === name);
