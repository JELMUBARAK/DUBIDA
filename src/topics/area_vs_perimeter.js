/**
 * Topic Pack (CONCEPT · Math): Area vs Perimeter
 * One root system across all units: a rectangle drawn on a unit grid (width × height).
 * Unit 1 walks its edge (perimeter), Unit 2 fills its inside (area), Unit 3 holds the edge
 * fixed and shows the inside can still change (the trade-off).
 */

const ROOT = "rectangle_on_unit_grid";

export const AREA_VS_PERIMETER_PACK = {
  topic_pack_id: "area_vs_perimeter_v1",
  title: "Area vs Perimeter",
  kind: "concept",
  subtitle: "Math concept · 3 mysteries · 3 units",
  search_keywords: ["area", "perimeter", "rectangle", "square", "fence", "geometry", "shape"],
  version: "1.0.0",
  system_model: {
    root_system_id: ROOT,
    name: "One Rectangle on a Unit Grid",
    description:
      "A single rectangle on a grid of 1×1 squares. Its width and height set both how far it is around the edge (perimeter) and how many squares fit inside (area)."
  },

  // ==========================================================================
  // DISCOVERY CARDS (Mystery first, name last)
  // ==========================================================================
  discovery_cards: [
    {
      id: "avp_card_0_perimeter",
      card_index: 0,
      mystery_label: "1 · Mystery A",
      solved_label: "1 · Perimeter ✓",
      earned_reveal: "That's Perimeter.",
      header_eyebrow: "Mystery 1 of 3 · Play Both Scenes",
      header_prompt: "Two problems. One kind of measuring fixes both.",
      scenes: [
        {
          id: "frame",
          title: "🖼️ Picture Frame",
          status_default: "Photo: 3 cm × 2 cm",
          micro_copy: "Decorate the frame: wrap ribbon around it, or paint the middle?",
          toy: {
            visual: "avp_frame",
            options: [
              { label: "🎀 Wrap ribbon around", result: "3 + 2 + 3 + 2 = 10 cm of ribbon. Framed!", tone: "ok" },
              { label: "🖌️ Paint the middle", result: "Middle painted, but the edge is still bare.", tone: "warn" }
            ]
          }
        },
        {
          id: "sheep",
          title: "🐑 Sheep Field",
          status_default: "Field: 4 m × 2 m",
          micro_copy: "Keep the sheep in: build a fence, or plant more grass?",
          toy: {
            visual: "avp_sheep",
            options: [
              { label: "🪵 Fence the edge", result: "4 + 2 + 4 + 2 = 12 m of fence. Sheep stay in!", tone: "ok" },
              { label: "🌱 Plant more grass", result: "Lovely grass, and the sheep wander off.", tone: "warn" }
            ]
          }
        }
      ],
      pattern_question: "Ribbon on a frame, fence round a field. What did you measure in both?",
      options: [
        {
          id: "wrong",
          label: "How much surface is inside the shape",
          correct: false,
          feedback: "Painting and planting covered the inside, but they didn't solve either problem."
        },
        { id: "right", label: "The total distance all the way around the edge", correct: true }
      ],
      reveal_simple: "The distance all the way around the outside of a shape.",
      reveal_deep:
        "Perimeter is a length: the sum of every side. For a rectangle, P = width + height + width + height = 2 × (width + height).",
      under_the_hood: {
        tag: "📐 UNDER THE HOOD · PERIMETER IS A LENGTH",
        flow: "Side lengths ──► walk every side once ──► add them ──► one total distance (cm, m)",
        note: "Perimeter is measured in plain units (m), never square units (m²), because it's a line, not a surface."
      }
    },
    {
      id: "avp_card_1_area",
      card_index: 1,
      mystery_label: "2 · Mystery B",
      solved_label: "2 · Area ✓",
      earned_reveal: "That's Area.",
      header_eyebrow: "Mystery 2 of 3 · Play Both Scenes",
      header_prompt: "Now the edge doesn't help. Something else does.",
      scenes: [
        {
          id: "floor",
          title: "🧱 Tiling a Floor",
          status_default: "Floor: 4 tiles × 3 tiles",
          micro_copy: "How many tiles to buy? Count the floor, or measure the edge?",
          toy: {
            visual: "avp_floor",
            options: [
              { label: "🔢 Count tiles to cover it", result: "3 rows of 4 = 12 tiles, no gaps!", tone: "ok" },
              { label: "📏 Measure the edge", result: "14 tiles of edge, but that doesn't cover the floor.", tone: "warn" }
            ]
          }
        },
        {
          id: "chocolate",
          title: "🍫 Sharing Chocolate",
          status_default: "Bar: 6 × 4 squares",
          micro_copy: "Enough for 24 friends? Count the squares, or measure the wrapper?",
          toy: {
            visual: "avp_chocolate",
            options: [
              { label: "🔢 Count the squares", result: "4 rows of 6 = 24 squares. Everyone gets one!", tone: "ok" },
              { label: "📏 Measure the wrapper", result: "20 squares of edge, so nobody knows how many pieces.", tone: "warn" }
            ]
          }
        }
      ],
      pattern_question: "Tiles on a floor, squares in a bar. What did you count in both?",
      options: [
        { id: "right", label: "How many unit squares cover the inside", correct: true },
        {
          id: "wrong",
          label: "How long the outside edge is",
          correct: false,
          feedback: "Measuring the edge didn't tell you how many tiles or pieces there were."
        }
      ],
      reveal_simple: "How much flat space a shape covers, counted in squares.",
      reveal_deep:
        "Area counts unit squares. A rectangle is rows × columns of squares, so A = width × height, measured in square units (m², cm²).",
      under_the_hood: {
        tag: "📐 UNDER THE HOOD · AREA IS A COUNT OF SQUARES",
        flow: "Width (squares per row) × Height (number of rows) ──► squares covering the inside (m²)",
        note: "Multiplying works because every row holds the same number of squares: it's repeated addition of rows."
      }
    },
    {
      id: "avp_card_2_tradeoff",
      card_index: 2,
      mystery_label: "3 · Mystery C",
      solved_label: "3 · The Trade-off ✓",
      earned_reveal: "That's the Area–Perimeter Trade-off.",
      header_eyebrow: "Mystery 3 of 3 · Same Edge, Different Shapes",
      header_prompt: "The edge length stays fixed. Watch what happens inside.",
      scenes: [
        {
          id: "chickens",
          title: "🐔 Chicken Run",
          status_default: "Fence: 12 m",
          micro_copy: "Same 12 m of fence. Long and thin, or square?",
          toy: {
            visual: "avp_chickens",
            options: [
              { label: "➖ Long & thin (5 × 1)", result: "Only 5 m² inside. Chickens squashed!", tone: "warn" },
              { label: "⬛ Square (3 × 3)", result: "9 m² inside, almost double, same fence!", tone: "ok" }
            ]
          }
        },
        {
          id: "card",
          title: "🎁 Ribbon Card",
          status_default: "Ribbon: 16 cm",
          micro_copy: "Same 16 cm of ribbon. Which card shape holds more?",
          toy: {
            visual: "avp_card",
            options: [
              { label: "➖ Strip (7 × 1)", result: "7 cm² of card inside the ribbon.", tone: "warn" },
              { label: "⬛ Square (4 × 4)", result: "16 cm² of card, same ribbon!", tone: "ok" }
            ]
          }
        }
      ],
      pattern_question: "The fence and ribbon never changed length. What changed the space inside?",
      options: [
        {
          id: "wrong",
          label: "Nothing. The same edge always holds the same space",
          correct: false,
          feedback: "Look again: 5 m² vs 9 m² with the very same 12 m fence."
        },
        { id: "right", label: "The shape: squarer shapes hold more inside for the same edge", correct: true }
      ],
      reveal_simple: "Same edge length doesn't mean same space. Shape decides how much fits inside.",
      reveal_deep:
        "Perimeter and area are independent measurements. For a fixed perimeter, area is largest when width = height (a square) and shrinks as the shape gets thinner.",
      under_the_hood: {
        tag: "📐 UNDER THE HOOD · FIXED EDGE, CHANGING INSIDE",
        flow: "Fixed fence ──► width + height stays constant ──► area = width × height peaks when width = height",
        note: "This is why bubbles are round and why farmers fence near-square fields: most space for the least fence."
      }
    }
  ],

  loop: {
    headline: "One Rectangle: Edge → Inside → Trade-off",
    steps: [
      { label: "1 · Perimeter", title: "Walk the edge", text: "Add every side: 2 × (width + height)." },
      { label: "2 · Area", title: "Fill the inside", text: "Rows × columns of unit squares: width × height." },
      { label: "3 · Trade-off", title: "Fix the edge, change the shape", text: "Same fence, squarer shape → more space inside." }
    ],
    check: {
      question: "You have 24 m of fence for a rabbit pen. Which pen gives the rabbit the most room?",
      options: [
        {
          label: "6 m × 6 m",
          correct: true,
          feedback: "Spot on. Both pens use 24 m of fence, but the square holds 36 m² and the long one only 20 m²."
        },
        {
          label: "10 m × 2 m",
          correct: false,
          feedback: "It uses the same 24 m of fence, but long and thin holds only 10 × 2 = 20 m². Try a squarer shape."
        },
        {
          label: "Doesn't matter: same fence, same room",
          correct: false,
          feedback: "Same fence means the same perimeter, not the same area. A squarer shape fits more inside."
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
      topic_id: "avp_unit1_perimeter",
      short_tab: "Unit 1 · Perimeter",
      sub_tab: "Walk the Edge",
      title: "Unit 1 (Perimeter): Walking All Four Sides",
      purpose_hook: "Fencing, framing, edging a garden: any time you go around something, you need perimeter.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict the perimeter of a rectangle from its width and height, and explain why you add all four sides.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 1: the rectangle's edge (grid lines)" },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the rectangle on the grid above.",
        question: "What does the perimeter of a rectangle measure?",
        options: [
          {
            id: "inside",
            label: "How many squares fit inside it",
            correct: false,
            feedback: "That's area, coming in Unit 2. Perimeter is about the edge."
          },
          {
            id: "around",
            label: "The total distance all the way around its edge",
            correct: true,
            feedback: "Exactly. Perimeter is a length: walk every side once and add them up."
          },
          {
            id: "longest",
            label: "The length of its longest side",
            correct: false,
            feedback: "One side is only part of the trip. Perimeter goes all the way around."
          }
        ]
      },
      object_spec: {
        type: "avp_rectangle_grid",
        layer: "perimeter",
        parts: ["Unit grid (1×1 squares)", "Rectangle", "Highlighted edge (the 4 sides)", "Side-length labels"],
        connections: [
          "Width sets the length of the top and bottom sides",
          "Height sets the length of the left and right sides",
          "All four sides join end to end into one closed edge"
        ],
        dials: {
          dial1: { key: "width", label: "↔️ Width", min: 1, max: 8, default: 4, unit: "units" },
          dial2: { key: "height", label: "↕️ Height", min: 1, max: 8, default: 2, unit: "units" }
        },
        rules: [
          "Perimeter = width + height + width + height = 2 × (width + height).",
          "Boundary condition: width and height are at least 1. A side of 0 is a line, not a rectangle."
        ],
        outputs: ["Perimeter (units of length)", "The four side lengths shown on the edge"],
        analogy_limits: [
          {
            breaks: "Sides are always whole numbers of grid squares",
            reality: "Real sides can be **2.5 m** or **0.3 cm**. The rule 2 × (width + height) still works for any length."
          },
          {
            breaks: "Perimeter counts the squares along the edge",
            reality: "Perimeter measures **grid lines (length)**, not squares. Corner squares are not counted twice or at all."
          }
        ],
        state_transition_bridge: {
          source_state: "Two separate side lengths (width and height)",
          bridge_condition: "Walk all four sides once: width + height + width + height",
          target_state: "Perimeter: one total distance around the rectangle",
          return_feedback_loop: "Unit 2 reuses the same width and height to fill the inside instead of walking the edge"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (width)", real_mechanism: "Length of the top and bottom sides" },
            { control: "dial2 (height)", real_mechanism: "Length of the left and right sides" }
          ],
          adversarial_question: "If a beginner takes the grid literally, will they count the edge squares instead of the edge length?",
          mitigation: "The edge is drawn on the grid lines with side-length labels, and the analogy limits state that perimeter is a length, not a count of squares."
        },
        boundary_truth_table: {
          min_min: { dials: { width: 1, height: 1 }, expected_output: "1 × 1 square: perimeter 4." },
          max_min: { dials: { width: 8, height: 1 }, expected_output: "8 × 1 strip: perimeter 18." },
          min_max: { dials: { width: 1, height: 8 }, expected_output: "1 × 8 strip: perimeter 18 (same as 8 × 1, just turned)." },
          max_max: { dials: { width: 8, height: 8 }, expected_output: "8 × 8 square: perimeter 32." },
          zero_edge_case: {
            dials: { width: 1, height: 1 },
            expected_output: "The dials stop at 1: a side of 0 would make a line with no inside, so it is not a rectangle."
          }
        },
        target_experiment: { dial1: 5, dial2: 3, label: "Set Width = 5 & Height = 3" },
        whatif_experiment: { dial1: 8, dial2: 1, label: "Set Width = 8 & Height = 1" },
        boundary_rule: "Perimeter = 2 × (width + height); both sides at least 1."
      },
      how_why_challenge: {
        instruction: "Experiment: set Width = 5 and Height = 3 (or tap the one-tap button), then answer Part 1 and Part 2:",
        part1_how_question: "Part 1 (HOW · Prediction): What is the perimeter of a 5 × 3 rectangle?",
        part1_choices: [
          { id: "p16", label: "16 units", correct: true },
          { id: "p15", label: "15 units", correct: false },
          { id: "p8", label: "8 units", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why is that the perimeter?",
        part2_placeholder: "e.g., Because you go around all four sides…",
        qa_personas: [
          {
            name: "Persona A: Mastery (adds all four sides)",
            d1: 5,
            d2: 3,
            how_choice: "p16",
            why_text: "Because you walk around all four sides: 5 + 3 + 5 + 3, and opposite sides are equal so it's 2 times 8 = 16."
          },
          {
            name: "Persona B: Misconception (multiplies width by height)",
            d1: 5,
            d2: 3,
            how_choice: "p16",
            why_text: "Because you multiply the width by the height to get the perimeter."
          },
          {
            name: "Persona C: Ambiguous ('because of the shape')",
            d1: 5,
            d2: 3,
            how_choice: "p16",
            why_text: "Because of the shape."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 16 units (5 + 3 + 5 + 3).",
          check_b_mechanism: "Explains that perimeter adds every side's length (all four sides / twice width plus height).",
          known_misconceptions: [
            {
              tag: "perimeter_is_width_times_height",
              triggers: ["multiply the width", "width times height", "width times the height", "5 times 3", "5 x 3", "5×3", "length times width"],
              explanation: "Multiplying width × height counts the squares inside (area), not the distance around the edge."
            }
          ],
          check_b_keywords: ["around", "all four", "four sides", "4 sides", "every side", "opposite", "edge", "add", "+", "twice", "double", "2 times", "2 ×", "2x"],
          misconception_keywords: ["multiply the width", "width times height"],
          followup_question: "Good start! What do you do with the four side lengths of the rectangle to get the perimeter?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Watch the highlighted edge on the 5 × 3 rectangle. Walk it: top 5, right 3, bottom 5, left 3. Perimeter adds every side: 5 + 3 + 5 + 3 = 16."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): A new shape, no hints.",
        scenario: "A garden bed is a long strip: Width = 8, Height = 1.",
        question: "Tap '⚡ Set Width = 8 & Height = 1' above. What is the perimeter of the strip?",
        options: [
          { label: "8 units", correct: false, feedback: "8 is the area (squares inside). Walk the edge instead: 8 + 1 + 8 + 1." },
          { label: "18 units", correct: true, feedback: "🎉 Independent mastery! 8 + 1 + 8 + 1 = 18. Next: what fills the inside?" },
          { label: "9 units", correct: false, feedback: "That's only half way round (8 + 1). Keep walking the other two sides." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Sides are always whole numbers of grid squares",
            reality: "Real sides can be **2.5 m** or **0.3 cm**. The rule 2 × (width + height) still works for any length."
          },
          {
            breaks: "Perimeter counts the squares along the edge",
            reality: "Perimeter measures **grid lines (length)**, not squares."
          }
        ],
        next_unit: "Next in Unit 2: the same rectangle, but now we fill the inside.",
        next_unit_idx: 1,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 2
    {
      unit_num: 2,
      topic_id: "avp_unit2_area",
      short_tab: "Unit 2 · Area",
      sub_tab: "Fill the Inside",
      title: "Unit 2 (Area): Rows × Columns of Squares",
      purpose_hook: "Tiles, carpet, paint, paper: any time you cover something, you need area.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict the area of a rectangle from its width and height, and explain why multiplying counts the squares inside.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 2: the rectangle's inside (unit squares)" },
      what_gate: {
        prompt: "Step 1 (WHAT): Look at the squares filling the rectangle above.",
        question: "What does the area of a rectangle measure?",
        options: [
          {
            id: "squares",
            label: "How many unit squares cover its inside",
            correct: true,
            feedback: "Yes. Area counts squares, so it's measured in square units (m², cm²)."
          },
          {
            id: "edge",
            label: "How far it is around the edge",
            correct: false,
            feedback: "That's perimeter (Unit 1). Area is about the inside."
          },
          {
            id: "height",
            label: "How tall it is",
            correct: false,
            feedback: "Height is just one side. Area covers the whole flat surface."
          }
        ]
      },
      object_spec: {
        type: "avp_rectangle_grid",
        layer: "area",
        parts: ["Unit grid (1×1 squares)", "Rectangle", "Filled squares (rows × columns)", "Row and column counts"],
        connections: [
          "Width sets how many squares sit in each row",
          "Height sets how many rows there are",
          "Every row holds the same number of squares"
        ],
        dials: {
          dial1: { key: "width", label: "↔️ Width (squares per row)", min: 1, max: 8, default: 3, unit: "units" },
          dial2: { key: "height", label: "↕️ Height (number of rows)", min: 1, max: 8, default: 2, unit: "units" }
        },
        rules: [
          "Area = width × height (rows × squares per row).",
          "Boundary condition: width and height are at least 1, so the smallest area is 1 square."
        ],
        outputs: ["Area (square units)", "Rows and squares-per-row shown on the grid"],
        analogy_limits: [
          {
            breaks: "Area only works for whole squares",
            reality: "A 2.5 × 2 rectangle has area **5**: half squares count too. The rule width × height works for any lengths."
          },
          {
            breaks: "Every shape is made of neat rows",
            reality: "Triangles and circles have area too, but need **different formulas**. Rows × columns is the rectangle's rule."
          }
        ],
        state_transition_bridge: {
          source_state: "Width (squares per row) and height (number of rows)",
          bridge_condition: "Repeat the same row height times: width × height",
          target_state: "Area: the total count of unit squares covering the inside",
          return_feedback_loop: "Unit 3 fixes the perimeter from Unit 1 and watches this area change with shape"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (width)", real_mechanism: "Number of unit squares in each row" },
            { control: "dial2 (height)", real_mechanism: "Number of rows of squares" }
          ],
          adversarial_question: "If a beginner takes the grid literally, will they think area only exists for whole squares?",
          mitigation: "Analogy limits show half-squares and non-rectangle shapes still have area; only the counting method changes."
        },
        boundary_truth_table: {
          min_min: { dials: { width: 1, height: 1 }, expected_output: "1 row of 1 square: area 1." },
          max_min: { dials: { width: 8, height: 1 }, expected_output: "1 row of 8: area 8." },
          min_max: { dials: { width: 1, height: 8 }, expected_output: "8 rows of 1: area 8 (same as 8 × 1, turned)." },
          max_max: { dials: { width: 8, height: 8 }, expected_output: "8 rows of 8: area 64." },
          zero_edge_case: {
            dials: { width: 1, height: 1 },
            expected_output: "The dials stop at 1: with 0 rows or 0 squares per row there is no inside, so area would be 0."
          }
        },
        target_experiment: { dial1: 4, dial2: 3, label: "Set Width = 4 & Height = 3" },
        whatif_experiment: { dial1: 8, dial2: 3, label: "Set Width = 8 & Height = 3" },
        boundary_rule: "Area = width × height; both at least 1."
      },
      how_why_challenge: {
        instruction: "Experiment: set Width = 4 and Height = 3 (or tap the one-tap button), then answer Part 1 and Part 2:",
        part1_how_question: "Part 1 (HOW · Prediction): What is the area of a 4 × 3 rectangle?",
        part1_choices: [
          { id: "a14", label: "14 square units", correct: false },
          { id: "a12", label: "12 square units", correct: true },
          { id: "a7", label: "7 square units", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why is that the area?",
        part2_placeholder: "e.g., Because there are 3 rows of…",
        qa_personas: [
          {
            name: "Persona A: Mastery (rows × squares per row)",
            d1: 4,
            d2: 3,
            how_choice: "a12",
            why_text: "Because there are 3 rows with 4 squares in each row, so 3 times 4 = 12 squares cover the inside."
          },
          {
            name: "Persona B: Misconception (adds around the edge)",
            d1: 4,
            d2: 3,
            how_choice: "a12",
            why_text: "Because you add the sides all the way around the edge."
          },
          {
            name: "Persona C: Ambiguous ('it's a rectangle')",
            d1: 4,
            d2: 3,
            how_choice: "a12",
            why_text: "Because it is a rectangle."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 12 square units (4 × 3).",
          check_b_mechanism: "Explains that area counts the unit squares inside: rows × squares per row (multiplication as repeated rows).",
          known_misconceptions: [
            {
              tag: "area_is_adding_the_edge",
              triggers: ["add the sides", "around the edge", "add up the sides", "perimeter"],
              explanation: "Adding the sides gives the distance around (perimeter), not the squares covering the inside."
            }
          ],
          check_b_keywords: ["rows", "row", "columns", "squares", "times", "multiply", "×", "cover", "inside", "fill", "count"],
          misconception_keywords: ["add the sides", "around the edge"],
          followup_question: "You're on the right track! How many squares are in each row, and how many rows are there?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Look at the 4 × 3 rectangle row by row: row 1 has 4 squares, row 2 has 4, row 3 has 4. That's 4 + 4 + 4 = 3 × 4 = 12 squares inside."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): Change one dial, no hints.",
        scenario: "You double the width of the 4 × 3 rectangle to 8, keeping the height at 3.",
        question: "Tap '⚡ Set Width = 8 & Height = 3' above. What happens to the area?",
        options: [
          { label: "It goes up by 4, to 16", correct: false, feedback: "Each of the 3 rows gets 4 more squares, so that's 12 more, not 4." },
          { label: "It doubles, to 24", correct: true, feedback: "🎉 Independent mastery! Every row doubles, so the area doubles: 8 × 3 = 24." },
          { label: "It stays 12", correct: false, feedback: "The rectangle got wider, so each row holds more squares." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "Area only works for whole squares",
            reality: "A 2.5 × 2 rectangle has area **5**: half squares count too."
          },
          {
            breaks: "Every shape is made of neat rows",
            reality: "Triangles and circles have area too, but need **different formulas**."
          }
        ],
        next_unit: "Next in Unit 3: keep the fence the same length and watch the inside change.",
        next_unit_idx: 2,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    },

    // ------------------------------------------------------------------ Unit 3
    {
      unit_num: 3,
      topic_id: "avp_unit3_tradeoff",
      short_tab: "Unit 3 · Trade-off",
      sub_tab: "Same Fence, Different Space",
      title: "Unit 3 (Trade-off): Same Perimeter, Different Area",
      purpose_hook: "Planning a pen, a garden or a room: the shape decides how much space your fence or walls give you.",
      lesson_version: "1.0.0",
      rubric_version: "1.0.0",
      objective:
        "Predict which rectangle with a fixed perimeter has the largest area, and explain why shape changes area when the edge stays the same.",
      system_model_layer: { root_system_id: ROOT, layer_focus: "Layer 3: edge held fixed, inside free to change" },
      what_gate: {
        prompt: "Step 1 (WHAT): The half-fence dial sets width + height, so the full fence is twice that.",
        question: "If you keep the fence the same length and change the width, what must happen to the height?",
        options: [
          {
            id: "same",
            label: "The height stays the same",
            correct: false,
            feedback: "Then the fence would get longer. Width + height has to stay the same."
          },
          {
            id: "trade",
            label: "The height shrinks as the width grows, so width + height stays the same",
            correct: true,
            feedback: "Right. A fixed fence means width and height trade off against each other."
          },
          {
            id: "grow",
            label: "The height grows too",
            correct: false,
            feedback: "Both growing would need more fence, and the fence is fixed."
          }
        ]
      },
      object_spec: {
        type: "avp_rectangle_grid",
        layer: "tradeoff",
        parts: ["Unit grid", "Rectangle", "Fixed-length fence (perimeter)", "Area counter", "Area-vs-width bar"],
        connections: [
          "Half-fence = width + height, so perimeter = 2 × half-fence stays fixed",
          "Width sets the top side; height is whatever fence is left: half-fence − width",
          "Area = width × height changes as the shape changes"
        ],
        dials: {
          dial1: { key: "width", label: "↔️ Width", min: 1, max: 11, default: 1, unit: "units" },
          dial2: { key: "half_fence", label: "🪵 Half-fence (width + height)", min: 2, max: 12, default: 6, unit: "units" }
        },
        rules: [
          "Height = half-fence − width; perimeter = 2 × half-fence (fixed by the fence).",
          "Area = width × height; for a fixed half-fence it is largest when width = height (a square).",
          "Termination condition: if width ≥ half-fence, no height is left, so no rectangle can be built."
        ],
        outputs: ["Perimeter (fixed)", "Height (what's left)", "Area (changes with shape)", "Whether a rectangle is possible"],
        analogy_limits: [
          {
            breaks: "The best shape is always a square",
            reality: "Among **rectangles**, yes. A **circle** encloses even more area for the same perimeter."
          },
          {
            breaks: "Widths are always whole numbers",
            reality: "With 10 m of fence, the best rectangle is **2.5 × 2.5**, not a whole-number shape. The grid hides in-between widths."
          }
        ],
        state_transition_bridge: {
          source_state: "A fixed fence length (perimeter from Unit 1)",
          bridge_condition: "Choose a width; the height becomes half-fence − width",
          target_state: "A different area for each shape (Unit 2's width × height)",
          return_feedback_loop: "Picking the squarest shape feeds back into real choices: most space for the least fence"
        },
        literal_take_audit: {
          phantom_controls_present: false,
          control_mappings: [
            { control: "dial1 (width)", real_mechanism: "Length of the top and bottom sides" },
            { control: "dial2 (half_fence)", real_mechanism: "Half the total fence length (width + height), so perimeter = 2 × this" }
          ],
          adversarial_question: "If a beginner takes the dials literally, will they think they can make the width any size with the same fence?",
          mitigation: "When width reaches the half-fence the drawing shows 'no rectangle possible' instead of a fake shape."
        },
        boundary_truth_table: {
          min_min: { dials: { width: 1, half_fence: 2 }, expected_output: "Fence 4: 1 × 1 square, area 1." },
          max_min: {
            dials: { width: 11, half_fence: 2 },
            expected_output: "Width 11 is longer than the whole half-fence (2): no rectangle possible."
          },
          min_max: { dials: { width: 1, half_fence: 12 }, expected_output: "Fence 24: 1 × 11 strip, area 11." },
          max_max: { dials: { width: 11, half_fence: 12 }, expected_output: "Fence 24: 11 × 1 strip, area 11." },
          zero_edge_case: {
            dials: { width: 6, half_fence: 12 },
            expected_output: "Fence 24: 6 × 6 square, area 36, the biggest possible with that fence."
          }
        },
        target_experiment: { dial1: 5, dial2: 6, label: "Set Width = 5 & Half-fence = 6" },
        whatif_experiment: { dial1: 1, dial2: 8, label: "Set Width = 1 & Half-fence = 8" },
        boundary_rule: "Height = half-fence − width (> 0); area = width × height, largest when width = height."
      },
      how_why_challenge: {
        instruction:
          "Experiment: set Half-fence = 6 (a 12-unit fence) and slide Width from 1 to 5. Watch the area, then answer:",
        part1_how_question: "Part 1 (HOW · Prediction): With a 12-unit fence, which rectangle holds the most area?",
        part1_choices: [
          { id: "thin", label: "5 × 1 (area 5)", correct: false },
          { id: "square", label: "3 × 3 (area 9)", correct: true },
          { id: "equal", label: "They all hold the same area, because the fence is the same", correct: false }
        ],
        part2_why_question: "Part 2 (WHY · Mechanism): Why does that shape hold the most, when the fence is the same?",
        part2_placeholder: "e.g., Because a thin shape uses its fence on…",
        qa_personas: [
          {
            name: "Persona A: Mastery (squarer shape fits more inside)",
            d1: 3,
            d2: 6,
            how_choice: "square",
            why_text: "Because with the same fence a thin shape spends it on long sides with little inside; the closer to a square, the more squares fit inside."
          },
          {
            name: "Persona B: Misconception (same fence means same area)",
            d1: 3,
            d2: 6,
            how_choice: "square",
            why_text: "Because the fence is 12 so the area is always the same."
          },
          {
            name: "Persona C: Ambiguous ('it looks bigger')",
            d1: 3,
            d2: 6,
            how_choice: "square",
            why_text: "Because it looks bigger."
          }
        ],
        rubric: {
          check_a_prediction: "Selects 3 × 3 (area 9) as the largest.",
          check_b_mechanism:
            "Explains that with a fixed perimeter, shape changes the inside: thin shapes waste fence on long sides, squarer shapes enclose more squares.",
          known_misconceptions: [
            {
              tag: "same_perimeter_same_area",
              triggers: ["always the same", "same area", "area is the same", "perimeter decides the area", "fixed area"],
              explanation: "Perimeter and area are independent: the same fence can enclose 5 or 9 square units depending on shape."
            }
          ],
          check_b_keywords: ["square", "closer", "equal sides", "thin", "long sides", "same fence", "inside", "shape", "balanced", "wider", "narrow"],
          misconception_keywords: ["always the same", "same area"],
          followup_question: "Nice pick! What's different about the thin shape compared with the square, when they use the same fence?",
          targeted_replay:
            "🔁 TARGETED REPLAY: Half-fence 6, Width 5 → a 5 × 1 strip: area 5. Now Width 3 → a 3 × 3 square: area 9. Same 12-unit fence, almost double the inside."
        }
      },
      what_if_proof: {
        prompt: "Step 4 (WHAT-IF · Unassisted proof): A longer fence, no hints.",
        scenario: "You now have a 16-unit fence (half-fence 8).",
        question: "Tap '⚡ Set Width = 1 & Half-fence = 8' above and explore. Which pen gives your animals the most space?",
        options: [
          { label: "7 × 1: area 7", correct: false, feedback: "That's the thinnest shape, so it holds the least inside." },
          { label: "Any shape: same fence, same space", correct: false, feedback: "Slide the width: the area changes from 7 up to 16." },
          { label: "4 × 4: area 16", correct: true, feedback: "🎉 Independent mastery! The square wins again: same fence, the most space inside." }
        ]
      },
      connect_bridge: {
        analogy_limits: [
          {
            breaks: "The best shape is always a square",
            reality: "Among **rectangles**, yes. A **circle** encloses even more area for the same perimeter."
          },
          {
            breaks: "Widths are always whole numbers",
            reality: "With 10 m of fence the best rectangle is **2.5 × 2.5**."
          }
        ],
        next_unit: "You've connected the edge, the inside and the trade-off. Time for the recap.",
        next_unit_idx: null,
        next_review: "10 mins (Backwards Review) → Day 1 → Day 3 → Day 7"
      }
    }
  ],

  recap: {
    backwards_question: "Walk it backwards: from Unit 3 to Unit 1, which chain is right?",
    backwards_options: [
      {
        label: "Same fence, different space (3) ← because area counts squares inside (2) ← while perimeter only adds the edge (1).",
        correct: true
      },
      { label: "Area and perimeter are two names for the same measurement.", correct: false }
    ],
    hook_placeholder: "Write your 1-sentence takeaway (e.g. 'Perimeter goes around, area fills in')…"
  },

  apply: {
    placeholder: "What will you measure? (e.g. my bedroom floor, a garden bed)",
    steps: [
      { label: "Perimeter", text: "Measure every side and add them up. That's how much edging, skirting or fence you need." },
      { label: "Area", text: "Multiply width × height. That's how much carpet, paint or seed you need." },
      { label: "Units", text: "Write metres (m) for the edge and square metres (m²) for the inside. They're different things." },
      { label: "Trade-off", text: "If the edge is fixed (e.g. 20 m of fence), make the shape as square as you can for the most space." }
    ]
  }
};
