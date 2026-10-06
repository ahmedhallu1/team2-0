import type { Metadata } from "next";
import { ProposalChrome } from "@/components/proposal/proposal-chrome";
import { ProposalTheme } from "@/components/proposal/proposal-theme";
import { RmzLogo } from "@/components/proposal/rmz-logo";
import { rmz } from "@/lib/proposals/rmz";
import { GeoOpening } from "@/components/proposal/geoarabia/geo-opening";
import { GeoAudit } from "@/components/proposal/geoarabia/geo-audit";
import { GeoCompetitors } from "@/components/proposal/geoarabia/geo-competitors";
import { GeoPlan } from "@/components/proposal/geoarabia/geo-plan";
import { GeoContent } from "@/components/proposal/geoarabia/geo-content";
import { GeoCampaigns } from "@/components/proposal/geoarabia/geo-campaigns";
import { GeoInvestment } from "@/components/proposal/geoarabia/geo-investment";
import { GeoClosing } from "@/components/proposal/geoarabia/geo-closing";

/**
 * GeoArabia — a private proposal, with prices, presented by RMZtech.
 *
 * White-label: it lives in the `(rmz)` route group, whose root layout carries
 * none of 2.0's shell (see that file), and every name, logo, link and contact
 * on the page is RMZtech's. The icon and share image beside this file are
 * RMZtech's mark.
 *
 * Built on the KUPHUB proposal's rules (see that page's note): `noindex`,
 * absent from the sitemap, no site navigation, and art-directed in the
 * client's colours rather than ours — here GeoArabia's navy, and the contour
 * cyan from their own cover image.
 *
 * Deliberately shorter: eight chapters, no portfolio of other clients' work.
 * The one addition is the priced builder in chapter six, on the page's only
 * light ground.
 */
export const metadata: Metadata = {
  title: { absolute: "GeoArabia — a proposal by RMZtech" },
  description:
    "A private proposal from RMZtech for GeoArabia: SEO and GEO, social media, WhatsApp automation and campaigns, with prices.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "GeoArabia — a proposal by RMZtech",
    description: "Measured to the millimetre. Missing from the map.",
  },
};

/** Drives the chapter read-out in the chrome. Ids must exist in the markup. */
const sections = [
  { id: "opening", label: "The brief" },
  { id: "audit", label: "What we see" },
  { id: "competitors", label: "Competitive review" },
  { id: "plan", label: "The plan" },
  { id: "content", label: "The content" },
  { id: "campaigns", label: "Campaigns" },
  { id: "investment", label: "Investment" },
  { id: "next", label: "Next" },
];

export default function GeoArabiaProposalPage() {
  return (
    <>
      <ProposalTheme ground="geo" />
      <div className="proposal proposal--geo">
        <ProposalChrome
          sections={sections}
          client="GeoArabia"
          zone="geo"
          logo={{
            node: <RmzLogo className="text-[15px] sm:text-base" priority />,
            href: rmz.site,
            label: "RMZtech — The Platform",
          }}
        />
        <GeoOpening />
        <GeoAudit />
        <GeoCompetitors />
        <GeoPlan />
        <GeoContent />
        <GeoCampaigns />
        <GeoInvestment />
        <GeoClosing />
      </div>
    </>
  );
}
