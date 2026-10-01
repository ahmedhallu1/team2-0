import type { Metadata, Viewport } from "next";
import { Alexandria, Instrument_Serif } from "next/font/google";
import "./kuphub.css";
import { site, social, stores } from "@/lib/kuphub/site";

/**
 * KUPHUB's own root layout.
 *
 * The 2.0 site lives in the `(site)` route group with its own root layout; this
 * one shares nothing with it — no 2.0 loader, cursor, header, fonts or
 * structured data. A visitor on kuphub.elevate2point0.com should never see a
 * trace of the agency except the credit in the footer.
 *
 * The display face is Alexandria — a geometric Latin + Arabic family named
 * for, and drawn with, the city KUPHUB pours in. Its heavy weights sit close to
 * the KUPHUB mark, and the Arabic lines on the page come from the same family
 * rather than a fallback. The cup renderer reads `--font-display-face` and
 * `--font-body` (see components/proposal/cup/labels.ts), so the print on the
 * canvas cup is set in it too.
 */
const alexandria = Alexandria({
  variable: "--font-display-face",
  subsets: ["latin", "arabic"],
  display: "swap",
});

/** One italic, used sparingly as the "more" in "less is more". */
const serif = Instrument_Serif({
  variable: "--font-kup-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "KUPHUB — Less is more · Premium koffee & kup to go",
  description:
    "Premium koffee and kup to go, at four addresses in Alexandria. See the board, build your cup, find your branch — and order ahead in the KUPHUB app on iPhone and Android.",
  applicationName: "KUPHUB",
  alternates: { canonical: "/" },
  /**
   * Not indexed while it lives on our subdomain. It's built to move to
   * kuphub.com; until it does, a search for KUPHUB shouldn't land somewhere
   * KUPHUB doesn't own. Flip this when the domain is pointed.
   */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "KUPHUB",
    title: "KUPHUB — Less is more",
    description: "Premium koffee & kup to go. Four addresses in Alexandria, one app.",
    url: "/",
    locale: "en_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "KUPHUB — Less is more",
    description: "Premium koffee & kup to go. Four addresses in Alexandria, one app.",
  },
  appLinks: {
    ios: { url: stores.appStore, app_store_id: "6773118243", app_name: "KUPHUB" },
    android: { package: "com.rmz.kuphub", app_name: "KUPHUB", url: stores.googlePlay },
  },
  itunes: { appId: "6773118243" },
};

export const viewport: Viewport = {
  themeColor: "#061a0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "KUPHUB",
  slogan: "Less is more",
  description: "Premium koffee & kup to go — four addresses in Alexandria.",
  servesCuisine: ["Coffee", "Iced tea", "Juice", "Desserts"],
  areaServed: "Alexandria, Egypt",
  email: social.email,
  sameAs: [social.instagram.url, stores.appStore, stores.googlePlay],
};

export default function KuphubLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${alexandria.variable} ${serif.variable} antialiased`}>
      <body className="kup bg-forest-900 font-sans text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only rounded-full bg-caramel px-5 py-2.5 text-sm font-bold text-bean focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
