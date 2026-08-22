"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, RISE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

export type Stat = { value: string; label: string };

/** "9,056" → 9056; "9k+" → 9; "Global" → null. */
function leadingNumber(value: string): number | null {
  const match = /^(\d[\d,]*)/.exec(value);
  if (!match) return null;
  const n = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * Proof figures. Each column's rule fills lime as the value settles, so a
 * rising line — not a spinning odometer — carries the sense of progress.
 *
 * Assistive technology only ever sees the final value: the counting text is
 * aria-hidden and the real figure sits beside it in a visually hidden span.
 */
export function StatBand({
  stats,
  className,
  align = "left",
}: {
  stats: Stat[];
  className?: string;
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const columns = gsap.utils.toArray<HTMLElement>("[data-stat]", el);
      const rules = columns.map((c) => c.querySelector(".stat-rule"));
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });

      tl.fromTo(
        rules,
        { scaleX: 0 },
        { scaleX: 1, duration: DUR.slow, ease: EASE.ascent, stagger: STAGGER.base },
      ).fromTo(
        columns,
        { opacity: 0, y: RISE.sm },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.ascent,
          stagger: STAGGER.base,
        },
        0.06,
      );

      columns.forEach((column, i) => {
        const node = column.querySelector<HTMLElement>("[data-stat-value]");
        const raw = node?.dataset.statValue;
        if (!node || !raw) return;
        const target = leadingNumber(raw);
        if (target === null || target === 0) return;

        const suffix = raw.replace(/^\d[\d,]*/, "");
        const grouped = target >= 1000;
        const counter = { n: 0 };
        tl.to(
          counter,
          {
            n: target,
            duration: DUR.scene,
            ease: EASE.precise,
            onUpdate: () => {
              const v = Math.round(counter.n);
              node.textContent =
                (grouped ? v.toLocaleString("en-US") : String(v)) + suffix;
            },
          },
          0.06 + i * STAGGER.base,
        );
      });
    },
    { scope: ref },
  );

  return (
    <dl
      ref={ref}
      className={clsx(
        "rise-group grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-x-8",
        className,
      )}
      style={{ ["--rise-d" as string]: `${RISE.sm}px` } as CSSProperties}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-stat
          className={clsx(align === "center" && "text-center")}
        >
          <span
            aria-hidden
            className="stat-rule block h-px w-full origin-left bg-gradient-to-r from-lime-400 to-violet-500"
          />
          <dt className="mt-4 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-none font-extrabold tracking-tight text-ink">
            <span aria-hidden data-stat-value={stat.value}>
              {stat.value}
            </span>
            <span className="sr-only">{stat.value}</span>
          </dt>
          <dd className="mt-3 text-xs leading-snug text-muted sm:text-sm">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
