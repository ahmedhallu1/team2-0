import type { Metadata } from "next";
import { ServicesSection } from "@/components/services-section";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The full 2.0 toolkit — online promotions, international & B2B lead generation, digital platform management, content, SEO, media buying, market research, supplier sourcing, trade show support and more.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <div className="h-16 sm:h-20" aria-hidden />
      <ServicesSection />
      <CtaBand
        title="Not sure where to start?"
        subtitle="Tell us your goal and we'll recommend the right mix of services."
      />
    </>
  );
}
