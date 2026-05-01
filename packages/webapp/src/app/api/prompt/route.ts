import fs from "node:fs";
import path from "node:path";

const VARIANTS = [
  "generic", "branded", "instagram-carousel", "infographic",
  "pitch-deck", "dark-modern", "editorial", "browser-shell",
  "academic-poster", "clinical-medical", "sketch-handdrawn",
] as const;

type Variant = (typeof VARIANTS)[number];

const cache = new Map<string, string>();

function substitutePromptDimensions(
  text: string,
  dims: { width: number; height: number },
): string {
  return text
    .replace(/\{\{SLIDE_W\}\}/g, String(dims.width))
    .replace(/\{\{SLIDE_H\}\}/g, String(dims.height))
    .replace(/\{\{SLIDE_DIMS\}\}/g, `${dims.width}x${dims.height}`);
}

function parseDimensionParam(value: string | null, fallback: number): number {
  if (value === null || value === "") return fallback;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function promptsDir(): string {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, "prompts"),
    path.resolve(cwd, "../../prompts"),
    path.resolve(cwd, "../prompts"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

function loadPrompt(variant: string): string | null {
  if (cache.has(variant)) return cache.get(variant)!;
  const filePath = path.join(promptsDir(), `${variant}.md`);
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, "utf-8");
  cache.set(variant, text);
  return text;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("list") !== null) {
    return new Response(JSON.stringify({ variants: VARIANTS }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const variant = (searchParams.get("variant") || "generic") as string;

  if (!VARIANTS.includes(variant as Variant)) {
    return new Response(
      JSON.stringify({ error: `variant must be one of: ${VARIANTS.join(", ")}` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const raw = loadPrompt(variant);
  if (!raw) {
    return new Response(
      JSON.stringify({ error: `Prompt file not found for variant "${variant}"` }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const width = parseDimensionParam(searchParams.get("width"), 540);
  const height = parseDimensionParam(searchParams.get("height"), 675);
  const text = substitutePromptDimensions(raw, { width, height });

  return new Response(JSON.stringify({ variant, prompt: text, width, height }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
