/**
 * Start page: one minimal box to type a topic, attach files or YouTube links, and toggle web search.
 *
 * Step 1 (now): the built-in topic opens the existing lesson at /learn. Anything else is collected
 * and acknowledged; AI lesson generation (Claude) is wired up in step 2 via `submitRequest`.
 */

const BUILT_IN = {
  title: "Thinking, Learning & Understanding",
  href: "/learn",
  keywords: ["thinking", "learning", "understanding", "memory", "how we learn"]
};
const YOUTUBE_RE = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/i;
const MAX_FILE_MB = 20;

const $ = id => document.getElementById(id);
const form = $("searchForm");
const query = $("query");
const plusBtn = $("plusBtn");
const plusMenu = $("plusMenu");
const fileInput = $("fileInput");
const webToggle = $("webToggle");
const youtubeRow = $("youtubeRow");
const youtubeInput = $("youtubeInput");
const attachmentsEl = $("attachments");
const messageEl = $("message");

const state = {
  web: true,
  files: [], // File objects
  youtube: [] // URLs
};

// ---------------------------------------------------------------- rendering

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function renderAttachments() {
  const chips = [
    ...state.files.map((f, i) => ({ kind: "file", i, icon: "📄", label: f.name })),
    ...state.youtube.map((u, i) => ({ kind: "youtube", i, icon: "▶️", label: u.replace(/^https?:\/\/(www\.)?/, "") }))
  ];
  attachmentsEl.innerHTML = chips
    .map(c => `<span class="chip">${c.icon} <span title="${escapeHtml(c.label)}">${escapeHtml(c.label)}</span>
      <button type="button" data-remove="${c.kind}:${c.i}" aria-label="Remove ${escapeHtml(c.label)}">×</button></span>`)
    .join("");
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.hidden = !text;
}

// ---------------------------------------------------------------- + menu

function setMenu(open) {
  plusMenu.hidden = !open;
  plusBtn.setAttribute("aria-expanded", String(open));
  if (open) plusMenu.querySelector("button")?.focus();
}

plusBtn.addEventListener("click", () => setMenu(plusMenu.hidden));
document.addEventListener("click", e => {
  if (!e.target.closest(".attach-wrap")) setMenu(false);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") setMenu(false);
});

plusMenu.addEventListener("click", e => {
  const item = e.target.closest("[data-menu]");
  if (!item) return;
  setMenu(false);
  if (item.dataset.menu === "file") fileInput.click();
  if (item.dataset.menu === "youtube") {
    youtubeRow.hidden = false;
    youtubeInput.focus();
  }
});

// ---------------------------------------------------------------- attachments

fileInput.addEventListener("change", () => {
  for (const f of fileInput.files) {
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      showMessage(`"${f.name}" is larger than ${MAX_FILE_MB} MB.`);
      continue;
    }
    if (!state.files.some(x => x.name === f.name && x.size === f.size)) state.files.push(f);
  }
  fileInput.value = "";
  renderAttachments();
});

function addYoutube(url) {
  const u = url.trim();
  if (!YOUTUBE_RE.test(u)) {
    showMessage("That doesn't look like a YouTube link.");
    return false;
  }
  const full = /^https?:\/\//i.test(u) ? u : `https://${u}`;
  if (!state.youtube.includes(full)) state.youtube.push(full);
  renderAttachments();
  showMessage("");
  return true;
}

$("youtubeAdd").addEventListener("click", () => {
  if (addYoutube(youtubeInput.value)) {
    youtubeInput.value = "";
    youtubeRow.hidden = true;
  }
});
youtubeInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("youtubeAdd").click();
  }
});

// Pasting a YouTube link straight into the main box turns it into an attachment.
query.addEventListener("paste", e => {
  const text = (e.clipboardData || window.clipboardData).getData("text");
  if (YOUTUBE_RE.test(text.trim())) {
    e.preventDefault();
    addYoutube(text);
  }
});

attachmentsEl.addEventListener("click", e => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  const [kind, i] = btn.dataset.remove.split(":");
  (kind === "file" ? state.files : state.youtube).splice(Number(i), 1);
  renderAttachments();
});

webToggle.addEventListener("click", () => {
  state.web = !state.web;
  webToggle.classList.toggle("is-on", state.web);
  webToggle.setAttribute("aria-pressed", String(state.web));
});

// ---------------------------------------------------------------- submit

function matchesBuiltIn(text) {
  const t = text.toLowerCase();
  return BUILT_IN.keywords.some(k => t.includes(k));
}

/** Step 2 replaces this with a call to the lesson-generation API. */
async function submitRequest({ topic, web, files, youtube }) {
  const sources = [
    web ? "the web" : null,
    files.length ? `${files.length} file${files.length > 1 ? "s" : ""}` : null,
    youtube.length ? `${youtube.length} YouTube video${youtube.length > 1 ? "s" : ""}` : null
  ].filter(Boolean);
  showMessage(
    `Got it: "${topic || "your material"}"${sources.length ? ` from ${sources.join(", ")}` : ""}. ` +
      `Building lessons for new topics comes in the next step. For now, try the ready-made lesson below.`
  );
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const topic = query.value.trim();
  const hasSources = state.files.length || state.youtube.length;
  if (!topic && !hasSources) {
    query.focus();
    return;
  }
  if (topic && !hasSources && matchesBuiltIn(topic)) {
    location.href = BUILT_IN.href;
    return;
  }
  submitRequest({ topic, web: state.web, files: state.files, youtube: state.youtube });
});

document.querySelector(".suggestion").addEventListener("click", () => {
  location.href = BUILT_IN.href;
});

query.focus();
