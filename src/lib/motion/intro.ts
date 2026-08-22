"use client";

/**
 * Whether the brand intro plays at all.
 *
 * The loader and the hero are no longer coupled through a shared timeline: the
 * hero's entrance runs from CSS so its copy — the page's LCP element — never
 * waits for JavaScript. What still has to be decided before first paint is
 * whether a loader is coming, because that changes the hero's own timing.
 */

/**
 * True when no loader will play this navigation — a repeat visit inside the
 * session, or a reduced-motion visitor. Set before paint by the inline script
 * in the root layout, so there is never a flash of the wrong state and the
 * hero can shorten its delays to match.
 */
export function introSkipped(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("intro-skip")
  );
}

/** Marks the session so the next hard load inside it skips the full intro. */
export function rememberIntroPlayed(): void {
  try {
    sessionStorage.setItem("intro", "1");
  } catch {
    /* private mode — the intro simply plays again, which is harmless */
  }
}
