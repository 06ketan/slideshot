import fs from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * Persistent user preferences for slideshot (postmortem roadmap #5 / SS-008).
 *
 * Models cannot remember user choices across MCP sessions, so every workflow
 * starts from scratch — "what theme?", "what brand name?", etc. We persist
 * the last successful choices to `~/.slideshot/preferences.json` so the next
 * `discover_themes` call can pre-populate `default` on each selector.
 *
 * The file is best-effort — read/write failures are silent. Missing fields
 * fall back to system defaults.
 */

export interface Preferences {
  lastTheme?: string;
  lastOrientation?: string;
  brandName?: string;
  lastFormats?: string[];
  lastTokenMode?: "default" | "token_saver";
  lastUpdated?: string;
}

const PREFS_DIR = path.join(os.homedir(), ".slideshot");
const PREFS_FILE = path.join(PREFS_DIR, "preferences.json");

let memo: Preferences | null = null;

export function loadPrefs(): Preferences {
  if (memo) return memo;
  try {
    if (!fs.existsSync(PREFS_FILE)) {
      memo = {};
      return memo;
    }
    const raw = fs.readFileSync(PREFS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      memo = parsed as Preferences;
      return memo;
    }
  } catch {
    // ignore — fall through to empty defaults
  }
  memo = {};
  return memo;
}

export function savePrefs(partial: Partial<Preferences>): Preferences {
  const current = loadPrefs();
  const next: Preferences = {
    ...current,
    ...partial,
    lastUpdated: new Date().toISOString(),
  };
  try {
    if (!fs.existsSync(PREFS_DIR)) fs.mkdirSync(PREFS_DIR, { recursive: true });
    fs.writeFileSync(PREFS_FILE, JSON.stringify(next, null, 2), "utf-8");
    memo = next;
  } catch {
    // best-effort write — keep in-memory copy regardless
    memo = next;
  }
  return next;
}

/**
 * Quick-start presets — bypass per-question prompting for the most common
 * use cases. Models can offer the user "Quick start with linkedin-default?"
 * and skip every other selector if accepted.
 */
export const PRESETS = [
  {
    id: "linkedin-default",
    label: "📱 LinkedIn carousel (PDF, 4:5, branded theme)",
    theme: "branded",
    orientation: "linkedin",
    formats: ["pdf"],
    tokenMode: "default",
  },
  {
    id: "instagram-square",
    label: "📷 Instagram square (PNG+WebP, 1:1, terminal editorial)",
    theme: "instagram-carousel",
    orientation: "instagram",
    formats: ["png", "webp"],
    tokenMode: "default",
  },
  {
    id: "pitch-deck-landscape",
    label: "🚀 Pitch deck (PDF+PPTX, 16:9, pitch-deck theme)",
    theme: "pitch-deck",
    orientation: "landscape",
    formats: ["pdf", "pptx"],
    tokenMode: "default",
  },
] as const;

export type Preset = (typeof PRESETS)[number];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

/** Test-only — clears the in-memory memo so subsequent reads hit disk. */
export function _resetMemo(): void {
  memo = null;
}
