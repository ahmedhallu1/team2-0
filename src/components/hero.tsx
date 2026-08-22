import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AscentField } from "@/components/brand/ascent-field";
import { AscentLine } from "@/components/motion/ascent-heading";
import { Magnetic } from "@/components/fx/magnetic";
import { actionGhost, actionPrimary } from "@/lib/ui";
import { shell } from "@/lib/layout";

/**
 * The first viewport. An asymmetric editorial composition: the headline holds
 * the left seven columns and rises line by line out of its own baseline, while
 * the brand mark opens into a field on the right and the lime chevron points
 * on into the page.
 *
 * The entrance is CSS rather than GSAP, and that is a performance decision as
 * much as a stylistic one: this copy is the page's LCP element, so it must not
 * wait for the bundle to hydrate before it can paint. Run from the document's
 * own clock it still lands inside the loader's wipe — the delays in globals.css
 * are set to overlap it — and it keeps this whole section a server component.
 *
 * Below `lg` the composition is rebuilt rather than shrunk: the field crops off
 * the top-right corner above the copy instead of squeezing into a column.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-8 sm:pt-36 lg:pt-44 lg:pb-20">
      <div
        aria-hidden
        className="ascent-grid -z-10"
        style={{ ["--grid-x" as string]: "7rem", ["--grid-y" as string]: "9rem" }}
      />
      <div
        aria-hidden
        className="glow -z-10 -top-32 -left-32 h-[22rem] w-[22rem] sm:-top-40 sm:-left-40 sm:h-[38rem] sm:w-[38rem]"
        style={{ ["--glow" as string]: "var(--violet-500)" }}
      />
      <div
        aria-hidden
        className="glow -z-10 top-1/4 -right-32 h-[20rem] w-[20rem] sm:-right-52 sm:h-[34rem] sm:w-[34rem]"
        style={{ ["--glow" as string]: "var(--lime-400)" }}
      />

      <div className={shell}>
        <div className="relative grid items-center gap-y-4 lg:grid-cols-12 lg:gap-x-8">
          {/* Type — the message always leads */}
          <div className="lg:col-span-7 xl:col-span-7">
            <p
              className="enter-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm"
              style={{ ["--enter-i" as string]: 0 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              A B2B growth partner for ambitious businesses
            </p>

            <h1 className="enter-lines mt-7 font-display text-[clamp(3rem,12vw,7rem)] leading-[0.9] font-extrabold tracking-[-0.03em] text-ink">
              <AscentLine style={{ ["--enter-i" as string]: 0 }}>Elevate</AscentLine>
              <AscentLine
                className="pl-[0.06em]"
                style={{ ["--enter-i" as string]: 1 }}
              >
                your
              </AscentLine>
              <AscentLine style={{ ["--enter-i" as string]: 2 }}>
                <span className="text-gradient-brand">vision</span>
              </AscentLine>
            </h1>

            <p
              className="enter-rise mt-8 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg"
              style={{ ["--enter-i" as string]: 1 }}
            >
              We help businesses grow — at home and across borders. Five
              services, one team: brand and content, websites and platforms,
              growth marketing, lead generation and events. 2.0 is the partner
              behind the scenes of your next chapter.
            </p>

            <div
              className="enter-rise mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              style={{ ["--enter-i" as string]: 2 }}
            >
              <Magnetic>
                <Link href="/contact" className={actionPrimary}>
                  Start a conversation
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/work" className={actionGhost}>
                  See what we&apos;ve built
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* The mark, opened into a field. Cropped off-corner below lg. */}
          <div className="enter-field pointer-events-none relative -order-1 -z-10 h-40 overflow-hidden sm:h-52 lg:order-none lg:col-span-5 lg:z-auto lg:h-auto lg:overflow-visible">
            <AscentField className="absolute -top-14 -right-20 h-72 w-72 text-ink opacity-60 sm:-top-16 sm:h-[22rem] sm:w-[22rem] lg:static lg:mx-auto lg:h-[clamp(22rem,32vw,30rem)] lg:w-[clamp(22rem,32vw,30rem)] lg:opacity-100" />
          </div>
        </div>

        {/* The chevron hands off to the next section */}
        <div
          className="enter-rise mt-14 flex items-center gap-4 lg:mt-8"
          style={{ ["--enter-i" as string]: 3 }}
          aria-hidden
        >
          <span className="h-px flex-1 bg-line" />
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none">
            <path
              d="M12 4v16M6 10l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-semibold tracking-[0.3em] text-faint uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
