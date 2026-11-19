import test from "node:test";
import assert from "node:assert/strict";

import { ALL_PACKS, getPack } from "../src/topics/index.js";
import { auditLessonFlow, LESSON_FLOW_STEPS } from "../src/engine/flow.js";

const stepOf = (report, id) => report.steps.find(s => s.id === id);

// A pack that satisfies every step: the heart pack plus a Loop check.
function completePack() {
  const pack = structuredClone(getPack("heart_pump_v1"));
  pack.loop.check = {
    question: "Which part keeps blood from flowing backwards?",
    options: [
      { label: "The valves", correct: true },
      { label: "The lungs", correct: false }
    ]
  };
  return pack;
}

test("Flow: the six steps are in the agreed order", () => {
  assert.deepEqual(LESSON_FLOW_STEPS.map(s => s.id), ["setup", "mysteries", "loop", "units", "recap", "next"]);
});

test("Flow: a pack with data for every step is complete", () => {
  const r = auditLessonFlow(completePack());
  assert.equal(r.complete, true, JSON.stringify(r.steps.filter(s => !s.ok)));
});

test("Flow: each missing piece is reported on the right step", () => {
  const cases = [
    ["setup", p => delete p.discovery_cards[0].reveal_deep],
    ["mysteries", p => delete p.discovery_cards[1].scenes[0].toy],
    ["mysteries", p => p.discovery_cards.pop()],
    ["loop", p => delete p.loop.check],
    ["loop", p => (p.loop.check.options[1].correct = true)],
    ["units", p => (p.units[0].what_if_proof.options = [])],
    ["recap", p => delete p.recap],
    ["next", p => (p.apply.steps = p.apply.steps.slice(0, 2))]
  ];
  for (const [stepId, breakIt] of cases) {
    const pack = completePack();
    breakIt(pack);
    const r = auditLessonFlow(pack);
    assert.equal(r.complete, false, `${stepId}: should be incomplete`);
    assert.equal(stepOf(r, stepId).ok, false, `${stepId}: should flag this step`);
    assert.ok(stepOf(r, stepId).missing.length > 0);
  }
});

test("Flow: every registered lesson has the data for all six steps", () => {
  for (const pack of ALL_PACKS) {
    const r = auditLessonFlow(pack);
    const gaps = r.steps.filter(s => !s.ok).map(s => `${s.label}: ${s.missing.join("; ")}`);
    assert.equal(r.complete, true, `${pack.topic_pack_id}\n${gaps.join("\n")}`);
  }
});

test("Flow: every current pack gets a report for all six steps", () => {
  for (const pack of ALL_PACKS) {
    const r = auditLessonFlow(pack);
    assert.equal(r.steps.length, 6, pack.topic_pack_id);
    for (const s of r.steps) assert.equal(s.ok, s.missing.length === 0);
  }
});
