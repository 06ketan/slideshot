#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { renderSlides, launchBrowser, type ImageFormat } from "slideshot";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ---------------------------------------------------------------------------
// Prompt constants
// ---------------------------------------------------------------------------

const GENERIC_PROMPT = `You are generating HTML slides for a visual carousel (LinkedIn, Instagram, presentations).

RULES:
1. Create a single HTML file with a <style> block and a <body> containing multiple slide divs.
2. Each slide MUST use the CSS class ".slide" and have fixed dimensions: width: 540px; height: 675px.
3. Use overflow: hidden on each slide — content must fit within the frame.
4. Use Google Fonts via <link> tags in <head> if you need custom fonts.
5. Each slide must be visually self-contained — no JavaScript required.
6. Use print-safe colors (avoid transparency-only effects).
7. Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; padding: 48px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start; }
    .slide { position: relative; width: 540px; height: 675px; padding: 32px 40px; overflow: hidden; font-family: 'Inter', sans-serif; flex-shrink: 0; }
    /* your custom styles here */
  </style>
</head>
<body>
  <div class="slide"> <!-- Slide 1 --> </div>
  <div class="slide"> <!-- Slide 2 --> </div>
</body>
</html>
\`\`\`

The tool will screenshot each .slide element at 4x resolution for crisp output.`;

const BRANDED_PROMPT = `You are generating HTML slides using the "Ketan Slides" design system — a minimal, monospace carousel style.

DESIGN SYSTEM RULES:
1. Font: 'Space Mono' monospace via Google Fonts.
2. Slide base: .slide { width: 540px; height: 675px; background: #F0EDE7; padding: 32px 40px 52px; }
3. Dark variant: .slide.dark { background: #0D0D0D; } — inverts text/border colors.
4. Corner accents: ::before (top-right 80px) and ::after (bottom-left 60px) border decorations.
5. Colors: teal=#00B894, coral=#E84C1E, purple=#7C5CBF, neutral=#1A1A1A, muted=#888, bg=#F0EDE7.

AVAILABLE COMPONENTS (use these CSS classes):
- .dots + .dot / .dot.on / .dot.tl — slide position indicator (row of circles)
- .btag + .bdot + .btxt + .burl — brand tag pill
- .h1 / .h2 — headlines (<i> for teal italic accent, <s> for muted strikethrough-removed text)
- .lbl — uppercase label
- .ft + .ft-l + .ft-pl + .ft-h + .ft-sw — slide footer
- .scols + .sc + .sn + .sb + .sk + .sd — stat cards grid (3-col)
- .itrow + .it + .ic + .il — icon tile grid (4-col), colors: .gray .coral .teal .purple
- .ul + .ur + .un + .um + .us + .utg — use-case list rows with tags
- .br + .bl + .bt + .bf + .bv — horizontal bar chart
- .cg + .cc + .cbad + .cgood + .ct + .ci + .cil + .cid — comparison grid (dark)
- .hg + .hc + .hev + .htr + .hac + .hds — hook/event cards (2-col)
- .cr + .ck + .cv — code/config rows
- .al + .ai + .an + .at + .as — action list (CTA slide)
- .mg + .mc + .mn + .mk + .md + .mv — metric grid (2-col)
- .hr — horizontal rule
- .pnote — provider note
- .lrow + .lchip — link chips

FULL CSS (include this in your <style> block):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1A1A1A;padding:48px;font-family:'Space Mono',monospace;display:flex;flex-direction:column;align-items:flex-start;gap:40px;}
.slide{position:relative;width:540px;height:675px;background:#F0EDE7;padding:32px 40px 52px;overflow:hidden;font-family:'Space Mono',monospace;flex-shrink:0;}
.slide::before{content:'';position:absolute;top:24px;right:24px;width:80px;height:80px;border-top:1px solid #B8B4AD;border-right:1px solid #B8B4AD;pointer-events:none;}
.slide::after{content:'';position:absolute;bottom:24px;left:24px;width:60px;height:60px;border-bottom:1px solid #B8B4AD;border-left:1px solid #B8B4AD;pointer-events:none;}
.dark{background:#0D0D0D;}.dark::before{border-color:#252525;}.dark::after{border-color:#252525;}
.dots{display:flex;gap:5px;margin-bottom:18px;}.dot{width:17px;height:17px;border-radius:50%;background:#C8C4BC;display:flex;align-items:center;justify-content:center;font-size:6.5px;font-weight:700;color:transparent;}.dot.on{background:#1A1A1A;color:#FFF;}.dot.tl{background:#00B894;color:#FFF;}
.ft{position:absolute;bottom:0;left:0;right:0;padding:0px 24px 8px;display:flex;justify-content:space-between;align-items:flex-end;}.ft-l{display:flex;flex-direction:row;gap:1px;}.ft-pl{font-size:8.5px;color:#888;letter-spacing:.12em;text-transform:uppercase;}.ft-h{font-size:8.5px;font-weight:700;color:#1A1A1A;}.ft-sw{font-size:8.5px;color:#888;}.dark .ft-h{color:#FFF;}.dark .ft-pl,.dark .ft-sw{color:#444;}
.btag{display:inline-flex;align-items:center;gap:7px;background:#1A1A1A;border-radius:100px;padding:5px 12px 5px 8px;margin-bottom:16px;}.bdot{width:8px;height:8px;background:#E84C1E;border-radius:50%;}.btxt{font-size:8.5px;font-weight:700;color:#FFF;letter-spacing:.12em;text-transform:uppercase;}.burl{font-size:8.5px;color:#555;}
.h1{font-size:72px;font-weight:700;line-height:1.0;margin-bottom:18px;color:#1A1A1A;letter-spacing:-.02em;}.h1 i{color:#00B894;font-style:italic;}.h1 s{color:#C0BCB5;text-decoration:none;}.dark .h1{color:#F0EDE7;}
.h2{font-size:46px;font-weight:700;line-height:1.05;margin-bottom:14px;letter-spacing:-.02em;color:#1A1A1A;}.h2 i{color:#00B894;font-style:italic;}.h2 s{color:#C0BCB5;text-decoration:none;}.dark .h2{color:#F0EDE7;}
.lbl{font-size:10px;color:#888;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;}.dark .lbl{color:#444;}
.scols{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:13px;}.sc{background:#FFF;border:.5px solid #DEDAD4;border-radius:6px;padding:11px 10px;}.sn{font-size:24px;font-weight:700;line-height:1;}.sb{width:24px;height:2px;background:#1A1A1A;margin:5px 0;}.sk{font-size:8px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:.1em;}.sd{font-size:7.5px;color:#888;margin-top:2px;}
.itrow{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:4px;}.it{border-radius:8px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:54px;}.it .ic{font-size:20px;}.it .il{font-size:7px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-align:center;color:#1A1A1A;}.gray{background:#E8E5DF;}.coral{background:#FDECEA;}.teal{background:#E0F5F0;}.purple{background:#EDE8F5;}
.ul{list-style:none;}.ur{display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:.5px solid #DEDAD4;}.ur:last-child{border-bottom:none;}.un{font-size:10px;color:#AAA;min-width:16px;}.um{font-size:10.5px;color:#1A1A1A;flex:1;font-weight:700;}.us{font-size:8.5px;color:#888;display:block;font-weight:400;margin-top:2px;}.utg{font-size:7.5px;color:#888;background:#F5F3EE;border:.5px solid #DEDAD4;border-radius:4px;padding:2px 6px;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;}
.br{display:flex;align-items:center;gap:10px;margin-bottom:9px;}.bl{font-size:8.5px;color:#1A1A1A;text-align:right;width:130px;min-width:130px;}.bt{flex:1;height:20px;background:#E8E5DF;border-radius:2px;overflow:hidden;}.bf{height:100%;border-radius:2px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;}.bv{font-size:8.5px;font-weight:700;color:#FFF;}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;}.cc{padding:14px;border-radius:6px;}.cbad{background:#161616;border:.5px solid #2A2A2A;}.cgood{background:#0A1A14;border:.5px solid #00B894;}.ct{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;}.cbad .ct{color:#444;}.cgood .ct{color:#00B894;}.ci{margin-bottom:9px;}.cil{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;display:block;}.cid{font-size:8px;margin-top:2px;}.cbad .cil{color:#444;}.cbad .cid{color:#333;}.cgood .cil{color:#00B894;}.cgood .cid{color:#556;}
.hg{display:grid;grid-template-columns:1fr 1fr;gap:8px;}.hc{background:#FFF;border:.5px solid #DEDAD4;border-radius:6px;padding:13px;}.hev{font-size:7.5px;color:#888;letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px;}.htr{font-size:9.5px;font-weight:700;color:#1A1A1A;margin-bottom:4px;}.hac{font-size:8px;color:#7C5CBF;}.hds{font-size:8px;color:#888;margin-top:3px;}
.cr{display:flex;gap:12px;padding:9px 0;border-bottom:.5px solid #DEDAD4;}.cr:last-child{border-bottom:none;}.ck{font-size:9.5px;font-weight:700;color:#00B894;min-width:155px;}.cv{font-size:8.5px;color:#888;flex:1;}
.al{list-style:none;}.ai{display:flex;gap:12px;padding:10px 0;border-bottom:.5px solid #DEDAD4;}.ai:last-child{border-bottom:none;}.an{font-size:10px;font-weight:700;color:#C0BCB5;min-width:18px;}.at{font-size:10.5px;font-weight:700;color:#1A1A1A;}.as{font-size:8.5px;color:#888;display:block;font-weight:400;margin-top:2px;}
.mg{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;}.mc{background:#FFF;border:.5px solid #DEDAD4;border-radius:6px;padding:14px;}.mn{font-size:36px;font-weight:700;line-height:1;}.mk{font-size:9px;font-weight:700;color:#1A1A1A;text-transform:uppercase;margin-top:6px;letter-spacing:.08em;}.md{font-size:8px;color:#888;margin-top:2px;}.mv{font-size:7.5px;color:#C8C4BC;letter-spacing:.12em;text-transform:uppercase;margin-top:8px;}
.hr{width:100%;height:.5px;background:#C8C4BC;margin:13px 0;}
.pnote{margin-top:10px;padding-top:8px;border-top:.5px solid #DEDAD4;font-size:8.5px;color:#888;}.pnote strong{color:#1A1A1A;font-weight:700;}
.lrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px;}.lchip{font-size:7.5px;color:#00B894;border:.5px solid #00B894;border-radius:4px;padding:3px 7px;letter-spacing:.04em;}
.slide-meta{font-size:10px;color:#555;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;}
\`\`\`

Include this <link> in <head>:
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

The tool will screenshot each .slide at 4x for 2160x2700 px output.`;

const INSTAGRAM_CAROUSEL_PROMPT = `You are generating HTML slides for an Instagram carousel post — bold, vibrant, swipe-friendly.

DESIGN RULES:
1. Font: 'Poppins' (headings 700) + 'Montserrat' (body 400/600) via Google Fonts.
2. Slide: .slide { width: 540px; height: 675px; border-radius: 0; overflow: hidden; }
3. Use bold gradient backgrounds (purple-to-pink, blue-to-teal, orange-to-yellow, etc.).
4. Large punchy text — max 15-20 words per slide. Headlines 48-64px, body 18-22px.
5. Rounded pill buttons for CTAs: border-radius: 50px, bold colors.
6. Swipe indicator dots at bottom of each slide.
7. High contrast: white text on dark/gradient, dark text on light.
8. Emojis welcome for engagement.

COLOR PALETTE:
- Primary: #6C5CE7 (electric purple)
- Secondary: #FD79A8 (hot pink)
- Accent: #00CEC9 (cyan), #FDCB6E (gold)
- Dark: #2D3436
- Light: #FFEAA7, #DFE6E9

COMPONENT CLASSES:
- .swipe-dots + .sdot / .sdot.active — bottom-center dot indicator
- .pill — rounded CTA button
- .gradient-purple, .gradient-pink, .gradient-blue, .gradient-sunset — preset backgrounds
- .card — white rounded card overlay (border-radius: 16px, padding: 24px)
- .stat-big — large stat number (56px bold)
- .stat-label — stat description (12px uppercase)
- .emoji-row — flex row of large emojis
- .quote — styled blockquote with left accent bar
- .tag — small rounded tag pill

CSS (include in <style>):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}
.slide{position:relative;width:540px;height:675px;padding:40px 36px;overflow:hidden;font-family:'Poppins',sans-serif;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;}
.gradient-purple{background:linear-gradient(135deg,#6C5CE7 0%,#a29bfe 50%,#FD79A8 100%);}
.gradient-pink{background:linear-gradient(135deg,#FD79A8 0%,#fab1c4 50%,#FDCB6E 100%);}
.gradient-blue{background:linear-gradient(135deg,#0984e3 0%,#00CEC9 100%);}
.gradient-sunset{background:linear-gradient(135deg,#e17055 0%,#FDCB6E 100%);}
.slide h1{font-size:52px;font-weight:700;line-height:1.1;color:#FFF;margin-bottom:16px;font-family:'Poppins',sans-serif;}
.slide h2{font-size:36px;font-weight:700;line-height:1.15;color:#FFF;margin-bottom:12px;font-family:'Poppins',sans-serif;}
.slide p{font-size:18px;line-height:1.5;color:rgba(255,255,255,.9);font-family:'Montserrat',sans-serif;margin-bottom:16px;}
.pill{display:inline-block;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;border:none;cursor:pointer;}
.pill-white{background:#FFF;color:#6C5CE7;}.pill-dark{background:#2D3436;color:#FFF;}
.card{background:#FFF;border-radius:16px;padding:24px;margin:12px 0;color:#2D3436;}
.stat-big{font-size:56px;font-weight:700;line-height:1;font-family:'Poppins',sans-serif;}
.stat-label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-top:6px;opacity:.7;}
.emoji-row{display:flex;gap:12px;font-size:32px;margin:12px 0;}
.quote{border-left:4px solid #FDCB6E;padding-left:20px;font-size:20px;font-style:italic;line-height:1.4;color:#FFF;margin:16px 0;}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;background:rgba(255,255,255,.2);color:#FFF;margin:4px 4px 4px 0;}
.swipe-dots{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:6px;}.sdot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.4);}.sdot.active{background:#FFF;width:24px;border-radius:4px;}
.light-slide{background:#FFEAA7;}.light-slide h1,.light-slide h2,.light-slide p{color:#2D3436;}
\`\`\`

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">

SLIDE FLOW (recommended 5-7 slides):
1. Hook — bold question or provocative statement
2. Problem — relatable pain point
3. Solution/Insight — the core value
4. Evidence — stats, quotes, or examples
5. Steps/Tips — actionable takeaways
6. CTA — follow/save/share prompt`;

const INFOGRAPHIC_PROMPT = `You are generating HTML slides in an infographic style — data-heavy, structured, icon-rich.

DESIGN RULES:
1. Font: 'DM Sans' (headings 700) + 'Inter' (body 400) via Google Fonts.
2. Slide: .slide { width: 540px; height: 675px; background: #FFFFFF; }
3. Clean grid layouts, generous whitespace.
4. Heavy use of icons (emoji or Unicode), stat callouts, progress bars.
5. Section headers with colored left borders or top accent bars.
6. Muted professional palette with one bright accent.

COLOR PALETTE:
- Primary: #2563EB (blue)
- Secondary: #10B981 (emerald)
- Accent: #F59E0B (amber)
- Alert: #EF4444 (red)
- Dark: #1E293B (slate-900)
- Muted: #64748B (slate-500)
- BG: #F8FAFC (slate-50)
- Card BG: #FFFFFF

COMPONENT CLASSES:
- .section-header — left-bordered section title
- .stat-card — white card with colored top border, large number, label, sublabel
- .stat-row — flex row of stat cards
- .progress-bar + .progress-fill — horizontal progress indicator
- .icon-grid — 2x2 or 3x2 grid of icon+label cells
- .icon-cell — single icon+label
- .data-table — simple 2-col key-value table
- .callout — colored left-border callout box
- .badge — small rounded badge
- .divider — subtle horizontal line
- .numbered-list — ordered list with large colored numbers
- .flow-row — horizontal flow with arrow connectors
- .flow-step — single step in a flow

CSS (include in <style>):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}
.slide{position:relative;width:540px;height:675px;padding:36px 32px;overflow:hidden;font-family:'DM Sans',sans-serif;flex-shrink:0;background:#F8FAFC;color:#1E293B;}
.slide h1{font-size:32px;font-weight:700;line-height:1.15;margin-bottom:8px;color:#1E293B;}
.slide h2{font-size:22px;font-weight:700;line-height:1.2;margin-bottom:6px;color:#1E293B;}
.slide p{font-size:13px;line-height:1.5;color:#64748B;font-family:'Inter',sans-serif;margin-bottom:12px;}
.section-header{border-left:3px solid #2563EB;padding-left:12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#2563EB;margin-bottom:14px;}
.stat-card{background:#FFF;border-radius:10px;padding:16px;border-top:3px solid #2563EB;}.stat-card .num{font-size:36px;font-weight:700;line-height:1;color:#2563EB;}.stat-card .label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#1E293B;margin-top:6px;}.stat-card .sub{font-size:10px;color:#64748B;margin-top:2px;}
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
.progress-bar{height:10px;background:#E2E8F0;border-radius:5px;overflow:hidden;margin:6px 0;}.progress-fill{height:100%;border-radius:5px;}
.fill-blue{background:#2563EB;}.fill-green{background:#10B981;}.fill-amber{background:#F59E0B;}.fill-red{background:#EF4444;}
.icon-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0;}.icon-cell{background:#FFF;border:1px solid #E2E8F0;border-radius:8px;padding:14px 10px;text-align:center;}.icon-cell .ico{font-size:24px;margin-bottom:6px;}.icon-cell .itxt{font-size:10px;font-weight:600;color:#1E293B;}
.data-table{width:100%;margin:10px 0;}.data-table .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:12px;}.data-table .row:last-child{border-bottom:none;}.data-table .key{color:#64748B;}.data-table .val{font-weight:700;color:#1E293B;}
.callout{background:#EFF6FF;border-left:3px solid #2563EB;border-radius:0 8px 8px 0;padding:12px 14px;margin:10px 0;font-size:12px;color:#1E293B;}
.callout-green{background:#ECFDF5;border-color:#10B981;}.callout-amber{background:#FFFBEB;border-color:#F59E0B;}.callout-red{background:#FEF2F2;border-color:#EF4444;}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}.badge-blue{background:#DBEAFE;color:#2563EB;}.badge-green{background:#D1FAE5;color:#059669;}.badge-amber{background:#FEF3C7;color:#D97706;}
.divider{width:100%;height:1px;background:#E2E8F0;margin:14px 0;}
.numbered-list{list-style:none;counter-reset:nl;}.numbered-list li{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px;align-items:flex-start;}.numbered-list li::before{counter-increment:nl;content:counter(nl);background:#2563EB;color:#FFF;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.flow-row{display:flex;align-items:center;gap:0;margin:12px 0;}.flow-step{flex:1;text-align:center;padding:10px 6px;background:#FFF;border:1px solid #E2E8F0;border-radius:8px;font-size:10px;font-weight:600;}.flow-arrow{font-size:16px;color:#2563EB;padding:0 4px;}
.slide-num{position:absolute;top:20px;right:24px;font-size:10px;font-weight:700;color:#CBD5E1;}
\`\`\`

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">`;

const PITCH_DECK_PROMPT = `You are generating HTML slides for a professional pitch deck — clean, modern, presentation-grade.

DESIGN RULES:
1. Font: 'DM Sans' (headings 500/700) via Google Fonts.
2. Slide: .slide { width: 540px; height: 675px; background: #FFFFFF; }
3. Minimal design — lots of whitespace, subtle shadows.
4. Subtle gradient accent bar at top of hero slides.
5. Professional tone: no emojis, clean data presentation.
6. Consistent slide numbering bottom-right.

COLOR PALETTE:
- Primary: #0F172A (slate-900)
- Accent: #3B82F6 (blue-500)
- Accent2: #8B5CF6 (violet-500)
- Success: #22C55E
- Muted: #94A3B8 (slate-400)
- Border: #E2E8F0
- BG: #FFFFFF
- Alt BG: #F1F5F9

COMPONENT CLASSES:
- .accent-bar — top gradient bar (blue→violet)
- .kpi-grid — 2-col grid of KPI cards
- .kpi — single KPI: number + label + trend
- .timeline — vertical timeline with dots
- .tl-item — timeline entry
- .team-grid — 2x2 grid for team members
- .team-card — avatar placeholder + name + role
- .feature-list — clean feature rows with check icons
- .feature — single feature row
- .logo-grid — grid for partner/client logos
- .section-label — muted uppercase label
- .slide-number — bottom-right page number

CSS (include in <style>):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}
.slide{position:relative;width:540px;height:675px;padding:40px 36px;overflow:hidden;font-family:'DM Sans',sans-serif;flex-shrink:0;background:#FFF;color:#0F172A;}
.slide h1{font-size:38px;font-weight:700;line-height:1.1;margin-bottom:12px;}.slide h2{font-size:26px;font-weight:700;line-height:1.2;margin-bottom:10px;}.slide h3{font-size:18px;font-weight:500;line-height:1.3;margin-bottom:8px;color:#475569;}
.slide p{font-size:14px;line-height:1.6;color:#64748B;margin-bottom:14px;}
.accent-bar{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#3B82F6,#8B5CF6);}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#94A3B8;margin-bottom:16px;}
.kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0;}.kpi{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:18px;}.kpi .num{font-size:32px;font-weight:700;color:#3B82F6;line-height:1;}.kpi .label{font-size:12px;font-weight:500;color:#475569;margin-top:6px;}.kpi .trend{font-size:11px;color:#22C55E;margin-top:4px;}
.timeline{position:relative;padding-left:24px;border-left:2px solid #E2E8F0;margin:12px 0;}.tl-item{position:relative;padding:10px 0 10px 16px;}.tl-item::before{content:'';position:absolute;left:-29px;top:14px;width:10px;height:10px;border-radius:50%;background:#3B82F6;border:2px solid #FFF;}
.tl-item .year{font-size:11px;font-weight:700;color:#3B82F6;}.tl-item .desc{font-size:13px;color:#475569;margin-top:2px;}
.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}.team-card{text-align:center;padding:16px;background:#F8FAFC;border-radius:12px;}.team-card .avatar{width:48px;height:48px;border-radius:50%;background:#E2E8F0;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#94A3B8;}.team-card .name{font-size:14px;font-weight:700;}.team-card .role{font-size:11px;color:#94A3B8;margin-top:2px;}
.feature-list{margin:12px 0;}.feature{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #F1F5F9;align-items:flex-start;}.feature:last-child{border-bottom:none;}.feature .check{color:#22C55E;font-size:16px;flex-shrink:0;}.feature .ftxt{font-size:13px;color:#334155;}.feature .fsub{font-size:11px;color:#94A3B8;display:block;margin-top:2px;}
.logo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0;}.logo-cell{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px;text-align:center;font-size:11px;font-weight:600;color:#94A3B8;min-height:60px;display:flex;align-items:center;justify-content:center;}
.slide-number{position:absolute;bottom:16px;right:24px;font-size:11px;font-weight:500;color:#CBD5E1;}
\`\`\`

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">

RECOMMENDED DECK FLOW:
1. Title/Hook slide
2. Problem slide
3. Solution slide
4. How it works (3-4 steps)
5. Key metrics/KPIs
6. Traction/Timeline
7. Team
8. CTA`;

const DARK_MODERN_PROMPT = `You are generating HTML slides with a dark modern aesthetic — tech-forward, neon accents, glassmorphism.

DESIGN RULES:
1. Font: 'Inter' (400/600/700) via Google Fonts.
2. Slide: .slide { width: 540px; height: 675px; background: #0A0A0F; }
3. Dark backgrounds with subtle gradient glows.
4. Neon accent colors: cyan and magenta.
5. Glassmorphism cards: semi-transparent backgrounds with blur.
6. Subtle grid/dot patterns as background texture.
7. Monospace code snippets where relevant.

COLOR PALETTE:
- BG: #0A0A0F
- Surface: #12121A
- Card: rgba(255,255,255,0.05)
- Border: rgba(255,255,255,0.08)
- Text: #E2E8F0
- Muted: #64748B
- Cyan: #22D3EE
- Magenta: #E879F9
- Green: #34D399
- Amber: #FBBF24

COMPONENT CLASSES:
- .glass — glassmorphism card
- .glow-cyan, .glow-magenta — subtle glow shadows
- .neon-text — cyan colored text
- .code-block — monospace code snippet container
- .metric-row — horizontal metric display
- .metric — single metric with value + label
- .chip — small rounded chip/tag
- .grid-bg — subtle dot-grid background pattern
- .accent-line — thin gradient horizontal line
- .icon-box — rounded box with centered icon
- .step-grid — numbered step cards
- .step — single step card

CSS (include in <style>):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#050508;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}
.slide{position:relative;width:540px;height:675px;padding:40px 36px;overflow:hidden;font-family:'Inter',sans-serif;flex-shrink:0;background:#0A0A0F;color:#E2E8F0;}
.grid-bg{background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);background-size:20px 20px;}
.slide h1{font-size:42px;font-weight:700;line-height:1.1;margin-bottom:14px;}.slide h2{font-size:28px;font-weight:700;line-height:1.2;margin-bottom:10px;}
.slide p{font-size:14px;line-height:1.6;color:#94A3B8;margin-bottom:14px;}
.neon-text{color:#22D3EE;}.magenta-text{color:#E879F9;}
.glass{background:rgba(255,255,255,.05);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;margin:10px 0;}
.glow-cyan{box-shadow:0 0 30px rgba(34,211,238,.1);}.glow-magenta{box-shadow:0 0 30px rgba(232,121,249,.1);}
.accent-line{width:100%;height:2px;background:linear-gradient(90deg,#22D3EE,#E879F9);border-radius:1px;margin:16px 0;}
.code-block{background:#12121A;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:14px 16px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:11px;line-height:1.6;color:#94A3B8;margin:10px 0;overflow:hidden;white-space:pre-wrap;}
.code-block .kw{color:#E879F9;}.code-block .fn{color:#22D3EE;}.code-block .str{color:#34D399;}.code-block .cm{color:#475569;}
.metric-row{display:flex;gap:12px;margin:12px 0;}.metric{flex:1;text-align:center;padding:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;}.metric .val{font-size:28px;font-weight:700;color:#22D3EE;line-height:1;}.metric .mlabel{font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:.1em;margin-top:6px;}
.chip{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,.1);color:#94A3B8;margin:3px 3px 3px 0;}.chip-cyan{border-color:rgba(34,211,238,.3);color:#22D3EE;}.chip-magenta{border-color:rgba(232,121,249,.3);color:#E879F9;}
.icon-box{width:48px;height:48px;border-radius:12px;background:rgba(34,211,238,.1);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:10px;}
.step-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;}.step{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:16px;}.step .snum{font-size:28px;font-weight:700;color:rgba(34,211,238,.3);line-height:1;margin-bottom:6px;}.step .stitle{font-size:13px;font-weight:600;margin-bottom:4px;}.step .sdesc{font-size:11px;color:#64748B;}
.slide-tag{position:absolute;top:24px;right:24px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#475569;}
\`\`\`

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`;

const EDITORIAL_PROMPT = `You are generating HTML slides in a magazine/editorial style — elegant, serif-driven, sophisticated.

DESIGN RULES:
1. Fonts: 'Playfair Display' (headings 700/900) + 'Source Sans 3' (body 400/600) via Google Fonts.
2. Slide: .slide { width: 540px; height: 675px; background: #FAF8F5; }
3. Large serif headlines, generous line-height.
4. Earth-tone palette with a gold accent.
5. Editorial grid: asymmetric layouts welcome.
6. Thin hairline borders and dividers.
7. Pull quotes with oversized quotation marks.
8. Image placeholder blocks (solid color rectangles).

COLOR PALETTE:
- BG: #FAF8F5 (warm white)
- Dark BG: #1A1814 (warm black)
- Text: #2C2824
- Muted: #8C857C
- Accent: #C9963B (warm gold)
- Accent2: #6B4F36 (warm brown)
- Border: #DDD8D0
- Placeholder: #E8E3DC

COMPONENT CLASSES:
- .ed-hero — full-bleed hero with large headline
- .ed-label — uppercase section label with gold accent
- .ed-quote — pull quote with large quotation marks
- .ed-body — body text block
- .ed-img — image placeholder rectangle
- .ed-caption — small caption text below images
- .ed-cols — 2-column editorial grid
- .ed-col — single column
- .ed-divider — thin gold hairline
- .ed-footer — bottom-aligned attribution
- .ed-number — large decorative number
- .ed-dark — dark variant slide

CSS (include in <style>):
\`\`\`
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}
.slide{position:relative;width:540px;height:675px;padding:40px 36px;overflow:hidden;flex-shrink:0;background:#FAF8F5;color:#2C2824;font-family:'Source Sans 3',sans-serif;}
.ed-dark{background:#1A1814;color:#E8E3DC;}
.slide h1{font-family:'Playfair Display',serif;font-size:44px;font-weight:900;line-height:1.05;margin-bottom:14px;letter-spacing:-.02em;}
.slide h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;line-height:1.15;margin-bottom:10px;}
.slide h3{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;line-height:1.2;margin-bottom:8px;}
.slide p{font-size:13.5px;line-height:1.65;color:#5C564E;margin-bottom:12px;}.ed-dark p{color:#9C968E;}
.ed-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#C9963B;margin-bottom:18px;padding-bottom:8px;border-bottom:1px solid #C9963B;}
.ed-quote{position:relative;padding:20px 0 20px 24px;margin:16px 0;border-left:2px solid #C9963B;font-family:'Playfair Display',serif;font-size:20px;font-style:italic;line-height:1.4;color:#2C2824;}.ed-dark .ed-quote{color:#E8E3DC;}.ed-quote::before{content:'"';position:absolute;top:-8px;left:24px;font-size:64px;color:#C9963B;opacity:.3;font-family:'Playfair Display',serif;line-height:1;}
.ed-img{background:#E8E3DC;border-radius:4px;width:100%;min-height:120px;margin:12px 0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#8C857C;text-transform:uppercase;letter-spacing:.1em;}.ed-dark .ed-img{background:#2C2824;}
.ed-caption{font-size:10px;color:#8C857C;margin-top:-8px;margin-bottom:12px;font-style:italic;}
.ed-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:12px 0;}.ed-col{}
.ed-divider{width:100%;height:1px;background:#C9963B;margin:16px 0;opacity:.4;}
.ed-footer{position:absolute;bottom:20px;left:36px;right:36px;display:flex;justify-content:space-between;font-size:10px;color:#8C857C;text-transform:uppercase;letter-spacing:.1em;}
.ed-number{font-family:'Playfair Display',serif;font-size:80px;font-weight:900;color:#C9963B;opacity:.15;line-height:1;position:absolute;}
.ed-body{columns:2;column-gap:20px;font-size:12px;line-height:1.7;color:#5C564E;margin:10px 0;}.ed-dark .ed-body{color:#9C968E;}
.ed-tag{display:inline-block;padding:4px 10px;border:1px solid #DDD8D0;border-radius:2px;font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#8C857C;margin:3px 3px 3px 0;}.ed-dark .ed-tag{border-color:#3C3832;color:#6C665E;}
\`\`\`

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">`;

// ---------------------------------------------------------------------------
// Prompt lookup
// ---------------------------------------------------------------------------

type PromptVariant = "generic" | "branded" | "instagram-carousel" | "infographic" | "pitch-deck" | "dark-modern" | "editorial";

const PROMPTS: Record<PromptVariant, string> = {
  "generic": GENERIC_PROMPT,
  "branded": BRANDED_PROMPT,
  "instagram-carousel": INSTAGRAM_CAROUSEL_PROMPT,
  "infographic": INFOGRAPHIC_PROMPT,
  "pitch-deck": PITCH_DECK_PROMPT,
  "dark-modern": DARK_MODERN_PROMPT,
  "editorial": EDITORIAL_PROMPT,
};

const VERSION = "2.4.0";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultOutDir(): string {
  if (process.env.SLIDESHOT_OUTPUT_DIR) {
    return process.env.SLIDESHOT_OUTPUT_DIR;
  }

  const home = os.homedir();

  const desktop = path.join(home, "Desktop");
  if (fs.existsSync(desktop)) {
    return path.join(desktop, "slideshot-output");
  }

  const downloads = path.join(home, "Downloads");
  if (fs.existsSync(downloads)) {
    return path.join(downloads, "slideshot-output");
  }

  return path.join(os.tmpdir(), "slideshot-output");
}

function resolveFormats(formats?: ImageFormat[]): ImageFormat[] {
  if (!formats || formats.length === 0) return ["webp", "pdf"];
  return formats;
}

function formatSummary(files: string[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const f of files) {
    const ext = path.extname(f).replace(".", "");
    summary[ext] = (summary[ext] || 0) + 1;
  }
  return summary;
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "slideshot",
  version: VERSION,
});

server.tool(
  "render_html_to_images",
  "Render HTML slides to high-resolution PNG, WebP, and/or PDF files. Provide html string OR htmlPath (file path) — htmlPath is faster for large content. outDir defaults to ~/Desktop/slideshot-output.",
  {
    html: z.string().optional().describe("Full HTML string containing slide elements (use htmlPath for large content)"),
    htmlPath: z.string().optional().describe("Absolute path to an HTML file on disk — faster than passing html string for large slides"),
    selector: z.string().optional().describe("CSS selector for slide elements (default: .slide)"),
    width: z.number().optional().describe("Slide width in CSS pixels (default: 540)"),
    height: z.number().optional().describe("Slide height in CSS pixels (default: 675)"),
    scale: z.number().optional().describe("Device scale factor 1-6 (default: 4)"),
    formats: z.array(z.enum(["png", "webp", "pdf"])).optional().describe("Output formats (default: [webp, pdf])"),
    outDir: z.string().optional().describe("Absolute path to output directory (default: ~/Desktop/slideshot-output)"),
  },
  {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  async ({ html, htmlPath, selector, width, height, scale, formats, outDir }) => {
    try {
      if (!html && !htmlPath) {
        throw new Error("Provide either `html` (string) or `htmlPath` (absolute file path).");
      }

      let resolvedOutDir = outDir || defaultOutDir();
      let outDirFallback = false;
      const requestedOutDir = outDir || null;

      if (outDir) {
        try {
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        } catch {
          resolvedOutDir = defaultOutDir();
          outDirFallback = true;
          if (!fs.existsSync(resolvedOutDir)) fs.mkdirSync(resolvedOutDir, { recursive: true });
        }
      }

      const resolvedFormats = resolveFormats(formats as ImageFormat[] | undefined);

      let effectiveHtml = html;
      let effectiveHtmlPath = htmlPath;
      let htmlPathFallback = false;

      if (htmlPath && !fs.existsSync(htmlPath)) {
        if (html) {
          const tmpFile = path.join(os.tmpdir(), `slideshot-${Date.now()}.html`);
          fs.writeFileSync(tmpFile, html, "utf-8");
          effectiveHtmlPath = tmpFile;
          htmlPathFallback = true;
        } else {
          throw new Error(
            `htmlPath "${htmlPath}" is not accessible from the MCP server process. ` +
            `This often happens in sandboxed environments (e.g. Claude Code) where the MCP server ` +
            `runs in a separate filesystem context. Pass the HTML content via the \`html\` parameter instead.`,
          );
        }
      }

      const renderOpts: Record<string, unknown> = {
        selector,
        width,
        height,
        scale,
        formats: resolvedFormats,
        outDir: resolvedOutDir,
      };

      if (effectiveHtmlPath) {
        renderOpts.htmlPath = effectiveHtmlPath;
      } else {
        renderOpts.html = effectiveHtml;
      }

      const result = await renderSlides(renderOpts as any);

      if (htmlPathFallback && effectiveHtmlPath) {
        try { fs.unlinkSync(effectiveHtmlPath); } catch {}
      }

      const absOutDir = path.resolve(resolvedOutDir);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              slideCount: result.slideCount,
              outDir: absOutDir,
              openFolder: `file://${absOutDir}`,
              files: result.files,
              formatSummary: formatSummary(result.files),
              ...(outDirFallback && { outDirFallback: true, requestedOutDir }),
              ...(htmlPathFallback && { htmlPathFallback: true, note: "htmlPath was inaccessible; used html string via temp file" }),
            }, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: false, error: err.message }),
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "health_check",
  "Verify Puppeteer/Chromium can launch in this environment. Run this first to diagnose render failures.",
  {},
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  async () => {
    try {
      const browser = await launchBrowser();
      const version = await browser.version();
      await browser.close();
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            ok: true,
            serverVersion: VERSION,
            browser: version,
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            outDir: defaultOutDir(),
            pid: process.pid,
          }, null, 2),
        }],
      };
    } catch (err: any) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ ok: false, error: err.message, platform: process.platform }),
        }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_slide_prompt",
  "Get AI prompt template for generating slide HTML compatible with slideshot",
  {
    variant: z.enum(["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial"])
      .describe("'generic' = clean minimal, 'branded' = Ketan Slides, 'instagram-carousel' = bold vibrant IG style, 'infographic' = data-heavy charts, 'pitch-deck' = professional presentation, 'dark-modern' = neon glassmorphism, 'editorial' = magazine serif style"),
  },
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  async ({ variant }) => {
    const text = PROMPTS[variant as PromptVariant];
    return {
      content: [{ type: "text" as const, text }],
    };
  },
);

// Register all prompt variants
for (const [key, text] of Object.entries(PROMPTS)) {
  server.prompt(
    `${key}-slides`,
    `${key} slide HTML generation prompt`,
    () => ({
      messages: [
        { role: "user" as const, content: { type: "text" as const, text } },
      ],
    }),
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`slideshot MCP server v${VERSION} | node ${process.version} | ${process.platform}/${process.arch} | pid ${process.pid}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
