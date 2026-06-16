import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillars, totalServices } from "@/lib/services";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";
import { clsx } from "@/lib/clsx";

/** Bento spans — two wide feature cells, two compact cells. */
const spans = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
];

export function ServicesPreview() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            What we do
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            One team, every lever of growth
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            {totalServices} services across four pillars. Pick a single service
            or hand us the whole engine.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.services[0].icon;
            const wide = spans[i] === "lg:col-span-4";
            return (
              <Reveal key={pillar.id} delay={(i % 2) * 0.08} variant="scale" className={spans[i]}>
                <Tilt className="h-full rounded-2xl">
                <Link
                  href={`/services?p=${pillar.id}`}
                  className="group surface relative flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-on-accent">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <span className="font-display text-sm font-semibold text-faint">
                      0{i + 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl font-bold text-ink">
                        {pillar.name}
                      </h3>
                      <span className="shrink-0 text-xs text-faint">
                        {pillar.services.length} services
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {pillar.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pillar.services
                      .slice(0, wide ? 6 : 3)
                      .map((s) => (
                        <span
                          key={s.title}
                          className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted"
                        >
                          {s.title}
                        </span>
                      ))}
                    {pillar.services.length > (wide ? 6 : 3) && (
                      <span className="px-1 py-1 text-xs text-faint">
                        +{pillar.services.length - (wide ? 6 : 3)} more
                      </span>
                    )}
                  </div>

                  <span
                    className={clsx(
                      "mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand",
                    )}
                  >
                    View services
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
