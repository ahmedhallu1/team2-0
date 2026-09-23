import { ArrowDown } from "lucide-react";
import { AscentLine } from "@/components/motion/ascent-heading";
import { shell } from "@/lib/layout";
import { eyebrow } from "@/lib/ui";
import { clsx } from "@/lib/clsx";
import { kuphub, linkup } from "@/lib/proposals/kuphub";

/**
 * The first viewport. Deliberately almost empty.
 *
 * This page is walked through out loud, so the opening's job is to put one idea
 * on screen and then get out of the way — the idea being that the two
 * businesses are not two proposals, because they already share an object.
 *
 * A server component with a CSS entrance, for the same reason as the site's own
 * hero: this headline is the LCP element and must not wait for hydration.
 */
export function Opening() {
  return (
    <section
      id="opening"
      data-zone="both"
      aria-labelledby="opening-heading"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32"
    >
      <div
        aria-hidden
        className="ascent-grid -z-10"
        style={{ ["--grid-x" as string]: "7rem", ["--grid-y" as string]: "9rem" }}
      />
      <div
        aria-hidden
        className="glow glow--tucked -z-10 -top-40 -left-40 h-[26rem] w-[26rem] sm:h-[42rem] sm:w-[42rem]"
        style={{ ["--glow" as string]: "#0c4f28" }}
      />
      <div
        aria-hidden
        className="glow glow--tucked -z-10 top-1/3 -right-40 h-[24rem] w-[24rem] sm:h-[38rem] sm:w-[38rem]"
        style={{ ["--glow" as string]: "#e9a13b" }}
      />

      <div className={shell}>
        <p
          className={clsx(eyebrow, "enter-rise")}
          style={{ ["--enter-i" as string]: 0 }}
        >
          Prepared by 2.0 · September 2026
        </p>

        <h1
          id="opening-heading"
          className="enter-lines mt-7 font-display text-[clamp(2.6rem,10vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-ink"
        >
          <AscentLine style={{ ["--enter-i" as string]: 0 }}>Two businesses.</AscentLine>
          <AscentLine style={{ ["--enter-i" as string]: 1 }}>
            One <span className="text-gradient-brand">cup</span> between them.
          </AscentLine>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p
            className="enter-rise max-w-xl text-base leading-relaxed text-pretty text-muted lg:col-span-6 sm:text-lg"
            style={{ ["--enter-i" as string]: 1 }}
          >
            LinkUp Egypt manufactures the cup. KUPHUB fills it. Same city, same
            object, same customer — and two digital presences that haven&apos;t
            caught up with either business yet.
            <span className="mt-3 block text-ink">
              This is what we&apos;d build.
            </span>
          </p>

          <dl
            className="enter-rise grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:col-span-6"
            style={{ ["--enter-i" as string]: 2 }}
          >
            {[kuphub, linkup].map((brand) => (
              <div key={brand.key} className="bg-surface p-5 sm:p-6">
                <dt className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      background: brand.key === "kuphub" ? "#0c4f28" : "#e9a13b",
                      boxShadow: "0 0 0 1px var(--line-2)",
                    }}
                  />
                  <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                    {brand.name}
                  </span>
                </dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-muted">
                  {brand.role}
                </dd>
                <dd className="mt-4 space-y-1 border-t border-line pt-3">
                  {brand.channels.map((c) => (
                    <p key={c.label} className="text-xs text-faint">
                      <span className="text-muted">{c.label}</span> — {c.detail}
                    </p>
                  ))}
                </dd>
              </div>
            ))}
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
