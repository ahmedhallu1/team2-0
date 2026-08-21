import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services, totalServices } from "@/lib/services";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";
import { clsx } from "@/lib/clsx";

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
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-ink sm:text-6xl">
            {`${totalServices} services. That\u2019s the whole list.`}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-pretty text-muted sm:text-lg">
            We kept it to five things we do properly, rather than a menu you have
            to decode. Take one of them, or hand us the whole engine — most
            clients start with one and grow into the rest.
          </p>
        </Reveal>

        {/* Services */}
        <div className="mt-16 space-y-6 sm:mt-20 sm:space-y-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(i % 2) * 0.06}>
                <Tilt className="rounded-2xl">
                  <article
                    id={service.id}
                    className="surface scroll-mt-28 grid gap-6 rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12"
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line">
                          <Icon size={22} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="font-display text-sm font-bold text-faint">
                          0{i + 1}
                        </span>
                      </div>
                      <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-base leading-relaxed text-pretty text-brand">
                        {service.summary}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm leading-relaxed text-pretty text-muted">
                        {service.description}
                      </p>

                      <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-faint uppercase">
                        What&apos;s included
                      </p>
                      <ul
                        className={clsx(
                          "mt-3 grid gap-x-6 gap-y-2.5",
                          service.includes.length > 3 && "sm:grid-cols-2",
                        )}
                      >
                        {service.includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-ink"
                          >
                            <Check
                              size={16}
                              strokeWidth={2.5}
                              className="mt-0.5 shrink-0 text-brand"
                              aria-hidden
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08} className="mt-12 flex justify-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-brand"
          >
            See what this looks like in practice
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
