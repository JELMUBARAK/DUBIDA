/**
 * Understanding App — Part B.2: Learner Runtime & Mastery State Machine
 * Drives the 5-step Universal Learning Spine (WHAT -> HOW -> WHY -> WHAT-IF -> CONNECT),
 * enforces strict Supported Practice vs. Independent Mastery separation, and supports Pause/Resume.
 */

import { evaluateSplitRubric } from "./grader.js";
import { createLedgerEntry } from "./ledger.js";

export const SPINE_STEPS = [
  { id: 0, code: "1. WHAT?", label: "Prerequisite Gate & Parts" },
  { id: 1, code: "2. HOW & 3. WHY?", label: "Run Visual, Predict & Explain" },
  { id: 2, code: "3b. FEEDBACK", label: "Split Grade & Targeted Replay" },
  { id: 3, code: "4. WHAT IF?", label: "Unassisted Edge-Case Proof" },
  { id: 4, code: "5. CONNECT", label: "Bridge, Limits & Next Unit" }
];

export class UnitRuntimeSession {
  constructor(unit, learnerId = "learner-default-001") {
    this.unit = unit;
    this.learnerId = learnerId;
    this.reset();
  }

  reset() {
    const d1 = this.unit.object_spec?.dials?.dial1?.default ?? 0;
    const d2 = this.unit.object_spec?.dials?.dial2?.default ?? 0;
    this.state = {
      topicId: this.unit.topic_id,
      stepIndex: 0,
      paused: false,
      whatGatePassed: false,
      whatGateFeedback: null,
      confidenceTap: "sure",
      dial1: d1,
      dial2: d2,
      howChoiceId: null,
      whyText: "",
      checkAPass: null,
      checkBPass: null,
      needsFollowup: false,
      followupQuestion: null,
      followupAnswered: false,
      targetedReplayText: null,
      praiseFirstText: null,
      misconceptionTag: null,
      helpUsed: [],
      whatIfAttempts: 0,
      whatIfPassedFirstTry: null,
      whatIfFeedback: null,
      masteryState: "supported_practice",
      passedTry1ZeroHelp: false,
      personalRule: ""
    };
  }

  setDials(d1, d2) {
    const spec1 = this.unit.object_spec?.dials?.dial1;
    const spec2 = this.unit.object_spec?.dials?.dial2;
    if (spec1 && typeof d1 === "number") {
      this.state.dial1 = Math.max(spec1.min, Math.min(spec1.max, d1));
    }
    if (spec2 && typeof d2 === "number") {
      this.state.dial2 = Math.max(spec2.min, Math.min(spec2.max, d2));
    }
  }

  submitWhatGate(optionIndex) {
    const options = this.unit.what_gate?.options || [];
    const chosen = options[optionIndex];
    if (!chosen) {
      throw new Error(`Invalid what_gate option index: ${optionIndex}`);
    }
    this.state.whatGatePassed = Boolean(chosen.correct);
    this.state.whatGateFeedback = chosen.feedback;
    if (!chosen.correct && !this.state.helpUsed.includes("prereq_gate_retry")) {
      this.state.helpUsed.push("prereq_gate_retry");
    }
    return {
      passed: this.state.whatGatePassed,
      feedback: this.state.whatGateFeedback,
      help_used: [...this.state.helpUsed]
    };
  }

  advanceToHowWhy() {
    if (!this.state.whatGatePassed) {
      return { allowed: false, reason: "Must pass Step 1 (WHAT) Prerequisite Gate first." };
    }
    this.state.stepIndex = 1;
    return { allowed: true, stepIndex: this.state.stepIndex };
  }

  submitHowWhy({ howChoiceId, whyText, confidenceTap = "sure" }) {
    this.state.howChoiceId = howChoiceId;
    this.state.whyText = whyText;
    this.state.confidenceTap = confidenceTap === "unsure" ? "unsure" : "sure";

    const result = evaluateSplitRubric({
      unit: this.unit,
      howChoiceId,
      whyText,
      followupAlreadyAsked: this.state.followupAnswered,
      priorHelpUsed: this.state.helpUsed
    });

    this.state.checkAPass = result.check_a_prediction_pass;
    this.state.checkBPass = result.check_b_mechanism_pass;
    this.state.helpUsed = result.help_used;
    this.state.praiseFirstText = result.praise_first;
    this.state.misconceptionTag = result.misconception_tag;

    if (result.status === "needs_followup") {
      this.state.needsFollowup = true;
      this.state.followupQuestion = result.followup_asked;
      this.state.masteryState = "supported_practice";
      return {
        status: "needs_followup",
        followup_question: result.followup_asked,
        praise_first: result.praise_first,
        mastery_state: this.state.masteryState
      };
    }

    this.state.needsFollowup = false;
    this.state.targetedReplayText = result.targeted_replay;
    this.state.masteryState = "supported_practice";

    // Lock dials to target experiment if targeted visual replay is triggered
    if ((!this.state.checkAPass || !this.state.checkBPass) && this.unit.object_spec?.target_experiment) {
      const te = this.unit.object_spec.target_experiment;
      this.setDials(te.dial1, te.dial2);
    }

    this.state.stepIndex = 2;

    const ledgerEntry = createLedgerEntry({
      learner_id: this.learnerId,
      topic_id: this.unit.topic_id,
      objective_id: this.unit.objective,
      lesson_version: this.unit.lesson_version,
      rubric_version: this.unit.rubric_version,
      confidence_tap: this.state.confidenceTap,
      learner_response: `HOW:${howChoiceId} | WHY:${whyText}`,
      followup_asked: result.followup_asked,
      check_a_prediction_pass: this.state.checkAPass,
      check_b_mechanism_pass: this.state.checkBPass,
      help_used: this.state.helpUsed,
      mastery_state: this.state.masteryState,
      misconception_tag: this.state.misconceptionTag
    });

    return {
      status: "graded",
      result,
      ledgerEntry
    };
  }

  resolveFollowup(clarifiedTextOrBool) {
    this.state.followupAnswered = true;
    this.state.needsFollowup = false;

    if (typeof clarifiedTextOrBool === "string") {
      this.state.whyText = `${this.state.whyText} — ${clarifiedTextOrBool}`;
      return this.submitHowWhy({
        howChoiceId: this.state.howChoiceId,
        whyText: this.state.whyText,
        confidenceTap: this.state.confidenceTap
      });
    }

    const passed = Boolean(clarifiedTextOrBool);
    this.state.checkBPass = passed;
    if (!passed && !this.state.helpUsed.includes("targeted_visual_replay")) {
      this.state.helpUsed.push("targeted_visual_replay");
    }
    this.state.masteryState = "supported_practice";
    this.state.stepIndex = 2;
    return {
      status: "graded",
      check_a_prediction_pass: this.state.checkAPass,
      check_b_mechanism_pass: this.state.checkBPass,
      help_used: [...this.state.helpUsed],
      mastery_state: this.state.masteryState
    };
  }

  advanceToWhatIf() {
    this.state.stepIndex = 3;
    if (this.unit.object_spec?.whatif_experiment) {
      const we = this.unit.object_spec.whatif_experiment;
      this.setDials(we.dial1, we.dial2);
    }
    return { stepIndex: this.state.stepIndex };
  }

  submitWhatIf(optionIndex) {
    const options = this.unit.what_if_proof?.options || [];
    const chosen = options[optionIndex];
    if (!chosen) {
      throw new Error(`Invalid what_if_proof option index: ${optionIndex}`);
    }

    this.state.whatIfAttempts += 1;
    this.state.whatIfFeedback = chosen.feedback;

    if (chosen.correct) {
      if (this.state.whatIfPassedFirstTry === null) {
        this.state.whatIfPassedFirstTry = true;
      }
      // Passing the unassisted What-If proof transitions the learner to Independent Mastery!
      this.state.masteryState = "independent_mastery";
      this.state.passedTry1ZeroHelp =
        this.state.helpUsed.length === 0 && this.state.whatIfAttempts === 1;
    } else {
      this.state.whatIfPassedFirstTry = false;
      this.state.masteryState = "supported_practice";
      if (!this.state.helpUsed.includes("what_if_retry")) {
        this.state.helpUsed.push("what_if_retry");
      }
    }

    const ledgerEntry = createLedgerEntry({
      learner_id: this.learnerId,
      topic_id: this.unit.topic_id,
      objective_id: `${this.unit.topic_id}_what_if_proof`,
      lesson_version: this.unit.lesson_version,
      rubric_version: this.unit.rubric_version,
      confidence_tap: this.state.confidenceTap,
      learner_response: `WHAT_IF_OPTION_${optionIndex}: ${chosen.label}`,
      followup_asked: null,
      check_a_prediction_pass: Boolean(chosen.correct),
      check_b_mechanism_pass: Boolean(chosen.correct),
      help_used: this.state.helpUsed,
      mastery_state: this.state.masteryState
    });

    return {
      passed: Boolean(chosen.correct),
      feedback: this.state.whatIfFeedback,
      mastery_state: this.state.masteryState,
      passed_try1_zero_help: this.state.passedTry1ZeroHelp,
      ledgerEntry
    };
  }

  advanceToConnect() {
    if (this.state.masteryState !== "independent_mastery") {
      return {
        allowed: false,
        reason: "Must unlock Independent Mastery on Step 4 (What-If Proof) before Step 5 (Connect)."
      };
    }
    this.state.stepIndex = 4;
    return { allowed: true, stepIndex: this.state.stepIndex };
  }

  pause() {
    this.state.paused = true;
    return this.serialize();
  }

  resume() {
    this.state.paused = false;
    return this.state;
  }

  serialize() {
    return JSON.stringify(this.state);
  }

  restore(serializedJson) {
    const parsed = typeof serializedJson === "string" ? JSON.parse(serializedJson) : serializedJson;
    this.state = { ...this.state, ...parsed };
    return this.state;
  }
}
