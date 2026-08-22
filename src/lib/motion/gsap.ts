"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * One registration point for GSAP. Importing this module from a client
 * component guarantees ScrollTrigger and useGSAP are registered exactly once,
 * and keeps every `window` touch behind the "use client" boundary.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Sub-pixel transforms on text cause shimmer during clip-path reveals.
  gsap.config({ nullTargetWarn: false });
}

export { gsap, ScrollTrigger, useGSAP };

/** True when the visitor has asked for less motion. Safe to call in effects. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True on devices with a real pointer — gates hover-only flourishes. */
export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches
  );
}

/**
 * Re-measure every ScrollTrigger once webfonts and above-the-fold images have
 * settled. Called once from the app shell; refreshing later would cause jumps.
 */
export function refreshWhenSettled(): () => void {
  if (typeof window === "undefined") return () => {};

  const timers: number[] = [];
  const refresh = () => ScrollTrigger.refresh();

  if (document.fonts?.status === "loaded") {
    timers.push(window.setTimeout(refresh, 0));
  } else {
    document.fonts?.ready.then(refresh).catch(() => {});
  }

  window.addEventListener("load", refresh, { once: true });
  return () => {
    timers.forEach(clearTimeout);
    window.removeEventListener("load", refresh);
  };
}
