import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services, totalServices } from "@/lib/services";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";

export function ServicesPreview() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            What we do
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            {`${totalServices} services. That\u2019s the whole list.`}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            Take one of them or hand us the lot — we plug in wherever you need
            momentum.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.07} variant="scale">
                <Tilt className="h-full rounded-2xl">
                  <Link
                    href={`/services#${service.id}`}
                    className="group surface relative flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-on-accent">
                        <Icon size={20} strokeWidth={2} aria-hidden />
                      </span>
                      <span className="font-display text-sm font-semibold text-faint">
                        0{i + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {service.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.includes.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted"
                        >
                          {item}
                        </span>
                      ))}
                      {service.includes.length > 3 && (
                        <span className="px-1 py-1 text-xs text-faint">
                          +{service.includes.length - 3} more
                        </span>
                      )}
                    </div>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand">
                      What&apos;s included
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
