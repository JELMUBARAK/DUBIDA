/**
 * Understanding App — Part A: The Lesson Compiler & 5-Gate Simulation Accuracy Guardrails
 * Enforces Rules 1, 2, and 3 from core_engine_mvp_spec.md before any Topic Pack can be published.
 */

export const REQUIRED_LIVING_OBJECT_KEYS = [
  "parts",
  "connections",
  "dials",
  "rules",
  "outputs",
  "analogy_limits"
];

export const REQUIRED_BRIDGE_KEYS = [
  "source_state",
  "bridge_condition",
  "target_state",
  "return_feedback_loop"
];

export const REQUIRED_TRUTH_TABLE_CORNERS = [
  "min_min",
  "max_min",
  "min_max",
  "max_max",
  "zero_edge_case"
];

/**
 * Validates a single Unit spec against Rule 1 (Observable Objective & Split Rubric),
 * Rule 2 (5-Part Living Object Spec), and Gates 1-4 of Rule 3.
 */
export function validateUnitSpec(unit, rootSystemId) {
  const errors = [];
  const gates = {
    gate1_single_evolving_system: true,
    gate2_state_transition_bridge: true,
    gate3_zero_phantom_controls: true,
    gate4_four_corner_truth_table: true,
    rule1_observable_objective_and_split_rubric: true,
    rule2_living_object_spec: true
  };

  // Rule 1: Observable Objective & Split Scoring Rubric
  if (!unit.objective || typeof unit.objective !== "string" || unit.objective.trim().length < 10) {
    errors.push(`[${unit.topic_id || "unknown"}] Missing or too short observable objective.`);
    gates.rule1_observable_objective_and_split_rubric = false;
  }

  const rubric = unit.how_why_challenge?.rubric;
  if (
    !rubric ||
    !rubric.check_a_prediction ||
    !rubric.check_b_mechanism ||
    !Array.isArray(rubric.known_misconceptions) ||
    rubric.known_misconceptions.length === 0 ||
    !Array.isArray(rubric.check_b_keywords) ||
    !rubric.followup_question ||
    !rubric.targeted_replay
  ) {
    errors.push(
      `[${unit.topic_id}] Split rubric must define check_a_prediction, check_b_mechanism, known_misconceptions, check_b_keywords, followup_question, and targeted_replay.`
    );
    gates.rule1_observable_objective_and_split_rubric = false;
  }

  // Rule 2: 5-Part Living Object Spec (+ analogy_limits)
  const spec = unit.object_spec;
  if (!spec) {
    errors.push(`[${unit.topic_id}] Missing object_spec.`);
    gates.rule2_living_object_spec = false;
  } else {
    for (const key of REQUIRED_LIVING_OBJECT_KEYS) {
      const val = spec[key] ?? unit.connect_bridge?.[key];
      if (!val || (Array.isArray(val) && val.length === 0)) {
        errors.push(`[${unit.topic_id}] Living Object Spec missing required field '${key}'.`);
        gates.rule2_living_object_spec = false;
      }
    }
  }

  // Gate 1: Single Evolving System (No Metaphor Hopping)
  if (!unit.system_model_layer || unit.system_model_layer.root_system_id !== rootSystemId) {
    errors.push(
      `[${unit.topic_id}] Gate 1 Failed: Unit must bind to root system_model '${rootSystemId}' without metaphor hopping.`
    );
    gates.gate1_single_evolving_system = false;
  }

  // Gate 2: Complete State-Transition Bridge
  const bridge = spec?.state_transition_bridge;
  if (!bridge) {
    errors.push(`[${unit.topic_id}] Gate 2 Failed: Missing state_transition_bridge.`);
    gates.gate2_state_transition_bridge = false;
  } else {
    for (const bKey of REQUIRED_BRIDGE_KEYS) {
      if (!bridge[bKey] || typeof bridge[bKey] !== "string") {
        errors.push(`[${unit.topic_id}] Gate 2 Failed: state_transition_bridge missing '${bKey}'.`);
        gates.gate2_state_transition_bridge = false;
      }
    }
  }

  // Gate 3: Zero "Phantom Controls" (Literal-Take Red Team)
  const audit = spec?.literal_take_audit;
  if (
    !audit ||
    audit.phantom_controls_present !== false ||
    !Array.isArray(audit.control_mappings) ||
    audit.control_mappings.length === 0 ||
    !audit.adversarial_question ||
    !audit.mitigation
  ) {
    errors.push(
      `[${unit.topic_id}] Gate 3 Failed: literal_take_audit must verify phantom_controls_present === false and map every control 1-to-1 to a real mechanism.`
    );
    gates.gate3_zero_phantom_controls = false;
  }

  // Gate 4: 4-Corner Boundary Truth Table (+ Empty/Zero Edge Case)
  const table = spec?.boundary_truth_table;
  if (!table) {
    errors.push(`[${unit.topic_id}] Gate 4 Failed: Missing boundary_truth_table.`);
    gates.gate4_four_corner_truth_table = false;
  } else {
    for (const corner of REQUIRED_TRUTH_TABLE_CORNERS) {
      if (!table[corner] || !table[corner].dials || !table[corner].expected_output) {
        errors.push(`[${unit.topic_id}] Gate 4 Failed: boundary_truth_table missing corner '${corner}'.`);
        gates.gate4_four_corner_truth_table = false;
      }
    }
  }

  return {
    topic_id: unit.topic_id,
    valid: errors.length === 0,
    gates,
    errors
  };
}

/**
 * Validates the Dual-Experience Discovery Cards against Section 6.B Apple-Minimalist UI Standards:
 * - "8-Second Micro-Toy" Rule (<= 15 words of copy per scene)
 * - No Title Spoilers ("Mystery First, Label Last")
 */
export function validateDiscoveryCards(discoveryCards = []) {
  const errors = [];
  for (const card of discoveryCards) {
    if (!card.mystery_label || !card.mystery_label.toLowerCase().includes("mystery")) {
      errors.push(`[Discovery ${card.id}] Initial nav pill must use a Mystery label (no title spoiler).`);
    }
    if (!card.earned_reveal || !card.earned_reveal.startsWith("That's ")) {
      errors.push(`[Discovery ${card.id}] Earned reveal must follow "That's [Concept]." convention.`);
    }
    if (!Array.isArray(card.scenes) || card.scenes.length !== 2) {
      errors.push(`[Discovery ${card.id}] Must provide exactly 2 unrelated micro-experiences.`);
    } else {
      for (const scene of card.scenes) {
        const wordCount = (scene.micro_copy || "").trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 15) {
          errors.push(
            `[Discovery ${card.id} / ${scene.title}] Micro-copy has ${wordCount} words (exceeds 15-word 8-second micro-toy limit).`
          );
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Compiles and verifies an entire Topic Pack across all 5 Guardrail Gates.
 */
export function compileAndValidateTopicPack(topicPack) {
  const errors = [];
  if (!topicPack || !topicPack.system_model || !topicPack.system_model.root_system_id) {
    return {
      valid: false,
      errors: ["Topic Pack missing root system_model.root_system_id (Gate 1 violation)."],
      unitReports: [],
      discoveryReport: { valid: false, errors: [] }
    };
  }

  const rootSystemId = topicPack.system_model.root_system_id;
  const unitReports = (topicPack.units || []).map(u => validateUnitSpec(u, rootSystemId));
  for (const r of unitReports) {
    if (!r.valid) errors.push(...r.errors);
  }

  const discoveryReport = validateDiscoveryCards(topicPack.discovery_cards || []);
  if (!discoveryReport.valid) {
    errors.push(...discoveryReport.errors);
  }

  return {
    valid: errors.length === 0,
    root_system_id: rootSystemId,
    unit_count: unitReports.length,
    discovery_card_count: (topicPack.discovery_cards || []).length,
    unitReports,
    discoveryReport,
    errors
  };
}

/**
 * Gate 5: Runtime Misconception Canary
 * If >15% of learners on a lesson_version pass Check A (Prediction) but fail Check B (Mechanism)
 * with the same misconception tag, automatically flags lesson_version for review.
 */
export function evaluateRuntimeCanary(ledgerAttempts = [], threshold = 0.15) {
  const byUnitVersion = new Map();

  for (const entry of ledgerAttempts) {
    const key = `${entry.topic_id}@${entry.lesson_version}`;
    if (!byUnitVersion.has(key)) {
      byUnitVersion.set(key, {
        topic_id: entry.topic_id,
        lesson_version: entry.lesson_version,
        total_attempts: 0,
        misconception_counts: {}
      });
    }
    const bucket = byUnitVersion.get(key);
    bucket.total_attempts += 1;

    if (entry.check_a_prediction_pass === true && entry.check_b_mechanism_pass === false) {
      const tag = entry.misconception_tag || "unspecified_mechanism_gap";
      bucket.misconception_counts[tag] = (bucket.misconception_counts[tag] || 0) + 1;
    }
  }

  const alerts = [];
  for (const bucket of byUnitVersion.values()) {
    for (const [tag, count] of Object.entries(bucket.misconception_counts)) {
      const rate = bucket.total_attempts > 0 ? count / bucket.total_attempts : 0;
      if (rate > threshold) {
        alerts.push({
          topic_id: bucket.topic_id,
          lesson_version: bucket.lesson_version,
          misconception_tag: tag,
          occurrences: count,
          total_attempts: bucket.total_attempts,
          rate: Number(rate.toFixed(3)),
          threshold,
          status: "FLAGGED_FOR_AUTHOR_REVIEW"
        });
      }
    }
  }

  return {
    canary_healthy: alerts.length === 0,
    threshold,
    alerts
  };
}
