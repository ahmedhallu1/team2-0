"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, refreshWhenSettled } from "@/lib/motion/gsap";

/**
 * The app-shell housekeeping that keeps scroll choreography honest:
 *
 *  1. Re-measures every ScrollTrigger once webfonts and the load event settle,
 *     so triggers built against fallback metrics don't fire in the wrong place.
 *  2. Lands deep links (`/work#sodio`) accurately — the browser's own jump
 *     happens before images reserve their space, so we correct it once things
 *     settle, and only if the visitor hasn't taken over scrolling themselves.
 *  3. Guarantees content can never stay hidden: if scripting fails after the
 *     `.js` class lands, `.motion-fallback` forces every entrance state open.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const disposeRefresh = refreshWhenSettled();

    const guard = window.setTimeout(
      () => document.documentElement.classList.add("motion-fallback"),
      4000,
    );

    return () => {
      disposeRefresh();
      clearTimeout(guard);
    };
  }, []);

  // Deep-link correction, re-run per route so hash links keep working.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let taken = false;
    const markTaken = () => {
      taken = true;
    };
    window.addEventListener("wheel", markTaken, { passive: true, once: true });
    window.addEventListener("touchmove", markTaken, { passive: true, once: true });
    window.addEventListener("keydown", markTaken, { once: true });

    const land = () => {
      if (taken) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const timers = [
      window.setTimeout(land, 260),
      window.setTimeout(land, 900),
    ];

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", markTaken);
      window.removeEventListener("touchmove", markTaken);
      window.removeEventListener("keydown", markTaken);
    };
  }, [pathname]);

  // A new route means new triggers measured against a page that may still be
  // settling; one refresh on the next frame keeps their start points true.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
