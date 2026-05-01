import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type PromptVariant =
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

export const PROMPT_VARIANTS: PromptVariant[] = [
  "generic", "branded", "instagram-carousel", "infographic",
  "pitch-deck", "dark-modern", "editorial", "browser-shell",
  "academic-poster", "clinical-medical", "sketch-handdrawn",
];

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/06ketan/awesome-visual-ai-prompts/main";
const CATALOG_URL = `${GITHUB_RAW_BASE}/index.json`;
const THEMES_BASE = `${GITHUB_RAW_BASE}/themes/slides`;
const FETCH_TIMEOUT_MS = 1500;
const TTL_MS = 10 * 60 * 1000; // 10 minutes — longer TTL reduces repeat fetches

interface CacheEntry {
  text: string;
  fetchedAt: number;
}

export interface ThemeEntry {
  id: PromptVariant;
  name: string;
  emoji: string;
  style: string;
  palette: string[];
}

export interface CatalogData {
  version: number;
  categories: {
    slides: {
      path: string;
      themes: ThemeEntry[];
    };
  };
}

const promptCache = new Map<string, CacheEntry>();
let catalogCache: { data: CatalogData; fetchedAt: number } | null = null;
let _promptsDir: string | null = null;

function isFresh(fetchedAt: number): boolean {
  return Date.now() - fetchedAt < TTL_MS;
}

function promptsDir(): string {
  if (_promptsDir) return _promptsDir;
  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const bundled = path.resolve(thisDir, "../prompts");
  _promptsDir = fs.existsSync(bundled) ? bundled : path.resolve(thisDir, "../../../prompts");
  return _promptsDir;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ── Catalog ──

export async function fetchCatalog(): Promise<ThemeEntry[]> {
  if (catalogCache && isFresh(catalogCache.fetchedAt)) {
    return catalogCache.data.categories.slides.themes;
  }

  try {
    const res = await fetchWithTimeout(CATALOG_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: CatalogData = await res.json();
    catalogCache = { data, fetchedAt: Date.now() };
    return data.categories.slides.themes;
  } catch {
    if (catalogCache) return catalogCache.data.categories.slides.themes;
    return null as unknown as ThemeEntry[];
  }
}

// ── Prompt fetching (GitHub → local fallback) ──

export async function fetchPromptFromGitHub(
  variant: PromptVariant,
): Promise<string | null> {
  const cached = promptCache.get(variant);
  if (cached && isFresh(cached.fetchedAt)) return cached.text;

  try {
    const url = `${THEMES_BASE}/${variant}.md`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    promptCache.set(variant, { text, fetchedAt: Date.now() });
    return text;
  } catch {
    const stale = promptCache.get(variant);
    if (stale) return stale.text;
    return null;
  }
}

export function loadPromptLocal(variant: PromptVariant): string {
  const filePath = path.join(promptsDir(), `${variant}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

/** Replace `{{SLIDE_W}}`, `{{SLIDE_H}}`, `{{SLIDE_DIMS}}` in prompt markdown. */
export function substitutePromptDimensions(
  text: string,
  dims: { width: number; height: number },
): string {
  return text
    .replace(/\{\{SLIDE_W\}\}/g, String(dims.width))
    .replace(/\{\{SLIDE_H\}\}/g, String(dims.height))
    .replace(/\{\{SLIDE_DIMS\}\}/g, `${dims.width}x${dims.height}`);
}

export async function loadPrompt(
  variant: PromptVariant,
  dimensions?: { width: number; height: number },
): Promise<string> {
  let text: string;
  try {
    text = loadPromptLocal(variant);
  } catch {
    const remote = await fetchPromptFromGitHub(variant);
    if (!remote) {
      throw new Error(`Prompt "${variant}" not found locally or remotely.`);
    }
    text = remote;
  }
  return substitutePromptDimensions(text, dimensions ?? { width: 540, height: 675 });
}
