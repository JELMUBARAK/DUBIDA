/**
 * Topic Pack (FACT · Biology): How the Heart Pumps Blood
 * One root system across all units: the heart as a double pump in a double loop.
 * Unit 1 zooms into one side (chambers + one-way valves), Unit 2 places the two sides
 * side by side (right → lungs, left → body), Unit 3 runs the whole double loop per minute.
 */

const ROOT = "heart_double_pump";

export const HEART_PUMP_PACK = {
  topic_pack_id: "heart_pump_v1",
  title: "How the Heart Pumps Blood",
  kind: "fact",
  subtitle: "Fact · 3 mysteries · 3 units",
  search_keywords: ["heart", "blood", "pump", "circulation", "valve", "pulse", "heartbeat", "cardio"],
  version: "1.0.0",
  system_model: {
    root_system_id: ROOT,
    name: "The Heart: A Double Pump in a Double Loop",
    description:
      "Two muscular pumps side by side. Each squeezes blood forward through one-way valves; the right side sends it through the lungs, the left side sends it round the body, and it all comes back to start again."
  },

  // ==========================================================================
  // DISCOVERY CARDS
  // ==========================================================================
  discovery_cards: [
    {
      id: "heart_card_0_valve",
      card_index: 0,
      mystery_label: "1 · Mystery A",
      solved_label: "1 · One-Way Valve ✓",
      earned_reveal: "That's a One-Way Valve.",
      header_eyebrow: "Mystery 1 of 3 · Play Both Scenes",
      header_prompt: "Push both ways. Notice what gets through.",
      scenes: [
        {
          id: "catflap",
          title: "🐈 Cat Flap",
          status_default: "Flap: closed",
          micro_copy: "Push the flap from inside, then from outside.",
          toy: {
            visual: "heart_catflap",
            options: [
              { label: "➡️ Push from inside", result: "The flap swings open: the cat gets out.", tone: "ok" },
              { label: "⬅️ Push from outside", result: "The flap stays shut: nothing gets back in.", tone: "warn" }
            ]
          }
        },
        {
          id: "bikepump",
          title: "🚲 Bike Tyre Valve",
          status_default: "Tyre: soft",
          micro_copy: "Pump air in, then lift the pump. Does air escape?",
          toy: {
            visual: "heart_bikepump",
            options: [
              { label: "⬇️ Push the pump", result: "Air goes into the tyre.", tone: "ok" },
              { label: "⬆️ Lift the pump", result: "The valve shuts: no air rushes back out.", tone: "warn" }
            ]
          }
        }
      ],
      pattern_question: "A cat flap and a tyre valve. What did both of them do?",
      options: [
        { id: "right", label: "Let things through one way, and shut to block the way back", correct: true },
        {
          id: "wrong",
          label: "Pushed the cat and the air along harder",
          correct: false,
          feedback: "Neither one pushed anything. You did the pushing; they only decided which way it could go."
        }
      ],
      reveal_simple: "A flap that opens for flow going forward and snaps shut if it tries to go back.",
      reveal_deep:
        "The heart has four valves (tricuspid, pulmonary, mitral, aortic). Forward pressure pushes each one open; backward pressure slams it shut, so blood can only move one way.",
      under_the_hood: {
        tag: "🫀 UNDER THE HOOD · HEART VALVES",
        flow: "Atrium ──► (valve opens) ──► Ventricle ──► (valve opens) ──► Artery",
        note: "The 'lub-dub' sound of a heartbeat is the valves snapping shut."
      }
    },
    {
      id: "heart_card_1_pump",
      card_index: 1,
      mystery_label: "2 · Mystery B",
      solved_label: "2 · Pump ✓",
      earned_reveal: "That's a Pump.",
      header_eyebrow: "Mystery 2 of 3 · Play Both Scenes",
      header_prompt: "Squeeze, then let go. Watch the liquid.",
      scenes: [
        {
          id: "soap",
          title: "🧴 Soap Dispenser",
          status_default: "Chamber: full",
          micro_copy: "Press the top down, then let it spring back.",
          toy: {
            visual: "heart_soap",
            options: [
              { label: "⬇️ Press down", result: "The chamber squeezes: soap squirts out.", tone: "ok" },
              { label: "⬆️ Let go", result: "The chamber springs back and refills from the bottle.", tone: "ok" }
            ]
          }
        },
        {
          id: "bottle",
          title: "💧 Squeeze Bottle",
          status_default: "Bottle: relaxed",
          micro_copy: "Squeeze the bottle, then relax your grip.",
          toy: {
            visual: "heart_bottle",
            options: [
              { label: "✊ Squeeze", result: "The space shrinks: water shoots out.", tone: "ok" },
              { label: "🖐️ Relax", result: "The space grows back: it sucks in to refill.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "Soap and water. What moved the liquid in both?",
      options: [
        {
          id: "wrong",
          label: "The liquid flowed by itself because it's runny",
          correct: false,
          feedback: "Nothing came out until you squeezed. The liquid didn't move on its own."
        },
        { id: "right", label: "Squeezing a chamber smaller pushed liquid out; relaxing let it refill", correct: true }
      ],
      reveal_simple: "A chamber that squeezes to push liquid out, then relaxes to fill up again.",
      reveal_deep:
        "Each heart chamber is a muscle pump: contraction (systole) squeezes blood out; relaxation (diastole) lets the chamber refill before the next beat.",
      under_the_hood: {
        tag: "🫀 UNDER THE HOOD · SQUEEZE & REFILL",
        flow: "Relax (diastole): chamber fills ──► Squeeze (systole): chamber empties ──► repeat",
        note: "At rest, an adult heart repeats this roughly 60 to 100 times a minute."
      }
    },
    {
      id: "heart_card_2_double_loop",
      card_index: 2,
      mystery_label: "3 · Mystery C",
      solved_label: "3 · Double Loop ✓",
      earned_reveal: "That's a Double Loop.",
      header_eyebrow: "Mystery 3 of 3 · Play Both Scenes",
      header_prompt: "Ride both routes. Notice where every trip starts and ends.",
      scenes: [
        {
          id: "trains",
          title: "🚆 Two Train Lines",
          status_default: "Hub: Central Station",
          micro_copy: "Ride the short line, then the long line.",
          toy: {
            visual: "heart_trains",
            options: [
              { label: "🟢 Short line", result: "Central → Airport → back to Central.", tone: "ok" },
              { label: "🔵 Long line", result: "Central → all round the city → back to Central.", tone: "ok" }
            ]
          }
        },
        {
          id: "van",
          title: "🚚 Delivery Van",
          status_default: "Base: the depot",
          micro_copy: "Restock at the warehouse, then deliver around town.",
          toy: {
            visual: "heart_van",
            options: [
              { label: "📦 Warehouse run", result: "Depot → warehouse → back to the depot, fully loaded.", tone: "ok" },
              { label: "🏘️ Town run", result: "Depot → every street → back to the depot, empty.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "Trains and a van. What shape did the journeys make?",
      options: [
        { id: "right", label: "Two separate loops that both start and end at one central hub", correct: true },
        {
          id: "wrong",
          label: "One long straight line from start to finish",
          correct: false,
          feedback: "Every trip came back to where it started, and there were two different routes."
        }
      ],
      reveal_simple: "Two round trips sharing one hub: a short one and a long one.",
      reveal_deep:
        "Blood makes two circuits through the heart: the short pulmonary loop (heart → lungs → heart) picks up oxygen; the long systemic loop (heart → body → heart) delivers it.",
      under_the_hood: {
        tag: "🫀 UNDER THE HOOD · TWO CIRCUITS",
        flow: "Right heart ──► lungs ──► left heart ──► body ──► right heart",
        note: "On one full lap, a drop of blood passes through the heart twice."
      }
    }
  ],

  loop: {
    headline: "One Heart: Valves → Pumps → Double Loop",
    steps: [
      { label: "1 · Valves", title: "Keep it one-way", text: "Flaps open forward and snap shut backward." },
      { label: "2 · Pumps", title: "Squeeze & refill", text: "Right side to the lungs, left side to the body, in step." },
      { label: "3 · Double loop", title: "Lungs, then body", text: "Every minute the whole blood supply goes round both loops." }
    ],
    check: {
      question: "Rosa's heart beats at a normal speed, but a doctor finds one of her valves doesn't close properly. She gets tired on the stairs. What's going wrong?",
      options: [
        {
          label: "Some blood leaks back with each squeeze, so less reaches her body",
          correct: true,
          feedback: "Spot on. The pump still squeezes, but a leaky valve lets part of every beat slip backwards, so her muscles get less blood."
        },
        {
          label: "Her heart has to beat slower to let the valve close",
          correct: false,
          feedback: "Her heart rate is normal. The problem is which way the blood goes, not how fast the heart beats."
        },
        {
          label: "Her lungs aren't making enough blood",
          correct: false,
          feedback: "Lungs don't make blood. They add oxygen to it. Think about what a valve is for."
        }
      ]
    }
  },

  // ==========================================================================
  // UNITS
  // ==========================================================================
  units: [
    // ------------------------------------------------------------------ Unit 1
    {
      unit_num: 1,
      topic_id: "heart_unit1_valves",
      short_tab: "Unit 1 · Valves",
      sub_tab: "Chambers & One-Way Valves",
      title: "Unit 1 (Valves): Squeeze Forward, Never Back",
      purpose_hook: "Ever heard of a 'heart murmur'? It's often the sound of a valve that doesn't close properly.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict what happens to blood flow when a heart valve leaks, and explain why valves keep blood moving one way.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 1: one side of the heart (atrium → valve → ventricle → valve → artery)" },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the chambers and valves in the diagram above.",
        question: "What does a heart valve do?",
        options: [
          {
            id: "squeeze",
            label: "It squeezes the blood forward",
            correct: false,
            feedback: "The muscle walls of the chambers do the squeezing. The valve is a flap that decides the direction."
          },
          {
            id: "oneway",
            label: "It opens to let blood through one way, and shuts to stop it going back",
            correct: true,
            feedback: "Yes. A valve is a one-way door: forward pressure opens it, backward pressure shuts it."
          },
          {
            id: "colour",
            label: "It adds oxygen to the blood",
            correct: false,
            feedback: "Oxygen is picked up in the lungs (Unit 3). The valve only controls direction."
          }
        ]
      },
      object_spec: {
        type: "heart_pump",
        layer: "valves",
        parts: ["Atrium (upper chamber)", "Valve into the ventricle", "Ventricle (lower pumping chamber)", "Valve into the artery", "Artery"],
        connections: [
          "Blood waits in the atrium, then passes through a valve into the ventricle",
          "The ventricle squeezes and pushes blood through a second valve into the artery",
          "When the ventricle squeezes, the first valve must shut or blood leaks back up"
        ],
        dials: {
          dial1: { key: "valve_seal", label: "🚪 Valve seal (0 leaky · 2 healthy)", min: 0, max: 2, default: 2, unit: "" },
          dial2: { key: "squeeze", label: "💪 Squeeze strength", min: 1, max: 3, default: 2, unit: "" }
        },
        rules: [
          "Each squeeze pushes a set amount of blood (40, 55 or 70 mL in this model).",
          "A healthy valve (seal 2) sends all of it forward; a partly leaky valve (1) lets about 20% flow back; a very leaky valve (0) lets about 40% flow back.",
          "Boundary condition: a leak reduces forward flow but never reverses all of it."
        ],
        outputs: ["Blood pushed forward per beat (mL)", "Blood leaking backward per beat (mL)"],
        analogy_limits: [
          {
            breaks: "The leak is exactly 20% or 40%",
            reality: "Real valve leaks (**regurgitation**) range from tiny to severe; the percentages here are illustrative, not measurements."
          },
          {
            breaks: "There is just one side with two valves",
            reality: "The heart has **four valves**: two on the right side and two on the left (Unit 2)."
          }
        ],
        state_transition_bridge: {
          source_state: "Blood waiting in the atrium (upper chamber)",
          bridge_condition: "The valve opens while the atrium's pressure is higher, and must shut when the ventricle squeezes",
          target_state: "Blood pushed out of the ventricle into the artery",
          return_feedback_loop: "Unit 2 puts two of these pumps side by side, one for the lungs and one for the body"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (valve_seal)", real_mechanism: "How well the valve closes (valve competence vs. regurgitation)" },
            { control: "dial2 (squeeze)", real_mechanism: "Strength of the ventricle's contraction (amount ejected per beat)" }
          ],
          adversarial_question: "If a learner takes the squeeze dial literally, will they think squeezing harder fixes a leaky valve?",
          mitigation: "The diagram shows the backward leak growing with the squeeze too, and the rubric flags 'squeeze harder fixes it' as a misconception."
        },
        boundary_truth_table: {
          min_min: { dials: { valve_seal: 0, squeeze: 1 }, expected_output: "Very leaky, gentle squeeze: 24 mL forward, 16 mL leaks back." },
          max_min: { dials: { valve_seal: 2, squeeze: 1 }, expected_output: "Healthy valve, gentle squeeze: 40 mL forward, 0 back." },
          min_max: { dials: { valve_seal: 0, squeeze: 3 }, expected_output: "Very leaky, strong squeeze: 42 mL forward, 28 mL leaks back." },
          max_max: { dials: { valve_seal: 2, squeeze: 3 }, expected_output: "Healthy valve, strong squeeze: 70 mL forward, 0 back." },
          zero_edge_case: {
            dials: { valve_seal: 0, squeeze: 2 },
            expected_output: "Seal 0 is the worst leak here: 33 mL still goes forward, 22 mL leaks back. A leak lowers flow, it never stops it."
          }
        },
        target_experiment: { dial1: 0, dial2: 3, label: "Set Valve seal = 0 & Squeeze = 3" },
        whatif_experiment: { dial1: 2, dial2: 1, label: "Set Valve seal = 2 & Squeeze = 1" },
        boundary_rule: "Forward = squeeze amount × (100%, 80% or 60% for seal 2, 1, 0); the rest leaks back."
      },
      how_why_challenge: {
        instruction: "Experiment: set Valve seal = 0 and Squeeze = 3 (or tap the one-tap button), then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): With a leaky valve and a strong squeeze, what happens to the blood?",
        part1_choices: [
          { id: "more", label: "More goes forward, because the squeeze is strong", correct: false },
          { id: "leaks", label: "Some leaks backward, so less goes forward than it should", correct: true },
          { id: "stops", label: "No blood moves at all", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why does that happen?",
        part2_placeholder: "e.g., Because when the chamber squeezes, the valve…",
        qa_personas: [
          {
            name: "Persona A: Mastery (valve can't shut, blood leaks back)",
            d1: 0,
            d2: 3,
            how_choice: "leaks",
            why_text: "Because the valve can't shut properly, so when the chamber squeezes some blood leaks back the wrong way instead of going forward."
          },
          {
            name: "Persona B: Misconception (a harder squeeze fixes the leak)",
            d1: 0,
            d2: 3,
            how_choice: "leaks",
            why_text: "Because if you squeeze harder it fixes the leak."
          },
          {
            name: "Persona C: Ambiguous ('something is broken')",
            d1: 0,
            d2: 3,
            how_choice: "leaks",
            why_text: "Because something is broken."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 'some leaks backward, so less goes forward'.",
          check_b_mechanism: "Explains that the valve fails to shut when the chamber squeezes, so pressure pushes some blood backward.",
          known_misconceptions: [
            {
              tag: "stronger_squeeze_fixes_leak",
              triggers: ["squeeze harder", "stronger squeeze fixes", "pump harder fixes", "harder it fixes"],
              explanation: "A stronger squeeze pushes more blood backward through the leak too. Only a valve that shuts stops backflow."
            }
          ],
          check_b_keywords: ["valve", "back", "leak", "one way", "one-way", "close", "shut", "seal", "flap", "wrong way"],
          misconception_keywords: ["squeeze harder"],
          followup_question: "Good prediction! What is the valve supposed to do when the chamber squeezes, and what is it failing to do?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Seal 0, Squeeze 3. Watch the red arrow: when the ventricle squeezes, the leaky valve can't shut, so 28 mL goes back up into the atrium and only 42 mL goes forward."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): A new setting, no hints.",
        scenario: "Now the valve is healthy (seal 2), but the squeeze is gentle (1).",
        question: "Tap '⚡ Set Valve seal = 2 & Squeeze = 1' above. Does any blood go backward?",
        options: [
          { label: "Yes: a gentle squeeze always leaks", correct: false, feedback: "Leaking depends on the valve, not the squeeze. Check the red arrow." },
          { label: "No: the healthy valve shuts, so nothing goes back. Less is pushed, but all of it goes forward", correct: true, feedback: "🎉 Independent mastery! A sealed valve means zero backflow, whatever the squeeze." },
          { label: "The blood stops completely", correct: false, feedback: "A gentle squeeze still moves 40 mL forward." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "The leak is exactly 20% or 40%",
            reality: "Real valve leaks (**regurgitation**) range from tiny to severe; these numbers are illustrative."
          },
          {
            breaks: "There is just one side with two valves",
            reality: "The heart has **four valves**: two on the right side and two on the left."
          }
        ],
        next_unit: "Next in Unit 2: two of these pumps, side by side.",
        next_unit_idx: 1,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 2
    {
      unit_num: 2,
      topic_id: "heart_unit2_two_sides",
      short_tab: "Unit 2 · Two Pumps",
      sub_tab: "Right to Lungs, Left to Body",
      title: "Unit 2 (Two Pumps): Right Side and Left Side in Step",
      purpose_hook: "Why do some people with heart failure get breathless, and others get swollen ankles? It depends on which side falls behind.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict where blood builds up when one side of the heart pumps less than the other, and explain why both sides must pump the same amount.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 2: right pump (to lungs) and left pump (to body) in one circuit" },
      what_gate: {
        prompt: "Step 1 (WHAT): Follow the arrows in the diagram above.",
        question: "Where does the right side of the heart send blood?",
        options: [
          {
            id: "lungs",
            label: "To the lungs",
            correct: true,
            feedback: "Right. The right side pumps blood to the lungs; the left side pumps it on to the rest of the body."
          },
          {
            id: "body",
            label: "Straight to the body",
            correct: false,
            feedback: "That's the left side's job. The right side sends blood to the lungs first."
          },
          {
            id: "brain",
            label: "Only to the brain",
            correct: false,
            feedback: "The brain gets blood from the left side, along with the rest of the body."
          }
        ]
      },
      object_spec: {
        type: "heart_pump",
        layer: "two_sides",
        parts: ["Body (veins)", "Right pump", "Lungs", "Left pump", "Body (arteries)", "Build-up meters"],
        connections: [
          "Blood from the body returns to the right pump",
          "The right pump sends it through the lungs to the left pump",
          "The left pump sends it round the body, back to the right pump"
        ],
        dials: {
          dial1: { key: "right_output", label: "➡️ Right side output (L/min)", min: 3, max: 7, default: 5, unit: "L/min" },
          dial2: { key: "left_output", label: "⬅️ Left side output (L/min)", min: 3, max: 7, default: 5, unit: "L/min" }
        },
        rules: [
          "Whatever the right side pumps arrives in the lungs; the left side must pump the same amount out of them.",
          "If right > left, the difference builds up in the lungs each minute; if left > right, it builds up in the body's veins.",
          "Boundary condition: when both sides pump the same amount, nothing builds up, whatever the size."
        ],
        outputs: ["Blood building up in the lungs (L/min)", "Blood building up in the body's veins (L/min)", "Balanced or not"],
        analogy_limits: [
          {
            breaks: "The two sides are set separately by dials",
            reality: "A healthy heart **balances itself** automatically beat by beat; a lasting mismatch only happens when one side is weakened (heart failure)."
          },
          {
            breaks: "Extra blood piles up as a puddle",
            reality: "It raises pressure in the vessels, and fluid seeps into the lungs (breathlessness) or the legs (**swollen ankles**)."
          }
        ],
        state_transition_bridge: {
          source_state: "Blood returning from the body to the right side",
          bridge_condition: "The right side pumps it through the lungs; the left side must pump the same amount on to the body",
          target_state: "Blood leaving the left side for the body",
          return_feedback_loop: "Unit 3 joins both sides into the full double loop and counts the blood per minute"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (right_output)", real_mechanism: "Right ventricle output into the pulmonary (lung) circulation" },
            { control: "dial2 (left_output)", real_mechanism: "Left ventricle output into the systemic (body) circulation" }
          ],
          adversarial_question: "If a learner takes the two dials literally, will they think a healthy heart has to be adjusted by hand?",
          mitigation: "The analogy limits state that a healthy heart balances both sides automatically; the dials show what happens when one side is weakened."
        },
        boundary_truth_table: {
          min_min: { dials: { right_output: 3, left_output: 3 }, expected_output: "Both 3 L/min: balanced, nothing builds up." },
          max_min: { dials: { right_output: 7, left_output: 3 }, expected_output: "Right 7, left 3: 4 L/min builds up in the lungs." },
          min_max: { dials: { right_output: 3, left_output: 7 }, expected_output: "Right 3, left 7: 4 L/min builds up in the body's veins." },
          max_max: { dials: { right_output: 7, left_output: 7 }, expected_output: "Both 7 L/min: balanced, nothing builds up." },
          zero_edge_case: {
            dials: { right_output: 5, left_output: 5 },
            expected_output: "Equal outputs: zero build-up anywhere. Balance matters, not size."
          }
        },
        target_experiment: { dial1: 5, dial2: 3, label: "Set Right = 5 & Left = 3" },
        whatif_experiment: { dial1: 3, dial2: 5, label: "Set Right = 3 & Left = 5" },
        boundary_rule: "Build-up = right − left (lungs if positive, body veins if negative); zero when equal."
      },
      how_why_challenge: {
        instruction: "Experiment: set Right = 5 and Left = 3 (or tap the one-tap button), then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): The right side pumps 5 L/min but the left side only 3. What happens?",
        part1_choices: [
          { id: "lungs", label: "Blood builds up in the lungs", correct: true },
          { id: "body", label: "Blood builds up in the body", correct: false },
          { id: "fine", label: "Nothing: the two sides don't affect each other", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why does it build up there?",
        part2_placeholder: "e.g., Because the right side sends … into the lungs, but the left side…",
        qa_personas: [
          {
            name: "Persona A: Mastery (more in than out of the lungs)",
            d1: 5,
            d2: 3,
            how_choice: "lungs",
            why_text: "Because the right side sends 5 into the lungs but the left side only takes 3 out, so the extra blood piles up in the lungs."
          },
          {
            name: "Persona B: Misconception (left side pumps to the lungs)",
            d1: 5,
            d2: 3,
            how_choice: "lungs",
            why_text: "Because the left side pumps to the lungs and it is too weak."
          },
          {
            name: "Persona C: Ambiguous ('they're different')",
            d1: 5,
            d2: 3,
            how_choice: "lungs",
            why_text: "Because they are different."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 'blood builds up in the lungs'.",
          check_b_mechanism: "Explains that more blood goes into the lungs (from the right side) than comes out (via the left side), so the difference accumulates there.",
          known_misconceptions: [
            {
              tag: "sides_swapped",
              triggers: ["left side pumps to the lungs", "left side sends blood to the lungs", "right side pumps to the body", "right side sends blood to the body"],
              explanation: "The right side pumps to the lungs and the left side pumps to the body, not the other way round."
            }
          ],
          check_b_keywords: ["lungs", "pile", "build", "back up", "backs up", "keep up", "more in", "less out", "takes", "equal", "balance", "same amount", "extra"],
          misconception_keywords: ["left side pumps to the lungs"],
          followup_question: "Good prediction! How much blood goes INTO the lungs each minute, and how much comes OUT?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Right 5, Left 3. Follow the arrows: 5 L/min flows into the lungs, but the left pump only moves 3 L/min out. The other 2 L/min has nowhere to go, so it builds up in the lungs."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): Flip it, no hints.",
        scenario: "Now the RIGHT side is the weak one: Right = 3, Left = 5.",
        question: "Tap '⚡ Set Right = 3 & Left = 5' above. Where does blood build up now?",
        options: [
          { label: "In the lungs again", correct: false, feedback: "The left side now empties the lungs faster than the right side fills them." },
          { label: "In the body's veins, which is why weak right sides can cause swollen ankles", correct: true, feedback: "🎉 Independent mastery! The weak pump is the bottleneck: blood waits on its 'in' side, the body's veins." },
          { label: "Nowhere: the left side makes up for it", correct: false, feedback: "Pumping more on one side can't fix a bottleneck on the other." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "The two sides are set separately by dials",
            reality: "A healthy heart **balances itself** automatically; a lasting mismatch means one side is weakened."
          },
          {
            breaks: "Extra blood piles up as a puddle",
            reality: "It raises pressure, and fluid seeps into the lungs or the **legs and ankles**."
          }
        ],
        next_unit: "Next in Unit 3: the whole double loop, and how much blood it moves each minute.",
        next_unit_idx: 2,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 3
    {
      unit_num: 3,
      topic_id: "heart_unit3_double_loop",
      short_tab: "Unit 3 · Double Loop",
      sub_tab: "Blood per Minute",
      title: "Unit 3 (Double Loop): How Much Blood per Minute",
      purpose_hook: "Your heart moves about 5 litres a minute at rest, roughly all the blood in your body, every single minute.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict how much blood the heart pumps per minute from heart rate and blood per beat, and explain why you multiply them.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 3: the full double loop over one minute" },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the two dials under the double loop.",
        question: "What does 'heart rate' count?",
        options: [
          {
            id: "beats",
            label: "How many times the heart beats (squeezes) each minute",
            correct: true,
            feedback: "Yes. Heart rate is beats per minute; the other dial is how much blood each beat pushes out."
          },
          {
            id: "litres",
            label: "How many litres of blood are in your body",
            correct: false,
            feedback: "That's blood volume. Heart rate counts beats."
          },
          {
            id: "hard",
            label: "How hard each beat is",
            correct: false,
            feedback: "That's closer to blood per beat. Rate is just how many beats per minute."
          }
        ]
      },
      object_spec: {
        type: "heart_pump",
        layer: "loop",
        parts: ["Heart (both pumps)", "Lung loop (short)", "Body loop (long)", "Heart-rate dial", "Blood-per-beat dial", "Litres-per-minute counter"],
        connections: [
          "Every beat pushes one 'blood per beat' amount into each loop at the same time",
          "More beats per minute means more of those amounts each minute",
          "Blood returns to the heart to start the next lap"
        ],
        dials: {
          dial1: { key: "heart_rate", label: "💓 Heart rate (beats/min)", min: 40, max: 180, default: 70, unit: "bpm" },
          dial2: { key: "stroke_volume", label: "🫗 Blood per beat (mL)", min: 40, max: 100, default: 70, unit: "mL" }
        },
        rules: [
          "Blood per minute (cardiac output) = heart rate × blood per beat.",
          "Both loops carry the same amount per minute, because each beat feeds both.",
          "Boundary condition: the model keeps the two dials independent (see the analogy limits)."
        ],
        outputs: ["Blood pumped per minute (L/min)", "Speed of flow around both loops"],
        analogy_limits: [
          {
            breaks: "Heart rate and blood per beat are independent dials",
            reality: "At very fast rates the heart has **less time to refill**, so blood per beat drops; real hearts don't simply multiply up forever."
          },
          {
            breaks: "Blood flows round two neat circles",
            reality: "It branches into **billions of capillaries**, thinner than a hair, where oxygen actually swaps in and out."
          }
        ],
        state_transition_bridge: {
          source_state: "Right side → lungs (the short loop, picking up oxygen)",
          bridge_condition: "Each beat pushes one 'blood per beat' amount through both loops at once",
          target_state: "Left side → body (the long loop, delivering oxygen)",
          return_feedback_loop: "Blood comes back to the right side to start again, about once a minute at rest"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (heart_rate)", real_mechanism: "Number of heartbeats per minute (pulse)" },
            { control: "dial2 (stroke_volume)", real_mechanism: "Volume of blood ejected per beat (stroke volume)" }
          ],
          adversarial_question: "If a learner takes the dials literally, will they think pushing heart rate to 180 always means 2.5× more blood?",
          mitigation: "The analogy limits say that at very high rates the filling time shrinks, so blood per beat falls in a real heart."
        },
        boundary_truth_table: {
          min_min: { dials: { heart_rate: 40, stroke_volume: 40 }, expected_output: "40 × 40 mL = 1.6 L/min: very low output." },
          max_min: { dials: { heart_rate: 180, stroke_volume: 40 }, expected_output: "180 × 40 mL = 7.2 L/min." },
          min_max: { dials: { heart_rate: 40, stroke_volume: 100 }, expected_output: "40 × 100 mL = 4.0 L/min: like a trained athlete at rest." },
          max_max: { dials: { heart_rate: 180, stroke_volume: 100 }, expected_output: "180 × 100 mL = 18 L/min: hard exercise for a fit adult." },
          zero_edge_case: {
            dials: { heart_rate: 40, stroke_volume: 40 },
            expected_output: "The dials stop at 40: zero beats would mean no circulation at all."
          }
        },
        target_experiment: { dial1: 60, dial2: 70, label: "Set Rate = 60 & Per beat = 70 mL" },
        whatif_experiment: { dial1: 120, dial2: 70, label: "Set Rate = 120 & Per beat = 70 mL" },
        boundary_rule: "Litres per minute = beats per minute × mL per beat ÷ 1000."
      },
      how_why_challenge: {
        instruction: "Experiment: set Rate = 60 and Blood per beat = 70 mL (or tap the one-tap button), then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): At 60 beats a minute and 70 mL per beat, how much blood does the heart pump each minute?",
        part1_choices: [
          { id: "add", label: "130 mL", correct: false },
          { id: "mult", label: "4.2 litres (4,200 mL)", correct: true },
          { id: "one", label: "70 mL", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why is it that amount?",
        part2_placeholder: "e.g., Because each beat pushes out…",
        qa_personas: [
          {
            name: "Persona A: Mastery (beats × amount per beat)",
            d1: 60,
            d2: 70,
            how_choice: "mult",
            why_text: "Because each beat pushes out 70 mL and it beats 60 times a minute, so 60 times 70 = 4,200 mL, which is 4.2 L."
          },
          {
            name: "Persona B: Misconception (adds rate and volume)",
            d1: 60,
            d2: 70,
            how_choice: "mult",
            why_text: "Because you add 60 + 70 to get the total."
          },
          {
            name: "Persona C: Ambiguous ('the heart is strong')",
            d1: 60,
            d2: 70,
            how_choice: "mult",
            why_text: "Because the heart is strong."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 4.2 litres (60 × 70 mL).",
          check_b_mechanism: "Explains that every beat pushes the same amount, so the total per minute is beats per minute × amount per beat.",
          known_misconceptions: [
            {
              tag: "adds_rate_and_volume",
              triggers: ["add 60", "60 + 70", "60+70", "plus 70", "add the beats"],
              explanation: "Beats and millilitres are different kinds of thing; each beat adds another 70 mL, which is multiplication, not 60 + 70."
            }
          ],
          check_b_keywords: ["each beat", "per beat", "every beat", "times", "multiply", "×", "beats per minute", "a minute", "each minute", "60 beats"],
          misconception_keywords: ["60 + 70"],
          followup_question: "Right number! How much blood does ONE beat push, and how many beats happen in a minute?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Rate 60, 70 mL per beat. Count the pulses: beat 1 = 70 mL, beat 2 = another 70 mL… 60 beats × 70 mL = 4,200 mL = 4.2 L every minute."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): Go for a run, no hints.",
        scenario: "You start running. Your heart rate doubles to 120; blood per beat stays at 70 mL.",
        question: "Tap '⚡ Set Rate = 120 & Per beat = 70 mL' above. How much blood per minute now?",
        options: [
          { label: "4.2 L: it stays the same", correct: false, feedback: "Twice as many beats, each pushing 70 mL, means more blood per minute." },
          { label: "190 mL", correct: false, feedback: "That's 120 + 70. Each beat adds 70 mL, so multiply." },
          { label: "8.4 L: double, because twice as many beats each push 70 mL", correct: true, feedback: "🎉 Independent mastery! 120 × 70 mL = 8,400 mL = 8.4 L per minute." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Heart rate and blood per beat are independent dials",
            reality: "At very fast rates the heart has **less time to refill**, so blood per beat drops."
          },
          {
            breaks: "Blood flows round two neat circles",
            reality: "It branches into **billions of capillaries** where oxygen swaps in and out."
          }
        ],
        next_unit: "You've traced the valves, the two pumps and the whole double loop. Time for the recap.",
        next_unit_idx: null,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    }
  ],

  recap: {
    backwards_question: "Walk it backwards: from Unit 3 to Unit 1, which chain is right?",
    backwards_options: [
      { label: "The heart is just one pump that sends blood straight round the body.", correct: false },
      {
        label: "Blood per minute = rate × amount per beat (3) ← because two pumps feed the lungs and body in step (2) ← each kept one-way by valves (1).",
        correct: true
      }
    ],
    hook_placeholder: "Write your 1-sentence takeaway (e.g. 'Valves one-way, right to lungs, left to body')…"
  },

  apply: {
    placeholder: "Where will you use this? (e.g. checking my pulse, a biology test)",
    steps: [
      { label: "Find your pulse", text: "Two fingers on your wrist or neck. Count beats for 15 seconds and × 4: that's your heart rate." },
      { label: "Estimate blood per minute", text: "Multiply your heart rate by about 70 mL. At rest it's usually around 5 litres a minute." },
      { label: "Try it moving", text: "Do 20 jumping jacks, count again, and see how much your blood per minute went up." },
      { label: "Explain the loop", text: "Tell someone: right side → lungs → left side → body → back. Valves keep it one-way." }
    ]
  }
};
