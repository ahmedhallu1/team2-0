import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { featuredProject, projects, totalProjects } from "@/lib/work";
import { Rise, RiseGroup, Curtain } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { actionGhost, actionText, chip, eyebrow, h2 } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/** The three projects shown as tiles under the featured case study. */
const tiles = projects.slice(1, 4);

/**
 * Selected work. The imagery leads: the featured project fills a cinematic
 * frame that uncovers upward while its own sampled colour lights the section,
 * and the three tiles beneath repeat the gesture at a smaller scale. Every
 * project is a real link — nothing here depends on hover.
 */
export function WorkPreview() {
  const f = featuredProject;

  return (
    <section className={clsx("relative overflow-hidden", sectionY)}>
      <div
        aria-hidden
        className="glow -z-10 top-24 -right-56 h-[36rem] w-[36rem]"
        style={{ ["--glow" as string]: f.tint }}
      />

      <div className={shell}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow}>
              Portfolio
            </Rise>
            <AscentHeading
              className={clsx(h2, "mt-5")}
              lines={["Things we’ve", "actually built"]}
            />
          </div>
          <Rise
            as="p"
            delay={0.08}
            className="text-base leading-relaxed text-pretty text-muted lg:col-span-5"
          >
            Marketplaces, internal systems, brand experiences — {totalProjects}{" "}
            projects that are live and doing a job for the businesses that own
            them.
          </Rise>
        </div>

        {/* Featured case study */}
        <article className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Curtain className="frame relative lg:col-span-7">
            <ParallaxMedia className="curtain__media aspect-[16/10] w-full">
              <Image
                src={f.image!}
                alt={f.imageAlt ?? f.name}
                fill
                sizes="(min-width: 1024px) 46rem, 92vw"
                className="object-cover object-top"
              />
            </ParallaxMedia>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20"
            />
            <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-black/50 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
              Featured
            </span>
            {f.aside && (
              <span className="absolute right-4 bottom-4 block w-[38%] max-w-[12rem] overflow-hidden rounded-lg border border-white/25 shadow-lg">
                <Image
                  src={f.aside}
                  alt={f.asideAlt ?? ""}
                  width={f.asideWidth ?? 1200}
                  height={f.asideHeight ?? 799}
                  sizes="12rem"
                  className="h-auto w-full"
                />
              </span>
            )}
          </Curtain>

          <RiseGroup className="lg:col-span-5" distance="md">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className={chip}>{f.category}</span>
              {f.client && <span className="text-faint">{f.client}</span>}
              <span className="text-faint">{f.year}</span>
            </div>

            <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {f.name}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-pretty text-muted">
              {f.tagline}
            </p>
            <p
              className="mt-5 border-l-2 pl-4 text-sm leading-relaxed text-pretty text-ink"
              style={{ borderColor: f.tint }}
            >
              {f.impact}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href={`/work#${f.slug}`} className={actionText}>
                Read the case study
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
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
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </RiseGroup>
        </article>

        {/* Three more, as an editorial row */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {tiles.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/work#${p.slug}`}
                aria-label={`${p.name} — read the full case study`}
                className="group block"
              >
                <Curtain
                  className="frame relative aspect-[16/11]"
                  delay={i * 0.06}
                >
                  <ParallaxMedia className="curtain__media h-full w-full">
                    <Image
                      src={p.image!}
                      alt={p.imageAlt ?? p.name}
                      fill
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw"
                      className="object-cover object-top"
                    />
                  </ParallaxMedia>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute right-4 bottom-3 font-display text-4xl font-extrabold text-white/25 tabular-nums"
                  >
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </Curtain>
                <div className="mt-4">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-faint uppercase">
                    {p.category}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-ink transition-colors group-hover:text-brand">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {p.tagline}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Rise delay={0.08} className="mt-12 flex justify-center lg:justify-start">
          <Link href="/work" className={actionGhost}>
            See all {totalProjects} projects
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Rise>
      </div>
    </section>
  );
}
