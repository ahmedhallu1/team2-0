"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/motion/gsap";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { eyebrow, h1 as h1Class, h2 as h2Class } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

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

/**
 * The ascent, made literal. A rail is drawn through the four stage markers —
 * its path computed from where those markers actually land, so it climbs across
 * four columns on desktop and runs straight down the stack on mobile with no
 * second implementation. A lime chevron rides the rail as you scroll, and each
 * stage lights as it passes.
 *
 * The stage copy is always fully present: the rail and the chevron are
 * decoration on top of readable content, never the thing that reveals it.
 */
export function ProcessSection({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const svg = root.querySelector<SVGSVGElement>("[data-rail]");
      const base = root.querySelector<SVGPathElement>("[data-rail-base]");
      const fill = root.querySelector<SVGPathElement>("[data-rail-fill]");
      const rider = root.querySelector<SVGGElement>("[data-rail-rider]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-step-node]", root);
      if (!svg || !base || !fill || !rider || nodes.length < 2) return;

      let length = 0;

      const measure = () => {
        const box = root.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

        const points = nodes.map((node) => {
          const r = node.getBoundingClientRect();
          return {
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + r.height / 2,
          };
        });

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i += 1) {
          const a = points[i - 1];
          const b = points[i];
          const dx = (b.x - a.x) / 2;
          const dy = (b.y - a.y) / 2;
          // Ease horizontally when the stages sit side by side, vertically when
          // they stack — the rail bends the way the layout does.
          d +=
            Math.abs(b.x - a.x) > Math.abs(b.y - a.y)
              ? ` C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`
              : ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
        }

        base.setAttribute("d", d);
        fill.setAttribute("d", d);
        length = fill.getTotalLength();
        fill.style.strokeDasharray = `${length}`;

        // Record how far along the rail each stage sits, so "passed" is exact
        // in either orientation instead of a distance guess.
        const SAMPLES = 240;
        points.forEach((point, index) => {
          let best = Infinity;
          let at = 0;
          for (let s = 0; s <= SAMPLES; s += 1) {
            const l = (length * s) / SAMPLES;
            const c = fill.getPointAtLength(l);
            const dist = (c.x - point.x) ** 2 + (c.y - point.y) ** 2;
            if (dist < best) {
              best = dist;
              at = l;
            }
          }
          nodes[index].dataset.at = String(at);
        });
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(root);

      if (prefersReducedMotion()) {
        fill.style.strokeDashoffset = "0";
        nodes.forEach((node) => node.setAttribute("data-passed", "true"));
        gsap.set(rider, { opacity: 0 });
        return () => observer.disconnect();
      }

      const draw = (progress: number) => {
        if (!length) return;
        const travelled = length * progress;
        fill.style.strokeDashoffset = `${length - travelled}`;
        const point = fill.getPointAtLength(travelled);
        rider.setAttribute("transform", `translate(${point.x} ${point.y})`);
        rider.style.opacity = progress > 0.02 ? "1" : "0";
        nodes.forEach((node) => {
          const at = Number(node.dataset.at ?? "0");
          node.setAttribute("data-passed", travelled >= at - 4 ? "true" : "false");
        });
      };

      draw(0);
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 72%",
        end: "bottom 78%",
        scrub: 0.5,
        onUpdate: (self) => draw(self.progress),
        onRefresh: measure,
      });

      return () => {
        observer.disconnect();
        trigger.kill();
      };
    },
    { scope: ref },
  );

  const Heading = headingLevel;
  // Stage titles sit one level under the section heading, whichever it is.
  const StepHeading = headingLevel === "h1" ? "h2" : "h3";

  return (
    <section className={clsx("relative border-y border-line bg-surface-2/30", sectionY)}>
      <div className={shell}>
        <div className="max-w-2xl">
          <Rise as="p" className={eyebrow} eager={headingLevel === "h1"} index={0}>
            How we work
          </Rise>
          <AscentHeading
            as={Heading}
            eager={headingLevel === "h1"}
            className={clsx(
              headingLevel === "h1" ? h1Class : h2Class,
              "mt-5",
            )}
            lines={["A simple path", "from idea to impact"]}
          />
        </div>

        <div ref={ref} className="relative mt-16 sm:mt-20">
          <svg
            data-rail
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="rail-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--violet-500)" />
                <stop offset="100%" stopColor="var(--lime-400)" />
              </linearGradient>
            </defs>
            <path
              data-rail-base
              fill="none"
              stroke="var(--line-2)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              data-rail-fill
              fill="none"
              stroke="url(#rail-grad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g data-rail-rider style={{ opacity: 0 }}>
              <circle r="13" fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.5" />
              <path
                d="M0 -6 L6 2 L-6 2 Z"
                fill="var(--accent)"
                transform="translate(0 1)"
              />
            </g>
          </svg>

          <ol className="relative grid gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="ascent-step group relative flex gap-5 lg:flex-col lg:gap-0"
                style={{ ["--step-i" as string]: i }}
              >
                <span
                  data-step-node
                  aria-hidden
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line-2 bg-surface font-display text-lg font-bold text-brand transition-colors duration-500 data-[passed=true]:border-accent data-[passed=true]:bg-accent data-[passed=true]:text-on-accent"
                >
                  {step.n}
                </span>
                <div className="lg:mt-7">
                  <StepHeading className="font-display text-xl font-bold text-ink">
                    <span className="sr-only">{`Step ${step.n}: `}</span>
                    {step.title}
                  </StepHeading>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
