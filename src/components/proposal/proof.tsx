import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise, Curtain } from "@/components/motion/reveal";
import { projects } from "@/lib/work";
import { designPieces } from "@/lib/design";
import { proofSlugs } from "@/lib/proposals/kuphub";
import { actionText } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Proof, kept short on purpose.
 *
 * Three projects and six pieces of brand work, chosen because each answers a
 * question this particular proposal raises — can they build a platform, can
 * they run a brand, can they put something into the world with partners
 * attached. The whole portfolio is one click away and does not belong here.
 *
 * Both lists are read straight from `@/lib/work` and `@/lib/design`, the same
 * data the public site renders, so this section cannot drift out of date or
 * quietly claim something the site doesn't.
 */
export function Proof() {
  const picked = proofSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // A cut of the brand work — the closest thing on the site to what these two
  // businesses would be buying month to month.
  const pieces = designPieces.slice(0, 6);

  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className={clsx("relative border-t border-line bg-surface-2/20", sectionY)}
    >
      <div className={shell}>
        <SectionHead
          n="11"
          label="We've done this"
          headingId="proof-heading"
          lines={["Three we built.", "Not the whole shelf."]}
          lede="A platform, a CRM and a brand experience — picked because between them they cover everything this proposal asks us to do. The rest is on the site."
        />

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {picked.map((project) => (
            <li key={project.slug}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
                {/* Some projects are screenshots and some are marks — the
                    card takes whichever the data actually holds, so all three
                    are the same height either way. */}
                <Curtain className="relative aspect-[16/10] overflow-hidden border-b border-line">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.imageAlt ?? ""}
                      width={project.imageWidth ?? 1600}
                      height={project.imageHeight ?? 1000}
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="curtain__media h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="curtain__media flex h-full w-full items-center justify-center p-10"
                      style={{
                        background: `radial-gradient(120% 120% at 30% 10%, color-mix(in srgb, ${project.tint} 22%, transparent), transparent 70%), var(--surface-2)`,
                      }}
                    >
                      {project.logo ? (
                        <Image
                          src={project.logo}
                          alt={`${project.name} logo`}
                          width={project.logoWidth ?? 600}
                          height={project.logoHeight ?? 200}
                          sizes="(min-width: 1024px) 20vw, 60vw"
                          className="max-h-16 w-auto object-contain"
                        />
                      ) : (
                        <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                          {project.name}
                        </span>
                      )}
                    </div>
                  )}
                </Curtain>

                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                    {project.category}
                    <span aria-hidden className="h-px w-4 bg-line-2" />
                    {project.year}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {project.tagline}
                  </p>

                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className={clsx(actionText, "mt-5")}
                    >
                      {project.hrefLabel ?? `Visit ${project.name}`}
                      <ArrowUpRight
                        size={14}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    <p className="mt-5 text-xs text-faint">{project.status}</p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* The day-to-day work — closest to what a retainer actually produces. */}
        <Rise className="mt-16">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">
            And the work that never becomes a case study
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Campaigns, product features and content series for brands in beauty,
            skincare and food. This is the shape of a month.
          </p>
        </Rise>

        <ul className="no-scrollbar mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pieces.map((piece) => (
            <li key={piece.src}>
              <figure className="overflow-hidden rounded-lg border border-line bg-surface">
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  width={800}
                  height={800}
                  sizes="(min-width: 1024px) 16vw, 45vw"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="px-3 py-2.5">
                  <span className="block truncate text-[11px] font-semibold text-ink">
                    {piece.brand}
                  </span>
                  <span className="block truncate text-[10px] text-faint">
                    {piece.caption}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <Rise className="mt-8">
          <Link href="/work" className={actionText}>
            See the rest of the work
            <ArrowUpRight
              size={15}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Rise>
      </div>
    </section>
  );
}
