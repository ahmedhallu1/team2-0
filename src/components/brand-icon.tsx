import { clsx } from "@/lib/clsx";

/**
 * The 2.0 brand mark — an 8-point burst ("flower") of flat rectangular arms,
 * with the bold lime up-arrow ("elevate") through the lower centre. Matches the
 * official brand-sheet mark; recolours, scales and animates cleanly.
 *  - `markFill`   colours the burst (defaults to currentColor)
 *  - `arrowFill`  colours the up-arrow (defaults to brand lime)
 *  - `label`      gives the mark an accessible name; without one it is
 *                 decorative and hidden from assistive technology, which is
 *                 how it is used almost everywhere on the site.
 *
 * The burst and the chevron carry `data-burst` / `data-chevron` so timelines
 * (the loader, the closing CTA) can drive them independently.
 */
export function BrandIcon({
  className,
  markFill = "currentColor",
  arrowFill = "var(--color-lime-400, #c6ff34)",
  label,
}: {
  className?: string;
  markFill?: string;
  arrowFill?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={clsx("shrink-0", className)}
      fill="none"
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true, focusable: false })}
    >
      <g data-burst fill={markFill}>
        <rect x="38" y="6" width="24" height="88" rx="1.5" />
        <rect
          x="38"
          y="6"
          width="24"
          height="88"
          rx="1.5"
          transform="rotate(45 50 50)"
        />
        <rect
          x="38"
          y="6"
          width="24"
          height="88"
          rx="1.5"
          transform="rotate(90 50 50)"
        />
        <rect
          x="38"
          y="6"
          width="24"
          height="88"
          rx="1.5"
          transform="rotate(135 50 50)"
        />
      </g>
      {/* Bold up-arrow with flat leg bottoms, through the lower centre */}
      <polygon
        data-chevron
        points="50,44 79,76 64,76 50,57 36,76 21,76"
        fill={arrowFill}
      />
    </svg>
  );
}
