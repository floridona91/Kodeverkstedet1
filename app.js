(() => {
  "use strict";
  const tasks = Array.isArray(window.KODEOPPGAVER) ? window.KODEOPPGAVER : [];
  const labels = {
    forms: { analog: "Analog", scratch: "Scratch", python: "Python" },
    levels: { nybegynner: "Nybegynner", videre: "Litt øvet", utfordring: "Utfordring" }
  };
  const state = { form: "alle", level: "alle", search: "" };
  const storageKey = "kodeverkstedet-fullfort-v1";
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"})[char]);
  function readProgress() {
    try { const saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); return new Set(Array.isArray(saved) ? saved.filter(v => typeof v === "string") : []); }
    catch { return new Set(); }
  }
  const completed = readProgress();
  const grid = document.getElementById("task-grid");
  const count = document.getElementById("results-count");
  const dialog = document.getElementById("task-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const announcement = document.getElementById("action-announcement");
  let lastDialogTrigger = null;

  function renderProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => completed.has(t.id)).length;
    document.getElementById("progress-text").textContent = `${done} / ${total}`;
    document.getElementById("progress-fill").style.width = `${total ? (done / total) * 100 : 0}%`;
  }
  function filteredTasks() {
    const query = state.search.trim().toLocaleLowerCase("nb");
    return tasks.filter(t => {
      if (state.form !== "alle" && t.form !== state.form) return false;
      if (state.level !== "alle" && t.niva !== state.level) return false;
      if (!query) return true;
      return [t.tittel, t.beskrivelse, labels.forms[t.form], labels.levels[t.niva], ...t.mal].join(" ").toLocaleLowerCase("nb").includes(query);
    });
  }
  function renderCards() {
    const filtered = filteredTasks();
    grid.innerHTML = filtered.map(t => {
      const done = completed.has(t.id);
      return `<article class="task-card task-${safe(t.form)} ${done ? "is-complete" : ""}">
        <div class="task-card-top"><span class="task-form"><span class="task-form-dot"></span>${safe(labels.forms[t.form] || t.form)}</span>${done ? '<span class="done-badge">✓ Fullført</span>' : `<span class="task-card-symbol" aria-hidden="true">${t.form === "analog" ? "↱" : t.form === "scratch" ? "◈" : "⌘"}</span>`}</div>
        <div class="task-card-content"><div class="task-meta"><span>${safe(labels.levels[t.niva] || t.niva)}</span><span aria-hidden="true">·</span><span>${safe(t.tid)} min</span></div><h3>${safe(t.tittel)}</h3><p>${safe(t.beskrivelse)}</p></div>
        <div class="task-card-footer"><span>${safe(t.mal[0] || "Utforsk programmering")}</span><button class="open-task" type="button" data-task-id="${safe(t.id)}" aria-label="Åpne oppgaven ${safe(t.tittel)}"><span aria-hidden="true">↗</span></button></div>
      </article>`;
    }).join("");
    count.textContent = `Viser ${filtered.length} ${filtered.length === 1 ? "oppgave" : "oppgaver"}`;
    document.getElementById("empty-state").hidden = filtered.length !== 0;
    document.getElementById("clear-filters").hidden = state.form === "alle" && state.level === "alle" && !state.search;
    renderProgress();
  }
  function syncFilters() {
    document.querySelectorAll("[data-filter-form]").forEach(button => {
      const active = button.dataset.filterForm === state.form;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("task-level").value = state.level;
    document.getElementById("task-search").value = state.search;
  }
  function selectForm(form) {
    state.form = form;
    syncFilters(); renderCards();
  }
  function clearFilters() {
    state.form = "alle"; state.level = "alle"; state.search = "";
    syncFilters(); renderCards();
  }
  document.querySelectorAll("[data-filter-form]").forEach(button => button.addEventListener("click", () => selectForm(button.dataset.filterForm)));
  document.querySelectorAll("[data-select-form]").forEach(button => button.addEventListener("click", () => {
    selectForm(button.dataset.selectForm);
    document.getElementById("oppgaver").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }));
  document.getElementById("task-level").addEventListener("change", e => { state.level = e.target.value; renderCards(); });
  document.getElementById("task-search").addEventListener("input", e => { state.search = e.target.value; renderCards(); });
  document.getElementById("clear-filters").addEventListener("click", clearFilters);
  document.getElementById("empty-clear").addEventListener("click", clearFilters);

  function createDialogHTML(t) {
    const done = completed.has(t.id);
    return `<div class="dialog-header dialog-${safe(t.form)}">
      <div class="dialog-header-top"><span class="dialog-kicker">${safe(labels.forms[t.form])} / ${safe(labels.levels[t.niva])} / ${safe(t.tid)} MIN</span><button type="button" class="dialog-close" data-close-dialog aria-label="Lukk oppgaven">×</button></div>
      <h2 id="dialog-title">${safe(t.tittel)}</h2><p>${safe(t.beskrivelse)}</p>
    </div>
    <div class="dialog-body"><div class="dialog-goals"><div><span class="dialog-label">DETTE LÆRER DU</span><ul>${t.mal.map(goal => `<li>${safe(goal)}</li>`).join("")}</ul></div><div><span class="dialog-label">DETTE TRENGER DU</span><p>${safe(t.utstyr)}</p></div></div>
    <div class="dialog-main"><span class="dialog-label">SLIK GJØR DU DET</span><ol class="dialog-steps">${t.steg.map(s => `<li><span>${safe(s)}</span></li>`).join("")}</ol>
    ${t.kode ? `<div class="code-heading"><span class="dialog-label">PRØV DENNE KODEN</span><button type="button" class="copy-code" data-copy-code>Kopier kode <span aria-hidden="true">⧉</span></button></div><pre class="code-example"><code>${safe(t.kode)}</code></pre>` : ""}
    <details class="tip-details"><summary>Trenger du et hint? <span aria-hidden="true">＋</span></summary><p>${safe(t.tips)}</p></details>
    <div class="extra-challenge"><span class="extra-icon" aria-hidden="true">✳</span><div><h3>Ekstra utfordring</h3><p>${safe(t.ekstra)}</p></div></div></div>
    <div class="dialog-actions"><button type="button" class="button ${done ? "button-done" : "button-dark"}" data-toggle-done="${safe(t.id)}">${done ? "✓ Fullført – marker som ikke fullført" : "✓ Marker som fullført"}</button>${t.lenke ? `<a class="external-task-link" href="${safe(t.lenke)}" target="_blank" rel="noopener noreferrer">Åpne Scratch ↗</a>` : ""}</div></div>`;
  }
  function openTask(id, trigger) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    lastDialogTrigger = trigger;
    dialogContent.innerHTML = createDialogHTML(task);
    dialog.dataset.taskId = id;
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  grid.addEventListener("click", e => {
    const button = e.target.closest("[data-task-id]");
    if (button) openTask(button.dataset.taskId, button);
  });
  dialog.addEventListener("click", async e => {
    if (e.target === dialog || e.target.closest("[data-close-dialog]")) { dialog.close(); return; }
    const toggle = e.target.closest("[data-toggle-done]");
    if (toggle) {
      const id = toggle.dataset.toggleDone;
      if (completed.has(id)) completed.delete(id); else completed.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { /* Lagres ikke når nettleseren blokkerer lagring */ }
      const task = tasks.find(t => t.id === id);
      dialogContent.innerHTML = createDialogHTML(task);
      dialogContent.querySelector("[data-toggle-done]")?.focus();
      renderCards();
      announcement.textContent = completed.has(id) ? "Oppgaven er markert som fullført." : "Oppgaven er ikke lenger markert som fullført.";
    }
    const copy = e.target.closest("[data-copy-code]");
    if (copy) {
      const task = tasks.find(t => t.id === dialog.dataset.taskId);
      try {
        if (!navigator.clipboard) throw new Error("Utklippstavle utilgjengelig");
        await navigator.clipboard.writeText(task.kode);
        copy.textContent = "✓ Kopiert!";
        announcement.textContent = "Koden er kopiert.";
      } catch {
        copy.textContent = "Marker koden for å kopiere";
        announcement.textContent = "Marker koden og kopier den manuelt.";
      }
    }
  });
  dialog.addEventListener("close", () => {
    if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus();
  });
  document.getElementById("footer-year").textContent = String(new Date().getFullYear());
  renderCards();
})();
