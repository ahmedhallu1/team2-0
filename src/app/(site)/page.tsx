import { Hero } from "@/components/hero";
import { ProofBand } from "@/components/proof-band";
import { ServicesMarquee } from "@/components/fx/services-marquee";
import { ServicesPreview } from "@/components/services-preview";
import { WorkPreview } from "@/components/work-preview";
import { ProcessSection } from "@/components/process-section";
import { CtaBand } from "@/components/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofBand />
      <ServicesMarquee />
      <ServicesPreview />
      <WorkPreview />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
