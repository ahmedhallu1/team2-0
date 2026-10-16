/**
 * The motion safety net, in two halves.
 *
 * Entrance states (`.rise`, `.curtain`, line masks…) start hidden under `.js`,
 * and only GSAP ever opens them. If the bundle never runs, they must not stay
 * hidden — so `.motion-fallback` forces every one of them open.
 *
 * The timer that adds that class has to live in the inline boot script, which
 * runs before any bundle: a guard started from a React effect can only ever
 * fire when scripting *works*, and then its `!important` rules override the
 * tweens' inline styles and freeze every reveal below the fold in its final
 * state. The app disarms the guard the moment it hydrates.
 */

declare global {
  interface Window {
    __motionGuard?: number;
  }
}

/** Inline-script source: arm the guard. Runs before hydration. */
export const armMotionFallback = `window.__motionGuard=setTimeout(function(){document.documentElement.classList.add("motion-fallback")},4000);`;

/** Called once the app has hydrated: GSAP is live, so the guard must not fire. */
export function disarmMotionFallback(): void {
  if (typeof window === "undefined") return;
  window.clearTimeout(window.__motionGuard);
  window.__motionGuard = undefined;
}
