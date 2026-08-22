"use client";

import {
  Fragment,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * Headlines arrive line by line from beneath their own baseline, so the copy
 * reads as stacked in depth and lifting into place — the site's core gesture.
 *
 * Lines are authored explicitly rather than measured at runtime: no text
 * splitting, no layout thrash, no dependency on a paid plugin, and the same
 * markup renders on the server.
 */
export function AscentHeading({
  lines,
  as,
  className,
  delay = 0,
  eager = false,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /**
   * Above the fold there is no scroll to wait for, and a heading that only
   * appears after hydration is usually the page's LCP element. `eager` hands
   * the entrance to CSS instead.
   */
  eager?: boolean;
}) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || eager || prefersReducedMotion()) return;
      const inner = el.querySelectorAll<HTMLElement>(".line-mask__inner");
      gsap.fromTo(
        inner,
        // See the note in hero.tsx: the percentage start state resolves to
        // pixels, so the pixel component has to be zeroed alongside yPercent.
        { yPercent: 115, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: DUR.slow,
          ease: EASE.ascent,
          delay,
          stagger: STAGGER.base,
          scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
          onComplete: () => gsap.set(inner, { willChange: "auto" }),
        },
      );
    },
    { scope: ref, dependencies: [delay, eager] },
  );

  return (
    <Tag ref={ref} className={clsx(eager && "enter-lines", className)}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <AscentLine
            style={eager ? { ["--enter-i" as string]: i } : undefined}
          >
            {line}
          </AscentLine>
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * One masked line. Exported for bespoke scenes (the hero) that drive their own
 * timeline but want the same clipping behaviour.
 */
export function AscentLine({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Lets a bespoke scene set its own stagger index (`--hero-i`). */
  style?: CSSProperties;
}) {
  return (
    <span className={clsx("line-mask", className)} style={style}>
      <span className="line-mask__inner">{children}</span>
    </span>
  );
}
