/**
 * Understanding App — Flagship Verified Topic Pack:
 * "Thinking, Learning & Understanding" (Dual-Experience Inductive Discovery + 4-Unit STM <-> LTM Engine + Unified Recap)
 * Passes all 5 Simulation Accuracy Guardrail Gates in src/engine/schema.js.
 */

export const THINKING_LEARNING_UNDERSTANDING_PACK = {
  topic_pack_id: "thinking_learning_understanding_v2",
  title: "Thinking, Learning & Understanding",
  version: "2.0.0",
  system_model: {
    root_system_id: "stm_bridge_ltm_pipeline",
    name: "The Unified STM ↔ Encoding/Retrieval Bridge ↔ LTM Cognitive Architecture",
    description:
      "One evolving cognitive pipeline across all units: 4-Slot Working Memory (STM) Workbench ↔ Causal Encoding & Retrieval Bridge ↔ Long-Term Memory (LTM) Schema Vault."
  },

  // ==========================================================================
  // LEARNER SURFACE: DUAL-EXPERIENCE INDUCTIVE DISCOVERY CARDS (Apple-Minimalist)
  // ==========================================================================
  discovery_cards: [
    {
      id: "card_0_thinking",
      card_index: 0,
      mystery_label: "1 · Mystery A",
      solved_label: "1 · Thinking ✓",
      earned_reveal: "That's Thinking.",
      header_eyebrow: "Mystery 1 of 3 · Play Both Scenes",
      header_prompt: "Two unrelated scenes. Spot the hidden move.",
      scenes: [
        {
          id: "kitchen",
          title: "🍳 Kitchen",
          status_default: "Stove: OFF (Imagining)",
          micro_copy: "Test ingredient pairs inside the thought-cloud while the real stove stays off.",
          toy: {
            visual: "think_kitchen",
            options: [
              { label: "🥚 Eggs + 🍫 Choc", result: "🤢 Yuck, but only in your head. 0 eggs wasted.", tone: "warn" },
              { label: "🥚 Eggs + 🍚 Rice", result: "🍲 Works in the thought-cloud. Ready to cook.", tone: "ok" }
            ]
          }
        },
        {
          id: "commute",
          title: "🚗 Route Map",
          status_default: "Car: PARKED",
          micro_copy: "Preview highway and side-street traffic before driving out of your driveway.",
          toy: {
            visual: "think_commute",
            options: [
              { label: "🛣️ Preview Highway", result: "🔴 Blocked: +45 min. You saw it before leaving.", tone: "warn" },
              { label: "🌲 Preview Side Rd", result: "🟢 Clear: 18 min. The car is still in the driveway.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question:
        "In one scene the stove was off; in the other the car was parked. What same move did you make in both?",
      options: [
        {
          id: "wrong",
          label: "Practiced a physical habit over and over",
          correct: false,
          feedback: "You hadn't practiced a physical skill yet — you were simulating options before acting."
        },
        {
          id: "right",
          label: "Simulated \"what-if\" options in my head before acting",
          correct: true
        }
      ],
      reveal_simple:
        "Testing possibilities in your head so bad ideas fail in your imagination instead of in real life.",
      reveal_deep:
        "Running mental simulations in Working Memory — expanding options (divergent) and comparing outcomes (convergent) before spending real-world energy.",
      under_the_hood: {
        tag: "🔬 UNDER THE HOOD · WORKING MEMORY SANDBOX",
        flow: "Sensory Input ──► Working Memory (~4 Slots) ──► Divergent Branching (Options) ──► Convergent Filter (Best Path)",
        note: "Why it matters: Your prefrontal cortex runs internal 'what-if' simulations so errors happen in neural software instead of physical reality."
      }
    },
    {
      id: "card_1_learning",
      card_index: 1,
      mystery_label: "2 · Mystery B",
      solved_label: "2 · Learning ✓",
      earned_reveal: "That's Learning.",
      header_eyebrow: "Mystery 2 of 3 · Watch & Calibrate",
      header_prompt: "Why couldn't \"Thinking\" alone nail these on Try 1?",
      scenes: [
        {
          id: "court",
          title: "🏀 Free Throw",
          status_default: "Try 0 of 3",
          micro_copy: "Shoot three free throws, using each rim bounce to calibrate your arc.",
          toy: {
            visual: "think_court",
            options: [
              { label: "🏀 Shoot (Try 1)", result: "Short! Clanged the front rim → aim 20% higher.", tone: "warn" },
              { label: "🎯 Aim higher (Try 2)", result: "Long! Off the backboard → ease the power 10%.", tone: "warn" },
              { label: "🎯 Soften the arc (Try 3)", result: "Swish! That arc is now in muscle memory.", tone: "ok" }
            ]
          }
        },
        {
          id: "espresso",
          title: "☕ Espresso Pull",
          status_default: "Try 0 of 3",
          micro_copy: "Pull three espresso shots, using the pressure gauge to dial in golden crema.",
          toy: {
            visual: "think_espresso",
            options: [
              { label: "☕ Pull shot (Try 1)", result: "13 bar: choked and bitter → coarsen the grind.", tone: "warn" },
              { label: "⚙️ Coarser grind (Try 2)", result: "4 bar: gushed and sour → dial to the middle.", tone: "warn" },
              { label: "⚙️ Middle grind (Try 3)", result: "9 bar: golden crema! Setting remembered.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question:
        "You watched the ball bounce off the rim and watched the gauge miss the green zone. What turned Try 1 into skill on Try 3?",
      options: [
        {
          id: "right",
          label: "Action → seeing feedback on the error → adjusting and wiring it into memory",
          correct: true
        },
        {
          id: "wrong",
          label: "Just imagining it once without ever taking a shot or checking feedback",
          correct: false,
          feedback: "Imagining alone couldn't tell you how hard the rim or the coffee grind would push back!"
        }
      ],
      reveal_simple:
        "Trying for real, seeing exactly how you missed, and adjusting until the right move sticks for tomorrow.",
      reveal_deep:
        "Closing the feedback loop between Working Memory and Long-Term Memory (both Procedural motor skill on the court and Declarative settings on the machine).",
      under_the_hood: {
        tag: "🔬 UNDER THE HOOD · ERROR-DRIVEN SYNAPTIC CALIBRATION",
        flow: "Motor/Action Attempt ──► Prediction Error Signal (Rim / Gauge Gap) ──► Working Memory Adjustment ──► Long-Term Memory",
        note: "Court = Procedural LTM (cerebellum/basal ganglia motor arc) · Espresso = Semantic LTM (declarative rule). Both require feedback to wire in."
      }
    },
    {
      id: "card_2_understanding",
      card_index: 2,
      mystery_label: "3 · Mystery C",
      solved_label: "3 · Understanding ✓",
      earned_reveal: "That's Understanding.",
      header_eyebrow: "Mystery 3 of 3 · When the Rule Breaks",
      header_prompt: "The memorized recipe breaks. Adapt the system.",
      scenes: [
        {
          id: "oven",
          title: "🧁 Oven Window",
          status_default: "0 Eggs · Need a Binder",
          micro_copy: "Out of eggs: swap in a functional binder so the cake rises tall.",
          toy: {
            visual: "think_oven",
            options: [
              { label: "🧂 Swap in Salt", result: "❌ Salt can't hold the bubbles: the cake collapses flat.", tone: "warn" },
              { label: "🍌 Swap in Banana", result: "✨ Banana binds the bubbles like egg: the cake rises tall.", tone: "ok" }
            ]
          }
        },
        {
          id: "budget",
          title: "💰 Connected Budget",
          status_default: "Surprise -$200 Tire Bill",
          micro_copy: "Rebalance flexible dining spending to absorb a repair shock and protect savings.",
          toy: {
            visual: "think_budget",
            options: [
              { label: "Drain Savings", result: "⚠️ Savings sink to $100. The next surprise breaks you.", tone: "warn" },
              { label: "Shift Dining → Savings", result: "✅ Dining drops to $50, savings stay safe at $300.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question:
        "In both scenes, the memorized plan broke. What let you solve a brand-new problem?",
      options: [
        {
          id: "wrong",
          label: "Repeating the exact memorized rules without changing anything",
          correct: false,
          feedback: "Repeating the old recipe or old budget failed as soon as the eggs ran out or the tire blew."
        },
        {
          id: "right",
          label: "Knowing HOW and WHY the parts work together so I could adapt",
          correct: true
        }
      ],
      reveal_simple:
        "Knowing WHY the pieces work together, so you can improvise and solve problems you've never seen before.",
      reveal_deep:
        "Owning a connected causal schema in Long-Term Memory — so when one variable shifts, you can predict and transfer across new contexts.",
      under_the_hood: {
        tag: "🔬 UNDER THE HOOD · CAUSAL SCHEMA & STRUCTURAL TRANSFER",
        flow: "Surface Twist (0 Eggs / -$200 Bill) ──► Retrieve Deep LTM Schema ('WHY it works') ──► Re-map Invariant Rule to New Context",
        note: "Rote memory stores surface labels ('use eggs'); a causal schema stores functional relationships ('need a binder'), enabling transfer."
      }
    }
  ],

  // ==========================================================================
  // THE LOOP: how the three mysteries connect + one real-life check (Unified Lesson Flow step 2)
  // ==========================================================================
  loop: {
    headline: "One Loop: Simulate → Calibrate → Adapt",
    steps: [
      { label: "1 · Thinking", title: "💭 Simulate Options", text: "Preview \"what-if\" in your head before acting (Kitchen & Map)." },
      { label: "2 · Learning", title: "🎯 Calibrate via Feedback", text: "Try, watch the miss, adjust, and wire it into memory (Hoop & Espresso)." },
      { label: "3 · Understanding", title: "🔄 Adapt the System", text: "Know WHY the parts connect so you can handle new twists (Oven & Budget)." }
    ],
    check: {
      question:
        "Maya memorized every budgeting term and passed the quiz, but when her rent rose by $150 she couldn't figure out how to rebalance her budget. Which stage was missing?",
      options: [
        {
          label: "Thinking",
          correct: false,
          feedback: "She could picture options fine. What broke was adapting the connected system to a new twist."
        },
        {
          label: "Learning Terms",
          correct: false,
          feedback: "She already memorized the definitions. What broke was adapting the connected system to a new twist."
        },
        {
          label: "Understanding",
          correct: true,
          feedback: "Spot on. She learned the facts, but hadn't connected how the parts drive each other, so she couldn't adapt when conditions changed."
        }
      ]
    }
  },

  // ==========================================================================
  // CORE ENGINE UNITS: 4-UNIT COURSE PATH + TAB 5 UNIFIED MASTERY RECAP
  // ==========================================================================
  units: [
    // ------------------------------------------------------------------------
    // UNIT 1: THINKING (The 4-Slot STM Workbench -> LTM Gate)
    // ------------------------------------------------------------------------
    {
      unit_num: 1,
      topic_id: "cog_unit1_stm_workbench",
      short_tab: "Unit 1 · Thinking",
      sub_tab: "4-Slot STM Workbench",
      title: "Unit 1 (Thinking): The 4-Slot Working Memory Bottleneck",
      purpose_hook:
        "Before any idea can reach Long-Term Memory (LTM), it must survive your tiny 4-slot Short-Term / Working Memory workbench (~20s decay).",
      lesson_version: "2.3.0",
      rubric_version: "2.3.0",
      objective:
        "Predict when Working Memory overflows or decays before reaching LTM, and explain why distractions block encoding.",
      system_model_layer: {
        root_system_id: "stm_bridge_ltm_pipeline",
        layer_focus: "Stage 1: 4-Slot STM / Working Memory Workbench Input Gate"
      },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the 4-Slot Workbench (STM/WM) and the LTM Vault in the simulation above:",
        question: "How do Short-Term / Working Memory (the 4-Slot Workbench) and Long-Term Memory (the LTM Vault) differ?",
        options: [
          {
            id: "same",
            label: "Both can hold unlimited items forever as soon as you see them.",
            correct: false,
            feedback: "If STM held everything forever, you'd never forget a phone number! Check the 4-slot desk limit."
          },
          {
            id: "bottleneck",
            label: "🛠️ The STM/WM Workbench holds only ~4 items for ~20 seconds; 🗄️ the LTM Vault stores connected schemas indefinitely once encoded.",
            correct: true,
            feedback: "Spot on! Every new idea starts on the fragile 4-slot desk and must cross the Encoding Bridge into LTM before it drops or fades."
          },
          {
            id: "bypass",
            label: "New ideas skip the 4-slot workbench and go straight into Long-Term Memory.",
            correct: false,
            feedback: "Nothing reaches conscious Long-Term understanding without first sitting on your 4-slot Working Memory workbench."
          }
        ]
      },
      object_spec: {
        type: "unit1_workbench_ltm",
        parts: [
          "4-Slot STM/WM Workbench (~20s timer)",
          "Idea Blocks (Blue)",
          "Distraction Pings (Red)",
          "Encoding Bridge → LTM Vault"
        ],
        connections: [
          "Incoming Idea Blocks + Distraction Pings compete for the 4 active STM Workbench slots",
          "Unoverflowed STM Workbench slots feed across the Encoding Bridge into the LTM Vault"
        ],
        dials: {
          dial1: { key: "ideas", label: "🧩 Idea Pieces on Desk", min: 1, max: 6, default: 3, unit: "pieces" },
          dial2: { key: "pings", label: "📱 Distraction Pings", min: 0, max: 3, default: 2, unit: "pings" }
        },
        rules: [
          "Total active load = Idea Pieces + Distraction Pings.",
          "Termination / Boundary Condition: Whenever Total Load > 4 slots, the workbench overflows, dropping excess ideas and blocking the STM → LTM Encoding Bridge."
        ],
        outputs: [
          "Active STM Slot Occupancy (0..4 slots + Dropped Overflow List)",
          "STM → LTM Encoding Bridge Status (OPEN vs. BLOCKED)"
        ],
        analogy_limits: [
          {
            breaks: "Every box on the 4-slot desk is a fixed single fact",
            reality:
              "Once you wire 4 facts together into Long-Term Memory (Unit 2), you can pull that entire 4-part schema back onto your STM workbench as **1 compact Chunk (1 slot)**!"
          },
          {
            breaks: "Items stay on the desk forever if nothing pushes them off",
            reality:
              "Without active rehearsal or encoding into LTM, items in Short-Term Memory decay on their own in **15 to 30 seconds**."
          }
        ],
        state_transition_bridge: {
          source_state: "4-Slot STM / Working Memory Workbench",
          bridge_condition: "Total active load (Ideas + Pings) <= 4 slots for ~20s encoding window",
          target_state: "Long-Term Memory (LTM) Vault",
          return_feedback_loop: "Encoded LTM schemas return to STM as compressed 1-slot chunks in Unit 2"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (ideas)", real_mechanism: "Intrinsic + germane cognitive load (number of novel elements held simultaneously)" },
            { control: "dial2 (pings)", real_mechanism: "Extraneous cognitive load / attentional task-switching interruptions" }
          ],
          adversarial_question: "If a beginner takes the 4-slot desk literally, will they think each slot can only ever hold 1 tiny word forever?",
          mitigation: "Step 4 What-If and Step 5 Analogy Limits explicitly prove that 4 facts compress into 1 LTM Chunk slot and that unencoded STM items decay in ~20s."
        },
        boundary_truth_table: {
          min_min: { dials: { ideas: 1, pings: 0 }, expected_output: "1/4 slots used; Bridge OPEN; 100% ready to encode." },
          max_min: { dials: { ideas: 6, pings: 0 }, expected_output: "6/4 slots overflow even with 0 pings; 2 ideas dropped; Bridge BLOCKED." },
          min_max: { dials: { ideas: 1, pings: 3 }, expected_output: "4/4 slots at exact capacity boundary (3 pings + 1 idea); Bridge barely OPEN." },
          max_max: { dials: { ideas: 6, pings: 3 }, expected_output: "9/4 severe overflow; 5 ideas dropped; Bridge BLOCKED." },
          zero_edge_case: { dials: { ideas: 3, pings: 0 }, expected_output: "0 distractions leaves 3/4 slots clean and stable." }
        },
        target_experiment: { dial1: 3, dial2: 2, label: "Set Ideas = 3 & Pings = 2" },
        whatif_experiment: { dial1: 6, dial2: 0, label: "Set Ideas = 6 & Pings = 0" },
        boundary_rule:
          "Total active load = Idea Pieces + Distraction Pings. Whenever Total Load > 4 slots, the workbench overflows and blocks the STM → LTM Encoding Bridge."
      },
      how_why_challenge: {
        instruction:
          "Experiment: Set Idea Pieces = 3 and Distraction Pings = 2 above (or click '⚡ One-Tap: Set Ideas = 3 & Pings = 2'), then answer Part 1 and Part 2:",
        part1_how_question:
          "Part 1 (HOW — Prediction): With 3 Idea Pieces and 2 Distraction Pings (5 items total on a 4-slot desk), what happens?",
        part1_choices: [
          {
            id: "overflows",
            label: "💥 The 4-slot desk overflows (5/4) — Idea #3 drops off and 0% crosses into LTM",
            correct: true
          },
          {
            id: "stretches",
            label: "🪄 The workbench stretches to 6 slots and encodes everything into LTM",
            correct: false
          },
          {
            id: "ignores",
            label: "🛡️ The brain processes notifications without using any workbench slots",
            correct: false
          }
        ],
        part2_why_question:
          "Part 2 (WHY — Mechanism): Why do those 2 quick phone notifications prevent your 3 ideas from converting into Long-Term Memory?",
        part2_placeholder:
          "e.g., Because STM only has 4 slots (~20s), so the pings steal slots and push out the ideas before they can link and cross into LTM...",
        qa_personas: [
          {
            name: "Persona A: Mastery (Pings steal limited 4 STM slots before encoding to LTM)",
            d1: 3,
            d2: 2,
            how_choice: "overflows",
            why_text:
              "Because working memory only holds 4 items for ~20 seconds; each distraction steals a slot and pushes out Idea #3 before the ideas can link and encode into LTM."
          },
          {
            name: "Persona B: Misconception (Overflows + 'Pings erase Long-Term Memory')",
            d1: 3,
            d2: 2,
            how_choice: "overflows",
            why_text: "Because phone notifications erase your Long-Term Memory vault."
          },
          {
            name: "Persona C: Ambiguous (Overflows + 'Because of the phone')",
            d1: 3,
            d2: 2,
            how_choice: "overflows",
            why_text: "Because of the phone notifications."
          }
        ],
        rubric: {
          check_a_prediction: "Correctly selects 'overflows' (5 total items on a 4-slot STM desk drops Idea #3 and blocks LTM encoding).",
          check_b_mechanism: "Explains that limited STM/Working Memory slots (4-slot capacity) are displaced/stolen by distractions before encoding into LTM.",
          known_misconceptions: [
            {
              tag: "pings_erase_ltm_directly",
              triggers: ["erase your long-term", "erase long-term", "erases ltm", "wipe ltm", "glucose"],
              explanation: "Distractions do not erase existing Long-Term Memory; they displace items from the 4-slot Working Memory desk before encoding can happen."
            }
          ],
          check_b_keywords: [
            "slot",
            "space",
            "room",
            "4",
            "four",
            "capacity",
            "push",
            "displace",
            "steal",
            "working memory",
            "stm",
            "short-term",
            "before",
            "encode",
            "ltm"
          ],
          misconception_keywords: ["erase your long-term", "erase long-term", "erases ltm", "glucose"],
          followup_question:
            "You're right that the phone notifications cause it! What do those 2 notifications do to the 4 available slots on your STM workbench?",
          targeted_replay:
            "🔁 TARGETED REPLAY ABOVE: Look at the 4-Slot Workbench locked at 3 Ideas + 2 Pings = 5 items. Because STM only has 4 slots, the 2 red Pings hijack Slots #1 and #2, knocking Idea #3 onto the floor before the STM → LTM bridge can activate!"
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF — Unassisted Mastery Proof): Earlier, distractions caused the overflow. Now test a silent room (Pings = 0):",
        scenario:
          "You lock your phone away (Pings = 0), but a dense textbook sentence throws 6 brand-new technical terms at you all at once (Idea Pieces = 6).",
        question:
          "Click '⚡ One-Tap: Set Ideas = 6 & Pings = 0' above. Why does the workbench still overflow, and how does Long-Term Memory solve this in Unit 2?",
        options: [
          {
            label: "Because there are 0 phone pings, all 6 new terms fit comfortably on the 4-slot desk.",
            correct: false,
            feedback: "Look at the Workbench when Ideas = 6 and Pings = 0: 6 blue blocks still exceed 4 slots!"
          },
          {
            label:
              "It STILL overflows (6/4 slots)! To fit complex ideas on a 4-slot desk, we must encode groups of facts into LTM 'Chunks' (Unit 2) that take up only 1 slot!",
            correct: true,
            feedback: "🎉 Independent Mastery Unlocked! Next in Unit 2: How do we convert 4 loose STM items into 1 LTM Chunk?"
          },
          {
            label: "Unencoded items wait in Short-Term Memory for 3 days until space opens up.",
            correct: false,
            feedback: "Remember the ~20-second STM decay timer: unencoded items fade in seconds!"
          }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Every box on the 4-slot desk is a fixed single fact",
            reality:
              "Once you wire 4 facts together into Long-Term Memory (Unit 2), you can pull that entire 4-part schema back onto your STM workbench as **1 compact Chunk (1 slot)**!"
          },
          {
            breaks: "Items stay on the desk forever if nothing pushes them off",
            reality:
              "Without active rehearsal or encoding into LTM, items in Short-Term Memory decay on their own in **15 to 30 seconds**."
          }
        ],
        next_unit: "Next in Unit 2: How do 4 loose bricks in STM convert into a locked LTM Arch ('Chunk')?",
        next_unit_idx: 1,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------------
    // UNIT 2: UNDERSTANDING (STM Loose Bricks -> LTM Locked Arch & 4-to-1 Chunking)
    // ------------------------------------------------------------------------
    {
      unit_num: 2,
      topic_id: "cog_unit2_bricks_to_arch",
      short_tab: "Unit 2 · Understanding",
      sub_tab: "STM Bricks → LTM Arch",
      title: "Unit 2 (Understanding): Converting STM Facts Into an LTM Arch ('Chunk')",
      purpose_hook:
        "Repeating loose facts in STM doesn't convert them to LTM. See how 'Why' causal links lock facts into a self-supporting LTM Arch — and compress 4 STM slots into 1!",
      lesson_version: "2.3.0",
      rubric_version: "2.3.0",
      objective:
        "Predict whether rote STM repetition vs. causal 'Why' linking converts facts into a durable LTM schema, and explain 4-to-1 Chunk compression.",
      system_model_layer: {
        root_system_id: "stm_bridge_ltm_pipeline",
        layer_focus: "Stage 2: STM → LTM Elaborative Encoding Bridge & 4-into-1 Schema Chunking"
      },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the Loose Fact Bricks in STM (left) vs. the Locked Stone Arch in LTM (right) above:",
        question: "What converts loose 'Fact Bricks' sitting in Short-Term Memory across the bridge into a locked 'Arch' in Long-Term Memory?",
        options: [
          {
            id: "rote",
            label: "Repeating the loose facts out loud 10 times without changing anything (Maintenance Rehearsal).",
            correct: false,
            feedback: "Rote repetition just spins the loose bricks on the STM desk for 20 seconds — as soon as you stop, they vanish!"
          },
          {
            id: "mortar",
            label: "🔗 Elaborative Encoding: adding 'How & Why' causal mortar between the bricks and anchoring them to what you already know in LTM.",
            correct: true,
            feedback: "Spot on! Causal 'How/Why' links are the mortar that locks isolated facts into a permanent LTM Arch (Schema)."
          },
          {
            id: "skip_facts",
            label: "Skipping facts completely — you can build an arch out of mortar alone without any bricks.",
            correct: false,
            feedback: "You need BOTH the Fact Bricks ('What') and the Causal Mortar ('How & Why')!"
          }
        ]
      },
      object_spec: {
        type: "unit2_arch_chunk",
        parts: [
          "STM Loose Fact Bricks ('What')",
          "Rote Repetition (Spins in STM)",
          "Causal Mortar ('How/Why' + LTM Anchor)",
          "LTM Locked Arch → 1 STM Chunk"
        ],
        connections: [
          "Fact Bricks in STM require >=3 'Why' Causal Links to cross the Encoding Bridge into an LTM Schema Arch",
          "Once locked in LTM, the 4-brick Arch returns across the retrieval bridge to occupy just 1 STM Chunk slot"
        ],
        dials: {
          dial1: { key: "bricks", label: "🧱 Fact Bricks in STM ('What')", min: 2, max: 5, default: 4, unit: "facts" },
          dial2: { key: "links", label: "🔗 'Why' Causal Links (STM → LTM)", min: 0, max: 4, default: 0, unit: "links" }
        },
        rules: [
          "With <3 'Why' links, facts remain an unlinked pile in STM that collapses under twists and fades in ~20s.",
          "Termination / Boundary Condition: With >=4 Fact Bricks AND >=3 'Why' Links, facts lock into a self-supporting LTM Arch and compress 4 STM slots into 1 Chunk slot."
        ],
        outputs: [
          "LTM Schema Arch Status (Locked Arch vs. Unlinked STM Pile vs. Missing Base Bricks)",
          "Free STM Workbench Slots (3 slots freed when 4 bricks compress into 1 Arch Chunk)"
        ],
        analogy_limits: [
          {
            breaks: "A stone arch is rigid and never changes once built",
            reality:
              "A mental schema in Long-Term Memory is living architecture — when you test it on a 'What-If' exception, it updates and adds new arches."
          },
          {
            breaks: "Building the LTM Arch once today guarantees you can find it next week",
            reality:
              "Encoding into LTM ('Storage Strength') is only half the loop. If you never practice pulling the Arch back across the `LTM ──► STM` bridge ('Retrieval Strength'), the road grows over (Unit 3!)."
          }
        ],
        state_transition_bridge: {
          source_state: "4 Loose Fact Bricks occupying all 4 STM Workbench Slots",
          bridge_condition: "Elaborative encoding via >=3 'How & Why' causal links connecting >=4 foundational facts",
          target_state: "Self-supporting Causal Schema Arch in Long-Term Memory (LTM)",
          return_feedback_loop: "4-part LTM Schema Arch retrieves back onto the STM Workbench as 1 compressed Chunk (freeing 3 STM slots)"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (bricks)", real_mechanism: "Foundational declarative facts ('What' prerequisites)" },
            { control: "dial2 (links)", real_mechanism: "Elaborative interrogation / causal 'How & Why' relational encoding" }
          ],
          adversarial_question: "Could a learner infer that 'Why' links alone work even when Fact Bricks = 2 (missing basic facts)?",
          mitigation: "At Bricks < 4 (even with Links = 4), the simulation explicitly enters 'Missing Base Bricks' state and Step 4 tests this exact boundary."
        },
        boundary_truth_table: {
          min_min: { dials: { bricks: 2, links: 0 }, expected_output: "Missing base facts AND 0 causal links; stays in STM and fades." },
          max_min: { dials: { bricks: 5, links: 0 }, expected_output: "5 unlinked flashcards spin in STM without forming an LTM Arch." },
          min_max: { dials: { bricks: 2, links: 4 }, expected_output: "Missing base facts (only 2 bricks); Arch cannot stand without foundational 'What' pillars." },
          max_max: { dials: { bricks: 5, links: 4 }, expected_output: "Locked LTM Arch formed; compresses into 1 STM Chunk slot, freeing 3 STM slots." },
          zero_edge_case: { dials: { bricks: 4, links: 0 }, expected_output: "4 facts with 0 'Why' links fail to cross the STM → LTM bridge." }
        },
        target_experiment: { dial1: 4, dial2: 0, label: "Set Facts = 4 & 'Why' Links = 0" },
        whatif_experiment: { dial1: 4, dial2: 4, label: "Set Facts = 4 & 'Why' Links = 4" },
        boundary_rule:
          "With 0 'Why' links, facts remain an unlinked pile in STM that collapses and fades in ~20s. With >=3 'Why' links + >=4 facts, they cross into LTM as a Locked Arch and compress into 1 STM Chunk slot!"
      },
      how_why_challenge: {
        instruction:
          "Experiment: Set Fact Bricks = 4 and 'Why' Causal Links = 0 above (memorizing 4 isolated facts by rote), then compare with Links = 4 and answer:",
        part1_how_question:
          "Part 1 (HOW — Prediction): When Fact Bricks = 4 and 'Why' Links = 0, what happens when the STM desk clears or a test twists the question?",
        part1_choices: [
          {
            id: "collapses",
            label: "🏚️ The unlinked pile collapses in STM — no Arch forms in LTM, and the learner can't adapt to a twist",
            correct: true
          },
          {
            id: "locks",
            label: "🏛️ All 4 bricks lock into Long-Term Memory automatically without needing 'Why' links",
            correct: false
          },
          {
            id: "compresses",
            label: "📦 The 4 unlinked bricks compress into 1 slot on their own",
            correct: false
          }
        ],
        part2_why_question:
          "Part 2 (WHY — Mechanism): Why do 'Why' causal links both (1) move the facts into LTM and (2) survive when a problem changes slightly?",
        part2_placeholder:
          "e.g., Because causal links connect how one part drives another and anchor to LTM, letting you derive the answer instead of relying on rote memory...",
        qa_personas: [
          {
            name: "Persona A: Mastery (Links wire facts into an LTM schema so you can derive new outcomes)",
            d1: 4,
            d2: 0,
            how_choice: "collapses",
            why_text:
              "Because causal 'Why' links wire the facts into a connected LTM schema showing how one part drives another, allowing you to derive the new outcome when a detail changes."
          },
          {
            name: "Persona B: Misconception (Collapses + 'Because 4 facts is too small; I need 20 flashcards')",
            d1: 4,
            d2: 0,
            how_choice: "collapses",
            why_text: "Because 4 facts is not enough; memorizing 20 flashcards would make it stand."
          },
          {
            name: "Persona C: Ambiguous (Collapses + 'Because there is no mortar')",
            d1: 4,
            d2: 0,
            how_choice: "collapses",
            why_text: "Because there is no mortar between the bricks."
          }
        ],
        rubric: {
          check_a_prediction: "Predicts that 4 facts with 0 'Why' links remain an unlinked STM pile that collapses under twists.",
          check_b_mechanism: "Explains that causal 'How/Why' links connect how parts drive each other into an LTM schema so new outcomes can be derived.",
          known_misconceptions: [
            {
              tag: "more_rote_flashcards_fix_schema",
              triggers: ["20 flashcards", "more facts", "memorize harder"],
              explanation: "Adding more isolated facts without causal links only increases STM overload rather than building an LTM schema."
            }
          ],
          check_b_keywords: [
            "why",
            "how",
            "cause",
            "causal",
            "connect",
            "link",
            "drive",
            "affect",
            "ltm",
            "schema",
            "derive",
            "anchor",
            "meaning",
            "rule"
          ],
          misconception_keywords: ["20 flashcards", "more facts", "memorize harder"],
          followup_question:
            "You're right that the mortar is missing! In learning terms, what does that 'mortar' represent between isolated facts?",
          targeted_replay:
            "🔁 TARGETED REPLAY ABOVE: Toggle 'Why' Links from 0 to 4 above. Piling up more isolated flashcards just makes a taller shaky stack in STM. Asking 'How & Why' is the mortar that encodes the bricks into a Locked Arch in LTM!"
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF — Unassisted Mastery Proof): Look at what happens to the 4-Slot STM Desk when Facts = 4 and 'Why' Links = 4!",
        scenario:
          "Click '⚡ One-Tap: Set Facts = 4 & Why Links = 4' above. Watch the 4 bricks lock into an LTM Arch on the right — and look at what returns to Slot #1 of the STM Desk on the left ('📦 1 Arch Chunk [4-in-1]').",
        question:
          "How many STM slots does that entire 4-brick Arch occupy when pulled back onto your Working Memory desk — and what happens if you try to build an Arch with only 2 Bricks (missing basic 'What' facts)?",
        options: [
          {
            label:
              "The locked Arch compresses into just 1 STM SLOT (freeing 3 slots for deeper thinking!) — and if basic 'What' bricks are missing (Facts = 2), the Arch still collapses because you can't connect facts you don't know!",
            correct: true,
            feedback:
              "🎉 Independent Mastery Unlocked! That proves both STM ↔ LTM Chunking AND why 'What' facts + 'Why' links need each other."
          },
          {
            label: "It still takes up all 4 STM slots, and you never need basic facts if you know the 'Why'.",
            correct: false,
            feedback: "Check the visual at Facts = 4 / Links = 4 (3 STM slots are freed!), then try Facts = 2 / Links = 4 (missing pillars!)."
          },
          {
            label: "Chunking permanently increases your brain from 4 slots to 20 slots.",
            correct: false,
            feedback: "Your desk still has 4 slots — each slot just holds a much bigger packed LTM Arch ('Chunk')!"
          }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "A stone arch is rigid and never changes once built",
            reality:
              "A mental schema in Long-Term Memory is living architecture — when you test it on a 'What-If' exception, it updates and adds new arches."
          },
          {
            breaks: "Building the LTM Arch once today guarantees you can find it next week",
            reality:
              "Encoding into LTM ('Storage Strength') is only half the loop. If you never practice pulling the Arch back across the `LTM ──► STM` bridge ('Retrieval Strength'), the road grows over (Unit 3!)."
          }
        ],
        next_unit: "Next in Unit 3: Why does rereading your notes bypass the LTM → STM Retrieval Bridge?",
        next_unit_idx: 2,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------------
    // UNIT 3: LEARNING (Fluency Gauges + LTM -> STM Retrieval vs. Rereading Bypass)
    // ------------------------------------------------------------------------
    {
      unit_num: 3,
      topic_id: "cog_unit3_retrieval_bridge",
      short_tab: "Unit 3 · Learning",
      sub_tab: "Fluency vs. LTM Recall",
      title: "Unit 3 (Learning): The Fluency Illusion vs. LTM → STM Retrieval",
      purpose_hook:
        "Why does rereading notes or rewatching a video make you feel 95% ready while leaving your LTM → STM Retrieval Bridge at 20%?",
      lesson_version: "2.3.0",
      rubric_version: "2.3.0",
      objective:
        "Predict next-day performance after open-book rereading vs. closed-book LTM retrieval, and explain the STM screen-bypass illusion.",
      system_model_layer: {
        root_system_id: "stm_bridge_ltm_pipeline",
        layer_focus: "Stage 3: LTM → STM Active Retrieval Bridge vs. External Screen-to-STM Bypass"
      },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the two gauges AND the two arrows feeding the STM Desk in the simulation above:",
        question: "Why does the simulation separate '👀 STM Familiarity Gauge' from '🧠 LTM → STM Retrieval Trail Gauge'?",
        options: [
          {
            id: "same",
            label: "Because if an idea feels smooth and familiar while you're looking at the screen, your LTM retrieval bridge is guaranteed to be strong.",
            correct: false,
            feedback: "That's the #1 trap in studying ('The Illusion of Competence')! Look at where the Rereading arrow comes from."
          },
          {
            id: "bypass",
            label:
              "👀 Rereading feeds STM from the outside screen (boosting STM Familiarity to 95% while leaving the LTM → STM bridge idle); 🧠 Closed-Book Recall pulls the chunk across the LTM → STM bridge.",
            correct: true,
            feedback:
              "Exact right! Having the answer on your STM desk feels the same whether it came from your eyes or from LTM — which is why rereading fools us."
          },
          {
            id: "never_read",
            label: "You should never read or check feedback even after you answer a question.",
            correct: false,
            feedback: "You check feedback right AFTER attempting closed-book recall so you can fix any gaps!"
          }
        ]
      },
      object_spec: {
        type: "unit3_fluency_retrieval",
        parts: [
          "External Screen Arrow (Bypass into STM)",
          "👀 STM Familiarity Gauge (Illusion)",
          "🧠 LTM → STM Bridge & Trail Gauge",
          "Re-encoding Feedback Loop"
        ],
        connections: [
          "Open-book rereading feeds the STM Desk directly from the outside screen, bypassing the LTM → STM bridge",
          "Closed-book recall forces retrieval across the LTM → STM bridge and triggers a Re-encoding Feedback Loop back to LTM"
        ],
        dials: {
          dial1: { key: "rereads", label: "👀 Open-Book Rereads (Screen → STM)", min: 0, max: 5, default: 5, unit: "rereads" },
          dial2: { key: "recalls", label: "🧠 Closed-Book Recalls (LTM → STM)", min: 0, max: 4, default: 0, unit: "recalls" }
        },
        rules: [
          "Each Open-Book Reread adds +18% to STM Familiarity but only +4% to the LTM → STM Retrieval Trail.",
          "Termination / Boundary Condition: Only Closed-Book Recalls (when STM is not fed from the screen) exercise the LTM → STM bridge (+28% per recall) to reach >85% durable retrieval."
        ],
        outputs: [
          "👀 STM Familiarity Gauge (0..98%)",
          "🧠 LTM → STM Retrieval Trail Gauge (0..96%)"
        ],
        analogy_limits: [
          {
            breaks: "Pulling a file from LTM leaves the file unchanged",
            reality:
              "In the brain, every `LTM ──► STM` retrieval makes the memory trace plastic again and re-wires it stronger (**Reconsolidation**)."
          },
          {
            breaks: "Doing 4 closed-book recalls in 2 minutes is the same as spacing them across 4 days",
            reality:
              "If you do 4 recalls back-to-back in 2 minutes, the answer is **still sitting in STM** from Rep #1! That leads directly to Unit 4."
          }
        ],
        state_transition_bridge: {
          source_state: "Encoded Schema Arch inside Long-Term Memory (LTM)",
          bridge_condition: "Closed-book retrieval effort across the LTM → STM bridge (without external screen input)",
          target_state: "Active Working Memory (STM) Reconstruction",
          return_feedback_loop: "Error-checked recall fires a Reconsolidation Feedback Loop that strengthens the LTM trace"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (rereads)", real_mechanism: "Passive perceptual fluency / recognition in Working Memory" },
            { control: "dial2 (recalls)", real_mechanism: "Active cued retrieval / testing effect from Long-Term Memory" }
          ],
          adversarial_question: "Will a beginner think reading the source material the very first time (Rereads = 1) is bad?",
          mitigation: "The target what-if experiment explicitly uses Rereads = 1 + Recalls = 3, showing initial reading is normal when followed by closed-book retrieval."
        },
        boundary_truth_table: {
          min_min: { dials: { rereads: 0, recalls: 0 }, expected_output: "0% Familiarity, 0% Retrieval Trail; LTM → STM bridge idle." },
          max_min: { dials: { rereads: 5, recalls: 0 }, expected_output: "90% STM Familiarity vs. 20% LTM Retrieval Trail (70% Illusion of Competence gap)." },
          min_max: { dials: { rereads: 0, recalls: 4 }, expected_output: "60% Familiarity, 96% LTM Retrieval Trail; strong active bridge." },
          max_max: { dials: { rereads: 5, recalls: 4 }, expected_output: "98% Familiarity, 96% LTM Retrieval Trail; bridge active via recalls." },
          zero_edge_case: { dials: { rereads: 1, recalls: 3 }, expected_output: "63% Familiarity, 88% LTM Retrieval Trail; optimal study ratio." }
        },
        target_experiment: { dial1: 5, dial2: 0, label: "Set Rereads = 5 & Recalls = 0" },
        whatif_experiment: { dial1: 1, dial2: 3, label: "Set Rereads = 1 & Recalls = 3" },
        boundary_rule:
          "Open-Book Rereads load STM from the outside screen (Familiarity hits 95%), but LTM → STM Bridge traffic is 0% (Trail = 20%). Only clearing STM and pulling from LTM builds the Retrieval Trail (>85%)."
      },
      how_why_challenge: {
        instruction: "Experiment: Set Open-Book Rereads = 5 and Closed-Book Recalls = 0 above, then answer Part 1 and Part 2:",
        part1_how_question:
          "Part 1 (HOW — Prediction): Look at the two gauges when Rereads = 5 and Recalls = 0. What happens?",
        part1_choices: [
          {
            id: "illusion",
            label: "🎭 STM Familiarity hits 95% ('I totally get this!'), but the LTM → STM Retrieval Trail stays weak (~20%)",
            correct: true
          },
          {
            id: "both_high",
            label: "🚀 Both STM Familiarity and the LTM → STM Retrieval Trail hit 95%",
            correct: false
          },
          {
            id: "both_low",
            label: "📉 Both gauges stay at 0%",
            correct: false
          }
        ],
        part2_why_question:
          "Part 2 (WHY — Mechanism): Why does rereading 5 times fail to strengthen the LTM → STM Retrieval Bridge even though it feels effortless?",
        part2_placeholder:
          "e.g., Because the answer enters STM directly from your eyes/screen, bypassing the LTM -> STM retrieval pathway...",
        qa_personas: [
          {
            name: "Persona A: Mastery (Screen loads STM from outside, bypassing LTM → STM retrieval bridge)",
            d1: 5,
            d2: 0,
            how_choice: "illusion",
            why_text:
              "Because rereading loads the material into short-term working memory directly from your eyes, creating a feeling of familiarity while completely bypassing the LTM to STM retrieval bridge."
          },
          {
            name: "Persona B: Misconception (Illusion + 'Because I didn't highlight with a yellow marker')",
            d1: 5,
            d2: 0,
            how_choice: "illusion",
            why_text: "Because I didn't highlight the key words with a yellow marker while rereading."
          },
          {
            name: "Persona C: Ambiguous (Illusion + 'Because it is passive')",
            d1: 5,
            d2: 0,
            how_choice: "illusion",
            why_text: "Because rereading is too passive."
          }
        ],
        rubric: {
          check_a_prediction: "Predicts high STM Familiarity (~90-95%) paired with weak LTM → STM Retrieval Trail (~20%).",
          check_b_mechanism: "Explains that rereading feeds Working Memory (STM) directly from the outside screen/eyes, bypassing the LTM → STM retrieval bridge.",
          known_misconceptions: [
            {
              tag: "highlighting_fixes_rereading_bypass",
              triggers: ["highlight", "marker", "color"],
              explanation: "Highlighting while looking at the page still feeds STM from the external page rather than pulling from LTM."
            }
          ],
          check_b_keywords: [
            "bypass",
            "outside",
            "screen",
            "eyes",
            "stm",
            "working memory",
            "desk",
            "pull",
            "retriev",
            "bridge",
            "ltm",
            "long-term",
            "recognition"
          ],
          misconception_keywords: ["highlight", "marker", "color"],
          followup_question:
            "You're right that it's passive! Where is the information entering your STM Desk from when you reread, and which bridge is being skipped?",
          targeted_replay:
            "🔁 TARGETED REPLAY ABOVE: Compare Rereads=5 / Recalls=0 vs. Rereads=1 / Recalls=3 above. When you reread, the outside screen fills STM directly — so the LTM → STM bridge gets ZERO traffic!"
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF — Unassisted Mastery Proof): Test switching your effort to 1 Reread + 3 Closed-Book Recalls:",
        scenario:
          "Click '⚡ One-Tap: Set Rereads = 1 & Recalls = 3' above. Watch the green `LTM ──► STM Retrieval Trail` jump to 88%! Notice the blue return arrow (`Re-encoding Feedback ──► LTM`) that fires after each recall.",
        question:
          "Why does our engine require you to solve a fresh 'What-If' with ZERO hints before granting Independent Mastery (instead of granting mastery right after you watched a hint/replay)?",
        options: [
          {
            label:
              "Because right after a hint or replay, the screen just loaded the answer into your STM! Solving a fresh case with 0 hints proves you pulled the rule from your own LTM.",
            correct: true,
            feedback: "🎉 Independent Mastery Unlocked! You just explained the exact psychometric rule from the Core Engine Spec."
          },
          {
            label: "Hints are bad and should never be shown when someone is stuck.",
            correct: false,
            feedback: "Hints and replays are great for fixing a broken rule ('Supported Practice') — you just have to verify unassisted retrieval right after!"
          },
          {
            label: "Feedback isn't needed after a recall attempt.",
            correct: false,
            feedback: "Immediate gap feedback is essential so any wrong turn is corrected and re-encoded into LTM."
          }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Pulling a file from LTM leaves the file unchanged",
            reality:
              "In the brain, every `LTM ──► STM` retrieval makes the memory trace plastic again and re-wires it stronger (**Reconsolidation**)."
          },
          {
            breaks: "Doing 4 closed-book recalls in 2 minutes is the same as spacing them across 4 days",
            reality:
              "If you do 4 recalls back-to-back in 2 minutes, the answer is **still sitting in STM** from Rep #1! That leads directly to Unit 4."
          }
        ],
        next_unit: "Next in Unit 4: Why does Cramming short-circuit LTM by reading off a still-full STM desk?",
        next_unit_idx: 3,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------------
    // UNIT 4: MASTERY (30-Day Retention Curve + Clearing STM & Sleep Consolidation)
    // ------------------------------------------------------------------------
    {
      unit_num: 4,
      topic_id: "cog_unit4_spaced_curve",
      short_tab: "Unit 4 · Mastery",
      sub_tab: "30-Day Curve & Spacing",
      title: "Unit 4 (Mastery): Why Clearing STM + Sleep Locks In the 30-Day Curve",
      purpose_hook:
        "See why 4 recalls crammed in one night plummet to 22% by Day 30 — while spacing those exact same 4 recalls across 1, 3, and 7 days locks retention above 90%.",
      lesson_version: "2.3.0",
      rubric_version: "2.3.0",
      objective:
        "Predict 30-day LTM retention for crammed vs. spaced retrieval, and explain how lingering STM residue short-circuits LTM reconstruction.",
      system_model_layer: {
        root_system_id: "stm_bridge_ltm_pipeline",
        layer_focus: "Stage 4: Temporal STM Clearing, Sleep Consolidation & Varied Transfer across the STM ↔ LTM Loop"
      },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the 30-Day Retention Curve AND the STM Residue indicator in the simulation above:",
        question:
          "When you quiz yourself on a card and then immediately quiz yourself on the exact same concept 20 seconds later (Gap = 0 days), where does your brain get the answer for Rep #2?",
        options: [
          {
            id: "deep_ltm",
            label: "It does a full, deep reconstruction from permanent Long-Term Memory.",
            correct: false,
            feedback: "Why would the brain search the deep LTM warehouse when the answer is still sitting right on top of the STM desk from 20 seconds ago?"
          },
          {
            id: "stm_residue",
            label:
              "⚡ From STM Residue! Because the answer hasn't left your Working Memory desk yet, Rep #2 just reads it off STM — giving almost 0 exercise to the LTM bridge.",
            correct: true,
            feedback: "Spot on! That is the STM short-circuit that makes cramming feel super fast tonight while collapsing by Day 30."
          },
          {
            id: "photographic",
            label: "Cramming only fails if you study fewer than 8 hours.",
            correct: false,
            feedback: "Even 8 hours of back-to-back repetition in one night suffers rapid decay without spaced sleep consolidation."
          }
        ]
      },
      object_spec: {
        type: "unit4_curve_consolidation",
        parts: [
          "STM Residue Indicator (Full at Gap=0)",
          "30-Day LTM Retention Curve",
          "🌙 Sleep Consolidation (Hippocampus → Cortex)",
          "🔀 What-If Variation Score"
        ],
        connections: [
          "Time gap >= 1 day clears STM Residue completely and enables Sleep Consolidation into the Neocortex",
          "What-If Variation forces active LTM Schema execution rather than surface wording memorization"
        ],
        dials: {
          dial1: { key: "gap_days", label: "🗓️ Gap Between 4 Recalls (0=Cram)", min: 0, max: 7, default: 0, unit: "days" },
          dial2: { key: "variety", label: "🔀 What-If Variation (1=Same, 3=New)", min: 1, max: 3, default: 1, unit: "level" }
        },
        rules: [
          "At Gap = 0d (Cramming), STM still holds the item from Rep #1, short-circuiting LTM retrieval (Day-30 Retention = 22%).",
          "Termination / Boundary Condition: At Gap >= 3d with Variety = 3, STM is 100% cleared, sleep consolidates the trace, and Day-30 Retention & Transfer both exceed 85%."
        ],
        outputs: [
          "Day-30 LTM Retention Percentage (22%..95%)",
          "Unseen What-If Transfer Percentage (18%..96%)"
        ],
        analogy_limits: [
          {
            breaks: "Long-Term Memory is a single static box",
            reality:
              "Neuroscience shows two biological stages: fast initial wiring in the **Hippocampus**, followed by gradual stabilization into the **Neocortex** during deep sleep and spaced reactivation (*Systems Consolidation*)."
          },
          {
            breaks: "Every learner gets the exact same fixed calendar schedule",
            reality:
              "Our engine adapts the gap: if `Check B (Why)` fails on a review, the gap resets to rebuild the LTM Arch before stretching out again."
          }
        ],
        state_transition_bridge: {
          source_state: "Hippocampal LTM Trace + Lingering Working Memory (STM) Residue",
          bridge_condition: "Spaced time interval (>=1–7 days) + Sleep clears STM residue and forces full LTM → STM reconstruction",
          target_state: "Consolidated Neocortical LTM Schema (~90% Day-30 Retention)",
          return_feedback_loop: "Varied What-If transfer challenges generalize the schema across new contexts"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (gap_days)", real_mechanism: "Inter-study spacing interval / synaptic sleep consolidation window" },
            { control: "dial2 (variety)", real_mechanism: "Contextual variability / varied practice for structural transfer" }
          ],
          adversarial_question: "Will a learner think spacing alone (with identical flashcard wording) guarantees 95% real-world transfer?",
          mitigation: "Dial 2 (What-If Variation) explicitly separates Day-30 Retention from What-If Transfer (42% at Variety=1 vs. 94% at Variety=3)."
        },
        boundary_truth_table: {
          min_min: { dials: { gap_days: 0, variety: 1 }, expected_output: "Cramming short-circuit: Day-30 LTM = 22%, What-If Transfer = 18%." },
          max_min: { dials: { gap_days: 7, variety: 1 }, expected_output: "Spaced rote wording: Day-30 LTM = 82%, but What-If Transfer lags at 60%." },
          min_max: { dials: { gap_days: 0, variety: 3 }, expected_output: "Varied cramming in 1 night: Day-30 LTM still decays to 36% without sleep spacing." },
          max_max: { dials: { gap_days: 7, variety: 3 }, expected_output: "Spaced + Varied mastery: Day-30 LTM = 95%, What-If Transfer = 96%." },
          zero_edge_case: { dials: { gap_days: 4, variety: 3 }, expected_output: "Day-30 LTM = 90%, What-If Transfer = 90%." }
        },
        target_experiment: { dial1: 0, dial2: 1, label: "Set Gap = 0d (Cramming)" },
        whatif_experiment: { dial1: 4, dial2: 3, label: "Set Gap = 4d & Variety = 3" },
        boundary_rule:
          "At Gap = 0d (Cramming), STM still holds the item from Rep #1, short-circuiting LTM retrieval (Day-30 Retention = 22%). At Gap >= 3d, STM is 100% cleared and sleep consolidates the trace into the neocortex (Day-30 Retention ~90%)."
      },
      how_why_challenge: {
        instruction:
          "Experiment: Compare Gap = 0 days (4 sessions crammed in one night) vs. Gap = 4 days on the 30-Day Retention Curve above, then answer Part 1 and Part 2:",
        part1_how_question:
          "Part 1 (HOW — Prediction): When all 4 recall sessions are crammed on Day 0 (Gap = 0d), what happens to the 30-Day Retention Curve?",
        part1_choices: [
          {
            id: "plummets",
            label: "📉 It starts high tonight, then plummets along the red dashed curve to ~22% by Day 30",
            correct: true
          },
          {
            id: "stays_high",
            label: "📈 It stays flat at 95% through Day 30 because you completed 4 sessions",
            correct: false
          },
          {
            id: "zero_day1",
            label: "🚫 It drops to 0% within 5 minutes",
            correct: false
          }
        ],
        part2_why_question:
          "Part 2 (WHY — Mechanism): Explain why waiting 1, 3, and 7 days between your 4 sessions changes the curve so dramatically compared to doing all 4 tonight:",
        part2_placeholder:
          "e.g., Because waiting clears the STM desk completely and allows sleep consolidation, forcing the brain to reconstruct the schema from LTM...",
        qa_personas: [
          {
            name: "Persona A: Mastery (Waiting clears STM residue so brain must reconstruct from LTM + sleep consolidates)",
            d1: 0,
            d2: 1,
            how_choice: "plummets",
            why_text:
              "Because back-to-back reps just read the answer while it is still sitting in short-term working memory; waiting across days clears STM and lets sleep consolidate LTM, forcing deep reconstruction across the LTM bridge."
          },
          {
            name: "Persona B: Misconception (Plummets + 'Because studying at night hurts your eyes')",
            d1: 0,
            d2: 1,
            how_choice: "plummets",
            why_text: "Because studying late at night tires out your eyes."
          },
          {
            name: "Persona C: Ambiguous (Plummets + 'Because spacing gives you a rest')",
            d1: 0,
            d2: 1,
            how_choice: "plummets",
            why_text: "Because spacing gives your brain a rest."
          }
        ],
        rubric: {
          check_a_prediction: "Predicts that cramming all 4 sessions at Gap=0d plummets to ~22% retention by Day 30.",
          check_b_mechanism: "Explains that waiting across days clears lingering STM residue and allows sleep consolidation, forcing full reconstruction from LTM.",
          known_misconceptions: [
            {
              tag: "eye_strain_time_of_day",
              triggers: ["eyes", "time of day"],
              explanation: "Cramming fails due to STM residue short-circuiting LTM retrieval and lack of multi-night sleep consolidation, not eye strain."
            }
          ],
          check_b_keywords: [
            "stm",
            "short-term",
            "working memory",
            "desk",
            "still sitting",
            "residue",
            "clear",
            "empty",
            "reconstruct",
            "pull from ltm",
            "sleep",
            "consolidat",
            "forget"
          ],
          misconception_keywords: ["eyes", "time of day"],
          followup_question:
            "You're right that the time gap matters! Specifically, what needs to empty out during that gap so the next review isn't just reading off Short-Term Memory?",
          targeted_replay:
            "🔁 TARGETED REPLAY ABOVE: Drag Gap from 0d to 4d above. At Gap = 0d, the badge reads '⚡ STM RESIDUE SHORT-CIRCUIT'. At Gap = 4d, STM is 100% cleared and sleep transfers the trace from Hippocampus to Cortex, lifting the green Day-30 curve to 90%!"
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF — Unassisted Mastery Proof): Now test 'What-If' Variation (Dial 2) during spaced reviews!",
        scenario:
          "Click '⚡ One-Tap: Set Gap = 4d & Variety = 3' above. Both learners space their reviews across 1, 3, and 7 days (so STM is cleared). Learner A reviews the exact same flashcard wording every time (Variety = 1). Learner B solves a fresh 'What-If' scenario each review (Variety = 3).",
        question:
          "Look at the Transfer Score on the chart when Variety = 1 (42%) vs. Variety = 3 (94%). Why must spaced reviews vary the question instead of repeating identical wording?",
        options: [
          {
            label:
              "Because identical wording lets you memorize the surface sentence without testing the underlying LTM Arch — whereas 'What-If' variation forces you to run the mental model on new cases!",
            correct: true,
            feedback:
              "🎉 ALL 4 UNITS MASTERED! Now open Unit 5 ('Fix Sam') to consolidate all 4 units together!"
          },
          {
            label: "Changing the question wording confuses Long-Term Memory and ruins retention.",
            correct: false,
            feedback: "Look at the chart when Variety = 3: varied retrieval boosts both retention AND real-world transfer!"
          },
          {
            label: "Variation makes no difference once you space your reviews.",
            correct: false,
            feedback: "Compare Transfer at Variety = 1 (42%) vs. Variety = 3 (94%) above!"
          }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Long-Term Memory is a single static box",
            reality:
              "Neuroscience shows two biological stages: fast initial wiring in the **Hippocampus**, followed by gradual stabilization into the **Neocortex** during deep sleep and spaced reactivation (*Systems Consolidation*)."
          },
          {
            breaks: "Every learner gets the exact same fixed calendar schedule",
            reality:
              "Our engine adapts the gap: if `Check B (Why)` fails on a review, the gap resets to rebuild the LTM Arch before stretching out again."
          }
        ],
        next_unit: "🏆 Ready for the Capstone: Unit 5 · Fix Sam!",
        next_unit_idx: 4,
        next_review: "10 mins (Backwards Review: Unit 4 → 3 → 2 → 1), then Day 1, Day 3, Day 7."
      }
    },

    // ------------------------------------------------------------------------
    // UNIT 5: UNIFIED MASTERY RECAP (Backwards Chain + Full-System Sandbox + Scorecard)
    // ------------------------------------------------------------------------
    {
      unit_num: 5,
      topic_id: "cog_unit5_unified_recap",
      short_tab: "Unit 5 · Fix Sam",
      sub_tab: "Consolidate Units 1–4",
      title: "Fix Sam: Rebuilding the Complete STM ↔ LTM Pipeline",
      purpose_hook:
        "Fuse all 4 units into 1 Master Schema by walking the chain backwards and fixing Sam's broken study system.",
      lesson_version: "2.3.0",
      rubric_version: "2.3.0",
      objective:
        "Trace the backwards causal chain (Unit 4 → 3 → 2 → 1) and diagnose all 4 failure points in a learner's STM ↔ LTM pipeline.",
      system_model_layer: {
        root_system_id: "stm_bridge_ltm_pipeline",
        layer_focus: "Full-System Consolidation: U4 Spaced Curve ◄── U3 LTM Recall ◄── U2 'Why' Arch Chunk ◄── U1 4-Slot STM Desk"
      },
      what_gate: {
        prompt:
          "Part 1 (BACKWARDS CHAIN RECALL — Horsley's Rule): Walk the 4-unit chain backwards from Day-30 Mastery (Unit 4) back to the 4-Slot Desk (Unit 1):",
        question: "Which backwards chain accurately links Unit 4 ◄── Unit 3 ◄── Unit 2 ◄── Unit 1?",
        options: [
          {
            id: "wrong1",
            label:
              "Day-30 retention (U4) comes from rereading (U3), which comes from rote repetition (U2), which comes from multitasking (U1).",
            correct: false,
            feedback: "That's the chain of study illusions! Pick the chain that builds real LTM schemas."
          },
          {
            id: "correct_chain",
            label:
              "🔗 Spaced Day-30 retention requires clearing STM (U4) ◄── to force LTM → STM Retrieval (U3) ◄── of a 'Why'-linked LTM Arch Chunk (U2) ◄── built on an undistracted 4-Slot STM Workbench (U1).",
            correct: true,
            feedback: "Spot on! You just chained all 4 units backwards into one unified cause-and-effect system."
          },
          {
            id: "wrong2",
            label: "Each unit is an isolated study tip that has no connection to the others.",
            correct: false,
            feedback: "All 4 units are stages of the exact same STM ↔ Bridge ↔ LTM pipeline!"
          }
        ]
      },
      object_spec: {
        type: "unit5_master_recap",
        parts: [
          "U1: 4-Slot STM Focus",
          "U2: STM→LTM 'Why' Arch Chunk",
          "U3: LTM→STM Recall",
          "U4: Spaced 30-Day Curve"
        ],
        connections: [
          "U1 Undistracted STM Desk feeds U2 'Why' Arch Encoding",
          "U3 Closed-Book LTM→STM Recall and U4 Spaced STM-Clearing lock in >85% Day-30 Transfer"
        ],
        dials: {
          dial1: { key: "bad_habits", label: "⚠️ Sam's Traps (Pings + Rereads + Cram)", min: 0, max: 5, default: 4, unit: "traps" },
          dial2: { key: "deep_habits", label: "🧠 Deep Engine Habits ('Why' + Spaced Recall)", min: 0, max: 5, default: 1, unit: "habits" }
        },
        rules: [
          "Each study trap (Phone Pings, Rote Loops, Reread Bypass, Cramming) breaks its corresponding stage in the STM ↔ LTM pipeline.",
          "Termination / Boundary Condition: Full-system Day-30 Transfer exceeds 85% only when Traps <= 1 AND Deep Engine Habits >= 4."
        ],
        outputs: [
          "4-Stage Pipeline Diagnostic Status (U1, U2, U3, U4 Green vs. Red)",
          "Full-System Day-30 Transfer Score (12%..96%)"
        ],
        analogy_limits: [
          {
            breaks: "4-Question Mastery Scorecard: [ WHAT: 100% ] [ HOW: 100% ] [ WHY: 100% ] [ WHAT-IF: 100% ]",
            reality:
              "All 4 cognitive layers verified across the STM ↔ Bridge ↔ LTM architecture. You have fused 4 units into 1 Master Schema Chunk!"
          },
          {
            breaks: "Your Personal 1-Line Rule for Tomorrow's Review",
            reality:
              "'Never confuse full Short-Term Memory (rereading/cramming) with a strong Long-Term Bridge (linking Why + spaced recall from an empty desk).'"
          }
        ],
        state_transition_bridge: {
          source_state: "4 Separate Unit Schemas (U1 Focus, U2 Arch, U3 Retrieval, U4 Spacing)",
          bridge_condition: "Backwards Chain Recall + Full-System Diagnostic Troubleshooting (Traps=0, Deep=5)",
          target_state: "1 Unified Master Schema Chunk in Long-Term Memory (>85% Day-30 Transfer)",
          return_feedback_loop: "Learner's 1-Line Personal Rule anchors tomorrow's Day-1 Spaced Transfer review"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (bad_habits)", real_mechanism: "Aggregate extraneous load + passive fluency illusions (pings, rereading, massed cramming)" },
            { control: "dial2 (deep_habits)", real_mechanism: "Aggregate generative encoding + spaced varied retrieval practice" }
          ],
          adversarial_question: "Could a learner think adding deep habits works without removing phone pings and cramming traps?",
          mitigation: "At Traps = 5 and Deep = 5, the diagnostic dashboard stays broken (Transfer = 60% < 85% threshold) until Traps are reduced."
        },
        boundary_truth_table: {
          min_min: { dials: { bad_habits: 0, deep_habits: 0 }, expected_output: "No traps, but 0 active encoding/retrieval; Day-30 Transfer = 25%." },
          max_min: { dials: { bad_habits: 5, deep_habits: 0 }, expected_output: "All 4 pipeline stages broken; Day-30 Transfer = 12%." },
          min_max: { dials: { bad_habits: 0, deep_habits: 5 }, expected_output: "All 4 stages green; Master Schema Consolidated at 96% Day-30 Transfer." },
          max_max: { dials: { bad_habits: 5, deep_habits: 5 }, expected_output: "Traps still sabotage STM and spacing; Pipeline broken at 60% Transfer." },
          zero_edge_case: { dials: { bad_habits: 4, deep_habits: 1 }, expected_output: "Sam's baseline broken state: 16% Day-30 Transfer." }
        },
        target_experiment: { dial1: 0, dial2: 5, label: "Fix Sam's System (Traps=0, Deep=5)" },
        whatif_experiment: { dial1: 0, dial2: 5, label: "Optimal System (Traps=0, Deep=5)" },
        boundary_rule:
          "Full-system Day-30 Transfer exceeds 85% only when STM overload/rereading/cramming traps are removed AND 'Why' encoding + spaced closed-book retrieval are active together."
      },
      how_why_challenge: {
        instruction:
          "Part 2 (FULL-SYSTEM DIAGNOSTIC SANDBOX): Meet Sam. Sam watched a lecture with his phone buzzing (U1), repeated definitions by rote (U2), reread his notes 4 times (U3), and crammed at midnight (U4). Click '⚡ One-Tap: Fix Sam's System (Traps=0, Deep=5)' above, then answer:",
        part1_how_question:
          "Part 1 (HOW — Full-System Prediction): When you switch Sam from Traps=4 / Deep=1 to Traps=0 / Deep=5, what happens across all 4 stages above?",
        part1_choices: [
          {
            id: "jumps",
            label: "🚀 All 4 stages turn green and Day-30 Transfer jumps from 16% to 95%",
            correct: true
          },
          {
            id: "same",
            label: "⚖️ Transfer stays at 16% because Sam spent fewer hours rereading",
            correct: false
          },
          {
            id: "drops",
            label: "📉 Transfer drops because closed-book recall feels harder than rereading",
            correct: false
          }
        ],
        part2_why_question:
          "Part 2 (WHY — 1-Sentence Master Rule): In your own words, explain how STM and LTM work together when all 4 units are aligned:",
        part2_placeholder:
          "e.g., Focused STM lets you link 'Why' into an LTM Arch Chunk, and spaced closed-book recall reconstructs it from LTM after STM clears...",
        qa_personas: [
          {
            name: "Persona A: Full Synthesis (Focused STM -> 'Why' encoding into LTM chunk -> spaced recall after STM clears)",
            d1: 0,
            d2: 5,
            how_choice: "jumps",
            why_text:
              "Protecting the 4-slot STM desk lets you link 'Why' across the encoding bridge into an LTM chunk, and spaced recall pulls it back from LTM after STM clears."
          },
          {
            name: "Persona B: Partial Misconception ('Just turn off the phone')",
            d1: 0,
            d2: 5,
            how_choice: "jumps",
            why_text: "Because turning off the phone automatically puts everything into Long-Term Memory without needing recall."
          }
        ],
        rubric: {
          check_a_prediction: "Predicts that removing traps (0) and activating deep habits (5) turns all 4 stages green and lifts Day-30 Transfer to ~95-96%.",
          check_b_mechanism: "Synthesizes the STM ↔ LTM loop: undistracted STM enables 'Why' encoding into an LTM chunk, and spaced recall reconstructs it from LTM.",
          known_misconceptions: [
            {
              tag: "focus_alone_auto_encodes_ltm",
              triggers: ["automatically puts", "without needing recall"],
              explanation: "Removing phone distractions protects STM slots, but you still need causal 'Why' encoding and spaced retrieval to wire LTM."
            }
          ],
          check_b_keywords: [
            "stm",
            "ltm",
            "bridge",
            "encode",
            "why",
            "chunk",
            "arch",
            "retriev",
            "recall",
            "space",
            "clear",
            "pull"
          ],
          misconception_keywords: ["automatically puts", "without needing recall"],
          followup_question:
            "Good start! After protecting the 4-slot STM desk, what builds the Arch in LTM, and what strengthens the bridge back out?",
          targeted_replay:
            "🔁 FULL-SYSTEM REPLAY ABOVE: Watch all 4 panels light up green when Traps=0 & Deep=5: (U1) Undistracted 4-Slot STM → (U2) 'Why' Mortar into 1 LTM Arch Chunk → (U3) Closed-Book Recall → (U4) Spaced Reconsolidation!"
        }
      },
      what_if_proof: {
        prompt: "Part 3 (FINAL SYNTHESIS CHECK): Diagnose one subtle break in the 4-unit pipeline:",
        scenario:
          "Suppose Sam fixes Units 1, 2, and 3 (0 phone pings, builds a 'Why' LTM Arch, and does 4 closed-book recalls) — EXCEPT he does all 4 closed-book recalls within 2 minutes on the same night, and never reviews again.",
        question: "Which specific unit in Sam's STM ↔ LTM pipeline still short-circuits, and why?",
        options: [
          {
            label:
              "Unit 4 short-circuits: because STM wasn't cleared between the 4 recalls (and there was no sleep/spaced consolidation), Reps #2–#4 just read off STM residue!",
            correct: true,
            feedback: "🏆 MASTER SCHEMA VERIFIED! You diagnosed the exact stage where the STM ↔ LTM pipeline short-circuited."
          },
          {
            label: "Unit 1 breaks: his 4-slot desk overflowed with notifications.",
            correct: false,
            feedback: "His desk had 0 notifications — the problem was that the answer stayed sitting in STM between back-to-back reps!"
          }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "4-Question Mastery Scorecard: [ WHAT: 100% ] [ HOW: 100% ] [ WHY: 100% ] [ WHAT-IF: 100% ]",
            reality:
              "All 4 cognitive layers verified across the STM ↔ Bridge ↔ LTM architecture. You have fused 4 units into 1 Master Schema Chunk!"
          },
          {
            breaks: "Your Personal 1-Line Rule for Tomorrow's Review",
            reality:
              "'Never confuse full Short-Term Memory (rereading/cramming) with a strong Long-Term Bridge (linking Why + spaced recall from an empty desk).'"
          }
        ],
        next_unit: "🎉 Entire 4-Unit Course & Unified Mastery Recap Complete!",
        next_unit_idx: 0,
        next_review: "Scheduled: 10-min Backwards Check ✓ → Day 1 Transfer Check → Day 3 → Day 7."
      }
    }
  ],

  // ==========================================================================
  // RECAP & WHAT'S NEXT (Unified Lesson Flow steps 4 and 5)
  // ==========================================================================
  recap: {
    backwards_question: "Walk it backwards: from 3 · Understanding back to 1 · Thinking, which chain is right?",
    backwards_options: [
      {
        label:
          "🔄 Adapting to new twists (Understanding) ◄── requires feedback-calibrated skill in LTM (Learning) ◄── which starts with mental \"what-if\" simulation (Thinking).",
        correct: true
      },
      { label: "🔄 Each concept is an isolated study tip that works without the earlier steps.", correct: false }
    ],
    hook_placeholder: "Write your 1-sentence takeaway for tomorrow's spaced review..."
  },

  apply: {
    placeholder: "What are you about to learn or work on? (e.g. Spanish verbs, a work report)",
    steps: [
      { label: "Thinking", text: "Before you start, spend 2 minutes picturing how it could go, and what could go wrong." },
      { label: "4-Slot Focus", text: "Phone in another room. Work on no more than 4 new ideas at a time." },
      { label: "Understanding", text: "For each new fact, ask \"why?\" and link it to something you already know." },
      { label: "Learning", text: "Close the book and explain it from memory. Check what you missed, fix it, try again." },
      { label: "Spacing", text: "Recall it again tomorrow, in 3 days and in a week, without rereading first." }
    ]
  }
};
