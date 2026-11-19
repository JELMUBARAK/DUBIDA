# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Zero-dependency Node project (ES modules, `"type": "module"`); no install, build, or lint step.

```bash
npm run validate   # 5-Gate Lesson Compiler: validates the topic pack, exits 1 on any gate failure
npm test           # node --test tests/engine.test.js
npm start          # http://localhost:3000 (PORT env var overrides); refuses to start if the topic pack fails validation
node --test --test-name-pattern="Gate 1" tests/engine.test.js   # run a single test by name
```

## Architecture

The authoritative design is [docs/core_engine_mvp_spec.md](docs/core_engine_mvp_spec.md). Engine module headers reference its sections (Part A = Lesson Compiler, Part B = Learner Runtime, Section 4.3 = ledger schema, Section 6.B = discovery UI rules). Check the spec before changing engine behaviour.

**Content is data, the engine is generic.** The only topic pack is [src/topics/thinking_learning_understanding.js](src/topics/thinking_learning_understanding.js) (`THINKING_LEARNING_UNDERSTANDING_PACK`): a `system_model.root_system_id`, 3 `discovery_cards`, and 5 `units`. `server.js`, `scripts/validate-topics.js`, the tests and `public/js/dev-console.js` each import this pack directly. Adding a pack means wiring it into each of them.

**Lesson Compiler ([src/engine/schema.js](src/engine/schema.js))** is the contract every unit must satisfy. `compileAndValidateTopicPack` checks:
- Rule 1: an `objective` plus a split rubric (`how_why_challenge.rubric` with `check_a_prediction`, `check_b_mechanism`, `known_misconceptions`, `check_b_keywords`, `followup_question`, `targeted_replay`).
- Rule 2: `object_spec` with `parts/connections/dials/rules/outputs/analogy_limits`.
- Gate 1: `system_model_layer.root_system_id` must equal the pack root (no "metaphor hopping").
- Gate 2: `object_spec.state_transition_bridge` with four string keys.
- Gate 3: `object_spec.literal_take_audit.phantom_controls_present === false` plus control mappings.
- Gate 4: `object_spec.boundary_truth_table` with `min_min, max_min, min_max, max_max, zero_edge_case`.
- Discovery cards: label contains "Mystery", reveal starts with `"That's "`, exactly 2 scenes, each `micro_copy` ≤ 15 words.
- Gate 5 (`evaluateRuntimeCanary`) runs at runtime over ledger entries instead. It flags a `topic_id@lesson_version` when more than 15% of attempts pass Check A but fail Check B with the same `misconception_tag`.

Tests assert exact counts (5 units, 3 discovery cards, root `stm_bridge_ltm_pipeline`). Editing pack content can break them.

**Runtime flow:**
- [runtime.js](src/engine/runtime.js) `UnitRuntimeSession` is the 5-step spine state machine (WHAT → HOW/WHY → FEEDBACK → WHAT-IF → CONNECT).
- It calls [grader.js](src/engine/grader.js) `evaluateSplitRubric`, which keyword-matches the WHY text. The grader asks one clarifying follow-up when Check A passes but the mechanism is ambiguous, and records every assist in `help_used`.
- `masteryState` stays `supported_practice` until the unassisted What-If proof passes. Only then does it become `independent_mastery`, and only then is CONNECT allowed. The grader never grants mastery itself.
- Each graded step emits a frozen [ledger.js](src/engine/ledger.js) entry via `createLedgerEntry`. The entry's `next_review_at` comes from [scheduler.js](src/engine/scheduler.js): it resets to stage 0 (10 min) unless the learner has mastery and Check B passed.

**Server ([server.js](server.js))** uses raw `node:http` with no framework. It exports `handleAppRequest` so tests can call it with mock req/res objects instead of listening on a port. The `EvidenceLedgerStore` lives in memory and is lost on restart. Routes: `/` → `public/index.html`, `/dev` → `public/dev.html`, `/api/{health,topic,validate,grade,ledger,canary}`. `/src/*` is served statically so the browser can import engine modules.

**Two front-ends with different coupling:**
- `public/js/learner-app.js` (learner surface `/`) is self-contained and imports no engine modules. It only POSTs telemetry to `/api/ledger`. The README rule is "zero developer clutter" on this surface: keep debug or telemetry UI off it.
- `public/js/dev-console.js` (`/dev`) imports the engine and topic pack directly from `/src/...` and runs them in the browser. Engine modules must therefore stay browser-compatible: no Node-only imports in `src/`.
