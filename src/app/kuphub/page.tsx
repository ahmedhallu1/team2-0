import { KupHeader } from "@/components/kuphub/header";
import { KupRuntime } from "@/components/kuphub/runtime";
import { CupStory } from "@/components/kuphub/cup-story";
import { Marquee } from "@/components/kuphub/marquee";
import { MenuBoard } from "@/components/kuphub/menu-board";
import { CupBuilder } from "@/components/kuphub/cup-builder";
import { MatchMix } from "@/components/kuphub/match-mix";
import { AppShowcase } from "@/components/kuphub/app-showcase";
import { Branches } from "@/components/kuphub/branches";
import { Franchise, KupFooter } from "@/components/kuphub/footer";

/**
 * kuphub.elevate2point0.com — KUPHUB's website.
 *
 * Served at the subdomain's root by a host rewrite (see next.config.ts), and
 * reachable at /kuphub on the main domain for previews. One page, in the order
 * a customer actually needs it: what KUPHUB is, what's on the board, how to
 * have it your way, the app that does all of it, and where to find it.
 *
 * The sections alternate between the cup's forest and its unprinted cream, so
 * the page reads as the cup does: printed, then plain, then printed again.
 */
export default function KuphubPage() {
  return (
    <div className="kup-grain">
      <KupRuntime />
      <KupHeader />
      <main id="main">
        <CupStory />
        <Marquee />
        <MenuBoard />
        <CupBuilder />
        <MatchMix />
        <AppShowcase />
        <Branches />
        <Franchise />
      </main>
      <KupFooter />
    </div>
  );
}
