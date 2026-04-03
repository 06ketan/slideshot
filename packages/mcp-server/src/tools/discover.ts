import { type ThemeEntry, fetchCatalog } from "../prompts.js";
import { resetDiscovery, markDiscoveryDone } from "../cache.js";
import { ORIENTATION_PRESETS } from "../schema.js";

const THEME_CATALOG_FALLBACK: ThemeEntry[] = [
  { id: "generic", name: "Clean Minimal", emoji: "📋", style: "Inter, white cards, flexible", palette: ["#FFF", "#1a1a1a", "#888"] },
  { id: "branded", name: "Ketan Slides", emoji: "🎯", style: "Space Mono, teal/coral accents", palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"] },
  { id: "instagram-carousel", name: "Instagram Carousel", emoji: "📸", style: "Poppins, bold gradients, vibrant", palette: ["#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"] },
  { id: "infographic", name: "Infographic", emoji: "📊", style: "DM Sans, data-heavy, stat cards", palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"] },
  { id: "pitch-deck", name: "Pitch Deck", emoji: "🚀", style: "DM Sans, KPI cards, timelines", palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFF"] },
  { id: "dark-modern", name: "Dark Modern", emoji: "🌙", style: "Inter, neon accents, glassmorphism", palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"] },
  { id: "editorial", name: "Editorial", emoji: "📰", style: "Playfair Display, gold accents, serif", palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"] },
  { id: "browser-shell", name: "Browser Shell", emoji: "🖥️", style: "Bebas Neue + DM Sans, yellow/navy chrome", palette: ["#FFD233", "#12122A", "#0A0A0A", "#FFF"] },
];

export async function handleDiscover() {
  resetDiscovery();

  let themes: ThemeEntry[];
  try {
    const fetched = await fetchCatalog();
    themes = fetched && fetched.length > 0 ? fetched : THEME_CATALOG_FALLBACK;
  } catch {
    themes = THEME_CATALOG_FALLBACK;
  }

  markDiscoveryDone();

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: themes.map(t => ({ id: t.id, name: t.name, emoji: t.emoji, style: t.style, palette: t.palette })),
        orientations: {
          portrait:  { ...ORIENTATION_PRESETS.portrait,  label: "Portrait (4:5)", note: "Default for social/LinkedIn" },
          landscape: { ...ORIENTATION_PRESETS.landscape, label: "Landscape (16:9)", note: "Presentations, widescreen" },
          linkedin:  { ...ORIENTATION_PRESETS.linkedin,  label: "LinkedIn (4:5)", note: "LinkedIn carousel PDF" },
          instagram: { ...ORIENTATION_PRESETS.instagram, label: "Instagram (1:1)", note: "Square posts/carousel" },
          a4:        { ...ORIENTATION_PRESETS.a4,        label: "A4 Portrait", note: "Document/print format" },
          custom:    { label: "Custom", note: "Specify width and height manually" },
        },
        tokenModes: {
          default: {
            label: "Default (Recommended)",
            description: "AI writes complete HTML with CSS. Maximum creative control. Uses more tokens.",
            workflow: "AI generates full HTML -> create_slides(mode=default, html=...) -> render_slides",
          },
          token_saver: {
            label: "Token Saver",
            description: "AI sends structured JSON data only. Server assembles HTML from built-in theme templates. Fewer tokens, less creative control.",
            workflow: "AI generates slide JSON -> create_slides(mode=token_saver, slides=[...]) -> render_slides",
          },
        },
        formats: {
          pdf:  { label: "PDF", note: "Best for LinkedIn carousels, sharing, printing" },
          webp: { label: "WebP", note: "Lightweight images for web/social" },
          png:  { label: "PNG", note: "High-quality images, universal compatibility" },
        },
        ask: [
          { id: "theme", type: "select", prompt: "Which theme?", options: themes.map(t => ({ value: t.id, label: `${t.emoji} ${t.name} — ${t.style}` })) },
          { id: "topic", type: "freetext", prompt: "What topic/content for the slides?" },
          { id: "orientation", type: "select", prompt: "Orientation/ratio?", options: [
            { value: "portrait", label: "Portrait 4:5 (social/LinkedIn)" },
            { value: "landscape", label: "Landscape 16:9 (presentations)" },
            { value: "instagram", label: "Instagram 1:1 (square)" },
            { value: "a4", label: "A4 portrait (document)" },
          ], default: "portrait" },
          { id: "tokenMode", type: "select", prompt: "Token usage?", options: [
            { value: "default", label: "Default — full HTML (recommended, more creative control)" },
            { value: "token_saver", label: "Token Saver — structured JSON (fewer tokens)" },
          ], default: "default" },
          { id: "formats", type: "multiselect", prompt: "Output format?", options: [
            { value: "pdf", label: "PDF" },
            { value: "png", label: "PNG" },
            { value: "webp", label: "WebP" },
          ], default: ["pdf"] },
          { id: "slideCount", type: "freetext", prompt: "How many slides? (e.g. 1, 5, 8)", default: "6" },
          { id: "brandName", type: "freetext", prompt: "Brand name? (optional)", optional: true },
        ],
        instruction: `MANDATORY — follow these steps exactly:
1. Present the themes list to the user (use a numbered menu or native select).
2. Ask the user to pick: theme, topic, orientation/ratio, token mode, output format(s), and slide count.
3. STOP HERE. DO NOT proceed to create_slides until the user has answered ALL questions.
4. DO NOT auto-select any option on behalf of the user.
5. DO NOT skip questions — even if the user's request implies a preference, confirm it explicitly.
6. Only after you have explicit user answers for theme + topic + orientation + token mode + format, call create_slides.`,
      }),
    }],
  };
}
