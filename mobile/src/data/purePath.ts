import type { ImageSourcePropType } from "react-native";

import aboutKaaba from "../../assets/about-kaaba.png";
import purePathHero from "../../assets/pure-path-hero.png";
import whyChooseUs from "../../assets/why-choose-us.png";
import type { RouteName } from "../types";

export type ImageKey = "hero" | "about" | "why";

export const images: Record<ImageKey, ImageSourcePropType> = {
  hero: purePathHero,
  about: aboutKaaba,
  why: whyChooseUs,
};

export const navItems: { label: string; route: RouteName }[] = [
  { label: "Home", route: "home" },
  { label: "About Us", route: "about" },
  { label: "Packages", route: "packages" },
  { label: "Journey", route: "journey" },
  { label: "Services", route: "services" },
  { label: "Documents", route: "documents" },
  { label: "Chat", route: "chat" },
];

export type MarkedContentItem = {
  title: string;
  description: string;
  marker: string;
  items: string[];
  detailsRoute?: RouteName;
};

export type ProcessStepItem = {
  title: string;
  description: string;
  marker: string;
  detailsRoute?: RouteName;
};

export const partners = [
  { name: "Noor Routes", color: "#bda7ff" },
  { name: "Haram Stay", color: "#23457a" },
  { name: "Safwa Care", color: "#e63746" },
  { name: "Mina Direct", color: "#f47a1f" },
  { name: "Qamar Group", color: "#d82732" },
];

export const benefits = [
  {
    title: "Licensed & Reliable",
    description:
      "Travel confidently with a licensed, transparent, and compliant Hajj & Umrah provider.",
    marker: "LR",
  },
  {
    title: "Comfortable Accommodations",
    description:
      "Stay with trusted hotel partners near the holy mosques for easy access and comfort.",
    marker: "CA",
  },
  {
    title: "Experts Tour Guidance",
    description:
      "Experienced mutawwif and tour leaders guide your journey with spiritual briefings.",
    marker: "TG",
  },
  {
    title: "Hassle-Free Travel",
    description:
      "Complete support for visas, transport, documentation, and logistics.",
    marker: "HT",
  },
];

export const landingPackageCards: MarkedContentItem[] = [
  {
    title: "Umrah Packages",
    description: "Comfortable and guided Umrah journeys for all travelers.",
    marker: "UP",
    items: [
      "9-12 days",
      "Hotels in Makkah & Madinah",
      "Full transportation",
      "Guided ziyarah tours",
    ],
  },
  {
    title: "Hajj Programs",
    description: "Structured and compliant Hajj programs with full support.",
    marker: "HP",
    items: [
      "20-30 days",
      "Tent ordering (Mina-Arafah)",
      "Experienced mutawwif",
      "Full movement management",
    ],
  },
  {
    title: "Documentation",
    description: "Fast and complete support for visa and document processing.",
    marker: "VD",
    detailsRoute: "documents",
    items: [
      "2-5 days",
      "Fast visa processing",
      "Document verification",
      "Family & senior assistance",
    ],
  },
];

export const services: MarkedContentItem[] = [
  ...landingPackageCards,
  {
    title: "Travel Insurance",
    description:
      "Comprehensive protection ensuring safety throughout the pilgrimage journey.",
    marker: "TI",
    items: [
      "Medical coverage",
      "Emergency support",
      "Travel protection",
      "Peace assistance",
    ],
  },
  {
    title: "Airport Assistance",
    description: "Dedicated support services for smooth arrival and departure.",
    marker: "AA",
    items: [
      "Arrival guidance",
      "Luggage handling service",
      "Immigration support",
      "Safety compliance",
    ],
  },
  {
    title: "Pilgrim Guidance",
    description:
      "Spiritual and practical guidance provided throughout the entire journey.",
    marker: "PG",
    items: [
      "Ritual education",
      "Daily briefings",
      "Group coordination",
      "Spiritual mentoring",
    ],
  },
];

export const servicesChecklist = [
  "Visa documentation",
  "Hotel coordination",
  "Ziyarah planning",
  "Group guidance",
];

export const features = [
  "Transparent pricing",
  "Vetted accommodation",
  "Flexible departures",
  "Local support team",
];

export const processSteps: ProcessStepItem[] = [
  {
    title: "Confirm Your Package",
    description:
      "Choose the right Umrah or Hajj package with clear pricing and guidance.",
    marker: "01",
  },
  {
    title: "Complete Your Documents",
    description:
      "We help you complete all requirements for visas, records, and travel approvals.",
    marker: "02",
    detailsRoute: "documents",
  },
  {
    title: "Begin Your Journey",
    description:
      "Travel with your group and enjoy full support, guidance, and comfortable arrangements from start to finish.",
    marker: "03",
  },
];

export const documentGroups = [
  {
    title: "Umrah Documents",
    items: [
      "Valid passport with at least 6 months validity",
      "Passport-sized photographs with white background",
      "Umrah visa or eVisa approval",
      "CNIC / National ID copy",
      "Confirmed return flight tickets",
      "Hotel booking confirmation",
      "Vaccination certificates if required",
      "Marriage or birth certificate if traveling with family",
    ],
  },
  {
    title: "Hajj Documents",
    items: [
      "Valid passport with at least 6 months validity",
      "Hajj visa approval",
      "Recent passport-sized photographs",
      "CNIC / National ID copy",
      "Completed Hajj application form",
      "Vaccination certificates",
      "Confirmed travel itinerary",
      "Accommodation and package confirmation",
      "Proof of payment",
    ],
  },
];

export const values = [
  {
    title: "Spiritual Integrity",
    description:
      "Upholding sincere worship guidance through authentic Islamic teachings.",
    marker: "SI",
  },
  {
    title: "Trusted Services",
    description:
      "Providing reliable pilgrimage support with honesty and transparency.",
    marker: "TS",
  },
  {
    title: "Compassionate Care",
    description:
      "Supporting pilgrims with empathy, patience, and understanding.",
    marker: "CC",
  },
  {
    title: "Guided Knowledge",
    description: "Delivering clear religious guidance from qualified scholars.",
    marker: "GK",
  },
];

export const team = [
  {
    name: "Abdul Razak",
    role: "Pure Path Founder",
  },
  {
    name: "Ahmad Faris",
    role: "Program Manager",
  },
  {
    name: "Fahim Zain",
    role: "Travel Coordinator",
  },
  {
    name: "Salman Firdaus",
    role: "Customer Support",
  },
];

export type PackageItem = {
  slug: string;
  dates: string;
  title: string;
  description: string;
  badges: string[];
  highlights: string[];
  price: string;
  image: ImageSourcePropType;
};

export const pilgrimagePackages: PackageItem[] = [
  {
    slug: "umrah-basic",
    dates: "12 Jan 2026 - 24 Jan 2026",
    title: "Umrah Basic Package",
    description:
      "Ideal for first-time pilgrims seeking guided worship with reliable accommodations and smooth travel arrangements.",
    badges: ["Guided Support", "Inclusive Comfort", "Shared Transport"],
    highlights: [
      "Subh Noor Hotel (5-star)",
      "Medina Zaman Cuisine",
      "Sightseeing & Economy Class",
    ],
    price: "$1,300",
    image: images.why,
  },
  {
    slug: "umrah-plus",
    dates: "22 Jan 2026 - 31 Jan 2026",
    title: "Umrah Plus Package",
    description:
      "Perfect for pilgrims wanting balanced comfort, closer accommodation, and organized spiritual guidance.",
    badges: ["Comfort Hotels", "Guided Support", "Direct Flight"],
    highlights: [
      "Manarah Grand Suite (5-star)",
      "International Halal Menu",
      "Jeddah to Economy Class",
    ],
    price: "$1,500",
    image: images.hero,
  },
  {
    slug: "umrah-premium",
    dates: "08 Feb 2026 - 19 Feb 2026",
    title: "Umrah Premium Package",
    description:
      "Designed for those seeking enhanced privacy, premium lodging, and personalized pilgrimage assistance.",
    badges: ["Executive Comfort", "Private Team", "Personalized Service"],
    highlights: [
      "Royal Clock Towers (5-star)",
      "Premium Asian Dining",
      "Private transfers on arrival",
    ],
    price: "$1,800",
    image: images.about,
  },
  {
    slug: "hajj-standard",
    dates: "25 May 2026 - 15 Jun 2026",
    title: "Hajj Standard Package",
    description:
      "A well-structured package offering comfortable Hajj guidance with dependable facilities and group coordination.",
    badges: ["Group Coordinator", "Ritual Guidance", "Essential Facilities"],
    highlights: [
      "Zamzam View Suites (5-star)",
      "Traditional Meal Menu",
      "Jeddah to Economy Class",
    ],
    price: "$8,000",
    image: images.about,
  },
  {
    slug: "hajj-comfort",
    dates: "22 May 2026 - 14 Jun 2026",
    title: "Hajj Comfort Package",
    description:
      "Prioritise upgraded accommodations and smoother logistics for a more relaxed and focused Hajj experience.",
    badges: ["Improved Facilities", "Smooth Logistics", "Guided Experience"],
    highlights: [
      "Al Noor Elite Residency (5-star)",
      "Balance Asian Cuisine",
      "Jeddah to Economy Class",
    ],
    price: "$9,500",
    image: images.hero,
  },
  {
    slug: "hajj-executive",
    dates: "01 Jun 2026 - 24 Jun 2026",
    title: "Hajj Executive Package",
    description:
      "Crafted for pilgrims needing exclusive services, premium facilities, and personalized spiritual assistance.",
    badges: ["Private Assistance", "VIP Experience", "Premium Facilities"],
    highlights: [
      "Royal Clock Towers (5-star)",
      "Premium Meal Dining",
      "Personalized hajj service desk",
    ],
    price: "$11,600",
    image: images.why,
  },
];

export const sacredOffers = [
  {
    title: "Early Umrah Saver",
    discount: "Up To 25% Off",
    description:
      "Book early and enjoy reduced pricing with complete pilgrimage services included.",
    image: images.hero,
  },
  {
    title: "Family Booking Deal",
    discount: "Up To 40% Off",
    description:
      "Reserve family travel together with arranged stays, transfers, and guided support.",
    image: images.why,
  },
];
