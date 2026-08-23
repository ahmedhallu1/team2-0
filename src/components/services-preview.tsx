import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services, totalServices } from "@/lib/services";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { ServiceGlyph } from "@/components/brand/service-glyph";
import { StackedActs } from "@/components/motion/stacked-acts";
import { actionText, eyebrow, h2 } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Five services as one ascending stack rather than a grid of equal cards.
 *
 * On desktop each act sticks a header-row lower than the last, so the sequence
 * builds into a legible stack: the number and title of every service stays on
 * screen while the active one is fully open. Below `lg` it is a plain vertical
 * list — no pinning, no scroll trap, nothing hidden from keyboard or crawler.
 */
export function ServicesPreview() {
  return (
    <section className={clsx("relative", sectionY)}>
      <div className={shell}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow}>
              What we do
            </Rise>
            <AscentHeading
              className={clsx(h2, "mt-5")}
              lines={[`${totalServices} services.`, "That’s the whole list."]}
            />
          </div>
          <Rise
            as="p"
            delay={0.08}
            className="text-base leading-relaxed text-pretty text-muted lg:col-span-5"
          >
            Take one of them or hand us the lot — we plug in wherever you need
            momentum.
          </Rise>
        </div>

        {/* The gap sets how long each act stays open before the next stacks
            over it — too tight and a card is covered mid-sentence. */}
        <StackedActs className="mt-14 space-y-6 sm:mt-16 lg:space-y-20">
          {services.map((service, i) => (
            <li
              key={service.id}
              className="svc-stack__card"
              style={{
                ["--svc-i" as string]: i,
                zIndex: i + 1,
              }}
            >
              <article
                data-act-panel
                className="surface overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-lg)]"
              >
                {/* The strip that stays visible once the next act stacks over */}
                <div
                  data-act-head
                  className="flex items-center gap-4 border-b border-line bg-surface px-5 py-3.5 sm:px-7"
                >
                  <span className="font-display text-sm font-bold text-brand tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
                    {service.title}
                  </h3>
                  <ServiceGlyph
                    id={service.id}
                    className="ml-auto h-6 w-6 shrink-0"
                    strokeWidth={3}
                  />
                </div>

                <div
                  data-act-body
                  className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-9"
                >
                  <div>
                    <p className="font-display text-xl leading-snug font-semibold text-pretty text-ink sm:text-2xl">
                      {service.summary}
                    </p>
                    <Link
                      href={`/services#${service.id}`}
                      className={clsx(actionText, "mt-6")}
                    >
                      What&apos;s included
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed text-pretty text-muted">
                      {service.description}
                    </p>
                    <ul
                      className={clsx(
                        "mt-6 grid gap-x-6 gap-y-2",
                        service.includes.length > 3 && "sm:grid-cols-2",
                      )}
                    >
                      {service.includes.map((item) => (
                        <li
                          key={item}
                          data-act-item
                          className="flex items-start gap-2.5 text-sm text-ink"
                        >
                          <Check
                            size={15}
                            strokeWidth={2.5}
                            className="mt-[3px] shrink-0 text-brand"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </StackedActs>
      </div>
    </section>
  );
}
