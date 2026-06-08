import { clsx } from "@/lib/clsx";
import { BrandIcon } from "@/components/brand-icon";

/**
 * The "2.0" wordmark lockup: a heavy geometric "2." followed by the brand
 * burst mark (standing in for the "0"). Size it via font-size on `className`.
 */
export function BrandMark({
  className,
  markFill = "currentColor",
  arrowFill,
}: {
  className?: string;
  markFill?: string;
  arrowFill?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-display leading-none font-bold tracking-tight text-ink select-none",
        className,
      )}
      aria-label="2.0"
    >
      <span aria-hidden>2.</span>
      <BrandIcon
        className="ml-[0.05em] h-[0.92em] w-[0.92em]"
        markFill={markFill}
        arrowFill={arrowFill}
      />
    </span>
  );
}
