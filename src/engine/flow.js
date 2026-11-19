/**
 * Understanding App — Unified Lesson Flow contract.
 * Every lesson plays the same 6 steps in the same order:
 *   0 Setup (Simple / Deep) → 1 Three Mysteries → 2 The Loop (+ one real-life check)
 *   → 3 Units on the 5-step spine → 4 Recap (backwards · scorecard · Day-1 Hook) → 5 What's next?
 *
 * auditLessonFlow(pack) checks that a pack carries the data each step needs, so any player can
 * render the full flow from data alone. It is separate from the 5-gate compiler (schema.js):
 * gaps are reported, and only fail the validator when run with --strict.
 * Pure and browser-compatible (no Node imports).
 */

export const LESSON_FLOW_STEPS = [
  { id: "setup", label: "0 · Setup" },
  { id: "mysteries", label: "1 · Three Mysteries" },
  { id: "loop", label: "2 · The Loop" },
  { id: "units", label: "3 · Units" },
  { id: "recap", label: "4 · Recap" },
  { id: "next", label: "5 · What's next?" }
];

const isText = v => typeof v === "string" && v.trim().length > 0;

/** Checks a list of answer options: at least 2, each labelled, exactly one correct. */
function checkOptions(options, where, missing) {
  if (!Array.isArray(options) || options.length < 2) {
    missing.push(`${where}: needs 2+ options`);
    return;
  }
  if (options.some(o => !isText(o?.label))) missing.push(`${where}: every option needs a label`);
  const correct = options.filter(o => o?.correct === true).length;
  if (correct !== 1) missing.push(`${where}: needs exactly one correct option (has ${correct})`);
}

function auditSetup(pack) {
  // Setup asks Simple or Deep, so every mystery must have both depths of explanation.
  const missing = [];
  for (const card of pack.discovery_cards || []) {
    if (!isText(card.reveal_simple)) missing.push(`${card.id}: reveal_simple`);
    if (!isText(card.reveal_deep)) missing.push(`${card.id}: reveal_deep`);
    const uth = card.under_the_hood;
    if (!uth || !isText(uth.tag) || !isText(uth.flow) || !isText(uth.note)) {
      missing.push(`${card.id}: under_the_hood { tag, flow, note } for Deep mode`);
    }
  }
  return missing;
}

function auditMysteries(pack) {
  const missing = [];
  const cards = pack.discovery_cards || [];
  if (cards.length !== 3) missing.push(`needs exactly 3 mysteries (has ${cards.length})`);
  for (const card of cards) {
    for (const key of ["mystery_label", "solved_label", "header_eyebrow", "header_prompt", "pattern_question", "earned_reveal"]) {
      if (!isText(card[key])) missing.push(`${card.id}: ${key}`);
    }
    checkOptions(card.options, `${card.id} pattern question`, missing);
    for (const scene of card.scenes || []) {
      const opts = scene.toy?.options;
      if (!Array.isArray(opts) || opts.length < 2) {
        missing.push(`${card.id}/${scene.id}: toy with 2+ options (the scene's tap-to-try data)`);
      } else if (opts.some(o => !isText(o?.label) || !isText(o?.result))) {
        missing.push(`${card.id}/${scene.id}: every toy option needs a label and a result`);
      }
      if (!isText(scene.toy?.visual)) {
        missing.push(`${card.id}/${scene.id}: toy.visual (the name of the scene's picture in the visual kit)`);
      }
    }
  }
  return missing;
}

function auditLoop(pack) {
  const missing = [];
  const loop = pack.loop;
  if (!loop) return ["loop { headline, steps, check }"];
  if (!isText(loop.headline)) missing.push("loop.headline");
  const steps = loop.steps || [];
  if (steps.length !== 3) missing.push(`loop.steps: needs 3, one per mystery (has ${steps.length})`);
  if (steps.some(s => !isText(s?.label) || !isText(s?.title) || !isText(s?.text))) {
    missing.push("loop.steps: every step needs label, title and text");
  }
  const check = loop.check;
  if (!check) {
    missing.push("loop.check { question, options } — the one real-life check before the units");
  } else {
    if (!isText(check.question)) missing.push("loop.check.question");
    checkOptions(check.options, "loop.check", missing);
  }
  return missing;
}

function auditUnits(pack) {
  const missing = [];
  const units = pack.units || [];
  if (units.length < 1) missing.push("needs at least 1 unit");
  for (const u of units) {
    const id = u.topic_id || `unit ${u.unit_num}`;
    for (const key of ["short_tab", "sub_tab", "title"]) {
      if (!isText(u[key])) missing.push(`${id}: ${key}`);
    }
    if (!isText(u.what_gate?.question)) missing.push(`${id}: what_gate.question`);
    checkOptions(u.what_gate?.options, `${id} what_gate`, missing);
    const hw = u.how_why_challenge || {};
    if (!isText(hw.part1_how_question) || !isText(hw.part2_why_question)) missing.push(`${id}: how_why_challenge part1/part2 questions`);
    checkOptions(hw.part1_choices, `${id} how choices`, missing);
    checkOptions(u.what_if_proof?.options, `${id} what_if_proof`, missing);
    if (!u.connect_bridge) missing.push(`${id}: connect_bridge`);
  }
  return missing;
}

function auditRecap(pack) {
  const missing = [];
  const recap = pack.recap;
  if (!recap) return ["recap { backwards_question, backwards_options, hook_placeholder }"];
  if (!isText(recap.backwards_question)) missing.push("recap.backwards_question");
  checkOptions(recap.backwards_options, "recap.backwards_options", missing);
  if (!isText(recap.hook_placeholder)) missing.push("recap.hook_placeholder");
  // recap.repair (a "fix the broken learner" exercise) is optional: not checked here.
  return missing;
}

function auditNext(pack) {
  const missing = [];
  const apply = pack.apply;
  if (!apply) return ["apply { placeholder, steps }"];
  if (!isText(apply.placeholder)) missing.push("apply.placeholder");
  const steps = apply.steps || [];
  if (steps.length < 3) missing.push(`apply.steps: needs 3+ (has ${steps.length})`);
  if (steps.some(s => !isText(s?.label) || !isText(s?.text))) missing.push("apply.steps: every step needs label and text");
  return missing;
}

const AUDITS = { setup: auditSetup, mysteries: auditMysteries, loop: auditLoop, units: auditUnits, recap: auditRecap, next: auditNext };

/**
 * Returns { topic_pack_id, complete, steps: [{ id, label, ok, missing: [string] }] }.
 */
export function auditLessonFlow(pack) {
  const steps = LESSON_FLOW_STEPS.map(step => {
    const missing = AUDITS[step.id](pack || {});
    return { ...step, ok: missing.length === 0, missing };
  });
  return { topic_pack_id: pack?.topic_pack_id, complete: steps.every(s => s.ok), steps };
}
