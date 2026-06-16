import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CursorFx } from "@/components/fx/cursor-fx";
import { Preloader } from "@/components/preloader";

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

// Runs before paint: applies the saved theme (or OS default) with no flash.
const themeScript = `(function(){try{var e=document.documentElement;e.classList.add("js");var t=localStorage.getItem("theme");if(t==="light")e.classList.add("light");else if(t==="dark")e.classList.add("dark");}catch(_){}})();`;

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // fall through to default if the env value is malformed
    }
  }
  return new URL("https://elevate2point0.com");
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "2.0 - Elevate your vision",
    template: "%s · 2.0 - Elevate your vision",
  },
  description:
    "2.0 is a B2B team that helps businesses grow at home and abroad — international lead generation, digital platform management, content, SEO, media buying, market research, supplier sourcing and more.",
  keywords: [
    "B2B services",
    "international lead generation",
    "digital marketing",
    "SEO",
    "media buying",
    "market research",
    "supplier sourcing",
    "social media management",
    "brand building",
  ],
  authors: [{ name: "2.0" }],
  creator: "2.0",
  publisher: "2.0",
  applicationName: "2.0",
  alternates: { canonical: "/" },
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
    "B2B growth partner offering international lead generation, digital platform management, content creation, SEO, media buying, market research and supplier sourcing.",
  url: siteUrl.toString(),
  logo: new URL("/brand/2.0logo.png", siteUrl).toString(),
  image: new URL("/brand/2.0logo.png", siteUrl).toString(),
  email: "info@elevate2point0.com",
  telephone: "+201204538936",
  areaServed: "Worldwide",
  knowsAbout: [
    "B2B lead generation",
    "International lead generation",
    "SEO",
    "Media buying",
    "Content creation",
    "Social media management",
    "Market research",
    "Supplier sourcing",
    "Brand building",
    "Trade show support",
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
      <body className="grain flex min-h-full flex-col overflow-x-hidden bg-bg font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Preloader />
        <CursorFx />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-bold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
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
