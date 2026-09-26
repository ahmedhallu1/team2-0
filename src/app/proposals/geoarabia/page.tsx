import type { Metadata } from "next";
import { ProposalChrome } from "@/components/proposal/proposal-chrome";
import { ProposalTheme } from "@/components/proposal/proposal-theme";
import { GeoOpening } from "@/components/proposal/geoarabia/geo-opening";
import { GeoAudit } from "@/components/proposal/geoarabia/geo-audit";
import { GeoPlan } from "@/components/proposal/geoarabia/geo-plan";
import { GeoCampaigns } from "@/components/proposal/geoarabia/geo-campaigns";
import { GeoInvestment } from "@/components/proposal/geoarabia/geo-investment";
import { GeoClosing } from "@/components/proposal/geoarabia/geo-closing";

/**
 * GeoArabia — a private proposal, with prices.
 *
 * Built on the KUPHUB proposal's rules (see that page's note): `noindex`,
 * absent from the sitemap, no site navigation, and art-directed in the
 * client's colours rather than ours — here GeoArabia's navy, and the contour
 * cyan from their own cover image.
 *
 * Deliberately shorter: six chapters, no portfolio of other clients' work.
 * The one addition is the priced builder in chapter four, on the page's only
 * light ground.
 */
export const metadata: Metadata = {
  title: "GeoArabia — a proposal",
  description:
    "A private proposal from 2.0 for GeoArabia: website, SEO and GEO, social media, WhatsApp automation and campaigns, with prices.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "GeoArabia — a proposal by 2.0",
    description: "Measured to the millimetre. Missing from the map.",
  },
};

/** Drives the chapter read-out in the chrome. Ids must exist in the markup. */
const sections = [
  { id: "opening", label: "The brief" },
  { id: "audit", label: "What we see" },
  { id: "plan", label: "The plan" },
  { id: "campaigns", label: "Campaigns" },
  { id: "investment", label: "Investment" },
  { id: "next", label: "Next" },
];

export default function GeoArabiaProposalPage() {
  return (
    <>
      <ProposalTheme ground="geo" />
      <div className="proposal proposal--geo">
        <ProposalChrome sections={sections} client="GeoArabia" zone="geo" />
        <GeoOpening />
        <GeoAudit />
        <GeoPlan />
        <GeoCampaigns />
        <GeoInvestment />
        <GeoClosing />
      </div>
    </>
  );
}
