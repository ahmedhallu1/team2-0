import Image from "next/image";
import { ArrowUpRight, Check, Lock } from "lucide-react";
import { projects, totalProjects } from "@/lib/work";
import { Rise, RiseGroup, Curtain } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { StatBand } from "@/components/motion/stat-band";
import { PortfolioRail } from "@/components/portfolio-rail";
import { ChapterMotion } from "@/components/motion/chapter-motion";
import { WorkCollateral } from "@/components/work-collateral";
import { chip, eyebrow, h1 } from "@/lib/ui";
import { measure, sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/** Headline numbers above the case studies. */
const stats = [
  { value: `${totalProjects}`, label: "Projects shipped" },
  { value: "4", label: "Live products & platforms" },
  { value: "9k+", label: "SKUs on one marketplace" },
  { value: "8", label: "Brands on one event" },
];

/**
 * The portfolio as chapters.
 *
 * Each project gets its own atmosphere — a glow and hairline in a colour
 * sampled from its own artwork — inside the unchanged 2.0 frame. The identity
 * column sticks while the evidence scrolls past it on desktop; on mobile the
 * whole thing reads top to bottom in the order you'd say it out loud.
 *
 * Nothing is behind an interaction: every paragraph, statistic and link is in
 * the document from the first byte.
 */
export function WorkGallery() {
  return (
    <section className={clsx("relative", sectionY)}>
      <PortfolioRail />
      <ChapterMotion />

      <div className={shell}>
        {/* Intro */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow} eager index={0}>
              Portfolio
            </Rise>
            <AscentHeading
              as="h1"
              eager
              className={clsx(h1, "mt-5")}
              lines={["Things we’ve", "actually built"]}
            />
          </div>
          <Rise
            as="p"
            eager
            index={2}
            className={clsx(
              measure,
              "text-base leading-relaxed text-pretty text-muted lg:col-span-5 lg:text-lg",
            )}
          >
            Not mockups — live products, platforms and brand experiences that
            are running today. Each one below explains what it is, what it does
            and why it earns its place in the business that owns it. This is a
            selection of our work, not the whole archive.
          </Rise>
        </div>

        <StatBand stats={stats} className="mt-14 sm:mt-16" />
      </div>

      {/* Case studies */}
      <div data-portfolio className={clsx(shell, "mt-20 sm:mt-28")}>
        <div className="space-y-24 sm:space-y-32 lg:space-y-44">
          {projects.map((project, i) => {
            const Icon = project.icon;
            const number = String(i + 1).padStart(2, "0");
            return (
              <article
                key={project.slug}
                id={project.slug}
                data-chapter
                className="relative scroll-mt-6"
              >
                <div
                  aria-hidden
                  data-chapter-glow
                  className="glow pointer-events-none -top-24 -right-40 -z-10 h-[30rem] w-[30rem]"
                  style={{ ["--glow" as string]: project.tint }}
                />

                <div
                  data-chapter-grid
                  className="grid gap-10 lg:grid-cols-12 lg:gap-14"
                >
                  {/* Identity — sticks while the evidence passes */}
                  <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                      <RiseGroup>
                        <div className="flex items-center gap-4">
                          <span
                            aria-hidden
                            data-chapter-number
                            className="font-display text-[clamp(3rem,7vw,5rem)] leading-none font-extrabold tabular-nums"
                            style={{ color: project.tint }}
                          >
                            {number}
                          </span>
                          <span
                            aria-hidden
                            className="h-px flex-1"
                            style={{
                              background: `linear-gradient(90deg, ${project.tint}, transparent)`,
                            }}
                          />
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line">
                            <Icon size={18} strokeWidth={2} aria-hidden />
                          </span>
                        </div>

                        <h2 className="mt-6 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-ink">
                          {project.name}
                        </h2>
                        {project.client && (
                          <p className="mt-2 text-sm text-faint">
                            {project.client}
                          </p>
                        )}
                        <p className="mt-4 text-base leading-relaxed text-pretty text-ink">
                          {project.tagline}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                          <span className={chip}>{project.category}</span>
                          <span className="text-faint">{project.year}</span>
                        </div>

                        <div className="mt-6 flex flex-col items-start gap-2">
                          {project.href ? (
                            <>
                              <a
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                              >
                                {project.hrefLabel ?? `Visit ${project.name}`}
                                <ArrowUpRight
                                  size={15}
                                  aria-hidden
                                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </a>
                              {project.hrefNote && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                                  <Lock size={12} aria-hidden />
                                  {project.hrefNote}
                                </span>
                              )}
                            </>
                          ) : (
                            project.status && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                                <Lock size={12} aria-hidden />
                                {project.status}
                              </span>
                            )
                          )}
                        </div>

                        <ul className="mt-6 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <li key={tag} className={chip}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </RiseGroup>
                    </div>
                  </div>

                  {/* Evidence */}
                  <div className="lg:col-span-8">
                    {project.image ? (
                      <Curtain className="frame relative">
                        <ParallaxMedia
                          className="curtain__media aspect-[16/10] w-full"
                          amount={4}
                        >
                          <Image
                            src={project.image}
                            alt={project.imageAlt ?? project.name}
                            fill
                            sizes="(min-width: 1024px) 56rem, 92vw"
                            className="object-cover object-top"
                            priority={i === 0}
                          />
                        </ParallaxMedia>
                        {project.aside && (
                          <span className="absolute right-4 bottom-4 block w-[38%] max-w-[13rem] overflow-hidden rounded-lg border border-white/25 shadow-lg">
                            <Image
                              src={project.aside}
                              alt={project.asideAlt ?? ""}
                              width={project.asideWidth ?? 1200}
                              height={project.asideHeight ?? 799}
                              sizes="13rem"
                              className="h-auto w-full"
                            />
                          </span>
                        )}
                      </Curtain>
                    ) : (
                      <Curtain className="frame flex aspect-[16/10] items-center justify-center bg-surface-2 p-10">
                        <Image
                          src={project.logo!}
                          alt={`${project.name} logo`}
                          width={project.logoWidth ?? 600}
                          height={project.logoHeight ?? 200}
                          sizes="20rem"
                          className="curtain__media max-h-28 w-auto object-contain"
                        />
                      </Curtain>
                    )}

                    <Rise className="mt-8" delay={0.04}>
                      <p className="text-base leading-relaxed text-pretty text-muted">
                        {project.summary}
                      </p>
                    </Rise>

                    <RiseGroup
                      as="ul"
                      className="mt-8 grid gap-x-8 gap-y-2.5 sm:grid-cols-2"
                      stagger={0.05}
                      distance="sm"
                    >
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm text-ink"
                        >
                          <Check
                            size={15}
                            strokeWidth={2.5}
                            className="mt-[3px] shrink-0 text-brand"
                            aria-hidden
                          />
                          {highlight}
                        </li>
                      ))}
                    </RiseGroup>

                    {/* Facts stay compact: several of these are words, not
                        numbers, and a display-scale value would break them. */}
                    <RiseGroup
                      as="dl"
                      className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4"
                      stagger={0.05}
                      distance="sm"
                    >
                      {project.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="text-[11px] leading-snug text-faint">
                            {fact.label}
                          </dt>
                          <dd className="mt-1.5 font-display text-lg leading-tight font-bold text-ink sm:text-xl">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </RiseGroup>

                    <Rise
                      className="mt-8 rounded-2xl border border-line border-l-2 bg-surface/60 p-5 sm:p-6"
                      delay={0.04}
                      style={{ borderLeftColor: project.tint }}
                    >
                      <p className="text-[11px] font-semibold tracking-[0.25em] text-brand uppercase">
                        Why it matters
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-pretty text-ink sm:text-base">
                        {project.impact}
                      </p>
                    </Rise>
                  </div>
                </div>

                {project.gallery && (
                  <WorkCollateral
                    items={project.gallery}
                    projectName={project.name}
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
