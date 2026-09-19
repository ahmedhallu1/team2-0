import type { ConceptPost } from "@/lib/proposals/kuphub";
import { CupGlyph, Dot, KupMark, PinGlyph, SteamGlyph } from "./kup-glyphs";
import { clsx } from "@/lib/clsx";

/**
 * One tile of the proposed KUPHUB feed.
 *
 * Nine tiles, four colourways, one set of rules: a single message per frame,
 * the mark always in the same corner at the same size, the caramel dot as the
 * only punctuation, and type that is allowed to be the picture. The content is
 * KUPHUB's own — their offers, their prices, their branches — so what is on
 * show is the system, not a different business.
 *
 * Rendered as real DOM rather than flat images on purpose: it is sharp on a
 * projector, it re-colours with the theme, and the headline of every concept
 * post is readable by a screen reader and selectable by the person presenting.
 */

const TONES = {
  deep: {
    bg: "var(--kup)",
    ink: "#ffffff",
    sub: "rgba(255,255,255,0.68)",
    mark: "light" as const,
  },
  cream: {
    bg: "var(--paper)",
    ink: "#12100d",
    sub: "rgba(18,16,13,0.6)",
    mark: "dark" as const,
  },
  amber: {
    bg: "var(--kup-amber)",
    ink: "#1a1105",
    sub: "rgba(26,17,5,0.66)",
    mark: "dark" as const,
  },
  ink: {
    bg: "#12100d",
    ink: "#ffffff",
    sub: "rgba(255,255,255,0.6)",
    mark: "light" as const,
  },
};

export function ConceptTile({
  post,
  className,
}: {
  post: ConceptPost;
  className?: string;
}) {
  const tone = TONES[post.tone];

  return (
    <figure
      data-tile
      className={clsx(
        "concept group relative aspect-square select-none",
        className,
      )}
      style={{ background: tone.bg, color: tone.ink }}
    >
      <Body post={post} tone={tone} />

      {/* The lockup sits in the same place on every frame. That repetition is
          most of what makes a grid read as one account rather than nine. */}
      <KupMark
        tone={tone.mark}
        className="absolute right-[7%] bottom-[6%] text-[clamp(0.55rem,1.6vw,0.8rem)] opacity-80"
      />

      <figcaption className="sr-only">
        Concept post — {post.kind}: {post.headline}
        {post.sub ? `. ${post.sub}` : ""}
      </figcaption>

      {/* What the pillar is, revealed on hover for the walk-through. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[6%] left-[7%] rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-[10px]"
        style={{ background: tone.ink, color: tone.bg }}
      >
        {post.pillar}
      </span>
    </figure>
  );
}

type Tone = (typeof TONES)[keyof typeof TONES];

function Body({ post, tone }: { post: ConceptPost; tone: Tone }) {
  const pad = "absolute inset-0 flex flex-col p-[8%]";

  switch (post.layout) {
    /* The line, used as the layout. */
    case "type":
      return (
        <div className={clsx(pad, "justify-center")}>
          <p className="font-display text-[clamp(1.4rem,5.4vw,2.6rem)] leading-[0.88] font-extrabold tracking-[-0.045em]">
            Less
            <br />
            is
            <br />
            more
            <Dot className="ml-[0.1em] inline-block h-[0.13em] w-[0.13em] align-baseline" />
          </p>
          <p
            className="mt-[6%] text-[clamp(0.5rem,1.5vw,0.7rem)] tracking-[0.2em] uppercase"
            style={{ color: tone.sub }}
          >
            {post.sub}
          </p>
        </div>
      );

    /* A product, with room for the photograph that would replace the drawing. */
    case "product":
      return (
        <div className={clsx(pad, "justify-between")}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-[clamp(1rem,3.4vw,1.7rem)] leading-[0.94] font-extrabold tracking-[-0.03em]">
              {post.headline}
            </p>
            <SteamGlyph className="mt-1 w-[14%] shrink-0 opacity-45" />
          </div>
          <CupGlyph className="absolute top-[26%] left-1/2 h-[46%] -translate-x-1/2 opacity-90" />
          <div className="relative flex items-end justify-between gap-2 pr-[24%]">
            <div>
              {post.arabic ? (
                <p
                  dir="rtl"
                  lang="ar"
                  className="text-[clamp(0.6rem,2vw,0.95rem)] font-semibold"
                  style={{ color: tone.sub }}
                >
                  {post.arabic}
                </p>
              ) : null}
              <p className="mt-0.5 text-[clamp(0.6rem,1.9vw,0.9rem)] font-bold">
                {post.sub}
              </p>
            </div>
          </div>
        </div>
      );

    /* An offer. The same shape every time one runs. */
    case "offer":
      return (
        <div className={clsx(pad, "justify-between")}>
          <p
            className="text-[clamp(0.5rem,1.5vw,0.7rem)] tracking-[0.2em] uppercase"
            style={{ color: tone.sub }}
          >
            {post.sub}
          </p>
          <div>
            <p className="font-display text-[clamp(1.25rem,4.4vw,2.2rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
              {post.headline}
            </p>
            {post.arabic ? (
              <p
                dir="rtl"
                lang="ar"
                className="mt-[4%] text-[clamp(0.65rem,2.1vw,1rem)] font-semibold"
                style={{ color: tone.sub }}
              >
                {post.arabic}
              </p>
            ) : null}
          </div>
          <div
            aria-hidden
            className="h-px w-[38%]"
            style={{ background: tone.ink, opacity: 0.35 }}
          />
        </div>
      );

    /* The range, as a system rather than a list of prices. */
    case "menu":
      return (
        <div className={clsx(pad, "justify-between")}>
          <p className="font-display text-[clamp(1rem,3.4vw,1.7rem)] leading-[0.92] font-extrabold tracking-[-0.03em]">
            {post.headline}
          </p>
          <div aria-hidden className="grid grid-cols-4 gap-[6%]">
            {["#d8c14a", "#e08a4c", "#d24f5e", "#e0c04c", "#9a5fa8", "#4c7fd2", "#5aa464"].map(
              (c) => (
                <span
                  key={c}
                  className="aspect-square rounded-full"
                  style={{ background: c }}
                />
              ),
            )}
            <span
              className="flex aspect-square items-center justify-center rounded-full border text-[9px] font-bold"
              style={{ borderColor: tone.sub, color: tone.sub }}
            >
              7
            </span>
          </div>
          <p
            className="pr-[24%] text-[clamp(0.55rem,1.8vw,0.82rem)] leading-snug font-semibold"
            style={{ color: tone.sub }}
          >
            {post.sub}
          </p>
        </div>
      );

    /* The Smouha partnership, given a name and a look instead of a price. */
    case "campaign":
      return (
        <div className={clsx(pad, "justify-end")}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, transparent 0 12px, currentColor 12px 13px)",
            }}
          />
          <div className="relative pr-[26%]">
            <p
              className="text-[clamp(0.5rem,1.5vw,0.68rem)] tracking-[0.2em] uppercase"
              style={{ color: tone.sub }}
            >
              {post.sub}
            </p>
            <p className="mt-[5%] font-display text-[clamp(1.2rem,4.2vw,2.1rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
              {post.headline}
            </p>
            {post.arabic ? (
              <p
                dir="rtl"
                lang="ar"
                className="mt-[4%] text-[clamp(0.7rem,2.2vw,1.05rem)] font-semibold"
              >
                {post.arabic}
              </p>
            ) : null}
          </div>
        </div>
      );

    /* A reel cover. The one vertical format, so it is drawn as one. */
    case "reel":
      return (
        <div className={clsx(pad, "items-center justify-center")}>
          <div
            className="flex h-full w-[62%] flex-col justify-between rounded-md p-[8%]"
            style={{ background: "rgba(255,255,255,0.06)", outline: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span
              className="inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-[0.12em] uppercase"
              style={{ background: "var(--kup-amber)", color: "#1a1105" }}
            >
              Reel
            </span>
            <CupGlyph lid={false} className="mx-auto h-[42%] opacity-70" />
            <p className="font-display text-[clamp(0.7rem,2.2vw,1.05rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
              {post.headline}
            </p>
          </div>
        </div>
      );

    /* A branch, treated as a place rather than an address line. */
    case "branch":
      return (
        <div className={clsx(pad, "justify-between")}>
          <PinGlyph className="w-[16%] opacity-70" />
          <div>
            <p className="font-display text-[clamp(1.1rem,3.8vw,1.9rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">
              {post.headline}
            </p>
            <p
              className="mt-[3%] pr-[26%] text-[clamp(0.55rem,1.7vw,0.8rem)] tracking-[0.14em] uppercase"
              style={{ color: tone.sub }}
            >
              {post.sub}
            </p>
          </div>
          <div
            aria-hidden
            className="h-px w-[62%]"
            style={{ background: tone.ink, opacity: 0.22 }}
          />
        </div>
      );

    /* Their own words, set properly. */
    case "quote":
    default:
      return (
        <div className={clsx(pad, "justify-center")}>
          <p className="font-display text-[clamp(1.1rem,3.8vw,1.9rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance">
            {post.headline}
          </p>
          <p
            className="mt-[6%] text-[clamp(0.5rem,1.5vw,0.7rem)] tracking-[0.18em] uppercase"
            style={{ color: tone.sub }}
          >
            {post.sub}
          </p>
        </div>
      );
  }
}
