import { BrandIcon } from "@/components/brand-icon";

/**
 * Brand splash shown on a full page load: the burst ("flower" / the 0 in 2.0)
 * rotates while the lime arrow holds centre, then the overlay fades itself out
 * via CSS (no JS). It lives in the persistent layout, so it only plays on real
 * loads — not on in-app navigations — and is skipped for reduced-motion users.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__glow" />
      <div className="preloader__mark">
        <BrandIcon
          spinBurst
          markFill="var(--ink)"
          arrowFill="var(--accent)"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
