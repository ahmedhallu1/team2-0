"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

const CENTER = 160;
const RADIUS = 118;

/** Five points on a pentagon, first one straight up. */
const NODES = Array.from({ length: 5 }, (_, i) => {
  const angle = (-90 + i * 72) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
});

/**
 * "Five people. One standard." drawn as five forces resolving into the 2.0
 * mark: the nodes arrive, their lines converge on the centre, and the burst
 * locks into place. Abstract on purpose — there are no portraits, names or
 * titles to invent.
 */
export function ConvergeMark({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const spokes = gsap.utils.toArray<SVGLineElement>("[data-spoke]", el);
      const nodes = gsap.utils.toArray<SVGCircleElement>("[data-node]", el);
      const core = el.querySelector("[data-core]");

      // Pin the transform origin before anything animates. Passing `svgOrigin`
      // only in a tween's `to` vars leaves the `from` state measured around the
      // element's own bounding box, and the two disagree by a whole radius.
      gsap.set([...nodes, core], { svgOrigin: `${CENTER} ${CENTER}` });

      spokes.forEach((line) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      tl.fromTo(
        nodes,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: DUR.base,
          ease: EASE.ascent,
          stagger: STAGGER.base,
        },
      )
        .to(
          spokes,
          {
            strokeDashoffset: 0,
            duration: DUR.slow,
            ease: EASE.ascent,
            stagger: STAGGER.base,
          },
          0.24,
        )
        .fromTo(
          core,
          { opacity: 0, rotate: -60, scale: 0.4 },
          {
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: DUR.scene,
            ease: EASE.ascent,
          },
          0.55,
        );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className={clsx("text-ink", className)}>
      <svg viewBox="0 0 320 320" className="h-full w-full">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-[0.12]"
        />

        {NODES.map((node, i) => (
          <line
            key={`spoke-${i}`}
            data-spoke
            x1={node.x}
            y1={node.y}
            x2={CENTER}
            y2={CENTER}
            stroke="var(--violet-500)"
            strokeWidth="1.5"
            className="opacity-50"
          />
        ))}

        {NODES.map((node, i) => (
          <circle
            key={`node-${i}`}
            data-node
            cx={node.x}
            cy={node.y}
            r="7"
            fill="var(--lime-400)"
          />
        ))}

        {/* The system they resolve into */}
        <g data-core>
          <g fill="currentColor">
            {[0, 45, 90, 135].map((a) => (
              <rect
                key={a}
                x={CENTER - 11}
                y={CENTER - 48}
                width="22"
                height="96"
                rx="2"
                transform={`rotate(${a} ${CENTER} ${CENTER})`}
              />
            ))}
          </g>
          <polygon
            points={`${CENTER},${CENTER - 6} ${CENTER + 32},${CENTER + 29} ${
              CENTER + 15
            },${CENTER + 29} ${CENTER},${CENTER + 15} ${CENTER - 15},${
              CENTER + 29
            } ${CENTER - 32},${CENTER + 29}`}
            fill="var(--lime-400)"
          />
        </g>
      </svg>
    </div>
  );
}
