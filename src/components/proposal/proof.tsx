import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Rise } from "@/components/motion/reveal";
import { projects } from "@/lib/work";
import { proofSlugs } from "@/lib/proposals/kuphub";
import { actionText } from "@/lib/ui";
import { clsx } from "@/lib/clsx";

/**
 * Proof, reduced to a strip — and deliberately unlabelled.
 *
 * It used to be a chapter of its own with three large case studies and six
 * pieces of brand work. On a page that is now art-directed in the clients'
 * colours, a full spread of somebody else's branding is both off-key and a
 * screen and a half of scrolling in a meeting where we are in the room to
 * answer for it. Three lines and a link to the rest does the same job.
 *
 * The strip carries no heading of its own. Sitting where it does — under the
 * closing call to action, in a document we are presenting in person — three
 * pieces of work and a link to the rest need no announcing.
 *
 * Read from `@/lib/work`, the same data the public site renders, so it cannot
 * drift out of date or claim something the site doesn't.
 */
export function Proof({ className }: { className?: string }) {
  const picked = proofSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Rise className={clsx("border-t border-line pt-10", className)}>
      <ul className="grid gap-4 sm:grid-cols-3">
        {picked.map((project) => (
          <li key={project.slug} className="flex items-center gap-3.5">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
              {project.image ? (
                <Image
                  src={project.image}
                  alt=""
                  width={project.imageWidth ?? 1600}
                  height={project.imageHeight ?? 1000}
                  sizes="48px"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="block h-full w-full"
                  style={{ background: project.tint, opacity: 0.55 }}
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold tracking-tight text-ink">
                {project.name}
              </span>
              <span className="block truncate text-xs text-muted">
                {project.category}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* The link sits after the work rather than above it: with the strip's
          heading gone it was the only thing in the row, which read as a stray
          control floating above three unexplained thumbnails. */}
      <Link href="/work" className={clsx(actionText, "mt-6")}>
        The rest of the work
        <ArrowUpRight
          size={14}
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </Rise>
  );
}
