/**
 * The page `setup --web` serves. One self-contained document: no external
 * script, font or stylesheet, so it works offline and loads nothing the CSP
 * would have to allow. The token arrives in the URL and is moved into memory
 * and out of the address bar on load.
 *
 * Needs come first: what the user picks decides which key role to create and
 * which extra values to look up, so they are told before they make the key,
 * not after.
 */
export const SETUP_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Heimdall setup</title>
<style>
  :root {
    --bg: #f6f7f9; --card: #ffffff; --text: #16181d; --muted: #5d6470; --line: #e3e6eb;
    --accent: #2f6fed; --accent-text: #ffffff; --ok: #1f8a4c; --warn: #a86400; --bad: #c62f2f;
    --soft: #eef3fe; --pick: #f3f7ff;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #101215; --card: #181b20; --text: #e8eaee; --muted: #9aa1ad; --line: #2a2f37;
      --accent: #5b8cff; --accent-text: #0b0d10; --ok: #46c27a; --warn: #e3a33b; --bad: #f06a6a;
      --soft: #1d2533; --pick: #19202c;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text);
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 32px 16px 64px; }
  header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  h1 { font-size: 22px; margin: 0; }
  .badge { font-size: 12px; padding: 2px 8px; border-radius: 99px; background: var(--soft); color: var(--accent); }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  section.locked { opacity: .45; pointer-events: none; }
  h2 { font-size: 17px; margin: 0 0 4px; display: flex; gap: 10px; align-items: center; }
  h2 .n { width: 24px; height: 24px; border-radius: 50%; background: var(--soft); color: var(--accent); flex: none;
    display: inline-flex; align-items: center; justify-content: center; font-size: 13px; }
  h2 .n.done { background: var(--ok); color: var(--card); }
  p.lead { margin: 0 0 16px; color: var(--muted); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 10px; }
  .card { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; cursor: pointer; display: flex; gap: 10px; align-items: flex-start; }
  .card.on { border-color: var(--accent); background: var(--pick); }
  .card input { margin-top: 4px; flex: none; }
  .card .title { font-weight: 650; }
  .card .does { font-size: 14px; color: var(--muted); }
  .card .eg { font-size: 13px; color: var(--muted); font-style: italic; margin-top: 4px; }
  .card .meta { font: 11px ui-monospace, Menlo, monospace; color: var(--muted); margin-top: 6px; }
  .pill { font: 600 11px -apple-system, sans-serif; padding: 1px 7px; border-radius: 99px; background: var(--soft); color: var(--warn); margin-left: 6px; }
  .parts { margin-top: 8px; font-size: 13px; }
  .parts summary { color: var(--accent); cursor: pointer; }
  .parts label { display: flex; gap: 8px; align-items: flex-start; padding: 4px 0; }
  .parts .h { color: var(--muted); }
  .need { background: var(--soft); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
  .need .role { font-size: 16px; }
  .need ul { margin: 6px 0 0; padding-left: 20px; }
  .need .why { color: var(--muted); font-size: 13px; }
  details.how { margin: 10px 0 0; font-size: 14px; }
  details.how summary { color: var(--accent); cursor: pointer; font-weight: 600; }
  details.how ol { margin: 8px 0 0; padding-left: 20px; } details.how li { margin: 3px 0; }
  label.field { display: block; margin: 14px 0 4px; font-weight: 600; font-size: 13px; }
  label.field .hint { font-weight: 400; color: var(--muted); }
  input[type=text], textarea { width: 100%; padding: 9px 11px; border: 1px solid var(--line); border-radius: 8px;
    background: var(--bg); color: var(--text); font: inherit; }
  textarea { font: 12px/1.4 ui-monospace, Menlo, monospace; min-height: 96px; }
  input:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .drop { margin-top: 4px; border: 1.5px dashed var(--line); border-radius: 10px; padding: 18px; text-align: center; color: var(--muted); cursor: pointer; }
  .drop.over { border-color: var(--accent); background: var(--soft); }
  .drop.has { border-style: solid; border-color: var(--ok); color: var(--text); }
  details.small { margin-top: 6px; color: var(--muted); font-size: 13px; }
  details.small summary { cursor: pointer; }
  button { font: inherit; font-weight: 600; border-radius: 8px; padding: 9px 16px; cursor: pointer;
    border: 1px solid var(--accent); background: var(--accent); color: var(--accent-text); }
  button.ghost { background: transparent; color: var(--accent); }
  button:disabled { opacity: .5; cursor: default; }
  .row { display: flex; gap: 10px; align-items: center; margin-top: 16px; flex-wrap: wrap; }
  .msg { font-size: 14px; }
  .ok { color: var(--ok); } .warn { color: var(--warn); } .bad { color: var(--bad); }
  .opt { display: flex; gap: 10px; padding: 8px 4px; border-top: 1px solid var(--line); align-items: flex-start; }
  .opt:first-child { border-top: 0; }
  .opt input { margin-top: 4px; }
  .opt .t { font-weight: 600; } .opt .h { color: var(--muted); font-size: 13px; }
  .tag { font-size: 11px; color: var(--ok); margin-left: 6px; font-weight: 600; }
  .plan li { margin: 4px 0; } .plan .add { color: var(--ok); } .plan .rm { color: var(--bad); }
  pre.out { white-space: pre-wrap; background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
    padding: 12px; font: 12px/1.5 ui-monospace, Menlo, monospace; }
  a { color: var(--accent); }
  .hidden { display: none !important; }
</style>
</head>
<body>
<main>
  <header><h1>Heimdall setup</h1><span id="dry" class="badge hidden">Dry run — nothing will be saved</span></header>

  <section id="s1">
    <h2><span class="n" id="n1">1</span>What do you want Heimdall to help with?</h2>
    <p class="lead">Pick only what you use. Every extra tool is more for the AI to read, so a short list makes it
      faster. What you set up before is already picked.</p>
    <div id="rows" class="grid"><p class="lead">Loading…</p></div>
  </section>

  <section id="s2">
    <h2><span class="n" id="n2">2</span>Your App Store Connect key</h2>
    <div class="need" id="need"></div>

    <div id="reuseBox" class="hidden">
      <p class="lead" style="margin-bottom:0">You already have a saved key (Key ID <b id="savedKey"></b>).</p>
      <div class="row" id="reuseButtons">
        <button id="reuseYes">Use it</button>
        <button id="reuseNo" class="ghost">Use a new key</button>
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
      <input type="text" id="keyId" placeholder="ABC123XYZ9" autocomplete="off" spellcheck="false">
      <label class="field" for="issuerId">Issuer ID</label>
      <input type="text" id="issuerId" placeholder="57246e4f-1a2b-4c3d-9e8f-0123456789ab" autocomplete="off" spellcheck="false">
      <label class="field">Key file (.p8) <span class="hint">— it stays on this computer</span></label>
      <div class="drop" id="drop" tabindex="0">Drop the .p8 file here, or click to choose it</div>
      <input type="file" id="file" accept=".p8" class="hidden">
      <details class="small"><summary>Or paste its contents</summary>
        <textarea id="pem" placeholder="-----BEGIN PRIVATE KEY-----" spellcheck="false"></textarea>
      </details>
      <div class="row"><button id="verify">Check with Apple</button><span id="vmsg" class="msg"></span></div>
    </div>

    <div id="vendorBox" class="hidden">
      <label class="field" for="vendor">Vendor number <span class="hint">— for sales and finance reports</span></label>
      <input type="text" id="vendor" placeholder="85012345" autocomplete="off" spellcheck="false">
      <details class="small"><summary>Where do I find it?</summary>
        In App Store Connect, open <a href="https://appstoreconnect.apple.com/itc/payments_and_financial_reports" target="_blank" rel="noreferrer">Payments and Financial Reports</a>.
        It is in the top left, under your company name. You can leave it empty and add it later.
      </details>
    </div>
    <div id="bundleBox" class="hidden">
      <label class="field" for="bundle">App bundle ID <span class="hint">— for customer purchase lookups</span></label>
      <input type="text" id="bundle" placeholder="com.example.app" autocomplete="off" spellcheck="false">
      <details class="small"><summary>Where do I find it?</summary>
        In App Store Connect, open your app, then App Information. It is listed as Bundle ID.
      </details>
    </div>
  </section>

  <section id="s3" class="locked">
    <h2><span class="n" id="n3">3</span>Which AI apps should get Heimdall?</h2>
    <p class="lead">Tick the apps you talk to. We found the ticked ones on this computer.</p>
    <div id="clients"><p class="lead">Looking for AI apps on this computer…</p></div>
  </section>

  <section id="s4" class="locked">
    <h2><span class="n" id="n4">4</span>Check and finish</h2>
    <p class="lead">See exactly what will change in each app before anything is written.</p>
    <div class="row"><button id="review" class="ghost">Show the changes</button></div>
    <ul id="plan" class="plan"></ul>
    <div class="row"><button id="apply" disabled>Apply</button><button id="cancel" class="ghost">Cancel</button></div>
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

  function renderRows() {
    var wrap = $('rows'); wrap.innerHTML = '';
    var picked = new Set(state.preselected);
    state.rows.filter(function (r) { return r.parent === null; }).forEach(function (r) {
      var card = el('label', 'card');
      var box = el('input'); box.type = 'checkbox'; box.checked = picked.has(r.index); box.value = r.index;
      boxes[r.index] = box;
      var body = el('div');
      var title = el('div', 'title', r.title || r.name);
      if (r.roles.length === 1) title.appendChild(el('span', 'pill', 'Admin key'));
      body.appendChild(title);
      body.appendChild(el('div', 'does', r.does || r.hint));
      if (r.example) body.appendChild(el('div', 'eg', '“' + r.example + '”'));
      body.appendChild(el('div', 'meta', r.name + ' · ' + r.tools + ' tools'));
      var parts = children(r.index);
      if (parts.length) {
        var det = el('details', 'parts');
        det.appendChild(el('summary', '', 'Choose parts (' + parts.length + ')'));
        parts.forEach(function (c) {
          var line = el('label');
          var cb = el('input'); cb.type = 'checkbox'; cb.value = c.index;
          cb.checked = picked.has(c.index) || !picked.has(r.index);
          boxes[c.index] = cb;
          var txt = el('div');
          var t = el('div', '', c.name + ' · ' + c.tools + ' tools');
          if (c.roles.length === 1) t.appendChild(el('span', 'pill', 'Admin key'));
          txt.appendChild(t); txt.appendChild(el('div', 'h', c.hint.replace(/^~\\d+k · /, '')));
          line.appendChild(cb); line.appendChild(txt); det.appendChild(line);
          cb.addEventListener('change', update);
          line.addEventListener('click', function (e) { e.stopPropagation(); });
        });
        det.addEventListener('click', function (e) { e.stopPropagation(); });
        det.classList.toggle('hidden', !box.checked);
        body.appendChild(det);
        box.addEventListener('change', function () {
          det.classList.toggle('hidden', !box.checked);
          if (box.checked) parts.forEach(function (c) { boxes[c.index].checked = true; });
        });
      }
      box.addEventListener('change', update);
      card.appendChild(box); card.appendChild(body); wrap.appendChild(card);
    });
    update();
  }

  /* ---- step 2: what the key must be, worked out from step 1 -------------- */

  function update() {
    state.rows.forEach(function (r) {
      if (r.parent === null) boxes[r.index].closest('.card').classList.toggle('on', boxes[r.index].checked);
    });
    var picked = leaves();
    var need = $('need'); need.innerHTML = '';
    if (!picked.length) {
      need.appendChild(el('div', '', 'Pick at least one thing above, and we will tell you what kind of key to create.'));
      role = '';
    } else {
      var allowed = NARROW_FIRST.filter(function (name) { return picked.every(function (r) { return r.roles.indexOf(name) !== -1; }); });
      role = allowed[0] || 'Admin';
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
      else if (adminAnswer === false) setMsg(id, "This key isn't Admin, so the tools marked “Admin key” won't work. Create an Admin key, or untick them.", 'warn');
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

  function option(container, value, title, hint, checked, tag) {
    var row = el('label', 'opt');
    var box = el('input'); box.type = 'checkbox'; box.value = value; box.checked = checked;
    var text = el('div'); var t = el('div', 't', title);
    if (tag) t.appendChild(el('span', 'tag', tag));
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
    s.clients.forEach(function (c) { option($('clients'), c.id, c.label, c.present ? '' : c.hint, c.present, c.present ? 'found' : ''); });
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
