import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "../(site)/globals.css";
import { MotionRuntime } from "@/components/fx/motion-runtime";
import { rmz } from "@/lib/proposals/rmz";

/**
 * The root layout for proposals presented under RMZtech's name.
 *
 * The 2.0 site's own root layout (in `(site)`) plays the 2.0 brand intro on a
 * first visit, draws 2.0's cursor and route curtain, and publishes 2.0's
 * structured data, favicon and title suffix — every one of which would put our
 * name on a document that is meant to carry theirs. This layout keeps only
 * what the proposal components actually need: the design tokens and type
 * (globals.css, the two faces), the `.js` boot that the entrance animations
 * key off, and the motion runtime that re-measures scroll triggers and
 * guarantees nothing stays hidden.
 *
 * `dark` is pinned on <html>: the proposal is art-directed in the client's
 * palette, and a visitor whose phone is in light mode must not get the site's
 * light-theme tokens leaking into anything outside a zone.
 */
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

/** Marks the document as scripted before paint, so entrances can start hidden. */
const bootScript = `document.documentElement.classList.add("js")`;

/** Where the page is served from, so the share image resolves to an absolute URL. */
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://elevate2point0.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: rmz.name, template: `%s · ${rmz.name}` },
  applicationName: rmz.name,
  authors: [{ name: rmz.name, url: rmz.site }],
  creator: rmz.name,
  publisher: rmz.name,
  robots: { index: false, follow: false, nocache: true },
  openGraph: { type: "website", siteName: rmz.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#07101f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RmzLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} dark intro-skip intro-done h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <MotionRuntime />
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-bold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to content
        </a>
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
