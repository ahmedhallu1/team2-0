import { Reveal } from "@/components/reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "We learn your business, market and goals — and audit where you stand today.",
  },
  {
    n: "02",
    title: "Strategize",
    body: "A focused plan: the right services, channels and targets to move the needle.",
  },
  {
    n: "03",
    title: "Execute",
    body: "We build, launch and manage — content, campaigns, outreach and platforms.",
  },
  {
    n: "04",
    title: "Scale",
    body: "We measure what works, double down, and expand into new markets with you.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-surface-2/40 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            How we work
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            A simple path from idea to impact
          </h2>
        </Reveal>

        <div className="relative mt-14 sm:mt-16">
          {/* Desktop connecting rail */}
          <span
            aria-hidden
            className="absolute top-7 right-7 left-7 hidden h-px bg-line-2 lg:block"
          />

          <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.n}
                delay={i * 0.1}
                className="group relative flex gap-5 lg:flex-col"
              >
                <div className="relative flex flex-col items-center lg:items-start">
                  <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line-2 bg-surface font-display text-lg font-bold text-brand transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    {step.n}
                  </span>
                  {/* Mobile vertical connector */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-14 bottom-[-2.5rem] w-px bg-line-2 lg:hidden"
                    />
                  )}
                </div>

                <div className="pb-1 lg:pt-1">
                  <h3 className="font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
