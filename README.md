# Understanding App (v2.0)

**Dual-Experience Inductive Discovery + Universal 4+1 Learning Engine**  
Scaffolded from the committed baseline specification ([docs/core_engine_mvp_spec.md](file:///C:/Users/darid/.gemini/antigravity/scratch/understanding-app/docs/core_engine_mvp_spec.md)) and validated reference prototype.

---

## Quickstart

```bash
# 1. Run the 5-Gate Lesson Compiler & Guardrail Validator
npm run validate

# 2. Run the Automated Core Engine Test Suite
npm test

# 3. Start the Local Server (Learner Surface + Developer Telemetry Route)
npm start
```

Once started (`http://localhost:3000`):
* **Learner Discovery Surface (`/`)**: `http://localhost:3000/`
  * Apple-minimalist Dual-Experience Inductive Discovery flow (*"Experience First, Name Last"*).
  * 2-Tap Purpose & Depth Setup → `1 · Mystery A` (*Thinking*) → `2 · Mystery B` (*Learning*) → `3 · Mystery C` (*Understanding*) → `4 · The Loop` + Unassisted *What-If* Proof + 3-Part Unified Mastery Recap.
  * **Zero Developer Clutter on the Learner Surface** (all telemetry posts silently to `/api/ledger`).
* **Developer & Engine Telemetry Route (`/dev`)**: `http://localhost:3000/dev`
  * Live **5-Gate Lesson Compiler Audit** (Single Evolving System, Complete State-Transition Bridge, Zero Phantom Controls, 4-Corner Boundary Truth Table, and Runtime Misconception Canary).
  * Full **5-Step Universal Learning Spine** (`1. WHAT?` → `2. HOW?` → `3. WHY?` → `4. WHAT IF?` → `5. CONNECT`) across the 4-Unit `STM ↔ LTM` Living Objects + Tab 5 Unified Mastery Recap.
  * **1-Click QA Persona Simulator** (Mastery, Known Misconception, Ambiguous Single Follow-up) and live **Versioned Evidence Ledger** JSON inspector.

---

## Project Structure

```text
understanding-app/
├── docs/
│   └── core_engine_mvp_spec.md                 # Committed v2.0 Engine & MVP Specification
├── public/
│   ├── index.html                              # Learner Discovery Surface (/) — Zero Dev Clutter
│   ├── dev.html                                # Developer & Telemetry Route (/dev)
│   ├── css/
│   │   └── styles.css                          # Design tokens & SVG physics animations
│   └── js/
│       ├── learner-app.js                      # Dual-Experience Inductive Discovery + 3-Part Recap
│       └── dev-console.js                      # 5-Step Spine Player, QA Personas & JSON Inspector
├── scripts/
│   └── validate-topics.js                      # CLI 5-Gate Lesson Compiler & Guardrail Validator
├── src/
│   ├── engine/
│   │   ├── schema.js                           # Lesson Compiler & 5-Gate Accuracy Guardrails
│   │   ├── grader.js                           # Correction-Friendly Split-Rubric Grader
│   │   ├── runtime.js                          # 5-Step Spine State Machine & Pause/Resume
│   │   ├── scheduler.js                        # Unlimited Memory Spaced Transfer Schedule
│   │   └── ledger.js                           # Immutable Versioned Evidence Ledger & Gate 5 Canary
│   └── topics/
│       └── thinking_learning_understanding.js  # Flagship Verified Topic Pack (Discovery + 5 Units)
├── tests/
│   └── engine.test.js                          # Node automated test suite (Gates 1-5, Grader, Runtime)
├── package.json
└── server.js                                   # Zero-dependency HTTP & Telemetry REST Server
```
