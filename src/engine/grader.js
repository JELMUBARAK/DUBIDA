/**
 * Understanding App — Part B.1: Correction-Friendly Split-Rubric Grader
 * Separates Check A (HOW / Prediction) from Check B (WHY / Causal Mechanism),
 * praises what is right first, detects misconceptions, and asks a single clarifying
 * follow-up when a response is ambiguous.
 */

export function evaluateSplitRubric({
  unit,
  howChoiceId,
  whyText,
  followupAlreadyAsked = false,
  priorHelpUsed = []
}) {
  const hw = unit.how_why_challenge;
  const rubric = hw.rubric;

  const chosenHow = (hw.part1_choices || []).find(c => c.id === howChoiceId);
  const checkAPass = Boolean(chosenHow && chosenHow.correct);

  const normalizedWhy = (whyText || "").toLowerCase().trim();
  const matchedKeywords = (rubric.check_b_keywords || []).filter(k =>
    normalizedWhy.includes(k.toLowerCase())
  );

  // Check against structured known_misconceptions first, then fallback misconception_keywords
  let matchedMisconception = null;
  if (Array.isArray(rubric.known_misconceptions)) {
    for (const m of rubric.known_misconceptions) {
      if ((m.triggers || []).some(t => normalizedWhy.includes(t.toLowerCase()))) {
        matchedMisconception = m;
        break;
      }
    }
  }
  if (!matchedMisconception && Array.isArray(rubric.misconception_keywords)) {
    const kw = rubric.misconception_keywords.find(k => normalizedWhy.includes(k.toLowerCase()));
    if (kw) {
      matchedMisconception = {
        tag: `misconception_${kw.replace(/\s+/g, "_")}`,
        explanation: `Detected misconception trigger '${kw}'.`,
        replay_action: rubric.targeted_replay
      };
    }
  }

  const hasMechanismSignal = matchedKeywords.length >= (rubric.min_keyword_matches || 1);
  const hasMisconception = Boolean(matchedMisconception);
  const helpUsed = [...priorHelpUsed];

  // Single ambiguity follow-up rule:
  // If Check A passes, no misconception was triggered, but mechanism signal is missing/incomplete,
  // and we haven't asked the single clarifying follow-up yet:
  if (checkAPass && !hasMechanismSignal && !hasMisconception && !followupAlreadyAsked) {
    if (!helpUsed.includes("clarifying_followup")) {
      helpUsed.push("clarifying_followup");
    }
    return {
      status: "needs_followup",
      check_a_prediction_pass: true,
      check_b_mechanism_pass: false,
      praise_first: "Spot on with your Part 1 (HOW) prediction!",
      followup_asked: rubric.followup_question,
      misconception_tag: null,
      targeted_replay: null,
      help_used: helpUsed,
      mastery_state: "supported_practice"
    };
  }

  const checkBPass = hasMechanismSignal && !hasMisconception;

  if (!checkAPass || !checkBPass) {
    if (!helpUsed.includes("targeted_visual_replay")) {
      helpUsed.push("targeted_visual_replay");
    }
  }

  let praiseFirst = "";
  if (checkAPass && checkBPass) {
    praiseFirst = "Both your prediction (HOW) and causal mechanism (WHY) are spot on!";
  } else if (checkAPass && !checkBPass) {
    praiseFirst =
      "Your Part 1 prediction (HOW) is completely right! Let's isolate the Part 2 mechanism (WHY) on the visual replay.";
  } else if (!checkAPass && checkBPass) {
    praiseFirst =
      "Your causal rule (WHY) is on the right track — let's check the simulation output for Part 1 (HOW).";
  } else {
    praiseFirst = "Let's run a targeted visual replay to see how the parts interact.";
  }

  // Note: Even when Check A and Check B pass with 0 hints, Independent Mastery is only finalized
  // upon passing Step 4 (What-If Unassisted Proof) with 0 hints, or remains supported_practice if help was used.
  const masteryState = "supported_practice";

  return {
    status: "graded",
    check_a_prediction_pass: checkAPass,
    check_b_mechanism_pass: checkBPass,
    praise_first: praiseFirst,
    followup_asked: followupAlreadyAsked ? rubric.followup_question : null,
    misconception_tag: matchedMisconception ? matchedMisconception.tag : (!checkBPass ? "incomplete_causal_mechanism" : null),
    targeted_replay: !checkAPass || !checkBPass ? rubric.targeted_replay : null,
    matched_keywords: matchedKeywords,
    help_used: helpUsed,
    mastery_state: masteryState
  };
}
