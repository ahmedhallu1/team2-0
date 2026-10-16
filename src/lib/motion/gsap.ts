"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

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
 * Build a scroll scene only once its root comes within a viewport of being
 * seen, instead of during hydration.
 *
 * Creating a tween or ScrollTrigger reads layout and computed style, and every
 * one created writes inline styles that invalidate the next one's read — so a
 * page that builds all of its scenes up front pays a forced reflow per scene,
 * in one long task, before the first tap can be handled (~400ms on a
 * throttled phone). Built on approach, each scene costs the same few
 * milliseconds but lands in its own task, long before it is on screen.
 *
 * One shared observer serves every scene. Its callback runs asynchronously, so
 * deciding *which* scenes are near never forces layout itself.
 */
const pendingScenes = new Map<Element, () => void>();
let sceneObserver: IntersectionObserver | null = null;

export function whenNear(el: Element, build: () => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    build();
    return () => {};
  }
  sceneObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const run = pendingScenes.get(entry.target);
        pendingScenes.delete(entry.target);
        sceneObserver?.unobserve(entry.target);
        run?.();
      }
    },
    // A full viewport of lead in both directions: a scene is built well before
    // a fling can reach it, and deep links that land mid-page still build the
    // scenes above them as the visitor scrolls back up.
    { rootMargin: "100% 0px 100% 0px" },
  );
  pendingScenes.set(el, build);
  sceneObserver.observe(el);
  return () => {
    pendingScenes.delete(el);
    sceneObserver?.unobserve(el);
  };
}

/**
 * `useGSAP` for below-the-fold scenes: `build` runs through `whenNear`, inside
 * the hook's context, so everything it creates is still reverted on unmount.
 */
export function useNearGSAP(
  build: (root: HTMLElement) => void,
  {
    scope,
    dependencies = [],
  }: { scope: RefObject<HTMLElement | null>; dependencies?: unknown[] },
): void {
  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;
      const safeBuild = contextSafe ? contextSafe(() => build(root)) : () => build(root);
      return whenNear(root, safeBuild);
    },
    { scope, dependencies },
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
