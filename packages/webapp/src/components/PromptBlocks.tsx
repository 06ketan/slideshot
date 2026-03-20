"use client";

import { useState } from "react";
import { Copy, Check, FileCode, Paintbrush } from "lucide-react";

const BASE_PROMPT = `You are a slide layout engine. Given content (text, lists, stats), generate a single self-contained HTML file that works with slideshot.

RULES:
- Each slide is a <div class="slide"> inside <body>
- Slide dimensions: width: 540px; height: 675px; overflow: hidden
- Body: background: #1a1a1a; padding: 48px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start
- Include a <style> block inside <head> with all CSS (no external stylesheets except Google Fonts)
- Import fonts from Google Fonts via <link> in <head>
- Use inline SVGs for icons/illustrations — no external images (Puppeteer can't fetch them reliably)
- Split content across multiple slides when it overflows. Don't cram.
- Each slide should have: a header area, a content body, and optionally a footer bar

SLIDE STRUCTURE:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=YOUR+FONT&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #1a1a1a;
      padding: 48px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      align-items: flex-start;
      font-family: 'Your Font', sans-serif;
    }
    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      overflow: hidden;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="slide"><!-- Slide 1 --></div>
  <div class="slide"><!-- Slide 2 --></div>
</body>
</html>
\`\`\`

EXPORT CONSTRAINTS:
- Selector: .slide (default) — each matched element becomes one image
- Max 20 slides per export
- Keep total HTML under 512KB
- Test that content fits within 540x675 — nothing should overflow or clip

When the user gives you content, structure it into slides following these rules. Pick appropriate typography, spacing, and visual hierarchy. Don't ask clarifying questions — just produce the HTML.`;

const STYLE_PROMPT = `You are a CSS design system extractor. Given a reference image or description of a visual style, reverse-engineer the complete design system and output it as CSS custom properties + class definitions ready to use in slideshot HTML slides.

WHAT TO EXTRACT:

1. COLOUR PALETTE — every distinct colour as hex, with usage label:
   Primary, Secondary, Background, Text, Accent, Border, Muted, etc.

2. TYPOGRAPHY — font families (with Google Fonts import URL), weights, sizes:
   - Hero/Display: family, size, line-height, letter-spacing, weight
   - Body/UI: family, size, line-height, weight
   - Labels/Captions: family, size, tracking, text-transform

3. LAYOUT SYSTEM:
   - Outer container: background, padding (creates visible border effect)
   - Content container: border-radius, background, shadow
   - Content padding: horizontal/vertical values
   - Spacing scale: gap between elements
   - Dividers: thickness, colour, style

4. DECORATIVE ELEMENTS:
   - Border styles, border-radius values
   - Box shadows
   - Any shell/frame (e.g. browser chrome, phone frame)
   - Decorative shapes (blobs, dots, patterns — describe as SVG-ready)

OUTPUT FORMAT — always use this structure:

\`\`\`
Colors:
  Primary:      #HEX    — [usage]
  Secondary:    #HEX    — [usage]
  Background:   #HEX    — [usage]
  Text:         #HEX    — [usage]

Typography:
  Display:  [Font Family] (Google Fonts)
  Body:     [Font Family] (Google Fonts)

Spacing:
  Base unit:        [N]px
  Container pad:    [N]px

Border Radius:
  Container:  [N]px
  Cards:      [N]px
\`\`\`

Then provide the full CSS classes that implement this system, ready to paste into a slideshot HTML file's <style> block.

EXAMPLE — Obsio browser-shell style:

Colors:
  Primary Yellow:   #FFD233  — Slide bg, accents, tags
  Dark Navy:        #12122A  — Browser shell, footer bar
  Black Text:       #0A0A0A  — Headlines, body, outlines
  White:            #FFFFFF  — Content area

Typography:
  Display:  Bebas Neue  — all hero headlines
  Body:     DM Sans     — all UI/body copy

Spacing:
  Outer slide:     20px padding (yellow border)
  Browser shell:   14px border-radius
  Content padding: 24px horizontal

When the user provides an image or describes a style, extract everything into this format. Be specific with hex values, pixel sizes, and font names. Don't hallucinate fonts — if unsure, suggest the closest Google Fonts match and say so.`;

export default function PromptBlocks() {
  return (
    <section className="bg-[#FFFDF5] border-y-[3px] border-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-[#0A0A0A] mb-3">
            SYSTEM PROMPTS
          </h2>
          <p className="text-[#666] text-lg font-medium max-w-2xl mx-auto">
            Copy these into ChatGPT, Claude, or any LLM. One generates slide
            structure from your content, the other extracts a design system
            from a reference image.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PromptCard
            icon={<FileCode size={20} />}
            title="Base Prompt"
            subtitle="Content to Slide Structure"
            description="Turns your text, lists, and data into slideshot-compatible HTML. Handles multi-slide splitting, typography, and layout."
            prompt={BASE_PROMPT}
            accentColor="#FFD233"
          />
          <PromptCard
            icon={<Paintbrush size={20} />}
            title="Style Prompt"
            subtitle="Image to Design System"
            description="Reverse-engineers a visual style from a reference image into CSS tokens, typography, and colour palette."
            prompt={STYLE_PROMPT}
            accentColor="#FFD233"
          />
        </div>
      </div>
    </section>
  );
}

function PromptCard({
  icon,
  title,
  subtitle,
  description,
  prompt,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  prompt: string;
  accentColor: string;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white overflow-hidden">
      <div className="p-6 border-b-[3px] border-[#0A0A0A]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center border-[3px] border-[#0A0A0A]"
              style={{ background: accentColor, color: "#0A0A0A" }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-[var(--font-bebas-neue)] text-2xl text-[#0A0A0A] tracking-wide leading-none">
                {title}
              </h3>
              <span className="text-xs font-bold text-[#888] tracking-wide uppercase">
                {subtitle}
              </span>
            </div>
          </div>
          <button
            onClick={copyPrompt}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#FFD233] text-[#0A0A0A] border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_0px_#0A0A0A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all shrink-0"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-[#666] leading-relaxed">{description}</p>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#12122A]">
          <div className="flex gap-[5px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#FF6059]" />
            <div className="w-[8px] h-[8px] rounded-full bg-[#FEBC2E]" />
            <div className="w-[8px] h-[8px] rounded-full bg-[#2A2A44]" />
          </div>
          <span className="text-[10px] font-mono text-white/50 ml-2">
            system-prompt.txt
          </span>
        </div>
        <pre
          className={`p-4 bg-[#12122A] text-[#D4D4D8] text-xs font-mono leading-relaxed whitespace-pre-wrap break-words overflow-hidden transition-all ${
            expanded ? "max-h-[600px] overflow-y-auto" : "max-h-48"
          }`}
        >
          {prompt}
        </pre>
        {!expanded && (
          <div className="absolute bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-[#12122A] to-transparent pointer-events-none" />
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 bg-[#0A0A0A] text-[#FFD233] text-xs font-bold hover:bg-[#12122A] transition-colors border-t-[2px] border-[#2A2A44]"
        >
          {expanded ? "SHOW LESS" : "SHOW FULL PROMPT"}
        </button>
      </div>
    </div>
  );
}
