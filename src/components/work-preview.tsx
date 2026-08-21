import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { featuredProject, projects, totalProjects } from "@/lib/work";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";

/** The three projects shown as tiles under the featured case study. */
const tiles = projects.slice(1, 4);

export function WorkPreview() {
  const f = featuredProject;

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-lime absolute top-10 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Portfolio
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Things we&apos;ve actually built
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            Marketplaces, internal systems, brand experiences — {totalProjects}{" "}
            projects that are live and doing a job for the businesses that own
            them.
          </p>
        </Reveal>

        {/* Featured case study */}
        <Reveal delay={0.06} className="mt-12 sm:mt-14">
          <article className="surface overflow-hidden rounded-3xl transition-colors duration-300 hover:border-accent/40 lg:grid lg:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line lg:aspect-auto lg:border-r lg:border-b-0">
              <Image
                src={f.image!}
                alt={f.imageAlt ?? f.name}
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                className="object-cover object-top"
                priority={false}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25"
              />
              <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-black/50 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                Featured
              </span>
            </div>

            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-9">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-muted">
                  {f.category}
                </span>
                {f.client && (
                  <>
                    <span className="text-faint">{f.client}</span>
                    <span className="text-faint">·</span>
                  </>
                )}
                <span className="text-faint">{f.year}</span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {f.name}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-pretty text-muted">
                  {f.tagline}
                </p>
              </div>

              <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-pretty text-ink">
                {f.impact}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={`/work#${f.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  Read the case study
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                {f.href && (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
                  >
                    Visit the site
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                )}
              </div>
            </div>
          </article>
        </Reveal>

        {/* Three more, compact */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08} variant="scale">
              <Tilt className="h-full rounded-2xl">
                <Link
                  href={`/work#${p.slug}`}
                  aria-label={`${p.name} — read the full case study`}
                  className="group surface flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
                    <Image
                      src={p.image!}
                      alt={p.imageAlt ?? p.name}
                      fill
                      sizes="(min-width: 1024px) 21rem, (min-width: 640px) 45vw, 92vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                      {p.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {p.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {p.tagline}
                    </p>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-brand"
          >
            See all {totalProjects} projects
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
