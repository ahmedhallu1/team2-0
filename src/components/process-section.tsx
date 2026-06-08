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
    <section className="relative overflow-hidden bg-base-900/50 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-lime-400 uppercase">
            How we work
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            A simple path from idea to impact
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.1}>
              <div className="surface relative h-full rounded-2xl p-7">
                <span
                  className="font-display text-5xl font-bold text-transparent"
                  style={{ WebkitTextStroke: "1.5px var(--color-lime-400)" }}
                >
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-10 -right-3 hidden h-px w-6 bg-lime-400/50 lg:block"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
