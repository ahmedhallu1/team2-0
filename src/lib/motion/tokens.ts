/**
 * Motion tokens — the single source of truth for how 2.0 moves.
 *
 * "Controlled Ascent": things arrive from below, resolve radially like the
 * brand burst, and settle precisely. These values mirror the CSS custom
 * properties in globals.css so GSAP timelines and CSS transitions agree.
 */

/** GSAP easing names, mapped to the roles they play. */
export const EASE = {
  /** Entrances — long tail, decisive arrival. Mirrors --ease-ascent. */
  ascent: "expo.out",
  /** Secondary movement and settling. Mirrors --ease-settle. */
  settle: "power3.out",
  /** Symmetrical, mechanical moves (rails, indicators). --ease-precise. */
  precise: "power2.inOut",
  /** Exits — accelerate away. Mirrors --ease-exit. */
  exit: "power2.in",
  /** Rotation of the burst: constant, never eased. */
  linear: "none",
} as const;

/** Durations in seconds (GSAP's unit). */
export const DUR = {
  fast: 0.24,
  base: 0.56,
  slow: 0.82,
  scene: 1.2,
} as const;

/** Travel distances in pixels. */
export const RISE = {
  sm: 12,
  md: 28,
  lg: 64,
} as const;

/** Stagger intervals in seconds. */
export const STAGGER = {
  tight: 0.034,
  base: 0.07,
  loose: 0.11,
} as const;

/** Where a scroll-triggered entrance begins, as a ScrollTrigger `start`. */
export const TRIGGER_START = "top 85%";
