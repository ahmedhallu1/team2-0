/**
 * The shared look of actions and labels. Centralised so a CTA on the contact
 * page and a CTA in the footer are unmistakably the same control.
 */

/** Lime is the action colour — crisp and squared, never a glowing pill. */
export const actionPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-bold tracking-tight text-on-accent transition-transform duration-300 hover:-translate-y-0.5 focus-visible:-translate-y-0.5";

/** Secondary: a hairline frame that takes the accent border on hover. */
export const actionGhost =
  "group inline-flex items-center justify-center gap-2 rounded-lg border border-line-2 px-6 py-3.5 text-sm font-semibold tracking-tight text-ink transition-colors duration-300 hover:border-accent hover:text-brand";

/** Inline text action — the quiet third tier. */
export const actionText =
  "group inline-flex items-center gap-1.5 text-sm font-semibold text-brand";

/** Section eyebrow — the small tracked label above every heading. */
export const eyebrow =
  "text-[11px] font-semibold tracking-[0.3em] text-brand uppercase";

/** Display heading scale, shared across routes. */
export const h1 =
  "font-display text-[clamp(2.5rem,7.5vw,5rem)] leading-[0.94] font-extrabold tracking-[-0.02em] text-ink";
export const h2 =
  "font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-ink";

/** Metadata chip. */
export const chip =
  "inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted";
