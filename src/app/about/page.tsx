import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "About",
  description:
    "2.0 is an independent B2B services team of five who first came together at AIESEC. Learn how we help businesses promote, sell and expand at home and abroad.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="h-6 sm:h-10" aria-hidden />
      <AboutSection />
      <CtaBand />
    </>
  );
}
