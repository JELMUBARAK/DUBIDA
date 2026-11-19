/**
 * Understanding App — Part B.3: Versioned Evidence Ledger
 * Writes immutable, versioned records matching the exact schema in core_engine_mvp_spec.md (Section 4.3).
 */

import { computeNextReview } from "./scheduler.js";
import { evaluateRuntimeCanary } from "./schema.js";

function generateUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createLedgerEntry({
  attempt_id = generateUuid(),
  learner_id = "learner-default-001",
  topic_id,
  objective_id,
  lesson_version = "2.0.0",
  rubric_version = "2.0.0",
  confidence_tap = "sure",
  learner_response = "",
  followup_asked = null,
  check_a_prediction_pass = true,
  check_b_mechanism_pass = false,
  help_used = [],
  mastery_state = "supported_practice",
  misconception_tag = null,
  review_stage = 0,
  now = new Date()
}) {
  const schedule = computeNextReview({
    masteryState: mastery_state,
    currentStage: review_stage,
    checkBPass: check_b_mechanism_pass,
    now
  });

  const record = {
    attempt_id,
    learner_id,
    topic_id: String(topic_id || "unknown_topic"),
    objective_id: String(objective_id || topic_id || "unknown_objective"),
    lesson_version: String(lesson_version),
    rubric_version: String(rubric_version),
    confidence_tap: confidence_tap === "unsure" ? "unsure" : "sure",
    learner_response: String(learner_response),
    followup_asked: followup_asked ? String(followup_asked) : null,
    check_a_prediction_pass: Boolean(check_a_prediction_pass),
    check_b_mechanism_pass: Boolean(check_b_mechanism_pass),
    help_used: Array.isArray(help_used) ? [...help_used] : [],
    mastery_state:
      mastery_state === "independent_mastery" ? "independent_mastery" : "supported_practice",
    next_review_at: schedule.next_review_at,
    misconception_tag: misconception_tag || null,
    created_at: (now instanceof Date ? now : new Date(now)).toISOString()
  };

  return Object.freeze(record);
}

export class EvidenceLedgerStore {
  constructor(initialEntries = []) {
    this._entries = initialEntries.map(e => Object.freeze({ ...e }));
  }

  append(rawEntry) {
    const entry = createLedgerEntry(rawEntry);
    this._entries.unshift(entry);
    return entry;
  }

  list(limit = 100) {
    return this._entries.slice(0, limit);
  }

  clear() {
    this._entries = [];
  }

  getCanaryReport(threshold = 0.15) {
    return evaluateRuntimeCanary(this._entries, threshold);
  }
}
