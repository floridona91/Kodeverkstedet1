(() => {
  "use strict";

  const draftKey = "kodeverkstedet-laererutkast-v1";
  const sourceTasks = Array.isArray(window.KODEOPPGAVER) ? window.KODEOPPGAVER : [];
  const forms = { analog: "Analog", scratch: "Scratch", python: "Python" };
  const levels = { nybegynner: "Nybegynner", videre: "Litt øvet", utfordring: "Utfordring" };
  const formIcon = { analog: "↱", scratch: "◈", python: "⌘" };
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const copy = value => JSON.parse(JSON.stringify(value));
  const $ = id => document.getElementById(id);
  const status = $("save-status");
  const msg = $("publish-message");
  const announce = $("announce");
  let storageWorks = true;

  function normalizeTask(t, index) {
    if (!t || typeof t !== "object" || Array.isArray(t)) throw new Error(`Oppgave ${index + 1} har feil format.`);
    const strings = key => typeof t[key] === "string" ? t[key] : "";
    const array = key => Array.isArray(t[key]) ? t[key].map(x => typeof x === "string" ? x : String(x ?? "")) : [];
    return {
      id: strings("id") || generateId(),
      form: forms[t.form] ? t.form : "analog",
      niva: levels[t.niva] ? t.niva : "nybegynner",
      tid: Number.isFinite(Number(t.tid)) ? Number(t.tid) : 20,
      tittel: strings("tittel"),
      beskrivelse: strings("beskrivelse"),
      mal: array("mal"),
      utstyr: strings("utstyr"),
      steg: array("steg"),
      tips: strings("tips"),
      ekstra: strings("ekstra"),
      ...(strings("kode") ? { kode: strings("kode") } : {}),
      ...(strings("lenke") ? { lenke: strings("lenke") } : {})
    };
  }

  function generateId() {
    return `oppgave-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function readDraft() {
    try {
      const text = localStorage.getItem(draftKey);
      if (!text) return null;
      const result = JSON.parse(text);
      if (!result || result.version !== 1 || !Array.isArray(result.tasks) || result.tasks.length > 2000) return null;
      return result.tasks.map(normalizeTask);
    } catch { return null; }
  }

  const existingDraft = readDraft();
  let tasks = existingDraft ?? sourceTasks.map(normalizeTask);
  let selectedId = tasks[0]?.id ?? null;
  let filter = "alle";
  let search = "";
  let previewOpen = false;

  function saveDraft() {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ version: 1, updated: new Date().toISOString(), tasks }));
      storageWorks = true;
      const hhmm = new Intl.DateTimeFormat("nb-NO", { hour: "2-digit", minute: "2-digit" }).format(new Date());
      status.textContent = `Utkast lagret i denne nettleseren kl. ${hhmm}`;
    } catch {
      storageWorks = false;
      status.textContent = "Nettleseren kan ikke lagre. Last ned en sikkerhetskopi nå.";
    }
  }

  function changed(message) {
    saveDraft();
    $("task-count").textContent = String(tasks.length);
    renderTaskList();
    if (previewOpen) renderPreview();
    if (message) announce.textContent = message;
    msg.hidden = true;
  }

  function current() { return tasks.find(t => t.id === selectedId) ?? null; }

  function renderTaskList() {
    const list = $("task-list");
    const matches = tasks.filter(t => (filter === "alle" || t.form === filter) &&
      (!search || `${t.tittel} ${t.beskrivelse}`.toLocaleLowerCase("nb").includes(search)));
    list.innerHTML = matches.length ? matches.map(t => `
      <button class="task-list-item ${selectedId === t.id ? "active" : ""}" type="button" data-select-task="${safe(t.id)}" aria-current="${selectedId === t.id ? "true" : "false"}">
        <span class="task-icon ${safe(t.form)}" aria-hidden="true">${formIcon[t.form]}</span>
        <span class="task-list-body"><strong>${safe(t.tittel.trim() || "Ny oppgave uten tittel")}</strong><small>${forms[t.form]} · ${levels[t.niva]} · ${safe(t.tid)} min</small></span>
        <span class="task-list-arrow" aria-hidden="true">›</span>
      </button>`).join("") : `<div class="list-empty">Ingen oppgaver her. Prøv et annet søk eller opprett en ny.</div>`;
    $("task-count").textContent = tasks.length;
    document.querySelectorAll("[data-filter]").forEach(b => {
      const isActive = b.dataset.filter === filter;
      b.classList.toggle("selected", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });
  }

  function selectTask(id) {
    if (!tasks.some(t => t.id === id)) return;
    selectedId = id;
    previewOpen = false;
    renderTaskList();
    renderForm();
  }

  function field(id, label, value, { type = "text", placeholder = "", hint = "", optional = false, rows = 3 } = {}) {
    const labelText = `${safe(label)}${optional ? ' <span class="optional">(valgfritt)</span>' : ""}`;
    const input = type === "textarea"
      ? `<textarea id="${id}" data-field="${id}" rows="${rows}" placeholder="${safe(placeholder)}">${safe(value)}</textarea>`
      : `<input id="${id}" data-field="${id}" type="${type}" value="${safe(value)}" placeholder="${safe(placeholder)}" ${type === "number" ? 'min="1" max="999" step="1"' : ""}>`;
    return `<div class="field"><label for="${id}">${labelText}</label>${input}${hint ? `<span class="field-hint">${safe(hint)}</span>` : ""}</div>`;
  }

  function options(mapping, value) {
    return Object.entries(mapping).map(([key, text]) => `<option value="${safe(key)}" ${key === value ? "selected" : ""}>${safe(text)}</option>`).join("");
  }

  function renderSteps(t) {
    $("step-list").innerHTML = t.steg.map((step, i) => `
      <div class="step-item">
        <span class="step-index">${String(i + 1).padStart(2, "0")}</span>
        <textarea class="step-input" rows="2" data-step-index="${i}" aria-label="Trinn ${i + 1}" placeholder="Hva skal eleven gjøre i dette trinnet?">${safe(step)}</textarea>
        <div class="step-actions">
          <button type="button" class="icon-button" data-move-step="up" data-index="${i}" title="Flytt trinnet opp" aria-label="Flytt trinn ${i + 1} opp" ${i === 0 ? "disabled" : ""}>↑</button>
          <button type="button" class="icon-button" data-move-step="down" data-index="${i}" title="Flytt trinnet ned" aria-label="Flytt trinn ${i + 1} ned" ${i === t.steg.length - 1 ? "disabled" : ""}>↓</button>
          <button type="button" class="icon-button" data-remove-step="${i}" title="Slett trinnet" aria-label="Slett trinn ${i + 1}">×</button>
        </div>
      </div>`).join("");
  }

  function renderForm() {
    const t = current();
    if (!t) {
      $("editor-content").innerHTML = `<div class="editor-empty"><span aria-hidden="true">✳</span><h2>Her starter du.</h2><p>Lag din første oppgave ved å klikke på knappen nedenfor.</p><button type="button" class="button button-dark" data-create-task>+ Lag en oppgave</button></div>`;
      return;
    }
    const index = tasks.findIndex(v => v.id === t.id);
    $("editor-content").innerHTML = `
      <div class="editor-head">
        <div><p class="panel-overline">REDIGER OPPGAVE ${String(index + 1).padStart(2, "0")} AV ${tasks.length}</p><h2 id="editor-title">Oppgaveeditor</h2></div>
        <div class="editor-actions">
          <button class="tiny-button" type="button" data-move-task="up" ${index === 0 ? "disabled" : ""} title="Flytt opp i rekkefølgen">↑ Flytt opp</button>
          <button class="tiny-button" type="button" data-move-task="down" ${index === tasks.length - 1 ? "disabled" : ""} title="Flytt ned i rekkefølgen">↓ Flytt ned</button>
          <button class="tiny-button" type="button" data-duplicate-task>⧉ Kopier</button>
          <button class="tiny-button danger" type="button" data-delete-task>× Slett</button>
        </div>
      </div>
      <form class="editor-form" id="task-form" novalidate>
        <section class="form-section"><h3 class="section-title"><span class="section-num">01</span> Det viktigste</h3>
          <div class="form-grid">
            <div class="field full">${field("tittel", "Navn på oppgaven *", t.tittel, {placeholder:"F.eks. Lag en animasjon i Scratch"})}</div>
            <div class="field"><label for="form">Arbeidsmåte</label><select id="form" data-field="form">${options(forms, t.form)}</select></div>
            <div class="field"><label for="niva">Vanskelighetsgrad</label><select id="niva" data-field="niva">${options(levels, t.niva)}</select></div>
            <div class="field"><label for="tid">Tidsbruk (minutter)</label><input type="number" id="tid" data-field="tid" value="${safe(t.tid)}" min="1" max="999" step="1"></div>
            <div class="field full">${field("beskrivelse", "Kort beskrivelse *", t.beskrivelse, {type:"textarea",rows:2,placeholder:"Hva skal eleven lage eller utforske?"})}</div>
          </div>
        </section>
        <section class="form-section"><h3 class="section-title"><span class="section-num">02</span> Mål og utstyr</h3>
          <div class="form-grid">
            <div class="field full">${field("mal", "Læringsmål *", t.mal.join("\n"), {type:"textarea",rows:3,placeholder:"Ett læringsmål per linje",hint:"Skriv ett læringsmål på hver linje."})}</div>
            <div class="field full">${field("utstyr", "Dette trenger elevene", t.utstyr, {placeholder:"F.eks. PC med Scratch, eller ark og blyant",optional:true})}</div>
          </div>
        </section>
        <section class="form-section"><h3 class="section-title"><span class="section-num">03</span> Slik gjør eleven det *</h3>
          <div id="step-list"></div><button type="button" class="add-step" id="add-step">+ Legg til et trinn</button>
        </section>
        <section class="form-section"><h3 class="section-title"><span class="section-num">04</span> Ekstra hjelp og utfordring</h3>
          <div class="form-grid">
            <div class="field full">${field("tips", "Hint til eleven", t.tips, {type:"textarea",rows:2,optional:true,placeholder:"Hva kan hjelpe hvis eleven står fast?"})}</div>
            <div class="field full">${field("ekstra", "Ekstra utfordring", t.ekstra, {type:"textarea",rows:2,optional:true,placeholder:"Hva kan eleven prøve når hovedoppgaven er ferdig?"})}</div>
          </div>
        </section>
        <section class="form-section">
          <details class="advanced" ${t.kode || t.lenke ? "open" : ""}><summary>+ Kodeeksempel og ekstern lenke (valgfritt)</summary>
            <div class="advanced-body">
              ${field("kode", "Kode eleven kan kopiere", t.kode || "", {type:"textarea",rows:6,optional:true,placeholder:'print("Hei verden!")',hint:"Passer spesielt godt for Python-oppgaver."})}
              ${field("lenke", "Lenke til verktøy eller prosjekt", t.lenke || "", {type:"url",optional:true,placeholder:"https://scratch.mit.edu/projects/editor/",hint:"Start lenken med https:// eller http://."})}
            </div>
          </details>
        </section>
        <div id="form-errors" class="validation-message" hidden></div>
      </form>
      <div class="editor-bottom"><button type="button" id="toggle-preview" class="button button-outline">◉ ${previewOpen ? "Skjul" : "Forhåndsvis"} oppgaven</button><a href="#publiser" class="button button-dark">↓ Klar til å publisere?</a><span class="auto-save-text">✓ Lagres automatisk på denne enheten</span></div>
      <div class="preview" id="preview" ${previewOpen ? "" : "hidden"}></div>`;
    renderSteps(t);
    if (previewOpen) renderPreview();
  }

  function renderPreview() {
    const t = current();
    const container = $("preview");
    if (!t || !container || !previewOpen) return;
    container.hidden = false;
    container.innerHTML = `<span class="preview-kicker">FORHÅNDSVISNING · ${safe(forms[t.form])} / ${safe(levels[t.niva])} / ${safe(t.tid)} MIN</span>
      <h3>${safe(t.tittel || "Oppgave uten tittel")}</h3><p>${safe(t.beskrivelse)}</p>
      <h4>DETTE LÆRER DU</h4><ul>${t.mal.filter(Boolean).map(x => `<li>${safe(x)}</li>`).join("")}</ul>
      <h4>DETTE TRENGER DU</h4><p>${safe(t.utstyr)}</p>
      <h4>SLIK GJØR DU DET</h4><ol>${t.steg.filter(Boolean).map(x => `<li>${safe(x)}</li>`).join("")}</ol>
      ${t.kode ? `<h4>KODEEKSEMPEL</h4><pre><code>${safe(t.kode)}</code></pre>` : ""}
      ${t.tips ? `<h4>HINT</h4><p>${safe(t.tips)}</p>` : ""}
      ${t.ekstra ? `<h4>EKSTRA UTFORDRING</h4><p>${safe(t.ekstra)}</p>` : ""}`;
  }

  function createNewTask() {
    const t = normalizeTask({ id: generateId(), form: "analog", niva: "nybegynner", tid: 20, tittel: "", beskrivelse: "", mal: [""], utstyr: "", steg: [""], tips: "", ekstra: "" }, tasks.length);
    tasks.push(t);
    filter = "alle"; search = ""; $("task-search").value = "";
    changed("Ny oppgave opprettet.");
    selectTask(t.id);
    $("tittel")?.focus();
  }

  function duplicateTask() {
    const t = current(); if (!t) return;
    const duplicate = copy(t);
    duplicate.id = generateId();
    duplicate.tittel = `${t.tittel || "Uten tittel"} (kopi)`;
    tasks.splice(tasks.indexOf(t) + 1, 0, duplicate);
    changed("Oppgaven ble kopiert.");
    selectTask(duplicate.id);
  }

  function deleteTask() {
    const t = current(); if (!t) return;
    if (!window.confirm(`Vil du slette oppgaven «${t.tittel || "Uten tittel"}» fra utkastet?\n\nDen forsvinner ikke fra elevsiden før du publiserer.`)) return;
    const index = tasks.indexOf(t);
    tasks.splice(index, 1);
    selectedId = tasks[Math.min(index, tasks.length - 1)]?.id ?? null;
    changed("Oppgaven ble slettet fra utkastet.");
    renderForm();
  }

  function moveTask(direction) {
    const index = tasks.findIndex(t => t.id === selectedId);
    const to = index + (direction === "up" ? -1 : 1);
    if (index < 0 || to < 0 || to >= tasks.length) return;
    [tasks[index], tasks[to]] = [tasks[to], tasks[index]];
    changed("Rekkefølgen ble oppdatert.");
    renderForm();
  }

  function syncInput(target) {
    const t = current(); if (!t) return;
    if (target.matches("[data-step-index]")) {
      const i = Number(target.dataset.stepIndex);
      if (Number.isInteger(i) && i >= 0 && i < t.steg.length) t.steg[i] = target.value;
    } else if (target.matches("[data-field]")) {
      const f = target.dataset.field;
      if (f === "mal") t.mal = target.value.split(/\r?\n/);
      else if (f === "tid") t.tid = target.value === "" ? 0 : Number(target.value);
      else if (["tittel", "beskrivelse", "utstyr", "tips", "ekstra", "form", "niva", "kode", "lenke"].includes(f)) {
        if (f === "kode" || f === "lenke") {
          if (target.value) t[f] = target.value; else delete t[f];
        } else t[f] = target.value;
      }
    } else return;
    changed();
    $("form-errors").hidden = true;
  }

  function moveStep(index, direction) {
    const t = current(); if (!t) return;
    const to = index + (direction === "up" ? -1 : 1);
    if (index < 0 || to < 0 || to >= t.steg.length) return;
    [t.steg[index], t.steg[to]] = [t.steg[to], t.steg[index]];
    changed("Trinnet ble flyttet."); renderSteps(t);
    $("step-list").querySelector(`[data-step-index="${to}"]`)?.focus();
  }

  function validateTasks() {
    const errors = [];
    const ids = new Set();
    for (const [i,t] of tasks.entries()) {
      const name = t.tittel.trim() || `Oppgave ${i + 1}`;
      if (!t.tittel.trim()) errors.push(`Oppgave ${i + 1}: Skriv en tittel.`);
      if (!t.beskrivelse.trim()) errors.push(`${name}: Skriv en kort beskrivelse.`);
      if (!Number.isInteger(t.tid) || t.tid < 1 || t.tid > 999) errors.push(`${name}: Tidsbruk må være 1–999 minutter.`);
      if (!t.mal.some(x => x.trim())) errors.push(`${name}: Skriv minst ett læringsmål.`);
      if (!t.steg.some(x => x.trim())) errors.push(`${name}: Skriv minst ett trinn.`);
      if (t.lenke) {
        try { const url = new URL(t.lenke); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
        catch { errors.push(`${name}: Lenken må begynne med http:// eller https://.`); }
      }
      if (ids.has(t.id)) errors.push(`${name}: To oppgaver har samme interne ID.`);
      ids.add(t.id);
    }
    return errors;
  }

  function exportTasks() {
    // JSON er gyldig JavaScript og trenger ingen kjøring av kode fra inndata.
    // Normaliser før eksport slik at felt som kode/lenke er med bare ved behov.
    return `/* Kodeverkstedet – oppgaver eksportert fra Lærerrommet. */\nwindow.KODEOPPGAVER = ${JSON.stringify(tasks, null, 2)};\n`;
  }

  function prepareExport() {
    const errors = validateTasks();
    if (!errors.length) return true;
    msg.hidden = false;
    msg.style.background = "#fff0e7";
    msg.style.color = "#a34d2f";
    msg.innerHTML = `<strong>Oppgavene må fullføres før du kan publisere:</strong><br>${errors.slice(0, 6).map(safe).join("<br>")}${errors.length > 6 ? `<br>… og ${errors.length - 6} til.` : ""}`;
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
    announce.textContent = "Noen oppgaver mangler påkrevde felt.";
    return false;
  }

  function download(filename, data, mime) {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function showPublishMessage(text) {
    msg.hidden = false;
    msg.style.background = "#e9f3e9";
    msg.style.color = "#3c6a4c";
    msg.textContent = text;
    announce.textContent = text;
  }

  async function copyPublishText() {
    if (!prepareExport()) return;
    const value = exportTasks();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const box = document.createElement("textarea");
        box.value = value; box.style.position = "fixed"; box.style.opacity = "0";
        document.body.appendChild(box); box.focus(); box.select();
        const result = document.execCommand("copy");
        box.remove();
        if (!result) throw new Error("Ingen tilgang til utklippstavlen");
      }
      showPublishMessage("Hele oppgavefilen ble kopiert. Lim den inn i oppgaver.js på GitHub og velg Commit changes.");
    } catch {
      showPublishMessage("Nettleseren kunne ikke kopiere filen. Bruk knappen «Last ned oppgaver.js» i stedet.");
    }
  }

  function downloadBackup() {
    const backup = { type: "kodeverkstedet-sikkerhetskopi", version: 1, exported: new Date().toISOString(), tasks };
    const date = new Date().toISOString().slice(0, 10);
    download(`kodeverkstedet-sikkerhetskopi-${date}.json`, JSON.stringify(backup, null, 2), "application/json;charset=utf-8");
    announce.textContent = "Sikkerhetskopien ble lastet ned.";
  }

  async function importBackup(file) {
    try {
      if (!file || file.size > 5 * 1024 * 1024) throw new Error("Filen mangler eller er for stor.");
      const contents = JSON.parse(await file.text());
      if (!contents || contents.type !== "kodeverkstedet-sikkerhetskopi" || !Array.isArray(contents.tasks) || contents.tasks.length > 2000) {
        throw new Error("Filen er ikke en sikkerhetskopi fra Kodeverkstedet.");
      }
      const imported = contents.tasks.map(normalizeTask);
      const ids = imported.map(t => t.id);
      if (new Set(ids).size !== ids.length) throw new Error("Noen oppgaver har identisk ID.");
      if (!window.confirm(`Vil du åpne sikkerhetskopien med ${imported.length} oppgaver?\n\nDette erstatter utkastet du har på denne enheten.`)) return;
      tasks = imported;
      selectedId = tasks[0]?.id ?? null;
      filter = "alle"; search = ""; $("task-search").value = "";
      changed("Sikkerhetskopien er åpnet og lagret som nytt utkast.");
      renderForm();
      window.alert("Sikkerhetskopien er åpnet! Husk å publisere hvis elevene skal få de nye oppgavene.");
    } catch(e) { window.alert(`Kunne ikke åpne sikkerhetskopien: ${e.message}`); }
  }

  $("task-list").addEventListener("click", event => {
    const button = event.target.closest("[data-select-task]");
    if (button) selectTask(button.dataset.selectTask);
  });
  $("task-search").addEventListener("input", event => { search = event.target.value.trim().toLocaleLowerCase("nb"); renderTaskList(); });
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => { filter = button.dataset.filter; renderTaskList(); }));
  $("new-task").addEventListener("click", createNewTask);
  $("editor-content").addEventListener("input", event => syncInput(event.target));
  $("editor-content").addEventListener("change", event => syncInput(event.target));
  $("editor-content").addEventListener("submit", event => event.preventDefault());
  $("editor-content").addEventListener("click", event => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.hasAttribute("data-create-task")) createNewTask();
    else if (target.hasAttribute("data-duplicate-task")) duplicateTask();
    else if (target.hasAttribute("data-delete-task")) deleteTask();
    else if (target.dataset.moveTask) moveTask(target.dataset.moveTask);
    else if (target.id === "add-step") {
      const t = current(); if (!t) return;
      t.steg.push(""); changed(); renderSteps(t);
      $("step-list").querySelector(`[data-step-index="${t.steg.length - 1}"]`)?.focus();
    }
    else if (target.dataset.moveStep) moveStep(Number(target.dataset.index), target.dataset.moveStep);
    else if (target.hasAttribute("data-remove-step")) {
      const t = current(); if (!t) return;
      t.steg.splice(Number(target.dataset.removeStep), 1);
      changed(); renderSteps(t);
    }
    else if (target.id === "toggle-preview") {
      previewOpen = !previewOpen;
      const p = $("preview");
      p.hidden = !previewOpen;
      target.textContent = previewOpen ? "◉ Skjul oppgaven" : "◉ Forhåndsvis oppgaven";
      if (previewOpen) { renderPreview(); p.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    }
  });

  $("download-publish").addEventListener("click", () => {
    if (!prepareExport()) return;
    download("oppgaver.js", exportTasks(), "text/javascript;charset=utf-8");
    showPublishMessage("Oppgavefilen er lastet ned. Neste steg: Last opp den nye oppgaver.js i GitHub og velg Commit changes. Ingenting er publisert ennå.");
  });
  $("copy-publish").addEventListener("click", copyPublishText);
  $("download-backup").addEventListener("click", downloadBackup);
  $("upload-backup").addEventListener("click", () => $("backup-input").click());
  $("backup-input").addEventListener("change", async e => {
    const file = e.target.files?.[0];
    if (file) await importBackup(file);
    e.target.value = "";
  });
  $("restore-published").addEventListener("click", () => {
    if (!window.confirm("Vil du forkaste utkastet på denne enheten og starte med oppgavene som ligger i nettstedfilen?\n\nLast ned en sikkerhetskopi først hvis du vil beholde utkastet.")) return;
    tasks = sourceTasks.map(normalizeTask);
    selectedId = tasks[0]?.id ?? null;
    filter = "alle"; search = ""; $("task-search").value = "";
    try { localStorage.removeItem(draftKey); } catch {}
    status.textContent = "Viser oppgavene fra nettstedfilen. Ingen nye utkastendringer ennå.";
    renderTaskList(); renderForm();
    announce.textContent = "Utkastet ble tilbakestilt til oppgavene i nettstedfilen.";
  });

  if (!sourceTasks.length) {
    status.textContent = "Kunne ikke laste oppgavene fra oppgaver.js. Kontroller at filene ligger sammen.";
  } else if (existingDraft) {
    status.textContent = "Ditt lagrede utkast er åpnet fra denne nettleseren.";
  } else {
    status.textContent = "Klar! Viser oppgavene i nettstedfilen. Endringer lagres som utkast her.";
  }
  if (!storageWorks) status.textContent = "Lokal lagring er utilgjengelig. Bruk sikkerhetskopi.";
  renderTaskList();
  renderForm();
})();
