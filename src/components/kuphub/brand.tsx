import Image from "next/image";
import { stores } from "@/lib/kuphub/site";
import { clsx } from "@/lib/clsx";

/**
 * KUPHUB's mark, lifted from the app icon onto a transparent ground — the real
 * letterforms, cut U and all, not a re-setting of the name.
 */
export function KupLogo({
  className,
  withTagline = false,
  priority = false,
}: {
  className?: string;
  withTagline?: boolean;
  priority?: boolean;
}) {
  return withTagline ? (
    <Image
      src="/kup/logo.png"
      alt="KUPHUB — less is more"
      width={480}
      height={467}
      priority={priority}
      className={clsx("h-auto", className)}
    />
  ) : (
    <Image
      src="/kup/logo-mark.png"
      alt="KUPHUB"
      width={320}
      height={274}
      priority={priority}
      className={clsx("h-auto", className)}
    />
  );
}

/** "LESS IS MORE", with the IS in caramel — the way the mark sets it. */
export function LessIsMore({ className }: { className?: string }) {
  return (
    <span className={clsx("tracking-[0.42em] uppercase", className)}>
      Less<span className="text-caramel">is</span>more
    </span>
  );
}

export function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  );
}

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

/**
 * The two store buttons.
 *
 * Built in the shape of the official badges — the store's glyph, a small
 * kicker, the store's name — so they read as badges at a glance, but dressed
 * in KUPHUB's palette instead of sitting on the page as two black stickers.
 */
export function StoreButtons({
  tone = "dark",
  className,
  size = "md",
}: {
  tone?: "dark" | "light" | "caramel";
  className?: string;
  size?: "md" | "lg";
}) {
  const base = clsx(
    "group inline-flex items-center gap-3 rounded-2xl border transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 active:translate-y-0",
    size === "lg" ? "px-5 py-3.5" : "px-3.5 py-2 sm:px-4 sm:py-2.5",
    tone === "dark" && "border-cream/18 bg-forest-950/70 text-cream backdrop-blur hover:border-caramel/70 hover:bg-forest-950",
    tone === "light" && "border-ink/12 bg-ink text-cream hover:bg-forest-900",
    tone === "caramel" && "border-bean/15 bg-bean text-cream hover:bg-forest-900",
  );
  const glyph = size === "lg" ? "h-7 w-7" : "h-5 w-5 sm:h-6 sm:w-6";
  const kicker = "block text-[0.62rem] leading-none font-medium tracking-[0.08em] uppercase opacity-70";
  const name = clsx(
    "block leading-tight font-bold tracking-[-0.01em] whitespace-nowrap",
    size === "lg" ? "text-lg" : "text-[0.92rem] sm:text-base",
  );

  return (
    <div className={clsx("flex flex-wrap gap-2.5 sm:gap-3", className)}>
      <a
        href={stores.appStore}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        <AppleGlyph className={clsx(glyph, "-mt-0.5 shrink-0")} />
        <span className="text-left">
          <span className={kicker}>Download on the</span>
          <span className={name}>App Store</span>
        </span>
      </a>
      <a
        href={stores.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        <PlayGlyph className={clsx(size === "lg" ? "h-6 w-6" : "h-4.5 w-4.5 sm:h-5 sm:w-5", "shrink-0 text-caramel-300")} />
        <span className="text-left">
          <span className={kicker}>Get it on</span>
          <span className={name}>Google Play</span>
        </span>
      </a>
    </div>
  );
}

/** Points at /app, which sends a phone to the right store. */
const QR_SIZE = 29;
const QR_PATH =
  "M0 0h7v1h-7zM9 0h1v1h-1zM12 0h1v1h-1zM14 0h1v1h-1zM16 0h1v1h-1zM19 0h1v1h-1zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM10 1h1v1h-1zM15 1h1v1h-1zM17 1h2v1h-2zM20 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h5v1h-5zM15 2h1v1h-1zM18 2h1v1h-1zM20 2h1v1h-1zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM15 3h3v1h-3zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h2v1h-2zM16 4h1v1h-1zM19 4h2v1h-2zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h3v1h-3zM12 5h1v1h-1zM15 5h2v1h-2zM18 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM8 7h2v1h-2zM11 7h2v1h-2zM15 7h1v1h-1zM18 7h1v1h-1zM20 7h1v1h-1zM0 8h1v1h-1zM2 8h5v1h-5zM10 8h1v1h-1zM12 8h1v1h-1zM15 8h1v1h-1zM17 8h1v1h-1zM20 8h1v1h-1zM22 8h5v1h-5zM0 9h2v1h-2zM3 9h3v1h-3zM8 9h1v1h-1zM11 9h3v1h-3zM16 9h5v1h-5zM22 9h3v1h-3zM28 9h1v1h-1zM0 10h2v1h-2zM6 10h1v1h-1zM9 10h9v1h-9zM20 10h1v1h-1zM24 10h1v1h-1zM1 11h3v1h-3zM5 11h1v1h-1zM9 11h2v1h-2zM13 11h1v1h-1zM16 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM4 12h3v1h-3zM11 12h2v1h-2zM14 12h1v1h-1zM17 12h1v1h-1zM25 12h2v1h-2zM0 13h3v1h-3zM4 13h1v1h-1zM7 13h6v1h-6zM17 13h8v1h-8zM28 13h1v1h-1zM3 14h4v1h-4zM9 14h1v1h-1zM11 14h1v1h-1zM15 14h2v1h-2zM18 14h1v1h-1zM21 14h1v1h-1zM24 14h3v1h-3zM0 15h4v1h-4zM8 15h2v1h-2zM11 15h1v1h-1zM14 15h3v1h-3zM19 15h4v1h-4zM24 15h1v1h-1zM27 15h1v1h-1zM2 16h2v1h-2zM6 16h2v1h-2zM10 16h1v1h-1zM12 16h1v1h-1zM17 16h1v1h-1zM20 16h2v1h-2zM23 16h1v1h-1zM25 16h2v1h-2zM0 17h1v1h-1zM2 17h1v1h-1zM8 17h3v1h-3zM12 17h3v1h-3zM16 17h9v1h-9zM26 17h1v1h-1zM28 17h1v1h-1zM0 18h1v1h-1zM3 18h2v1h-2zM6 18h3v1h-3zM10 18h2v1h-2zM13 18h5v1h-5zM20 18h1v1h-1zM22 18h3v1h-3zM26 18h1v1h-1zM0 19h1v1h-1zM4 19h2v1h-2zM7 19h1v1h-1zM10 19h2v1h-2zM13 19h1v1h-1zM16 19h1v1h-1zM18 19h1v1h-1zM20 19h5v1h-5zM27 19h1v1h-1zM0 20h1v1h-1zM2 20h2v1h-2zM6 20h1v1h-1zM8 20h1v1h-1zM12 20h1v1h-1zM14 20h1v1h-1zM17 20h1v1h-1zM20 20h5v1h-5zM26 20h3v1h-3zM8 21h3v1h-3zM12 21h1v1h-1zM16 21h1v1h-1zM20 21h1v1h-1zM24 21h5v1h-5zM0 22h7v1h-7zM9 22h1v1h-1zM12 22h1v1h-1zM15 22h2v1h-2zM19 22h2v1h-2zM22 22h1v1h-1zM24 22h3v1h-3zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM11 23h2v1h-2zM14 23h1v1h-1zM18 23h3v1h-3zM24 23h1v1h-1zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM8 24h1v1h-1zM10 24h3v1h-3zM15 24h1v1h-1zM17 24h2v1h-2zM20 24h5v1h-5zM26 24h1v1h-1zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM8 25h1v1h-1zM14 25h1v1h-1zM16 25h1v1h-1zM23 25h1v1h-1zM25 25h4v1h-4zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM8 26h1v1h-1zM12 26h1v1h-1zM15 26h1v1h-1zM18 26h10v1h-10zM0 27h1v1h-1zM6 27h1v1h-1zM9 27h3v1h-3zM14 27h1v1h-1zM16 27h1v1h-1zM18 27h1v1h-1zM20 27h1v1h-1zM23 27h1v1h-1zM25 27h1v1h-1zM27 27h1v1h-1zM0 28h7v1h-7zM8 28h3v1h-3zM13 28h1v1h-1zM17 28h3v1h-3zM26 28h1v1h-1z";

export function AppQr({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`-2 -2 ${QR_SIZE + 4} ${QR_SIZE + 4}`}
      className={className}
      role="img"
      aria-label="QR code that opens the KUPHUB app in your phone's store"
      shapeRendering="crispEdges"
    >
      <rect x="-2" y="-2" width={QR_SIZE + 4} height={QR_SIZE + 4} fill="#f7f2e8" rx="2" />
      <path d={QR_PATH} fill="#061a0e" />
    </svg>
  );
}
