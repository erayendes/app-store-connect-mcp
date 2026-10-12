/**
 * The page `setup --web` serves. One self-contained document: no external
 * script, font or stylesheet, so it works offline and loads nothing the CSP
 * would have to allow. The token arrives in the URL and is moved into memory
 * and out of the address bar on load.
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
    --soft: #eef3fe;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #101215; --card: #181b20; --text: #e8eaee; --muted: #9aa1ad; --line: #2a2f37;
      --accent: #5b8cff; --accent-text: #0b0d10; --ok: #46c27a; --warn: #e3a33b; --bad: #f06a6a;
      --soft: #1d2533;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text);
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 720px; margin: 0 auto; padding: 32px 16px 64px; }
  header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
  h1 { font-size: 22px; margin: 0; }
  .badge { font-size: 12px; padding: 2px 8px; border-radius: 99px; background: var(--soft); color: var(--accent); }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  section.locked { opacity: .45; pointer-events: none; }
  h2 { font-size: 16px; margin: 0 0 4px; display: flex; gap: 10px; align-items: center; }
  h2 .n { width: 24px; height: 24px; border-radius: 50%; background: var(--soft); color: var(--accent);
    display: inline-flex; align-items: center; justify-content: center; font-size: 13px; }
  h2 .n.done { background: var(--ok); color: var(--card); }
  p.lead { margin: 0 0 16px; color: var(--muted); }
  label.field { display: block; margin: 12px 0 4px; font-weight: 600; font-size: 13px; }
  input[type=text], textarea { width: 100%; padding: 9px 11px; border: 1px solid var(--line); border-radius: 8px;
    background: var(--bg); color: var(--text); font: inherit; }
  textarea { font: 12px/1.4 ui-monospace, Menlo, monospace; min-height: 96px; }
  input:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .drop { margin-top: 4px; border: 1.5px dashed var(--line); border-radius: 10px; padding: 18px; text-align: center;
    color: var(--muted); cursor: pointer; }
  .drop.over { border-color: var(--accent); background: var(--soft); }
  .drop.has { border-style: solid; border-color: var(--ok); color: var(--text); }
  details { margin-top: 8px; color: var(--muted); font-size: 13px; }
  button { font: inherit; font-weight: 600; border-radius: 8px; padding: 9px 16px; cursor: pointer;
    border: 1px solid var(--accent); background: var(--accent); color: var(--accent-text); }
  button.ghost { background: transparent; color: var(--accent); }
  button:disabled { opacity: .5; cursor: default; }
  .row { display: flex; gap: 10px; align-items: center; margin-top: 16px; flex-wrap: wrap; }
  .msg { font-size: 14px; }
  .msg.ok { color: var(--ok); } .msg.warn { color: var(--warn); } .msg.bad { color: var(--bad); }
  .opt { display: flex; gap: 10px; padding: 8px 4px; border-top: 1px solid var(--line); align-items: flex-start; }
  .opt:first-of-type { border-top: 0; }
  .opt input { margin-top: 4px; }
  .opt .t { font-weight: 600; }
  .opt .h { color: var(--muted); font-size: 13px; }
  .opt .code { color: var(--muted); font: 12px ui-monospace, Menlo, monospace; margin-left: 6px; font-weight: 400; }
  .opt .note { color: var(--warn); font-size: 13px; margin-top: 2px; }
  .help { background: var(--soft); border-radius: 10px; padding: 12px 16px; margin: 0 0 8px; font-size: 14px; }
  .help ol { margin: 6px 0 0; padding-left: 20px; } .help li { margin: 3px 0; }
  .field .hint { font-weight: 400; color: var(--muted); }
  .below { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .tag { font-size: 11px; color: var(--ok); margin-left: 6px; font-weight: 600; }
  .sub { margin-left: 28px; }
  .plan li { margin: 4px 0; }
  .plan .add { color: var(--ok); } .plan .rm { color: var(--bad); }
  pre.out { white-space: pre-wrap; background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
    padding: 12px; font: 12px/1.5 ui-monospace, Menlo, monospace; }
  a { color: var(--accent); }
  .hidden { display: none; }
</style>
</head>
<body>
<main>
  <header><h1>Heimdall setup</h1><span id="dry" class="badge hidden">Dry run — nothing will be saved</span></header>

  <section id="s1">
    <h2><span class="n" id="n1">1</span>Connect your App Store Connect account</h2>
    <div id="reuseBox" class="hidden">
      <p class="lead">Saved credentials found: Key ID <b id="savedKey"></b>.</p>
      <div class="row">
        <button id="reuseYes">Keep them</button>
        <button id="reuseNo" class="ghost">Enter a new key</button>
      </div>
    </div>
    <div id="keyBox" class="hidden">
      <p class="lead">Heimdall talks to Apple with an API key that you create once. It takes about two minutes,
        and the key file never leaves this computer.</p>
      <div class="help"><b>Where to find these</b>
        <ol>
          <li>Open <a id="keysLink" target="_blank" rel="noreferrer">App Store Connect → Users and Access → Integrations</a>.
            You need to be the Account Holder or an Admin to see this page.</li>
          <li>The <b>Issuer ID</b> is at the top of the page. Copy it.</li>
          <li>Click <b>+</b> to create a key. Give it a name (say, "Heimdall") and pick a role:
            <b>App Manager</b> covers most work; choose <b>Admin</b> only if you want Heimdall to manage team members,
            certificates or webhooks.</li>
          <li>The new key appears in the list with its <b>Key ID</b>. Click <b>Download</b> to get the <b>.p8</b> file —
            Apple lets you download it only once, so keep it somewhere safe.</li>
        </ol>
      </div>
      <label class="field" for="keyId">Key ID</label>
      <input type="text" id="keyId" placeholder="ABC123XYZ9" autocomplete="off" spellcheck="false">
      <label class="field" for="issuerId">Issuer ID</label>
      <input type="text" id="issuerId" placeholder="57246e4f-1a2b-4c3d-9e8f-0123456789ab" autocomplete="off" spellcheck="false">
      <label class="field">Key file (.p8)</label>
      <div class="drop" id="drop" tabindex="0">Drop the .p8 file here, or click to choose it</div>
      <input type="file" id="file" accept=".p8" class="hidden">
      <details><summary>Or paste its contents</summary>
        <textarea id="pem" placeholder="-----BEGIN PRIVATE KEY-----" spellcheck="false"></textarea>
      </details>
      <div class="row"><button id="verify">Check with Apple</button><span id="vmsg" class="msg"></span></div>
    </div>
  </section>

  <section id="s2" class="locked">
    <h2><span class="n" id="n2">2</span>Which AI apps should get Heimdall?</h2>
    <p class="lead">Tick the apps you talk to. We found the ticked ones on this computer.</p>
    <div id="clients"><p class="lead">Looking for AI apps on this computer…</p></div>
  </section>

  <section id="s3" class="locked">
    <h2><span class="n" id="n3">3</span>What should Heimdall be able to do?</h2>
    <p class="lead">Pick only what you use: every extra tool is something the AI has to read through, so fewer
      choices make it faster and sharper. What you set up before is already ticked; untick to remove it.</p>
    <div id="rows"></div>
    <div id="vendorBox" class="hidden">
      <label class="field" for="vendor">Vendor number <span class="hint">(for sales and finance reports)</span></label>
      <input type="text" id="vendor" placeholder="85012345" autocomplete="off" spellcheck="false">
      <div class="below">In App Store Connect, open <a href="https://appstoreconnect.apple.com/itc/payments_and_financial_reports" target="_blank" rel="noreferrer">Payments and Financial Reports</a>;
        the number is in the top left, under your company name. Leave it empty to add it later.</div>
    </div>
    <div id="bundleBox" class="hidden">
      <label class="field" for="bundle">App bundle ID <span class="hint">(for customer purchase lookups)</span></label>
      <input type="text" id="bundle" placeholder="com.example.app" autocomplete="off" spellcheck="false">
      <div class="below">In App Store Connect, open your app → App Information; it is listed as Bundle ID.
        Leave it empty if you don't need to look up customer purchases.</div>
    </div>
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
  var state, pem = '', reuse = false, finished = false;

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
  function unlock(n) { $('s' + n).classList.remove('locked'); }
  function mark(n) { $('n' + n).classList.add('done'); $('n' + n).textContent = '✓'; }
  function msg(text, kind) { var m = $('vmsg'); m.textContent = text; m.className = 'msg ' + (kind || ''); }

  function credentialsDone() { mark(1); unlock(2); unlock(3); unlock(4); }

  function option(container, value, title, hint, checked, extraClass, tag, code, note) {
    var row = el('label', 'opt' + (extraClass ? ' ' + extraClass : ''));
    var box = el('input'); box.type = 'checkbox'; box.value = value; box.checked = checked;
    var text = el('div'); var t = el('div', 't', title);
    if (code) t.appendChild(el('span', 'code', code));
    if (tag) t.appendChild(el('span', 'tag', tag));
    text.appendChild(t); if (hint) text.appendChild(el('div', 'h', hint));
    if (note) text.appendChild(el('div', 'note', note));
    row.appendChild(box); row.appendChild(text); container.appendChild(row);
    return box;
  }

  function renderRows() {
    var wrap = $('rows'); wrap.innerHTML = '';
    var picked = new Set(state.preselected);
    var boxes = {};
    state.rows.forEach(function (r) {
      var count = (r.label.match(/\\((\\d+)\\)$/) || [])[1];
      var name = r.label.replace(/\\(\\d+\\)$/, '');
      var b = r.title
        ? option(wrap, r.index, r.title, '', picked.has(r.index), '', '', name + ' · ' + count + ' tools', r.note)
        : option(wrap, r.index, name + ' · ' + count + ' tools', r.hint, picked.has(r.index), r.parent === null ? '' : 'sub', '', '', r.note);
      boxes[r.index] = { box: b, row: r, line: b.parentNode };
    });
    function sync() {
      state.rows.forEach(function (r) {
        if (r.parent !== null) boxes[r.index].line.classList.toggle('hidden', !boxes[r.parent].box.checked);
      });
      function anyOn(flag) {
        return state.rows.some(function (r) {
          var on = boxes[r.index].box.checked && (r.parent === null || boxes[r.parent].box.checked);
          return on && r[flag];
        });
      }
      $('bundleBox').classList.toggle('hidden', !anyOn('storekit'));
      $('vendorBox').classList.toggle('hidden', !anyOn('vendor'));
      $('apply').disabled = true; $('plan').innerHTML = '';
    }
    state.rows.forEach(function (r) {
      boxes[r.index].box.addEventListener('change', function () {
        if (r.parent === null && boxes[r.index].box.checked) {
          // Checking a profile turns on all of its sub-profiles, as the terminal does.
          state.rows.forEach(function (c) { if (c.parent === r.index) boxes[c.index].box.checked = true; });
        }
        sync();
      });
    });
    sync();
  }

  function selection() {
    var clients = Array.prototype.map.call(document.querySelectorAll('#clients input:checked'), function (b) { return b.value; });
    var picked = Array.prototype.map.call(document.querySelectorAll('#rows input:checked'), function (b) { return Number(b.value); });
    return { clients: clients, picked: picked };
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
    else $('keyBox').classList.remove('hidden');
    $('clients').innerHTML = '';
    s.clients.forEach(function (c) { option($('clients'), c.id, c.label, c.hint, c.present, '', c.present ? 'found' : ''); });
    $('clients').addEventListener('change', function () { $('apply').disabled = true; $('plan').innerHTML = ''; });
    renderRows();
  }).catch(function (e) { document.querySelector('main').textContent = 'This link has expired or is invalid. Run setup again. (' + e.message + ')'; });

  $('reuseYes').onclick = function () { reuse = true; $('reuseBox').querySelector('.lead').textContent = 'Keeping the saved key.'; this.parentNode.remove(); credentialsDone(); renderRows(); };
  $('reuseNo').onclick = function () { $('reuseBox').classList.add('hidden'); $('keyBox').classList.remove('hidden'); };

  var drop = $('drop');
  drop.onclick = function () { $('file').click(); };
  drop.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); } };
  $('file').onchange = function () { if (this.files[0]) readFile(this.files[0]); };
  drop.ondragover = function (e) { e.preventDefault(); drop.classList.add('over'); };
  drop.ondragleave = function () { drop.classList.remove('over'); };
  drop.ondrop = function (e) { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };

  var verdicts = {
    ok: ['Apple accepted the key.', 'ok'],
    skipped: ['Dry run: the key was not sent to Apple.', 'warn'],
    unreachable: ["Couldn't reach Apple to check (offline?). You can continue; run a status check later.", 'warn'],
    invalid: ['Apple rejected this key. Check that the Key ID, Issuer ID and file belong to the same key.', 'bad'],
    'bad-key-id': ['A Key ID is 8–12 letters and digits, like ABC123XYZ9.', 'bad'],
    'bad-issuer-id': ['An Issuer ID looks like 57246e4f-1a2b-4c3d-9e8f-0123456789ab.', 'bad'],
    'bad-key-file': ['Add the .p8 key file first.', 'bad']
  };
  $('verify').onclick = function () {
    var btn = this; btn.disabled = true; msg('Checking with Apple…');
    call('verify', { keyId: $('keyId').value, issuerId: $('issuerId').value, pem: pem || $('pem').value })
      .then(function (r) {
        var v = verdicts[r.verdict] || [r.verdict, 'bad']; msg(v[0], v[1]);
        if (r.verdict === 'ok' || r.verdict === 'unreachable' || r.verdict === 'skipped') { credentialsDone(); ['keyId', 'issuerId', 'pem'].forEach(function (id) { $(id).disabled = true; }); }
        else btn.disabled = false;
      })
      .catch(function (e) { msg(e.message, 'bad'); btn.disabled = false; });
  };

  $('review').onclick = function () {
    $('plan').innerHTML = '<li>Reading your apps\u2019 current setup…</li>';
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
      finished = true; mark(4);
      var out = $('out'); out.classList.remove('hidden');
      out.textContent = r.lines.join('\\n') + '\\n\\nAll set. You can close this tab.';
    }).catch(function (e) { $('out').classList.remove('hidden'); $('out').textContent = e.message; });
  };

  $('cancel').onclick = function () {
    call('cancel').finally(function () { document.querySelector('main').textContent = 'Setup cancelled. Nothing was changed. You can close this tab.'; });
  };
  window.addEventListener('beforeunload', function (e) { if (!finished && state) { e.preventDefault(); } });
})();
</script>
</body>
</html>
`;
