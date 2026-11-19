/**
 * Understanding App — Developer Route & Engine Telemetry Inspector (/dev)
 * Imports directly from /src/engine/* and /src/topics/* so the exact same universal
 * engine powers both the CLI/Node test suite and the interactive Developer Route.
 */

import { THINKING_LEARNING_UNDERSTANDING_PACK } from "/src/topics/thinking_learning_understanding.js";
import { compileAndValidateTopicPack, evaluateRuntimeCanary } from "/src/engine/schema.js";
import { evaluateSplitRubric } from "/src/engine/grader.js";
import { createLedgerEntry } from "/src/engine/ledger.js";
import { SPINE_STEPS } from "/src/engine/runtime.js";
import { renderVisual } from "/js/lesson-visuals.js";

const UNITS = THINKING_LEARNING_UNDERSTANDING_PACK.units;
const compilerReport = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);

let curUnitIdx = 0;
let unitMasteryMap = {
  0: "in_progress",
  1: "in_progress",
  2: "in_progress",
  3: "in_progress",
  4: "in_progress"
};
let state = {};
let inspectorTab = "ledger";
let sharedLedgerEntries = [];

async function syncBackendLedger(newEntry = null) {
  try {
    if (newEntry) {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
      });
      if (res.ok) {
        const data = await res.json();
        sharedLedgerEntries = data.entries || sharedLedgerEntries;
      }
    } else {
      const res = await fetch("/api/ledger");
      if (res.ok) {
        const data = await res.json();
        sharedLedgerEntries = data.entries || [];
      }
    }
  } catch {
    if (newEntry) {
      sharedLedgerEntries.unshift(createLedgerEntry(newEntry));
    }
  }
}

function loadUnit(idx) {
  curUnitIdx = idx;
  const u = UNITS[curUnitIdx];
  const d1 = u.object_spec.dials.dial1.default;
  const d2 = u.object_spec.dials.dial2.default;
  state = {
    stepIndex: 0,
    paused: false,
    whatGatePassed: false,
    whatGateFeedback: null,
    confidence: "sure",
    dial1: d1,
    dial2: d2,
    howChoiceId: null,
    whyText: "",
    validationMsg: null,
    checkAPass: null,
    checkBPass: null,
    needsFollowup: false,
    followupAnswered: false,
    misconceptionTag: null,
    helpUsed: [],
    masteryState: unitMasteryMap[idx] || "in_progress",
    whatIfFeedback: null,
    ledgerHistory: []
  };
  recordLedgerEvent("unit_loaded", `Loaded ${u.topic_id} (${u.short_tab})`);
  renderAll();
}

window.resetUnit = () => {
  unitMasteryMap[curUnitIdx] = "in_progress";
  loadUnit(curUnitIdx);
};
window.selectUnit = idx => loadUnit(idx);
window.setInspectorTab = t => {
  inspectorTab = t;
  renderInspector();
};
window.togglePause = () => {
  state.paused = !state.paused;
  recordLedgerEvent(state.paused ? "session_paused" : "session_resumed", "Toggled pause.");
  renderAll();
};

function recordLedgerEvent(action, detail) {
  const u = UNITS[curUnitIdx];
  const entry = createLedgerEntry({
    topic_id: u.topic_id,
    objective_id: u.objective,
    lesson_version: u.lesson_version,
    rubric_version: u.rubric_version,
    confidence_tap: state.confidence || "sure",
    learner_response: `[${action}] ${detail}`,
    followup_asked: state.needsFollowup ? u.how_why_challenge.rubric.followup_question : null,
    check_a_prediction_pass: Boolean(state.checkAPass),
    check_b_mechanism_pass: Boolean(state.checkBPass),
    help_used: [...state.helpUsed],
    mastery_state:
      state.masteryState === "independent_mastery" ? "independent_mastery" : "supported_practice",
    misconception_tag: state.misconceptionTag
  });
  state.ledgerHistory.unshift(entry);
  if (action === "split_rubric_graded" || action === "unassisted_what_if_pass") {
    syncBackendLedger(entry).then(() => renderInspector());
  }
}

// ============================================================================
// UNIVERSAL DIAL CONTROLS
// ============================================================================
window.setDialValue = (which, rawVal) => {
  const u = UNITS[curUnitIdx];
  const spec = which === 1 ? u.object_spec.dials.dial1 : u.object_spec.dials.dial2;
  let num = parseInt(rawVal, 10);
  if (isNaN(num)) num = spec.min;
  num = Math.max(spec.min, Math.min(spec.max, num));
  if (which === 1) state.dial1 = num;
  else state.dial2 = num;
  renderLivingObjectContainer();
};

window.applyScenarioValues = (d1, d2) => {
  state.dial1 = d1;
  state.dial2 = d2;
  renderLivingObjectContainer();
};

function renderDialControl(which, spec, currentVal) {
  return `
    <div class="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-2.5 space-y-1.5">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-[var(--foreground)]">${spec.label}</span>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="setDialValue(${which}, ${currentVal - 1})" class="w-6 h-6 rounded border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)] font-mono text-xs font-bold">−</button>
          <input type="number" min="${spec.min}" max="${spec.max}" value="${currentVal}" onchange="setDialValue(${which}, this.value)" class="w-11 h-6 text-center rounded border border-[var(--primary)] bg-[var(--background)] font-mono text-xs font-bold text-[var(--foreground)]" />
          <button onclick="setDialValue(${which}, ${currentVal + 1})" class="w-6 h-6 rounded border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)] font-mono text-xs font-bold">+</button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-[var(--muted-foreground)]">${spec.min}</span>
        <input type="range" min="${spec.min}" max="${spec.max}" value="${currentVal}" oninput="setDialValue(${which}, this.value)" class="w-full accent-[var(--primary)]" />
        <span class="text-xs font-mono text-[var(--muted-foreground)]">${spec.max}</span>
      </div>
    </div>
  `;
}

// ============================================================================
// VIVID UNIT SIMULATIONS (STM <-> LTM PIPELINE)
// ============================================================================
function renderLivingObjectContainer() {
  const wrap = document.getElementById("livingObjectWrapper");
  if (!wrap) return;
  if (state.paused) {
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");

  const u = UNITS[curUnitIdx];
  const spec = u.object_spec;
  const isReplay = state.stepIndex === 2 && (!state.checkAPass || !state.checkBPass);

  // Same kit drawings as the learner's lesson player (public/js/visuals/thinking.js).
  const { svg: svgHtml, banner: statusBanner } = renderVisual(spec, state.dial1, state.dial2);

  let quickScenarioBtn = "";
  if (state.stepIndex === 1 && spec.target_experiment) {
    const te = spec.target_experiment;
    quickScenarioBtn = `
      <button onclick="applyScenarioValues(${te.dial1}, ${te.dial2})" class="px-2.5 py-1 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] font-mono text-xs font-semibold">
        ⚡ One-Tap: ${te.label}
      </button>
    `;
  } else if (state.stepIndex === 3 && spec.whatif_experiment) {
    const we = spec.whatif_experiment;
    quickScenarioBtn = `
      <button onclick="applyScenarioValues(${we.dial1}, ${we.dial2})" class="px-2.5 py-1 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] font-mono text-xs font-semibold">
        ⚡ One-Tap: ${we.label}
      </button>
    `;
  }

  wrap.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--card-border)] pb-2.5">
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs font-bold text-[var(--primary)] uppercase">🕹️ LIVING OBJECT · ${u.sub_tab.toUpperCase()}</span>
        ${isReplay ? `<span class="px-2 py-0.5 rounded bg-[var(--warning)] text-[var(--primary-foreground)] font-mono text-xs font-semibold pulse-live">🔁 TARGETED REPLAY LOCKED</span>` : ""}
      </div>
      ${quickScenarioBtn}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
      <div class="md:col-span-7 rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-2">
        ${svgHtml}
      </div>
      <div class="md:col-span-5 space-y-2.5">
        ${renderDialControl(1, spec.dials.dial1, state.dial1)}
        ${renderDialControl(2, spec.dials.dial2, state.dial2)}
      </div>
    </div>

    <div class="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-2.5 font-mono text-xs font-semibold text-[var(--foreground)]">
      ${statusBanner}
    </div>
  `;
}

// ============================================================================
// MAIN STAGE & RIGHT-HAND DEV INSPECTOR RENDERING
// ============================================================================
function renderAll() {
  const u = UNITS[curUnitIdx];

  const pathEl = document.getElementById("unitPathBar");
  pathEl.innerHTML = "";
  UNITS.forEach((unitObj, i) => {
    const active = i === curUnitIdx;
    const mState = unitMasteryMap[i];
    const mastered = mState === "independent_mastery";
    const btn = document.createElement("button");
    btn.className = `text-left rounded-lg border p-2.5 transition-all ${
      active
        ? "border-[var(--primary)] bg-[var(--background)] shadow-sm"
        : mastered
        ? "border-[var(--success)] bg-[var(--background)]"
        : "border-[var(--card-border)] bg-[var(--background)] opacity-80 hover:opacity-100"
    }`;
    btn.onclick = () => selectUnit(i);
    btn.innerHTML = `
      <div class="flex items-center justify-between text-xs font-mono font-bold ${active ? "text-[var(--primary)]" : mastered ? "text-[var(--success)]" : "text-[var(--muted-foreground)]"}">
        <span>${unitObj.short_tab}</span>
        <span>${mastered ? "★" : active ? "●" : "○"}</span>
      </div>
      <div class="text-xs font-medium text-[var(--foreground)] mt-0.5 truncate">${unitObj.sub_tab}</div>
    `;
    pathEl.appendChild(btn);
  });

  const spineEl = document.getElementById("spineBar");
  spineEl.innerHTML = "";
  SPINE_STEPS.forEach((s, idx) => {
    const active = idx === state.stepIndex;
    const done = idx < state.stepIndex;
    const div = document.createElement("button");
    div.className = `text-left rounded-lg border p-2 transition-all ${
      active
        ? "border-[var(--primary)] bg-[var(--card)] shadow-sm"
        : done
        ? "border-[var(--success)] bg-[var(--card)]"
        : "border-[var(--border)] bg-[var(--card)] opacity-75 hover:opacity-100"
    }`;
    div.onclick = () => {
      state.stepIndex = idx;
      renderAll();
    };
    div.innerHTML = `
      <div class="text-xs font-mono font-bold ${active ? "text-[var(--primary)]" : done ? "text-[var(--success)]" : "text-[var(--muted-foreground)]"}">
        ${done ? "✓ " : ""}${s.code}
      </div>
      <div class="text-xs text-[var(--foreground)] truncate">${s.label}</div>
    `;
    spineEl.appendChild(div);
  });

  const curStep = SPINE_STEPS[state.stepIndex];
  document.getElementById("cardStepBadge").textContent = `${curStep.code} · ${curStep.label}`;
  document.getElementById("cardTitle").textContent = u.title;

  const mBadge = document.getElementById("masteryBadge");
  if (state.masteryState === "independent_mastery") {
    mBadge.className =
      "px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--success)] text-[var(--primary-foreground)] font-bold";
    mBadge.textContent = "★ INDEPENDENT MASTERY";
  } else if (state.masteryState === "supported_practice") {
    mBadge.className =
      "px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--warning)] text-[var(--primary-foreground)] font-bold";
    mBadge.textContent = "⚡ SUPPORTED PRACTICE";
  } else {
    mBadge.className =
      "px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] font-medium";
    mBadge.textContent = "⏳ IN PROGRESS";
  }

  document.getElementById("pauseBtn").textContent = state.paused
    ? "▶ Resume Session"
    : "⏸ Pause & Save State";
  document.getElementById("footerHint").textContent = `${u.short_tab} · ${u.topic_id}`;

  renderLivingObjectContainer();
  renderStage(u);
  renderInspector();
}

function renderStage(u) {
  const container = document.getElementById("stageContainer");
  if (state.paused) {
    container.innerHTML = `
      <div class="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-6 text-center space-y-2">
        <div class="text-base font-bold text-[var(--foreground)]">⏸ Session Paused & Saved</div>
        <p class="text-sm text-[var(--muted-foreground)]">Your exact step (${SPINE_STEPS[state.stepIndex].code}), dial settings, and rubric log are saved.</p>
      </div>
    `;
    return;
  }

  if (state.stepIndex === 0) {
    const wg = u.what_gate;
    container.innerHTML = `
      <div class="rounded-lg bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
        <span class="font-bold text-[var(--foreground)]">🎯 Purpose:</span> ${u.purpose_hook}
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">${wg.prompt}</div>
        <div class="text-base font-bold text-[var(--foreground)]">${wg.question}</div>
      </div>
      <div class="space-y-2">
        ${wg.options
          .map(
            (opt, i) => `
          <button onclick="answerWhatGate(${i})" class="w-full text-left p-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors text-sm font-medium">
            ${opt.label}
          </button>
        `
          )
          .join("")}
      </div>
      ${
        state.whatGateFeedback
          ? `
        <div class="p-3.5 rounded-lg border ${state.whatGatePassed ? "border-[var(--success)]" : "border-[var(--warning)]"} bg-[var(--background)] space-y-2.5">
          <div class="text-sm font-semibold ${state.whatGatePassed ? "text-[var(--success)]" : "text-[var(--warning)]"}">${state.whatGateFeedback}</div>
          ${
            state.whatGatePassed
              ? `
            <button onclick="goStep(1)" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold">
              Continue to Step 2: Predict & Explain →
            </button>
          `
              : ""
          }
        </div>
      `
          : ""
      }
    `;
    return;
  }

  if (state.stepIndex === 1) {
    const hw = u.how_why_challenge;
    container.innerHTML = `
      <div class="rounded-lg bg-[var(--background)] border border-[var(--card-border)] p-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
        ${hw.instruction}
      </div>

      <div class="space-y-2">
        <div class="text-sm font-bold text-[var(--foreground)]">${hw.part1_how_question}</div>
        <div class="grid grid-cols-1 gap-2">
          ${hw.part1_choices
            .map(ch => {
              const selected = state.howChoiceId === ch.id;
              return `
              <button onclick="selectHowChoice('${ch.id}')" class="p-3 rounded-lg border text-left text-sm font-medium transition-all ${
                selected
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)]"
              }">
                ${ch.label}
              </button>
            `;
            })
            .join("")}
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="text-sm font-bold text-[var(--foreground)]">${hw.part2_why_question}</div>
        <textarea id="whyInput" oninput="updateWhyText(this.value)" rows="2" class="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)]" placeholder="${hw.part2_placeholder}">${state.whyText}</textarea>
      </div>

      ${state.validationMsg ? `<div class="text-xs text-[var(--warning)] font-semibold">${state.validationMsg}</div>` : ""}

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-[var(--muted-foreground)] font-medium">Confidence:</span>
          <button onclick="setConf('sure')" class="px-2.5 py-1 rounded-md font-medium border ${state.confidence === "sure" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--card-border)] bg-[var(--background)]"}">👍 Sure</button>
          <button onclick="setConf('unsure')" class="px-2.5 py-1 rounded-md font-medium border ${state.confidence === "unsure" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--card-border)] bg-[var(--background)]"}">🤔 Unsure</button>
        </div>
        <button onclick="gradeHowWhy()" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold">
          Submit Answer →
        </button>
      </div>

      ${
        state.needsFollowup
          ? `
        <div class="rounded-lg border border-[var(--primary)] bg-[var(--background)] p-3.5 space-y-2.5 text-xs">
          <div class="font-bold text-sm text-[var(--primary)]">💬 Quick Clarifying Follow-Up:</div>
          <div class="text-sm text-[var(--foreground)] leading-relaxed">${hw.rubric.followup_question}</div>
          <div class="flex flex-wrap gap-2">
            <button onclick="resolveFollowup(true)" class="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold">
              Clarify STM ↔ LTM Mechanism (Pass w/ Follow-up)
            </button>
            <button onclick="resolveFollowup(false)" class="px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] font-medium">
              Show me on the simulation above
            </button>
          </div>
        </div>
      `
          : ""
      }
    `;
    return;
  }

  if (state.stepIndex === 2) {
    const hw = u.how_why_challenge;
    const chosenHowObj = hw.part1_choices.find(c => c.id === state.howChoiceId);
    const bothRightZeroHelp = state.checkAPass && state.checkBPass && state.helpUsed.length === 0;
    container.innerHTML = `
      <div class="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 space-y-1 text-xs">
        <div class="text-[var(--muted-foreground)] font-medium">Your submitted response:</div>
        <div class="text-sm"><b>Part 1 (HOW):</b> ${chosenHowObj ? chosenHowObj.label : "(none)"}</div>
        <div class="text-sm"><b>Part 2 (WHY):</b> <i>"${state.whyText || "(none)"}"</i></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="rounded-lg border ${state.checkAPass ? "border-[var(--success)]" : "border-[var(--warning)]"} bg-[var(--background)] p-3">
          <div class="font-mono text-xs font-bold ${state.checkAPass ? "text-[var(--success)]" : "text-[var(--warning)]"}">
            ${state.checkAPass ? "✅ Part 1 (HOW / Prediction): PASSED" : "⚠️ Part 1 (HOW / Prediction): MISSED"}
          </div>
          <div class="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
            ${state.checkAPass ? "You accurately predicted what happens in the STM ↔ LTM system." : "Check the simulation output above."}
          </div>
        </div>
        <div class="rounded-lg border ${state.checkBPass ? "border-[var(--success)]" : "border-[var(--warning)]"} bg-[var(--background)] p-3">
          <div class="font-mono text-xs font-bold ${state.checkBPass ? "text-[var(--success)]" : "text-[var(--warning)]"}">
            ${state.checkBPass ? "✅ Part 2 (WHY / Mechanism): PASSED" : "⚠️ Part 2 (WHY / Mechanism): GAP DETECTED"}
          </div>
          <div class="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
            ${state.checkBPass ? "You explained the underlying STM ↔ LTM bridge mechanism." : "Your prediction was right, but let's clarify how the STM ↔ LTM bridge works."}
          </div>
        </div>
      </div>

      ${
        !bothRightZeroHelp
          ? `
        <div class="rounded-lg border border-[var(--primary)] bg-[var(--background)] p-3.5 space-y-2 text-xs leading-relaxed">
          <div class="font-bold text-sm text-[var(--primary)]">${hw.rubric.targeted_replay}</div>
          <div class="text-[var(--muted-foreground)]">
            📌 <b>Engine Rule:</b> Because a targeted replay or follow-up was used, this is recorded as <code class="text-[var(--code-foreground)]">Supported Practice</code>. Solve the fresh <i>What-If</i> challenge next with zero hints to unlock <b>Independent Mastery</b>!
          </div>
        </div>
      `
          : `
        <div class="rounded-lg border border-[var(--success)] bg-[var(--background)] p-3.5 text-sm text-[var(--success)] font-semibold">
          ✨ Both checks passed with zero hints! Complete the quick What-If challenge next to lock in Independent Mastery.
        </div>
      `
      }

      <div class="flex justify-end">
        <button onclick="goStep(3)" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold">
          Continue to Step 4: Unassisted What-If →
        </button>
      </div>
    `;
    return;
  }

  if (state.stepIndex === 3) {
    const wi = u.what_if_proof;
    container.innerHTML = `
      <div class="rounded-lg border border-[var(--primary)] bg-[var(--background)] p-3">
        <div class="font-mono text-xs font-bold text-[var(--primary)]">🔒 STEP 4: UNASSISTED WHAT-IF CHALLENGE (0 Hints)</div>
        <div class="text-xs text-[var(--muted-foreground)] mt-1">${wi.prompt}</div>
      </div>
      <div class="rounded-lg bg-[var(--background)] border border-[var(--card-border)] p-3.5 text-sm text-[var(--foreground)] leading-relaxed font-medium">
        ${wi.scenario}
      </div>
      <div class="text-base font-bold text-[var(--foreground)]">${wi.question}</div>
      <div class="space-y-2">
        ${wi.options
          .map(
            (o, idx) => `
          <button onclick="answerWhatIf(${idx})" class="w-full text-left p-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors text-sm font-medium leading-snug">
            ${o.label}
          </button>
        `
          )
          .join("")}
      </div>
      ${
        state.whatIfFeedback
          ? `
        <div class="p-3.5 rounded-lg border ${state.masteryState === "independent_mastery" ? "border-[var(--success)]" : "border-[var(--warning)]"} bg-[var(--background)] space-y-2.5">
          <div class="text-sm font-semibold ${state.masteryState === "independent_mastery" ? "text-[var(--success)]" : "text-[var(--warning)]"}">${state.whatIfFeedback}</div>
          ${
            state.masteryState === "independent_mastery"
              ? `
            <button onclick="goStep(4)" class="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold">
              View Step 5: Model Limits & Next Unit →
            </button>
          `
              : ""
          }
        </div>
      `
          : ""
      }
    `;
    return;
  }

  if (state.stepIndex === 4) {
    const cb = u.connect_bridge;
    container.innerHTML = `
      <div class="rounded-xl border-2 border-[var(--success)] bg-[var(--background)] p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <div class="text-xs font-mono uppercase tracking-wider font-bold text-[var(--success)]">✓ Independent Mastery Verified</div>
          <h3 class="text-base font-bold text-[var(--foreground)]">${u.objective}</h3>
        </div>
        <span class="px-3 py-1.5 rounded-lg bg-[var(--success)] text-[var(--primary-foreground)] font-mono text-xs font-bold shrink-0">
          ★ ${u.short_tab} Mastered
        </span>
      </div>

      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-[var(--foreground)]">🔬 Where the Simplified Model Breaks (Deeper Cognitive Science)</h4>
          <span class="text-xs text-[var(--muted-foreground)]">Guardrail Gate 3 & 5</span>
        </div>
        <div class="grid grid-cols-1 gap-3">
          ${cb.analogy_limits
            .map(
              (lim, i) => `
            <div class="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div class="sm:col-span-5 space-y-1 border-b sm:border-b-0 sm:border-r border-[var(--card-border)] pb-2 sm:pb-0 sm:pr-3">
                <span class="px-2 py-0.5 rounded text-xs font-mono bg-[var(--secondary)] text-[var(--warning)] font-semibold">${u.unit_num === 5 ? `Consolidation #${i + 1}` : `Model Simplification #${i + 1}`}</span>
                <div class="text-sm font-bold text-[var(--foreground)] pt-0.5">${lim.breaks}</div>
              </div>
              <div class="sm:col-span-7 space-y-1">
                <span class="text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-semibold">Full Cognitive Science</span>
                <div class="text-sm text-[var(--muted-foreground)] leading-relaxed">${lim.reality}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="rounded-xl border border-[var(--primary)] bg-[var(--background)] p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <div class="text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-bold">🗓️ Spaced Transfer Schedule</div>
          <div class="text-sm text-[var(--muted-foreground)]">${cb.next_review}</div>
          <div class="text-sm font-bold text-[var(--foreground)] pt-0.5">${cb.next_unit}</div>
        </div>
        <button onclick="selectUnit(${cb.next_unit_idx})" class="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold shrink-0">
          ${u.unit_num < 4 ? `Launch Unit ${u.unit_num + 1} →` : u.unit_num === 4 ? `🏆 Launch Unified Recap →` : `Restart from Unit 1 ↺`}
        </button>
      </div>
    `;
  }
}

// ============================================================================
// INTERACTION HANDLERS & SPLIT-RUBRIC GRADER
// ============================================================================
window.answerWhatGate = idx => {
  const wg = UNITS[curUnitIdx].what_gate;
  const chosen = wg.options[idx];
  state.whatGatePassed = chosen.correct;
  state.whatGateFeedback = chosen.feedback;
  if (!chosen.correct && !state.helpUsed.includes("prereq_gate_retry")) {
    state.helpUsed.push("prereq_gate_retry");
  }
  recordLedgerEvent("what_gate_attempt", `Selected '${chosen.id}' -> ${chosen.correct ? "PASS" : "RETRY"}`);
  renderAll();
};

window.selectHowChoice = id => {
  state.howChoiceId = id;
  state.validationMsg = null;
  renderAll();
};

window.updateWhyText = val => {
  state.whyText = val;
  state.validationMsg = null;
};

window.applyQaPersona = idx => {
  const p = UNITS[curUnitIdx].how_why_challenge.qa_personas[idx];
  state.stepIndex = 1;
  state.dial1 = p.d1;
  state.dial2 = p.d2;
  state.howChoiceId = p.how_choice;
  state.whyText = p.why_text;
  state.needsFollowup = false;
  state.validationMsg = null;
  recordLedgerEvent("qa_persona_loaded", `Loaded test persona: ${p.name}`);
  renderAll();
};

window.setConf = c => {
  state.confidence = c;
  renderAll();
};

window.gradeHowWhy = () => {
  const u = UNITS[curUnitIdx];
  if (!state.howChoiceId || !state.whyText.trim()) {
    state.validationMsg =
      "Please pick an answer for Part 1 (HOW) and type a reason for Part 2 (WHY) — or click a QA Persona on the right to auto-fill.";
    renderAll();
    return;
  }

  const gradeResult = evaluateSplitRubric({
    unit: u,
    howChoiceId: state.howChoiceId,
    whyText: state.whyText,
    followupAlreadyAsked: state.followupAnswered,
    priorHelpUsed: state.helpUsed
  });

  state.checkAPass = gradeResult.check_a_prediction_pass;
  state.checkBPass = gradeResult.check_b_mechanism_pass;
  state.helpUsed = gradeResult.help_used;
  state.misconceptionTag = gradeResult.misconception_tag;

  if (gradeResult.status === "needs_followup") {
    state.needsFollowup = true;
    state.masteryState = "supported_practice";
    unitMasteryMap[curUnitIdx] = "supported_practice";
    recordLedgerEvent("ambiguity_followup", "Part 1 passed, Part 2 ambiguous -> Asked 1 clarifying question.");
    renderAll();
    return;
  }

  if (!state.checkAPass || !state.checkBPass) {
    state.masteryState = "supported_practice";
    unitMasteryMap[curUnitIdx] = "supported_practice";
    const te = u.object_spec.target_experiment;
    if (te) {
      state.dial1 = te.dial1;
      state.dial2 = te.dial2;
    }
  }

  recordLedgerEvent(
    "split_rubric_graded",
    `Check A (HOW): ${state.checkAPass ? "PASS" : "FAIL"} | Check B (WHY): ${state.checkBPass ? "PASS" : "FAIL"}`
  );
  state.stepIndex = 2;
  renderAll();
};

window.resolveFollowup = resolvedCorrectly => {
  state.followupAnswered = true;
  state.needsFollowup = false;
  state.checkBPass = resolvedCorrectly;
  if (!resolvedCorrectly && !state.helpUsed.includes("targeted_visual_replay")) {
    state.helpUsed.push("targeted_visual_replay");
  }
  state.masteryState = "supported_practice";
  unitMasteryMap[curUnitIdx] = "supported_practice";
  recordLedgerEvent("followup_resolved", `Clarifying follow-up resolved: ${resolvedCorrectly ? "PASS" : "NEEDS_REPLAY"}`);
  state.stepIndex = 2;
  renderAll();
};

window.answerWhatIf = idx => {
  const u = UNITS[curUnitIdx];
  const wi = u.what_if_proof;
  const opt = wi.options[idx];
  state.whatIfFeedback = opt.feedback;
  const we = u.object_spec.whatif_experiment;
  if (we) {
    state.dial1 = we.dial1;
    state.dial2 = we.dial2;
  }
  if (opt.correct) {
    state.masteryState = "independent_mastery";
    unitMasteryMap[curUnitIdx] = "independent_mastery";
    recordLedgerEvent("unassisted_what_if_pass", "Passed unseen What-If test with 0 hints -> INDEPENDENT MASTERY.");
  } else {
    state.masteryState = "supported_practice";
    unitMasteryMap[curUnitIdx] = "supported_practice";
    recordLedgerEvent("unassisted_what_if_retry", "Missed What-If check -> Retrying.");
  }
  renderAll();
};

window.goStep = idx => {
  state.stepIndex = idx;
  renderAll();
};

// ============================================================================
// RIGHT-HAND DEV INSPECTOR, 5-GATE AUDIT & QA PERSONAS
// ============================================================================
function renderInspector() {
  const u = UNITS[curUnitIdx];
  const unitAudit = compilerReport.unitReports[curUnitIdx];
  const allAttempts = [...sharedLedgerEntries, ...state.ledgerHistory];
  const canaryReport = evaluateRuntimeCanary(allAttempts, 0.15);

  const compBadge = document.getElementById("compilerBadge");
  if (compBadge) {
    compBadge.className = `px-2 py-0.5 rounded font-mono text-xs font-bold ${
      unitAudit.valid ? "bg-[var(--success)] text-[var(--primary-foreground)]" : "bg-[var(--warning)] text-[var(--primary-foreground)]"
    }`;
    compBadge.textContent = unitAudit.valid ? "✓ GATES 1–5 VERIFIED" : "⚠️ COMPILER ALERT";
  }

  const gatesGrid = document.getElementById("guardrailGatesGrid");
  if (gatesGrid) {
    const gateRows = [
      {
        label: "Gate 1 · Single Evolving System",
        ok: unitAudit.gates.gate1_single_evolving_system,
        detail: u.system_model_layer.root_system_id
      },
      {
        label: "Gate 2 · State-Transition Bridge",
        ok: unitAudit.gates.gate2_state_transition_bridge,
        detail: "STM ──► Bridge ──► LTM ──► Loop"
      },
      {
        label: "Gate 3 · Zero Phantom Controls",
        ok: unitAudit.gates.gate3_zero_phantom_controls,
        detail: `${u.object_spec.literal_take_audit.control_mappings.length} controls mapped 1:1`
      },
      {
        label: "Gate 4 · 4-Corner Truth Table",
        ok: unitAudit.gates.gate4_four_corner_truth_table,
        detail: "Min/Min, Max/Min, Min/Max, Max/Max, Zero"
      },
      {
        label: "Gate 5 · Runtime Canary (<15%)",
        ok: canaryReport.canary_healthy,
        detail: canaryReport.canary_healthy
          ? "0 flagged misconceptions"
          : `${canaryReport.alerts.length} flagged (>15%)`
      }
    ];
    gatesGrid.innerHTML = gateRows
      .map(
        g => `
        <div class="flex items-center justify-between rounded bg-[var(--background)] border border-[var(--card-border)] px-2.5 py-1.5">
          <span class="font-semibold ${g.ok ? "text-[var(--success)]" : "text-[var(--warning)]"}">${g.ok ? "✓" : "⚠️"} ${g.label}</span>
          <span class="text-[var(--muted-foreground)] truncate ml-2">${g.detail}</span>
        </div>
      `
      )
      .join("");
  }

  const qaList = document.getElementById("qaButtonsList");
  qaList.innerHTML = u.how_why_challenge.qa_personas
    .map(
      (p, i) => `
      <button onclick="applyQaPersona(${i})" class="w-full text-left px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)] text-xs transition-colors">
        <div class="font-bold text-[var(--foreground)]">${p.name}</div>
        <div class="text-[var(--muted-foreground)] truncate mt-0.5">WHY: "${p.why_text}"</div>
      </button>
    `
    )
    .join("");

  document.getElementById("specVerBadge").textContent = `v${u.lesson_version}`;
  document.getElementById("xrayNode").textContent = SPINE_STEPS[state.stepIndex].code;
  document.getElementById("xrayMastery").textContent = state.masteryState.toUpperCase();
  document.getElementById("xrayCheckA").textContent =
    state.checkAPass === null ? "Pending" : state.checkAPass ? "✅ PASS" : "⚠️ FAIL";
  document.getElementById("xrayCheckB").textContent =
    state.checkBPass === null ? "Pending" : state.checkBPass ? "✅ PASS" : "⚠️ GAP";
  document.getElementById("xrayHelp").textContent = state.helpUsed.length
    ? JSON.stringify(state.helpUsed)
    : "[] (0 hints used)";

  const tabLabels = {
    ledger: "Evidence Ledger",
    rubric: "Split Rubric",
    object: "Living Object",
    truth: "4-Corner Truth"
  };

  ["ledger", "rubric", "object", "truth"].forEach(t => {
    const b = document.getElementById(`inspTab-${t}`);
    if (!b) return;
    const active = t === inspectorTab;
    b.className = `px-2 py-1 rounded font-mono text-xs ${
      active
        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
        : "bg-[var(--background)] text-[var(--muted-foreground)]"
    }`;
    b.textContent = tabLabels[t];
  });

  const pre = document.getElementById("inspectorPre");
  if (inspectorTab === "ledger") {
    pre.textContent = JSON.stringify(
      {
        canary_status: canaryReport,
        recent_attempts: allAttempts.slice(0, 12)
      },
      null,
      2
    );
  } else if (inspectorTab === "rubric") {
    pre.textContent = JSON.stringify(
      {
        objective: u.objective,
        rubric_version: u.rubric_version,
        ...u.how_why_challenge.rubric
      },
      null,
      2
    );
  } else if (inspectorTab === "object") {
    pre.textContent = JSON.stringify(
      {
        type: u.object_spec.type,
        parts: u.object_spec.parts,
        connections: u.object_spec.connections,
        dials: u.object_spec.dials,
        rules: u.object_spec.rules,
        outputs: u.object_spec.outputs,
        state_transition_bridge: u.object_spec.state_transition_bridge,
        literal_take_audit: u.object_spec.literal_take_audit
      },
      null,
      2
    );
  } else {
    pre.textContent = JSON.stringify(u.object_spec.boundary_truth_table, null, 2);
  }
}

syncBackendLedger().then(() => loadUnit(0));
