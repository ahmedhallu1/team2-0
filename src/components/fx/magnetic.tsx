"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * A primary action leans toward the pointer — restrained, clamped, and only
 * where there is a real pointer to lean toward. The displacement is capped so
 * the button never leaves the spot the eye put it.
 */
export function Magnetic({
  children,
  className,
  strength = 0.22,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Fraction of the pointer's offset from centre that is followed. */
  strength?: number;
  /** Hard ceiling on displacement, in pixels. */
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !hasFinePointer() || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE.settle });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE.settle });
      const clamp = gsap.utils.clamp(-max, max);

      const onMove = (event: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(clamp((event.clientX - (r.left + r.width / 2)) * strength));
        yTo(clamp((event.clientY - (r.top + r.height / 2)) * strength));
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset, true);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", reset);
        el.removeEventListener("blur", reset, true);
      };
    },
    { scope: ref, dependencies: [strength, max] },
  );

  return (
    <span ref={ref} className={clsx("magnetic inline-flex", className)}>
      {children}
    </span>
  );
}
