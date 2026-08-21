import Image from "next/image";
import { ArrowUpRight, Check, Lock } from "lucide-react";
import { projects, totalProjects } from "@/lib/work";
import { Reveal } from "@/components/reveal";
import { clsx } from "@/lib/clsx";

/** Headline numbers above the case studies. */
const stats = [
  { value: `${totalProjects}`, label: "Projects shipped" },
  { value: "5", label: "Live products & platforms" },
  { value: "9k+", label: "SKUs on one marketplace" },
  { value: "8", label: "Brands on one event" },
];

export function WorkGallery() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
      <div
        aria-hidden
        className="glow-violet absolute top-24 -right-32 -z-10 h-96 w-96 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        {/* Intro */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Portfolio
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-ink sm:text-6xl">
            Things we&apos;ve actually built
          </h1>
          <p className="mt-6 text-base leading-relaxed text-pretty text-muted sm:text-lg">
            Not mockups — live products, platforms and brand experiences that
            are running today. Each one below explains what it is, what it does
            and why it earns its place in the business that owns it.
          </p>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface px-4 py-6 text-center transition-colors hover:bg-surface-2"
            >
              <dt className="font-display text-3xl font-bold text-brand">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
            </div>
          ))}
        </Reveal>

        {/* Case studies */}
        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
          {projects.map((p, i) => {
            const Icon = p.icon;
            const flip = i % 2 === 1;
            return (
              <article
                key={p.slug}
                id={p.slug}
                className="scroll-mt-28 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* Visual */}
                <Reveal
                  variant={flip ? "right" : "left"}
                  className={clsx(flip && "lg:order-2")}
                >
                  <div className="surface relative overflow-hidden rounded-2xl">
                    {p.image ? (
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={p.image}
                          alt={p.imageAlt ?? p.name}
                          fill
                          sizes="(min-width: 1024px) 34rem, 92vw"
                          className="object-cover object-top"
                          priority={i === 0}
                        />
                        {p.aside && (
                          <div className="absolute right-3 bottom-3 w-[42%] max-w-[13rem] overflow-hidden rounded-lg border border-white/25 shadow-lg sm:right-4 sm:bottom-4">
                            <Image
                              src={p.aside}
                              alt={p.asideAlt ?? ""}
                              width={p.asideWidth ?? 1200}
                              height={p.asideHeight ?? 799}
                              sizes="14rem"
                              className="h-auto w-full"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-surface-2 p-10">
                        <Image
                          src={p.logo!}
                          alt={`${p.name} logo`}
                          width={p.logoWidth ?? 600}
                          height={p.logoHeight ?? 200}
                          sizes="18rem"
                          className="max-h-24 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </Reveal>

                {/* Copy */}
                <Reveal
                  variant={flip ? "left" : "right"}
                  className={clsx(flip && "lg:order-1")}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line">
                      <Icon size={20} strokeWidth={2} aria-hidden />
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                      <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-muted">
                        {p.category}
                      </span>
                      <span className="text-faint">{p.year}</span>
                    </div>
                    <span className="ml-auto font-display text-sm font-semibold text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
                    {p.name}
                  </h2>
                  {p.client && (
                    <p className="mt-1.5 text-sm text-faint">{p.client}</p>
                  )}

                  <p className="mt-4 text-base leading-relaxed text-pretty text-ink">
                    {p.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
                    {p.summary}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-muted"
                      >
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="mt-0.5 shrink-0 text-brand"
                          aria-hidden
                        />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                    {p.facts.map((fact) => (
                      <div key={fact.label} className="bg-surface px-3 py-3.5">
                        <dt className="text-[11px] leading-snug text-faint">
                          {fact.label}
                        </dt>
                        <dd className="mt-0.5 font-display text-sm font-bold text-ink">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 rounded-xl border border-accent/25 bg-accent/[0.07] p-4">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
                      Why it matters
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink">
                      {p.impact}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {p.href ? (
                      <>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                        >
                          Visit {p.name}
                          <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </a>
                        {p.hrefNote && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                            <Lock size={12} aria-hidden />
                            {p.hrefNote}
                          </span>
                        )}
                      </>
                    ) : (
                      p.status && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                          <Lock size={12} aria-hidden />
                          {p.status}
                        </span>
                      )
                    )}

                    <span className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
