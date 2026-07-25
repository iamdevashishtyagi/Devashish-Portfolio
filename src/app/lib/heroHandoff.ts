// src/app/lib/heroHandoff.ts

/**
 * Single source of truth for the intro → navbar handoff.
 *
 * Every animation in the handoff — the DEVASHISH wordmark shrinking into
 * the navbar slot, the intro backdrop fading into the real Home
 * background, the Hero section's vertical settle, the Hero "window"
 * scale/radius, and the Hero content fade-in — reads its scroll range
 * AND scrub value from here. Sharing one scrub value (whether that's
 * `true` or a number like 2.2) is what keeps them from drifting apart
 * on a fast scroll — the moment any one of them uses a different value,
 * you get the rubber-band effect back.
 */
export const HERO_HANDOFF_DISTANCE = 420; // px of scroll the whole handoff spans

export const HERO_HANDOFF_START = "top top";

// How long the *initial autoplay* takes to move scroll position from 0 -> HERO_HANDOFF_DISTANCE.
export const HERO_HANDOFF_AUTOPLAY_SECONDS = 1.2;

// Shared lag/smoothing (in seconds) for every handoff-linked ScrollTrigger.
// Higher = the shrink-and-travel motion visibly takes longer to settle,
// because the animation keeps easing toward the scroll position instead
// of snapping to it instantly.
export const HERO_HANDOFF_SCRUB = 2.2;

export function heroHandoffScrollTrigger(overrides: Record<string, unknown> = {}) {
  return {
    trigger: document.documentElement,
    start: HERO_HANDOFF_START,
    end: `+=${HERO_HANDOFF_DISTANCE}`,
    scrub: HERO_HANDOFF_SCRUB,
    ...overrides,
  };
}