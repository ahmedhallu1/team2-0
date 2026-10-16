import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CursorFx } from "@/components/fx/cursor-fx";
import { RouteCurtain } from "@/components/fx/route-curtain";
import { MotionRuntime } from "@/components/fx/motion-runtime";
import { Preloader } from "@/components/preloader";
import { contactPhonesE164, instagramUrl } from "@/lib/contact";
import { armMotionFallback } from "@/lib/motion/fallback";
import { absoluteUrl, siteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Runs before paint. Applies the saved theme (or OS default) with no flash,
 * and decides in the same tick whether the brand intro plays at all: repeat
 * loads within a session and reduced-motion visitors get `intro-skip`, so the
 * loader is never painted for them even for one frame. It also arms the
 * motion safety net (see lib/motion/fallback.ts).
 */
const bootScript = `${armMotionFallback}(function(){try{var e=document.documentElement;e.classList.add("js");var t=localStorage.getItem("theme");if(t==="light")e.classList.add("light");else if(t==="dark")e.classList.add("dark");var s=false;try{s=sessionStorage.getItem("intro")==="1"}catch(_){}if(!s&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)s=true;if(s)e.classList.add("intro-skip","intro-done");}catch(_){}})();`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "2.0 - Elevate your vision",
    template: "%s · 2.0 - Elevate your vision",
  },
  description:
    "2.0 is a B2B team that helps businesses grow at home and abroad — brand & content, websites & platforms, growth marketing, lead generation and events. See the products and platforms we've shipped.",
  keywords: [
    "B2B services",
    "international lead generation",
    "digital marketing",
    "SEO",
    "media buying",
    "social media management",
    "brand building",
  ],
  authors: [{ name: "2.0" }],
  creator: "2.0",
  publisher: "2.0",
  applicationName: "2.0",
  // No site-wide canonical: inherited, it would point every page that forgot
  // its own — the 404 included — at the home page. Each page declares its own.
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "2.0 — Elevate Your Vision",
    description:
      "A B2B growth partner: international leads, digital platforms, marketing, SEO, market research, supplier sourcing and more.",
    siteName: "2.0",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2.0 — Elevate Your Vision",
    description:
      "A B2B growth partner: international leads, digital platforms, marketing, SEO, market research, supplier sourcing and more.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "2.0",
  alternateName: "2.0 — Elevate your vision",
  slogan: "Elevate your vision",
  description:
    "B2B growth partner offering brand and content, custom websites and platforms, growth marketing, lead generation and events.",
  url: siteUrl.toString(),
  logo: absoluteUrl("/brand/2.0logo.png"),
  image: absoluteUrl("/brand/2.0logo.png"),
  email: "contact@elevate2point0.com",
  telephone: contactPhonesE164,
  sameAs: [instagramUrl],
  areaServed: "Worldwide",
  knowsAbout: [
    "B2B lead generation",
    "International lead generation",
    "SEO",
    "Media buying",
    "Content creation",
    "Social media management",
    "Brand building",
    "Web development",
    "Event management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-bg font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Preloader />
        <RouteCurtain />
        <CursorFx />
        <MotionRuntime />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-bold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
