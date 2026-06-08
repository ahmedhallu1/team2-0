import { clsx } from "@/lib/clsx";

/**
 * The 2.0 brand mark: an 8-point asterisk/burst with an upward chevron,
 * recreated as a crisp, recolorable SVG.
 *  - `markFill`  colours the burst (defaults to currentColor)
 *  - `arrowFill` colours the chevron (defaults to brand lime)
 */
export function BrandIcon({
  className,
  markFill = "currentColor",
  arrowFill = "var(--color-lime-400, #c6ff34)",
}: {
  className?: string;
  markFill?: string;
  arrowFill?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={clsx("shrink-0", className)}
      fill="none"
      role="img"
      aria-label="2.0"
    >
      <g fill={markFill}>
        <rect x="25" y="3" width="14" height="58" rx="1" />
        <rect
          x="25"
          y="3"
          width="14"
          height="58"
          rx="1"
          transform="rotate(45 32 32)"
        />
        <rect
          x="25"
          y="3"
          width="14"
          height="58"
          rx="1"
          transform="rotate(90 32 32)"
        />
        <rect
          x="25"
          y="3"
          width="14"
          height="58"
          rx="1"
          transform="rotate(135 32 32)"
        />
      </g>
      <path
        d="M16 47 L32 29 L48 47"
        stroke={arrowFill}
        strokeWidth="12.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
