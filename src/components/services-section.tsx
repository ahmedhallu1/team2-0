import { pillars } from "@/lib/services";
import { Reveal } from "@/components/reveal";

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-purple absolute top-32 -right-32 -z-10 h-96 w-96 rounded-full opacity-40 blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-lime-400 uppercase">
            What we do
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            One team, every lever of growth
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            A full-stack B2B services team. Pick a single service or hand us the
            whole engine — we plug in wherever you need momentum.
          </p>
        </Reveal>

        {/* Pillars */}
        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
          {pillars.map((pillar) => (
            <div key={pillar.id} id={pillar.id} className="scroll-mt-24">
              <Reveal className="flex flex-col gap-1 border-l-2 border-lime-400 pl-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {pillar.name}
                </h3>
                <p className="text-sm text-muted sm:text-right">
                  {pillar.tagline}
                </p>
              </Reveal>

              <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {pillar.services.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Reveal
                      key={service.title}
                      delay={(i % 3) * 0.07}
                      className="group h-full"
                    >
                      <article className="surface flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors duration-300 hover:border-lime-400/40">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-lime-400 ring-1 ring-white/10 transition-colors group-hover:bg-lime-400 group-hover:text-base-950">
                            <Icon size={22} strokeWidth={2} />
                          </span>
                          {service.badge && (
                            <span className="rounded-full border border-lime-400/40 bg-lime-400/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-lime-400 uppercase">
                              {service.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-lg font-bold text-ink">
                          {service.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-muted">
                          {service.description}
                        </p>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
