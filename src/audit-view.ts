/**
 * `audit`: the write log as a page a person can read. "Who changed the price
 * yesterday, the agent or me?" has an answer in audit.jsonl, but only for
 * someone who greps; this lays it out as one row per write with filters.
 *
 * A static file next to the log, opened from disk: no server, no network,
 * nothing leaves the machine. The entries are embedded as JSON, already
 * masked when they were logged (core/audit-log.ts).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stateDir } from './core/shared-config.js';
import { OPERATIONS } from './generated/operations.js';
import { toolNameFor } from './core/registry.js';
import { MACRO_TOOLS } from './tools/catalog.js';
import { STOREKIT_TOOLS } from './storekit/index.js';
import { DESIGN_TOKENS } from './setup-tokens.js';
import { openBrowser } from './setup-web.js';

export interface LoggedWrite {
  at: string;
  tool: string;
  risk?: string;
  confirmation?: string;
  outcome?: string;
  args?: Record<string, unknown>;
  error?: string;
  appleRequestId?: string;
}

/** Every well-formed line of the log, oldest first; a torn last line is skipped. */
export function readAuditLog(env: NodeJS.ProcessEnv = process.env): LoggedWrite[] {
  let text = '';
  try {
    text = readFileSync(join(stateDir(env), 'audit.jsonl'), 'utf8');
  } catch {
    return [];
  }
  return text.split('\n').flatMap((line) => {
    try {
      const entry = JSON.parse(line) as LoggedWrite;
      return entry && typeof entry.at === 'string' && typeof entry.tool === 'string' ? [entry] : [];
    } catch {
      return [];
    }
  });
}

/** A tool's own first sentence, which is what it does in words. */
function summaries(): Map<string, string> {
  const first = (d?: string) => d?.split(/\.\s| — /)[0]?.replace(/\.$/, '');
  const map = new Map<string, string>();
  for (const op of OPERATIONS) map.set(toolNameFor(op), first(op.description) ?? op.name);
  for (const t of [...MACRO_TOOLS, ...STOREKIT_TOOLS] as Array<{ name: string; description?: string }>) {
    map.set(t.name, first(t.description) ?? t.name);
  }
  return map;
}

/** The page, with the entries inside it. `<` is escaped so a value cannot close the script. */
export function renderAuditPage(entries: LoggedWrite[]): string {
  const known = summaries();
  const rows = entries.map((e) => ({ ...e, what: known.get(e.tool) ?? e.tool }));
  const data = JSON.stringify(rows).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Heimdall write log</title>
<style>
${DESIGN_TOKENS}
main { max-width: 1100px; margin: 0 auto; padding: var(--sp-6) var(--sp-4); }
h1 { margin: 0 0 var(--sp-1); }
.lead { color: var(--fg-muted); margin: 0 0 var(--sp-4); }
.filters { display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-bottom: var(--sp-4); }
.filters label { display: grid; gap: var(--sp-1); font-size: var(--fs-label); color: var(--fg-muted); }
table { width: 100%; border-collapse: collapse; font-size: var(--fs-ui); }
th, td { text-align: left; vertical-align: top; padding: var(--sp-2); border-top: 1px solid var(--border); }
th { font-weight: 500; color: var(--fg-muted); font-size: var(--fs-label); }
td.when { white-space: nowrap; color: var(--fg-muted); }
.tool { font-family: var(--font-mono); font-size: var(--fs-label); color: var(--fg-muted); }
.change { font-family: var(--font-mono); font-size: var(--fs-label); white-space: pre-line; overflow-wrap: anywhere; min-width: 16em; }
tr.failed td { background: var(--red-bg); }
.pill { display: inline-block; padding: 0 var(--sp-2); border-radius: 999px; border: 1px solid var(--border); font-size: var(--fs-label); white-space: nowrap; }
.pill.ok { border-color: var(--accent); }
.pill.error { border-color: var(--red-border); color: var(--red); }
.err { color: var(--red); font-size: var(--fs-label); margin-top: var(--sp-1); }
.empty { color: var(--fg-muted); padding: var(--sp-6) 0; }
</style>
</head>
<body>
<main>
  <h1>What Heimdall changed</h1>
  <p class="lead">Every write Heimdall was asked to make on this computer, newest first. Read from the local log; nothing here left this machine.</p>
  <div class="filters">
    <label>App <select class="input" id="app"></select></label>
    <label>Day <select class="input" id="day"></select></label>
    <label>Result <select class="input" id="outcome">
      <option value="">All</option><option value="ok">Done</option><option value="error">Failed</option><option value="not run">Not run</option>
    </select></label>
  </div>
  <div id="list"></div>
</main>
<script>
var ENTRIES = ${data};
var RESULT = { ok: 'Done', error: 'Failed', 'not run': 'Not run' };
function $(id) { return document.getElementById(id); }
function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function day(at) { var d = new Date(at); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function appOf(e) { return e.args && (e.args.app || e.args.app_id || e.args.bundle_id) ? String(e.args.app || e.args.app_id || e.args.bundle_id) : ''; }
function value(v) {
  // A request body is logged as what it touches: its type, its id and the fields it sets.
  if (v && typeof v === 'object' && !Array.isArray(v) && v.fields) return (v.type || '') + (v.id ? ' ' + v.id : '') + ' (' + v.fields.join(', ') + ')';
  return Array.isArray(v) ? v.join(', ') : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v);
}
function change(args) {
  return Object.keys(args || {}).filter(function (k) { return k !== 'app'; }).map(function (k) { return k + ': ' + value(args[k]); }).join('\\n');
}
function fill(select, values, all) {
  select.appendChild(new Option(all, ''));
  values.forEach(function (v) { select.appendChild(new Option(v, v)); });
}
var rows = ENTRIES.slice().reverse();
fill($('app'), Array.from(new Set(rows.map(appOf).filter(Boolean))).sort(), 'All apps');
fill($('day'), Array.from(new Set(rows.map(function (e) { return day(e.at); }))), 'All days');
function render() {
  var a = $('app').value, d = $('day').value, o = $('outcome').value;
  var shown = rows.filter(function (e) {
    return (!a || appOf(e) === a) && (!d || day(e.at) === d) && (!o || e.outcome === o);
  });
  var list = $('list'); list.innerHTML = '';
  if (!shown.length) { list.appendChild(el('p', 'empty', ENTRIES.length ? 'No writes match these filters.' : 'Heimdall has not been asked to change anything yet.')); return; }
  var table = el('table'), head = el('tr');
  ['When', 'What', 'Change', 'Asked', 'Result'].forEach(function (h) { head.appendChild(el('th', null, h)); });
  table.appendChild(head);
  shown.forEach(function (e) {
    var tr = el('tr', e.outcome === 'error' ? 'failed' : null);
    tr.appendChild(el('td', 'when', new Date(e.at).toLocaleString()));
    var what = el('td'); what.appendChild(el('div', null, e.what)); what.appendChild(el('div', 'tool', e.tool + (appOf(e) ? ' · ' + appOf(e) : '')));
    tr.appendChild(what);
    tr.appendChild(el('td', 'change', change(e.args)));
    tr.appendChild(el('td', null, e.confirmation || ''));
    var result = el('td'); result.appendChild(el('span', 'pill ' + (e.outcome || ''), RESULT[e.outcome] || e.outcome || ''));
    if (e.error) result.appendChild(el('div', 'err', e.error));
    if (e.appleRequestId) result.appendChild(el('div', 'tool', 'x-request-id ' + e.appleRequestId));
    tr.appendChild(result);
    table.appendChild(tr);
  });
  list.appendChild(table);
}
['app', 'day', 'outcome'].forEach(function (id) { $(id).addEventListener('change', render); });
render();
</script>
</body>
</html>
`;
}

/** Writes the page next to the log, readable only by this user, and opens it. */
export function runAudit(options: { open?: boolean } = {}, env: NodeJS.ProcessEnv = process.env): string {
  const entries = readAuditLog(env);
  mkdirSync(stateDir(env), { recursive: true, mode: 0o700 });
  const path = join(stateDir(env), 'audit.html');
  writeFileSync(path, renderAuditPage(entries), { mode: 0o600 });
  console.log(`${entries.length} write${entries.length === 1 ? '' : 's'} in the log. Page: ${path}`);
  if (options.open !== false) openBrowser(path);
  return path;
}
