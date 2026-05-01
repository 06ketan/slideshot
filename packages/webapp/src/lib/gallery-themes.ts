/**
 * Single source of truth for theme metadata used in the public gallery.
 *
 * Matches the catalog returned by the MCP server's `list_themes` tool, so
 * the same theme IDs work in both surfaces.
 */
export type VariantKey =
  | "generic"
  | "branded"
  | "instagram-carousel"
  | "infographic"
  | "pitch-deck"
  | "dark-modern"
  | "editorial"
  | "browser-shell"
  | "academic-poster"
  | "clinical-medical"
  | "sketch-handdrawn";

export interface GalleryItem {
  name: string;
  style: string;
  palette: string[];
  featured?: boolean;
  description?: string;
}

export const GALLERY_ITEMS: Record<VariantKey, GalleryItem> = {
  "browser-shell": {
    name: "Browser Shell",
    style: "Bebas Neue + DM Sans, yellow/navy browser chrome, versatile layout",
    palette: ["#FFD233", "#12122A", "#0A0A0A"],
    featured: true,
    description: "A versatile browser-window aesthetic with bold yellow/navy chrome — feels like a Chrome screenshot but engineered for distinct slide scenes.",
  },
  generic: {
    name: "Clean Minimal",
    style: "Inter, white backgrounds, black typography, product launch",
    palette: ["#FFFFFF", "#1A1A1A", "#F5F5F5"],
    description: "The default — Inter on white, balanced spacing, minimal accents. Works for product launches, internal updates, and explainer carousels.",
  },
  branded: {
    name: "Monospace",
    style: "Space Mono, teal accents, corner decorations, developer portfolio",
    palette: ["#F0EDE7", "#00B894", "#1A1A1A"],
    description: "Space Mono everywhere with teal/coral accents and corner decorations. The Ketan Chavan default — built for developer/portfolio carousels.",
  },
  "instagram-carousel": {
    name: "Terminal Editorial",
    style: "Inter 900 + JetBrains Mono, cream + rust, terminal cards, AI engineering breakdowns",
    palette: ["#F5F0EA", "#C4562A", "#2A2018"],
    description: "Inter 900 + JetBrains Mono on parchment with rust accents and terminal callouts. Built for technical explainers and AI/engineering breakdowns.",
  },
  infographic: {
    name: "Data Cards",
    style: "DM Sans, green/amber, stat grids, startup annual report",
    palette: ["#10B981", "#F59E0B", "#1A1A1A"],
    description: "Stat-grid heavy DM Sans layout in green/amber. For startup annual reports, dashboards, and any data-forward narrative.",
  },
  "pitch-deck": {
    name: "Corporate",
    style: "Inter, dark headers, red accents, company pitch deck",
    palette: ["#0A0A0A", "#FF4444", "#E8E8E8"],
    description: "Inter with dark headers and red accents. The traditional VC-pitch aesthetic — KPI cards, comparison tables, timelines.",
  },
  "dark-modern": {
    name: "Dark Neon",
    style: "Inter, coral/gold glows on dark, music event promo",
    palette: ["#0A0A0F", "#FF6B6B", "#FFC107"],
    description: "Coral/gold neon on near-black with subtle glassmorphism. Best for music drops, product reveals, or any promo that needs energy.",
  },
  editorial: {
    name: "Editorial",
    style: "Playfair Display, gold accents, warm tones, recipe feature",
    palette: ["#FAF8F5", "#C9963B", "#2C2824"],
    description: "Playfair Display + gold accents on warm paper. For recipes, lifestyle features, or anything that should feel like a magazine spread.",
  },
  "academic-poster": {
    name: "Academic Poster",
    style: "IBM Plex Serif + Mono, navy + parchment, conference poster aesthetic",
    palette: ["#FBF8F1", "#0E1B33", "#A22E2E"],
    description: "IEEE/ACM conference poster aesthetic with IBM Plex Serif/Mono, deep navy, crimson accents. Built for working papers, lit reviews, and methodology decks.",
  },
  "clinical-medical": {
    name: "Clinical Medical",
    style: "Source Sans + Serif, clinical teal + alert red, medical chart aesthetic",
    palette: ["#FAFCFD", "#0FA3A8", "#D8484F"],
    description: "Sterile chart-paper aesthetic with Source Sans/Serif, clinical teal headers, and alert-red callouts for anomalies. For case reports and protocol summaries.",
  },
  "sketch-handdrawn": {
    name: "Sketch Handdrawn",
    style: "Caveat + Architects Daughter, paper texture, dashed borders, whiteboard feel",
    palette: ["#FFFEF7", "#1F1F1F", "#D9534F"],
    description: "Caveat + Architects Daughter on warm paper with dashed borders and slight rotations. For sprint retros, brainstorm recaps, and onboarding decks.",
  },
};

export const VARIANT_ORDER: VariantKey[] = Object.keys(GALLERY_ITEMS) as VariantKey[];
