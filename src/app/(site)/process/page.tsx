import type { Metadata } from "next";
import { ProcessSection } from "@/components/process-section";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "How 2.0 works: a simple path from idea to impact — Discover, Strategize, Execute, Scale.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <div className="h-14 sm:h-16" aria-hidden />
      <ProcessSection headingLevel="h1" />
      <CtaBand />
    </>
  );
}
