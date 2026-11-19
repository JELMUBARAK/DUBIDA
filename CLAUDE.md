# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Zero-dependency Node project (ES modules, `"type": "module"`); no install, build, or lint step.

```bash
npm run validate   # 5-Gate Lesson Compiler over every pack in src/topics/index.js; exits 1 on any failure; also prints the lesson-flow report
node scripts/validate-topics.js --strict   # same, but also exits 1 on lesson-flow gaps
npm test           # node --test tests/engine.test.js tests/packs.test.js tests/flow.test.js
npm start          # http://localhost:3000 (PORT env var overrides); refuses to start if the flagship pack fails validation
node --test --test-name-pattern="Gate 1" tests/engine.test.js   # run a single test by name
```

## Architecture

The authoritative design is [docs/core_engine_mvp_spec.md](docs/core_engine_mvp_spec.md). Engine module headers reference its sections (Part A = Lesson Compiler, Part B = Learner Runtime, Section 4.3 = ledger schema, Section 6.B = discovery UI rules). Check the spec before changing engine behaviour.

**Content is data, the engine is generic.** Topic packs live in `src/topics/`. [src/topics/index.js](src/topics/index.js) is the registry: `ALL_PACKS`, `getPack(id)`, `listPacks()`, and `FLAGSHIP_PACK_ID`.
- The flagship pack, `thinking_learning_understanding.js` (5 units, 3 discovery cards, root `stm_bridge_ltm_pipeline`), keeps the URL `/learn`, but the generic player plays it like every other pack. `server.js`, `/api/{health,topic,validate,grade}`, the startup check, `tests/engine.test.js` and `dev-console.js` still import it directly and use only this pack.
- Every other pack (`heart_pump`, `multiply_by_11`, `area_vs_perimeter`) is played at `/lesson?topic=<topic_pack_id>`. Packs carry `kind` (`fact`/`skill`/`concept`), `subtitle`, `search_keywords`, `loop`, `recap`, `apply`, plus `toy` on each scene and `qa_personas` on each unit.
- To add a pack:
  1. Create the file and append it to `ALL_PACKS`.
  2. Add a kit drawing module under `public/js/visuals/` with a renderer for each unit type and each scene `toy.visual`.
  3. Register the module in [public/js/lesson-visuals.js](public/js/lesson-visuals.js).

  `validate`, `/api/packs` and `tests/packs.test.js` then pick it up with no further wiring.
- [tests/packs.test.js](tests/packs.test.js) enforces this for every non-flagship pack: exactly 3 mysteries and 3 units, exactly one correct option per question, experiment dial values within dial ranges, 3 QA personas per unit that grade as their names say (`Mastery` → graded and Check B passes; `Misconception` → a known tag; `Ambiguous` → `needs_followup`), mastery reachable through `UnitRuntimeSession`, and an SVG with no NaN/undefined at every dial combination.
- `tests/engine.test.js` asserts exact flagship counts, so editing flagship content can break it.

**Lesson Compiler ([src/engine/schema.js](src/engine/schema.js))** is the contract every unit must satisfy. `compileAndValidateTopicPack` checks:
- Rule 1: an `objective` plus a split rubric (`how_why_challenge.rubric` with `check_a_prediction`, `check_b_mechanism`, `known_misconceptions`, `check_b_keywords`, `followup_question`, `targeted_replay`).
- Rule 2: `object_spec` with `parts/connections/dials/rules/outputs/analogy_limits`.
- Gate 1: `system_model_layer.root_system_id` must equal the pack root (no "metaphor hopping").
- Gate 2: `object_spec.state_transition_bridge` with four string keys.
- Gate 3: `object_spec.literal_take_audit.phantom_controls_present === false` plus control mappings.
- Gate 4: `object_spec.boundary_truth_table` with `min_min, max_min, min_max, max_max, zero_edge_case`.
- Discovery cards: label contains "Mystery", reveal starts with `"That's "`, exactly 2 scenes, each `micro_copy` ≤ 15 words.
- Gate 5 (`evaluateRuntimeCanary`) runs at runtime over ledger entries instead. It flags a `topic_id@lesson_version` when more than 15% of attempts pass Check A but fail Check B with the same `misconception_tag`.

**Unified Lesson Flow ([src/engine/flow.js](src/engine/flow.js))** is the agreed experience every lesson must follow: 0 Setup (Simple/Deep) → 1 Three Mysteries → 2 The Loop (+ `loop.check`, one real-life question) → 3 Units (5-step spine) → 4 Recap (backwards · scorecard · Day-1 Hook; `recap.repair` optional) → 5 What's next? (`apply`). `auditLessonFlow(pack)` checks a pack has the data for each step. It is separate from the compiler, so gaps don't block `npm start`; they only fail `--strict`. All 4 packs pass `--strict`, and `tests/flow.test.js` enforces it. All 4 lessons run on the one generic player.

**Visual kit is the standard for every drawing ([public/js/visual-kit.js](public/js/visual-kit.js)).** Never hand-roll an `<svg>`.
- Unit living objects use `frame()`. Mystery-scene pictures use `sceneFrame()` (220×120). Build them from `flow`, `beat`, `leaflet`, `tank`, `chip`, `stat` and `stackBar`.
- Animation is SMIL inside the SVG, plus `.vk-*` CSS in `styles.css`. That CSS includes dark-mode chip colours and reduced-motion handling.
- Drawings live in one module per topic under `public/js/visuals/`. Each module exports `UNIT_RENDERERS` (keyed by `object_spec.type`) and `SCENE_RENDERERS` (keyed by `scene.toy.visual`).
- [lesson-visuals.js](public/js/lesson-visuals.js) is only the registry. The lesson player and the dev console both use it.
- `tests/packs.test.js` "Kit standard" tests fail any unit or scene not built with the kit. The flow check also requires `toy.visual` on every scene.
- A new topic means adding a module and listing it in `lesson-visuals.js`.

**Runtime flow:**
- [runtime.js](src/engine/runtime.js) `UnitRuntimeSession` is the 5-step spine state machine (WHAT → HOW/WHY → FEEDBACK → WHAT-IF → CONNECT).
- It calls [grader.js](src/engine/grader.js) `evaluateSplitRubric`, which keyword-matches the WHY text. The grader asks one clarifying follow-up when Check A passes but the mechanism is ambiguous, and records every assist in `help_used`.
- `masteryState` stays `supported_practice` until the unassisted What-If proof passes. Only then does it become `independent_mastery`, and only then is CONNECT allowed. The grader never grants mastery itself.
- Each graded step emits a frozen [ledger.js](src/engine/ledger.js) entry via `createLedgerEntry`. The entry's `next_review_at` comes from [scheduler.js](src/engine/scheduler.js): it resets to stage 0 (10 min) unless the learner has mastery and Check B passed.

**Server ([server.js](server.js))** uses raw `node:http` with no framework. It exports `handleAppRequest` so tests can call it with mock req/res objects instead of listening on a port. The `EvidenceLedgerStore` lives in memory and is lost on restart.
- Pages: `/` → `search.html` (DUBIDA start page), `/learn` → `lesson.html` (flagship lesson: with no `?topic=`, the player picks the pack whose registry `href` is the current path), `/lesson` → `lesson.html` (generic player), `/dev` → `dev.html`.
- API: `/api/packs` lists the registry. `/api/packs/:id` returns a pack, or 422 if it fails the compiler. The other routes are `/api/{health,topic,validate,grade,ledger,canary}`.
- `/src/*` is served statically so the browser can import engine modules. Other files under `public/` are served as-is with `Cache-Control: no-cache`.

**Front-ends with different coupling:**
- `public/js/search.js` (`/`) fetches `/api/packs` and matches the query against pack `keywords`. File uploads, YouTube links and the web toggle are only collected in the UI for now. AI lesson generation via Claude is the planned next step (`submitRequest`).
- `public/index.html` + `public/js/learner-app.js` is the old hand-built flagship page. It is no longer routed and is kept on disk only as a fallback. Don't build on it.
- `public/js/lesson-player.js` (`/lesson`) imports `UnitRuntimeSession` from `/src/engine/runtime.js` and renderers from `lesson-visuals.js`. It fetches the pack from `/api/packs/:id` and POSTs ledger entries.
- The README rule for learner surfaces (`/`, `/learn`, `/lesson`) is "zero developer clutter": keep debug or telemetry UI on `/dev` only.
- `public/js/dev-console.js` (`/dev`) imports the engine and flagship pack directly from `/src/...` and runs them in the browser.
- Because the browser imports from `src/`, engine and topic modules must stay browser-compatible: no Node-only imports in `src/`. `lesson-visuals.js` is in turn imported by Node tests, so it must not touch the DOM at module load.
