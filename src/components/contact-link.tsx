import type { ReactNode } from "react";
import { clsx } from "@/lib/clsx";

/**
 * One contact channel, rendered identically wherever it appears.
 *
 * Email, the two numbers and Instagram used to each carry their own colour,
 * icon size and hover — lime here, muted there, WhatsApp green on one of them —
 * so a single column of four links read as four unrelated components. They all
 * share this shape now: lime glyph, ink label, faint meta, one hover.
 *
 * `srPrefix` is a screen-reader-only lead-in rather than an aria-label, so the
 * accessible name still contains the visible text verbatim (WCAG 2.5.3).
 */
export function ContactLink({
  href,
  icon,
  label,
  meta,
  srPrefix,
  external = false,
  size = "sm",
  className,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  meta?: string;
  srPrefix?: string;
  external?: boolean;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className={clsx(
        "group inline-flex items-center gap-2.5 transition-colors",
        size === "lg" ? "text-[0.95rem]" : "text-sm",
        className,
      )}
    >
      {srPrefix && <span className="sr-only">{srPrefix}</span>}
      <span
        aria-hidden
        className={clsx(
          "flex shrink-0 items-center justify-center text-brand",
          size === "lg" ? "h-[18px] w-[18px]" : "h-4 w-4",
        )}
      >
        {icon}
      </span>
      <span className="text-ink transition-colors group-hover:text-brand">
        {label}
      </span>
      {meta && <span className="text-xs text-faint">{meta}</span>}
    </a>
  );
}
