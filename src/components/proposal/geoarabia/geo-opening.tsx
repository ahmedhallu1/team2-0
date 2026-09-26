import { ArrowDown, MapPin } from "lucide-react";
import { AscentLine } from "@/components/motion/ascent-heading";
import { ContourField } from "@/components/proposal/geoarabia/contour-field";
import { geoarabia } from "@/lib/proposals/geoarabia";
import { shell } from "@/lib/layout";
import { eyebrow } from "@/lib/ui";
import { clsx } from "@/lib/clsx";

/**
 * The first viewport: one idea, stated in the client's own vocabulary. A firm
 * that measures the ground to the millimetre, and is nowhere on the map a buyer
 * actually checks first.
 *
 * A server component with CSS entrances only — the headline is the LCP element
 * and must never wait on hydration (see the perf note on the site's hero).
 */
export function GeoOpening() {
  return (
    <section
      id="opening"
      data-zone="geo"
      aria-labelledby="opening-heading"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32"
    >
      <ContourField scan className="-z-10 opacity-80 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
      <div
        aria-hidden
        className="glow glow--tucked -z-10 -top-48 -right-40 h-[28rem] w-[28rem] sm:h-[44rem] sm:w-[44rem]"
        style={{ ["--glow" as string]: "#2c5aa0" }}
      />

      <div className={shell}>
        <p className={clsx(eyebrow, "enter-rise")} style={{ ["--enter-i" as string]: 0 }}>
          Prepared by 2.0 for GeoArabia · September 2026
        </p>

        <h1
          id="opening-heading"
          className="enter-lines mt-7 font-display text-[clamp(2.5rem,9.5vw,6.25rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-ink"
        >
          <AscentLine style={{ ["--enter-i" as string]: 0 }}>Measured to the millimetre.</AscentLine>
          <AscentLine style={{ ["--enter-i" as string]: 1 }}>
            Missing from the <span className="text-gradient-brand">map.</span>
          </AscentLine>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p
            className="enter-rise max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg lg:col-span-6"
            style={{ ["--enter-i" as string]: 1 }}
          >
            GeoArabia scans buildings, surveys land and turns both into models
            engineers can build from. The people who buy that search for it
            first — on Google, on LinkedIn, and now in AI assistants — and
            today there is nothing there for them to find.
            <span className="mt-3 block text-ink">
              This is the plan to change that, and what it costs.
            </span>
          </p>

          <dl
            className="enter-rise grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:col-span-6"
            style={{ ["--enter-i" as string]: 2 }}
          >
            <div className="bg-surface/90 p-5 sm:p-6">
              <dt className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">
                What they do
              </dt>
              <dd className="mt-3 space-y-1.5">
                {geoarabia.services.map((s) => (
                  <p key={s} className="flex items-center gap-2 text-sm text-ink">
                    <span aria-hidden className="h-1 w-3 rounded-full bg-accent" />
                    {s}
                  </p>
                ))}
              </dd>
              <dd className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-xs text-muted">
                <MapPin size={12} aria-hidden className="text-accent" />
                {geoarabia.district}, {geoarabia.city}
              </dd>
            </div>
            <div className="bg-surface/90 p-5 sm:p-6">
              <dt className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">
                Who buys it
              </dt>
              <dd className="mt-3 space-y-1.5">
                {geoarabia.buyers.map((b) => (
                  <p key={b.name} className="flex items-baseline justify-between gap-3 text-sm text-ink">
                    <span>{b.name}</span>
                    <span lang="ar" dir="rtl" className="text-xs text-faint">
                      {b.arabic}
                    </span>
                  </p>
                ))}
              </dd>
              <dd className="mt-4 border-t border-line pt-3 text-xs text-muted">
                Riyadh first, then the Kingdom.
              </dd>
            </div>
          </dl>
        </div>

        <p
          className="enter-rise mt-12 flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-faint uppercase"
          style={{ ["--enter-i" as string]: 3 }}
        >
          <ArrowDown size={14} aria-hidden className="text-accent" />
          Scroll
          <span aria-hidden className="h-px w-16 bg-line sm:w-28" />
        </p>
      </div>
    </section>
  );
}
