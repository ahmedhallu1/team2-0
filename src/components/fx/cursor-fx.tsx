"use client";

import { useEffect } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";

const INTERACTIVE = "a, button, [role='button'], summary, input, select, textarea";

/**
 * Two desktop-only affordances, both cheap: a small halo that eases after the
 * pointer and widens over anything interactive, and the scroll rail across the
 * top. No blurred layer is animated — the halo is a 36px bordered circle, so
 * the compositor moves one tiny element per frame.
 */
export function CursorFx() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const fine = hasFinePointer();

    const rail = document.createElement("div");
    rail.className = "scroll-rail";
    rail.setAttribute("aria-hidden", "true");
    document.body.append(rail);

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.setProperty("--sp", String(h > 0 ? window.scrollY / h : 0));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    let teardownRing = () => {};

    if (fine && !reduce) {
      const ring = document.createElement("div");
      ring.className = "cursor-ring";
      ring.setAttribute("aria-hidden", "true");
      document.body.append(ring);

      const xTo = gsap.quickTo(ring, "x", { duration: 0.38, ease: EASE.settle });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.38, ease: EASE.settle });

      const onMove = (event: PointerEvent) => {
        document.documentElement.classList.add("cursor-ready");
        xTo(event.clientX);
        yTo(event.clientY);
      };
      const onOver = (event: PointerEvent) => {
        const hit = (event.target as Element | null)?.closest?.(INTERACTIVE);
        gsap.to(ring, {
          scale: hit ? 1.9 : 1,
          opacity: hit ? 0.55 : 1,
          duration: 0.28,
          ease: EASE.settle,
        });
      };
      const onLeave = () =>
        document.documentElement.classList.remove("cursor-ready");

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      teardownRing = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(ring);
        ring.remove();
        document.documentElement.classList.remove("cursor-ready");
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      rail.remove();
      teardownRing();
    };
  }, []);

  return null;
}
