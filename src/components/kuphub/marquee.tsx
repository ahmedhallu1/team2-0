import { Fragment } from "react";
import { clsx } from "@/lib/clsx";

const WORDS = [
  { en: "Turkish", ar: "قهوة تركي" },
  { en: "Cappuccino", ar: "كابتشينو" },
  { en: "Café Latte", ar: "كافيه لاتيه" },
  { en: "Iced Latte", ar: "آيس لاتيه" },
  { en: "Cold Brew", ar: "كولد برو" },
  { en: "Match & Mix", ar: "ماتش آند ميكس" },
  { en: "Santarosa", ar: "سانتا روزا" },
];

/**
 * The board, running past in both languages. Pure CSS: two copies of the row,
 * translated by half its width, so the loop has no seam and costs nothing on
 * the main thread. Decorative — the real board is the next section.
 */
export function Marquee() {
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-bean/10 bg-caramel py-5 text-bean select-none sm:py-6">
      <div className="kup-marquee flex w-max items-center" style={{ ["--speed" as string]: "46s" }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {WORDS.map((w) => (
              <Fragment key={w.en}>
                <span className="px-6 text-[clamp(1.6rem,3.6vw,2.8rem)] leading-none font-black tracking-[-0.04em] whitespace-nowrap sm:px-8">
                  {w.en}
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="px-2 text-[clamp(1.1rem,2.4vw,1.8rem)] font-medium leading-none whitespace-nowrap text-bean/85"
                >
                  {w.ar}
                </span>
                <span className={clsx("mx-6 inline-block h-3 w-3 shrink-0 rounded-full bg-forest sm:mx-8")} />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
