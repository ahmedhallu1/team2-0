import { CONTOUR_VIEWBOX, contourMajor, contourMinor } from "./contour-paths";
import { clsx } from "@/lib/clsx";

/**
 * GeoArabia's ground: a contour map drawn in hairlines, with index contours in
 * the cover image's cyan. Decorative, so it is hidden from assistive tech and
 * never takes a pointer.
 *
 * `scan` adds the one moving thing on the page — a level line sweeping down
 * the field like a scanner pass. It is a single transformed element (see
 * `.geo-scan` in globals.css), so it costs the compositor and nothing else,
 * and it simply isn't there for anyone who asked for reduced motion.
 */
export function ContourField({
  className,
  scan = false,
}: {
  className?: string;
  scan?: boolean;
}) {
  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg
        viewBox={CONTOUR_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        fill="none"
      >
        <path
          d={contourMinor}
          stroke="color-mix(in srgb, var(--ink) 16%, transparent)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={contourMajor}
          stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {scan ? <span className="geo-scan" /> : null}
    </div>
  );
}
