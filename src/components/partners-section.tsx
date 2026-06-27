import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { partners } from "@/lib/partners";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-lime absolute top-10 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Collaborations
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Partners we&apos;ve grown with
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            A look at the businesses we partner with to build brands, launch
            platforms and open new markets.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-5 sm:mt-14">
          {partners.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.08}
              variant="scale"
              className="w-full sm:w-[24rem]"
            >
              <Tilt className="h-full rounded-2xl">
                <article className="surface relative flex h-full flex-col gap-5 rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7">
                  <div className="flex h-28 items-center justify-center rounded-xl bg-surface-2 p-6 ring-1 ring-line">
                    <Image
                      src={p.logo}
                      alt={`${p.name} logo`}
                      width={p.width}
                      height={p.height}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-bold text-ink">
                      {p.name}
                    </h3>
                    {p.tag && (
                      <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-muted">{p.blurb}</p>

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand"
                    >
                      Visit site
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  )}
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
