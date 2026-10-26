/**
 * The page `setup --web` serves. One self-contained document: no external
 * script, font or stylesheet, so it works offline and loads nothing the CSP
 * would have to allow. The token arrives in the URL and is moved into memory
 * and out of the address bar on load.
 *
 * Needs come first: what the user picks decides which key role to create and
 * which extra values to look up, so they are told before they make the key,
 * not after.
 *
 * Built from the Kortext design system (setup-tokens.ts): its tokens, its
 * buttons, inputs and drawn checkbox. The page adds layout only — no colour,
 * size or radius of its own.
 */
import { DESIGN_TOKENS } from './setup-tokens.js';
import { PACKAGE } from './clients.js';

// Sibling projects, in this order. No url = not released yet.
const SIBLINGS: { name: string; what: string; url?: string }[] = [
  { name: 'Mogut', what: 'Read-only App Store growth MCP: keywords, competitors, reviews and pricing.' },
  { name: 'Kortext', what: 'The project brain for AI-driven development.', url: 'https://github.com/erayendes/kortext' },
  { name: 'Cogitors', what: 'Codex, Claude and Antigravity deliberate and reach one reasoned decision.', url: 'https://github.com/erayendes/cogitors' },
  { name: 'Krafta', what: 'Check interfaces against explicit design rules, in CI or in agent review.', url: 'https://github.com/erayendes/krafta' },
  { name: 'Oduncu', what: 'Silent-executor skill for coding agents.', url: 'https://github.com/erayendes/oduncu' },
  { name: 'Madenci', what: 'Minimal-code mode for coding agents: the smallest complete change.', url: 'https://github.com/erayendes/madenci' },
  { name: 'Mimir', what: 'AI usage limits in your macOS menu bar.', url: 'https://github.com/erayendes/mimir' },
  { name: 'Delling', what: 'A light, dark and auto theme switcher for any web page.', url: 'https://github.com/erayendes/themeSwitcher' },
];

const GITHUB_MARK = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

function siblingCard(s: (typeof SIBLINGS)[number], i: number): string {
  const cls = i === 0 ? 'sib lead-sib' : 'sib';
  const inner = `<span class="name">${s.name}</span><span class="what">${s.what}</span>`
    + `<span class="foot"><span>MIT · free</span>${s.url ? GITHUB_MARK : '<span>in development</span>'}</span>`;
  return s.url
    ? `<a class="${cls}" href="${s.url}" target="_blank" rel="noreferrer">${inner}</a>`
    : `<div class="${cls}">${inner}</div>`;
}

export const SETUP_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Heimdall setup</title>
<style>
${DESIGN_TOKENS}

/* ---------- the setup page: layout only, every value a token ---------- */
.layout { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 760px) 280px; gap: var(--sp-6); align-items: start; }
main { padding: var(--sp-6) var(--sp-4); display: grid; gap: var(--sp-4); }
@media (max-width: 960px) { .layout { grid-template-columns: minmax(0, 1fr); max-width: 760px; gap: 0; } }

/* Also from Milowda: Kortext's sibling cards, as a sidebar. */
.sibs { padding: calc(var(--sp-6) + 6px) var(--sp-4) var(--sp-6) 0; display: grid; gap: var(--sp-2); }
@media (max-width: 960px) { .sibs { padding: 0 var(--sp-4) var(--sp-6); } }
.sibs-head { font-size: var(--fs-label); color: var(--fg-muted); margin-bottom: var(--sp-1); }
.sibs-head a { color: inherit; }
.sibs-head a:hover { color: var(--fg); }
.sib { display: flex; flex-direction: column; gap: 3px; padding: var(--sp-3) var(--sp-4); border: 1px solid var(--border);
  border-radius: var(--r-lg); background: var(--bg-subtle); text-decoration: none; }
.sib.lead-sib { border-color: var(--border-strong); }
a.sib:hover { border-color: var(--border-strong); background: var(--bg-muted); }
.sib .name { font-size: var(--fs-ui); color: var(--fg); font-weight: 500; }
.sib .what { font-size: var(--fs-label); color: var(--fg-muted); }
.sib .foot { display: flex; justify-content: space-between; align-items: center; padding-top: var(--sp-2); font-size: var(--fs-micro); color: var(--fg-muted); }
a.sib:hover .foot svg { color: var(--fg); }
header { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; }
h1 { font-size: var(--fs-title); font-weight: 600; margin: 0; flex: 1; }
.note { margin: 0; padding: var(--sp-3) var(--sp-4); border-radius: var(--r-md); font-size: var(--fs-ui);
  color: var(--fg); background: var(--amber-bg); border: 1px solid var(--amber-border); }
.dry { font-size: var(--fs-ui); color: var(--amber); background: var(--amber-bg); border: 1px solid var(--amber-border);
  border-radius: var(--r-pill); padding: 0 var(--sp-2); }
section { background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--r-lg); padding: var(--sp-5); }
section.locked { opacity: .5; pointer-events: none; }
h2 { font-size: var(--fs-heading); font-weight: 600; margin: 0 0 var(--sp-1); display: flex; gap: var(--sp-2); align-items: baseline; }
h2 .n { font-family: var(--font-mono); font-size: var(--fs-label); color: var(--fg-muted); font-weight: 500; }
h2 .n.done { color: var(--green); }
.lead { margin: 0 0 var(--sp-4); color: var(--fg-secondary); }
.eyebrow { font-family: var(--font-mono); font-size: var(--fs-micro); color: var(--fg-muted); text-transform: uppercase; letter-spacing: .04em; margin: 0 0 var(--sp-2); }

.list { border-top: 1px solid var(--border); }
.info-pill { font-size: var(--fs-micro); font-weight: 500; color: var(--blue); background: var(--blue-bg); border: 1px solid var(--blue-border);
  border-radius: var(--r-pill); padding: 0 var(--sp-2); white-space: nowrap; }
.pills { display: inline-flex; gap: var(--sp-1); margin-left: var(--sp-2); vertical-align: 1px; }
.parts-head { font-size: var(--fs-ui); font-weight: 500; color: var(--fg-secondary); margin: 0 0 var(--sp-1); }
.item { border-bottom: 1px solid var(--border); }
.item:last-child { border-bottom: 0; }
.item-head { display: flex; gap: var(--sp-3); align-items: flex-start; padding: var(--sp-2) var(--sp-2); cursor: pointer;
  border-radius: var(--r-sm); transition: background var(--speed) var(--ease); }
.item-head:hover { background: var(--bg-hover); }
.item-text { flex: 1; min-width: 0; }
.item .title { font-weight: 500; }
.item .plain { font-weight: 400; color: var(--fg-secondary); }
.item .does { font-size: var(--fs-ui); color: var(--fg-muted); }
.item .meta { font-family: var(--font-mono); font-size: var(--fs-label); color: var(--fg-muted); white-space: nowrap; margin-top: 2px; }
.item-head .kx-req-check { top: 3px; }
.chev.blank { visibility: hidden; }
.chev { font-family: var(--font-mono); font-size: var(--fs-label); color: var(--fg-muted); width: var(--sp-4); text-align: center; flex: none;
  transition: transform var(--speed) var(--ease); }
.item.open .chev { transform: rotate(90deg); }
.item-body { padding: 0 var(--sp-2) var(--sp-3) calc(16px + var(--sp-3) + var(--sp-2)); display: grid; gap: var(--sp-2); }
.need-pill { font-size: var(--fs-micro); font-weight: 500; color: var(--amber); background: var(--amber-bg); border: 1px solid var(--amber-border);
  border-radius: var(--r-pill); padding: 0 var(--sp-2); white-space: nowrap; }
.parts { display: grid; gap: var(--sp-1); }
.part { display: flex; gap: var(--sp-2); align-items: flex-start; font-size: var(--fs-ui); cursor: pointer; padding: var(--sp-1) 0; }
.part .name { font-family: var(--font-mono); font-size: var(--fs-label); }
.part .count { font-family: var(--font-mono); font-size: var(--fs-label); color: var(--fg-muted); }
.part .h { color: var(--fg-muted); }
.part { margin: 0 calc(-1 * var(--sp-2)); padding: var(--sp-1) var(--sp-2); border-radius: var(--r-sm); transition: background var(--speed) var(--ease); }
.part:hover { background: var(--bg-hover); }
.saved { border-top: 1px solid var(--border); margin-top: var(--sp-3); padding-top: var(--sp-3); }
.saved .msg { margin: var(--sp-1) 0 var(--sp-2); }
.role-tag { font-size: var(--fs-ui); color: var(--fg-muted); margin-left: var(--sp-2); }

.need { background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-md); padding: var(--sp-3) var(--sp-4); margin-bottom: var(--sp-4); }
.need .role { font-size: var(--fs-doc); }
.need .why { color: var(--fg-muted); font-size: var(--fs-ui); }

ol.help { padding-left: var(--sp-5); color: var(--fg-secondary); }
ol.help li { margin: var(--sp-1) 0; }
textarea.help { color: var(--fg); }
.help + .input, .help + .drop { margin-top: var(--sp-2); }
.field-row { display: flex; justify-content: space-between; align-items: baseline; gap: var(--sp-3); }
.field-row label.field { margin-bottom: var(--sp-1); }
.help-link { background: none; border: 0; padding: 0; cursor: pointer; color: var(--fg-secondary); font: inherit; font-size: var(--fs-ui); font-weight: 500; white-space: nowrap; }
.help-link:hover { color: var(--fg); }
.help { margin: var(--sp-1) 0 0; color: var(--fg-muted); font-size: var(--fs-ui); }

label.field { display: block; margin: var(--sp-3) 0 var(--sp-1); font-size: var(--fs-ui); font-weight: 500; }
label.field .hint { font-weight: 400; color: var(--fg-muted); }
.input { width: 100%; }
textarea.input { height: auto; min-height: 96px; padding: var(--sp-2); font-family: var(--font-mono); font-size: var(--fs-label); resize: vertical; }
.drop { border: 1px dashed var(--border-strong); border-radius: var(--r-md); padding: var(--sp-4); text-align: center;
  color: var(--fg-muted); background: var(--bg); cursor: pointer; font-size: var(--fs-ui); }
.drop:hover, .drop.over { border-color: var(--border-hover); background: var(--bg-hover); }
.drop.has { border-style: solid; color: var(--fg); }
.drop:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--accent-ring); }

.row { display: flex; gap: var(--sp-2); align-items: center; margin-top: var(--sp-3); flex-wrap: wrap; }
.msg { font-size: var(--fs-ui); }
.ok { color: var(--green); } .warn { color: var(--amber); } .bad { color: var(--red); }
.opt { display: flex; gap: var(--sp-3); padding: var(--sp-2) 0; border-top: 1px solid var(--border); align-items: flex-start; cursor: pointer; }
.opt:first-child { border-top: 0; }
.opt .t { font-weight: 500; }
.opt .h { color: var(--fg-muted); font-size: var(--fs-ui); }
.found { font-size: var(--fs-micro); color: var(--green); margin-left: var(--sp-2); }
.plan { margin: var(--sp-3) 0 0; padding-left: var(--sp-5); }
.plan li { margin: var(--sp-1) 0; }
.plan .add { color: var(--green); font-family: var(--font-mono); font-size: var(--fs-label); }
.plan .rm { color: var(--red); font-family: var(--font-mono); font-size: var(--fs-label); }
.plan .mv { color: var(--fg-secondary); font-family: var(--font-mono); font-size: var(--fs-label); }
pre.out { white-space: pre-wrap; background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: var(--sp-3); font-family: var(--font-mono); font-size: var(--fs-label); margin: var(--sp-3) 0 0; }
a { color: var(--fg); }
.hidden { display: none !important; }
.totals { position: sticky; bottom: 0; margin: 0 calc(-1 * var(--sp-4)); padding: var(--sp-3) var(--sp-4);
  background: var(--bg); border-top: 1px solid var(--border); font-size: var(--fs-ui); color: var(--fg-secondary); }
.totals b { color: var(--fg); font-weight: 600; }
.totals .ver { float: right; color: var(--fg-muted); font-family: var(--font-mono); font-size: var(--fs-label); }
</style>
</head>
<body>
<div class="layout">
<main>
  <header>
    <h1>Heimdall setup</h1>
    <span id="dry" class="dry hidden">Dry run — nothing will be saved</span>
  </header>
  <p id="desktopNote" class="note hidden"></p>

  <section id="s1">
    <h2><span class="n" id="n1">1/4</span>What do you want Heimdall to help with?</h2>
    <p class="lead">Pick only what you use. Every extra tool is more for the AI to read, so a short list makes it
      faster. What you set up before is already picked.</p>
    <div id="rows" class="list"><p class="lead">Loading…</p></div>
  </section>

  <section id="s2">
    <h2><span class="n" id="n2">2/4</span>Your App Store Connect key</h2>
    <div class="need">
      <div id="need"></div>
      <div id="reuseBox" class="saved hidden">
        <div>Using your saved key: <span class="mono" id="savedKey"></span><span id="savedRole" class="role-tag"></span></div>
        <p id="reuseMsg" class="msg"></p>
        <div class="row" style="margin-top:0">
          <button class="btn btn-link-primary" id="reuseNo">Use a new key instead</button>
        </div>
      </div>
      <div id="keyBox" class="saved hidden">
        <div class="field-row">
          <label class="field" for="keyId">Key ID</label>
          <button type="button" class="help-link" data-help="how">How do I create a key?</button>
        </div>
        <ol class="help hidden" id="how">
          <li>Open <a id="keysLink" target="_blank" rel="noreferrer">App Store Connect → Users and Access → Integrations</a>
            Only the Account Holder or an Admin can create keys; if that isn't you, ask one of them
            for a key with the <b class="roleName"></b> role.</li>
          <li>Copy the <b>Issuer ID</b> from the top of the page.</li>
          <li>Click <b>+</b>, name the key (say, "Heimdall") and give it the <b class="roleName"></b> role.</li>
          <li>Copy its <b>Key ID</b> from the list, then click <b>Download</b> for the <b>.p8</b> file.
            Apple lets you download it only once, so keep it somewhere safe.</li>
        </ol>
        <input class="input mono" type="text" id="keyId" placeholder="ABC123XYZ9" autocomplete="off" spellcheck="false">
        <label class="field" for="issuerId">Issuer ID</label>
        <input class="input mono" type="text" id="issuerId" placeholder="57246e4f-1a2b-4c3d-9e8f-0123456789ab" autocomplete="off" spellcheck="false">
        <div class="field-row">
          <label class="field">Key file (.p8) <span class="hint">— it stays on this computer</span></label>
          <button type="button" class="help-link" data-help="pem">Paste it instead</button>
        </div>
        <textarea class="input help hidden" id="pem" placeholder="Only if you can't use the file: -----BEGIN PRIVATE KEY-----" spellcheck="false"></textarea>
        <div class="drop" id="drop" tabindex="0">Drop the .p8 file here, or click to choose it</div>
        <input type="file" id="file" accept=".p8" class="hidden">
        <div class="row"><button class="btn btn-secondary" id="verify">Check with Apple</button><button class="btn btn-link-primary hidden" id="backToSaved">Use the saved key instead</button><span id="vmsg" class="msg"></span></div>
        <p id="fitMsg" class="msg"></p>
      </div>
    </div>

    <div id="vendorBox" class="hidden">
      <div class="field-row">
        <label class="field" for="vendor">Vendor number <span class="hint">— for sales and finance reports</span></label>
        <button type="button" class="help-link" data-help="vendorHelp">Where do I find it?</button>
      </div>
      <p class="help hidden" id="vendorHelp">
        In App Store Connect, open <a href="https://appstoreconnect.apple.com/itc/payments_and_financial_reports" target="_blank" rel="noreferrer">Payments and Financial Reports</a>.
        It is in the top left, under your company name. You can leave it empty and add it later.
      </p>
      <input class="input mono" type="text" id="vendor" placeholder="85012345" autocomplete="off" spellcheck="false">
      <p class="help hidden" id="vendorAdmin">The very first request for a new report type needs an Admin key, once.</p>
    </div>
  </section>

  <section id="s3">
    <h2><span class="n" id="n3">3/4</span>Which AI apps should get Heimdall?</h2>
    <p class="lead">Tick the apps you talk to. These are the ones we found on this computer. Untick an app to remove Heimdall from it.</p>
    <div id="clients"><p class="lead">Looking for AI apps on this computer…</p></div>
  </section>

  <section id="s4" class="locked">
    <h2><span class="n" id="n4">4/4</span>Check and finish</h2>
    <p class="lead" style="margin:0">What will change in each app. Nothing is written until you press Apply.</p>
    <ul id="plan" class="plan"></ul>
    <div class="row">
      <button class="btn btn-primary" id="apply" disabled>Apply</button>
      <button class="btn btn-link-primary" id="cancel">Cancel</button>
    </div>
    <pre id="out" class="out hidden"></pre>
  </section>
  <div class="totals" id="totals" aria-live="polite"></div>
</main>
<aside class="sibs" id="sibs" aria-label="Also from Milowda">
  <div class="sibs-head">Also from <a href="https://milowda.com" target="_blank" rel="noreferrer">Milowda</a></div>
  ${SIBLINGS.map(siblingCard).join('\n  ')}
</aside>
</div>
<script>
(function () {
  var token = new URLSearchParams(location.search).get('t') || '';
  history.replaceState(null, '', '/');
  var $ = function (id) { return document.getElementById(id); };
  var state, boxes = {}, pem = '', reuse = false, keyReady = false, finished = false, applying = false, role = '';

  function call(name, body) {
    return fetch('/api/' + name, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-setup-token': token },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || r.statusText); return j; });
    });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function check() { var b = el('input', 'kx-req-check'); b.type = 'checkbox'; return b; }
  function mark(n) { $('n' + n).classList.add('done'); $('n' + n).textContent = '✓'; }
  function setMsg(id, text, kind) { var m = $(id); m.textContent = text; m.className = 'msg ' + (kind || ''); }
  /**
   * The plan follows the picks: any change in steps 1–3 re-reads it, after a
   * short pause so a run of clicks costs one request, and a slow answer to an
   * older selection never overwrites a newer one.
   */
  var planTimer = 0, planSeq = 0;
  function invalidatePlan() {
    // Once Apply is pressed the plan is settled, and the server closes when it
    // is done: a refresh then would only report that it is gone.
    if (applying || finished) return;
    $('apply').disabled = true;
    clearTimeout(planTimer);
    planSeq++; // an answer already on its way is for a selection that no longer stands
    // Say why Apply is off rather than leave a dead button.
    if (!keyReady) { say('Add your key in step 2 first.'); return; }
    planTimer = setTimeout(refreshPlan, 250);
  }
  function vendorChanged() {
    var v = $('vendor').value.trim();
    return v !== '' && !(state.existing && state.existing.vendorNumber === v);
  }
  function say(text) { var list = $('plan'); list.innerHTML = ''; list.appendChild(el('li', '', text)); }
  function refreshPlan() {
    var sel = selection(), seq = ++planSeq, list = $('plan');
    // Nothing picked would unregister every profile: that is an uninstall, not a setup.
    if (!leaves().length) { say('Pick at least one thing in step 1.'); return; }
    if (!sel.clients.length) { say('Tick at least one app in step 3.'); return; }
    call('plan', sel).then(function (r) {
      if (seq !== planSeq || applying || finished) return;
      list.innerHTML = '';
      var shown = r.plan.filter(function (p) {
        return p.add.length || p.remove.length || p.rewrites.length || p.userManaged.length ||
          p.coreWithheld.length || p.deadDeleted.length || p.deadReported.length;
      });
      if (!shown.length) {
        list.appendChild(el('li', '', r.plan.length
          ? 'Your profiles stay as they are.'
          : reuse && !vendorChanged()
            ? 'No changes — your apps already match this selection.'
            : 'Your apps already match this selection. Apply saves your key details.'));
      }
      shown.forEach(function (p) {
        var li = el('li'); li.appendChild(el('b', '', p.client + ': '));
        if (p.add.length) li.appendChild(el('span', 'add', '+ ' + p.add.join(', ') + ' '));
        if (p.remove.length) li.appendChild(el('span', 'rm', '− ' + p.remove.join(', ') + ' '));
        if (p.deadDeleted.length) li.appendChild(el('span', 'rm', 'delete dead ' + p.deadDeleted.join(', ') + ' '));
        if (p.rewrites.length) li.appendChild(el('span', 'mv', 'rewrite ' + p.rewrites.join(', ') + ' '));
        if (p.coreWithheld.length) li.appendChild(el('span', 'mv', 'ASC-Core not added (' + p.coreWithheld.join('; ') + ') '));
        if (p.deadReported.length) li.appendChild(el('span', 'mv', 'dead, left as is: ' + p.deadReported.join(', ') + ' '));
        if (p.userManaged.length) li.appendChild(el('span', 'mv', 'user-managed, unchanged: ' + p.userManaged.join(', ') + ' '));
        list.appendChild(li);
      });
      // Nothing to change and nothing new to save: Apply would do nothing.
      $('apply').disabled = reuse && !vendorChanged() && !r.plan.some(function (p) {
        return p.add.length || p.remove.length || p.rewrites.length || p.deadDeleted.length;
      });
    }).catch(function (e) { if (seq === planSeq && !applying && !finished) list.textContent = e.message; });
  }

  /* ---- step 1: needs ---------------------------------------------------- */

  function children(i) { return state.rows.filter(function (r) { return r.parent === i; }); }
  /** The rows that end up registered: a profile without parts, or the ticked parts of a ticked profile. */
  function leaves() {
    var out = [];
    state.rows.forEach(function (r) {
      if (r.parent !== null || !boxes[r.index].checked) return;
      var parts = children(r.index);
      if (!parts.length) out.push(r);
      parts.forEach(function (c) { if (boxes[c.index].checked) out.push(c); });
    });
    return out;
  }

  function size(r) { return r.tools + ' tools · ~' + r.ktokens + 'k tokens'; }
  /** What a choice asks for beyond the key: amber for the role, blue for a value to look up. */
  function pills(r) {
    var wrap = el('span', 'pills');
    if (r.roles.length === 1) wrap.appendChild(el('span', 'need-pill', 'Admin key'));
    if (r.vendor && r.parent === null) wrap.appendChild(el('span', 'info-pill', 'Vendor no.'));
    return wrap.childNodes.length ? wrap : null;
  }

  function renderRows() {
    var wrap = $('rows'); wrap.innerHTML = '';
    var picked = new Set(state.preselected);
    state.rows.filter(function (r) { return r.parent === null; }).forEach(function (r) {
      var parts = children(r.index);
      var item = el('div', 'item');
      var head = el('div', 'item-head');
      var box = check(); box.checked = picked.has(r.index); box.value = r.index;
      boxes[r.index] = box;
      var text = el('div', 'item-text');
      var title = el('div', 'title', r.title || r.name);
      // Only when it says something the name does not: "App Clips (App Clips)" would be noise.
      if (r.plain && r.plain !== r.title) title.appendChild(el('span', 'plain', ' (' + r.plain + ')'));
      var p = pills(r); if (p) title.appendChild(p);
      text.appendChild(title);
      text.appendChild(el('div', 'does', r.does || r.hint));
      head.appendChild(box); head.appendChild(text);
      head.appendChild(el('span', 'meta', size(r)));
      // Only a profile with parts opens; the others have nothing more to show.
      var chev = el('span', 'chev' + (parts.length ? '' : ' blank'), '›');
      head.appendChild(chev);
      item.appendChild(head);

      var body = null;
      function setOpen(open) {
        if (!body) return;
        item.classList.toggle('open', open);
        body.classList.toggle('hidden', !open);
      }
      if (parts.length) {
        body = el('div', 'item-body hidden');
        var list = el('div', 'parts');
        list.appendChild(el('p', 'parts-head', 'Parts of ' + (r.title || r.name) + ' — untick what you don\u2019t need'));
        parts.forEach(function (c) {
          var line = el('label', 'part');
          var cb = check(); cb.value = c.index;
          cb.checked = picked.has(c.index);
          boxes[c.index] = cb;
          var txt = el('div');
          var t = el('div'); t.appendChild(el('span', 'name', c.name));
          t.appendChild(document.createTextNode(' '));
          t.appendChild(el('span', 'count', size(c)));
          var cp = pills(c); if (cp) t.appendChild(cp);
          txt.appendChild(t); txt.appendChild(el('div', 'h', c.does || c.hint.replace(/^~[0-9]+k · /, '')));
          line.appendChild(cb); line.appendChild(txt); list.appendChild(line);
          cb.addEventListener('change', function () {
            // Ticking a part picks its profile; unticking the last one drops it.
            if (cb.checked) box.checked = true;
            else if (!parts.some(function (q) { return boxes[q.index].checked; })) { box.checked = false; setOpen(false); }
            update();
          });
        });
        body.appendChild(list);
        item.appendChild(body);
        if (box.checked) setOpen(true);
      }

      head.addEventListener('click', function (e) {
        if (e.target === box) return;
        if (body) setOpen(!item.classList.contains('open'));
        else { box.checked = !box.checked; update(); }
      });
      box.addEventListener('change', function () {
        parts.forEach(function (c) { boxes[c.index].checked = box.checked; });
        // Picking a profile opens its parts at once; dropping it folds them away.
        setOpen(box.checked);
        update();
      });
      wrap.appendChild(item);
    });
    update();
  }

  /** What the picks cost the AI, summed: every tool is something it reads on each request. */
  function showTotals(picked) {
    var t = $('totals'); t.innerHTML = '';
    if (!picked.length) { t.textContent = 'Nothing picked yet.'; t.appendChild(el('span', 'ver', state.version)); return; }
    var tools = 0, k = 0;
    picked.forEach(function (r) { tools += r.tools; k += r.ktokens; });
    t.appendChild(document.createTextNode('Picked: '));
    t.appendChild(el('b', '', tools + ' tools'));
    t.appendChild(document.createTextNode(' · about ' + k + 'k tokens for the AI to read'));
    t.appendChild(el('span', 'ver', state.version));
  }

  /* ---- step 2: what the key must be, worked out from step 1 -------------- */

  function update() {
    var picked = leaves();
    showTotals(picked);
    var need = $('need'); need.innerHTML = '';
    if (!picked.length) {
      need.appendChild(el('div', 'why', 'Pick at least one thing above, and we will tell you what kind of key to create.'));
      role = '';
    } else {
      var allowed = state.narrowFirst.filter(function (name) { return picked.every(function (r) { return r.roles.indexOf(name) !== -1; }); });
      role = allowed[0] || 'Admin';
      need.appendChild(el('p', 'eyebrow', 'For what you picked'));
      var line = el('div', 'role'); line.appendChild(document.createTextNode('You need a key with the '));
      line.appendChild(el('b', '', role)); line.appendChild(document.createTextNode(' role.'));
      need.appendChild(line);
      var forcing = picked.filter(function (r) { return r.roles.length === 1; }).map(function (r) {
        if (r.title) return r.title;
        var parent = state.rows[r.parent];
        return (parent.title || parent.name) + ' (' + r.name + ')';
      });
      var why = role === 'Admin'
        ? (forcing.length ? 'Because you picked ' + forcing.join(', ') + ', which only Admin can manage.'
                          : 'A key has one role, and no narrower role covers all of these together.')
        : 'That is the narrowest role that covers everything you picked. Narrower is safer.';
      need.appendChild(el('div', 'why', why));
    }
    Array.prototype.forEach.call(document.querySelectorAll('.roleName'), function (n) { n.textContent = role || 'right'; });
    $('vendorBox').classList.toggle('hidden', !picked.some(function (r) { return r.vendor; }));
    $('vendorAdmin').classList.toggle('hidden', role === 'Admin');
    showFit();
    invalidatePlan();
  }

  /**
   * Whether a key is Admin is the one thing about its role Apple will tell us
   * (only Admin can list team members); the finer role it will not. So the
   * page compares that one fact with what the picks need.
   */
  var savedAdmin = null, newAdmin = null;
  function fit(admin) {
    if (!role || admin === null) return ['', ''];
    if (admin === true) {
      return role === 'Admin'
        ? ['✓ It is an Admin key, which is what you need.', 'ok']
        : ['It is an Admin key, so it can do more than you picked. It will work; a key with the ' + role + ' role would be safer.', 'warn'];
    }
    return role === 'Admin'
      ? ["It isn't an Admin key, so the parts marked “Admin key” won't work. Create an Admin key, or untick them.", 'warn']
      : ["It isn't an Admin key. It will work if its role is " + role + ' or one that covers it.', ''];
  }
  function showFit() {
    var a = fit(savedAdmin); setMsg('reuseMsg', a[0], a[1]);
    if (keyReady && !reuse) { var b = fit(newAdmin); setMsg('fitMsg', b[0], b[1]); }
  }
  function checkAdmin(saved) {
    call('admin', { reuse: saved }).then(function (r) {
      if (saved) {
        savedAdmin = r.admin;
        $('savedRole').textContent = r.admin === true ? '· Admin role' : r.admin === false ? '· not Admin' : state.dryRun ? '· role not checked in a dry run' : '';
      } else newAdmin = r.admin;
      showFit();
    });
  }

  function keyDone() {
    keyReady = true; mark(2);
    $('s4').classList.remove('locked');
    if (!reuse) checkAdmin(false);
    showFit();
    invalidatePlan();
  }

  /* ---- step 3: apps, step 4: review ------------------------------------- */

  function selection() {
    var clients = Array.prototype.map.call(document.querySelectorAll('#clients input:checked'), function (b) { return b.value; });
    var picked = [];
    state.rows.forEach(function (r) { if (boxes[r.index] && boxes[r.index].checked) picked.push(r.index); });
    return { clients: clients, picked: picked };
  }

  function option(container, value, title, hint, checked, found) {
    var row = el('label', 'opt');
    var box = check(); box.value = value; box.checked = checked;
    var text = el('div'); var t = el('div', 't', title);
    if (found) t.appendChild(el('span', 'found', 'found'));
    text.appendChild(t); if (hint) text.appendChild(el('div', 'h', hint));
    row.appendChild(box); row.appendChild(text); container.appendChild(row);
  }

  function readFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      pem = String(reader.result || '').trim();
      var d = $('drop');
      if (pem.indexOf('PRIVATE KEY') === -1) { d.className = 'drop'; d.textContent = file.name + " doesn't look like a .p8 key. Try another file."; pem = ''; return; }
      d.className = 'drop has'; d.textContent = '✓ ' + file.name;
    };
    reader.readAsText(file);
  }

  call('state').then(function (s) {
    state = s;
    if (s.dryRun) $('dry').classList.remove('hidden');
    var notes = {
      open: '⚠️ Claude Desktop is open. It writes its own settings back while it runs, so the change would not reach it. Quit Claude Desktop (⌘Q) before you press Apply.',
      inside: '⚠️ This setup is running inside Claude Desktop, so Claude Desktop itself can\u2019t be updated from here. Your other AI apps can. To include Claude Desktop: quit it, open Terminal and run ' + s.setupCommand + '.'
    };
    if (notes[s.desktop]) { $('desktopNote').textContent = notes[s.desktop]; $('desktopNote').classList.remove('hidden'); }
    $('keysLink').href = s.keysUrl;
    if (s.existing) {
      // A saved key is the answer unless the user says otherwise, as in the terminal's [Y/n].
      $('savedKey').textContent = s.existing.keyId; $('reuseBox').classList.remove('hidden');
      checkAdmin(true);
      reuse = true;
    }
    else { $('keyBox').classList.remove('hidden'); $('how').classList.remove('hidden'); }
    $('clients').innerHTML = '';
    // Apps not found stay folded away: they are rarely the answer, and a list
    // of unticked rows reads as more to decide.
    var missing = s.clients.filter(function (c) { return !c.present; });
    s.clients.forEach(function (c) { if (c.present) option($('clients'), c.id, c.label, '', true, true); });
    if (missing.length) {
      var more = el('div', 'hidden'); more.id = 'moreClients';
      missing.forEach(function (c) { option(more, c.id, c.label, c.hint, false, false); });
      var label = 'Don\u2019t see your app? Show ' + missing.length + ' more';
      var toggle = el('button', 'help-link', label);
      toggle.type = 'button'; toggle.style.marginTop = 'var(--sp-2)';
      toggle.onclick = function () {
        var open = more.classList.toggle('hidden') === false;
        toggle.textContent = open ? 'Show fewer' : label;
      };
      $('clients').appendChild(toggle); $('clients').appendChild(more);
    }
    $('clients').addEventListener('change', invalidatePlan);
    $('vendor').addEventListener('input', invalidatePlan);
    renderRows();
    if (reuse) keyDone();
  }).catch(function (e) { document.querySelector('main').textContent = 'This link has expired or is invalid. To start again, run npx -y ${PACKAGE} setup --web in your terminal. (' + e.message + ')'; });

  $('reuseNo').onclick = function () {
    // The saved key is no longer the one: nothing applies until the new one is checked.
    reuse = false; keyReady = false; $('n2').classList.remove('done'); $('n2').textContent = '2/4';
    $('s4').classList.add('locked'); invalidatePlan();
    $('reuseBox').classList.add('hidden'); $('keyBox').classList.remove('hidden'); $('backToSaved').classList.remove('hidden');
  };
  $('backToSaved').onclick = function () {
    $('keyBox').classList.add('hidden'); $('backToSaved').classList.add('hidden'); $('reuseBox').classList.remove('hidden');
    reuse = true; keyDone();
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-help]'), function (b) {
    b.onclick = function () { $(b.getAttribute('data-help')).classList.toggle('hidden'); };
  });

  var drop = $('drop');
  drop.onclick = function () { $('file').click(); };
  drop.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); } };
  $('file').onchange = function () { if (this.files[0]) readFile(this.files[0]); };
  drop.ondragover = function (e) { e.preventDefault(); drop.classList.add('over'); };
  drop.ondragleave = function () { drop.classList.remove('over'); };
  drop.ondrop = function (e) { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };

  var verdicts = {
    ok: ['✓ Apple accepted the key.', 'ok'],
    skipped: ['Dry run: the key was not sent to Apple.', 'warn'],
    unreachable: ["Couldn't reach Apple to check (offline?). You can continue and check later.", 'warn'],
    invalid: ['Apple rejected this key. Check that the Key ID, Issuer ID and file belong to the same key.', 'bad'],
    'bad-key-id': ['A Key ID is 8–12 letters and digits, like ABC123XYZ9.', 'bad'],
    'bad-issuer-id': ['An Issuer ID looks like 57246e4f-1a2b-4c3d-9e8f-0123456789ab.', 'bad'],
    'bad-key-file': ['Add the .p8 key file first.', 'bad']
  };
  $('verify').onclick = function () {
    var btn = this; btn.disabled = true; setMsg('vmsg', 'Checking with Apple…');
    call('verify', { keyId: $('keyId').value, issuerId: $('issuerId').value, pem: pem || $('pem').value })
      .then(function (r) {
        var v = verdicts[r.verdict] || [r.verdict, 'bad']; setMsg('vmsg', v[0], v[1]);
        if (r.verdict === 'ok' || r.verdict === 'unreachable' || r.verdict === 'skipped') {
          ['keyId', 'issuerId', 'pem'].forEach(function (id) { $(id).disabled = true; });
          keyDone();
        } else btn.disabled = false;
      })
      .catch(function (e) { setMsg('vmsg', e.message, 'bad'); btn.disabled = false; });
  };


  $('apply').onclick = function () {
    applying = true; clearTimeout(planTimer); planSeq++;
    this.disabled = true; $('cancel').disabled = true;
    var body = selection();
    body.reuse = reuse; body.vendorNumber = $('vendor').value;
    var out = $('out'); out.classList.remove('hidden'); out.textContent = 'Applying…';
    call('apply', body).then(function (r) {
      finished = true; mark(1); mark(3); mark(4);
      out.textContent = r.lines.join('\\n') + '\\n\\nAll set. You can close this tab.';
    }).catch(function (e) {
      // Nothing was applied: let the user fix what the message says and try again.
      applying = false; out.textContent = e.message; $('apply').disabled = false; $('cancel').disabled = false;
    });
  };

  $('cancel').onclick = function () {
    call('cancel').finally(function () { document.querySelector('main').textContent = 'Setup cancelled. Nothing was changed. To start again, run ' + ((state && state.setupCommand) || 'npx -y ${PACKAGE} setup') + ' --web in your terminal; it prints a new link.'; });
  };
  window.addEventListener('beforeunload', function (e) { if (!finished && state) e.preventDefault(); });
})();
</script>
</body>
</html>
`;
