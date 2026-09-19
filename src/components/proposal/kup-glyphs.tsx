import type { CSSProperties } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Drawn devices for the KUPHUB concept work.
 *
 * Deliberately drawings rather than photographs. The proposal is showing a
 * visual *system* — the grid, the type, the colour, where the mark sits — and
 * borrowing the client's photography to dress it up would muddle what is
 * theirs with what is ours. Where a real campaign would carry a photograph,
 * these tiles carry the shape of one and say so.
 */

/** The takeaway cup, flat. The recurring object in the whole system. */
export function CupGlyph({
  className,
  style,
  lid = true,
}: {
  className?: string;
  /** Lets a size ladder vary the height without a class per step. */
  style?: CSSProperties;
  lid?: boolean;
}) {
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} fill="none" aria-hidden>
      {lid ? (
        <>
          <ellipse cx="60" cy="27" rx="46" ry="8" fill="currentColor" opacity="0.9" />
          <rect x="14" y="27" width="92" height="9" rx="4" fill="currentColor" opacity="0.9" />
          <ellipse cx="78" cy="25" rx="6" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        </>
      ) : (
        <ellipse cx="60" cy="30" rx="44" ry="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
      )}
      <path
        d="M17 36 L30 148 Q30 154 36 154 L84 154 Q90 154 90 148 L103 36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="60" cy="152" rx="30" ry="6" fill="currentColor" opacity="0.14" />
    </svg>
  );
}

/** The amber full-stop from the mark, used as the system's punctuation. */
export function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx("inline-block rounded-full align-baseline", className)}
      style={{ background: "var(--kup-amber)" }}
    />
  );
}

/** Steam, for the hot half of the menu. */
export function SteamGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 44" className={className} fill="none" aria-hidden>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${14 + i * 16} 42 C${8 + i * 16} 30, ${20 + i * 16} 24, ${14 + i * 16} 12 C${11 + i * 16} 6, ${15 + i * 16} 3, ${15 + i * 16} 2`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.9 - i * 0.22}
        />
      ))}
    </svg>
  );
}

/** A minimal pin, for the branch tiles. */
export function PinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="currentColor" />
    </svg>
  );
}

/**
 * The KUPHUB mark, set as type.
 *
 * This is our setting of the client's name for a concept — the stacked lockup
 * and the caramel full-stop follow the public logo, but it is drawn from the
 * page's own display face rather than lifted from their artwork.
 */
export function KupMark({
  className,
  tone = "light",
  stacked = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  stacked?: boolean;
}) {
  const ink = tone === "light" ? "#ffffff" : "#0c4f28";
  return (
    <span
      aria-label="KUPHUB"
      className={clsx(
        "inline-flex font-display font-extrabold tracking-[-0.04em] uppercase",
        stacked ? "flex-col leading-[0.82]" : "items-baseline gap-[0.08em] leading-none",
        className,
      )}
      style={{ color: ink }}
    >
      <span>Kup</span>
      <span className="inline-flex items-baseline">
        Hub
        <Dot className="ml-[0.06em] h-[0.17em] w-[0.17em]" />
      </span>
    </span>
  );
}

/** LinkUp's lockup, set the same way. */
export function LinkMark({ className }: { className?: string }) {
  return (
    <span
      aria-label="LinkUp Egypt"
      className={clsx(
        "inline-flex items-baseline font-display leading-none font-extrabold tracking-[-0.04em] uppercase",
        className,
      )}
    >
      <span style={{ color: "var(--ink)" }}>Link</span>
      <span style={{ color: "var(--link)" }}>Up</span>
    </span>
  );
}
