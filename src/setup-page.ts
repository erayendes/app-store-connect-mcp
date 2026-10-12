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

export const SETUP_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Heimdall setup</title>
<style>
${DESIGN_TOKENS}

/* ---------- the setup page: layout only, every value a token ---------- */
main { max-width: 760px; margin: 0 auto; padding: var(--sp-6) var(--sp-4); display: grid; gap: var(--sp-4); }
header { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; }
h1 { font-size: var(--fs-title); font-weight: 600; margin: 0; flex: 1; }
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
.item .eg { font-size: var(--fs-ui); color: var(--fg-secondary); margin-top: var(--sp-1); }
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

.need { background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-md); padding: var(--sp-3) var(--sp-4); margin-bottom: var(--sp-4); }
.need .role { font-size: var(--fs-doc); }
.need .why { color: var(--fg-muted); font-size: var(--fs-ui); }
.need ul { margin: var(--sp-1) 0 0; padding-left: var(--sp-5); }

details.how { margin: 0 0 var(--sp-3); }
details summary { cursor: pointer; color: var(--fg-secondary); font-size: var(--fs-ui); font-weight: 500; }
details summary:hover { color: var(--fg); }
details.how ol { margin: var(--sp-2) 0 0; padding-left: var(--sp-5); color: var(--fg-secondary); }
details.how li { margin: var(--sp-1) 0; }
details.small { margin-top: var(--sp-1); color: var(--fg-muted); font-size: var(--fs-ui); }

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
pre.out { white-space: pre-wrap; background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: var(--sp-3); font-family: var(--font-mono); font-size: var(--fs-label); margin: var(--sp-3) 0 0; }
a { color: var(--fg); }
.hidden { display: none !important; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Heimdall setup</h1>
    <span id="dry" class="dry hidden">Dry run — nothing will be saved</span>
  </header>

  <section id="s1">
    <h2><span class="n" id="n1">1/4</span>What do you want Heimdall to help with?</h2>
    <p class="lead">Pick only what you use. Every extra tool is more for the AI to read, so a short list makes it
      faster. What you set up before is already picked.</p>
    <div id="rows" class="list"><p class="lead">Loading…</p></div>
  </section>

  <section id="s2">
    <h2><span class="n" id="n2">2/4</span>Your App Store Connect key</h2>
    <div class="need" id="need"></div>

    <div id="reuseBox" class="hidden">
      <p class="lead" style="margin:0">You already have a saved key: <span class="mono" id="savedKey"></span>.</p>
      <div class="row" id="reuseButtons">
        <button class="btn btn-secondary" id="reuseYes">Use it</button>
        <button class="btn btn-link-primary" id="reuseNo">Use a new key instead</button>
      </div>
      <p id="reuseMsg" class="msg"></p>
    </div>

    <div id="keyBox" class="hidden">
      <details class="how" id="how"><summary>How do I create a key?</summary>
        <ol>
          <li>Open <a id="keysLink" target="_blank" rel="noreferrer">App Store Connect → Users and Access → Integrations</a>
            (only the Account Holder or an Admin can see it).</li>
          <li>Copy the <b>Issuer ID</b> from the top of the page.</li>
          <li>Click <b>+</b>, name the key (say, "Heimdall") and give it the <b class="roleName"></b> role.</li>
          <li>Copy its <b>Key ID</b> from the list, then click <b>Download</b> for the <b>.p8</b> file.
            Apple lets you download it only once, so keep it somewhere safe.</li>
        </ol>
      </details>
      <label class="field" for="keyId">Key ID</label>
      <input class="input mono" type="text" id="keyId" placeholder="ABC123XYZ9" autocomplete="off" spellcheck="false">
      <label class="field" for="issuerId">Issuer ID</label>
      <input class="input mono" type="text" id="issuerId" placeholder="57246e4f-1a2b-4c3d-9e8f-0123456789ab" autocomplete="off" spellcheck="false">
      <label class="field">Key file (.p8) <span class="hint">— it stays on this computer</span></label>
      <div class="drop" id="drop" tabindex="0">Drop the .p8 file here, or click to choose it</div>
      <input type="file" id="file" accept=".p8" class="hidden">
      <details class="small"><summary>Or paste its contents</summary>
        <textarea class="input" id="pem" placeholder="-----BEGIN PRIVATE KEY-----" spellcheck="false"></textarea>
      </details>
      <div class="row"><button class="btn btn-secondary" id="verify">Check with Apple</button><span id="vmsg" class="msg"></span></div>
    </div>

    <div id="vendorBox" class="hidden">
      <label class="field" for="vendor">Vendor number <span class="hint">— for sales and finance reports</span></label>
      <input class="input mono" type="text" id="vendor" placeholder="85012345" autocomplete="off" spellcheck="false">
      <details class="small"><summary>Where do I find it?</summary>
        In App Store Connect, open <a href="https://appstoreconnect.apple.com/itc/payments_and_financial_reports" target="_blank" rel="noreferrer">Payments and Financial Reports</a>.
        It is in the top left, under your company name. You can leave it empty and add it later.
      </details>
    </div>
    <div id="bundleBox" class="hidden">
      <label class="field" for="bundle">App bundle ID <span class="hint">— for customer purchase lookups</span></label>
      <input class="input mono" type="text" id="bundle" placeholder="com.example.app" autocomplete="off" spellcheck="false">
      <details class="small"><summary>Where do I find it?</summary>
        In App Store Connect, open your app, then App Information. It is listed as Bundle ID.
      </details>
    </div>
  </section>

  <section id="s3" class="locked">
    <h2><span class="n" id="n3">3/4</span>Which AI apps should get Heimdall?</h2>
    <p class="lead">Tick the apps you talk to. We found the ticked ones on this computer.</p>
    <div id="clients"><p class="lead">Looking for AI apps on this computer…</p></div>
  </section>

  <section id="s4" class="locked">
    <h2><span class="n" id="n4">4/4</span>Check and finish</h2>
    <p class="lead" style="margin:0">See exactly what will change in each app before anything is written.</p>
    <div class="row"><button class="btn btn-secondary" id="review">Show the changes</button></div>
    <ul id="plan" class="plan"></ul>
    <div class="row">
      <button class="btn btn-primary" id="apply" disabled>Apply</button>
      <button class="btn btn-link-primary" id="cancel">Cancel</button>
    </div>
    <pre id="out" class="out hidden"></pre>
  </section>
</main>
<script>
(function () {
  var token = new URLSearchParams(location.search).get('t') || '';
  history.replaceState(null, '', '/');
  var $ = function (id) { return document.getElementById(id); };
  var NARROW_FIRST = ['Customer Support', 'Sales', 'Finance', 'Marketing', 'Developer', 'App Manager', 'Admin'];
  var state, boxes = {}, pem = '', reuse = false, keyReady = false, finished = false, role = '';

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
  function invalidatePlan() { $('apply').disabled = true; $('plan').innerHTML = ''; }

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
    if (r.storekit && r.parent !== null) wrap.appendChild(el('span', 'info-pill', 'Bundle ID'));
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
      var p = pills(r); if (p) title.appendChild(p);
      text.appendChild(title);
      text.appendChild(el('div', 'does', r.does || r.hint));
      if (r.example) text.appendChild(el('div', 'eg', 'Try: “' + r.example + '”'));
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
          txt.appendChild(t); txt.appendChild(el('div', 'h', c.hint.replace(/^~[0-9]+k · /, '')));
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

  /* ---- step 2: what the key must be, worked out from step 1 -------------- */

  function update() {
    var picked = leaves();
    var need = $('need'); need.innerHTML = '';
    if (!picked.length) {
      need.appendChild(el('div', 'why', 'Pick at least one thing above, and we will tell you what kind of key to create.'));
      role = '';
    } else {
      var allowed = NARROW_FIRST.filter(function (name) { return picked.every(function (r) { return r.roles.indexOf(name) !== -1; }); });
      role = allowed[0] || 'Admin';
      need.appendChild(el('p', 'eyebrow', 'For what you picked'));
      var line = el('div', 'role'); line.appendChild(document.createTextNode('Create a key with the '));
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
      var extras = [];
      if (picked.some(function (r) { return r.vendor; })) extras.push('your vendor number, for sales reports');
      if (picked.some(function (r) { return r.storekit; })) extras.push("your app's bundle ID, for customer purchase lookups");
      if (extras.length) {
        need.appendChild(el('div', '', 'You will also need:'));
        var ul = el('ul'); extras.forEach(function (x) { ul.appendChild(el('li', '', x)); }); need.appendChild(ul);
      }
      if (picked.some(function (r) { return r.vendor; }) && role !== 'Admin') {
        need.appendChild(el('div', 'why', 'The very first request for a new report type needs an Admin key, once.'));
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('.roleName'), function (n) { n.textContent = role || 'right'; });
    $('vendorBox').classList.toggle('hidden', !picked.some(function (r) { return r.vendor; }));
    $('bundleBox').classList.toggle('hidden', !picked.some(function (r) { return r.storekit; }));
    if (keyReady) checkAdmin();
    invalidatePlan();
  }

  /** Only Admin can list team members: ask Apple once the key is known, when Admin is what the picks need. */
  var adminAnswer = null;
  function checkAdmin() {
    var id = reuse ? 'reuseMsg' : 'vmsg';
    if (role !== 'Admin') { if (reuse) setMsg(id, ''); return; }
    var show = function () {
      if (adminAnswer === true) setMsg(id, '✓ This key has the Admin role.', 'ok');
      else if (adminAnswer === false) setMsg(id, "This key isn't Admin, so the parts marked “Admin key” won't work. Create an Admin key, or untick them.", 'warn');
    };
    if (adminAnswer !== null) return show();
    call('admin', { reuse: reuse }).then(function (r) { adminAnswer = r.admin; show(); });
  }

  function keyDone() {
    keyReady = true; mark(2);
    $('s3').classList.remove('locked'); $('s4').classList.remove('locked');
    checkAdmin();
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
    $('keysLink').href = s.keysUrl;
    if (s.existing) { $('savedKey').textContent = s.existing.keyId; $('reuseBox').classList.remove('hidden'); }
    else { $('keyBox').classList.remove('hidden'); $('how').open = true; }
    $('clients').innerHTML = '';
    s.clients.forEach(function (c) { option($('clients'), c.id, c.label, c.present ? '' : c.hint, c.present, c.present); });
    $('clients').addEventListener('change', invalidatePlan);
    renderRows();
  }).catch(function (e) { document.querySelector('main').textContent = 'This link has expired or is invalid. Run setup again. (' + e.message + ')'; });

  $('reuseYes').onclick = function () { reuse = true; $('reuseButtons').remove(); keyDone(); };
  $('reuseNo').onclick = function () { $('reuseBox').classList.add('hidden'); $('keyBox').classList.remove('hidden'); };

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

  $('review').onclick = function () {
    $('plan').innerHTML = '<li>Reading your apps\\u2019 current setup…</li>';
    call('plan', selection()).then(function (r) {
      var list = $('plan'); list.innerHTML = '';
      if (!r.plan.length) list.appendChild(el('li', '', 'No changes — your apps already match this selection.'));
      r.plan.forEach(function (p) {
        var li = el('li'); li.appendChild(el('b', '', p.client + ': '));
        if (p.add.length) li.appendChild(el('span', 'add', '+ ' + p.add.join(', ') + ' '));
        if (p.remove.length) li.appendChild(el('span', 'rm', '− ' + p.remove.join(', ')));
        list.appendChild(li);
      });
      $('apply').disabled = false;
    }).catch(function (e) { $('plan').textContent = e.message; });
  };

  $('apply').onclick = function () {
    this.disabled = true; $('cancel').disabled = true; $('review').disabled = true;
    var body = selection();
    body.reuse = reuse; body.vendorNumber = $('vendor').value; body.bundleId = $('bundle').value;
    var out = $('out'); out.classList.remove('hidden'); out.textContent = 'Applying…';
    call('apply', body).then(function (r) {
      finished = true; mark(1); mark(3); mark(4);
      out.textContent = r.lines.join('\\n') + '\\n\\nAll set. Restart your AI apps, then you can close this tab.';
    }).catch(function (e) { out.textContent = e.message; });
  };

  $('cancel').onclick = function () {
    call('cancel').finally(function () { document.querySelector('main').textContent = 'Setup cancelled. Nothing was changed. You can close this tab.'; });
  };
  window.addEventListener('beforeunload', function (e) { if (!finished && state) e.preventDefault(); });
})();
</script>
</body>
</html>
`;
