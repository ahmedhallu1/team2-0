import { Compass, Handshake, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";

const values = [
  {
    icon: Compass,
    title: "Strategy first",
    body: "Every deliverable ladders up to a goal. We don't do busywork.",
  },
  {
    icon: Handshake,
    title: "True partnership",
    body: "We work as an extension of your team — transparent and hands-on.",
  },
  {
    icon: Rocket,
    title: "Built to scale",
    body: "From first lead to new markets, our work grows with your ambition.",
  },
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-lime absolute bottom-0 -left-24 -z-10 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal variant="left">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Who we are
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Five people. One standard.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            <p>
              2.0 began as a group of five who first came together at{" "}
              <span className="font-medium text-ink">AIESEC</span> — where we
              learned how business really crosses borders. We took that
              experience and built an independent B2B services team of our own.
            </p>
            <p>
              Today we help companies promote, sell and expand: generating
              international leads, running digital platforms, creating content,
              buying media, researching markets and sourcing suppliers. One
              partner, the full toolkit — so you can focus on the business while
              we elevate the vision.
            </p>
            <p className="text-sm text-faint">
              2.0 is an independent team and is not affiliated with or endorsed
              by AIESEC.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:gap-5">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 0.1} variant="right">
                <div className="group surface flex items-start gap-4 rounded-2xl p-6 transition-colors hover:border-accent/40">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-on-accent">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {v.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
