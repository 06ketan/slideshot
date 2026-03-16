const GENERIC_PROMPT = `You are generating HTML slides for a visual carousel (LinkedIn, Instagram, presentations).

RULES:
1. Create a single HTML file with a <style> block and a <body> containing multiple slide divs.
2. Each slide MUST use the CSS class ".slide" and have fixed dimensions: width: 540px; height: 675px.
3. Use overflow: hidden on each slide — content must fit within the frame.
4. Use Google Fonts via <link> tags in <head> if you need custom fonts.
5. Each slide must be visually self-contained — no JavaScript required.
6. Use print-safe colors (avoid transparency-only effects).

Template:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; padding: 48px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start; }
    .slide { position: relative; width: 540px; height: 675px; padding: 32px 40px; overflow: hidden; font-family: 'Inter', sans-serif; flex-shrink: 0; background: #fff; }
  </style>
</head>
<body>
  <div class="slide"><!-- Slide 1 --></div>
  <div class="slide"><!-- Slide 2 --></div>
</body>
</html>

The tool will screenshot each .slide element at 4x resolution → 2160×2700 px output.`;

const BRANDED_PROMPT = `You are generating HTML slides using the "Ketan Slides" design system — a minimal, monospace carousel style.

DESIGN TOKENS: Font: Space Mono | Teal: #00B894 | Coral: #E84C1E | Purple: #7C5CBF | Dark: #1A1A1A | Light BG: #F0EDE7

SLIDE BASE: .slide { width: 540px; height: 675px; background: #F0EDE7; padding: 32px 40px 52px; }
DARK VARIANT: .slide.dark { background: #0D0D0D; }

COMPONENTS: .dots+.dot, .btag, .h1/.h2 (<i>=teal, <s>=muted), .lbl, .ft (footer), .scols+.sc (stat cards 3-col), .itrow+.it (icon tiles 4-col), .ul+.ur (list rows), .br+.bl+.bt+.bf (bar chart), .cg+.cc+.cbad+.cgood (comparison), .hg+.hc (hook cards), .cr+.ck+.cv (config rows), .al+.ai (action list), .mg+.mc (metric grid), .hr, .pnote, .lrow+.lchip

Include the full CSS from the branded prompt file and use Space Mono from Google Fonts.
Each .slide is screenshotted at 4x → 2160×2700 px.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get("variant") || "generic";

  if (variant !== "generic" && variant !== "branded") {
    return new Response(
      JSON.stringify({ error: 'variant must be "generic" or "branded"' }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const text = variant === "generic" ? GENERIC_PROMPT : BRANDED_PROMPT;

  return new Response(JSON.stringify({ variant, prompt: text }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
