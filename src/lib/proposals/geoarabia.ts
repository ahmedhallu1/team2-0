/**
 * Everything the GeoArabia proposal says about the business, and what it costs.
 *
 * Same house rule as the KUPHUB file: the facts about GeoArabia were read off
 * the public record on 27 September 2026 — their own site and its robots.txt,
 * sitemap and canonical tags, DNS for their domains, the public Facebook page,
 * and a web search for the services they sell — and
 * the source is named next to each one. There are no invented followers,
 * rankings, projects or clients. Concept work (the AI answer, the WhatsApp
 * thread, the article list) is kept in its own shapes and is always labelled
 * as a concept on screen.
 *
 * Prices are ours, all in Egyptian pounds. The social retainer was briefed as
 * $500 and is quoted at 26,000 EGP (51.9 EGP to the dollar on 26 September
 * 2026, rounded up to a clean figure).
 */

/* ------------------------------------------------------------------ */
/*  The business                                                      */
/* ------------------------------------------------------------------ */

export const geoarabia = {
  name: "GeoArabia",
  discipline: "Geomatics — digital and technical solutions for the built environment",
  city: "Riyadh",
  district: "Ar Rayan",
  phone: "+966 55 650 9600",
  /** The four service lines, as their own site names them. */
  services: [
    "Geospatial surveying & mapping",
    "Scan to BIM",
    "Hydrology & water resources",
    "Drone (UAS) & ROV surveys",
  ],
  site: "geoarabia-ntvijbcu.manus.space",
  /** Who signs the purchase order. From the brief, not from their channels. */
  buyers: [
    { name: "Engineering consultancies", arabic: "المكاتب الاستشارية" },
    { name: "Contractors", arabic: "شركات المقاولات" },
    { name: "Real-estate developers", arabic: "التطوير العقاري" },
    { name: "Fit-out & execution firms", arabic: "شركات التنفيذ" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  What we see                                                       */
/* ------------------------------------------------------------------ */

/**
 * The domain check. The site is real and good; the problem is where it lives.
 * It is served from a temporary builder address, while every signal it gives a
 * search engine — canonical tag, hreflang, sitemap, robots.txt — names
 * geoarabia.com.sa as the real home, and that domain has no web server behind
 * it at all. A crawler is told to index an address that doesn't answer.
 */
export const domainProbe = [
  {
    host: "geoarabia-ntvijbcu.manus.space",
    status: "200",
    note: "The site itself — English and Arabic, services, portfolio, FAQ. Served from a temporary builder subdomain.",
    where: "The address the site actually loads from.",
    bad: false,
  },
  {
    host: "geoarabia.com.sa",
    status: "No answer",
    note: "Where the site's canonical tag, hreflang, sitemap and robots.txt all say the real site is. No web server is set up for it.",
    where: "Mail works here — Info@geoarabia.com.sa. The web doesn't.",
    bad: true,
  },
] as const;

/**
 * What a buyer sees today when they search for the service. Real results, in
 * the order the search returned them — we list the firms, we don't rank them.
 */
export const searchToday = {
  query: "3D laser scanning Riyadh",
  checked: "27 September 2026",
  results: [
    { title: "3D Laser Scanning Riyadh | LiDAR Survey KSA", host: "alwarqasurvey.com" },
    { title: "3D Laser Scanning in Saudi Arabia | Reality Capture", host: "eiwaasaudi.com" },
    { title: "3D Laser Scanning & Drone Services in Riyadh", host: "thefuture3d.com" },
    { title: "3D Laser Scanning Services in Saudi", host: "highlinksgroup.com" },
  ],
} as const;

export type Observation = {
  id: string;
  title: string;
  seen: string;
  opportunity: string;
  source: string;
};

export const observations: Observation[] = [
  {
    id: "facebook",
    title: "A page that was set up, then left",
    seen: "Two followers. The only activity is a profile-picture update on 14 November 2025, and the round crop cuts the wordmark to “Geo Arabi”.",
    opportunity: "The listing is already correct — category, district, phone. It needs a reason to follow it, and a logo that fits the circle.",
    source: "facebook.com/855277117671832",
  },
  {
    id: "entity",
    title: "Three addresses for one company",
    seen: "The site loads on manus.space, names geoarabia.com.sa as home, and geoarabia.sa shows an empty server folder. Search engines and AI assistants both check that a business's details agree before they trust it.",
    opportunity: "One domain, one name, one phone number, everywhere. It costs almost nothing, and GEO depends on it.",
    source: "Site source · DNS records · Facebook intro",
  },
  {
    id: "brand",
    title: "The site already makes the case",
    seen: "Four service lines, an equipment list, 3D models you can rotate, an instant quote calculator, an Arabic version and eight FAQ answers. The navy brand carries through all of it.",
    opportunity: "Nothing to rebuild. SEO and GEO build on top of it — those eight FAQ answers are the first thing AI assistants can quote.",
    source: "geoarabia-ntvijbcu.manus.space",
  },
];

/**
 * The three competitors GeoArabia named, with the positioning and social
 * direction from the client's own content-strategy deck (LinkedIn and the
 * official websites were the channels reviewed). Quoted, not graded.
 */
export const competitors = [
  {
    name: "FalconViz",
    host: "falconviz.com",
    focus: "Drone surveying, 3D mapping, LiDAR, photogrammetry, construction monitoring.",
    social: "Strong visual use of drone, 3D and LiDAR, shown in project applications.",
  },
  {
    name: "Terra Drone Arabia",
    host: "terra-drone.com.sa",
    focus: "Drone and geospatial solutions — surveying, LiDAR, GIS, 3D modelling, inspection.",
    social: "Broad geospatial and drone positioning, frequent technical topics, case-led content.",
  },
  {
    name: "GeoReference",
    host: "geo.sa",
    focus: "Land surveying, GIS, engineering surveys, mapping, aerial photography, 3D modelling.",
    social: "Reviewed on LinkedIn and the official website.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  The content — from the agreed content-strategy deck               */
/* ------------------------------------------------------------------ */

/** The one line everything else hangs off. */
export const positioning =
  "A professional geospatial partner for surveying, mapping and data-driven project work.";

export const strategy = [
  {
    label: "Approach",
    body: "Service-led posts, education, technical subjects and project-focused communication, in a steady mix.",
  },
  {
    label: "Focus",
    body: "Infrastructure, construction, engineering, urban development and real estate — the sectors that buy.",
  },
  {
    label: "Conversion",
    body: "Clear service presentation, strong project visuals and a direct way to get in touch on every post.",
  },
] as const;

export const contentPillars = [
  { name: "Brand", body: "Who GeoArabia is — capabilities, expertise, positioning." },
  { name: "Education", body: "Geospatial concepts, surveying technology and practical use cases." },
  { name: "Services", body: "Each core service and exactly what it delivers." },
  { name: "Project value", body: "How accurate spatial data supports construction, infrastructure and development." },
  { name: "Conversion", body: "Selected services, project needs and direct, contact-led posts." },
] as const;

/** The first ten posts, in order, with the direction each one takes. */
export const firstTen = [
  { title: "What is GeoArabia?", pillar: "Brand", direction: "Brand introduction, services, capabilities" },
  { title: "Aerial surveying", pillar: "Education · Services", direction: "From aerial capture to accurate project data" },
  { title: "Topographic survey", pillar: "Services", direction: "Terrain, elevation and site information before execution" },
  { title: "From reality to data", pillar: "Education", direction: "How field information becomes usable geospatial data" },
  { title: "GIS", pillar: "Services", direction: "Connecting location, data and analysis" },
  { title: "Construction progress monitoring", pillar: "Project value", direction: "Visual project tracking and site documentation" },
  { title: "3D modelling", pillar: "Services", direction: "Turning real-world sites into digital 3D models" },
  { title: "Drone mapping", pillar: "Education · Services", direction: "Aerial imagery converted into mapping outputs" },
  { title: "Infrastructure & urban planning", pillar: "Project value", direction: "Spatial data supporting development decisions" },
  { title: "Your project. Your data. Better decisions.", pillar: "Conversion", direction: "A direct, service-led closing post" },
] as const;

export const creativeDirection = [
  {
    label: "Visual language",
    body: "Technical, clean and spatial: aerial imagery, project photography, maps, coordinates, topographic lines and 3D outputs.",
  },
  {
    label: "Design",
    body: "Strong typography, generous spacing, and one GeoArabia system across Instagram, Facebook and LinkedIn.",
  },
  {
    label: "Treatment",
    body: "Lead with the visual or the question. Short copy — the project, service or data output carries the post.",
  },
] as const;

/** What we need from GeoArabia before the first post goes out. */
export const requiredAssets = [
  "Project photos",
  "Aerial footage",
  "Existing reels and video",
  "Raw footage",
  "3D and GIS outputs",
  "Project details",
] as const;

/* ------------------------------------------------------------------ */
/*  The plan — concept work                                           */
/* ------------------------------------------------------------------ */

/** A month of articles, written the way people actually ask. */
export const sampleArticles = [
  {
    ar: "كم تكلفة المسح الطبوغرافي في الرياض؟",
    en: "What does a topographic survey in Riyadh cost?",
  },
  {
    ar: "ما هو Scan to BIM ومتى يحتاجه مشروعك؟",
    en: "What is Scan-to-BIM, and when does a project need it?",
  },
  {
    ar: "المسح بالليزر ثلاثي الأبعاد أم المسح التقليدي؟",
    en: "3D laser scanning or a conventional survey — which one?",
  },
  {
    ar: "ما المستندات المطلوبة قبل الرفع المساحي؟",
    en: "What documents do you need before a site survey?",
  },
] as const;

/** The WhatsApp flow, as a buyer would see it. Arabic, because they would. */
export const whatsappThread = [
  { from: "bot", text: "أهلاً بك في GeoArabia. أي خدمة تحتاج؟" },
  { from: "bot", text: "١ مسح طبوغرافي · ٢ مسح بالليزر · ٣ Scan to BIM · ٤ نمذجة ثلاثية الأبعاد", menu: true },
  { from: "user", text: "٣" },
  { from: "bot", text: "ممتاز. وين موقع المشروع، وكم المساحة تقريباً؟" },
  { from: "user", text: "الرياض، حي الملقا — مبنى إداري ٤ أدوار" },
  { from: "bot", text: "تقدر ترسل المخططات هنا إذا متوفرة." },
  { from: "user", text: "مخطط-الموقع.pdf", file: true },
  { from: "bot", text: "وصلت. المهندس المختص بيتواصل معك اليوم." },
] as const;

/* ------------------------------------------------------------------ */
/*  Campaigns                                                         */
/* ------------------------------------------------------------------ */

export type Campaign = {
  id: string;
  name: string;
  when: string;
  duration: string;
  line: string;
  because: string;
  outputs: string[];
};

export const campaigns: Campaign[] = [
  {
    id: "ask",
    name: "Ask the surveyor",
    when: "Always on",
    duration: "6 months",
    line: "Every question a client asks becomes an article, a LinkedIn post and an answer the WhatsApp bot gives.",
    because: "One answer, written once, in three places. It is the spine of the SEO and the GEO: AI assistants quote pages that answer a question plainly, and so do buyers.",
    outputs: ["4 articles a month, AR + EN", "4 LinkedIn posts from them", "Answers loaded into the WhatsApp bot", "An FAQ that grows every month"],
  },
  {
    id: "launch",
    name: "Measured before it's built",
    when: "November 2026",
    duration: "4 weeks",
    line: "The first month of content, built from the work itself: a point cloud turning into a model.",
    because: "The site finally lives at its own address, and the channels need a reason to follow them. The opening series shows the work instead of announcing it.",
    outputs: ["Carousel series: scan → point cloud → BIM", "6 LinkedIn posts", "“Send us your site plan” WhatsApp entry point", "Google Business Profile live"],
  },
  {
    id: "cityscape",
    name: "Cityscape week",
    when: "16–19 November 2026",
    duration: "2 weeks",
    line: "Cityscape Global is in Riyadh, and every developer in the Kingdom is paying attention that week.",
    because: "GeoArabia doesn't need a stand to be part of the conversation. Developers are the buyer, and that week they are all looking at the same feed.",
    outputs: ["3-post LinkedIn series on Riyadh's pipeline", "Optional LinkedIn ads to developers", "A “book a site scan” page", "Post-show recap"],
  },
  {
    id: "founding",
    name: "Founding Day",
    when: "22 February 2027",
    duration: "1 week",
    line: "The land, measured. A day about the land, made by a firm that measures it.",
    because: "National Day has just passed, so Founding Day is the next national moment, and it falls in month five. It is the natural brand post for a geomatics firm, and a contour map is already in the brand.",
    outputs: ["Bilingual hero visual", "Profile and cover refresh on every channel", "A LinkedIn article", "Ramadan-aware schedule after it"],
  },
];

/* ------------------------------------------------------------------ */
/*  Timeline                                                          */
/* ------------------------------------------------------------------ */

export const timeline = [
  {
    month: "Oct",
    title: "Discover & build",
    body: "The site connected to geoarabia.com.sa and the other domains redirected to it. Technical audit, market study, FalconViz, Terra Drone Arabia and GeoReference put under watch, keyword map in both languages. Social templates and WhatsApp flows drafted.",
  },
  {
    month: "Nov",
    title: "Go live",
    body: "The first eight articles published. Google Business Profile verified, WhatsApp bot answering. The opening content series and the Cityscape campaign.",
  },
  {
    month: "Dec",
    title: "Get listed",
    body: "Technical fixes from the first crawl, Saudi directory listings, the first AI-answer check across twenty buyer questions.",
  },
  {
    month: "Jan",
    title: "Show the work",
    body: "Case pages from your own projects — photos, scans, models. Ads tested on LinkedIn if media buying is on.",
  },
  {
    month: "Feb",
    title: "Founding Day",
    body: "The Founding Day campaign, then a schedule that respects Ramadan.",
  },
  {
    month: "Mar",
    title: "Review",
    body: "Six-month report: rankings, AI citations and leads by source. Then the plan for the next six.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Investment                                                        */
/* ------------------------------------------------------------------ */

export type Offer = {
  id: string;
  name: string;
  /** One-line promise, shown under the name. */
  line: string;
  price: number;
  cadence: "once" | "month" | "percent";
  /** Shown on the tile instead of a computed price, when there is one. */
  priceNote?: string;
  includes: string[];
  /** On in the recommended starting set. */
  recommended: boolean;
  /** Pinned — the proposal doesn't make sense without it. */
  required?: boolean;
  group: "build" | "run" | "add";
};

export const offers: Offer[] = [
  {
    id: "wa-setup",
    name: "WhatsApp automation",
    line: "A bot that qualifies the enquiry before an engineer picks up.",
    price: 15000,
    cadence: "once",
    includes: [
      "WhatsApp Business API number",
      "Bilingual service menu",
      "Asks project type, location and size",
      "Takes site plans and photos",
      "Out-of-hours replies, handover to a person",
      "Every lead logged to a sheet or CRM",
    ],
    recommended: true,
    group: "build",
  },
  {
    id: "profile",
    name: "Company profile",
    line: "The PDF that goes into every tender and every first email.",
    price: 12000,
    cadence: "once",
    includes: ["12–16 pages, Arabic and English", "Services, equipment, process", "Matches the site and the social system"],
    recommended: false,
    group: "build",
  },
  {
    id: "seo",
    name: "SEO + GEO",
    line: "Found on Google, and cited by the AI assistants buyers now ask first.",
    price: 10000,
    cadence: "month",
    includes: [
      "Site connected to geoarabia.com.sa; canonical, sitemap and hreflang put right",
      "4 written articles a month, Arabic and English, on your site",
      "Keyword map for Riyadh, in both languages",
      "On-page and technical SEO",
      "Google Business Profile, kept active",
      "Schema and FAQ markup for AI answers",
      "Saudi directory listings, one consistent name",
      "Monthly check of 20 buyer questions in ChatGPT, Gemini, Perplexity and AI Overviews",
      "Monthly report",
    ],
    recommended: true,
    required: true,
    group: "run",
  },
  {
    id: "social",
    name: "Social media",
    line: "LinkedIn, Facebook and Instagram, planned a month ahead.",
    price: 26000,
    cadence: "month",
    includes: [
      "Monthly content plan across the five pillars",
      "12 designed posts a month — the first ten already mapped",
      "LinkedIn company page set up in Arabic and English",
      "Replies to comments and messages on working days",
      "Monthly report",
    ],
    recommended: true,
    group: "run",
  },
  {
    id: "wa-care",
    name: "WhatsApp care",
    line: "Flows updated as the services and questions change.",
    price: 2500,
    cadence: "month",
    includes: ["New answers from the articles", "Monthly lead summary", "Meta's conversation fees billed at cost"],
    recommended: true,
    group: "run",
  },
  {
    id: "reels",
    name: "Reels",
    line: "Four short edits a month from your own site footage.",
    price: 6000,
    cadence: "month",
    includes: ["Scanner on site, point cloud, finished model", "Captions in Arabic and English", "Cut for Reels, LinkedIn and Stories"],
    recommended: false,
    group: "add",
  },
  {
    id: "ads",
    name: "Media buying",
    line: "LinkedIn, Meta and Google Search, aimed at the four buyer types.",
    price: 5000,
    cadence: "percent",
    priceNote: "15% of ad spend · min 5,000 EGP / month",
    includes: ["Audience build by job title and industry", "Campaign setup and weekly optimisation", "Ad spend paid to the platforms directly"],
    recommended: false,
    group: "add",
  },
];

/** Off the monthly retainers when GeoArabia commits to the full six months. */
export const commitmentDiscount = 0.1;

export const terms = [
  "One-off work: 50% to start, 50% at launch.",
  "Monthly retainers are billed in advance. Three-month minimum.",
  "Ad spend, Meta's WhatsApp fees and domain renewals are paid at cost, never marked up.",
  "All prices in Egyptian pounds, valid until 27 October 2026.",
] as const;
