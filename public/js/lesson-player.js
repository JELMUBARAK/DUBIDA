/**
 * Generic lesson player: plays any topic pack from /api/packs/:id through the same experience
 * as the flagship lesson: 3 mysteries (experience first, name last) → The Loop → units on the
 * 5-step spine (graded by the engine's UnitRuntimeSession) → 3-part recap → What's next?
 *
 * Progress is kept in localStorage per topic. Graded attempts post to /api/ledger.
 */

import { UnitRuntimeSession } from "/src/engine/runtime.js";
import { renderVisual, hasVisual, renderScene, hasScene } from "/js/lesson-visuals.js";

const params = new URLSearchParams(location.search);
let TOPIC_ID = params.get("topic") || ""; // empty on /learn: resolved from the registry in boot()
let STORAGE_KEY = `dubida_lesson_${TOPIC_ID}`;
const stage = document.getElementById("stage");

let pack = null;
const sessions = {}; // topic_id -> UnitRuntimeSession
const drafts = {}; // topic_id -> { how, why, confidence, followup }

const defaultState = () => ({
  screen: "setup", // setup | card | loop | unit | recap  (the Unified Lesson Flow, src/engine/flow.js)
  idx: 0,
  depth: "simple",
  loopCheck: null, // index of the option picked in The Loop's real-life check
  cards: {}, // cardId -> { solved, wrongMsg }
  toys: {}, // cardId -> { sceneId -> { tried: [optionIdx], last } }
  units: {}, // topic_id -> serialized session state
  recap: { backwards: null, rule: "", saved: false, emptyHint: false },
  next: { choice: null, topic: "", done: [] }
});

let state = defaultState();

// ---------------------------------------------------------------- helpers

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function save() {
  for (const [id, s] of Object.entries(sessions)) state.units[id] = s.serialize();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked: progress just won't survive a reload
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    state = defaultState();
  }
}

function sessionFor(unit) {
  if (!sessions[unit.topic_id]) {
    const s = new UnitRuntimeSession(unit, "learner-default-001");
    if (state.units[unit.topic_id]) {
      try {
        s.restore(state.units[unit.topic_id]);
      } catch {
        // stale saved state: start the unit fresh
      }
    }
    sessions[unit.topic_id] = s;
  }
  return sessions[unit.topic_id];
}

function draftFor(id) {
  return (drafts[id] ||= { how: null, why: "", confidence: "sure", followup: "" });
}

async function postLedger(entry) {
  if (!entry) return;
  try {
    await fetch("/api/ledger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
  } catch {
    // offline: the lesson still works
  }
}

function go(screen, idx = 0) {
  state.screen = screen;
  state.idx = idx;
  save();
  render();
  window.scrollTo({ top: 0 });
}

const btnBase = "rounded-xl border bg-[var(--background)] transition-all";
const btnIdle = "border-[var(--card-border)] hover:border-[var(--foreground)]";

// ---------------------------------------------------------------- navigation bar

function unitMastered(u) {
  return (
    sessions[u.topic_id]?.state.masteryState === "independent_mastery" ||
    (state.units[u.topic_id] && JSON.parse(state.units[u.topic_id]).masteryState === "independent_mastery")
  );
}

function pillHtml(p) {
  return `<button onclick="${p.on}" class="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
    p.active
      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
      : p.solved
      ? "border-[var(--success)] text-[var(--success)] bg-[var(--card)]"
      : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--foreground)]"
  }">${esc(p.label)}</button>`;
}

// Top bar = the same 5 flow steps in every lesson, with progress counts.
function renderNav() {
  const cards = pack.discovery_cards;
  const solved = cards.filter(c => state.cards[c.id]?.solved).length;
  const firstOpenCard = Math.max(0, cards.findIndex(c => !state.cards[c.id]?.solved));
  const mastered = pack.units.filter(unitMastered).length;
  const firstOpenUnit = Math.max(0, pack.units.findIndex(u => !unitMastered(u)));
  const pills = [
    { label: "Setup", active: state.screen === "setup", on: "go('setup')" },
    { label: `Mysteries ${solved}/${cards.length}`, active: state.screen === "card", solved: solved === cards.length, on: `go('card', ${firstOpenCard})` },
    { label: "The Loop", active: state.screen === "loop", solved: pack.loop?.check?.options[state.loopCheck]?.correct === true, on: "go('loop')" },
    { label: `Units ${mastered}/${pack.units.length}`, active: state.screen === "unit", solved: mastered === pack.units.length, on: `go('unit', ${firstOpenUnit})` },
    { label: "🏆 Recap", active: state.screen === "recap", solved: state.recap.saved, on: "go('recap')" }
  ];
  document.getElementById("navPills").innerHTML = pills.map(pillHtml).join("");
  document.getElementById("depthBtn").textContent = state.depth === "deep" ? "🔬 Deep" : "🌱 Simple";
}

// Second row, only inside the Mysteries and Units steps.
function renderSubTabs() {
  let pills = [];
  if (state.screen === "card") {
    pills = pack.discovery_cards.map((c, i) => {
      const solved = state.cards[c.id]?.solved;
      return { label: solved ? c.solved_label : c.mystery_label, active: state.idx === i, solved, on: `go('card', ${i})` };
    });
  } else if (state.screen === "unit") {
    pills = pack.units.map((u, i) => {
      const done = unitMastered(u);
      return { label: `${u.short_tab}${done ? " ✓" : ""}`, active: state.idx === i, solved: done, on: `go('unit', ${i})` };
    });
  }
  return pills.length ? `<div class="flex flex-wrap justify-center gap-1.5">${pills.map(pillHtml).join("")}</div>` : "";
}

// ---------------------------------------------------------------- step 0: setup

function renderSetup() {
  const depthChoice = (id, label, sub) => `
    <button onclick="setDepth('${id}')" class="p-3 rounded-xl border text-left transition-all ${
      state.depth === id
        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
        : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)]"
    }">
      <div class="font-semibold">${label}</div>
      <div class="opacity-75 mt-0.5">${sub}</div>
    </button>`;
  return `
    <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-5 fade-in">
      <div class="text-center space-y-1">
        <p class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Before you start</p>
        <h2 class="text-xl font-bold">${esc(pack.title)}</h2>
        <p class="text-xs text-[var(--muted-foreground)]">${pack.discovery_cards.length} mysteries · ${pack.units.length} units. You can switch depth any time.</p>
      </div>
      <div class="space-y-2">
        <div class="text-xs font-medium text-[var(--muted-foreground)]">How deep do you want to go?</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${depthChoice("simple", "🌱 Simple & Visual", "Everyday intuition, zero jargon")}
          ${depthChoice("deep", "🔬 Under the Hood", "Adds the real mechanism behind every mystery")}
        </div>
      </div>
      <div class="pt-1 flex justify-center">
        <button onclick="go('card', 0)" class="px-6 py-2.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity">
          Start Mystery 1 →
        </button>
      </div>
    </div>`;
}

window.setDepth = d => {
  state.depth = d;
  save();
  render();
};

// ---------------------------------------------------------------- discovery cards

function toyState(cardId, sceneId) {
  const c = (state.toys[cardId] ||= {});
  return (c[sceneId] ||= { tried: [], last: null });
}

function sceneDone(card, scene) {
  return toyState(card.id, scene.id).tried.length >= (scene.toy?.options?.length || 1);
}

function renderCard(i) {
  const card = pack.discovery_cards[i];
  const cs = state.cards[card.id] || {};
  const allPlayed = card.scenes.every(sc => sceneDone(card, sc));
  const remaining = card.scenes.filter(sc => !sceneDone(card, sc)).map(sc => sc.title);
  const isLast = i === pack.discovery_cards.length - 1;

  const scenes = card.scenes
    .map(sc => {
      const t = toyState(card.id, sc.id);
      const opts = sc.toy?.options || [];
      const done = sceneDone(card, sc);
      const last = t.last != null ? opts[t.last] : null;
      return `
      <div class="rounded-2xl border ${done ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-[var(--foreground)]">${esc(sc.title)}</span>
          <span class="px-2 py-0.5 rounded-full ${done ? "bg-[var(--success)] text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}">
            ${done ? "✓ Done" : `${opts.length > 2 ? "Try all" : "Try both"} · ${t.tried.length}/${opts.length}`}
          </span>
        </div>
        <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2 min-h-[74px] flex flex-col items-center justify-center text-center gap-1">
          ${hasScene(sc) ? renderScene(sc, t.last, t.tried) : ""}
          ${
            last
              ? `<div class="fade-in text-sm font-semibold ${last.tone === "ok" ? "text-[var(--success)]" : "text-[var(--warning)]"}">${esc(last.result)}</div>`
              : `<div class="text-xs text-[var(--muted-foreground)]">${esc(sc.status_default || "")}</div>`
          }
        </div>
        <p class="text-xs text-[var(--muted-foreground)]">${esc(sc.micro_copy)}</p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          ${opts
            .map(
              (o, k) => `<button onclick="playToy('${card.id}','${sc.id}',${k})" class="py-2 px-2 ${btnBase} ${
                t.last === k ? (o.tone === "ok" ? "border-[var(--success)] font-semibold" : "border-[var(--warning)]") : btnIdle
              } font-medium">${esc(o.label)}</button>`
            )
            .join("")}
        </div>
      </div>`;
    })
    .join("");

  let bottom;
  if (cs.solved) {
    bottom = `
      <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 space-y-2 fade-in">
        <div class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Mystery ${i + 1} Solved</div>
        <h3 class="text-lg font-bold">${esc(card.earned_reveal)}</h3>
        <p class="text-sm text-[var(--muted-foreground)]">${esc(state.depth === "deep" ? card.reveal_deep : card.reveal_simple)}</p>
        ${
          state.depth === "deep" && card.under_the_hood
            ? `<div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-3 space-y-1">
                <div class="text-xs font-mono font-bold text-[var(--code-foreground)]">${esc(card.under_the_hood.tag)}</div>
                <div class="text-xs font-mono">${esc(card.under_the_hood.flow)}</div>
                <div class="text-xs text-[var(--muted-foreground)]">${esc(card.under_the_hood.note)}</div>
              </div>`
            : ""
        }
        <div class="flex justify-end">
          <button onclick="${isLast ? "go('loop')" : `go('card', ${i + 1})`}" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">
            ${isLast ? "See how they connect →" : `${esc(pack.discovery_cards[i + 1].mystery_label)} →`}
          </button>
        </div>
      </div>`;
  } else if (allPlayed) {
    bottom = `
      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5 fade-in">
        <div class="text-sm font-semibold">${esc(card.pattern_question)}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${card.options
            .map((o, k) => `<button onclick="answerCard(${i},${k})" class="p-3 ${btnBase} ${btnIdle} text-left font-medium">${esc(o.label)}</button>`)
            .join("")}
        </div>
        ${cs.wrongMsg ? `<div class="text-xs text-[var(--warning)]">${esc(cs.wrongMsg)}</div>` : ""}
      </div>`;
  } else {
    bottom = `<div class="rounded-xl border border-dashed border-[var(--primary)] p-3 text-center text-xs">
      👆 To unlock the question, finish: <b>${remaining.map(esc).join(" and ")}</b> (try every option in each scene)
    </div>`;
  }

  return `
    <div class="text-center space-y-0.5">
      <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">${esc(card.header_eyebrow)}</p>
      <h2 class="text-base sm:text-lg font-semibold">${esc(card.header_prompt)}</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${scenes}</div>
    ${bottom}`;
}

window.playToy = (cardId, sceneId, k) => {
  const t = toyState(cardId, sceneId);
  t.last = k;
  if (!t.tried.includes(k)) t.tried.push(k);
  save();
  render();
};

window.answerCard = (i, k) => {
  const card = pack.discovery_cards[i];
  const opt = card.options[k];
  const cs = (state.cards[card.id] ||= {});
  if (opt.correct) {
    cs.solved = true;
    cs.wrongMsg = null;
  } else {
    cs.wrongMsg = opt.feedback || "Not quite. What did both scenes have in common?";
  }
  postLedger({
    topic_id: card.id,
    objective_id: `${card.id}_pattern`,
    lesson_version: pack.version,
    rubric_version: pack.version,
    learner_response: `DISCOVERY: ${opt.label}`,
    check_a_prediction_pass: Boolean(opt.correct),
    check_b_mechanism_pass: Boolean(opt.correct),
    mastery_state: "supported_practice"
  });
  save();
  render();
};

// ---------------------------------------------------------------- the loop

function renderLoop() {
  const loop = pack.loop;
  const solved = pack.discovery_cards.filter(c => state.cards[c.id]?.solved).length;
  return `
    <div class="text-center space-y-0.5">
      <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">${solved} of ${pack.discovery_cards.length} mysteries solved</p>
      <h2 class="text-base sm:text-lg font-semibold">${esc(loop?.headline || pack.system_model.name)}</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      ${(loop?.steps || [])
        .map(
          s => `<div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 space-y-1">
            <div class="text-xs font-mono uppercase text-[var(--primary)]">${esc(s.label)}</div>
            <div class="text-sm font-semibold">${esc(s.title)}</div>
            <div class="text-xs text-[var(--muted-foreground)]">${esc(s.text)}</div>
          </div>`
        )
        .join("")}
    </div>
    ${renderLoopCheck(loop?.check)}`;
}

function renderLoopCheck(check) {
  const start = `<div class="flex justify-end fade-in">
      <button onclick="go('unit', 0)" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">Start ${esc(pack.units[0].short_tab)} →</button>
    </div>`;
  if (!check) return start;
  const picked = state.loopCheck != null ? check.options[state.loopCheck] : null;
  return `
    <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5">
      <div class="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Real-life check · one tap</div>
      <div class="text-sm font-semibold">${esc(check.question)}</div>
      <div class="grid grid-cols-1 sm:grid-cols-${Math.min(3, check.options.length)} gap-2 text-xs">
        ${check.options
          .map(
            (o, k) => `<button onclick="answerLoopCheck(${k})" class="p-3 ${btnBase} text-left font-medium ${
              state.loopCheck === k ? (o.correct ? "border-[var(--success)] font-semibold" : "border-[var(--warning)]") : btnIdle
            }">${esc(o.label)}</button>`
          )
          .join("")}
      </div>
      ${
        picked
          ? `<div class="text-xs fade-in ${picked.correct ? "text-[var(--success)] font-semibold" : "text-[var(--warning)]"}">${
              picked.correct ? "✓ " : ""
            }${esc(picked.feedback || (picked.correct ? "Spot on." : "Not quite. Look at the three steps again."))}</div>`
          : ""
      }
    </div>
    ${picked?.correct ? start : ""}`;
}

window.answerLoopCheck = k => {
  const check = pack.loop.check;
  const o = check.options[k];
  const firstTry = state.loopCheck == null;
  state.loopCheck = k;
  postLedger({
    topic_id: `${pack.topic_pack_id}_loop_check`,
    objective_id: "loop_real_life_check",
    lesson_version: pack.version,
    rubric_version: pack.version,
    learner_response: o.label,
    check_a_prediction_pass: Boolean(o.correct),
    check_b_mechanism_pass: Boolean(o.correct),
    misconception_tag: o.correct ? null : `loop_check_option_${k}`,
    help_used: o.correct && firstTry ? [] : ["loop_check_retry"],
    mastery_state: "supported_practice"
  });
  save();
  render();
};

// ---------------------------------------------------------------- units

const STEPS = ["1 · What?", "2 · How & Why?", "3 · Feedback", "4 · What if?", "5 · Connect"];

function replayLocked(s) {
  return s.state.stepIndex === 2 && (s.state.checkAPass === false || s.state.checkBPass === false);
}

function simInner(unit, s) {
  const { svg, banner } = renderVisual(unit.object_spec, s.state.dial1, s.state.dial2);
  return `<div class="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-2">${svg}</div>
    <div class="rounded-lg bg-[var(--secondary)] p-2.5 text-xs font-semibold">${esc(banner)}</div>`;
}

function renderSim(unit, s) {
  if (!hasVisual(unit.object_spec)) return "";
  const spec = unit.object_spec;
  const locked = replayLocked(s);
  const preset = s.state.stepIndex === 1 ? spec.target_experiment : s.state.stepIndex === 3 ? spec.whatif_experiment : null;
  const dial = (n, d, val) => `
    <label class="block space-y-1">
      <span class="flex justify-between text-xs font-semibold"><span>${esc(d.label)}</span><span id="dialOut${n}" class="font-mono text-[var(--primary)]">${val}</span></span>
      <input type="range" min="${d.min}" max="${d.max}" value="${val}" ${locked ? "disabled" : ""} oninput="setDial(${n}, this.value)" class="w-full accent-[var(--primary)]" aria-label="${esc(d.label)}" />
      <span class="flex justify-between text-[10px] text-[var(--muted-foreground)]"><span>${d.min}</span><span>${d.max}</span></span>
    </label>`;
  return `
    <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-mono font-bold uppercase text-[var(--primary)]">🕹️ Living object · ${esc(unit.sub_tab)}</span>
        ${locked ? `<span class="px-2 py-0.5 rounded bg-[var(--warning)] text-white text-xs font-semibold pulse-live">🔁 Replay locked</span>` : ""}
        ${preset && !locked ? `<button onclick="applyPreset(${preset.dial1},${preset.dial2})" class="px-2.5 py-1 rounded-md bg-[var(--primary)] text-white text-xs font-semibold">⚡ ${esc(preset.label)}</button>` : ""}
      </div>
      <div id="simView" class="space-y-2">${simInner(unit, s)}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${dial(1, spec.dials.dial1, s.state.dial1)}
        ${dial(2, spec.dials.dial2, s.state.dial2)}
      </div>
    </div>`;
}

function currentUnit() {
  return pack.units[state.idx];
}

window.setDial = (n, v) => {
  const unit = currentUnit();
  const s = sessionFor(unit);
  if (n === 1) s.setDials(Number(v), s.state.dial2);
  else s.setDials(s.state.dial1, Number(v));
  document.getElementById(`dialOut${n}`).textContent = n === 1 ? s.state.dial1 : s.state.dial2;
  document.getElementById("simView").innerHTML = simInner(unit, s);
  save();
};

window.applyPreset = (d1, d2) => {
  sessionFor(currentUnit()).setDials(d1, d2);
  save();
  render();
};

function renderUnit(i) {
  const unit = pack.units[i];
  const s = sessionFor(unit);
  const st = s.state;
  const d = draftFor(unit.topic_id);
  let body = "";

  if (st.stepIndex === 0) {
    body = `
      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5">
        <p class="text-xs text-[var(--muted-foreground)]">${esc(unit.what_gate.prompt)}</p>
        <div class="text-sm font-semibold">${esc(unit.what_gate.question)}</div>
        <div class="grid gap-2 text-xs">
          ${unit.what_gate.options.map((o, k) => `<button onclick="answerWhat(${k})" class="p-3 ${btnBase} ${btnIdle} text-left font-medium">${esc(o.label)}</button>`).join("")}
        </div>
        ${st.whatGateFeedback && !st.whatGatePassed ? `<div class="text-xs text-[var(--warning)]">${esc(st.whatGateFeedback)}</div>` : ""}
      </div>`;
  } else if (st.stepIndex === 1) {
    const hw = unit.how_why_challenge;
    if (st.needsFollowup) {
      body = `
        <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 space-y-2.5">
          <div class="text-sm text-[var(--success)] font-semibold">${esc(st.praiseFirstText || "")}</div>
          <div class="text-sm font-semibold">💬 ${esc(st.followupQuestion)}</div>
          <textarea id="followupText" rows="3" oninput="updateDraft('followup', this.value)" placeholder="Add a sentence about what's happening…"
            class="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-2.5 text-sm">${esc(d.followup)}</textarea>
          <button onclick="submitFollowup()" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">Send</button>
        </div>`;
    } else {
      body = `
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-3">
          <p class="text-xs text-[var(--muted-foreground)]">${esc(hw.instruction)}</p>
          <div class="space-y-2">
            <div class="text-sm font-semibold">${esc(hw.part1_how_question)}</div>
            ${hw.part1_choices
              .map(
                c => `<button onclick="pickHow('${c.id}')" class="w-full p-3 ${btnBase} ${d.how === c.id ? "border-[var(--primary)] font-semibold" : btnIdle} text-left text-xs">${esc(c.label)}</button>`
              )
              .join("")}
          </div>
          <div class="space-y-1.5">
            <div class="text-sm font-semibold">${esc(hw.part2_why_question)}</div>
            <textarea rows="3" oninput="updateDraft('why', this.value)" placeholder="${esc(hw.part2_placeholder)}"
              class="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-2.5 text-sm">${esc(d.why)}</textarea>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-[var(--muted-foreground)]">How sure are you?</span>
            ${["sure", "unsure"]
              .map(c => `<button onclick="pickConfidence('${c}')" class="px-3 py-1 rounded-full border ${d.confidence === c ? "border-[var(--primary)] font-semibold" : "border-[var(--card-border)]"}">${c === "sure" ? "😎 Sure" : "🤔 Unsure"}</button>`)
              .join("")}
          </div>
          ${d.error ? `<div class="text-xs text-[var(--warning)]">${esc(d.error)}</div>` : ""}
          <button onclick="submitHowWhy()" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">Check my answer</button>
        </div>`;
    }
  } else if (st.stepIndex === 2) {
    const badge = (ok, label) =>
      `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${ok ? "bg-[var(--success)] text-white" : "bg-[var(--warning)] text-white"}">${ok ? "✓" : "✗"} ${label}</span>`;
    body = `
      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5 fade-in">
        <div class="text-sm font-semibold">${esc(st.praiseFirstText || "")}</div>
        <div class="flex flex-wrap gap-2">${badge(st.checkAPass, "Prediction (HOW)")}${badge(st.checkBPass, "Mechanism (WHY)")}</div>
        ${st.targetedReplayText && replayLocked(s) ? `<div class="rounded-xl border border-[var(--warning)] p-3 text-xs">${esc(st.targetedReplayText)}</div>` : ""}
        <button onclick="beginWhatIf()" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">Continue to the What-If proof →</button>
      </div>`;
  } else if (st.stepIndex === 3) {
    const w = unit.what_if_proof;
    const mastered = st.masteryState === "independent_mastery";
    body = `
      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5">
        <p class="text-xs text-[var(--muted-foreground)]">${esc(w.prompt)}</p>
        <div class="rounded-xl border-l-4 border-[var(--primary)] bg-[var(--secondary)] p-3 text-sm">${esc(w.scenario)}</div>
        <div class="text-sm font-semibold">${esc(w.question)}</div>
        <div class="grid gap-2 text-xs">
          ${w.options.map((o, k) => `<button onclick="answerWhatIf(${k})" class="p-3 ${btnBase} ${btnIdle} text-left font-medium">${esc(o.label)}</button>`).join("")}
        </div>
        ${st.whatIfFeedback ? `<div class="text-xs font-semibold ${mastered ? "text-[var(--success)]" : "text-[var(--warning)]"}">${esc(st.whatIfFeedback)}</div>` : ""}
        ${mastered ? `<button onclick="toConnect()" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">Connect it →</button>` : ""}
      </div>`;
  } else {
    const b = unit.object_spec.state_transition_bridge;
    const cb = unit.connect_bridge || {};
    const next = pack.units[i + 1];
    body = `
      <div class="rounded-2xl border border-[var(--success)] bg-[var(--card)] p-4 space-y-3 fade-in">
        <div class="text-sm font-bold">🔗 How this connects</div>
        <div class="space-y-1 text-xs">
          <div class="inline-block px-3 py-1.5 rounded-lg border border-[var(--primary)] font-semibold">${esc(b.source_state)}</div>
          <div class="pl-3 text-[var(--muted-foreground)]">↓ ${esc(b.bridge_condition)}</div>
          <div class="inline-block px-3 py-1.5 rounded-lg border border-[var(--primary)] font-semibold">${esc(b.target_state)}</div>
          <div class="pl-3 text-[var(--muted-foreground)]">↺ ${esc(b.return_feedback_loop)}</div>
        </div>
        <div class="space-y-1.5">
          <div class="text-xs font-bold">Where the picture breaks</div>
          ${(cb.analogy_limits || [])
            .map(a => `<div class="rounded-lg bg-[var(--secondary)] p-2.5 text-xs"><div class="text-[var(--muted-foreground)]">✗ ${md(a.breaks)}</div><div>✓ ${md(a.reality)}</div></div>`)
            .join("")}
        </div>
        <div class="text-xs text-[var(--success)] font-mono">✓ Review scheduled: ${esc(cb.next_review || "10 min → Day 1 → Day 3 → Day 7")}</div>
        <div class="flex justify-end">
          <button onclick="${next ? `go('unit', ${i + 1})` : "go('recap')"}" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">
            ${next ? `${esc(next.short_tab)} →` : "🏆 Open the recap →"}
          </button>
        </div>
      </div>`;
  }

  return `
    <div class="space-y-0.5">
      <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">${esc(unit.short_tab)} · ${esc(unit.sub_tab)}</p>
      <h2 class="text-base sm:text-lg font-semibold">${esc(unit.title.replace(/^Unit \d+ \([^)]*\):\s*/, ""))}</h2>
      ${st.stepIndex === 0 ? `<p class="text-xs text-[var(--muted-foreground)]">${esc(unit.purpose_hook)}</p>` : ""}
    </div>
    <div class="grid grid-cols-5 gap-1">
      ${STEPS.map(
        (label, k) => `<div class="text-center rounded-lg px-1 py-1.5 text-[10px] sm:text-xs font-semibold ${
          k < st.stepIndex
            ? "bg-[var(--success)] text-white"
            : k === st.stepIndex
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
        }">${label}</div>`
      ).join("")}
    </div>
    ${renderSim(unit, s)}
    ${body}`;
}

window.answerWhat = k => {
  const s = sessionFor(currentUnit());
  const r = s.submitWhatGate(k);
  if (r.passed) s.advanceToHowWhy();
  save();
  render();
};

window.pickHow = id => {
  draftFor(currentUnit().topic_id).how = id;
  render();
};
window.pickConfidence = c => {
  draftFor(currentUnit().topic_id).confidence = c;
  render();
};
window.updateDraft = (field, v) => {
  draftFor(currentUnit().topic_id)[field] = v;
};

window.submitHowWhy = () => {
  const unit = currentUnit();
  const d = draftFor(unit.topic_id);
  if (!d.how || !d.why.trim()) {
    d.error = "Pick a prediction and explain why in your own words.";
    render();
    return;
  }
  d.error = null;
  const r = sessionFor(unit).submitHowWhy({ howChoiceId: d.how, whyText: d.why, confidenceTap: d.confidence });
  postLedger(r.ledgerEntry);
  save();
  render();
};

window.submitFollowup = () => {
  const unit = currentUnit();
  const d = draftFor(unit.topic_id);
  if (!d.followup.trim()) return;
  const r = sessionFor(unit).resolveFollowup(d.followup.trim());
  d.followup = "";
  postLedger(r?.ledgerEntry);
  save();
  render();
};

window.beginWhatIf = () => {
  sessionFor(currentUnit()).advanceToWhatIf();
  save();
  render();
};

window.answerWhatIf = k => {
  const r = sessionFor(currentUnit()).submitWhatIf(k);
  postLedger(r.ledgerEntry);
  save();
  render();
};

window.toConnect = () => {
  sessionFor(currentUnit()).advanceToConnect();
  save();
  render();
};

// ---------------------------------------------------------------- recap & what's next

function renderRecap() {
  const r = state.recap;
  const rc = pack.recap || {};
  const unitRows = pack.units.map(u => {
    const s = sessionFor(u);
    const st = s.state;
    return { u, mastered: st.masteryState === "independent_mastery", a: st.checkAPass, b: st.checkBPass };
  });

  return `
    <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--card-border)] pb-2">
        <div>
          <div class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">End-of-path consolidation</div>
          <div class="text-base font-bold">Unified Mastery Recap</div>
        </div>
        <span class="px-2 py-1 rounded bg-[var(--secondary)] text-xs font-mono">${esc(pack.title)}</span>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 1 · Walk the path backwards</div>
        <div class="text-sm font-semibold">${esc(rc.backwards_question || "Which chain is right?")}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${(rc.backwards_options || [])
            .map(
              (o, k) => `<button onclick="answerBackwards(${k})" class="p-3 ${btnBase} text-left ${
                r.backwards === k ? (o.correct ? "border-[var(--success)] font-semibold" : "border-[var(--warning)]") : btnIdle
              }">${esc(o.label)}</button>`
            )
            .join("")}
        </div>
        ${
          r.backwards != null
            ? rc.backwards_options[r.backwards]?.correct
              ? `<div class="text-xs text-[var(--success)] font-semibold">✓ Chain verified.</div>`
              : `<div class="text-xs text-[var(--warning)]">Not quite. Each unit builds on the one before it.</div>`
            : ""
        }
      </div>

      <div class="space-y-2 border-t border-[var(--card-border)] pt-3">
        <div class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 2 · Your scorecard</div>
        <div class="grid grid-cols-1 sm:grid-cols-${pack.units.length} gap-2">
          ${unitRows
            .map(
              x => `<div class="rounded-xl border ${x.mastered ? "border-[var(--success)]" : "border-[var(--card-border)]"} p-2.5 text-center text-xs">
                <div class="text-[var(--muted-foreground)]">${esc(x.u.short_tab)}</div>
                <div class="font-bold ${x.mastered ? "text-[var(--success)]" : "text-[var(--muted-foreground)]"}">${x.mastered ? "★ Mastered" : x.a === null ? "Not started" : "In practice"}</div>
              </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="space-y-2 border-t border-[var(--card-border)] pt-3">
        <div class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 3 · Day-1 Hook</div>
        <div class="flex flex-col sm:flex-row gap-2">
          <input type="text" value="${esc(r.rule)}" oninput="updateRule(this.value)" placeholder="${esc(rc.hook_placeholder || "Write your 1-sentence takeaway for tomorrow's review…")}"
            class="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-xs" />
          <button onclick="saveRule()" class="px-4 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold shrink-0">Save Day-1 Hook</button>
        </div>
        ${r.emptyHint && !r.saved ? `<div class="text-xs text-[var(--warning)] font-semibold">✍️ Write your 1-sentence takeaway first, then tap Save Day-1 Hook.</div>` : ""}
        ${r.saved ? `<div class="text-xs text-[var(--success)] font-mono">✓ Scheduled: 10 min (Backwards Review) → 1 hr → Day 1 → Day 3 → Day 7</div>` : ""}
        ${r.saved ? renderWhatsNext() : ""}
      </div>
    </div>`;
}

function renderWhatsNext() {
  const n = state.next;
  const steps = pack.apply?.steps || [];
  const choice = (key, icon, title, sub) => `
    <button onclick="chooseNext('${key}')" class="flex-1 text-left p-3 ${btnBase} ${n.choice === key ? "border-[var(--primary)]" : btnIdle}">
      <div class="text-sm font-semibold">${icon} ${title}</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-0.5">${sub}</div>
    </button>`;
  const plan =
    n.choice !== "apply"
      ? ""
      : `
      <div class="space-y-2 fade-in">
        <input type="text" value="${esc(n.topic)}" oninput="updateApplyTopic(this.value)" onchange="rerender()" placeholder="${esc(pack.apply?.placeholder || "Where will you use this?")}"
          class="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-xs" />
        <div class="text-xs font-semibold">Your plan${n.topic.trim() ? ` for <span class="text-[var(--primary)]">${esc(n.topic.trim())}</span>` : ""}:</div>
        ${steps
          .map(
            (s, k) => `<label class="flex items-start gap-2.5 p-2.5 rounded-xl border ${n.done.includes(k) ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--background)] cursor-pointer">
              <input type="checkbox" ${n.done.includes(k) ? "checked" : ""} onchange="toggleStep(${k})" class="mt-0.5" />
              <span class="text-xs"><b>${k + 1}. ${esc(s.label)}:</b> ${esc(s.text)}</span>
            </label>`
          )
          .join("")}
        <div class="text-xs ${n.done.length === steps.length ? "text-[var(--success)] font-semibold" : "text-[var(--muted-foreground)]"}">
          ${n.done.length === steps.length ? "🎉 You used it on something real. That's understanding in action." : `${n.done.length} of ${steps.length} done`}
        </div>
        <button onclick="chooseNext('search')" class="w-full py-2 ${btnBase} ${btnIdle} text-xs font-semibold">🔍 Done? Start a new search</button>
      </div>`;
  return `
    <div class="rounded-xl border border-[var(--primary)] p-3.5 space-y-2.5 fade-in">
      <div class="text-sm font-bold">What's next?</div>
      <div class="flex flex-col sm:flex-row gap-2">
        ${choice("apply", "🛠️", "Use it now", "Put what you just learned to work on something real")}
        ${choice("search", "🔍", "Start a new search", "Learn a new topic")}
      </div>
      ${plan}
    </div>`;
}

window.answerBackwards = k => {
  state.recap.backwards = k;
  save();
  render();
};
window.updateRule = v => {
  state.recap.rule = v;
  save();
};
window.saveRule = () => {
  if (!state.recap.rule.trim()) {
    state.recap.emptyHint = true;
    render();
    return;
  }
  state.recap.emptyHint = false;
  state.recap.saved = true;
  postLedger({
    topic_id: `${pack.topic_pack_id}_recap`,
    objective_id: "personal_1_line_rule_day1_hook",
    lesson_version: pack.version,
    rubric_version: pack.version,
    learner_response: state.recap.rule.trim(),
    check_a_prediction_pass: true,
    check_b_mechanism_pass: true,
    mastery_state: "supported_practice"
  });
  save();
  render();
};
window.chooseNext = key => {
  if (key === "search") {
    location.href = "/";
    return;
  }
  state.next.choice = key;
  save();
  render();
};
window.updateApplyTopic = v => {
  state.next.topic = v;
  save();
};
window.toggleStep = k => {
  const d = state.next.done;
  state.next.done = d.includes(k) ? d.filter(x => x !== k) : [...d, k];
  save();
  render();
};

// ---------------------------------------------------------------- shell

function render() {
  if (!pack) return;
  renderNav();
  let html = "";
  if (state.screen === "setup") html = renderSetup();
  else if (state.screen === "card") html = renderCard(Math.min(state.idx, pack.discovery_cards.length - 1));
  else if (state.screen === "loop") html = renderLoop();
  else if (state.screen === "unit") html = renderUnit(Math.min(state.idx, pack.units.length - 1));
  else html = renderRecap();
  stage.innerHTML = renderSubTabs() + html;
}

window.go = go;
window.rerender = () => render();
window.toggleDepth = () => {
  state.depth = state.depth === "deep" ? "simple" : "deep";
  save();
  render();
};
window.resetLesson = () => {
  if (!confirm("Start this lesson over? Your progress on this topic will be cleared.")) return;
  state = defaultState();
  for (const k of Object.keys(sessions)) delete sessions[k];
  for (const k of Object.keys(drafts)) delete drafts[k];
  save();
  render();
};

(async function boot() {
  if (!TOPIC_ID) {
    // A lesson served at its own path (e.g. /learn): find the pack whose registry href is this path.
    try {
      const { packs } = await (await fetch("/api/packs")).json();
      TOPIC_ID = packs.find(p => p.href === location.pathname)?.id || "";
      STORAGE_KEY = `dubida_lesson_${TOPIC_ID}`;
    } catch {
      // fall through to "No topic chosen"
    }
  }
  if (!TOPIC_ID) {
    stage.innerHTML = `<p class="text-sm text-center py-10">No topic chosen. <a class="text-[var(--primary)] underline" href="/">Search for one</a>.</p>`;
    return;
  }
  try {
    const res = await fetch(`/api/packs/${encodeURIComponent(TOPIC_ID)}`);
    if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
    pack = await res.json();
  } catch (err) {
    stage.innerHTML = `<p class="text-sm text-center py-10">Couldn't load this lesson: ${esc(err.message)}. <a class="text-[var(--primary)] underline" href="/">Back to search</a>.</p>`;
    return;
  }
  document.title = `DUBIDA · ${pack.title}`;
  load();
  render();
})();
