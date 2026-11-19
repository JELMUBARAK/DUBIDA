/**
 * Topic Pack (SKILL · Mental math): Multiply by 11 in your head
 * One root system across all units: n × 11 = n × 10 + n × 1, a number stacked on a copy of
 * itself shifted one place left. Unit 1 reads the shortcut off the stack (no carry),
 * Unit 2 handles the carry, Unit 3 splits other multipliers the same way (×12, ×13).
 */

const ROOT = "times_ten_plus_times_one_stack";

export const MULTIPLY_BY_11_PACK = {
  topic_pack_id: "multiply_by_11_v1",
  title: "Multiply by 11 in Your Head",
  kind: "skill",
  subtitle: "Skill · 3 mysteries · 3 units",
  search_keywords: ["multiply", "11", "eleven", "mental math", "mental maths", "times", "multiplication", "trick"],
  version: "1.0.0",
  system_model: {
    root_system_id: ROOT,
    name: "The ×10 + ×1 Stack",
    description:
      "Any number times 11 is the number times 10 (shifted one place left) plus the number itself. Stack the two rows, add the columns, and the shortcut falls out."
  },

  // ==========================================================================
  // DISCOVERY CARDS
  // ==========================================================================
  discovery_cards: [
    {
      id: "m11_card_0_split",
      card_index: 0,
      mystery_label: "1 · Mystery A",
      solved_label: "1 · Splitting ✓",
      earned_reveal: "That's Splitting.",
      header_eyebrow: "Mystery 1 of 3 · Play Both Scenes",
      header_prompt: "Make 11 two different ways. Watch how you build it.",
      scenes: [
        {
          id: "wallet",
          title: "💵 Paying $11",
          status_default: "Wallet: notes and coins",
          micro_copy: "Pay exactly $11: hand over a note, then a coin.",
          toy: {
            options: [
              { label: "💵 Hand over $10", result: "$10 paid, $1 still to go.", tone: "warn" },
              { label: "🪙 Add a $1 coin", result: "$10 + $1 = $11 exactly.", tone: "ok" }
            ]
          }
        },
        {
          id: "team",
          title: "⚽ Football Team",
          status_default: "Squad: 11 players",
          micro_copy: "Line up outfield players first, then the goalkeeper.",
          toy: {
            options: [
              { label: "🏃 10 outfield players", result: "10 on the pitch. The goal is still empty.", tone: "warn" },
              { label: "🧤 1 goalkeeper", result: "10 + 1 = a full team of 11.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "Paying $11 and picking a team of 11. How did you build 11 both times?",
      options: [
        {
          id: "wrong",
          label: "As 5 plus 6",
          correct: false,
          feedback: "Look again: a $10 note and a $1 coin, 10 players and 1 keeper."
        },
        { id: "right", label: "As a 10 plus a 1", correct: true }
      ],
      reveal_simple: "Breaking a hard number into easy parts: 11 = 10 + 1.",
      reveal_deep:
        "Multiplying by 11 means multiplying by 10 and by 1, then adding: n × 11 = n × 10 + n × 1. This is the distributive rule.",
      under_the_hood: {
        tag: "🔢 UNDER THE HOOD · THE DISTRIBUTIVE RULE",
        flow: "n × 11 ──► n × (10 + 1) ──► n × 10 + n × 1 ──► add the two",
        note: "Splitting a multiplier into friendly parts is the secret behind most mental-maths tricks."
      }
    },
    {
      id: "m11_card_1_shift",
      card_index: 1,
      mystery_label: "2 · Mystery B",
      solved_label: "2 · ×10 Shift ✓",
      earned_reveal: "That's Shifting Left.",
      header_eyebrow: "Mystery 2 of 3 · Play Both Scenes",
      header_prompt: "Times ten, twice. Watch where the digits go.",
      scenes: [
        {
          id: "calculator",
          title: "🧮 Calculator",
          status_default: "Display: 23",
          micro_copy: "Press × 10, then × 10 again. Watch the digits.",
          toy: {
            options: [
              { label: "✖️ × 10", result: "23 → 230: every digit slid one place left.", tone: "ok" },
              { label: "✖️ × 10 again", result: "230 → 2300: slid left again, a zero fills the gap.", tone: "ok" }
            ]
          }
        },
        {
          id: "coins",
          title: "🪙 Coins to Notes",
          status_default: "Piggy bank: 7 coins of $1",
          micro_copy: "Make it ten times bigger: count it in tens instead.",
          toy: {
            options: [
              { label: "🪙 Seven $1 coins", result: "7 ones = $7.", tone: "warn" },
              { label: "💵 Seven $10 notes", result: "7 tens = $70: the 7 moved to the tens place.", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "23 became 230; $7 became $70. What did ×10 do both times?",
      options: [
        { id: "right", label: "Moved every digit one place to the left, with a 0 in the ones", correct: true },
        {
          id: "wrong",
          label: "Added 10 to the number",
          correct: false,
          feedback: "23 + 10 would be 33, but you saw 230."
        }
      ],
      reveal_simple: "Times 10 slides every digit one place to the left.",
      reveal_deep:
        "Place value: multiplying by 10 moves each digit up one column (ones → tens → hundreds), and a 0 fills the empty ones column.",
      under_the_hood: {
        tag: "🔢 UNDER THE HOOD · PLACE VALUE",
        flow: "ones ──► tens ──► hundreds: × 10 moves every digit up one column",
        note: "That's why '× 10, add a zero' works for whole numbers. It's really a shift, not adding."
      }
    },
    {
      id: "m11_card_2_neighbours",
      card_index: 2,
      mystery_label: "3 · Mystery C",
      solved_label: "3 · Neighbours ✓",
      earned_reveal: "That's Adding Neighbours.",
      header_eyebrow: "Mystery 3 of 3 · Play Both Scenes",
      header_prompt: "Stack a number on its shifted copy. Look at the middle.",
      scenes: [
        {
          id: "stack23",
          title: "🧱 23 on 230",
          status_default: "230 + 23",
          micro_copy: "Add the outside columns, then the middle column.",
          toy: {
            options: [
              { label: "↔️ Outside columns", result: "Ends stay 2 … 3.", tone: "warn" },
              { label: "🎯 Middle column", result: "3 + 2 = 5 in the middle: 253!", tone: "ok" }
            ]
          }
        },
        {
          id: "stack45",
          title: "🧱 45 on 450",
          status_default: "450 + 45",
          micro_copy: "Same trick: outside columns first, then the middle.",
          toy: {
            options: [
              { label: "↔️ Outside columns", result: "Ends stay 4 … 5.", tone: "warn" },
              { label: "🎯 Middle column", result: "5 + 4 = 9 in the middle: 495!", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "23 → 253 and 45 → 495. What lands in the middle each time?",
      options: [
        {
          id: "wrong",
          label: "A copy of the first digit",
          correct: false,
          feedback: "The middle of 253 is 5, not 2. Where did 5 come from?"
        },
        { id: "right", label: "The two digits added together", correct: true }
      ],
      reveal_simple: "To times-11 a two-digit number, keep the ends and put their sum in the middle.",
      reveal_deep:
        "Because n × 11 = n × 10 + n, the shifted copy overlaps the original by one column, so the middle digit is the sum of the two digits (carry if it reaches 10).",
      under_the_hood: {
        tag: "🔢 UNDER THE HOOD · WHY THE MIDDLE IS A SUM",
        flow: "a b 0 (×10) + a b (×1) ──► a | a+b | b",
        note: "The shortcut isn't magic: it's column addition of the ×10 and ×1 rows."
      }
    }
  ],

  loop: {
    headline: "One Stack: Split → Shift → Add Neighbours",
    steps: [
      { label: "1 · Split", title: "11 = 10 + 1", text: "Times 11 is times 10 plus times 1." },
      { label: "2 · Shift", title: "×10 slides left", text: "The ×10 row is the number moved one place left." },
      { label: "3 · Add", title: "Neighbours meet", text: "Stack and add: the middle digit is the two digits' sum." }
    ]
  },

  // ==========================================================================
  // UNITS
  // ==========================================================================
  units: [
    // ------------------------------------------------------------------ Unit 1
    {
      unit_num: 1,
      topic_id: "m11_unit1_basic",
      short_tab: "Unit 1 · The Trick",
      sub_tab: "Ends Stay, Middle Adds",
      title: "Unit 1 (The Trick): Two-Digit Numbers × 11",
      purpose_hook: "Split a bill among 11 people, price 11 items, check homework: answers in two seconds, no calculator.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Multiply a two-digit number by 11 in your head, and explain why the middle digit is the sum of the two digits.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 1: the ×10 row and ×1 row, stacked and added (no carry)" },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the two stacked rows above.",
        question: "Which of these is the same as 23 × 11?",
        options: [
          { id: "split", label: "23 × 10 + 23", correct: true, feedback: "Yes: 11 = 10 + 1, so 23 × 11 = 230 + 23." },
          { id: "plus", label: "23 + 11", correct: false, feedback: "That adds 11 once. Times 11 means eleven lots of 23." },
          { id: "glue", label: "2311 (put 23 and 11 side by side)", correct: false, feedback: "Writing numbers side by side isn't multiplying." }
        ]
      },
      object_spec: {
        type: "times_eleven",
        layer: "basic",
        parts: ["Tens digit", "Ones digit", "×10 row (shifted left)", "×1 row (the number)", "Column sums", "Shortcut: ends + middle"],
        connections: [
          "The ×10 row is the number moved one place left",
          "The ×1 row is the number itself",
          "Adding the columns gives the answer; the middle column holds both digits"
        ],
        dials: {
          dial1: { key: "tens_digit", label: "🔟 Tens digit", min: 1, max: 9, default: 2, unit: "" },
          dial2: { key: "ones_digit", label: "1️⃣ Ones digit", min: 0, max: 9, default: 3, unit: "" }
        },
        rules: [
          "n × 11 = n × 10 + n.",
          "For a two-digit number ab: the answer is a | (a + b) | b.",
          "Termination/boundary condition: if a + b is 10 or more, the middle carries 1 onto the first digit (Unit 2)."
        ],
        outputs: ["The ×10 row and ×1 row", "The answer", "The middle-digit sum"],
        analogy_limits: [
          {
            breaks: "The middle digit is always just a + b",
            reality: "Only when **a + b is 9 or less**. When it's 10 or more you must **carry** (Unit 2)."
          },
          {
            breaks: "This trick is special magic for 11",
            reality: "It's ordinary **column addition** of ×10 and ×1, and the same split works for ×12, ×13… (Unit 3)."
          }
        ],
        state_transition_bridge: {
          source_state: "A two-digit number (tens digit a, ones digit b)",
          bridge_condition: "Write it shifted left (×10) above itself (×1) and add the columns",
          target_state: "The answer a | a+b | b",
          return_feedback_loop: "Unit 2 handles the case where the middle sum is 10 or more"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (tens_digit)", real_mechanism: "The tens digit a of the two-digit number" },
            { control: "dial2 (ones_digit)", real_mechanism: "The ones digit b of the two-digit number" }
          ],
          adversarial_question: "If a learner takes the shortcut literally, will they write a two-digit sum in the middle (e.g. 4128 for 48 × 11)?",
          mitigation: "The stack always shows the true column addition, including carries, and Unit 2 targets exactly that mistake."
        },
        boundary_truth_table: {
          min_min: { dials: { tens_digit: 1, ones_digit: 0 }, expected_output: "10 × 11 = 110 (middle 1 + 0 = 1)." },
          max_min: { dials: { tens_digit: 9, ones_digit: 0 }, expected_output: "90 × 11 = 990 (middle 9 + 0 = 9)." },
          min_max: { dials: { tens_digit: 1, ones_digit: 9 }, expected_output: "19 × 11 = 209: the middle sum is 10, so it carries (Unit 2)." },
          max_max: { dials: { tens_digit: 9, ones_digit: 9 }, expected_output: "99 × 11 = 1089: middle 18, carry 1 into the thousands." },
          zero_edge_case: {
            dials: { tens_digit: 5, ones_digit: 0 },
            expected_output: "Ones digit 0: 50 × 11 = 550, the middle is 5 + 0 = 5."
          }
        },
        target_experiment: { dial1: 2, dial2: 3, label: "Set number = 23" },
        whatif_experiment: { dial1: 6, dial2: 2, label: "Set number = 62" },
        boundary_rule: "Answer = n × 10 + n; shortcut a | a+b | b when a + b ≤ 9."
      },
      how_why_challenge: {
        instruction: "Experiment: set the number to 23 (or tap the one-tap button). Watch the stack, then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): What is 23 × 11?",
        part1_choices: [
          { id: "a253", label: "253", correct: true },
          { id: "a233", label: "233", correct: false },
          { id: "a2323", label: "2323", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why is the middle digit what it is?",
        part2_placeholder: "e.g., Because 23 × 11 is 23 × 10 plus…",
        qa_personas: [
          {
            name: "Persona A: Mastery (×10 + ×1, middle is the sum)",
            d1: 2,
            d2: 3,
            how_choice: "a253",
            why_text: "Because 23 × 11 is 23 × 10 plus 23, which is 230 + 23 = 253, so the middle digit is 2 + 3."
          },
          {
            name: "Persona B: Misconception (just repeat the number)",
            d1: 2,
            d2: 3,
            how_choice: "a253",
            why_text: "Because you just repeat the number."
          },
          {
            name: "Persona C: Ambiguous ('that's the trick')",
            d1: 2,
            d2: 3,
            how_choice: "a253",
            why_text: "Because that's the trick."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 253.",
          check_b_mechanism: "Explains that 23 × 11 = 230 + 23, so the middle column adds the two digits (2 + 3).",
          known_misconceptions: [
            {
              tag: "repeat_the_digits",
              triggers: ["repeat the number", "just repeat", "write it twice", "copy the digits", "2323"],
              explanation: "Writing the number twice (2323) is 23 × 101, not 23 × 11. The ×1 row overlaps the ×10 row by one column."
            }
          ],
          check_b_keywords: ["add", "sum", "middle", "neighbour", "neighbor", "2 + 3", "2+3", "between", "230", "× 10", "x 10", "times 10", "+ 23", "plus 23"],
          misconception_keywords: ["just repeat", "write it twice"],
          followup_question: "Good answer! Where does the 5 in the middle come from? Look at the middle column of the stack.",
          targeted_replay:
            "🔁 TARGETED REPLAY: Stack 230 (that's 23 × 10) on top of 23. Add each column: ones 0 + 3 = 3, tens 3 + 2 = 5, hundreds 2. The middle 5 is 2 + 3, so the answer is 253."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): A new number, no hints.",
        scenario: "11 friends each pay $62 for a concert ticket.",
        question: "Tap '⚡ Set number = 62' above if you want to check. What is 62 × 11?",
        options: [
          { label: "6262", correct: false, feedback: "That's the number written twice. The middle should be 6 + 2." },
          { label: "628", correct: false, feedback: "Close, but the ends stay in order: 6 at the front, 2 at the back." },
          { label: "682", correct: true, feedback: "🎉 Independent mastery! 6 | 6 + 2 | 2 = 682." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "The middle digit is always just a + b",
            reality: "Only when **a + b is 9 or less**. Otherwise you **carry** (Unit 2)."
          },
          {
            breaks: "This trick is special magic for 11",
            reality: "It's ordinary **column addition**, and the split works for ×12, ×13… (Unit 3)."
          }
        ],
        next_unit: "Next in Unit 2: what if the two digits add up to 10 or more?",
        next_unit_idx: 1,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 2
    {
      unit_num: 2,
      topic_id: "m11_unit2_carry",
      short_tab: "Unit 2 · Carrying",
      sub_tab: "When the Middle Overflows",
      title: "Unit 2 (Carrying): When the Middle Is 10 or More",
      purpose_hook: "The trick only feels reliable once you can handle numbers like 48, 75 and 99.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Multiply any two-digit number by 11 in your head, including when the digits add to 10 or more, and explain why you carry.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 2: the same stack when the middle column overflows (carry)" },
      what_gate: {
        prompt: "Step 1 (WHAT): One column of digits can only hold 0 to 9.",
        question: "In ordinary column addition, what do you do when a column adds up to 12?",
        options: [
          { id: "write12", label: "Write 12 in that column", correct: false, feedback: "A column holds one digit. 12 is 1 ten and 2 ones." },
          { id: "carry", label: "Write 2 and carry 1 to the next column on the left", correct: true, feedback: "Exactly. That's carrying, and it's the key to this unit." },
          { id: "drop", label: "Drop the 1 and write 2", correct: false, feedback: "Dropping the 1 loses ten. It has to go somewhere." }
        ]
      },
      object_spec: {
        type: "times_eleven",
        layer: "carry",
        parts: ["Tens digit", "Ones digit", "×10 row", "×1 row", "Middle-column sum", "Carry arrow"],
        connections: [
          "The middle column adds the two digits",
          "If the middle sum is 10 or more, its tens part carries into the left column",
          "The left column becomes the tens digit + the carry"
        ],
        dials: {
          dial1: { key: "tens_digit", label: "🔟 Tens digit", min: 1, max: 9, default: 4, unit: "" },
          dial2: { key: "ones_digit", label: "1️⃣ Ones digit", min: 0, max: 9, default: 8, unit: "" }
        },
        rules: [
          "Middle sum s = a + b. If s ≤ 9: answer a | s | b.",
          "If s ≥ 10: write s − 10 in the middle and carry 1: answer (a + 1) | (s − 10) | b.",
          "Boundary condition: with a = 9 and a carry, the front becomes 10, so the answer has four digits (e.g. 99 × 11 = 1089)."
        ],
        outputs: ["Middle sum", "Whether a carry happens", "The answer"],
        analogy_limits: [
          {
            breaks: "You only ever carry a 1",
            reality: "For two-digit numbers, yes (the most is 9 + 9 = 18). With **bigger numbers** the carries can chain across several columns."
          },
          {
            breaks: "The front digit is always a",
            reality: "After a carry it's **a + 1**, and for a = 9 it rolls over to **10** (four-digit answer)."
          }
        ],
        state_transition_bridge: {
          source_state: "A middle-column sum a + b that is 10 or more",
          bridge_condition: "Keep the ones of the sum in the middle; carry its 1 into the left column",
          target_state: "A corrected answer (a + 1) | (a + b − 10) | b",
          return_feedback_loop: "Unit 3 uses the same stack-and-carry for ×12 and ×13"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (tens_digit)", real_mechanism: "The tens digit a of the two-digit number" },
            { control: "dial2 (ones_digit)", real_mechanism: "The ones digit b of the two-digit number" }
          ],
          adversarial_question: "If a learner takes 'put the sum in the middle' literally, will they write 4128 for 48 × 11?",
          mitigation: "The stack shows the carry arrow whenever the middle reaches 10, and the rubric flags '12 in the middle' as a misconception."
        },
        boundary_truth_table: {
          min_min: { dials: { tens_digit: 1, ones_digit: 0 }, expected_output: "10 × 11 = 110: middle 1, no carry." },
          max_min: { dials: { tens_digit: 9, ones_digit: 0 }, expected_output: "90 × 11 = 990: middle 9, no carry." },
          min_max: { dials: { tens_digit: 1, ones_digit: 9 }, expected_output: "19 × 11 = 209: middle 10 → write 0, carry 1." },
          max_max: { dials: { tens_digit: 9, ones_digit: 9 }, expected_output: "99 × 11 = 1089: middle 18 → write 8, carry 1 makes the front 10." },
          zero_edge_case: {
            dials: { tens_digit: 5, ones_digit: 5 },
            expected_output: "55 × 11 = 605: middle exactly 10 → write 0, carry 1."
          }
        },
        target_experiment: { dial1: 4, dial2: 8, label: "Set number = 48" },
        whatif_experiment: { dial1: 9, dial2: 9, label: "Set number = 99" },
        boundary_rule: "If a + b ≥ 10: (a + 1) | (a + b − 10) | b."
      },
      how_why_challenge: {
        instruction: "Experiment: set the number to 48 (or tap the one-tap button). Watch the middle column, then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): What is 48 × 11?",
        part1_choices: [
          { id: "a4128", label: "4128", correct: false },
          { id: "a528", label: "528", correct: true },
          { id: "a428", label: "428", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why isn't it 4128?",
        part2_placeholder: "e.g., Because 4 + 8 = 12, which…",
        qa_personas: [
          {
            name: "Persona A: Mastery (middle overflows, carry 1)",
            d1: 4,
            d2: 8,
            how_choice: "a528",
            why_text: "Because 4 + 8 = 12, which is more than 9, so I write the 2 in the middle and carry the 1 onto the 4, making 528."
          },
          {
            name: "Persona B: Misconception (put the whole sum in the middle)",
            d1: 4,
            d2: 8,
            how_choice: "a528",
            why_text: "Because you put 12 in the middle."
          },
          {
            name: "Persona C: Ambiguous ('it's bigger')",
            d1: 4,
            d2: 8,
            how_choice: "a528",
            why_text: "Because it's bigger."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 528.",
          check_b_mechanism: "Explains that the middle sum 12 is more than one digit, so 2 stays in the middle and 1 carries into the front digit.",
          known_misconceptions: [
            {
              tag: "two_digit_middle",
              triggers: ["12 in the middle", "4128", "write 12 in", "put 12 in"],
              explanation: "One column holds one digit. 12 is 1 ten + 2 ones, so the 1 carries into the next column."
            }
          ],
          check_b_keywords: ["carry", "carried", "more than 9", "bigger than 9", "over 9", "10 or more", "two digits", "add 1", "add one", "plus 1", "+ 1", "+1", "onto the"],
          misconception_keywords: ["12 in the middle", "4128"],
          followup_question: "Right answer! 4 + 8 makes 12. What do you do with the 1 of that 12?",
          targeted_replay:
            "🔁 TARGETED REPLAY: 480 + 48. Ones: 0 + 8 = 8. Middle: 8 + 4 = 12, so write 2 and carry 1. Front: 4 + 1 = 5. The answer is 528, not 4128."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): The hardest two-digit case, no hints.",
        scenario: "99 × 11: both digits are 9.",
        question: "Tap '⚡ Set number = 99' above if you want to check. What is 99 × 11?",
        options: [
          { label: "9189", correct: false, feedback: "18 can't sit in one column: write 8, carry 1." },
          { label: "1089", correct: true, feedback: "🎉 Independent mastery! 9 + 9 = 18 → write 8, carry 1; 9 + 1 = 10 at the front → 1089." },
          { label: "999", correct: false, feedback: "The middle is 9 + 9, not 9." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "You only ever carry a 1",
            reality: "For two-digit numbers, yes. With **bigger numbers** carries can chain across columns."
          },
          {
            breaks: "The front digit is always a",
            reality: "After a carry it's **a + 1**, and for a = 9 it becomes **10**."
          }
        ],
        next_unit: "Next in Unit 3: the same stack works for ×12 and ×13.",
        next_unit_idx: 2,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 3
    {
      unit_num: 3,
      topic_id: "m11_unit3_split_any",
      short_tab: "Unit 3 · ×12, ×13",
      sub_tab: "Split Any Multiplier",
      title: "Unit 3 (Transfer): ×12 and ×13 with the Same Stack",
      purpose_hook: "A dozen eggs, 12 months, 13 in a baker's dozen: the same split makes these quick too.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Multiply a two-digit number by 12 or 13 by splitting the multiplier into 10 + something, and explain why the split works.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 3: the ×10 row plus a ×k row (k = 1, 2 or 3)" },
      what_gate: {
        prompt: "Step 1 (WHAT): The second dial changes the bottom row.",
        question: "How can you split 12 into easy parts, the same way 11 = 10 + 1?",
        options: [
          { id: "ten2", label: "12 = 10 + 2", correct: true, feedback: "Yes: so n × 12 = n × 10 + n × 2." },
          { id: "six6", label: "12 = 6 + 6", correct: false, feedback: "True, but × 6 isn't easier. We want the friendly × 10." },
          { id: "one2", label: "12 = 1 then 2, so put digits side by side", correct: false, feedback: "Side by side isn't splitting. Split into a sum: 10 + 2." }
        ]
      },
      object_spec: {
        type: "times_eleven",
        layer: "split",
        parts: ["The number", "×10 row", "×k row (k = 1, 2 or 3)", "Sum"],
        connections: [
          "The multiplier is split into 10 + k",
          "The ×10 row is the number shifted left; the ×k row is the number times k",
          "Adding the two rows gives the answer"
        ],
        dials: {
          dial1: { key: "number", label: "🔢 Number", min: 10, max: 99, default: 24, unit: "" },
          dial2: { key: "extra", label: "➕ Multiplier = 10 + this", min: 1, max: 3, default: 1, unit: "" }
        },
        rules: [
          "n × (10 + k) = n × 10 + n × k.",
          "k = 1 gives ×11, k = 2 gives ×12, k = 3 gives ×13.",
          "Boundary condition: the 'add the neighbours' shortcut only works for k = 1; for k = 2 or 3 add the full ×k row."
        ],
        outputs: ["×10 row", "×k row", "Answer"],
        analogy_limits: [
          {
            breaks: "The neighbour shortcut works for any multiplier",
            reality: "Only for **×11**. For ×12, ×13 you add **n × 2** or **n × 3**, not the neighbouring digits."
          },
          {
            breaks: "Splitting only works with 10 + something",
            reality: "Any split works (e.g. 9 = **10 − 1**: n × 9 = n × 10 − n). Ten is just the friendliest."
          }
        ],
        state_transition_bridge: {
          source_state: "A multiplier you can't do in your head (12, 13)",
          bridge_condition: "Split it into 10 + k and make the two easy rows: n × 10 and n × k",
          target_state: "The answer: add the two rows",
          return_feedback_loop: "The same split-and-add habit unlocks other mental maths (×9, ×15, ×21…)"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (number)", real_mechanism: "The two-digit number being multiplied" },
            { control: "dial2 (extra)", real_mechanism: "The k in the multiplier 10 + k" }
          ],
          adversarial_question: "If a learner takes Unit 1's shortcut literally, will they 'add the neighbours' for × 12 too?",
          mitigation: "The diagram always shows the full ×k row, and the rubric flags the neighbour shortcut for ×12 as a misconception."
        },
        boundary_truth_table: {
          min_min: { dials: { number: 10, extra: 1 }, expected_output: "10 × 11 = 100 + 10 = 110." },
          max_min: { dials: { number: 99, extra: 1 }, expected_output: "99 × 11 = 990 + 99 = 1089." },
          min_max: { dials: { number: 10, extra: 3 }, expected_output: "10 × 13 = 100 + 30 = 130." },
          max_max: { dials: { number: 99, extra: 3 }, expected_output: "99 × 13 = 990 + 297 = 1287." },
          zero_edge_case: {
            dials: { number: 50, extra: 1 },
            expected_output: "The extra dial stops at 1: k = 0 would be ×10 alone, just the shift. 50 × 11 = 500 + 50 = 550."
          }
        },
        target_experiment: { dial1: 24, dial2: 2, label: "Set 24 × 12" },
        whatif_experiment: { dial1: 31, dial2: 3, label: "Set 31 × 13" },
        boundary_rule: "Answer = n × 10 + n × k."
      },
      how_why_challenge: {
        instruction: "Experiment: set Number = 24 and the extra to 2, so it's 24 × 12 (or tap the one-tap button), then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): What is 24 × 12?",
        part1_choices: [
          { id: "a264", label: "264", correct: false },
          { id: "a2448", label: "2448", correct: false },
          { id: "a288", label: "288", correct: true }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why does the split give that answer?",
        part2_placeholder: "e.g., Because 12 is 10 + 2, so…",
        qa_personas: [
          {
            name: "Persona A: Mastery (10 + 2 split)",
            d1: 24,
            d2: 2,
            how_choice: "a288",
            why_text: "Because 12 is 10 + 2, so 24 × 10 = 240 plus 24 doubled is 48, and 240 + 48 = 288."
          },
          {
            name: "Persona B: Misconception (uses the ×11 neighbour trick)",
            d1: 24,
            d2: 2,
            how_choice: "a288",
            why_text: "Because you add the neighbours like with 11."
          },
          {
            name: "Persona C: Ambiguous ('I worked it out')",
            d1: 24,
            d2: 2,
            how_choice: "a288",
            why_text: "Because I worked it out."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 288.",
          check_b_mechanism: "Explains the split 12 = 10 + 2: 24 × 10 = 240 plus 24 × 2 = 48, total 288.",
          known_misconceptions: [
            {
              tag: "neighbour_trick_for_12",
              triggers: ["add the neighbours", "add the neighbors", "neighbour trick", "neighbor trick", "like with 11"],
              explanation: "The neighbour shortcut only works for ×11 (one shifted copy). ×12 needs the ×2 row: 24 × 2 = 48."
            }
          ],
          check_b_keywords: ["240", "× 10", "x 10", "times 10", "10 +", "10+", "48", "double", "split", "twice", "2 times", "two times"],
          misconception_keywords: ["add the neighbours", "neighbour trick"],
          followup_question: "Correct! What are the two easy rows you added to get 288?",
          targeted_replay:
            "🔁 TARGETED REPLAY: 24 × 12 = 24 × 10 + 24 × 2. Top row 240, bottom row 48 (not just 24!). 240 + 48 = 288."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): A baker's dozen, no hints.",
        scenario: "A baker sells 31 boxes of 13 rolls.",
        question: "Tap '⚡ Set 31 × 13' above if you want to check. How many rolls is 31 × 13?",
        options: [
          { label: "403", correct: true, feedback: "🎉 Independent mastery! 31 × 10 = 310, 31 × 3 = 93, and 310 + 93 = 403." },
          { label: "341", correct: false, feedback: "That's 31 × 11. With 13 the bottom row is 31 × 3." },
          { label: "3193", correct: false, feedback: "Digits side by side aren't multiplying. Split 13 into 10 + 3." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "The neighbour shortcut works for any multiplier",
            reality: "Only for **×11**. For ×12, ×13 add **n × 2** or **n × 3**."
          },
          {
            breaks: "Splitting only works with 10 + something",
            reality: "Any split works: n × 9 = **n × 10 − n**."
          }
        ],
        next_unit: "You can split, shift and add. Time for the recap.",
        next_unit_idx: null,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    }
  ],

  recap: {
    backwards_question: "Walk it backwards: from Unit 3 to Unit 1, which chain is right?",
    backwards_options: [
      {
        label: "×12 = ×10 + ×2 (3) ← the same stack needs carrying when a column passes 9 (2) ← because ×11 = ×10 + ×1, a shifted copy plus the number (1).",
        correct: true
      },
      { label: "×11 is a special trick that has nothing to do with ×10.", correct: false }
    ],
    hook_placeholder: "Write your 1-sentence takeaway (e.g. 'Ends stay, middle adds, carry if 10+')…"
  },

  apply: {
    placeholder: "Where will you use it? (e.g. splitting bills, shopping, homework)",
    steps: [
      { label: "Warm up", text: "Do 3 easy ones in your head: 12 × 11, 34 × 11, 52 × 11. Check: 132, 374, 572." },
      { label: "Carry", text: "Try 3 with carries: 47 × 11, 68 × 11, 85 × 11. Check: 517, 748, 935." },
      { label: "Transfer", text: "Try 2 with ×12: 15 × 12, 23 × 12. Check: 180, 276." },
      { label: "Real life", text: "Next time you see 11 or 12 of something (players, eggs, months), work out the total in your head before you check." }
    ]
  }
};
