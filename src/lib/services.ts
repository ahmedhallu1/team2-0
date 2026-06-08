import type { LucideIcon } from "lucide-react";
import {
  Megaphone,
  PenLine,
  Layers,
  Sparkles,
  Search,
  Target,
  MonitorSmartphone,
  Share2,
  FileText,
  MessagesSquare,
  Globe2,
  Network,
  HeartHandshake,
  LineChart,
  PackageSearch,
  Presentation,
  MapPin,
} from "lucide-react";

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Optional badge, e.g. the "full management" note from the brief. */
  badge?: string;
};

export type ServicePillar = {
  id: string;
  name: string;
  tagline: string;
  services: Service[];
};

export const pillars: ServicePillar[] = [
  {
    id: "marketing",
    name: "Marketing & Brand",
    tagline: "Make the market notice — and remember — you.",
    services: [
      {
        title: "Online Promotions",
        description:
          "Campaigns and offers engineered to spark demand and turn attention into action.",
        icon: Megaphone,
      },
      {
        title: "Content Creation",
        description:
          "Copy, visuals and video that tell your story and earn trust across every channel.",
        icon: PenLine,
      },
      {
        title: "Marketing Materials",
        description:
          "Decks, brochures, catalogues and one-pagers — polished assets your team can sell with.",
        icon: Layers,
      },
      {
        title: "Brand Building",
        description:
          "A clear identity, voice and positioning that set you apart and scale with you.",
        icon: Sparkles,
      },
      {
        title: "SEO",
        description:
          "Technical and content optimisation that lifts you up the rankings and keeps you there.",
        icon: Search,
      },
      {
        title: "Media Buying & Paid Ads",
        description:
          "Google Ads and Facebook/Meta campaigns managed for reach, ROAS and qualified pipeline.",
        icon: Target,
      },
    ],
  },
  {
    id: "digital",
    name: "Digital Presence",
    tagline: "Own every touchpoint, end to end.",
    services: [
      {
        title: "Managing Digital Platforms",
        description:
          "We run your channels day to day so they stay active, on-brand and on-strategy.",
        icon: MonitorSmartphone,
      },
      {
        title: "Social Media & Website",
        description:
          "Full management of your social presence and website — strategy, publishing and upkeep.",
        icon: Share2,
        badge: "Full management",
      },
      {
        title: "Product Descriptions",
        description:
          "Persuasive, search-friendly product copy for your website and catalogues.",
        icon: FileText,
      },
      {
        title: "Customer Communication",
        description:
          "Responsive handling of inbound messages, inquiries and support across platforms.",
        icon: MessagesSquare,
      },
    ],
  },
  {
    id: "growth",
    name: "Growth & Sales",
    tagline: "Fill the pipeline, then help close it.",
    services: [
      {
        title: "International Lead Generation",
        description:
          "Reach decision-makers in new markets and open doors beyond your home turf.",
        icon: Globe2,
      },
      {
        title: "B2B Lead Generation",
        description:
          "Targeted prospecting and outreach that surfaces qualified business buyers.",
        icon: Network,
      },
      {
        title: "Sales Team Support",
        description:
          "We back your reps with research, materials and warm leads so they sell more.",
        icon: HeartHandshake,
      },
    ],
  },
  {
    id: "trade",
    name: "Market & Trade",
    tagline: "Expand with intelligence on the ground.",
    services: [
      {
        title: "Market Research",
        description:
          "Actionable insight on demand, competitors and pricing before you commit resources.",
        icon: LineChart,
      },
      {
        title: "Supplier Sourcing",
        description:
          "We find, vet and connect you with reliable suppliers that fit your specs and budget.",
        icon: PackageSearch,
      },
      {
        title: "Trade Show & Exhibition Support",
        description:
          "End-to-end help preparing for, attending and following up after key industry events.",
        icon: Presentation,
      },
      {
        title: "International Local Agent",
        description:
          "Your representative on the ground — bridging language, culture and logistics abroad.",
        icon: MapPin,
      },
    ],
  },
];

/** Flat list of service titles — handy for the contact form dropdown. */
export const serviceOptions: string[] = pillars.flatMap((p) =>
  p.services.map((s) => s.title),
);

export const totalServices = serviceOptions.length;
