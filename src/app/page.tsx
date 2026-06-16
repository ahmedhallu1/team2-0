import { Hero } from "@/components/hero";
import { ServicesMarquee } from "@/components/fx/services-marquee";
import { ServicesPreview } from "@/components/services-preview";
import { ProcessSection } from "@/components/process-section";
import { CtaBand } from "@/components/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <ServicesPreview />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
