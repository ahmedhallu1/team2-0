/**
 * Everything the GeoArabia proposal says about the business, and what it costs.
 *
 * Same house rule as the KUPHUB file: the facts about GeoArabia were read off
 * the public record on 27 September 2026 — a direct request to geoarabia.sa,
 * the public Facebook page, and a web search for the services they sell — and
 * the source is named next to each one. There are no invented followers,
 * rankings, projects or clients. Concept work (the AI answer, the WhatsApp
 * thread, the article list) is kept in its own shapes and is always labelled
 * as a concept on screen.
 *
 * Prices are ours, in Egyptian pounds, with one deliberate exception: the
 * social retainer is quoted in US dollars, as agreed. Totals therefore keep the
 * two currencies apart rather than converting at a rate that will be wrong by
 * the time anyone reads it.
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
  services: [
    "Topographic survey",
    "3D laser scanning",
    "Scan-to-BIM",
    "3D modelling",
  ],
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

/** The domain check, exactly as the server answered it. */
export const domainProbe = [
  {
    host: "geoarabia.sa",
    status: "Index of /",
    note: "An empty server folder. One entry, cgi-bin/, last changed 24 March 2026.",
    where: "The address the brief gives for the company.",
    bad: true,
  },
  {
    host: "geoarabia.com.sa",
    status: "No site",
    note: "Mail runs here — it is the address on the Facebook page — but nothing answers on the web.",
    where: "Info@geoarabia.com.sa, Facebook intro.",
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
    title: "Two names for one company",
    seen: "The website address is geoarabia.sa. The email address is @geoarabia.com.sa. Search engines and AI assistants both check that a business's details agree before they trust them.",
    opportunity: "One domain, one name, one phone number, everywhere. It costs nothing, and GEO depends on it.",
    source: "Facebook intro · DNS records",
  },
  {
    id: "brand",
    title: "The brand is already right",
    seen: "A clean navy mark, and a cover that is a relief map: contour lines and terrain, the actual language of the work.",
    opportunity: "Nothing to rebrand. We build the system out from what is already there — which is why this page is in their navy, not ours.",
    source: "Facebook profile and cover",
  },
];

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
    line: "The site launch — shown as what the firm does: a point cloud turning into a model.",
    because: "A launch is the one moment anyone pays attention to a new website. This one opens with the work itself, not an announcement.",
    outputs: ["Launch carousel: scan → point cloud → BIM", "6 LinkedIn posts", "“Send us your site plan” WhatsApp entry point", "Google Business Profile live"],
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
    body: "Digital audit, market study, the three main Riyadh competitors agreed with you, keyword map in both languages. Site design, social templates and the WhatsApp flows drafted.",
  },
  {
    month: "Nov",
    title: "Launch",
    body: "geoarabia.sa live with its first eight articles. Google Business Profile verified, WhatsApp bot answering. Launch and Cityscape campaigns.",
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

export type Currency = "EGP" | "USD";

export type Offer = {
  id: string;
  name: string;
  /** One-line promise, shown under the name. */
  line: string;
  price: number;
  currency: Currency;
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
    id: "site",
    name: "Website",
    line: "geoarabia.sa, built properly, in Arabic and English.",
    price: 45000,
    currency: "EGP",
    cadence: "once",
    includes: [
      "Home, About, Projects, Contact",
      "A page for each of the four services",
      "Blog ready for the SEO articles",
      "Schema, speed and Core Web Vitals done right",
      "WhatsApp button and enquiry form",
      "First year of hosting and SSL",
    ],
    recommended: true,
    required: true,
    group: "build",
  },
  {
    id: "wa-setup",
    name: "WhatsApp automation",
    line: "A bot that qualifies the enquiry before an engineer picks up.",
    price: 15000,
    currency: "EGP",
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
    currency: "EGP",
    cadence: "once",
    includes: ["12–16 pages, Arabic and English", "Services, equipment, process", "Built from the same system as the site"],
    recommended: false,
    group: "build",
  },
  {
    id: "seo",
    name: "SEO + GEO",
    line: "Found on Google, and cited by the AI assistants buyers now ask first.",
    price: 10000,
    currency: "EGP",
    cadence: "month",
    includes: [
      "4 written articles a month, Arabic and English",
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
    price: 500,
    currency: "USD",
    cadence: "month",
    includes: [
      "Monthly content plan",
      "12 designed posts a month — carousels, project visuals",
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
    currency: "EGP",
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
    currency: "EGP",
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
    currency: "EGP",
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
  "Prices valid until 27 October 2026.",
] as const;
