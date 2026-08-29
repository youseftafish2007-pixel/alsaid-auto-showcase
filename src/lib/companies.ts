export type Motif =
  "pickup" | "solar" | "carrier" | "plane" | "showroom" | "lights" | "impact" | "fleet";

export type Company = {
  slug: string;
  name: string;
  sector: string;
  established?: string;
  tagline: string;
  location: string;
  facts: { label: string; value: string }[];
  paragraphs: string[];
  /** Hex accent color for the company's own identity. */
  accent: string;
  /** Soft background tint used in company pages. */
  accentSoft: string;
  /** Imported logo asset URL. */
  logo?: string;
  /** Editorial hero photograph. */
  hero?: string;
  /** Animated motif shown on the company page. */
  motif: Motif;
  /** Short monogram used when no logo is available. */
  monogram: string;
};

import alsaidAutoLogo from "@/assets/alsaid-auto.png";
import gacLogo from "@/assets/gac-motor.png";
import greenviroLogo from "@/assets/greenviro.png";
import riverLogo from "@/assets/river-auto.png";
import speedLogo from "@/assets/speed-travel.png";
import gmaLogo from "@/assets/gma-everett.png";
import zainLogo from "@/assets/zain-farm.png";
import foundationLogo from "@/assets/alsaid-foundation.png";

import heroAlsaidAuto from "@/assets/hero-alsaid-automotive.jpg";
import heroGac from "@/assets/hero-gac-motor.jpg";
import heroGreenviro from "@/assets/hero-greenviro.jpg";
import heroRiver from "@/assets/hero-river-auto.jpg";
import heroSpeed from "@/assets/hero-speed-travel.jpg";
import heroGma from "@/assets/hero-gma-everett.jpg";
import heroZain from "@/assets/hero-zain-farm.jpg";

export const companies: Company[] = [
  {
    slug: "alsaid-automotive",
    name: "Alsaid Automotive",
    sector: "Automotive · Mobility",
    established: "1999",
    location: "Amman · Six markets",
    tagline:
      "The founding pillar of the Group. Sourcing, distribution, and supply of vehicles across six international markets, built over twenty-six years of regional industry presence.",
    facts: [
      { label: "Founded", value: "1999" },
      { label: "Headquarters", value: "Amman" },
      { label: "Markets", value: "Six" },
      { label: "Sector", value: "Mobility" },
      { label: "Model", value: "Sourcing & supply" },
    ],
    paragraphs: [
      "Founded in Amman in 1999, Alsaid Automotive represents the founding pillar of the Group and remains at the centre of its long-standing presence within the international automotive industry. Established through a vision centred on accessibility and regional mobility, the company developed into a recognised platform with reach across multiple international markets.",
      "The company has built its reputation through the sourcing, distribution, and supply of vehicles from international markets, serving both individual consumers and commercial sectors with a focus on reliability, operational continuity, and market adaptability.",
    ],
    accent: "#A6192E",
    accentSoft: "#FDECEE",
    logo: alsaidAutoLogo,
    hero: heroAlsaidAuto,
    motif: "fleet",
    monogram: "AA",
  },
  {
    slug: "gac-motor",
    name: "GAC Motor Partnership",
    sector: "Exclusive Partnership",
    established: "2025",
    location: "Amman · Libya · Syria",
    tagline:
      "An exclusive partnership across Amman, Libya, and Syria for pickup vehicles and larger automotive platforms, continuing the Group's longstanding engagement with leading Asian manufacturers.",
    facts: [
      { label: "Signed", value: "2025" },
      { label: "Territory", value: "Amman · Libya · Syria" },
      { label: "Category", value: "Pickup & large" },
      { label: "Manufacturer", value: "GAC Motor" },
    ],
    paragraphs: [
      "In 2025, Alsaid Group established an exclusive partnership with GAC Motor, becoming the exclusive partner across Amman, Libya, and Syria for selected vehicle categories, including pickup vehicles and larger automotive platforms.",
      "The agreement continues the Group's longstanding engagement with Asian automotive manufacturers, having previously worked with manufacturers including Great Wall Motors.",
    ],
    accent: "#111827",
    accentSoft: "#F3F4F6",
    logo: gacLogo,
    hero: heroGac,
    motif: "pickup",
    monogram: "GAC",
  },
  {
    slug: "gma-everett",
    name: "GMA of Everett",
    sector: "Dealership · United States",
    location: "Everett, Washington",
    tagline:
      "A United States dealership extending the Group's automotive network into local and international sales channels.",
    facts: [
      { label: "Location", value: "Everett, WA" },
      { label: "Function", value: "Dealership" },
      { label: "Inventory", value: "Diverse vehicles" },
      { label: "Network", value: "U.S. extension" },
    ],
    paragraphs: [
      "Based in the United States, GMA of Everett represents an extension of Alsaid Group's automotive operations, focused on vehicle sales and automotive market services within the U.S. sector. The company specialises in providing a diverse range of vehicles through a customer-focused, quality-driven approach.",
      "Through market experience, sourcing capabilities, and operational coordination, GMA of Everett contributes to the Group's expanding automotive presence across international markets.",
    ],
    accent: "#7A1F2B",
    accentSoft: "#F5EBED",
    logo: gmaLogo,
    hero: heroGma,
    motif: "showroom",
    monogram: "GMA",
  },
  {
    slug: "river-auto",
    name: "River Auto Transportation",
    sector: "Logistics · United States",
    location: "United States",
    tagline:
      "A United States based transportation and logistics company connecting automotive markets between North America, the Middle East, and beyond.",
    facts: [
      { label: "Headquarters", value: "United States" },
      { label: "Specialty", value: "Vehicle transport" },
      { label: "Reach", value: "N. America to MENA" },
      { label: "Role", value: "Group logistics" },
    ],
    paragraphs: [
      "River Auto Sales & Transportation operates within the Group's international automotive and mobility network. Established to support cross-border transportation, the company plays a key role in connecting automotive markets between the United States, the Middle East, and other international destinations.",
      "Specialising in vehicle transportation, shipping coordination, and logistics operations, River Auto facilitates the movement of vehicles and commercial cargo through reliable and streamlined logistics solutions.",
    ],
    accent: "#1E4E8C",
    accentSoft: "#EAF1F9",
    logo: riverLogo,
    hero: heroRiver,
    motif: "carrier",
    monogram: "RA",
  },
  {
    slug: "greenviro-energy",
    name: "Greenviro Energy",
    sector: "Renewable Energy",
    established: "2013",
    location: "Jordan · MENA",
    tagline:
      "The Group's strategic expansion into renewable energy. An early commitment to solar, clean technologies, and sustainable infrastructure.",
    facts: [
      { label: "Established", value: "2013" },
      { label: "Sector", value: "Energy" },
      { label: "Focus", value: "Solar" },
      { label: "Recognition", value: "UN Global Compact" },
    ],
    paragraphs: [
      "Established in 2013, Greenviro Energy reflects an early recognition of the region's evolving energy landscape and the global transition toward sustainable infrastructure. The company was developed with a long-term vision centred on sustainability, operational efficiency, and future-oriented investment.",
      "Focused on solar energy, renewable technologies, and energy development, Greenviro has advanced renewable accessibility through solar solutions and environmentally conscious infrastructure, work recognised through its mention within the United Nations Global Compact framework.",
    ],
    accent: "#2F7D4F",
    accentSoft: "#ECF5EF",
    logo: greenviroLogo,
    hero: heroGreenviro,
    motif: "solar",
    monogram: "GV",
  },
  {
    slug: "speed-travel",
    name: "Speed Travel & Tourism",
    sector: "Travel & Tourism",
    location: "Regional · International",
    tagline:
      "Comprehensive travel solutions across regional and international markets, with particular strength in pilgrimage travel to the Holy Lands and Mecca.",
    facts: [
      { label: "Specialty", value: "Religious travel" },
      { label: "Services", value: "Ticketing · Tours" },
      { label: "Network", value: "Airlines · Operators" },
      { label: "Focus", value: "Holy Lands · Mecca" },
    ],
    paragraphs: [
      "Speed Travel & Tourism supports both individual and group travel through a broad range of services, including travel coordination, airline ticketing, tourism services, and structured travel programmes, alongside working relationships with airlines and tourism operators across international destinations.",
      "The company has developed particular strength in religious and cultural travel, maintaining an active role in organising journeys to the Holy Lands and Mecca through coordinated group programmes.",
    ],
    accent: "#0B7C86",
    accentSoft: "#E8F4F5",
    logo: speedLogo,
    hero: heroSpeed,
    motif: "plane",
    monogram: "ST",
  },
  {
    slug: "zain-farm",
    name: "Zain Farm",
    sector: "Events & Hospitality",
    established: "2018",
    location: "Jordan",
    tagline:
      "A premier events venue for weddings, formal events, and curated gatherings, with in-house culinary operations and a full inventory of event production infrastructure.",
    facts: [
      { label: "Established", value: "2018" },
      { label: "Specialty", value: "Weddings · Galas" },
      { label: "In-house", value: "Culinary" },
      { label: "Also", value: "Equipment hire" },
    ],
    paragraphs: [
      "Established in 2018, Zain Farm is designed to host large-scale celebrations and refined social gatherings, recognised for delivering elevated event experiences through atmosphere, service, and operational excellence. The venue specialises in weddings, private celebrations, and curated gatherings.",
      "Zain Farm is distinguished by its in-house culinary operations, where food is freshly prepared onsite. It also maintains a comprehensive inventory of professional event infrastructure, including staging, lighting, and production solutions, available for hire at external venues.",
    ],
    accent: "#8A6A2E",
    accentSoft: "#F5EFE1",
    logo: zainLogo,
    hero: heroZain,
    motif: "lights",
    monogram: "ZF",
  },
  {
    slug: "alsaid-foundation",
    name: "Alsaid Foundation",
    sector: "Social Impact · 501(c)(3)",
    established: "2019",
    location: "Washington, D.C.",
    tagline:
      "The Group's non-profit and social impact organisation, focused on education, sustainability, and youth empowerment from a base in Washington, D.C.",
    facts: [
      { label: "Established", value: "2019" },
      { label: "Status", value: "501(c)(3)" },
      { label: "Base", value: "Washington D.C." },
      { label: "Web", value: "alsaidfoundation.org" },
    ],
    paragraphs: [
      "Established in Washington, D.C. in 2019, Alsaid Foundation is driven by the belief that meaningful progress begins through opportunity and access. The Foundation focuses on youth initiatives, educational development, community engagement, and programmes designed to assist underserved communities.",
      "The Foundation works alongside international partners, institutions, and governmental entities, supporting initiatives, awareness campaigns, and community-centred projects across educational, developmental, and sustainability-focused efforts.",
    ],
    accent: "#334155",
    accentSoft: "#EEF1F5",
    logo: foundationLogo,
    // No hero photo — see companies.$slug.tsx for the fallback treatment.
    motif: "impact",
    monogram: "AF",
  },
];

export type FootprintRow = {
  city: string;
  region: string;
  role: string;
  since: string;
  lat: number;
  lng: number;
};

export const footprint: FootprintRow[] = [
  {
    city: "Amman",
    region: "Jordan · MENA",
    role: "Founding city, Group leadership and automotive headquarters",
    since: "1999",
    lat: 31.95,
    lng: 35.93,
  },
  {
    city: "Dubai",
    region: "UAE · MENA",
    role: "Gateway for international sourcing and trade",
    since: "2009",
    lat: 25.2,
    lng: 55.27,
  },
  {
    city: "Sharjah",
    region: "UAE · MENA",
    role: "Automotive ecosystem and sourcing",
    since: "In operation",
    lat: 25.35,
    lng: 55.39,
  },
  {
    city: "Damascus",
    region: "Syria · MENA",
    role: "Automotive activity and GAC territory",
    since: "In operation",
    lat: 33.51,
    lng: 36.29,
  },
  {
    city: "Tripoli",
    region: "Libya · MENA",
    role: "GAC partnership territory",
    since: "2025",
    lat: 32.89,
    lng: 13.19,
  },
  {
    city: "Abidjan",
    region: "Côte d'Ivoire",
    role: "West African automotive expansion",
    since: "In operation",
    lat: 5.36,
    lng: -4.01,
  },
  {
    city: "Washington",
    region: "D.C. · USA",
    role: "Alsaid Foundation headquarters",
    since: "2019",
    lat: 38.91,
    lng: -77.04,
  },
  {
    city: "Everett",
    region: "WA · USA",
    role: "GMA dealership and U.S. base",
    since: "In operation",
    lat: 47.98,
    lng: -122.2,
  },
  {
    city: "Mecca",
    region: "Saudi Arabia",
    role: "Speed Travel pilgrimage programmes",
    since: "In operation",
    lat: 21.39,
    lng: 39.86,
  },
  {
    city: "Seoul",
    region: "South Korea · Asia",
    role: "Automotive sourcing and manufacturer relations",
    since: "1999",
    lat: 37.57,
    lng: 126.98,
  },
  {
    city: "Guangzhou",
    region: "China · Asia",
    role: "Automotive and retail, GAC Motor home market",
    since: "2012",
    lat: 23.13,
    lng: 113.26,
  },
  {
    city: "Shanghai",
    region: "China · Asia",
    role: "Automotive and retail operations",
    since: "2012",
    lat: 31.23,
    lng: 121.47,
  },
  {
    city: "Johannesburg",
    region: "South Africa",
    role: "Southern African automotive expansion",
    since: "2017",
    lat: -26.2,
    lng: 28.05,
  },
];
