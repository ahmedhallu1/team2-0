import { Hero } from "@/components/hero";
import { ServicesPreview } from "@/components/services-preview";
import { ProcessSection } from "@/components/process-section";
import { CtaBand } from "@/components/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
