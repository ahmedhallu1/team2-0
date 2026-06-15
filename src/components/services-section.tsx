import { pillars, totalServices } from "@/lib/services";
import { Reveal } from "@/components/reveal";

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
      <div
        aria-hidden
        className="glow-violet absolute top-32 -right-32 -z-10 h-96 w-96 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            What we do
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            One team, every lever of growth
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            A full-stack B2B services team — {totalServices} services across four
            pillars. Pick a single service or hand us the whole engine; we plug
            in wherever you need momentum.
          </p>
        </Reveal>

        {/* Sticky pillar quick-nav */}
        <nav
          aria-label="Service pillars"
          className="sticky top-16 z-30 mx-auto mt-10 -mb-2 flex max-w-full snap-x gap-2 overflow-x-auto rounded-full border border-line bg-bg/80 p-1.5 backdrop-blur-xl sm:top-18 sm:w-fit"
        >
          {pillars.map((pillar, i) => (
            <a
              key={pillar.id}
              href={`#${pillar.id}`}
              className="snap-start rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <span className="text-faint">0{i + 1}</span>{" "}
              <span className="ml-0.5">{pillar.name}</span>
            </a>
          ))}
        </nav>

        {/* Pillars */}
        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
          {pillars.map((pillar, pi) => (
            <div key={pillar.id} id={pillar.id} className="scroll-mt-32">
              <Reveal className="flex flex-col gap-2 border-l-2 border-accent pl-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-bold text-faint">
                    0{pi + 1}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    {pillar.name}
                  </h3>
                </div>
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
                      <article className="surface flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-on-accent">
                            <Icon size={22} strokeWidth={2} />
                          </span>
                          {service.badge && (
                            <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand uppercase">
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
