/**
 * Understanding App — Part B.4: Spaced Transfer Schedule (Unlimited Memory intervals)
 * Intervals: 10 min -> 1 hr -> 1 day -> 3 days -> 7 days -> 14 days -> 30 days
 */

export const SPACED_INTERVALS_MINUTES = [
  { stage: 0, label: "10 min (Backwards Review)", minutes: 10 },
  { stage: 1, label: "1 hr (Same-Day Consolidation)", minutes: 60 },
  { stage: 2, label: "1 day (Sleep Consolidation Transfer)", minutes: 60 * 24 },
  { stage: 3, label: "3 days (Cleared-STM Reconstruction)", minutes: 60 * 24 * 3 },
  { stage: 4, label: "7 days (1-Week Schema Transfer)", minutes: 60 * 24 * 7 },
  { stage: 5, label: "14 days (2-Week Deep Cortex Trace)", minutes: 60 * 24 * 14 },
  { stage: 6, label: "30 days (Master Schema Verification)", minutes: 60 * 24 * 30 }
];

/**
 * Computes the next review ISO-8601 timestamp based on mastery state and current review stage.
 * If Check B (Why) fails on a review, the gap resets to stage 0 (10 min) to rebuild the LTM Arch.
 */
export function computeNextReview({
  masteryState,
  currentStage = 0,
  checkBPass = true,
  now = new Date()
}) {
  const baseTime = now instanceof Date ? now.getTime() : new Date(now).getTime();

  if (masteryState !== "independent_mastery" || !checkBPass) {
    const resetInterval = SPACED_INTERVALS_MINUTES[0];
    return {
      stage: 0,
      interval_label: resetInterval.label,
      requires_fresh_what_if_variant: true,
      starts_with_backwards_review: true,
      next_review_at: new Date(baseTime + resetInterval.minutes * 60 * 1000).toISOString()
    };
  }

  const boundedStage = Math.max(0, Math.min(SPACED_INTERVALS_MINUTES.length - 1, currentStage));
  const selected = SPACED_INTERVALS_MINUTES[boundedStage];
  return {
    stage: boundedStage,
    interval_label: selected.label,
    requires_fresh_what_if_variant: true,
    starts_with_backwards_review: boundedStage === 0,
    next_review_at: new Date(baseTime + selected.minutes * 60 * 1000).toISOString()
  };
}
