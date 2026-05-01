Generate Instagram/LinkedIn carousel slides — "Terminal Editorial" DNA. {{SLIDE_DIMS}}px, Inter + JetBrains Mono, warm-cream `#F5F0EA` with rust-orange `#C4562A` accents on deep-brown `#2A2018` ink. Circuit-board grid background, terminal cards, oversized 900-weight giant headlines.

Slides: 1.Cover/Hook 2.Problem 3.Cost/Stakes 4.Mental Model 5.Concept Breakdown 6.The Fix 7.How It Works 8.Comparison 9-N.Numbered Steps N+1.Result/Bonus N+2.CTA

CSS:
```
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start}

.slide{position:relative;width:{{SLIDE_W}}px;height:{{SLIDE_H}}px;overflow:hidden;font-family:'Inter',sans-serif;flex-shrink:0;background:#F5F0EA;padding:0}
.slide::before{content:'';position:absolute;inset:0;z-index:0;opacity:.12;pointer-events:none;background:linear-gradient(90deg,#C4A882 1px,transparent 1px),linear-gradient(0deg,#C4A882 1px,transparent 1px);background-size:60px 60px}
.slide::after{content:'';position:absolute;z-index:0;pointer-events:none;top:30px;right:40px;width:180px;height:120px;opacity:.08;border:1px solid #C4A882;border-top:none;border-left:none}
.slide-inner{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;padding:28px 36px 20px}

.top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-shrink:0}
.handle{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:2px;color:#2A2018;text-transform:uppercase;opacity:.5}
.page-ct{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1px;color:#2A2018;opacity:.4}

.section-label{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:5px;color:#C4562A;text-transform:uppercase;margin-bottom:8px;flex-shrink:0}

.giant{font-family:'Inter',sans-serif;font-weight:900;font-size:62px;line-height:.92;letter-spacing:-2px;color:#2A2018;margin-bottom:16px;flex-shrink:0}
.giant .accent{color:#C4562A}
.giant.sz-lg{font-size:72px}.giant.sz-md{font-size:56px}.giant.sz-sm{font-size:48px}

.body-text{font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:500;line-height:1.55;color:#2A2018;text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px;flex-shrink:0}

.label-row{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-shrink:0}
.label-asterisk{font-size:16px;color:#C4562A;font-weight:700;line-height:1}
.label-text{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#C4562A;font-style:italic}

.terminal{background:#2A2018;border-radius:12px;overflow:hidden;flex-shrink:0;position:relative}
.terminal-bar{display:flex;align-items:center;gap:6px;padding:10px 14px 0}
.tdot{width:10px;height:10px;border-radius:50%}.tdot-r{background:#FF6059}.tdot-y{background:#FEBC2E}.tdot-g{background:#28CA42}
.terminal-body{padding:12px 18px 16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#D4C4B0;line-height:1.65}
.terminal-body .cmd{font-weight:700;color:#F0E8DD}.terminal-body .prompt{color:#C4562A;font-weight:700}
.terminal-body .arrow{color:#888;margin-right:4px}.terminal-body .check{color:#28CA42;font-weight:700}.terminal-body .dim{opacity:.6}

.watermark{text-align:center;margin-top:auto;padding-top:10px;flex-shrink:0}
.watermark-text{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:3px;color:#2A2018;opacity:.2;text-transform:uppercase}
.bottom-bar{display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-shrink:0}

.spacer{flex:1;min-height:0}

.stat-line{display:flex;align-items:baseline;gap:10px;padding:6px 0;border-bottom:1px solid rgba(42,32,24,.08)}
.stat-line:last-child{border-bottom:none}
.stat-num{font-family:'Inter',sans-serif;font-weight:900;font-size:28px;color:#C4562A;flex-shrink:0;min-width:70px}
.stat-desc{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.3px;line-height:1.4}

.os-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:6px;margin-bottom:12px}
.os-col{display:flex;flex-direction:column;gap:5px}
.os-col-head{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888;text-align:center}
.os-cell{border-radius:6px;padding:7px 8px;text-align:center}
.os-cell-name{font-size:10px;font-weight:800;margin-bottom:1px}
.os-cell-desc{font-size:7.5px;opacity:.7}
.os-eq-col{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-top:14px}
.os-eq{font-size:18px;font-weight:900;color:#C4562A}

.mem-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;margin-bottom:4px}
.mem-icon{font-size:16px;flex-shrink:0}
.mem-name{font-size:10px;font-weight:800;margin-bottom:1px}
.mem-desc{font-size:7.5px;line-height:1.35;opacity:.8}
.mem-tag{margin-left:auto;font-size:7px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;letter-spacing:.5px}

.ops-row{display:flex;gap:8px;margin-bottom:8px}
.ops-card{flex:1;border-radius:8px;padding:10px 8px;text-align:center;border:1.5px solid}
.ops-card-icon{font-size:18px;margin-bottom:3px}
.ops-card-name{font-size:10px;font-weight:800;margin-bottom:2px}
.ops-card-desc{font-size:7.5px;line-height:1.35}

.tbar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.tbar-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;width:34px;text-align:right;flex-shrink:0}
.tbar-track{flex:1;height:22px;border-radius:4px;background:rgba(42,32,24,.06);overflow:hidden}
.tbar-fill{height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px}
.tbar-pct{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:800;color:#fff;white-space:nowrap}

.stack-layer{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1.5px solid #2A2018;border-bottom:none}
.stack-layer:first-child{border-radius:8px 8px 0 0}
.stack-layer:last-child{border-bottom:1.5px solid #2A2018;border-radius:0 0 8px 8px}
.stack-num{font-family:'Inter',sans-serif;font-weight:900;font-size:22px;color:#C4562A;width:20px;flex-shrink:0}
.stack-name{font-size:10px;font-weight:800;color:#2A2018}
.stack-desc{font-size:7.5px;color:#888;line-height:1.3}
.stack-tag{margin-left:auto;font-size:6.5px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;letter-spacing:.5px;text-transform:uppercase}

.footnote{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;color:#2A2018;opacity:.45;font-style:italic;line-height:1.4;margin-top:4px;flex-shrink:0}

.cta-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.cta-giant{font-family:'Inter',sans-serif;font-weight:900;font-size:68px;line-height:.92;letter-spacing:-2px;color:#2A2018;margin-bottom:16px}
.cta-giant .accent{color:#C4562A}
.cta-body{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.5px;line-height:1.6;max-width:380px;margin-bottom:24px;text-align:center}
.cta-btn{display:inline-block;border:2px solid #C4562A;border-radius:8px;padding:14px 36px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;letter-spacing:4px;color:#C4562A;text-transform:uppercase;margin-bottom:16px}
.cta-follow{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:#2A2018;text-transform:uppercase;letter-spacing:1px}
.cta-follow .accent{color:#C4562A}
```

Slide skeleton (each slide):
```
<div class="slide"><div class="slide-inner">
  <div class="top-bar"><div class="handle">@your-handle</div><div class="page-ct">01 / N</div></div>
  <div class="section-label">Section Name</div>
  <div class="giant sz-lg">HEADLINE<br><span class="accent">PUNCH LINE</span></div>
  <div class="body-text">Mono uppercase body. 1-2 sentences. Plain language.</div>
  <div class="label-row"><div class="label-asterisk">*</div><div class="label-text">Optional cue:</div></div>
  <div class="terminal">
    <div class="terminal-bar"><div class="tdot tdot-r"></div><div class="tdot tdot-y"></div><div class="tdot tdot-g"></div></div>
    <div class="terminal-body">
      <span class="prompt">$ </span><span class="cmd">command</span><br>
      <span class="arrow">&rarr;</span> result line<br>
      <span class="check">&check;</span> success line
    </div>
  </div>
  <div class="watermark"><div class="watermark-text">@your-handle</div></div>
  <div class="bottom-bar"></div>
</div></div>
```

Rules:
- Pick `sz-lg` (72px) for cover/numbered steps, `sz-md` (56px) for concept slides, `sz-sm` (48px) when headline has 3+ lines
- Always wrap punch words in `<span class="accent">` (rust-orange) for visual rhythm
- Body text is JetBrains Mono, UPPERCASE, max 2 short sentences
- Most slides should include a terminal card — the terminal IS the brand. Use `$` prompt, `→` arrows, `✓` check for steady visual cadence
- For data slides swap terminal for `stat-line` rows, `os-grid`, `mem-row` blocks, `ops-row` cards, `tbar-row` token bars, or `stack-layer` rows
- Soft palette for content blocks: `#F0EEFF/#5540AA` (purple), `#E0F5EE/#006644` (green), `#FFF5E0/#885500` (amber), `#FFE8E8/#AA3333` (red), `#E8F0F8/#2255AA` (blue)
- Final slide: replace headline+body with `cta-center` block. Drop the watermark.

Font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">`
