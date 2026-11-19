import test from "node:test";
import assert from "node:assert/strict";

import { THINKING_LEARNING_UNDERSTANDING_PACK } from "../src/topics/thinking_learning_understanding.js";
import {
  compileAndValidateTopicPack,
  validateUnitSpec,
  validateDiscoveryCards,
  evaluateRuntimeCanary
} from "../src/engine/schema.js";
import { evaluateSplitRubric } from "../src/engine/grader.js";
import { UnitRuntimeSession } from "../src/engine/runtime.js";
import { createLedgerEntry, EvidenceLedgerStore } from "../src/engine/ledger.js";
import { computeNextReview, SPACED_INTERVALS_MINUTES } from "../src/engine/scheduler.js";
import { handleAppRequest } from "../server.js";
import { Readable } from "node:stream";

test("Part A (Lesson Compiler): Flagship Topic Pack passes all 5 Guardrail Gates and Apple-Minimalist Discovery rules", () => {
  const report = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);
  assert.equal(report.valid, true, `Expected valid topic pack, got errors: ${report.errors.join("; ")}`);
  assert.equal(report.root_system_id, "stm_bridge_ltm_pipeline");
  assert.equal(report.unit_count, 5);
  assert.equal(report.discovery_card_count, 3);
});

test("Part A (Gate 1–4 Guardrails): Rejects metaphor hopping, phantom controls, and missing 4-corner truth table", () => {
  const baseUnit = structuredClone(THINKING_LEARNING_UNDERSTANDING_PACK.units[0]);

  // Break Gate 1 (Metaphor hopping to different root system)
  const brokenGate1 = structuredClone(baseUnit);
  brokenGate1.system_model_layer.root_system_id = "unrelated_gps_metaphor";
  const r1 = validateUnitSpec(brokenGate1, "stm_bridge_ltm_pipeline");
  assert.equal(r1.valid, false);
  assert.equal(r1.gates.gate1_single_evolving_system, false);

  // Break Gate 3 (Phantom control present)
  const brokenGate3 = structuredClone(baseUnit);
  brokenGate3.object_spec.literal_take_audit.phantom_controls_present = true;
  const r3 = validateUnitSpec(brokenGate3, "stm_bridge_ltm_pipeline");
  assert.equal(r3.valid, false);
  assert.equal(r3.gates.gate3_zero_phantom_controls, false);

  // Break Gate 4 (Missing max_max corner in boundary truth table)
  const brokenGate4 = structuredClone(baseUnit);
  delete brokenGate4.object_spec.boundary_truth_table.max_max;
  const r4 = validateUnitSpec(brokenGate4, "stm_bridge_ltm_pipeline");
  assert.equal(r4.valid, false);
  assert.equal(r4.gates.gate4_four_corner_truth_table, false);
});

test("Section 6.B (Discovery Guardrails): Enforces Mystery-first labels and <=15-word 8-second micro-toy copy", () => {
  const badCards = structuredClone(THINKING_LEARNING_UNDERSTANDING_PACK.discovery_cards);
  badCards[0].mystery_label = "1 · Thinking Spoiler";
  badCards[0].scenes[0].micro_copy =
    "This copy is intentionally way too verbose and exceeds the strict fifteen word maximum limit set for micro toys.";
  const report = validateDiscoveryCards(badCards);
  assert.equal(report.valid, false);
  assert.equal(report.errors.length, 2);
});

test("Part B.1 (Correction-Friendly Split-Rubric Grader): Praises Check A first, asks 1 clarifying follow-up on ambiguity, and isolates misconceptions", () => {
  const unit1 = THINKING_LEARNING_UNDERSTANDING_PACK.units[0];

  // Case 1: Ambiguous answer ("Because of the phone notifications.") -> Check A passes, asks 1 clarifying follow-up
  const ambiguous = evaluateSplitRubric({
    unit: unit1,
    howChoiceId: "overflows",
    whyText: "Because of the phone notifications.",
    followupAlreadyAsked: false
  });
  assert.equal(ambiguous.status, "needs_followup");
  assert.equal(ambiguous.check_a_prediction_pass, true);
  assert.equal(ambiguous.check_b_mechanism_pass, false);
  assert.ok(ambiguous.followup_asked.includes("4 available slots"));
  assert.ok(ambiguous.help_used.includes("clarifying_followup"));

  // Case 2: Known Misconception ("Phone notifications erase your Long-Term Memory vault") -> Immediate targeted replay
  const misconception = evaluateSplitRubric({
    unit: unit1,
    howChoiceId: "overflows",
    whyText: "Because phone notifications erase your Long-Term Memory vault.",
    followupAlreadyAsked: false
  });
  assert.equal(misconception.status, "graded");
  assert.equal(misconception.check_a_prediction_pass, true);
  assert.equal(misconception.check_b_mechanism_pass, false);
  assert.equal(misconception.misconception_tag, "pings_erase_ltm_directly");
  assert.ok(misconception.praise_first.includes("prediction (HOW) is completely right"));
  assert.ok(misconception.help_used.includes("targeted_visual_replay"));

  // Case 3: Mastery response -> Both Check A and Check B pass with 0 help
  const mastery = evaluateSplitRubric({
    unit: unit1,
    howChoiceId: "overflows",
    whyText: "Working memory only holds 4 slots, so pings steal slots before ideas encode to LTM.",
    followupAlreadyAsked: false
  });
  assert.equal(mastery.status, "graded");
  assert.equal(mastery.check_a_prediction_pass, true);
  assert.equal(mastery.check_b_mechanism_pass, true);
  assert.equal(mastery.help_used.length, 0);
});

test("Part B.2 (Runtime State Machine): Enforces Supported Practice vs. Independent Mastery and Pause/Resume serialization", () => {
  const unit1 = THINKING_LEARNING_UNDERSTANDING_PACK.units[0];
  const session = new UnitRuntimeSession(unit1, "learner-test-42");

  // Step 1: Pass WHAT Prerequisite Gate
  const whatRes = session.submitWhatGate(1);
  assert.equal(whatRes.passed, true);
  assert.equal(session.advanceToHowWhy().allowed, true);

  // Step 2 & 3: Submit ambiguous WHY -> triggers Supported Practice follow-up
  const howWhyRes = session.submitHowWhy({
    howChoiceId: "overflows",
    whyText: "Because of the phone.",
    confidenceTap: "unsure"
  });
  assert.equal(howWhyRes.status, "needs_followup");
  assert.equal(session.state.masteryState, "supported_practice");

  // Pause and restore mid-session without losing state
  const snapshot = session.pause();
  const restoredSession = new UnitRuntimeSession(unit1, "learner-test-42");
  restoredSession.restore(snapshot);
  assert.equal(restoredSession.state.paused, true);
  assert.equal(restoredSession.state.needsFollowup, true);
  restoredSession.resume();

  // Resolve follow-up and advance to Step 4 (What-If Proof)
  restoredSession.resolveFollowup("They steal the 4 working memory slots before encoding to LTM.");
  assert.equal(restoredSession.state.checkBPass, true);
  // Still supported_practice until unassisted What-If proof is passed!
  assert.equal(restoredSession.state.masteryState, "supported_practice");
  assert.equal(restoredSession.advanceToConnect().allowed, false);

  restoredSession.advanceToWhatIf();
  const whatIfRes = restoredSession.submitWhatIf(1); // Correct What-If option
  assert.equal(whatIfRes.passed, true);
  assert.equal(whatIfRes.mastery_state, "independent_mastery");
  assert.equal(restoredSession.advanceToConnect().allowed, true);
});

test("Part B.3 & B.4 (Versioned Evidence Ledger, Spaced Transfer Schedule & Gate 5 Canary)", () => {
  const now = new Date("2026-11-19T00:00:00.000Z");
  const entry = createLedgerEntry({
    learner_id: "learner-001",
    topic_id: "cog_unit1_stm_workbench",
    objective_id: "obj_1",
    lesson_version: "2.3.0",
    rubric_version: "2.3.0",
    confidence_tap: "sure",
    learner_response: "Test response",
    check_a_prediction_pass: true,
    check_b_mechanism_pass: true,
    help_used: [],
    mastery_state: "independent_mastery",
    review_stage: 2, // 1 day interval
    now
  });

  // Verify exact schema keys from Section 4.3
  const requiredKeys = [
    "attempt_id",
    "learner_id",
    "topic_id",
    "objective_id",
    "lesson_version",
    "rubric_version",
    "confidence_tap",
    "learner_response",
    "followup_asked",
    "check_a_prediction_pass",
    "check_b_mechanism_pass",
    "help_used",
    "mastery_state",
    "next_review_at"
  ];
  for (const key of requiredKeys) {
    assert.ok(key in entry, `Missing ledger schema key: ${key}`);
  }
  assert.equal(entry.next_review_at, "2026-11-20T00:00:00.000Z");

  // Verify Spaced Schedule resets to 10-min Backwards Review if Check B fails
  const resetSchedule = computeNextReview({
    masteryState: "supported_practice",
    currentStage: 4,
    checkBPass: false,
    now
  });
  assert.equal(resetSchedule.stage, 0);
  assert.equal(resetSchedule.minutes ?? SPACED_INTERVALS_MINUTES[0].minutes, 10);
  assert.equal(resetSchedule.next_review_at, "2026-11-19T00:10:00.000Z");

  // Verify Gate 5 Runtime Misconception Canary flags lesson_version when >15% pass Check A & fail Check B with same misconception
  const store = new EvidenceLedgerStore();
  for (let i = 0; i < 8; i++) {
    store.append({
      topic_id: "cog_unit1_stm_workbench",
      lesson_version: "2.3.0",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: true,
      mastery_state: "independent_mastery"
    });
  }
  // Add 2/10 (20% > 15%) attempts passing Check A but failing Check B with 'pings_erase_ltm_directly'
  for (let i = 0; i < 2; i++) {
    store.append({
      topic_id: "cog_unit1_stm_workbench",
      lesson_version: "2.3.0",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: false,
      misconception_tag: "pings_erase_ltm_directly",
      mastery_state: "supported_practice"
    });
  }
  const canary = evaluateRuntimeCanary(store.list(), 0.15);
  assert.equal(canary.canary_healthy, false);
  assert.equal(canary.alerts.length, 1);
  assert.equal(canary.alerts[0].misconception_tag, "pings_erase_ltm_directly");
  assert.equal(canary.alerts[0].rate, 0.2);
});

test("HTTP Server Routes: Serves Learner Surface (/), Developer Route (/dev), and Telemetry APIs", async () => {
  function invokeRoute(method, url, bodyObj = null) {
    return new Promise((resolve, reject) => {
      const payload = bodyObj ? JSON.stringify(bodyObj) : "";
      const req = Readable.from(payload ? [Buffer.from(payload)] : []);
      req.method = method;
      req.url = url;
      req.headers = { host: "localhost:3000" };

      const res = {
        statusCode: 200,
        headers: {},
        body: "",
        writeHead(code, hdrs = {}) {
          this.statusCode = code;
          this.headers = hdrs;
        },
        end(chunk) {
          if (chunk) {
            this.body += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
          }
          resolve(this);
        }
      };

      handleAppRequest(req, res).catch(reject);
    });
  }

  // 0. Start page (/) — minimal search box
  const startRes = await invokeRoute("GET", "/");
  assert.equal(startRes.statusCode, 200);
  assert.ok(startRes.body.includes('id="searchForm"'));

  // 1. Learner Discovery Surface (/learn)
  const homeRes = await invokeRoute("GET", "/learn");
  assert.equal(homeRes.statusCode, 200);
  assert.ok(homeRes.body.includes("Understanding App — Interactive Discovery"));
  assert.ok(!homeRes.body.includes("QA Tester: Simulate a Learner Answer"), "Learner surface must have zero dev clutter");

  // 2. Developer & Telemetry Route (/dev)
  const devRes = await invokeRoute("GET", "/dev");
  assert.equal(devRes.statusCode, 200);
  assert.ok(devRes.body.includes("Universal 4+1 Spine, 5-Gate Compiler & Telemetry Inspector"));

  // 3. Health & 5-Gate Compiler Validation API
  const valRes = await invokeRoute("GET", "/api/validate");
  assert.equal(valRes.statusCode, 200);
  const valJson = JSON.parse(valRes.body);
  assert.equal(valJson.valid, true);
  assert.equal(valJson.unit_count, 5);

  // 4. Ledger POST & GET API
  const postRes = await invokeRoute("POST", "/api/ledger", {
    topic_id: "cog_unit1_stm_workbench",
    objective_id: "test_obj",
    learner_response: "API test attempt",
    check_a_prediction_pass: true,
    check_b_mechanism_pass: true,
    mastery_state: "independent_mastery"
  });
  assert.equal(postRes.statusCode, 201);
  const postJson = JSON.parse(postRes.body);
  assert.equal(postJson.entry.topic_id, "cog_unit1_stm_workbench");
  assert.equal(postJson.canary.canary_healthy, true);
});

