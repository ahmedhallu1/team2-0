import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillars, totalServices } from "@/lib/services";
import { Reveal } from "@/components/reveal";

export function ServicesPreview() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-lime-400 uppercase">
            What we do
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            One team, every lever of growth
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {totalServices} services across four pillars. Pick a single service
            or hand us the whole engine.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={(i % 2) * 0.08}>
              <Link
                href="/services"
                className="surface group flex h-full flex-col gap-3 rounded-2xl p-6 transition-colors duration-300 hover:border-lime-400/40 sm:p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-ink">
                    {pillar.name}
                  </h3>
                  <span className="shrink-0 text-xs text-faint">
                    {pillar.services.length} services
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  {pillar.tagline}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {pillar.services.slice(0, 4).map((s) => (
                    <span
                      key={s.title}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-muted"
                    >
                      {s.title}
                    </span>
                  ))}
                  {pillar.services.length > 4 && (
                    <span className="px-1 py-1 text-xs text-faint">
                      +{pillar.services.length - 4} more
                    </span>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-lime-400">
                  View services
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
