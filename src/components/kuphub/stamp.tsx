import { useId } from "react";
import { clsx } from "@/lib/clsx";

/**
 * A round stamp — "less is more" set around a circle with the caramel full
 * stop at its centre, the way a café marks a cup sleeve. It turns slowly; it's
 * decoration, so it's hidden from assistive tech and stops for reduced motion.
 */
export function Stamp({
  className,
  text = "LESS IS MORE · PREMIUM KOFFEE · KUP TO GO · ",
  tone = "ink",
}: {
  className?: string;
  text?: string;
  tone?: "ink" | "cream";
}) {
  const id = `stamp${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={clsx(
        "motion-safe:animate-[spin_28s_linear_infinite]",
        tone === "ink" ? "text-ink" : "text-cream",
        className,
      )}
    >
      <defs>
        <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.16" />
      <text fontSize="15.5" fontWeight="700" letterSpacing="4.2" fill="currentColor">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      <circle cx="100" cy="100" r="15" fill="#c88c46" />
    </svg>
  );
}
