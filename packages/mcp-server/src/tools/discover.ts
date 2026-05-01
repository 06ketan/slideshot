import { type ThemeEntry, fetchCatalog } from "../prompts.js";
import { resetDiscovery, markDiscoveryDone } from "../cache.js";
import { ORIENTATION_PRESETS } from "../schema.js";
import { loadPrefs, PRESETS } from "../preferences.js";

/**
 * Tier classification for postmortem SS-002 (theme discoverability gap).
 *
 * Models orchestrating MCP elicitation often truncate long option lists.
 * Tagging each theme as primary/secondary lets the model render primary
 * themes first and put secondary ones behind a "More themes" expander —
 * but the underlying ask payload always carries ALL eight, so no theme
 * is silently unreachable.
 */
export type ThemeTier = "primary" | "secondary";

export interface TieredTheme extends ThemeEntry {
  tier: ThemeTier;
}

const THEME_CATALOG_FALLBACK: TieredTheme[] = [
  { id: "generic", name: "Clean Minimal", emoji: "📋", style: "Inter, white cards, flexible", palette: ["#FFF", "#1a1a1a", "#888"], tier: "primary" },
  { id: "branded", name: "Ketan Slides", emoji: "🎯", style: "Space Mono, teal/coral accents", palette: ["#F0EDE7", "#00B894", "#E84C1E", "#1A1A1A"], tier: "primary" },
  { id: "instagram-carousel", name: "Terminal Editorial", emoji: "📸", style: "Inter 900 + JetBrains Mono, cream + rust, terminal cards", palette: ["#F5F0EA", "#C4562A", "#2A2018", "#C4A882"], tier: "primary" },
  { id: "infographic", name: "Infographic", emoji: "📊", style: "DM Sans, data-heavy, stat cards", palette: ["#2563EB", "#10B981", "#F59E0B", "#F8FAFC"], tier: "primary" },
  { id: "pitch-deck", name: "Pitch Deck", emoji: "🚀", style: "DM Sans, KPI cards, timelines", palette: ["#0F172A", "#3B82F6", "#8B5CF6", "#FFF"], tier: "primary" },
  { id: "dark-modern", name: "Dark Modern", emoji: "🌙", style: "Inter, neon accents, glassmorphism", palette: ["#0A0A0F", "#22D3EE", "#E879F9", "#34D399"], tier: "secondary" },
  { id: "editorial", name: "Editorial", emoji: "📰", style: "Playfair Display, gold accents, serif", palette: ["#FAF8F5", "#C9963B", "#2C2824", "#1A1814"], tier: "secondary" },
  { id: "browser-shell", name: "Browser Shell", emoji: "🖥️", style: "Bebas Neue + DM Sans, yellow/navy chrome", palette: ["#FFD233", "#12122A", "#0A0A0A", "#FFF"], tier: "secondary" },
  { id: "academic-poster", name: "Academic Poster", emoji: "🎓", style: "IBM Plex Serif + Mono, navy + parchment, conference poster", palette: ["#FBF8F1", "#0E1B33", "#A22E2E", "#5C6781"], tier: "secondary" },
  { id: "clinical-medical", name: "Clinical Medical", emoji: "🩺", style: "Source Sans + Serif, clinical teal, vitals/alerts", palette: ["#FAFCFD", "#0FA3A8", "#0F2D3D", "#D8484F"], tier: "secondary" },
  { id: "sketch-handdrawn", name: "Sketch Handdrawn", emoji: "✏️", style: "Caveat + Architects Daughter, paper, dashed borders", palette: ["#FFFEF7", "#1F1F1F", "#D9534F", "#FFF6CC"], tier: "secondary" },
];

const TIER_BY_ID: Record<string, ThemeTier> = Object.fromEntries(
  THEME_CATALOG_FALLBACK.map((t) => [t.id, t.tier]),
);

function withTier(themes: ThemeEntry[]): TieredTheme[] {
  return themes.map((t) => ({ ...t, tier: TIER_BY_ID[t.id] ?? "secondary" }));
}

async function loadThemeCatalog(): Promise<TieredTheme[]> {
  try {
    const fetched = await fetchCatalog();
    if (fetched && fetched.length > 0) {
      const tiered = withTier(fetched);
      const fetchedIds = new Set(tiered.map((t) => t.id));
      const missing = THEME_CATALOG_FALLBACK.filter((t) => !fetchedIds.has(t.id));
      return [...tiered, ...missing];
    }
  } catch {
    // fall through to fallback
  }
  return THEME_CATALOG_FALLBACK;
}

export async function handleDiscover() {
  resetDiscovery();
  const themes = await loadThemeCatalog();
  const prefs = loadPrefs();
  markDiscoveryDone();

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: themes.map(t => ({ id: t.id, name: t.name, emoji: t.emoji, style: t.style, palette: t.palette, tier: t.tier })),
        themeCount: themes.length,
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
            description: "AI writes complete HTML with CSS. Best quality, full creative control over layout and styling.",
            workflow: "AI generates full HTML -> create_slides(mode=default, html=...) -> render_slides",
          },
          token_saver: {
            label: "Token Efficient",
            description: "AI sends structured JSON only. Server uses basic built-in templates. Limited styling and layout control.",
            workflow: "AI generates slide JSON -> create_slides(mode=token_saver, slides=[...]) -> render_slides",
          },
        },
        formats: {
          pdf:  { label: "PDF", note: "Best for LinkedIn carousels, sharing, printing" },
          webp: { label: "WebP", note: "Lightweight images for web/social" },
          png:  { label: "PNG", note: "High-quality images, universal compatibility" },
          pptx: { label: "PPTX", note: "PowerPoint file (image-based by default — preserves design, NOT editable). Native text-only mode is opt-in. For truly editable decks, use PDF or generate slides directly in PowerPoint." },
        },
        prefs: {
          lastTheme: prefs.lastTheme,
          lastOrientation: prefs.lastOrientation,
          brandName: prefs.brandName,
          lastFormats: prefs.lastFormats,
          lastTokenMode: prefs.lastTokenMode,
          lastUpdated: prefs.lastUpdated,
        },
        presets: PRESETS,
        ask: [
          {
            id: "usePreset",
            type: "select",
            prompt: "Quick start with a preset, or customize?",
            optional: true,
            options: [
              { value: "none", label: "🛠 Customize each option" },
              ...PRESETS.map((p) => ({ value: p.id, label: p.label })),
            ],
            default: "none",
          },
          {
            id: "theme",
            type: "select",
            prompt: "Which theme?",
            showAll: true,
            instruction: `You MUST present ALL ${themes.length} theme options to the user. DO NOT truncate the list. DO NOT silently drop secondary-tier themes. The user must see every option below in the elicitation menu.`,
            default: prefs.lastTheme,
            options: themes.map(t => ({
              value: t.id,
              label: `${t.emoji} ${t.name} — ${t.style}`,
              tier: t.tier,
            })),
          },
          { id: "topic", type: "freetext", prompt: "What topic/content for the slides?" },
          { id: "orientation", type: "select", prompt: "Orientation/ratio?", options: [
            { value: "portrait", label: "Portrait 4:5 (social/LinkedIn)" },
            { value: "landscape", label: "Landscape 16:9 (presentations)" },
            { value: "instagram", label: "Instagram 1:1 (square)" },
            { value: "a4", label: "A4 portrait (document)" },
          ], default: prefs.lastOrientation || "portrait" },
          { id: "tokenMode", type: "select", prompt: "Slide generation mode?", options: [
            { value: "default", label: "Default (Recommended) — full HTML, best quality, full creative control" },
            { value: "token_saver", label: "Token Efficient — structured JSON, basic templates, limited styling" },
          ], default: prefs.lastTokenMode || "default" },
          { id: "formats", type: "multiselect", prompt: "Output format?", options: [
            { value: "pdf", label: "PDF" },
            { value: "png", label: "PNG" },
            { value: "webp", label: "WebP" },
            { value: "pptx", label: "PPTX (PowerPoint)" },
          ], default: prefs.lastFormats || ["pdf"] },
          { id: "pptxMode", type: "select", prompt: "PPTX mode?", options: [
            { value: "image", label: "Image (Recommended) — pixel-perfect, preserves your design but text is not editable" },
            { value: "native", label: "Text-only — selectable/copyable text but design is NOT preserved (looks broken). Useful only for extracting words." },
          ], default: "image", conditional: "formats includes pptx" },
          { id: "brandName", type: "freetext", prompt: "Brand name? (optional)", optional: true, default: prefs.brandName },
          { id: "outlineConfirm", type: "select", prompt: "Does this outline look good?", options: [
            { value: "continue", label: "Looks good, continue" },
            { value: "edit", label: "I want to make changes" },
          ], useAfterOutline: true },
        ],
        instruction: `MANDATORY — follow these steps exactly. DO NOT deviate.

STEP 1: Use the structured "ask" selectors above to prompt the user. Present ALL selectors including token mode. DO NOT render themes as a separate markdown list — ONLY use the native selector prompts. No duplicate display.

STEP 1a: When presenting the "theme" selector, you MUST include EVERY one of the ${themes.length} themes in the options list. DO NOT truncate to the first 3-4 themes. DO NOT drop secondary-tier themes. The user must be able to pick any of: ${themes.map(t => t.name).join(", ")}. If the platform UI cannot fit them all, use a "More themes" expander, but never silently omit. If asked "what other themes exist?" mid-conversation, call the list_themes tool.

STEP 2: Collect from the user: theme, topic, orientation, token mode, output format(s). Recommend mode=default for best quality. DO NOT ask how many slides — you decide the slide count based on the topic depth and context.

STEP 3: After the user answers, generate a DATA OUTLINE — a bullet-point list of proposed slides (e.g. "Slide 1: Cover — title, Slide 2: Key Stats — ..., Slide 3: ..."). Then present the "outlineConfirm" selector so the user can quickly approve or request changes.

STEP 4: STOP. WAIT for the user to pick "continue" or type changes. If "edit" or user types changes, revise the outline and re-present the outlineConfirm selector. Loop until approved.

STEP 5: ONLY after user confirms, proceed to call create_slides with the chosen mode, theme, orientation, and content.

DO NOT auto-select any option. DO NOT skip any step. DO NOT call create_slides before the outline is confirmed.`,
      }),
    }],
  };
}

/**
 * Idempotent handler for the `list_themes` tool. Unlike `discover_themes`,
 * this resets nothing and starts no flow — models can call it any time the
 * user asks "what other themes exist?" mid-conversation. Returns the same
 * tiered theme list, plus a hint instructing the model to show all of them.
 */
export async function handleListThemes() {
  const themes = await loadThemeCatalog();
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        themes: themes.map(t => ({
          id: t.id,
          name: t.name,
          emoji: t.emoji,
          style: t.style,
          palette: t.palette,
          tier: t.tier,
        })),
        themeCount: themes.length,
        primaryThemes: themes.filter(t => t.tier === "primary").map(t => t.id),
        secondaryThemes: themes.filter(t => t.tier === "secondary").map(t => t.id),
        instruction: `Present ALL ${themes.length} themes to the user. This is a read-only listing — calling this tool does NOT advance the slide-creation workflow. If the user wants to switch themes, they should re-invoke discover_themes or pass theme=<id> directly to create_slides.`,
      }),
    }],
  };
}
