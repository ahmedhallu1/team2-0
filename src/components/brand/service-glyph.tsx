"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * Five glyphs, one geometry.
 *
 * Every service gets a distinct motion metaphor, but each is a reading of the
 * same eight-arm burst rather than an unrelated illustration:
 *
 *   brand      converge  — arms draw inward and resolve into the mark
 *   web        lattice   — arms extend and cross into structure
 *   marketing  ascend    — the chevron repeats upward, compounding
 *   leads      target    — the ray field narrows to a single point
 *   events     broadcast — the mark pulses outward into the room
 */

const ARM_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function Arm({ angle, children }: { angle: number; children: ReactNode }) {
  return <g transform={`rotate(${angle} 50 50)`}>{children}</g>;
}

export function ServiceGlyph({
  id,
  className,
  strokeWidth = 2,
}: {
  id: string;
  className?: string;
  strokeWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const q = (sel: string) => gsap.utils.toArray<SVGElement>(sel, el);

      // Every group rotates or scales about the glyph's centre. Set that once
      // up front — declaring it only inside a `to` makes GSAP measure the
      // `from` state around a different origin and the shape jumps.
      gsap.set(q("[data-g]"), { svgOrigin: "50 50" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });

      switch (id) {
        case "brand":
          tl.fromTo(
            q("[data-g='arm']"),
            { y: -26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.slow,
              ease: EASE.ascent,
              stagger: STAGGER.tight,
            },
          ).fromTo(
            q("[data-g='chevron']"),
            { yPercent: 40, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.ascent },
            "-=0.35",
          );
          break;

        case "web":
          tl.fromTo(
            q("[data-g='bar']"),
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: DUR.slow,
              ease: EASE.ascent,
              stagger: STAGGER.base,
            },
          ).fromTo(
            q("[data-g='node']"),
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: DUR.base,
              ease: EASE.ascent,
              stagger: STAGGER.tight,
            },
            "-=0.4",
          );
          break;

        case "marketing":
          tl.fromTo(
            q("[data-g='step']"),
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.slow,
              ease: EASE.ascent,
              stagger: STAGGER.loose,
            },
          );
          break;

        case "leads":
          tl.fromTo(
            q("[data-g='ray']"),
            { y: -18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.slow,
              ease: EASE.ascent,
              stagger: { each: STAGGER.tight, from: "edges" },
            },
          ).fromTo(
            q("[data-g='point']"),
            { scale: 0 },
            { scale: 1, duration: DUR.base, ease: EASE.ascent },
            "-=0.3",
          );
          break;

        case "events":
          tl.fromTo(
            q("[data-g='core']"),
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: DUR.base,
              ease: EASE.ascent,
            },
          ).fromTo(
            q("[data-g='pulse']"),
            { scale: 0.35, opacity: 0.9 },
            {
              scale: 1,
              opacity: 0,
              duration: DUR.scene,
              ease: EASE.ascent,
              stagger: STAGGER.loose,
            },
            "-=0.3",
          );
          break;
      }
    },
    { scope: ref, dependencies: [id] },
  );

  return (
    <div ref={ref} aria-hidden className={clsx("text-brand", className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {id === "brand" && (
          <>
            {ARM_ANGLES.map((a) => (
              <Arm key={a} angle={a}>
                <rect
                  data-g="arm"
                  x={50 - strokeWidth * 1.4}
                  y="10"
                  width={strokeWidth * 2.8}
                  height="30"
                  rx={strokeWidth / 2}
                  fill="currentColor"
                />
              </Arm>
            ))}
            <polygon
              data-g="chevron"
              points="50,42 66,60 58,60 50,50 42,60 34,60"
              fill="var(--lime-400)"
            />
          </>
        )}

        {id === "web" && (
          <>
            {[0, 45, 90, 135].map((a) => (
              <Arm key={a} angle={a}>
                <rect
                  data-g="bar"
                  x={49 - strokeWidth / 2}
                  y="10"
                  width={strokeWidth}
                  height="80"
                  rx={strokeWidth / 2}
                  fill="currentColor"
                />
              </Arm>
            ))}
            {/* Radii chosen so the outermost square still fits the viewBox
                once rotated 45° (34 × √2 ≈ 48). */}
            {[14, 24, 34].map((r) => (
              <rect
                key={r}
                data-g="node"
                x={50 - r}
                y={50 - r}
                width={r * 2}
                height={r * 2}
                rx="3"
                fill="none"
                stroke="var(--violet-500)"
                strokeWidth={strokeWidth * 0.75}
                transform={`rotate(45 50 50)`}
              />
            ))}
          </>
        )}

        {id === "marketing" &&
          [0, 1, 2].map((i) => (
            <polygon
              key={i}
              data-g="step"
              points={`50,${20 + i * 24} 74,${44 + i * 24} 64,${44 + i * 24} 50,${
                30 + i * 24
              } 36,${44 + i * 24} 26,${44 + i * 24}`}
              fill={i === 0 ? "var(--lime-400)" : "currentColor"}
              opacity={i === 0 ? 1 : 0.55 - i * 0.12}
            />
          ))}

        {id === "leads" && (
          <>
            {ARM_ANGLES.map((a) => (
              <Arm key={a} angle={a}>
                <rect
                  data-g="ray"
                  x={49 - strokeWidth / 2}
                  y="6"
                  width={strokeWidth}
                  height="24"
                  rx={strokeWidth / 2}
                  fill="currentColor"
                  opacity="0.55"
                />
              </Arm>
            ))}
            <circle
              data-g="point"
              cx="50"
              cy="50"
              r="11"
              fill="none"
              stroke="var(--violet-500)"
              strokeWidth={strokeWidth}
            />
            <polygon
              data-g="point"
              points="50,40 62,54 55,54 50,47 45,54 38,54"
              fill="var(--lime-400)"
            />
          </>
        )}

        {id === "events" && (
          <>
            {[34, 44].map((r) => (
              <g key={r} data-g="pulse">
                {[0, 45, 90, 135].map((a) => (
                  <Arm key={a} angle={a}>
                    <rect
                      x={50 - r / 3}
                      y={50 - r}
                      width={(r / 3) * 2}
                      height={r * 2}
                      rx="2"
                      fill="none"
                      stroke="var(--violet-500)"
                      strokeWidth={strokeWidth * 0.7}
                    />
                  </Arm>
                ))}
              </g>
            ))}
            <g data-g="core">
              {[0, 45, 90, 135].map((a) => (
                <Arm key={a} angle={a}>
                  <rect
                    x="44"
                    y="22"
                    width="12"
                    height="56"
                    rx="1.5"
                    fill="currentColor"
                  />
                </Arm>
              ))}
              <polygon
                points="50,44 66,62 57,62 50,52 43,62 34,62"
                fill="var(--lime-400)"
              />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
