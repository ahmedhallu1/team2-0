import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { demos } from "@/lib/demos";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { actionPrimary, chip, eyebrow, h2 } from "@/lib/ui";
import { measure, sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Concept demos, kept apart from the case studies above and labelled as
 * demos everywhere — they show an industry what we would build, they are not
 * client work.
 */
export function DemoShowcase() {
  return (
    <section
      aria-labelledby="demos-title"
      className={clsx("relative border-t border-line", sectionY)}
    >
      <div className={shell}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow}>
              Concept demos
            </Rise>
            <AscentHeading
              id="demos-title"
              className={clsx(h2, "mt-5")}
              lines={["What we’d build", "for your industry"]}
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
            Working demo sites made to show a whole type of business what its
            website could be. They are concepts, not client projects — the
            businesses in them are illustrative.
          </Rise>
        </div>

        <ul className="mt-14 space-y-10">
          {demos.map((demo) => (
            <li key={demo.slug}>
              <Rise className="grid gap-8 rounded-2xl border border-line bg-surface/60 p-5 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
                <a
                  href={demo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block self-start overflow-hidden rounded-xl border border-line lg:col-span-7 lg:self-center"
                  aria-label={`${demo.name} (opens in a new tab)`}
                >
                  <Image
                    src={demo.image}
                    alt={demo.imageAlt}
                    width={demo.imageWidth}
                    height={demo.imageHeight}
                    sizes="(min-width: 1024px) 44rem, 92vw"
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </a>
                <div className="flex flex-col justify-center lg:col-span-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={chip}>Concept demo</span>
                    <span className={chip}>Not a client project</span>
                  </div>
                  <h3 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-ink">
                    {demo.name}
                  </h3>
                  <p className="mt-2 text-sm text-faint">{demo.audience}</p>
                  <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
                    {demo.summary}
                  </p>
                  <ul className="mt-6 grid gap-2.5">
                    {demo.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-ink"
                      >
                        <Check
                          size={15}
                          strokeWidth={2.5}
                          className="mt-[3px] shrink-0 text-brand"
                          aria-hidden
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <a
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={actionPrimary}
                    >
                      Open the demo
                      <ArrowUpRight size={16} aria-hidden />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
