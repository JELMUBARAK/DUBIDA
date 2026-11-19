/**
 * Understanding App — Apple-Minimalist Learner Discovery Surface (/)
 * Implements the Dual-Experience Inductive Discovery flow ("Experience First, Name Last")
 * validated in discovery_minimal_prototype.html + 3-Part Unified Mastery Recap & Pause/Resume persistence.
 * Strictly zero developer clutter on the learner screen (all telemetry posts silently to /api/ledger).
 */

const STORAGE_KEY = "understanding_app_learner_state_v2";

let currentCard = -1; // -1 = 2-Tap Setup, 0 = Mystery A (Thinking), 1 = Mystery B (Learning), 2 = Mystery C (Understanding), 3 = The Loop & Unified Recap

const defaultState = {
  // Step -1: 2-Tap Setup (PIC)
  purpose: "life", // 'life' | 'work' | 'curious'
  level: "simple", // 'simple' | 'deep'

  // Card 0: Thinking (Kitchen Thought-Cloud + Live Car Map)
  c0_kitchenPair: null, // 'bad' | 'good'
  c0_routePick: null,   // 'jam' | 'clear'
  c0_carProgress: 0,    // 0..1 animated car position along path
  c0_answered: false,
  c0_wrongMsg: null,
  c0_tries: 0,

  // Card 1: Learning (Basketball Physics + Espresso Machine)
  c1_hoopTries: 0,      // 0, 1 (short bounce), 2 (high backboard bounce), 3 (swish!)
  c1_ballT: 1,          // 0..1 animation progress of current shot
  c1_ballAnimating: false,
  c1_coffeeTries: 0,    // 0, 1 (bitter drip), 2 (sour gush), 3 (golden crema!)
  c1_cupFill: 0,        // 0..1 animated espresso fill
  c1_answered: false,
  c1_wrongMsg: null,
  c1_tries: 0,

  // Card 2: Understanding (Oven Cake Rise + Visual Budget Tanks)
  c2_bakeSwap: null,    // 'salt' | 'banana'
  c2_cakeHeight: 16,    // animated height in oven
  c2_budgetCut: 0,      // 0 | 200
  c2_answered: false,
  c2_wrongMsg: null,
  c2_tries: 0,

  // Card 3: The Loop + 3-Part Unified Mastery Recap
  c3_fixedStage: null,
  c3_showRecap: false,
  recap_backwardsChain: null, // 'wrong' | 'correct'
  recap_samFixed: false,
  recap_personalRule: "",
  recap_ruleSaved: false,

  // After the Day-1 Hook: "What's next?" (apply it now, or start a new search)
  next_choice: null, // null | 'apply'
  apply_topic: "",
  apply_done: []
};

// Practical plan built from the five ideas the learner just discovered.
const APPLY_STEPS = [
  { id: "think", label: "Thinking", text: "Before you start, spend 2 minutes picturing how it could go, and what could go wrong." },
  { id: "focus", label: "4-Slot Focus", text: "Phone in another room. Work on no more than 4 new ideas at a time." },
  { id: "why", label: "Understanding", text: "For each new fact, ask \"why?\" and link it to something you already know." },
  { id: "recall", label: "Learning", text: "Close the book and explain it from memory. Check what you missed, fix it, try again." },
  { id: "space", label: "Spacing", text: "Recall it again tomorrow, in 3 days and in a week, without rereading first." }
];

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const state = loadPersistedState();

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    if (typeof parsed._currentCard === "number") {
      currentCard = parsed._currentCard;
    }
    return { ...defaultState, ...parsed, c1_ballAnimating: false, c1_ballT: 1 };
  } catch {
    return { ...defaultState };
  }
}

function savePersistedState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, _currentCard: currentCard })
    );
  } catch {
    // Ignore storage quota errors in restricted webviews
  }
}

async function emitTelemetry(payload) {
  try {
    await fetch("/api/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    // Silent fallback when running offline / file://
  }
}

window.state = state;

window.resetCurrent = () => {
  if (currentCard === -1) {
    state.purpose = "life";
    state.level = "simple";
  } else if (currentCard === 0) {
    state.c0_kitchenPair = null;
    state.c0_routePick = null;
    state.c0_carProgress = 0;
    state.c0_answered = false;
    state.c0_wrongMsg = null;
    state.c0_tries = 0;
  } else if (currentCard === 1) {
    state.c1_hoopTries = 0;
    state.c1_ballT = 1;
    state.c1_ballAnimating = false;
    state.c1_coffeeTries = 0;
    state.c1_cupFill = 0;
    state.c1_answered = false;
    state.c1_wrongMsg = null;
    state.c1_tries = 0;
  } else if (currentCard === 2) {
    state.c2_bakeSwap = null;
    state.c2_cakeHeight = 16;
    state.c2_budgetCut = 0;
    state.c2_answered = false;
    state.c2_wrongMsg = null;
    state.c2_tries = 0;
  } else {
    state.c3_fixedStage = null;
    state.c3_showRecap = false;
    state.recap_backwardsChain = null;
    state.recap_samFixed = false;
    state.recap_personalRule = "";
    state.recap_ruleSaved = false;
    state.next_choice = null;
    state.apply_topic = "";
    state.apply_done = [];
  }
  savePersistedState();
  render();
};

window.chooseNext = choice => {
  if (choice === "search") {
    window.location.href = "/";
    return;
  }
  state.next_choice = choice;
  savePersistedState();
  render();
};

window.updateApplyTopic = val => {
  state.apply_topic = val;
  savePersistedState();
};

window.toggleApplyStep = id => {
  state.apply_done = state.apply_done.includes(id)
    ? state.apply_done.filter(x => x !== id)
    : [...state.apply_done, id];
  savePersistedState();
  render();
};

window.goCard = idx => {
  currentCard = idx;
  savePersistedState();
  render();
};

window.setPurpose = p => {
  state.purpose = p;
  savePersistedState();
  render();
};

window.setLevel = l => {
  state.level = l;
  savePersistedState();
  render();
};

window.setKitchenPair = pair => {
  state.c0_kitchenPair = pair;
  savePersistedState();
  render();
};

window.answerCard0 = isCorrect => {
  state.c0_tries += 1;
  if (isCorrect) {
    state.c0_answered = true;
    state.c0_wrongMsg = null;
    emitTelemetry({
      topic_id: "cog_unit1_stm_workbench",
      objective_id: "discovery_card_0_thinking",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "sure",
      learner_response: "Simulated 'what-if' options in my head before acting",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: true,
      help_used: state.c0_tries > 1 ? ["pattern_retry"] : [],
      mastery_state: state.c0_tries === 1 ? "independent_mastery" : "supported_practice"
    });
  } else {
    state.c0_wrongMsg =
      "You hadn't practiced a physical skill yet — you were simulating options before acting.";
    emitTelemetry({
      topic_id: "cog_unit1_stm_workbench",
      objective_id: "discovery_card_0_thinking",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "unsure",
      learner_response: "Practiced a physical habit over and over",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: false,
      misconception_tag: "confused_simulation_with_habit_repetition",
      help_used: ["pattern_retry"],
      mastery_state: "supported_practice"
    });
  }
  savePersistedState();
  render();
};

window.answerCard1 = isCorrect => {
  state.c1_tries += 1;
  if (isCorrect) {
    state.c1_answered = true;
    state.c1_wrongMsg = null;
    emitTelemetry({
      topic_id: "cog_unit3_retrieval_bridge",
      objective_id: "discovery_card_1_learning",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "sure",
      learner_response: "Action -> seeing feedback on the error -> adjusting and wiring it into memory",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: true,
      help_used: state.c1_tries > 1 ? ["pattern_retry"] : [],
      mastery_state: state.c1_tries === 1 ? "independent_mastery" : "supported_practice"
    });
  } else {
    state.c1_wrongMsg =
      "Imagining alone couldn't tell you how hard the rim or the coffee grind would push back!";
    emitTelemetry({
      topic_id: "cog_unit3_retrieval_bridge",
      objective_id: "discovery_card_1_learning",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "unsure",
      learner_response: "Just imagining it once without ever taking a shot or checking feedback",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: false,
      misconception_tag: "thinking_alone_without_feedback_calibration",
      help_used: ["pattern_retry"],
      mastery_state: "supported_practice"
    });
  }
  savePersistedState();
  render();
};

window.setBudgetCut = val => {
  state.c2_budgetCut = val;
  savePersistedState();
  render();
};

window.answerCard2 = isCorrect => {
  state.c2_tries += 1;
  if (isCorrect) {
    state.c2_answered = true;
    state.c2_wrongMsg = null;
    emitTelemetry({
      topic_id: "cog_unit2_bricks_to_arch",
      objective_id: "discovery_card_2_understanding",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "sure",
      learner_response: "Knowing HOW and WHY the parts work together so I could adapt",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: true,
      help_used: state.c2_tries > 1 ? ["pattern_retry"] : [],
      mastery_state: state.c2_tries === 1 ? "independent_mastery" : "supported_practice"
    });
  } else {
    state.c2_wrongMsg =
      "Repeating the old recipe or old budget failed as soon as the eggs ran out or the tire blew.";
    emitTelemetry({
      topic_id: "cog_unit2_bricks_to_arch",
      objective_id: "discovery_card_2_understanding",
      lesson_version: "2.0.0",
      rubric_version: "2.0.0",
      confidence_tap: "unsure",
      learner_response: "Repeating the exact memorized rules without changing anything",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: false,
      misconception_tag: "rote_rule_repetition_under_boundary_shift",
      help_used: ["pattern_retry"],
      mastery_state: "supported_practice"
    });
  }
  savePersistedState();
  render();
};

window.answerMayaTransfer = stagePick => {
  state.c3_fixedStage = stagePick;
  const correct = stagePick === "understanding";
  emitTelemetry({
    topic_id: "cog_unit5_unified_recap",
    objective_id: "unassisted_what_if_maya_rent",
    lesson_version: "2.0.0",
    rubric_version: "2.0.0",
    confidence_tap: "sure",
    learner_response: `Maya missing stage: ${stagePick}`,
    check_a_prediction_pass: correct,
    check_b_mechanism_pass: correct,
    misconception_tag: correct ? null : `blamed_${stagePick}_instead_of_schema_adaptation`,
    help_used: correct ? [] : ["what_if_retry"],
    mastery_state: correct ? "independent_mastery" : "supported_practice"
  });
  savePersistedState();
  render();
};

window.toggleUnifiedRecap = () => {
  state.c3_showRecap = !state.c3_showRecap;
  savePersistedState();
  render();
};

window.answerRecapBackwards = pick => {
  state.recap_backwardsChain = pick;
  savePersistedState();
  render();
};

window.toggleRecapSamFix = () => {
  state.recap_samFixed = !state.recap_samFixed;
  savePersistedState();
  render();
};

window.updatePersonalRule = val => {
  state.recap_personalRule = val;
  state.recap_ruleSaved = false;
  savePersistedState();
};

window.savePersonalRule = () => {
  if (!state.recap_personalRule.trim()) return;
  state.recap_ruleSaved = true;
  emitTelemetry({
    topic_id: "cog_unit5_unified_recap",
    objective_id: "personal_1_line_rule_day1_hook",
    lesson_version: "2.0.0",
    rubric_version: "2.0.0",
    confidence_tap: "sure",
    learner_response: state.recap_personalRule.trim(),
    check_a_prediction_pass: true,
    check_b_mechanism_pass: true,
    help_used: [],
    mastery_state: "independent_mastery"
  });
  savePersistedState();
  render();
};

// ============================================================================
// REAL PHYSICS & VISUAL ANIMATION TRIGGERS
// ============================================================================
window.triggerRouteSim = pick => {
  state.c0_routePick = pick;
  state.c0_carProgress = 0;
  savePersistedState();
  render();
  const start = performance.now();
  function stepCar(now) {
    const t = Math.min(1, (now - start) / 650);
    state.c0_carProgress = t;
    updateCarDOM();
    if (t < 1) requestAnimationFrame(stepCar);
  }
  requestAnimationFrame(stepCar);
};

function updateCarDOM() {
  const car = document.getElementById("simCarDot");
  const status = document.getElementById("simCarLabel");
  if (!car) return;
  const t = state.c0_carProgress;
  if (state.c0_routePick === "jam") {
    const stopT = Math.min(t, 0.58);
    const x = 28 + stopT * 155;
    const y = 45 - Math.sin(stopT * Math.PI) * 18;
    car.setAttribute("cx", x);
    car.setAttribute("cy", y);
    if (status) status.textContent = t > 0.55 ? "🔴 Stopped at Bridge (+45m)" : "💭 Previewing Highway...";
  } else if (state.c0_routePick === "clear") {
    const x = 28 + t * 164;
    const y = 45 + Math.sin(t * Math.PI) * 26;
    car.setAttribute("cx", x);
    car.setAttribute("cy", y);
    if (status) status.textContent = t > 0.9 ? "🟢 Clear Path (18m)" : "💭 Previewing Side Street...";
  }
}

window.shootBasketball = () => {
  if (state.c1_hoopTries >= 3 || state.c1_ballAnimating) return;
  state.c1_hoopTries++;
  state.c1_ballT = 0;
  state.c1_ballAnimating = true;
  savePersistedState();
  render();

  const start = performance.now();
  const duration = 920;

  function stepBall(now) {
    const t = Math.min(1, (now - start) / duration);
    state.c1_ballT = t;
    updateBasketballDOM(t, state.c1_hoopTries);
    if (t < 1) {
      requestAnimationFrame(stepBall);
    } else {
      state.c1_ballAnimating = false;
      savePersistedState();
      render();
    }
  }
  requestAnimationFrame(stepBall);
};

function getBallCoords(t, tryNum) {
  if (tryNum === 1) {
    if (t <= 0.65) {
      const u = t / 0.65;
      const x = 34 + u * 122;
      const y = 72 - Math.sin(u * Math.PI * 0.85) * 44;
      return { x, y, hit: u > 0.92 };
    } else {
      const u = (t - 0.65) / 0.35;
      const x = 156 - u * 38;
      const y = 46 - Math.sin(u * Math.PI) * 12 + u * u * 48;
      return { x, y, hit: true };
    }
  } else if (tryNum === 2) {
    if (t <= 0.62) {
      const u = t / 0.62;
      const x = 34 + u * 153;
      const y = 72 - Math.sin(u * Math.PI * 0.78) * 64;
      return { x, y, hit: u > 0.92 };
    } else {
      const u = (t - 0.62) / 0.38;
      const x = 187 - u * 45;
      const y = 26 + u * u * 68;
      return { x, y, hit: true };
    }
  } else {
    if (t <= 0.72) {
      const u = t / 0.72;
      const x = 34 + u * 138;
      const y = 72 - Math.sin(u * Math.PI * 0.82) * 56 - u * 24;
      return { x, y, swish: u > 0.9 };
    } else {
      const u = (t - 0.72) / 0.28;
      const x = 172;
      const y = 44 + u * 44;
      return { x, y, swish: true };
    }
  }
}

function updateBasketballDOM(t, tryNum) {
  const ball = document.getElementById("hoopBall");
  const net = document.getElementById("hoopNet");
  const clank = document.getElementById("hoopImpactRing");
  if (!ball) return;
  const pos = getBallCoords(t, tryNum);
  ball.setAttribute("cx", pos.x);
  ball.setAttribute("cy", pos.y);
  if (clank) {
    if (pos.hit && t > 0.58 && t < 0.78) {
      clank.setAttribute("opacity", "1");
      clank.setAttribute("cx", tryNum === 1 ? 158 : 186);
      clank.setAttribute("cy", tryNum === 1 ? 45 : 26);
    } else {
      clank.setAttribute("opacity", "0");
    }
  }
  if (net && pos.swish) {
    net.setAttribute("d", "M 162 44 Q 160 56 164 64 L 180 64 Q 184 56 182 44");
    net.setAttribute("stroke", "#10b981");
  }
}

window.pullEspressoShot = () => {
  if (state.c1_coffeeTries >= 3) return;
  state.c1_coffeeTries++;
  state.c1_cupFill = 0;
  savePersistedState();
  render();
  const start = performance.now();
  function stepBrew(now) {
    const t = Math.min(1, (now - start) / 600);
    state.c1_cupFill = t;
    const rect = document.getElementById("espressoLiquid");
    if (rect) {
      const maxH = state.c1_coffeeTries === 1 ? 12 : state.c1_coffeeTries === 2 ? 28 : 22;
      const h = t * maxH;
      rect.setAttribute("y", 92 - h);
      rect.setAttribute("height", h);
    }
    if (t < 1) requestAnimationFrame(stepBrew);
    else {
      savePersistedState();
      render();
    }
  }
  requestAnimationFrame(stepBrew);
};

window.bakeCakeWith = item => {
  state.c2_bakeSwap = item;
  state.c2_cakeHeight = 14;
  savePersistedState();
  render();
  const targetH = item === "banana" ? 36 : 8;
  const start = performance.now();
  function stepBake(now) {
    const t = Math.min(1, (now - start) / 600);
    state.c2_cakeHeight = 14 + (targetH - 14) * t;
    const dome = document.getElementById("ovenCakeDome");
    if (dome) {
      const h = state.c2_cakeHeight;
      dome.setAttribute("y", 82 - h);
      dome.setAttribute("height", h);
      dome.setAttribute("rx", item === "banana" ? 14 : 2);
    }
    if (t < 1) requestAnimationFrame(stepBake);
    else {
      savePersistedState();
      render();
    }
  }
  requestAnimationFrame(stepBake);
};

window.toggleDepthMode = () => {
  state.level = state.level === "simple" ? "deep" : "simple";
  savePersistedState();
  render();
};

function renderWhatsNext() {
  const choiceBtn = (choice, icon, title, sub, active) => `
    <button onclick="chooseNext('${choice}')" class="flex-1 text-left p-3 rounded-xl border ${active ? "border-[var(--primary)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] transition-all">
      <div class="text-sm font-semibold text-[var(--foreground)]">${icon} ${title}</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-0.5">${sub}</div>
    </button>`;

  const plan =
    state.next_choice !== "apply"
      ? ""
      : `
      <div class="space-y-2.5 fade-in">
        <input
          type="text"
          value="${escapeHtml(state.apply_topic)}"
          oninput="updateApplyTopic(this.value)"
          onchange="render()"
          placeholder="What are you about to learn or work on? (e.g. Spanish verbs, a work report)"
          class="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)]"
        />
        <div class="text-xs font-semibold text-[var(--foreground)]">
          Your plan${state.apply_topic.trim() ? ` for <span class="text-[var(--primary)]">${escapeHtml(state.apply_topic.trim())}</span>` : ""}:
        </div>
        ${APPLY_STEPS.map(
          (s, i) => `
          <label class="flex items-start gap-2.5 p-2.5 rounded-xl border ${state.apply_done.includes(s.id) ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--background)] cursor-pointer">
            <input type="checkbox" ${state.apply_done.includes(s.id) ? "checked" : ""} onchange="toggleApplyStep('${s.id}')" class="mt-0.5 accent-[var(--success)]" />
            <span class="text-xs text-[var(--foreground)]"><b>${i + 1}. ${s.label}:</b> ${s.text}</span>
          </label>`
        ).join("")}
        ${
          state.apply_done.length === APPLY_STEPS.length
            ? `<div class="text-xs text-[var(--success)] font-semibold">🎉 You used the whole loop on something real. That's understanding in action.</div>`
            : `<div class="text-xs text-[var(--muted-foreground)]">${state.apply_done.length} of ${APPLY_STEPS.length} done</div>`
        }
        <button onclick="chooseNext('search')" class="w-full py-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-xs font-semibold">
          🔍 Done? Start a new search
        </button>
      </div>`;

  return `
    <div class="rounded-xl border border-[var(--primary)] bg-[var(--card)] p-3.5 space-y-2.5 fade-in">
      <div class="text-sm font-bold text-[var(--foreground)]">What's next?</div>
      <div class="flex flex-col sm:flex-row gap-2">
        ${choiceBtn("apply", "🛠️", "Use it now", "Put what you just learned to work on something real", state.next_choice === "apply")}
        ${choiceBtn("search", "🔍", "Start a new search", "Learn a new topic", false)}
      </div>
      ${plan}
    </div>`;
}

window.render = () => render();

function renderUnderTheHoodStrip(cardIdx) {
  if (state.level !== "deep") return "";
  const blueprints = [
    {
      tag: "🔬 UNDER THE HOOD · WORKING MEMORY SANDBOX",
      flow: "Sensory Input ──► Working Memory (~4 Slots) ──► Divergent Branching (Options) ──► Convergent Filter (Best Path)",
      note: "Why it matters: Your prefrontal cortex runs internal 'what-if' simulations so errors happen in neural software instead of physical reality."
    },
    {
      tag: "🔬 UNDER THE HOOD · ERROR-DRIVEN SYNAPTIC CALIBRATION",
      flow: "Motor/Action Attempt ──► Prediction Error Signal (Rim / Gauge Gap) ──► Working Memory Adjustment ──► Long-Term Memory",
      note: "Court = Procedural LTM (cerebellum/basal ganglia motor arc) · Espresso = Semantic LTM (declarative rule). Both require feedback to wire in."
    },
    {
      tag: "🔬 UNDER THE HOOD · CAUSAL SCHEMA & STRUCTURAL TRANSFER",
      flow: "Surface Twist (0 Eggs / -$200 Bill) ──► Retrieve Deep LTM Schema ('WHY it works') ──► Re-map Invariant Rule to New Context",
      note: "Rote memory stores surface labels ('use eggs'); a causal schema stores functional relationships ('need a binder'), enabling transfer."
    },
    {
      tag: "🔬 UNDER THE HOOD · THE COMPLETE COGNITIVE ARCHITECTURE",
      flow: "1. Working Memory Simulation (Thinking) ──► 2. Feedback Encoding to LTM (Learning) ──► 3. Schema Transfer Across Contexts (Understanding)",
      note: "Each new Understanding compresses 4 loose facts into 1 compact LTM Chunk — freeing Working Memory slots for higher-level Thinking."
    }
  ];
  const b = blueprints[cardIdx];
  return `
    <div class="rounded-xl border border-[var(--primary)] bg-[var(--card)] p-3 space-y-1 fade-in">
      <div class="text-xs font-mono font-bold text-[var(--primary)]">${b.tag}</div>
      <div class="text-xs font-mono text-[var(--foreground)] bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-2.5 py-1.5">${b.flow}</div>
      <div class="text-xs text-[var(--muted-foreground)]">${b.note}</div>
    </div>
  `;
}

// ============================================================================
// NAVIGATION BAR
// ============================================================================
function renderNav() {
  const pills = [
    { idx: -1, lbl: "Setup" },
    { idx: 0, lbl: state.c0_answered ? "1 · Thinking ✓" : "1 · Mystery A" },
    { idx: 1, lbl: state.c1_answered ? "2 · Learning ✓" : "2 · Mystery B" },
    { idx: 2, lbl: state.c2_answered ? "3 · Understanding ✓" : "3 · Mystery C" },
    { idx: 3, lbl: "4 · The Loop" }
  ];
  const nav = document.getElementById("navPills");
  nav.innerHTML = pills
    .map(p => {
      const active = p.idx === currentCard;
      return `
        <button onclick="goCard(${p.idx})" class="px-3 py-1 rounded-full text-xs font-medium transition-all ${
          active
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--card-border)] hover:text-[var(--foreground)]"
        }">
          ${p.lbl}
        </button>
      `;
    })
    .join("");

  const dBtn = document.getElementById("depthToggleBtn");
  if (dBtn) {
    dBtn.textContent = state.level === "deep" ? "🔬 Under the Hood: ON" : "🌱 Simple & Visual";
    dBtn.className = `px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
      state.level === "deep"
        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
        : "border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
    }`;
  }
}

// ============================================================================
// MAIN STAGE RENDERER
// ============================================================================
function render() {
  renderNav();
  const stage = document.getElementById("stage");

  // ==========================================================================
  // SCREEN -1: 2-TAP PURPOSE & LEVEL SETUP (Apple Minimalist Opener)
  // ==========================================================================
  if (currentCard === -1) {
    stage.innerHTML = `
      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-5 fade-in">
        <div class="text-center space-y-1">
          <p class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Two Quick Taps</p>
          <h2 class="text-xl font-bold text-[var(--foreground)]">Thinking, Learning & Understanding</h2>
          <p class="text-xs text-[var(--muted-foreground)]">Customize how we shape your examples.</p>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-medium text-[var(--muted-foreground)]">1. Why explore this?</div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            ${[
              { id: "life", icon: "💡", label: "Everyday Life" },
              { id: "work", icon: "💼", label: "Better Decisions" },
              { id: "curious", icon: "🧠", label: "Pure Curiosity" }
            ]
              .map(
                p => `
              <button onclick="setPurpose('${p.id}')" class="p-3 rounded-xl border text-center font-medium transition-all ${
                  state.purpose === p.id
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)]"
                }">
                <div class="text-base mb-0.5">${p.icon}</div>
                <div>${p.label}</div>
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-medium text-[var(--muted-foreground)]">2. Pick your depth</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            ${[
              { id: "simple", label: "🌱 Simple & Visual", sub: "Everyday intuition, zero jargon" },
              { id: "deep", label: "🔬 Under the Hood", sub: "Adds live STM ↔ LTM cognitive blueprint layer" }
            ]
              .map(
                l => `
              <button onclick="setLevel('${l.id}')" class="p-3 rounded-xl border text-left transition-all ${
                  state.level === l.id
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)]"
                }">
                <div class="font-semibold">${l.label}</div>
                <div class="opacity-75 mt-0.5">${l.sub}</div>
              </button>
            `
              )
              .join("")}
          </div>
          ${
            state.level === "deep"
              ? `
            <div class="rounded-xl border border-[var(--primary)] bg-[var(--background)] p-3 text-xs space-y-1 fade-in">
              <div class="font-mono font-bold text-[var(--primary)]">🔬 UNDER THE HOOD LAYER ENABLED</div>
              <div class="text-[var(--muted-foreground)]">Every card will now display a live <b>Cognitive Blueprint Bar</b> mapping the everyday physics (Kitchen, Basketball, Espresso, Cake) to <b>Working Memory, Divergent/Convergent Reasoning, and Procedural/Semantic/Causal LTM</b>.</div>
            </div>
          `
              : ""
          }
        </div>

        <div class="pt-1 flex justify-center">
          <button onclick="goCard(0)" class="px-6 py-2.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity">
            Start Interactive Discovery →
          </button>
        </div>
      </div>
    `;
    return;
  }

  // ==========================================================================
  // CARD 0: MYSTERY A -> "THAT'S THINKING"
  // ==========================================================================
  if (currentCard === 0) {
    const bothPlayed = state.c0_kitchenPair === "good" && state.c0_routePick === "clear";

    stage.innerHTML = `
      <div class="text-center space-y-0.5">
        <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Mystery 1 of 3 · Play Both Scenes</p>
        <h2 class="text-base sm:text-lg font-semibold text-[var(--foreground)]">Two unrelated scenes. Spot the hidden move.</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <!-- Scene A: Visual Thought-Bubble Above Unlit Stove -->
        <div class="rounded-2xl border ${state.c0_kitchenPair === "good" ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">🍳 Kitchen</span>
            <span>Stove: OFF (Imagining)</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <rect x="25" y="8" width="170" height="50" rx="22" fill="none" stroke="currentColor" stroke-dasharray="4 3" stroke-width="1.5" opacity="0.65" />
              <circle cx="75" cy="65" r="3.5" fill="currentColor" opacity="0.4" />
              <circle cx="68" cy="73" r="2" fill="currentColor" opacity="0.3" />

              ${
                state.c0_kitchenPair === null
                  ? `
                <text x="110" y="37" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">💭 Tap a pair below to imagine</text>
              `
                  : state.c0_kitchenPair === "bad"
                  ? `
                <text x="110" y="31" text-anchor="middle" font-size="15">🥚 + 🍫 = 🤢</text>
                <text x="110" y="48" text-anchor="middle" font-size="9.5" fill="#f59e0b" font-weight="bold">Yuck in thought-cloud (0 eggs wasted!)</text>
              `
                  : `
                <text x="110" y="31" text-anchor="middle" font-size="15">🥚 + 🍚 = 🍲✨</text>
                <text x="110" y="48" text-anchor="middle" font-size="9.5" fill="#10b981" font-weight="bold">Works in thought-cloud! Ready to cook.</text>
              `
              }

              <line x1="45" y1="92" x2="145" y2="92" stroke="#64748b" stroke-width="5" stroke-linecap="round" />
              <path d="M 55 82 L 135 82 L 128 92 L 62 92 Z" fill="#475569" />
              <line x1="135" y1="84" x2="168" y2="79" stroke="#475569" stroke-width="4" stroke-linecap="round" />
              <text x="95" y="103" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor" opacity="0.55">REAL STOVE (STILL OFF)</text>
            </svg>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button onclick="setKitchenPair('bad')" class="py-2 px-2 rounded-xl border ${state.c0_kitchenPair === "bad" ? "border-[var(--warning)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🥚 Eggs + 🍫 Choc
            </button>
            <button onclick="setKitchenPair('good')" class="py-2 px-2 rounded-xl border ${state.c0_kitchenPair === "good" ? "border-[var(--success)] font-semibold" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🥚 Eggs + 🍚 Rice
            </button>
          </div>
        </div>

        <!-- Scene B: Animated Commute Route Map -->
        <div class="rounded-2xl border ${state.c0_routePick === "clear" ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">🚗 Route Map</span>
            <span id="simCarLabel">${state.c0_routePick === "clear" ? "🟢 Clear (18m)" : state.c0_routePick === "jam" ? "🔴 Blocked (+45m)" : "Car: PARKED"}</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <path d="M 28 45 Q 110 8 192 45" fill="none" stroke="${state.c0_routePick === "jam" ? "#f59e0b" : "#64748b"}" stroke-width="3" stroke-dasharray="4 3" opacity="0.7" />
              <rect x="114" y="18" width="14" height="14" rx="3" fill="#ef4444" />
              <text x="121" y="28" text-anchor="middle" font-size="9" fill="#ffffff" font-weight="bold">✖</text>

              <path d="M 28 45 Q 110 88 192 45" fill="none" stroke="${state.c0_routePick === "clear" ? "#10b981" : "#64748b"}" stroke-width="3" stroke-dasharray="4 3" opacity="0.7" />

              <circle cx="28" cy="45" r="6" fill="#3b82f6" />
              <text x="28" y="63" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor">HOME</text>
              <circle cx="192" cy="45" r="6" fill="#10b981" />
              <text x="192" y="63" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor">WORK</text>

              <circle id="simCarDot" cx="${state.c0_routePick === "clear" ? 192 : state.c0_routePick === "jam" ? 114 : 28}" cy="${state.c0_routePick === "jam" ? 27 : 45}" r="6.5" fill="${state.c0_routePick === "clear" ? "#10b981" : state.c0_routePick === "jam" ? "#ef4444" : "#38bdf8"}" stroke="#ffffff" stroke-width="1.5" />
              <text x="110" y="99" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor" opacity="0.55">REAL CAR (STILL IN DRIVEWAY)</text>
            </svg>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button onclick="triggerRouteSim('jam')" class="py-2 px-2 rounded-xl border ${state.c0_routePick === "jam" ? "border-[var(--warning)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🛣️ Preview Highway
            </button>
            <button onclick="triggerRouteSim('clear')" class="py-2 px-2 rounded-xl border ${state.c0_routePick === "clear" ? "border-[var(--success)] font-semibold" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🌲 Preview Side Rd
            </button>
          </div>
        </div>

      </div>

      ${renderUnderTheHoodStrip(0)}

      ${
        !bothPlayed
          ? `
        <div class="text-center text-xs text-[var(--muted-foreground)]">
          Test both options in each scene above to unlock the connection.
        </div>
      `
          : !state.c0_answered
          ? `
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5 fade-in">
          <div class="text-sm font-semibold text-[var(--foreground)]">
            In one scene the stove was off; in the other the car was parked. What same move did you make in both?
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button onclick="answerCard0(false)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Practiced a physical habit over and over
            </button>
            <button onclick="answerCard0(true)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Simulated "what-if" options in my head before acting
            </button>
          </div>
          ${state.c0_wrongMsg ? `<div class="text-xs text-[var(--warning)]">${state.c0_wrongMsg}</div>` : ""}
        </div>
      `
          : `
        <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 fade-in">
          <div class="space-y-0.5">
            <div class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Mystery 1 Solved</div>
            <h3 class="text-lg font-bold text-[var(--foreground)]">That's Thinking.</h3>
            <p class="text-xs text-[var(--muted-foreground)]">
              ${
                state.level === "deep"
                  ? "Running mental simulations in Working Memory — expanding options (divergent) and comparing outcomes (convergent) before spending real-world energy."
                  : "Testing possibilities in your head so bad ideas fail in your imagination instead of in real life."
              }
            </p>
          </div>
          <button onclick="goCard(1)" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold shrink-0">
            Mystery 2 →
          </button>
        </div>
      `
      }
    `;
    return;
  }

  // ==========================================================================
  // CARD 1: MYSTERY B -> "THAT'S LEARNING" (REAL BALL PHYSICS + ESPRESSO POUR)
  // ==========================================================================
  if (currentCard === 1) {
    const bothDone = state.c1_hoopTries >= 3 && state.c1_coffeeTries >= 3 && !state.c1_ballAnimating;
    const pos = state.c1_hoopTries === 0 ? { x: 34, y: 72 } : getBallCoords(state.c1_ballT, state.c1_hoopTries);

    const hoopBadges = [
      "Ready at the line",
      "Try 1: Short! Clanged front rim → +20% arc",
      "Try 2: Long! Bounced off backboard → -10% power",
      "Try 3: Swish! Trajectory wired into muscle memory."
    ];
    const coffeeBadges = [
      "Ready to pull shot",
      "Try 1: 13 Bar (Choked/Bitter) → Coarsen grind",
      "Try 2: 4 Bar (Gushed/Sour) → Dial to middle",
      "Try 3: 9 Bar Golden Crema! Setting remembered."
    ];

    stage.innerHTML = `
      <div class="text-center space-y-0.5">
        <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Mystery 2 of 3 · Watch & Calibrate</p>
        <h2 class="text-base sm:text-lg font-semibold text-[var(--foreground)]">Why couldn't "Thinking" alone nail these on Try 1?</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <!-- Scene A: Real Basketball Free-Throw Physics SVG -->
        <div class="rounded-2xl border ${state.c1_hoopTries >= 3 ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">🏀 Free Throw</span>
            <span>Try ${state.c1_hoopTries} of 3</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <line x1="10" y1="98" x2="210" y2="98" stroke="#64748b" stroke-width="2" />

              ${state.c1_hoopTries >= 1 ? `<path d="M 34 72 Q 98 10 156 46 L 118 94" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5" />` : ""}
              ${state.c1_hoopTries >= 2 ? `<path d="M 34 72 Q 112 -14 187 26 L 142 94" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5" />` : ""}
              ${state.c1_hoopTries >= 3 ? `<path d="M 34 72 Q 110 -8 172 44 L 172 88" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3 2" />` : ""}

              <circle cx="26" cy="60" r="5" fill="#64748b" />
              <line x1="26" y1="65" x2="26" y2="84" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
              <line x1="26" y1="84" x2="20" y2="98" stroke="#64748b" stroke-width="2.5" />
              <line x1="26" y1="84" x2="32" y2="98" stroke="#64748b" stroke-width="2.5" />
              <line x1="26" y1="72" x2="34" y2="66" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" />

              <line x1="196" y1="35" x2="196" y2="98" stroke="#64748b" stroke-width="3" />
              <line x1="188" y1="16" x2="188" y2="50" stroke="currentColor" stroke-width="3.5" />
              <line x1="160" y1="44" x2="187" y2="44" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
              <path id="hoopNet" d="${state.c1_hoopTries === 3 && !state.c1_ballAnimating ? "M 162 44 Q 160 56 164 64 L 180 64 Q 184 56 182 44" : "M 162 44 L 166 60 L 178 60 L 182 44"}" fill="none" stroke="${state.c1_hoopTries === 3 ? "#10b981" : "#94a3b8"}" stroke-width="1.5" stroke-dasharray="2 2" />

              <circle id="hoopImpactRing" cx="158" cy="45" r="9" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0" />
              <circle id="hoopBall" cx="${pos.x}" cy="${pos.y}" r="6.5" fill="#f97316" stroke="#ffffff" stroke-width="1" />
            </svg>
            <div class="text-center text-xs ${state.c1_hoopTries === 3 ? "text-[var(--success)] font-semibold" : "text-[var(--muted-foreground)]"} truncate">
              ${hoopBadges[state.c1_hoopTries]}
            </div>
          </div>

          <button onclick="shootBasketball()" ${state.c1_hoopTries >= 3 || state.c1_ballAnimating ? "disabled" : ""} class="w-full py-2 px-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] disabled:opacity-50 text-xs font-medium transition-all">
            ${state.c1_hoopTries === 0 ? "🏀 Shoot Ball (Try 1)" : state.c1_hoopTries === 1 ? "🎯 Adjust Higher & Shoot (Try 2)" : state.c1_hoopTries === 2 ? "🎯 Soften Arc & Shoot (Try 3)" : "✓ Swish Locked In"}
          </button>
        </div>

        <!-- Scene B: Animated Espresso Pressure & Pour SVG -->
        <div class="rounded-2xl border ${state.c1_coffeeTries >= 3 ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">☕ Espresso Pull</span>
            <span>Try ${state.c1_coffeeTries} of 3</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <circle cx="54" cy="52" r="26" fill="none" stroke="#64748b" stroke-width="2.5" />
              <path d="M 42 30 A 24 24 0 0 1 66 30" fill="none" stroke="#10b981" stroke-width="4" />
              ${(() => {
                const angle =
                  state.c1_coffeeTries === 0
                    ? -65
                    : state.c1_coffeeTries === 1
                    ? 60
                    : state.c1_coffeeTries === 2
                    ? -40
                    : 0;
                const rad = (angle - 90) * (Math.PI / 180);
                const nx = 54 + Math.cos(rad) * 20;
                const ny = 52 + Math.sin(rad) * 20;
                return `<line x1="54" y1="52" x2="${nx}" y2="${ny}" stroke="${state.c1_coffeeTries === 3 ? "#10b981" : "#f59e0b"}" stroke-width="2.5" stroke-linecap="round" />`;
              })()}
              <circle cx="54" cy="52" r="3" fill="currentColor" />
              <text x="54" y="88" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor">PRESSURE</text>

              <rect x="132" y="14" width="44" height="14" rx="3" fill="#475569" />
              <rect x="148" y="28" width="12" height="8" fill="#64748b" />

              ${
                state.c1_coffeeTries > 0
                  ? `
                <line x1="154" y1="36" x2="154" y2="88" stroke="${state.c1_coffeeTries === 1 ? "#1e293b" : state.c1_coffeeTries === 2 ? "#fcd34d" : "#d97706"}" stroke-width="${state.c1_coffeeTries === 1 ? 2 : state.c1_coffeeTries === 2 ? 7 : 4}" class="stream-flow" />
              `
                  : ""
              }

              <path d="M 134 58 L 138 92 L 170 92 L 174 58 Z" fill="none" stroke="currentColor" stroke-width="2" />
              ${(() => {
                const h =
                  state.c1_coffeeTries === 0
                    ? 0
                    : state.c1_coffeeTries === 1
                    ? 10
                    : state.c1_coffeeTries === 2
                    ? 28
                    : 22;
                const col =
                  state.c1_coffeeTries === 1
                    ? "#0f172a"
                    : state.c1_coffeeTries === 2
                    ? "#fef08a"
                    : "#b45309";
                return `<rect id="espressoLiquid" x="138" y="${91 - h}" width="32" height="${h}" fill="${col}" rx="2" />`;
              })()}
              ${state.c1_coffeeTries === 3 ? `<rect x="137" y="66" width="34" height="5" fill="#f59e0b" rx="2" />` : ""}
            </svg>
            <div class="text-center text-xs ${state.c1_coffeeTries === 3 ? "text-[var(--success)] font-semibold" : "text-[var(--muted-foreground)]"} truncate">
              ${coffeeBadges[state.c1_coffeeTries]}
            </div>
          </div>

          <button onclick="pullEspressoShot()" ${state.c1_coffeeTries >= 3 ? "disabled" : ""} class="w-full py-2 px-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] disabled:opacity-50 text-xs font-medium transition-all">
            ${state.c1_coffeeTries === 0 ? "☕ Pull Shot (Try 1)" : state.c1_coffeeTries === 1 ? "⚙️ Coarsen Grind & Pull (Try 2)" : state.c1_coffeeTries === 2 ? "⚙️ Dial to Middle & Pull (Try 3)" : "✓ Golden Crema Saved"}
          </button>
        </div>

      </div>

      ${renderUnderTheHoodStrip(1)}

      ${
        !bothDone
          ? `
        <div class="text-center text-xs text-[var(--muted-foreground)]">
          Watch how each miss guides your next adjustment in both cards above.
        </div>
      `
          : !state.c1_answered
          ? `
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5 fade-in">
          <div class="text-sm font-semibold text-[var(--foreground)]">
            You watched the ball bounce off the rim and watched the gauge miss the green zone. What turned Try 1 into skill on Try 3?
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button onclick="answerCard1(true)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Action → seeing feedback on the error → adjusting and wiring it into memory
            </button>
            <button onclick="answerCard1(false)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Just imagining it once without ever taking a shot or checking feedback
            </button>
          </div>
          ${state.c1_wrongMsg ? `<div class="text-xs text-[var(--warning)]">${state.c1_wrongMsg}</div>` : ""}
        </div>
      `
          : `
        <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 fade-in">
          <div class="space-y-0.5">
            <div class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Mystery 2 Solved</div>
            <h3 class="text-lg font-bold text-[var(--foreground)]">That's Learning.</h3>
            <p class="text-xs text-[var(--muted-foreground)]">
              ${
                state.level === "deep"
                  ? "Closing the feedback loop between Working Memory and Long-Term Memory (both Procedural motor skill on the court and Declarative settings on the machine)."
                  : "Trying for real, seeing exactly how you missed, and adjusting until the right move sticks for tomorrow."
              }
            </p>
          </div>
          <button onclick="goCard(2)" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold shrink-0">
            Mystery 3 →
          </button>
        </div>
      `
      }
    `;
    return;
  }

  // ==========================================================================
  // CARD 2: MYSTERY C -> "THAT'S UNDERSTANDING" (OVEN CAKE RISE + BUDGET TANKS)
  // ==========================================================================
  if (currentCard === 2) {
    const bothAdapted = state.c2_bakeSwap === "banana" && state.c2_budgetCut === 200;
    const h = state.c2_bakeSwap === null ? 14 : state.c2_bakeSwap === "banana" ? 36 : 8;

    stage.innerHTML = `
      <div class="text-center space-y-0.5">
        <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Mystery 3 of 3 · When the Rule Breaks</p>
        <h2 class="text-base sm:text-lg font-semibold text-[var(--foreground)]">The memorized recipe breaks. Adapt the system.</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <!-- Scene A: Live Oven Window (Cake Rising vs. Collapsing Physics) -->
        <div class="rounded-2xl border ${state.c2_bakeSwap === "banana" ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">🧁 Oven Window</span>
            <span>0 Eggs · Need a Binder</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <rect x="35" y="10" width="150" height="86" rx="8" fill="none" stroke="#64748b" stroke-width="2.5" />
              <line x1="50" y1="88" x2="170" y2="88" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              <path d="M 62 72 L 158 72 L 152 84 L 68 84 Z" fill="#475569" />

              <rect id="ovenCakeDome" x="68" y="${82 - h}" width="84" height="${h}" rx="${state.c2_bakeSwap === "banana" ? 14 : 3}" fill="${state.c2_bakeSwap === "banana" ? "#f59e0b" : state.c2_bakeSwap === "salt" ? "#94a3b8" : "#fcd34d"}" />

              <text x="110" y="26" text-anchor="middle" font-size="9.5" font-family="monospace" fill="currentColor" font-weight="bold">
                ${
                  state.c2_bakeSwap === null
                    ? "WHY EGGS? They trap & bind bubbles"
                    : state.c2_bakeSwap === "salt"
                    ? "❌ SALT: Bubbles escape → Collapsed flat!"
                    : "✨ BANANA: Binds bubbles → Rises tall!"
                }
              </text>
            </svg>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button onclick="bakeCakeWith('salt')" class="py-2 px-2 rounded-xl border ${state.c2_bakeSwap === "salt" ? "border-[var(--warning)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🧂 Swap in Salt
            </button>
            <button onclick="bakeCakeWith('banana')" class="py-2 px-2 rounded-xl border ${state.c2_bakeSwap === "banana" ? "border-[var(--success)] font-semibold" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              🍌 Swap in Banana
            </button>
          </div>
        </div>

        <!-- Scene B: Visual Connected Budget Tanks -->
        <div class="rounded-2xl border ${state.c2_budgetCut === 200 ? "border-[var(--success)]" : "border-[var(--card-border)]"} bg-[var(--card)] p-3.5 flex flex-col justify-between space-y-2.5">
          <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span class="font-medium text-[var(--foreground)]">💰 Connected Budget</span>
            <span>Surprise -$200 Tire Bill</span>
          </div>

          <div class="rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-2">
            <svg viewBox="0 0 220 105" class="w-full h-28">
              <line x1="60" y1="84" x2="160" y2="84" stroke="#64748b" stroke-width="3" />

              <rect x="24" y="24" width="44" height="58" rx="5" fill="none" stroke="#ef4444" stroke-width="1.5" />
              <rect x="26" y="42" width="40" height="38" rx="3" fill="#ef4444" opacity="0.8" />
              <text x="46" y="18" text-anchor="middle" font-size="8.5" font-family="monospace" fill="#ef4444" font-weight="bold">REPAIR</text>
              <text x="46" y="64" text-anchor="middle" font-size="9.5" font-family="monospace" fill="#ffffff" font-weight="bold">-$200</text>

              <rect x="88" y="24" width="44" height="58" rx="5" fill="none" stroke="currentColor" stroke-width="1.5" />
              ${(() => {
                const dh = state.c2_budgetCut === 200 ? 12 : 46;
                return `<rect x="90" y="${80 - dh}" width="40" height="${dh}" rx="3" fill="#3b82f6" opacity="0.8" />`;
              })()}
              <text x="110" y="18" text-anchor="middle" font-size="8.5" font-family="monospace" fill="currentColor" font-weight="bold">DINING</text>
              <text x="110" y="64" text-anchor="middle" font-size="9.5" font-family="monospace" fill="currentColor" font-weight="bold">$${250 - state.c2_budgetCut}</text>

              <rect x="152" y="24" width="44" height="58" rx="5" fill="none" stroke="${state.c2_budgetCut === 200 ? "#10b981" : "#f59e0b"}" stroke-width="2" />
              ${(() => {
                const sh = state.c2_budgetCut === 200 ? 54 : 18;
                const col = state.c2_budgetCut === 200 ? "#10b981" : "#f59e0b";
                return `<rect x="154" y="${80 - sh}" width="40" height="${sh}" rx="3" fill="${col}" opacity="0.85" />`;
              })()}
              <text x="174" y="18" text-anchor="middle" font-size="8.5" font-family="monospace" fill="${state.c2_budgetCut === 200 ? "#10b981" : "#f59e0b"}" font-weight="bold">SAVINGS</text>
              <text x="174" y="64" text-anchor="middle" font-size="9.5" font-family="monospace" fill="currentColor" font-weight="bold">$${100 + state.c2_budgetCut}</text>
            </svg>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button onclick="setBudgetCut(0)" class="py-2 px-2 rounded-xl border ${state.c2_budgetCut === 0 ? "border-[var(--warning)]" : "border-[var(--card-border)]"} bg-[var(--background)] font-medium transition-all">
              Drain Savings ($100)
            </button>
            <button onclick="setBudgetCut(200)" class="py-2 px-2 rounded-xl border ${state.c2_budgetCut === 200 ? "border-[var(--success)] font-semibold" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium transition-all">
              Shift Dining → Save $300
            </button>
          </div>
        </div>

      </div>

      ${renderUnderTheHoodStrip(2)}

      ${
        !bothAdapted
          ? `
        <div class="text-center text-xs text-[var(--muted-foreground)]">
          Make the cake rise and refill the Savings tank above to unlock the third concept.
        </div>
      `
          : !state.c2_answered
          ? `
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5 fade-in">
          <div class="text-sm font-semibold text-[var(--foreground)]">
            In both scenes, the memorized plan broke. What let you solve a brand-new problem?
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button onclick="answerCard2(false)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Repeating the exact memorized rules without changing anything
            </button>
            <button onclick="answerCard2(true)" class="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)] text-left font-medium">
              Knowing HOW and WHY the parts work together so I could adapt
            </button>
          </div>
          ${state.c2_wrongMsg ? `<div class="text-xs text-[var(--warning)]">${state.c2_wrongMsg}</div>` : ""}
        </div>
      `
          : `
        <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 fade-in">
          <div class="space-y-0.5">
            <div class="text-xs font-mono uppercase tracking-widest text-[var(--primary)]">Mystery 3 Solved</div>
            <h3 class="text-lg font-bold text-[var(--foreground)]">That's Understanding.</h3>
            <p class="text-xs text-[var(--muted-foreground)]">
              ${
                state.level === "deep"
                  ? "Owning a connected causal schema in Long-Term Memory — so when one variable shifts, you can predict and transfer across new contexts."
                  : "Knowing WHY the pieces work together, so you can improvise and solve problems you've never seen before."
              }
            </p>
          </div>
          <button onclick="goCard(3)" class="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold shrink-0">
            The Complete Loop →
          </button>
        </div>
      `
      }
    `;
    return;
  }

  // ==========================================================================
  // CARD 3: THE COMPLETE LOOP + 3-PART UNIFIED MASTERY RECAP
  // ==========================================================================
  if (currentCard === 3) {
    const try1C0 = state.c0_answered && state.c0_tries <= 1;
    const try1C1 = state.c1_answered && state.c1_tries <= 1;
    const try1C2 = state.c2_answered && state.c2_tries <= 1;

    stage.innerHTML = `
      <div class="text-center space-y-0.5">
        <p class="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">All 3 Connected</p>
        <h2 class="text-base sm:text-lg font-semibold text-[var(--foreground)]">One Loop: Simulate → Calibrate → Adapt</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 space-y-1">
          <div class="text-xs font-mono text-[var(--primary)]">1 · THINKING</div>
          <div class="text-sm font-semibold text-[var(--foreground)]">💭 Simulate Options</div>
          <p class="text-xs text-[var(--muted-foreground)]">Preview "what-if" in your head before acting (Kitchen & Map).</p>
        </div>
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 space-y-1">
          <div class="text-xs font-mono text-[var(--primary)]">2 · LEARNING</div>
          <div class="text-sm font-semibold text-[var(--foreground)]">🎯 Calibrate via Feedback</div>
          <p class="text-xs text-[var(--muted-foreground)]">Try, watch the miss, adjust, and wire it into memory (Hoop & Espresso).</p>
        </div>
        <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 space-y-1">
          <div class="text-xs font-mono text-[var(--primary)]">3 · UNDERSTANDING</div>
          <div class="text-sm font-semibold text-[var(--foreground)]">🔄 Adapt the System</div>
          <p class="text-xs text-[var(--muted-foreground)]">Know WHY the parts connect so you can handle new twists (Oven & Budget).</p>
        </div>
      </div>

      ${renderUnderTheHoodStrip(3)}

      <div class="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2.5">
        <div class="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">1-Tap Final Check (Unassisted What-If Proof)</div>
        <div class="text-sm font-medium text-[var(--foreground)]">
          Maya memorized every budgeting term and passed the quiz, but when her rent rose by $150 she couldn't figure out how to rebalance her budget. Which stage was missing?
        </div>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button onclick="answerMayaTransfer('thinking')" class="py-2 px-3 rounded-xl border ${state.c3_fixedStage === "thinking" ? "border-[var(--warning)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium">
            Thinking
          </button>
          <button onclick="answerMayaTransfer('learning')" class="py-2 px-3 rounded-xl border ${state.c3_fixedStage === "learning" ? "border-[var(--warning)]" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium">
            Learning Terms
          </button>
          <button onclick="answerMayaTransfer('understanding')" class="py-2 px-3 rounded-xl border ${state.c3_fixedStage === "understanding" ? "border-[var(--success)] font-semibold" : "border-[var(--card-border)] hover:border-[var(--foreground)]"} bg-[var(--background)] font-medium">
            Understanding
          </button>
        </div>
        ${
          state.c3_fixedStage === "understanding"
            ? `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 fade-in">
            <div class="text-xs text-[var(--success)] font-semibold">
              ✓ Spot on. She learned the facts, but hadn't connected how the parts drive each other to adapt when conditions changed.
            </div>
            <button onclick="toggleUnifiedRecap()" class="px-3.5 py-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold shrink-0">
              ${state.c3_showRecap ? "Hide Mastery Recap" : "🏆 Open 2-Min Mastery Recap →"}
            </button>
          </div>
        `
            : state.c3_fixedStage
            ? `
          <div class="text-xs text-[var(--warning)] pt-1">
            She already memorized the definitions — what broke was adapting the connected system to a new twist.
          </div>
        `
            : ""
        }
      </div>

      ${
        state.c3_showRecap
          ? `
        <!-- Section 4.5: 3-Part Unified Mastery Recap -->
        <div class="rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-4 space-y-4 fade-in">
          <div class="flex items-center justify-between border-b border-[var(--card-border)] pb-2.5">
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-bold">End-of-Path Consolidation</div>
              <h3 class="text-sm sm:text-base font-bold text-[var(--foreground)]">3-Part Unified Mastery Recap</h3>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-[var(--secondary)] text-xs font-mono font-semibold text-[var(--foreground)]">1 Master Schema Chunk</span>
          </div>

          <!-- Part 1: Backwards Chain Recall -->
          <div class="space-y-2">
            <div class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 1 · Backwards Chain Recall (Walk the Path Backwards)</div>
            <div class="text-xs sm:text-sm font-medium text-[var(--foreground)]">
              Reconstruct the causal chain in reverse from <span class="font-semibold">3 · Understanding</span> back to <span class="font-semibold">1 · Thinking</span>:
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button onclick="answerRecapBackwards('correct')" class="p-3 rounded-xl border text-left font-medium transition-all ${state.recap_backwardsChain === "correct" ? "border-[var(--success)] bg-[var(--background)] font-semibold" : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)]"}">
                🔄 Adapting to new twists (Understanding) ◄── requires feedback-calibrated skill in LTM (Learning) ◄── which starts with mental "what-if" simulation (Thinking).
              </button>
              <button onclick="answerRecapBackwards('wrong')" class="p-3 rounded-xl border text-left font-medium transition-all ${state.recap_backwardsChain === "wrong" ? "border-[var(--warning)] bg-[var(--background)]" : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--foreground)]"}">
                🔄 Each concept is an isolated study tip that works without the earlier steps.
              </button>
            </div>
            ${
              state.recap_backwardsChain === "correct"
                ? `<div class="text-xs text-[var(--success)] font-semibold">✓ Backwards causal chain verified (Unit 3 ◄── Unit 2 ◄── Unit 1).</div>`
                : state.recap_backwardsChain === "wrong"
                ? `<div class="text-xs text-[var(--warning)]">Remember: you can't adapt a system you never calibrated or simulated!</div>`
                : ""
            }
          </div>

          <!-- Part 2: Full-System Diagnostic Sandbox -->
          <div class="space-y-2 border-t border-[var(--card-border)] pt-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 2 · Full-System Diagnostic Sandbox</span>
              <span class="text-xs font-mono font-bold ${state.recap_samFixed ? "text-[var(--success)]" : "text-[var(--warning)]"}">
                Day-30 Transfer: ${state.recap_samFixed ? "94% (Mastered)" : "18% (Broken)"}
              </span>
            </div>
            <div class="text-xs text-[var(--muted-foreground)]">
              Sam rereads notes passively with his phone buzzing and crams at midnight. Rebalance all system dials simultaneously so Day-30 Transfer exceeds 85%:
            </div>
            <button onclick="toggleRecapSamFix()" class="w-full py-2 px-3 rounded-xl border ${state.recap_samFixed ? "border-[var(--success)] text-[var(--success)] font-semibold" : "border-[var(--primary)] text-[var(--primary)] font-semibold"} bg-[var(--background)] text-xs transition-all">
              ${
                state.recap_samFixed
                  ? "✓ System Repaired: 4-Slot Focus + 'Why' Schema + Spaced Closed-Book Recall (94% Transfer)"
                  : "⚡ 1-Tap Repair: Remove Reread/Cram Traps & Activate 'Why' + Spaced Recall"
              }
            </button>
          </div>

          <!-- Part 3: 4-Question Mastery Scorecard & 1-Line Personal Rule -->
          <div class="space-y-2.5 border-t border-[var(--card-border)] pt-3">
            <div class="text-xs font-mono uppercase text-[var(--muted-foreground)]">Part 3 · 4-Question Mastery Scorecard & Day-1 Hook</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div class="rounded-lg border border-[var(--success)] bg-[var(--background)] p-2 text-center">
                <div class="text-[var(--muted-foreground)]">WHAT</div>
                <div class="font-bold text-[var(--success)]">✓ Verified</div>
              </div>
              <div class="rounded-lg border border-[var(--success)] bg-[var(--background)] p-2 text-center">
                <div class="text-[var(--muted-foreground)]">HOW</div>
                <div class="font-bold text-[var(--success)]">${try1C0 && try1C1 ? "★ Try 1" : "✓ Mastered"}</div>
              </div>
              <div class="rounded-lg border border-[var(--success)] bg-[var(--background)] p-2 text-center">
                <div class="text-[var(--muted-foreground)]">WHY</div>
                <div class="font-bold text-[var(--success)]">${try1C2 ? "★ Try 1" : "✓ Mastered"}</div>
              </div>
              <div class="rounded-lg border border-[var(--success)] bg-[var(--background)] p-2 text-center">
                <div class="text-[var(--muted-foreground)]">WHAT-IF</div>
                <div class="font-bold text-[var(--success)]">${state.c3_fixedStage === "understanding" ? "★ Unassisted" : "Pending"}</div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value="${state.recap_personalRule.replace(/"/g, "&quot;")}"
                oninput="updatePersonalRule(this.value)"
                placeholder="Write your 1-sentence takeaway for tomorrow's spaced review..."
                class="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)]"
              />
              <button onclick="savePersonalRule()" class="px-4 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold shrink-0">
                Save Day-1 Hook
              </button>
            </div>
            ${
              state.recap_ruleSaved
                ? `<div class="text-xs text-[var(--success)] font-mono">✓ Scheduled: 10 min (Backwards Review) → 1 hr → Day 1 → Day 3 → Day 7</div>`
                : ""
            }
            ${state.recap_ruleSaved ? renderWhatsNext() : ""}
          </div>
        </div>
      `
          : ""
      }
    `;
  }
}

render();
