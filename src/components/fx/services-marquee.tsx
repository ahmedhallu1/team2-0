import { capabilities } from "@/lib/services";
import { BrandIcon } from "@/components/brand-icon";

function items() {
  return capabilities.map((s) => (
    <span
      key={s}
      className="inline-flex items-center gap-3 text-2xl font-bold whitespace-nowrap text-faint sm:text-3xl"
    >
      {s}
      <BrandIcon
        aria-hidden
        markFill="var(--violet-500)"
        arrowFill="var(--lime-400)"
        className="h-4 w-4 opacity-80"
      />
    </span>
  ));
}

/** Infinite, seamless ticker of what we deliver. CSS-only; pauses on hover. */
export function ServicesMarquee() {
  return (
    <section
      aria-label="What we deliver"
      className="relative border-y border-line bg-surface/40 py-6 sm:py-8"
    >
      <div className="marquee">
        <div className="marquee__track">{items()}</div>
        <div className="marquee__track" aria-hidden>
          {items()}
        </div>
      </div>
    </section>
  );
}
