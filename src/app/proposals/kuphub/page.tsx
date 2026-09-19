import type { Metadata } from "next";
import { ProposalChrome } from "@/components/proposal/proposal-chrome";
import { Opening } from "@/components/proposal/opening";
import { CupScene } from "@/components/proposal/cup/cup-scene";
import { Audit } from "@/components/proposal/audit";
import { FeedConcept } from "@/components/proposal/feed-concept";
import { SiteConcept } from "@/components/proposal/site-concept";
import { ContentSystem } from "@/components/proposal/content-system";
import { LinkUpTurn } from "@/components/proposal/linkup-turn";
import { LinkUpConcept } from "@/components/proposal/linkup-concept";
import { Ecosystem } from "@/components/proposal/ecosystem";
import { Engagement } from "@/components/proposal/engagement";
import { Proof } from "@/components/proposal/proof";
import { Closing } from "@/components/proposal/closing";

/**
 * KUPHUB × LinkUp Egypt — a private proposal.
 *
 * Twelve chapters, one argument: the two businesses share an object, so they
 * should share the team behind how that object is presented.
 *
 * Two things about this route are deliberate and worth not undoing.
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
 * invitation to leave halfway. `ProposalChrome` carries the logo, the chapter
 * you are in, and the way out.
 */
export const metadata: Metadata = {
  title: "KUPHUB × LinkUp — a proposal",
  description:
    "A private proposal from 2.0 for KUPHUB and LinkUp Egypt: brand and content, two websites, and the growth work behind them.",
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
  { id: "feed", label: "The system" },
  { id: "site", label: "The website" },
  { id: "system", label: "Social" },
  { id: "turn", label: "The turn" },
  { id: "linkup", label: "LinkUp" },
  { id: "engine", label: "One engine" },
  { id: "engagement", label: "How we'd run it" },
  { id: "proof", label: "Proof" },
  { id: "next", label: "Next" },
];

export default function KuphubProposalPage() {
  return (
    <>
      <ProposalChrome sections={sections} />

      {/* `.proposal` scopes the two client palettes — see globals.css. */}
      <div className="proposal">
        <Opening />
        <div id="cup">
          <CupScene />
        </div>
        <Audit />
        <FeedConcept />
        <SiteConcept />
        <ContentSystem />
        <LinkUpTurn />
        <LinkUpConcept />
        <Ecosystem />
        <Engagement />
        <Proof />
        <Closing />
      </div>
    </>
  );
}
