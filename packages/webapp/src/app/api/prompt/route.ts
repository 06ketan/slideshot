import fs from "node:fs";
import path from "node:path";

const VARIANTS = [
  "generic", "branded", "instagram-carousel", "infographic",
  "pitch-deck", "dark-modern", "editorial", "obsio-carousel",
] as const;

type Variant = (typeof VARIANTS)[number];

const cache = new Map<string, string>();

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

  const text = loadPrompt(variant);
  if (!text) {
    return new Response(
      JSON.stringify({ error: `Prompt file not found for variant "${variant}"` }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  return new Response(JSON.stringify({ variant, prompt: text }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
