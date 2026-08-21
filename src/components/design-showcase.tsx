import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { designPieces } from "@/lib/design";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";

/**
 * The brand-and-content side of the portfolio: campaign and product creative
 * that ships weekly rather than as a launch. A selection — the full archive
 * would drown the page.
 */
export function DesignShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface-2/40 px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-lime absolute -bottom-20 -left-24 -z-10 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Design &amp; campaigns
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Not everything is a platform
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
            Most of what a brand publishes is the weekly work — a launch post, a
            seasonal offer, a product on a set that looks like money. Here&apos;s
            a slice of ours.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {designPieces.map((piece, i) => (
            <Reveal
              key={piece.src}
              as="li"
              delay={(i % 3) * 0.06}
              variant="scale"
            >
              <Tilt className="h-full rounded-2xl">
                <figure className="surface group h-full overflow-hidden rounded-2xl transition-colors duration-300 hover:border-accent/40">
                  <div className="relative aspect-square overflow-hidden bg-surface-2">
                    <Image
                      src={piece.src}
                      alt={piece.alt}
                      fill
                      sizes="(min-width: 1024px) 21rem, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <figcaption className="border-t border-line p-3.5 sm:p-4">
                    <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                      {piece.brand}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      {piece.caption}
                    </span>
                  </figcaption>
                </figure>
              </Tilt>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-brand"
          >
            Want this for your brand?
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
