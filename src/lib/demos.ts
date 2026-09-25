/**
 * Concept demos — sites 2.0 built to show a whole industry what its website
 * could be. Not client work, and never mixed into `projects` (lib/work.ts),
 * which is only live, shipped work.
 */
export type Demo = {
  slug: string;
  name: string;
  /** Who the demo is for. */
  audience: string;
  summary: string;
  /** What a prospect can actually try on the demo. */
  features: string[];
  href: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

export const demos: Demo[] = [
  {
    slug: "interior-design-website-demo",
    name: "Interior design website demo",
    audience: "For interior and architecture studios",
    summary:
      "A complete studio website — portfolio, case studies, journal and a consultation flow — for a fictional studio. Studios can put their own name, logo and colours on it in the browser, and watch a 3D room build itself stage by stage as they scroll.",
    features: [
      "Brand Studio: preview it with your own name, logo and palette",
      "Portfolio and case studies with honest before/after",
      "Interactive 3D design-process room",
      "Consultation flow and a real enquiry form",
    ],
    href: "https://interiors.elevate2point0.com",
    image: "/work/interiors-concept.jpg",
    imageAlt:
      "The interior design website demo: “Spaces with gravity” in huge type, cut with image bands, over a vaulted desert living room.",
    imageWidth: 1600,
    imageHeight: 1000,
  },
];
