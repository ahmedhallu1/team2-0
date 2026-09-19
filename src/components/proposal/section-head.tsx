import type { ReactNode } from "react";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { eyebrow, h2 as h2Class } from "@/lib/ui";
import { measure } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Every chapter of the proposal opens the same way: a numbered label, a
 * two-line heading that rises out of its own baseline, and at most one
 * sentence. The page is presented out loud, so a section that needs a
 * paragraph to explain itself is a section that hasn't been designed yet.
 */
export function SectionHead({
  n,
  label,
  lines,
  lede,
  align = "left",
  headingId,
  children,
}: {
  n: string;
  label: string;
  lines: ReactNode[];
  lede?: ReactNode;
  align?: "left" | "center";
  /** Ties the section's `aria-labelledby` to this heading. */
  headingId?: string;
  children?: ReactNode;
}) {
  return (
    <header className={clsx(align === "center" && "flex flex-col items-center text-center")}>
      <Rise as="p" className={clsx(eyebrow, "flex items-center gap-3")}>
        <span className="text-faint tabular-nums">{n}</span>
        <span aria-hidden className="h-px w-7 bg-line-2" />
        {label}
      </Rise>

      <AscentHeading
        as="h2"
        id={headingId}
        className={clsx(h2Class, "mt-5 max-w-[20ch]", align === "center" && "mx-auto")}
        lines={lines}
      />

      {lede ? (
        <Rise
          as="p"
          delay={0.08}
          className={clsx(
            "mt-6 text-base leading-relaxed text-pretty text-muted",
            measure,
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </Rise>
      ) : null}

      {children}
    </header>
  );
}
