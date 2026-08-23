import type { Metadata } from "next";
import { WorkGallery } from "@/components/work-gallery";
import { DesignShowcase } from "@/components/design-showcase";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Live products, platforms and brand experiences built by 2.0 — a 9,000-SKU B2B wholesale marketplace, a zero-cost CRM, an AI CV screening tool, a luxury event brought to life end to end, and the campaign design behind it all. A selection of our work, not the whole archive.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <div className="h-14 sm:h-16" aria-hidden />
      <WorkGallery />
      <DesignShowcase />
      <CtaBand
        title="Want something like this?"
        subtitle="Tell us what you're trying to build or grow — we'll tell you honestly what it takes."
      />
    </>
  );
}
