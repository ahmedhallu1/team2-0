import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { designPieces } from "@/lib/design";
import { DesignGallery } from "@/components/design-gallery";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { actionGhost, eyebrow, h2 } from "@/lib/ui";
import { measure, sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The brand-and-content side of the portfolio: campaign and product creative
 * that ships weekly rather than as a launch. A selection — the full archive
 * would drown the page.
 */
export function DesignShowcase() {
  return (
    <section
      className={clsx(
        "relative overflow-hidden border-t border-line bg-surface-2/40",
        sectionY,
      )}
    >
      <div
        aria-hidden
        className="glow glow--tucked -z-10 -bottom-40 -left-40 h-[32rem] w-[32rem]"
        style={{ ["--glow" as string]: "var(--lime-400)" }}
      />
      <div className={shell}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow}>
              Design &amp; campaigns
            </Rise>
            <AscentHeading
              className={clsx(h2, "mt-5")}
              lines={["Not everything", "is a platform"]}
            />
          </div>
          <Rise
            as="p"
            delay={0.08}
            className={clsx(
              measure,
              "text-base leading-relaxed text-pretty text-muted lg:col-span-5",
            )}
          >
            Most of what a brand publishes is the weekly work — a launch post, a
            seasonal offer, a product on a set that looks like money. Here&apos;s
            a slice of ours.
          </Rise>
        </div>

        <DesignGallery pieces={designPieces} />

        <Rise delay={0.1} className="mt-14 flex justify-center lg:justify-start">
          <Link href="/contact" className={actionGhost}>
            Want this for your brand?
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
