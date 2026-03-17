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
  | "editorial";

export const PROMPT_VARIANTS: PromptVariant[] = [
  "generic",
  "branded",
  "instagram-carousel",
  "infographic",
  "pitch-deck",
  "dark-modern",
  "editorial",
];

const cache = new Map<string, string>();

function promptsDir(): string {
  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const bundled = path.resolve(thisDir, "../prompts");
  if (fs.existsSync(bundled)) return bundled;
  return path.resolve(thisDir, "../../../prompts");
}

export function loadPrompt(variant: PromptVariant): string {
  const cached = cache.get(variant);
  if (cached) return cached;

  const filePath = path.join(promptsDir(), `${variant}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`);
  }
  const text = fs.readFileSync(filePath, "utf-8");
  cache.set(variant, text);
  return text;
}

export function loadAllPrompts(): Record<PromptVariant, string> {
  const result = {} as Record<PromptVariant, string>;
  for (const v of PROMPT_VARIANTS) {
    result[v] = loadPrompt(v);
  }
  return result;
}
