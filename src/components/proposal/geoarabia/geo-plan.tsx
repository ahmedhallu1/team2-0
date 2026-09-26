import { Check, FileText, Search, Sparkles } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { sampleArticles, whatsappThread } from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The plan, as the path a buyer takes: found, trusted, contacted. Each layer
 * is one row with a concept beside it, so the room sees the thing itself
 * rather than a description of it. Everything drawn here is labelled as a
 * concept — the AI answer especially, because it is the goal, not a result.
 *
 * A server component: nothing here moves except the shared rise-in.
 */

const layerLabel =
  "flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase";
const conceptTag =
  "absolute top-3 right-3 z-10 rounded-full border border-line-2 bg-bg/70 px-2 py-0.5 text-[9px] font-semibold tracking-[0.16em] text-faint uppercase";

function Layer({
  n,
  label,
  title,
  body,
  points,
  children,
  flip = false,
}: {
  n: string;
  label: string;
  title: string;
  body: string;
  points: string[];
  children: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
      <Rise className={clsx("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
        <p className={layerLabel}>
          <span className="text-faint tabular-nums">{n}</span>
          {label}
        </p>
        <h3 className="mt-4 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-ink">
          {title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted">{body}</p>
        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-sm leading-snug text-ink">
              <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              {p}
            </li>
          ))}
        </ul>
      </Rise>
      <Rise delay={0.08} className={clsx("lg:col-span-7", flip && "lg:order-1 lg:col-start-1")}>
        {children}
      </Rise>
    </div>
  );
}

export function GeoPlan() {
  return (
    <section
      id="plan"
      data-zone="geo"
      aria-labelledby="plan-heading"
      className={clsx("relative border-t border-line", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="02"
          label="The plan"
          headingId="plan-heading"
          lines={["Found. Trusted.", "Contacted."]}
          lede="Three layers, in the order a buyer meets them. Each one hands over to the next, and each is priced on its own further down."
        />

        <div className="mt-12 space-y-12">
          {/* 1 — Found */}
          <Layer
            n="01"
            label="Found · Website + SEO + GEO"
            title="A page for every question a buyer asks."
            body="A proper bilingual site on geoarabia.sa, then four articles a month written as answers to the questions consultants and contractors actually type. The same pages are built so that ChatGPT, Gemini and Google's AI Overviews can read and cite them. That is GEO."
            points={[
              "A service page for each of the four services, in both languages",
              "Four articles a month, Arabic first, English alongside",
              "Google Business Profile in Ar Rayan, so GeoArabia shows up on the map",
              "The same name, domain and phone number everywhere",
            ]}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="concept relative border border-line bg-surface p-5">
                <span className={conceptTag}>Month one</span>
                <p className="flex items-center gap-2 text-xs font-semibold text-faint">
                  <FileText size={13} aria-hidden className="text-accent" />
                  Articles
                </p>
                <ol className="mt-4 space-y-3.5">
                  {sampleArticles.map((a) => (
                    <li key={a.en} className="border-b border-line pb-3 last:border-0 last:pb-0">
                      <p lang="ar" dir="rtl" className="text-[15px] leading-snug font-semibold text-ink">
                        {a.ar}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-faint">{a.en}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="concept relative flex flex-col border border-line bg-surface p-5">
                <span className={conceptTag}>Concept</span>
                <p className="flex items-center gap-2 text-xs font-semibold text-faint">
                  <Sparkles size={13} aria-hidden className="text-accent" />
                  AI assistant
                </p>
                <p className="mt-4 self-end rounded-2xl rounded-br-sm bg-surface-3 px-3.5 py-2 text-sm text-ink">
                  Who does Scan-to-BIM in Riyadh?
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Several Riyadh firms offer it.{" "}
                  <span className="text-ink">GeoArabia</span>, based in Ar Rayan,
                  provides 3D laser scanning and Scan-to-BIM for consultants
                  and contractors, and publishes guidance on when a project
                  needs it…
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/60 px-2.5 py-1 text-[11px] text-ink">
                    <Search size={10} aria-hidden className="text-accent" />
                    geoarabia.sa
                  </span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-faint">
                    + 3 sources
                  </span>
                </div>
                <p className="mt-3 text-[11px] leading-snug text-faint">
                  The goal, not a result today. We check twenty questions like
                  this every month.
                </p>
              </div>
            </div>
          </Layer>

          {/* 2 — Trusted */}
          <Layer
            flip
            n="02"
            label="Trusted · Social media"
            title="LinkedIn first. The work, not stock photos."
            body="Buyers check a firm before they send drawings. LinkedIn is where consultants and developers look, so it leads, in Arabic and English. Facebook and Instagram carry the same system. Every post is built from GeoArabia's own scans, models and sites."
            points={[
              "A monthly content plan, agreed a month ahead",
              "12 designed posts a month across the three channels",
              "A LinkedIn company page in Arabic and English",
              "A round logo that fits the circle",
            ]}
          >
            <div className="concept relative overflow-hidden border border-line bg-surface">
              <span className={conceptTag}>Concept</span>
              <div className="flex items-center gap-3 border-b border-line p-4">
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-[11px] font-extrabold tracking-tight text-[#183054]"
                >
                  GA
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">GeoArabia</p>
                  <p className="text-[11px] text-faint">LinkedIn · Geomatics · Riyadh</p>
                </div>
              </div>
              <p className="px-4 pt-4 text-sm leading-relaxed text-ink">
                Same building, three stages. The scan took one morning; the
                model is what the design team works from.{" "}
                <span className="text-faint">#ScanToBIM #Riyadh</span>
              </p>
              {/* A three-frame carousel, drawn rather than photographed:
                  scan, point cloud, model. */}
              <div className="mt-4 grid grid-cols-3 gap-px bg-line">
                {["Scan", "Point cloud", "BIM"].map((stage, i) => (
                  <div key={stage} className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                    <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full" aria-hidden>
                      {i === 0 ? (
                        <g stroke="var(--accent)" strokeWidth="0.6" fill="none" opacity="0.8">
                          {Array.from({ length: 9 }, (_, k) => (
                            <line key={k} x1="50" y1="92" x2={10 + k * 10} y2="22" opacity={0.25 + (k % 3) * 0.2} />
                          ))}
                          <circle cx="50" cy="96" r="4" fill="var(--accent)" stroke="none" />
                        </g>
                      ) : i === 1 ? (
                        <g fill="var(--accent)">
                          {Array.from({ length: 140 }, (_, k) => {
                            const x = 18 + ((k * 37) % 64);
                            const y = 24 + ((k * 53) % 70);
                            return <circle key={k} cx={x} cy={y} r={0.9} opacity={0.35 + ((k * 7) % 10) / 16} />;
                          })}
                        </g>
                      ) : (
                        <g fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.8">
                          <path d="M20 94 V40 L50 26 L80 40 V94 Z" />
                          <path d="M20 58 H80 M20 76 H80 M50 26 V94" opacity="0.5" />
                          <path d="M30 94 V82 H40 V94" stroke="var(--accent)" />
                        </g>
                      )}
                    </svg>
                    <span className="absolute bottom-2 left-2 text-[10px] font-semibold tracking-[0.14em] text-faint uppercase">
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Layer>

          {/* 3 — Contacted */}
          <Layer
            n="03"
            label="Contacted · WhatsApp automation"
            title="The enquiry arrives already qualified."
            body="In the Kingdom the first message usually goes to WhatsApp, often late at night. A bot answers straight away in Arabic or English, asks what an engineer would ask, collects the site plan and hands a complete brief to a person."
            points={[
              "Service menu, location, size and timeline",
              "Takes PDFs, drawings and photos",
              "Answers from the SEO articles, so the replies match the site",
              "Every lead logged, with where it came from",
            ]}
          >
            <div className="concept relative mx-auto max-w-md border border-line bg-[#0b141a] p-4 sm:p-5">
              <span className={conceptTag}>Concept</span>
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#183054]">
                  GA
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">GeoArabia</p>
                  <p className="text-[11px] text-white/60">Business account</p>
                </div>
              </div>
              <ol dir="rtl" lang="ar" className="mt-4 flex flex-col gap-2">
                {whatsappThread.map((m, i) => (
                  <li
                    key={i}
                    className={clsx(
                      "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                      m.from === "bot"
                        ? "self-start rounded-tr-sm bg-[#202c33] text-white/90"
                        : "self-end rounded-tl-sm bg-[#005c4b] text-white",
                      "menu" in m && m.menu && "text-[12px] text-white/80",
                    )}
                  >
                    {"file" in m && m.file ? (
                      <span className="inline-flex items-center gap-2">
                        <FileText size={14} aria-hidden />
                        {m.text}
                      </span>
                    ) : (
                      m.text
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Layer>
        </div>
      </div>
    </section>
  );
}
