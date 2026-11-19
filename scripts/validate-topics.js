/**
 * CLI Validator: Compiles and verifies all Topic Packs against the 5-Gate Simulation Accuracy Guardrails.
 */

import { THINKING_LEARNING_UNDERSTANDING_PACK } from "../src/topics/thinking_learning_understanding.js";
import { compileAndValidateTopicPack } from "../src/engine/schema.js";

const report = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);

console.log("======================================================================");
console.log("🛡️  UNDERSTANDING APP — 5-GATE LESSON COMPILER & GUARDRAIL VALIDATOR");
console.log("======================================================================");
console.log(`Topic Pack:       ${THINKING_LEARNING_UNDERSTANDING_PACK.title} (${THINKING_LEARNING_UNDERSTANDING_PACK.topic_pack_id})`);
console.log(`Root System (G1): ${report.root_system_id}`);
console.log(`Discovery Cards:  ${report.discovery_card_count} Dual-Experience Cards (8-Second Micro-Toy & No-Spoiler Checked)`);
console.log(`Engine Units:     ${report.unit_count} Connected STM ↔ LTM Living Object Specs`);
console.log("----------------------------------------------------------------------");

for (const uReport of report.unitReports) {
  const status = uReport.valid ? "✅ PASS" : "❌ FAIL";
  console.log(`${status}  ${uReport.topic_id}`);
  console.log(
    `       Gate 1 (Single System): ${uReport.gates.gate1_single_evolving_system ? "✓" : "✖"} | ` +
    `Gate 2 (State Bridge): ${uReport.gates.gate2_state_transition_bridge ? "✓" : "✖"} | ` +
    `Gate 3 (Zero Phantom): ${uReport.gates.gate3_zero_phantom_controls ? "✓" : "✖"} | ` +
    `Gate 4 (4-Corner Table): ${uReport.gates.gate4_four_corner_truth_table ? "✓" : "✖"}`
  );
}

console.log("----------------------------------------------------------------------");
if (!report.valid) {
  console.error("❌ Validation failed with errors:");
  for (const err of report.errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("✅ ALL 5 SIMULATION ACCURACY GUARDRAIL GATES & DISCOVERY RULES PASSED.");
