"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/motion/gsap";
import { projects } from "@/lib/work";
import { clsx } from "@/lib/clsx";

/**
 * Where you are in the portfolio. A real navigation list — every chapter is a
 * link to its anchor — with the current one marked. The scroll-linked fill is
 * decoration on top; the labels are always there and always readable.
 *
 * Wide screens only: below `2xl` the content column reaches too far left for
 * the rail to sit beside it, and the page headings already do the job.
 */
export function PortfolioRail() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const fill = ref.current?.querySelector("[data-rail-fill]");
      // Selector strings inside useGSAP are scoped to `ref`; the chapters live
      // elsewhere in the document, so look them up directly.
      const triggers = projects
        .map((project, i) => {
          const target = document.getElementById(project.slug);
          if (!target) return null;
          return ScrollTrigger.create({
            trigger: target,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: ({ isActive }) => {
              if (isActive) setActive(i);
            },
          });
        })
        .filter(Boolean) as ScrollTrigger[];

      const portfolio = document.querySelector<HTMLElement>("[data-portfolio]");
      const progress = portfolio
        ? ScrollTrigger.create({
            trigger: portfolio,
            start: "top center",
            end: "bottom bottom",
            onUpdate: ({ progress: p }) =>
              fill && gsap.set(fill, { scaleY: gsap.utils.clamp(0, 1, p) }),
          })
        : null;

      return () => {
        triggers.forEach((t) => t.kill());
        progress?.kill();
      };
    },
    { scope: ref },
  );

  return (
    <nav
      ref={ref}
      aria-label="Case studies"
      className="pointer-events-none fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 2xl:block"
    >
      <div className="relative flex gap-4">
        <span
          aria-hidden
          className="relative mt-1.5 block w-px shrink-0 bg-line-2"
          style={{ height: `${projects.length * 2}rem` }}
        >
          <span
            data-rail-fill
            className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-lime-400 to-violet-500"
          />
        </span>
        <ol className="pointer-events-auto space-y-2">
          {projects.map((project, i) => (
            <li key={project.slug} className="h-6">
              <a
                href={`#${project.slug}`}
                aria-current={i === active ? "true" : undefined}
                className={clsx(
                  "flex items-center gap-2 text-[11px] tracking-wide transition-all duration-300",
                  i === active
                    ? "font-semibold text-brand"
                    : "text-faint opacity-60 hover:opacity-100",
                )}
              >
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={clsx(
                    "overflow-hidden whitespace-nowrap transition-all duration-500",
                    i === active ? "max-w-[11rem]" : "max-w-0",
                  )}
                >
                  {project.name}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
