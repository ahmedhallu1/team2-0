"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  prefersReducedMotion,
  hasFinePointer,
} from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/** One arm of the burst, drawn as a slender ray between two radii. */
function rays(count: number, inner: number, outer: number, width: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    return (
      <rect
        key={i}
        x={200 - width / 2}
        y={200 - outer}
        width={width}
        height={outer - inner}
        rx={width / 2}
        transform={`rotate(${angle} 200 200)`}
      />
    );
  });
}

/**
 * The hero's signature effect: the 2.0 mark opened out into a field.
 *
 * Three concentric interpretations of the same eight-arm geometry — an outer
 * ray field, a stroked burst, and the solid mark with its lime chevron —
 * counter-rotating at different rates. It reads instantly as the logo, costs
 * three transforms a frame, and never competes with the headline: everything
 * outside the core sits well under 20% opacity.
 */
export function AscentField({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const outer = el.querySelector<SVGGElement>("[data-layer='outer']");
      const mid = el.querySelector<SVGGElement>("[data-layer='mid']");
      const core = el.querySelector<SVGGElement>("[data-layer='core']");
      if (!outer || !mid || !core) return;

      gsap.set([outer, mid, core], { svgOrigin: "200 200" });

      // Continuous, brand-derived rotation: the burst turning in place.
      const spin = gsap.timeline({ repeat: -1 });
      spin
        .to(outer, { rotate: 360, duration: 140, ease: EASE.linear }, 0)
        .to(mid, { rotate: -360, duration: 96, ease: EASE.linear }, 0);

      // Never burn frames on a field nobody can see.
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => (isActive ? spin.play() : spin.pause()),
      });
      const onVisibility = () =>
        document.hidden ? spin.pause() : trigger.isActive && spin.play();
      document.addEventListener("visibilitychange", onVisibility);

      // Scroll deepens the field rather than moving it — the mark recedes.
      gsap.to(el, {
        yPercent: 9,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      let cleanupPointer = () => {};
      if (hasFinePointer()) {
        const xTo = gsap.quickTo(el, "xPercent", { duration: 0.9, ease: EASE.settle });
        const tiltTo = gsap.quickTo(core, "rotate", { duration: 1.2, ease: EASE.settle });
        const onMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          xTo(nx * 2.4);
          tiltTo(nx * 7 + ny * 3);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanupPointer = () => window.removeEventListener("pointermove", onMove);
      }

      return () => {
        cleanupPointer();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className={clsx("pointer-events-none", className)}>
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        {/* Concentric guides — the "rising grid" read radially */}
        <g stroke="currentColor" fill="none" className="text-ink opacity-[0.07]">
          <circle cx="200" cy="200" r="196" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" strokeWidth="1" />
          <circle cx="200" cy="200" r="84" strokeWidth="1" />
        </g>

        {/* Outer ray field — the burst's arms extended outward */}
        <g data-layer="outer" fill="var(--violet-500)" className="opacity-[0.22]">
          {rays(16, 96, 194, 5)}
        </g>

        {/* Mid burst — the mark itself, stroked */}
        <g
          data-layer="mid"
          fill="none"
          stroke="var(--lime-400)"
          strokeWidth="2"
          className="opacity-30"
        >
          <rect x="176" y="96" width="48" height="208" rx="3" />
          <rect
            x="176"
            y="96"
            width="48"
            height="208"
            rx="3"
            transform="rotate(45 200 200)"
          />
          <rect
            x="176"
            y="96"
            width="48"
            height="208"
            rx="3"
            transform="rotate(90 200 200)"
          />
          <rect
            x="176"
            y="96"
            width="48"
            height="208"
            rx="3"
            transform="rotate(135 200 200)"
          />
        </g>

        {/* Core — the solid mark with the lime chevron rising through it */}
        <g data-layer="core">
          <g fill="var(--ink)" className="opacity-90">
            <rect x="188" y="146" width="24" height="108" rx="2" />
            <rect
              x="188"
              y="146"
              width="24"
              height="108"
              rx="2"
              transform="rotate(45 200 200)"
            />
            <rect
              x="188"
              y="146"
              width="24"
              height="108"
              rx="2"
              transform="rotate(90 200 200)"
            />
            <rect
              x="188"
              y="146"
              width="24"
              height="108"
              rx="2"
              transform="rotate(135 200 200)"
            />
          </g>
          <polygon
            points="200,192 236,232 217,232 200,209 183,232 164,232"
            fill="var(--lime-400)"
          />
        </g>
      </svg>
    </div>
  );
}
