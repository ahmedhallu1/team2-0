import { clsx } from "@/lib/clsx";

/**
 * The 2.0 brand mark — an 8-point burst ("flower") whose arms end in forked
 * chevron tips, with the lime up-arrow ("elevate") in the lower centre.
 * Recreated faithfully from the official brand sheet so it recolours, scales
 * and animates cleanly.
 *  - `markFill`   colours the burst (defaults to currentColor)
 *  - `arrowFill`  colours the up-arrow (defaults to brand lime)
 *  - `spinBurst`  rotates just the burst around its centre (used in the loader)
 */
const ARM = "39,6 50,19 61,6 61,94 50,81 39,94";

export function BrandIcon({
  className,
  markFill = "currentColor",
  arrowFill = "var(--color-lime-400, #c6ff34)",
  spinBurst = false,
}: {
  className?: string;
  markFill?: string;
  arrowFill?: string;
  spinBurst?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={clsx("shrink-0", className)}
      fill="none"
      role="img"
      aria-label="2.0"
    >
      <g className={spinBurst ? "spin-burst" : undefined} fill={markFill}>
        <polygon points={ARM} />
        <polygon points={ARM} transform="rotate(45 50 50)" />
        <polygon points={ARM} transform="rotate(90 50 50)" />
        <polygon points={ARM} transform="rotate(135 50 50)" />
      </g>
      <path
        d="M23 73 L50 44 L77 73"
        stroke={arrowFill}
        strokeWidth="18"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
