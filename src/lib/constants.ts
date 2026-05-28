import type { LandingIconName } from "@/lib/icon-names";

export const SITE_URL = "https://book.klarify.africa";

export const SITE_LOGO = "/images/fgb.png";
export const SITE_LOGO_ALT = "Founder's Guide Book Launch";

export const KLARIFY_LOGO_URL = `${SITE_URL}/images/logo_white.png`;

export const BOOK_PRODUCT_SLUGS = {
  foundersGuide: "founders-guide",
  seizingOpportunities: "seizing-opportunities",
} as const;

export const BOOK_PURCHASE = {
  korapay: {
    label: "Pay with Korapay",
    description: "NGN · PDF + full download pack",
    currency: "NGN",
    checkoutPath: (slug: string) => `/checkout/${slug}`,
  },
  nigeria: {
    url: "https://selar.com/g5525p7n52",
    label: "Buy on Selar",
    description: "Pay in Naira via Selar",
    currency: "NGN",
  },
  international: {
    url: "https://chuta.gumroad.com/l/lghqcj",
    label: "Buy on Gumroad",
    description: "USD & global cards via Gumroad",
    currency: "USD",
  },
} as const;

/** @deprecated Use BOOK_PURCHASE.international.url */
export const BOOK_PURCHASE_URL = BOOK_PURCHASE.international.url;

export const SITE_NAME = "The Founder's Guide to Building in Regulated Markets";

export const HERO_HEADLINES = [
  "Building in Regulated Markets Starts Here, Nigeria first...",
  "Regulatory Readiness Intelligence-OS for Africa's Next Builders.",
  "Trust-Ready Innovation Starts with the Right Framework.",
];

export const PAIN_POINTS: {
  icon: LandingIconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "envelope",
    title: "Unexpected Regulator Letters",
    description: "Surprise inquiries that halt product launches overnight.",
  },
  {
    icon: "building-library",
    title: "Banking Relationship Loss",
    description: "De-risking decisions that cut off essential financial rails.",
  },
  {
    icon: "clipboard-document",
    title: "Licensing Confusion",
    description: "Unclear pathways between innovation and authorization.",
  },
  {
    icon: "arrows-right-left",
    title: "Multi-Regulator Complexity",
    description: "Navigating overlapping mandates across jurisdictions.",
  },
  {
    icon: "eye-slash",
    title: "Compliance Blindspots",
    description: "Gaps that only surface during due diligence or audits.",
  },
  {
    icon: "globe-alt",
    title: "Expansion Uncertainty",
    description: "Cross-border growth without regulatory clarity.",
  },
  {
    icon: "magnifying-glass",
    title: "AML/CFT Confusion",
    description: "Anti-money laundering requirements that evolve faster than teams.",
  },
  {
    icon: "user-group",
    title: "Institutional Trust Issues",
    description: "Partners and investors requiring proof of regulatory readiness.",
  },
];

export const BOOK_TOPICS = [
  { title: "ISA 2025", description: "Investment and Securities Act framework navigation" },
  { title: "ARIP", description: "Accelerated Regulatory Innovation Program pathways" },
  { title: "AML/CFT", description: "Anti-money laundering and counter-terrorism compliance" },
  { title: "Product Classification", description: "Determining regulatory treatment of digital products" },
  { title: "Stablecoins", description: "Building and operating in the stablecoin regulatory landscape" },
  { title: "Tokenization", description: "Real-world asset tokenization compliance strategies" },
  { title: "Regulatory Readiness", description: "Building institution-ready compliance foundations" },
  { title: "Trust Infrastructure", description: "Systems that earn regulator and partner confidence" },
  { title: "Cross-Border Expansion", description: "Multi-jurisdiction regulatory strategy" },
  { title: "Institutional Navigation", description: "Engaging banks, regulators, and policy stakeholders" },
];

export const PERSONAS: {
  icon: LandingIconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "rocket-launch",
    title: "Founders",
    description: "Building blockchain, fintech, and digital asset products in regulated environments.",
  },
  {
    icon: "scale",
    title: "Compliance Teams",
    description: "Translating regulatory requirements into operational frameworks.",
  },
  {
    icon: "briefcase",
    title: "Investors",
    description: "Evaluating regulatory risk and institutional readiness in portfolio companies.",
  },
  {
    icon: "building-office-2",
    title: "Regulators",
    description: "Understanding innovation patterns and industry compliance approaches.",
  },
  {
    icon: "building-office",
    title: "Banks",
    description: "Assessing fintech and digital asset partner risk profiles.",
  },
  {
    icon: "document-text",
    title: "Law Firms",
    description: "Advising clients on regulatory strategy and licensing pathways.",
  },
  {
    icon: "light-bulb",
    title: "Innovation Teams",
    description: "Corporate teams exploring regulated digital product launches.",
  },
  {
    icon: "chart-bar",
    title: "Fintech Operators",
    description: "Scaling payment, lending, and digital asset operations compliantly.",
  },
];

export const KLARIFY_FEATURES: {
  icon: LandingIconName;
  title: string;
  description: string;
  metric: string;
}[] = [
  {
    icon: "signal",
    title: "Readiness Score",
    description: "Quantified regulatory readiness across your product and operations.",
    metric: "87/100",
  },
  {
    icon: "tag",
    title: "Product Classification",
    description: "Automated regulatory treatment analysis for digital products.",
    metric: "VASP",
  },
  {
    icon: "map",
    title: "Regulator Mapping",
    description: "Identify relevant regulators and their mandates for your product.",
    metric: "4 bodies",
  },
  {
    icon: "list-bullet",
    title: "Compliance Roadmaps",
    description: "Step-by-step pathways from current state to full authorization.",
    metric: "12 steps",
  },
  {
    icon: "bolt",
    title: "Regulatory Intelligence",
    description: "Real-time updates on policy changes affecting your sector.",
    metric: "Live",
  },
  {
    icon: "shield-check",
    title: "Trust Infrastructure",
    description: "Documentation and evidence systems for institutional partners.",
    metric: "Active",
  },
  {
    icon: "chat-bubble-left-right",
    title: "Regulator Engagement",
    description: "Structured intelligence for productive regulator interactions.",
    metric: "Ready",
  },
  {
    icon: "users",
    title: "Vetted Specialist Network",
    description:
      "When a question needs a qualified human,Untitled a vetted regulatory specialist.",
    metric: "Vetted",
  },
];

export const FOREWORD_AUTHORS = [
  {
    name: "Musa Itopa Jimoh",
    role: "Foreword",
    credential: "Director of Payments System Management, Central Bank of Nigeria",
  },
  {
    name: "Dr. Timi Agama",
    role: "Preface",
    credential: "Director General, Securities and Exchange Commission Nigeria",
  },
];

export const AUTHOR = {
  name: "Chimezie Chuta",
  title: "Author & Founder",
  bio: [
    "Chimezie Chuta is a blockchain strategist, digital asset policy architect, and technology entrepreneur with nearly two decades of experience at the intersection of emerging technology, financial regulation, and African market development. He is the founder of the Blockchain Nigeria User Group (BNUG), which he built from inception in 2016 into Nigeria's foremost Web3 community and professional network, with over 25,000 members and a decade of convening the national conversation on blockchain and digital assets. He organised Nigeria's first National Blockchain and Cryptocurrency Conference in 2017 and has since trained more than a thousand practitioners through conferences, bootcamps, hackathons, and masterclasses across the country.",
    "In his policy work, Chimezie serves as Chairman of the Federal Government of Nigeria's National Blockchain Policy Implementation Steering Committee under NITDA, and as a member of the SEC Nigeria Blockchain and Virtual Asset Working Group — making him one of the very few practitioners who has both shaped the regulatory frameworks governing digital assets in Nigeria and built the products those frameworks govern. He has participated in working groups across CBN, NAICOM, NDIC, NCC, and CIBN, and his advisory work has spanned institutional clients including MTN, Stanbic IBTC, and United Capital Group.",
    "His market career includes senior roles as Africa Regional Director at Paxful, where he led pan-African operations during Nigeria's emergence as one of the world's largest peer-to-peer Bitcoin markets, and as West Africa Advisor at Kinesis.money. He worked as a Venture Partner at Adaverse VC, supporting Web3 founders across Nigeria, Kenya, Ghana, and Uganda. He is the CEO of Blockspace Technologies and the creator of Klarify (klarify.africa), Africa's first Compliance & Regulatory Readiness Intelligence Platform, for digital asset and fintech founders. The Founder's Guide to Building in Regulated Markets, is his most recent work. Other books are Seizing Opportunities in the Digital Asset Economy, his second edition and most comprehensive work to date, following The DeFi Handbook and other titles.",
  ],
  credentials: [
    "Chairman, National Blockchain Policy Implementation Steering Committee",
    "Founder, Blockchain Nigeria User Group (BNUG)",
    "CEO, Blockspace Technologies & Creator, Klarify",
    "Venture Partner, Adaverse VC",
  ],
  books: [
    {
      title: "The Founder's Guide to Building in Regulated Markets",
      readOnlinePath: "/founders/",
      productSlug: BOOK_PRODUCT_SLUGS.foundersGuide,
    },
    {
      title: "Seizing Opportunities in the Digital Asset Economy",
      readOnlinePath: "/opportunities/",
      productSlug: BOOK_PRODUCT_SLUGS.seizingOpportunities,
    },
  ],
};

export const LAUNCH_EVENT = {
  title: "Virtual Launch: The Founder's Guide to Building in Regulated Markets",
  date: "Friday, June 12, 2026",
  time: "4:00 PM WAT",
  venue: "Virtual Event",
  /** ISO 8601 — 4:00 PM WAT (UTC+1) */
  datetimeIso: "2026-06-12T15:00:00.000Z",
  themes: [
    "Regulatory readiness for African fintech and blockchain founders",
    "Navigating ISA 2025 and ARIP frameworks",
    "From compliance anxiety to institutional trust",
    "Building the trust infrastructure Africa needs",
  ],
};

export const TESTIMONIALS = [
  {
    quote: "Every founder building in Africa's regulated markets needs this framework. It bridges the gap between innovation and institutional credibility.",
    author: "Policy Leader",
    role: "Regulatory Affairs",
  },
  {
    quote: "Finally, a practical guide that treats compliance as strategic infrastructure—not a checkbox. Essential reading for fintech operators.",
    author: "Fintech Founder",
    role: "CEO, Digital Payments Startup",
  },
  {
    quote: "This book articulates what we've been trying to tell the ecosystem: regulatory intelligence is a competitive advantage, not a burden.",
    author: "Industry Executive",
    role: "Blockchain Association",
  },
];

export const COUNTRIES = [
  "Nigeria",
  "Kenya",
  "South Africa",
  "Ghana",
  "Egypt",
  "Rwanda",
  "Mauritius",
  "Other African Country",
  "Outside Africa",
];

export const ROLES = [
  "Founder / CEO",
  "Compliance Officer",
  "Legal Counsel",
  "Investor",
  "Regulator / Policy",
  "Bank / Financial Institution",
  "Consultant / Advisor",
  "Other",
];

export type RegistrationType = "launch" | "klarify" | "book-updates";

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;
