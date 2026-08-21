import type { Metadata } from "next";
import { ServicesSection } from "@/components/services-section";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six services, end to end — brand & content, websites & platforms, growth marketing, lead generation, market & trade, and events. Take one or hand us the whole engine.",
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
