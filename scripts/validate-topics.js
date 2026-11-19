/**
 * CLI Validator: Compiles and verifies every Topic Pack in src/topics/index.js against the
 * 5-Gate Simulation Accuracy Guardrails. Exits 1 if any pack fails.
 */

import { ALL_PACKS } from "../src/topics/index.js";
import { compileAndValidateTopicPack } from "../src/engine/schema.js";

console.log("======================================================================");
console.log("🛡️  UNDERSTANDING APP — 5-GATE LESSON COMPILER & GUARDRAIL VALIDATOR");
console.log("======================================================================");

let allValid = true;

for (const pack of ALL_PACKS) {
  const report = compileAndValidateTopicPack(pack);
  console.log(`\nTopic Pack:       ${pack.title} (${pack.topic_pack_id})`);
  console.log(`Root System (G1): ${report.root_system_id}`);
  console.log(`Discovery Cards:  ${report.discovery_card_count} Dual-Experience Cards (8-Second Micro-Toy & No-Spoiler Checked)`);
  console.log(`Engine Units:     ${report.unit_count} Living Object Specs`);
  console.log("----------------------------------------------------------------------");

  for (const uReport of report.unitReports || []) {
    const status = uReport.valid ? "✅ PASS" : "❌ FAIL";
    console.log(`${status}  ${uReport.topic_id}`);
    console.log(
      `       Gate 1 (Single System): ${uReport.gates.gate1_single_evolving_system ? "✓" : "✖"} | ` +
      `Gate 2 (State Bridge): ${uReport.gates.gate2_state_transition_bridge ? "✓" : "✖"} | ` +
      `Gate 3 (Zero Phantom): ${uReport.gates.gate3_zero_phantom_controls ? "✓" : "✖"} | ` +
      `Gate 4 (4-Corner Table): ${uReport.gates.gate4_four_corner_truth_table ? "✓" : "✖"}`
    );
  }

  if (!report.valid) {
    allValid = false;
    console.error("❌ Validation failed with errors:");
    for (const err of report.errors) {
      console.error(`  - ${err}`);
    }
  }
}

console.log("\n----------------------------------------------------------------------");
if (!allValid) {
  process.exit(1);
}
console.log(`✅ ALL ${ALL_PACKS.length} TOPIC PACKS PASSED THE 5 GUARDRAIL GATES & DISCOVERY RULES.`);
