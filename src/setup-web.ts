/**
 * `setup --web`: the same setup, answered in a browser instead of a terminal.
 *
 * A terminal is the one thing an AI agent cannot hand the user, so the
 * terminal wizard always ended with "run this yourself". This serves the
 * wizard as a page on 127.0.0.1 instead. The work behind it is setup.ts's —
 * verifying with Apple, storing the key, planning and applying the client
 * changes — only the questions are asked differently.
 *
 * The .p8 travels from the user's browser to this process over loopback and
 * nowhere else. What keeps other things on the machine out:
 *  - it listens on 127.0.0.1 only, on a port the OS picks;
 *  - every request needs a random token the terminal printed in the link, sent
 *    as a header, so another site cannot call the API (no CORS is answered);
 *  - the Host header must be our own address, so DNS rebinding gets nowhere;
 *  - it shuts down after the setup is applied, or after half an hour.
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import type { AddressInfo } from 'node:net';
import { readSharedConfig, writeSharedConfig } from './core/shared-config.js';
import { loadConfig } from './core/config.js';
import type { JwtCredentials } from './core/jwt.js';
import {
  CLIENTS,
  CORE_SERVER,
  CORE_SPEC,
  OTHER_CLIENT,
  clientHint,
  isPresent,
  profileLabel,
  serverName,
  HEIMDALL_VERSION,
  claudeDesktop,
  PACKAGE,
} from './clients.js';
import { TOKENS_PER_TOOL } from './profiles.js';
import {
  DOES,
  KEYS_URL,
  NARROW_FIRST,
  PLAIN,
  applyPlan,
  buildRows,
  planBits,
  keyIsAdmin,
  isValidIssuerId,
  isValidKeyId,
  planChanges,
  plansForUnticked,
  preselect,
  registeredAcross,
  rolesFor,
  saveCredentials,
  selectionToSpecs,
  verifyCredentials,
  type ClientPlan,
} from './setup.js';
import { SETUP_PAGE } from './setup-page.js';

export interface WebSetupOptions {
  /** Walk through every step but write nothing and skip Apple. */
  dryRun?: boolean;
  /** Fixed port; the OS picks one when unset. */
  port?: number;
  /** Open the link in the default browser (default true). */
  open?: boolean;
}

const IDLE_MS = 30 * 60_000;

const MAX_BODY = 64 * 1024;

/** The plan as the page shows it: the same pieces the terminal prints, kept apart. */
export const planForPage = (steps: ClientPlan[]) => steps.map((p) => ({
  client: p.client.label,
  add: [
    ...p.toAdd.filter((s) => !p.toSwitch.includes(s) && s !== CORE_SPEC).map(serverName),
    ...(p.toAdd.includes(CORE_SPEC) ? (p.coreAdded.length ? p.coreAdded : [CORE_SERVER]) : []),
  ],
  remove: p.toRemove.filter((n) => !p.deadDeleted.has(n)),
  quiet: p.toSwitch.length > 0,
  rewrites: p.rewrites,
  userManaged: p.userManaged,
  coreWithheld: p.coreWithheld,
  deadDeleted: [...p.deadDeleted.values()],
  deadReported: p.deadReported,
}));

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export interface WebSetupHandle {
  url: string;
  /** Resolves once the setup was applied, cancelled from the page, or timed out. */
  done: Promise<void>;
  close(): void;
}

/** Starts the server and returns its link; the CLI waits on `done`. */
export async function startWebSetup(options: WebSetupOptions = {}): Promise<WebSetupHandle> {
  const token = randomBytes(24).toString('base64url');
  const dryRun = Boolean(options.dryRun);
  const all = [...CLIENTS, OTHER_CLIENT];
  const rows = buildRows();
  /** Credentials Apple accepted, kept here so the key crosses the wire once. */
  let verified: { keyId: string; issuerId: string; pem: string } | undefined;


  const chosenClients = (ids: unknown) => {
    if (!Array.isArray(ids)) throw new HttpError(400, 'clients must be a list');
    return all.filter((c) => ids.includes(c.id));
  };
  const chosenSpecs = (picked: unknown): string[] => {
    if (!Array.isArray(picked) || !picked.every((i) => Number.isInteger(i) && i >= 0 && i < rows.length)) {
      throw new HttpError(400, 'picked must be row numbers');
    }
    const specs = selectionToSpecs(rows, picked as number[]);
    // An empty pick would unregister every profile: an uninstall dressed as setup.
    if (!specs.length) throw new HttpError(400, 'Pick at least one profile.');
    return specs;
  };
  const plan = (body: Record<string, unknown>) => {
    const clients = chosenClients(body.clients);
    const { perClient, stale } = registeredAcross(clients);
    return [
      ...planChanges(clients, chosenSpecs(body.picked), perClient, { prune: true, stale }),
      // An app left unticked loses Heimdall, listed in the plan like any removal.
      ...plansForUnticked(clients),
    ];
  };

  let finish!: () => void;
  const done = new Promise<void>((resolve) => (finish = resolve));

  const api: Record<string, (body: Record<string, unknown>) => Promise<unknown>> = {
    async state() {
      const present = all.filter((c) => c.id !== 'other' && isPresent(c));
      const existing = readSharedConfig();
      return {
        dryRun,
        keysUrl: KEYS_URL,
        narrowFirst: NARROW_FIRST,
        desktop: claudeDesktop(),
        setupCommand: `npx -y ${PACKAGE} setup`,
        version: HEIMDALL_VERSION,
        existing: existing ? { keyId: existing.keyId, issuerId: existing.issuerId, vendorNumber: existing.vendorNumber ?? '' } : null,
        clients: all.map((c) => ({
          id: c.id,
          label: c.label,
          hint: clientHint(c) ?? '',
          present: present.includes(c),
        })),
        rows: rows.map((r) => ({
          index: r.index,
          name: r.subProfile?.name ?? r.profile.name,
          tools: Number(/\((\d+)\)$/.exec(r.item.label)?.[1] ?? 0),
          ktokens: Math.max(1, Math.round((Number(/\((\d+)\)$/.exec(r.item.label)?.[1] ?? 0) * TOKENS_PER_TOOL) / 1000)),
          hint: r.item.hint ?? '',
          ...(r.subProfile
            ? { does: DOES[`${r.profile.name}:${r.subProfile.name}`] }
            : { title: profileLabel(r.profile.name), plain: PLAIN[r.profile.name], does: DOES[r.profile.name] }),
          roles: rolesFor(r),
          parent: r.item.parent ?? null,
          vendor: r.profile.name === 'analytics',
        })),
        preselected: preselect(rows, registeredAcross(present).union),
      };
    },

    async verify(body) {
      const keyId = String(body.keyId ?? '').trim();
      const issuerId = String(body.issuerId ?? '').trim();
      const pem = String(body.pem ?? '').trim();
      if (!isValidKeyId(keyId)) return { verdict: 'bad-key-id' };
      if (!isValidIssuerId(issuerId)) return { verdict: 'bad-issuer-id' };
      if (!pem.includes('PRIVATE KEY')) return { verdict: 'bad-key-file' };
      const verdict = dryRun ? 'skipped' : await verifyCredentials(keyId, issuerId, pem);
      verified = verdict === 'invalid' ? undefined : { keyId, issuerId, pem };
      return { verdict };
    },

    /**
     * Whether the key can manage team members, which only Admin can: a cheap
     * way to tell an Admin key from the rest before the user finds out from a
     * tool that fails. null when it cannot tell (dry run, offline, no key).
     */
    async admin(body) {
      if (dryRun) return { admin: null };
      let credentials: JwtCredentials | undefined;
      if (body.reuse === true) {
        try {
          credentials = loadConfig([]).credentials;
        } catch {
          return { admin: null };
        }
      } else if (verified) {
        credentials = { keyId: verified.keyId, issuerId: verified.issuerId, privateKey: verified.pem };
      }
      if (!credentials) return { admin: null };
      return { admin: await keyIsAdmin(credentials) };
    },

    async plan(body) {
      return {
        // Existing entries are listed separately, including channel moves.
        plan: planForPage(plan(body)),
      };
    },

    async apply(body) {
      const reuse = body.reuse === true && readSharedConfig() !== undefined;
      if (!reuse && !verified) throw new HttpError(409, 'Verify the credentials first.');
      const steps = plan(body);
      // Claude Desktop writes its own settings back while it runs, so a change
      // made now would not reach it. Wait for it to be closed, unless setup
      // runs inside Desktop, where closing it would end setup too.
      if (!dryRun && steps.some((p) => p.client.id === 'claude') && claudeDesktop() === 'open') {
        throw new HttpError(409, 'Claude Desktop is still open. Quit it (⌘Q), then press Apply again.');
      }
      const lines: string[] = [];
      const log = (line: string) => lines.push(line.replace(/^\n+/, ''));

      if (dryRun) {
        log('Dry run — nothing was written and Apple was not contacted.');
        // The terminal's own wording, so a dry run reads like the plan it rehearses.
        for (const p of steps) {
          const bits = planBits(p);
          if (bits.length) log(`${p.client.label}: would ${bits.join('  ')}`);
        }
      } else {
        const text = (k: string) => String(body[k] ?? '').trim() || undefined;
        const extras = {
          vendorNumber: text('vendorNumber'),
        };
        if (!reuse && verified) {
          saveCredentials({ keyId: verified.keyId, issuerId: verified.issuerId, ...extras }, verified.pem, undefined, log);
          verified = undefined;
        } else if (reuse && extras.vendorNumber) {
          // Keeping the saved key does not mean keeping it incomplete: what was
          // filled in now is added to it, and nothing else is touched.
          const saved = readSharedConfig()!;
          const defined = Object.fromEntries(Object.entries(extras).filter(([, v]) => v !== undefined));
          log(`✓ Shared config updated at ${writeSharedConfig({ ...saved, ...defined })}.`);
        }
        if (steps.length) applyPlan(steps, log);
        else log('No changes — every chosen client already matches your selection.');
      }
      for (const line of lines) console.log(line);
      setImmediate(finish);
      return { lines };
    },

    async cancel() {
      verified = undefined;
      setImmediate(finish);
      return {};
    },
  };

  const server = createServer((req, res) => {
    void handle(req, res).catch((err) => {
      const status = err instanceof HttpError ? err.status : 500;
      send(res, status, 'application/json', JSON.stringify({ error: (err as Error).message }));
    });
  });

  const origin = () => `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const tokenOk = (value: string | undefined | null): boolean => {
    const a = Buffer.from(value ?? '');
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  };

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    idle.refresh();
    if (req.headers.host !== origin().slice('http://'.length)) throw new HttpError(403, 'Wrong host.');
    if (req.headers.origin && req.headers.origin !== origin()) throw new HttpError(403, 'Wrong origin.');
    const url = new URL(req.url ?? '/', origin());

    if (req.method === 'GET' && url.pathname === '/') {
      if (!tokenOk(url.searchParams.get('t'))) {
        send(res, 403, 'text/plain; charset=utf-8', 'Open the link printed in your terminal.');
        return;
      }
      send(res, 200, 'text/html; charset=utf-8', SETUP_PAGE);
      return;
    }

    const name = url.pathname.startsWith('/api/') ? url.pathname.slice(5) : '';
    if (req.method !== 'POST' || !Object.hasOwn(api, name)) throw new HttpError(404, 'Not found.');
    const header = req.headers['x-setup-token'];
    if (!tokenOk(Array.isArray(header) ? header[0] : header)) throw new HttpError(403, 'Missing or wrong token.');
    const body = await readJson(req);
    send(res, 200, 'application/json', JSON.stringify(await api[name](body)));
  }

  const idle = setTimeout(() => {
    console.log('\nThe setup page timed out after 30 minutes without use. Nothing more was changed.');
    finish();
  }, IDLE_MS);

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 0, '127.0.0.1', resolve);
  });

  const close = () => {
    clearTimeout(idle);
    verified = undefined;
    server.closeAllConnections();
    server.close();
  };
  void done.then(close);

  const url = `${origin()}/?t=${token}`;
  if (options.open !== false) openBrowser(url);
  return { url, done, close };
}

/** The CLI entry: print the link, wait until the page is finished. */
export async function runWebSetup(options: WebSetupOptions = {}): Promise<void> {
  const { url, done } = await startWebSetup(options);
  console.log('\nApp Store Connect MCP — setup in your browser');
  console.log(`\nOpen this link to continue${options.open === false ? '' : ' (it should have opened already)'}:\n\n  ${url}\n`);
  console.log('The link works only on this computer, and only until the setup is done.');
  console.log('Keep this window open. Press Ctrl+C to cancel.');
  if (options.dryRun) console.log('\nDry run: nothing will be written and Apple will not be contacted.');
  await done;
}

function openBrowser(url: string): void {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
  try {
    execFileSync(opener, [url], { stdio: 'ignore' });
  } catch {
    // The link is printed either way.
  }
}

function send(res: ServerResponse, status: number, type: string, body: string): void {
  res.writeHead(status, {
    'content-type': type,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    // The token is in the URL: never hand it to Apple's page through a Referer.
    'referrer-policy': 'no-referrer',
    'content-security-policy':
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; " +
      "img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  });
  res.end(body);
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new HttpError(413, 'Request too large.');
    chunks.push(chunk as Buffer);
  }
  if (!chunks.length) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {
    // fall through
  }
  throw new HttpError(400, 'Expected a JSON object.');
}
