import type { Metadata } from "next";
import { ProposalChrome } from "@/components/proposal/proposal-chrome";
import { ProposalTheme } from "@/components/proposal/proposal-theme";
import { Opening } from "@/components/proposal/opening";
import { CupScene } from "@/components/proposal/cup/cup-scene";
import { Audit } from "@/components/proposal/audit";
import { FeedConcept } from "@/components/proposal/feed-concept";
import { SiteConcept } from "@/components/proposal/site-concept";
import { Campaigns } from "@/components/proposal/campaigns";
import { LinkUpTurn } from "@/components/proposal/linkup-turn";
import { LinkUpRebrand } from "@/components/proposal/linkup-rebrand";
import { LinkUpConcept } from "@/components/proposal/linkup-concept";
import { Ecosystem } from "@/components/proposal/ecosystem";
import { Closing } from "@/components/proposal/closing";

/**
 * KUPHUB × LinkUp Egypt — a private proposal.
 *
 * Three things about this route are deliberate and worth not undoing.
 *
 * It is `noindex, nofollow`. The page names a prospect, quotes their channels
 * and shows speculative concept work for their brands; it is meant to be
 * opened from a link we hand over, not found in a search. The rule is set in
 * this file's own metadata, so app/robots.ts and the rest of the site are
 * untouched — and the route is deliberately absent from app/sitemap.ts.
 *
 * It has no site navigation. SiteHeader and SiteFooter stand down on
 * `/proposals/*` (see the note in each), because this is presented full-screen
 * in a meeting and six links back to the marketing site at the top of it is an
 * invitation to leave halfway.
 *
 * It is art-directed in the clients' colours, not 2.0's. Each section declares
 * a `data-zone`, which re-points the semantic design tokens (see globals.css)
 * so KUPHUB's forest and LinkUp's ink each own their part of the document.
 * 2.0's own palette survives only in the chrome's logo and the signature at
 * the end — we are the author here, not the subject. There is no theme
 * toggle for the same reason.
 */
export const metadata: Metadata = {
  title: "KUPHUB × LinkUp — a proposal",
  description:
    "A private proposal from 2.0 for KUPHUB and LinkUp Egypt: brand and content, two websites, campaigns and the growth work behind them.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "KUPHUB × LinkUp — a proposal by 2.0",
    description: "Two businesses. One cup between them.",
  },
};

/** Drives the chapter read-out in the chrome. Ids must exist in the markup. */
const sections = [
  { id: "opening", label: "The idea" },
  { id: "cup", label: "One cup" },
  { id: "audit", label: "What we see" },
  { id: "feed", label: "The content" },
  { id: "site", label: "The website" },
  { id: "campaigns", label: "Campaigns" },
  { id: "turn", label: "The turn" },
  { id: "rebrand", label: "LinkUp identity" },
  { id: "linkup", label: "LinkUp" },
  { id: "engine", label: "One engine" },
  { id: "next", label: "Next" },
];

export default function KuphubProposalPage() {
  return (
    <>
      <ProposalTheme />

      {/* `.proposal` scopes the two client palettes — see globals.css. The
          chrome lives inside it so the fixed bar is dressed in the same
          palette as the document beneath it. */}
      <div className="proposal">
        <ProposalChrome sections={sections} />
        <Opening />
        <div id="cup">
          <CupScene />
        </div>
        <Audit />
        <FeedConcept />
        <SiteConcept />
        <Campaigns />
        <LinkUpTurn />
        <LinkUpRebrand />
        <LinkUpConcept />
        <Ecosystem />
        <Closing />
      </div>
    </>
  );
}
