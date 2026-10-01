import { branches, site, social, stores } from "@/lib/kuphub/site";
import { InstagramGlyph, KupLogo, LessIsMore, StoreButtons } from "./brand";
import { Stamp } from "./stamp";

/**
 * Franchise — straight from the Play listing: the app has an enquiry form for
 * anyone who wants a KUPHUB in their own neighbourhood. One band, one action.
 */
export function Franchise() {
  return (
    <section aria-labelledby="franchise-heading" className="relative overflow-hidden bg-caramel text-bean">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="max-w-3xl">
          <p className="kup-reveal text-xs font-bold tracking-[0.24em] uppercase opacity-70">Franchise</p>
          <h2
            id="franchise-heading"
            className="kup-reveal mt-4 text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[0.92] font-black tracking-[-0.05em]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            Want a KUPHUB
            <br />
            <span className="font-serif font-normal tracking-[-0.02em] italic">on your street?</span>
          </h2>
          <p className="kup-reveal mt-5 max-w-lg text-lg leading-relaxed opacity-80" style={{ ["--delay" as string]: "140ms" }}>
            Franchise enquiries go straight to the team, through the app.
          </p>
        </div>
        <a
          href={stores.path}
          className="kup-reveal group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-bean px-7 py-4 font-bold text-cream transition-[transform,background-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 hover:bg-forest lg:self-auto"
        >
          Enquire in the app
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
      <Stamp
        tone="ink"
        text="BRING KUPHUB HOME · FRANCHISE · "
        className="pointer-events-none absolute -right-14 -bottom-16 hidden h-56 w-56 opacity-25 lg:block"
      />
    </section>
  );
}

export function KupFooter() {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden bg-forest-950 pt-20 text-cream sm:pt-28">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <KupLogo withTagline className="w-28" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              {site.ownWords}. Four addresses in {site.city}, and an app that
              carries all of them.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.22em] text-caramel-300 uppercase">Visit</h2>
            <ul className="mt-5 space-y-3">
              {branches.map((b) => (
                <li key={b.id}>
                  <a href={b.maps} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="text-[0.95rem] font-bold transition-colors group-hover:text-caramel-300">{b.name}</span>
                    <span className="block text-sm text-cream/50">{b.detail}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.22em] text-caramel-300 uppercase">Say hello</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold transition-colors hover:text-caramel-300"
                >
                  <InstagramGlyph className="h-4 w-4" />
                  {social.instagram.handle}
                </a>
              </li>
              <li>
                <a href={`mailto:${social.email}`} className="break-all text-cream/70 transition-colors hover:text-caramel-300">
                  {social.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.22em] text-caramel-300 uppercase">Order ahead</h2>
            <StoreButtons className="mt-5 flex-col items-start" />
          </div>
        </div>
      </div>

      {/* The sign-off: the name, as big as the page will hold it */}
      <div aria-hidden className="relative mt-20 select-none sm:mt-28">
        {/* SVG, so the word is fitted to the width exactly at every size. */}
        <svg viewBox="0 0 1000 178" className="block w-full">
          <text
            x="500"
            y="170"
            textAnchor="middle"
            textLength="972"
            lengthAdjust="spacingAndGlyphs"
            fontSize="232"
            fontWeight="900"
            letterSpacing="-14"
            fill="#0e3a20"
          >
            KUPHUB<tspan fill="#c88c46">.</tspan>
          </text>
        </svg>
        <Stamp
          tone="cream"
          className="absolute -top-[45%] right-[4%] h-[12vw] max-h-36 w-[12vw] max-w-36 opacity-70"
        />
      </div>

      <div className="relative border-t border-cream/8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            © {year} KUPHUB · <LessIsMore className="tracking-[0.3em]" />
          </p>
          <a
            href="https://elevate2point0.com"
            target="_blank"
            rel="noopener"
            className="transition-colors hover:text-cream"
          >
            Site by <span className="font-bold text-cream/85">2.0</span> ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
