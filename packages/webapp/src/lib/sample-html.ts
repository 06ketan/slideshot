const SLIDE_BASE = `*{margin:0;padding:0;box-sizing:border-box}body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start}`;

export const SAMPLE_HTML: Record<string, string> = {

  // ─────────────────────────────────────────────────────
  // GENERIC — "Clean Minimal" — Product Launch Announcement
  // Colors: #FFFFFF, #1A1A1A, #F5F5F5, #E8E8E8
  // Font: Inter
  // ─────────────────────────────────────────────────────
  generic: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    CLEAN MINIMAL — PRODUCT LAUNCH
    ===================================================
    Colors:
      White:       #FFFFFF   — Slide background
      Black:       #1A1A1A   — Headlines, primary text
      Light Gray:  #F5F5F5   — Card backgrounds
      Mid Gray:    #E8E8E8   — Borders, dividers
      Body Copy:   #666666   — Paragraphs, descriptions
      Muted:       #999999   — Captions, footnotes

    Typography:
      Primary:  Inter (Google Fonts)
      Weights:  400, 500, 600, 700, 800

    Spacing:
      Slide padding: 48px
      Section gap:   24px
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #FFFFFF;
      padding: 48px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .tag {
      display: inline-block;
      background: #1A1A1A;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      padding: 5px 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 24px;
      width: fit-content;
    }

    .h1 {
      font-size: 52px;
      font-weight: 800;
      color: #1A1A1A;
      line-height: 1.05;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .h2 {
      font-size: 32px;
      font-weight: 700;
      color: #1A1A1A;
      line-height: 1.15;
      margin-bottom: 20px;
    }

    .desc {
      font-size: 14px;
      color: #666666;
      line-height: 1.7;
      margin-bottom: 28px;
    }

    .divider {
      width: 48px;
      height: 3px;
      background: #1A1A1A;
      margin-bottom: 24px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .feature-card {
      background: #F5F5F5;
      padding: 20px;
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .feature-title {
      font-size: 13px;
      font-weight: 700;
      color: #1A1A1A;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 11px;
      color: #999999;
      line-height: 1.5;
    }

    .step {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E8E8E8;
    }
    .step:last-child { border-bottom: none; }

    .step-num {
      font-size: 36px;
      font-weight: 800;
      color: #E8E8E8;
      line-height: 1;
      flex-shrink: 0;
      width: 44px;
    }

    .step-title {
      font-size: 14px;
      font-weight: 700;
      color: #1A1A1A;
      margin-bottom: 4px;
    }

    .step-desc {
      font-size: 12px;
      color: #666666;
      line-height: 1.5;
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1A1A1A;
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 700;
      padding: 14px 28px;
      border: none;
      margin-top: 8px;
    }

    .ft {
      position: absolute;
      bottom: 24px;
      left: 48px;
      right: 48px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #999999;
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="tag">Introducing</div>
    <div class="h1">Flux<br>Design<br>System</div>
    <p class="desc">A complete component library built for modern product teams. Ship faster with consistent, accessible UI components.</p>
    <div class="ft"><span>flux.design</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="tag">Features</div>
    <div class="h2">Everything You<br>Need to Ship</div>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">◈</div>
        <div class="feature-title">40+ Components</div>
        <div class="feature-desc">Buttons, inputs, modals, tables, and more — all production-ready.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">◉</div>
        <div class="feature-title">Dark Mode</div>
        <div class="feature-desc">First-class dark theme support with automatic contrast handling.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">△</div>
        <div class="feature-title">Accessible</div>
        <div class="feature-desc">WCAG 2.1 AA compliant. Keyboard nav and screen reader tested.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">□</div>
        <div class="feature-title">Figma Sync</div>
        <div class="feature-desc">Token bridge keeps design and code in perfect sync.</div>
      </div>
    </div>
    <div class="ft"><span>flux.design</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="tag">Getting Started</div>
    <div class="h2">Up and Running<br>in Minutes</div>
    <div class="step">
      <div class="step-num">01</div>
      <div>
        <div class="step-title">Install the Package</div>
        <div class="step-desc">npm install @flux/ui — zero peer dependencies, tree-shakeable.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <div>
        <div class="step-title">Import Components</div>
        <div class="step-desc">Named exports for every component. TypeScript types included.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <div>
        <div class="step-title">Customize Tokens</div>
        <div class="step-desc">Override colors, radii, spacing via a simple config file.</div>
      </div>
    </div>
    <div class="ft"><span>flux.design</span><span>03 / 04</span></div>
  </div>

  <div class="slide" style="text-align:center;align-items:center">
    <div class="tag">Launch</div>
    <div class="h1">Start<br>Building</div>
    <p class="desc">Open source. MIT licensed.<br>Used by 2,000+ teams worldwide.</p>
    <div class="cta-btn">npm install @flux/ui →</div>
    <div class="ft"><span>flux.design</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // BRANDED — "Monospace" — Developer Portfolio / About Me
  // Colors: #F0EDE7, #00B894, #1A1A1A, #C0BCB5
  // Font: Space Mono
  // ─────────────────────────────────────────────────────
  branded: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    MONOSPACE — DEVELOPER PORTFOLIO
    ===================================================
    Colors:
      Warm White:  #F0EDE7   — Slide background
      Teal:        #00B894   — Accents, highlights
      Black:       #1A1A1A   — Headlines
      Muted:       #888888   — Body copy
      Border:      #C0BCB5   — Dividers, corner decorations

    Typography:
      Primary:  Space Mono (Google Fonts)
      Weights:  400, 700

    Layout:
      Corner accents: top-right, bottom-left borders
      Slide padding: 32px 40px 52px
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #F0EDE7;
      padding: 32px 40px 52px;
      overflow: hidden;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    }
    .slide::before {
      content: '';
      position: absolute;
      top: 24px;
      right: 24px;
      width: 80px;
      height: 80px;
      border-top: 1px solid #C0BCB5;
      border-right: 1px solid #C0BCB5;
      pointer-events: none;
    }
    .slide::after {
      content: '';
      position: absolute;
      bottom: 24px;
      left: 24px;
      width: 60px;
      height: 60px;
      border-bottom: 1px solid #C0BCB5;
      border-left: 1px solid #C0BCB5;
      pointer-events: none;
    }

    .lbl {
      font-size: 10px;
      color: #888;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .h1 {
      font-size: 64px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 18px;
      color: #1A1A1A;
      letter-spacing: -0.02em;
    }
    .h1 i { color: #00B894; font-style: italic; }
    .h1 s { color: #C0BCB5; text-decoration: none; }

    .h2 {
      font-size: 40px;
      font-weight: 700;
      line-height: 1.05;
      margin-bottom: 14px;
      color: #1A1A1A;
    }
    .h2 i { color: #00B894; font-style: italic; }

    .desc {
      font-size: 12px;
      color: #888;
      line-height: 1.7;
      margin-top: 12px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: #FFF;
      border: 0.5px solid #DEDAD4;
      border-radius: 6px;
      padding: 14px 12px;
    }

    .stat-num {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      color: #1A1A1A;
    }

    .stat-bar {
      width: 24px;
      height: 2px;
      background: #00B894;
      margin: 6px 0;
    }

    .stat-label {
      font-size: 8px;
      font-weight: 700;
      color: #1A1A1A;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .stat-desc {
      font-size: 7.5px;
      color: #888;
      margin-top: 2px;
    }

    .skill-list {
      list-style: none;
    }

    .skill-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 0.5px solid #DEDAD4;
    }
    .skill-item:last-child { border-bottom: none; }

    .skill-num {
      font-size: 10px;
      color: #AAA;
      min-width: 18px;
    }

    .skill-name {
      font-size: 11px;
      font-weight: 700;
      color: #1A1A1A;
      flex: 1;
    }

    .skill-tag {
      font-size: 7.5px;
      color: #888;
      background: #F5F3EE;
      border: 0.5px solid #DEDAD4;
      border-radius: 4px;
      padding: 2px 6px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .code-block {
      background: #1A1A1A;
      color: #00B894;
      font-size: 11px;
      padding: 14px 16px;
      margin-top: 14px;
      font-family: 'Space Mono', monospace;
    }

    .ft {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 24px 8px;
      display: flex;
      justify-content: space-between;
    }
    .ft span {
      font-size: 8.5px;
      color: #888;
    }
    .ft span:first-child {
      font-weight: 700;
      color: #1A1A1A;
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="lbl">Portfolio</div>
    <div class="h1">Alex<br><i>Chen</i><br><s>Dev.</s></div>
    <p class="desc">Full-stack engineer specializing in distributed systems and developer tools. 8 years shipping production software.</p>
    <div class="ft"><span>alexchen.dev</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="lbl">By the Numbers</div>
    <div class="h2">Track<br><i>Record</i></div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-num">8</div>
        <div class="stat-bar"></div>
        <div class="stat-label">Years</div>
        <div class="stat-desc">Professional exp.</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">42</div>
        <div class="stat-bar"></div>
        <div class="stat-label">Projects</div>
        <div class="stat-desc">Shipped to prod</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">12k</div>
        <div class="stat-bar"></div>
        <div class="stat-label">Stars</div>
        <div class="stat-desc">Open source total</div>
      </div>
    </div>
    <p class="desc">Previously at Stripe, Vercel, and two YC startups. Currently building dev tools as an indie maker.</p>
    <div class="ft"><span>alexchen.dev</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="lbl">Tech Stack</div>
    <div class="h2">What I<br><i>Work</i> With</div>
    <ul class="skill-list">
      <li class="skill-item">
        <span class="skill-num">01</span>
        <span class="skill-name">TypeScript / Node.js</span>
        <span class="skill-tag">Primary</span>
      </li>
      <li class="skill-item">
        <span class="skill-num">02</span>
        <span class="skill-name">Go / Rust</span>
        <span class="skill-tag">Systems</span>
      </li>
      <li class="skill-item">
        <span class="skill-num">03</span>
        <span class="skill-name">React / Next.js</span>
        <span class="skill-tag">Frontend</span>
      </li>
      <li class="skill-item">
        <span class="skill-num">04</span>
        <span class="skill-name">PostgreSQL / Redis</span>
        <span class="skill-tag">Data</span>
      </li>
      <li class="skill-item">
        <span class="skill-num">05</span>
        <span class="skill-name">AWS / Kubernetes</span>
        <span class="skill-tag">Infra</span>
      </li>
    </ul>
    <div class="ft"><span>alexchen.dev</span><span>03 / 04</span></div>
  </div>

  <div class="slide" style="display:flex;flex-direction:column;justify-content:center">
    <div class="lbl">Connect</div>
    <div class="h1">Let's<br><i>Talk</i><br><s>Code.</s></div>
    <div class="code-block">alex@alexchen.dev</div>
    <p class="desc">Open to consulting, OSS collaborations, and speaking engagements.</p>
    <div class="ft"><span>alexchen.dev</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // INSTAGRAM CAROUSEL — "Terminal Editorial" — AI Engineering Breakdown
  // Colors: #F5F0EA bg, #2A2018 ink, #C4562A rust accent, #C4A882 grid
  // Font: Inter (900) + JetBrains Mono
  // ─────────────────────────────────────────────────────
  "instagram-carousel": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    TERMINAL EDITORIAL — AI ENGINEERING BREAKDOWN
    ===================================================
    Colors:
      Cream:    #F5F0EA   — Slide background
      Tan:      #C4A882   — Circuit-board grid overlay
      Ink:      #2A2018   — Headlines, terminal bg
      Rust:     #C4562A   — Section labels, accents, CTA borders
      Body:     #2A2018 + Mono uppercase
      Muted:    #888

    Typography:
      Display:  Inter 900 (giant headlines, -2px tracking)
      System:   JetBrains Mono 500-700 (everything else, tracked uppercase)

    Anatomy:
      top-bar (handle / page count)
      section-label (rust, 5px tracking)
      giant headline (sz-lg / sz-md / sz-sm)
      body text (mono uppercase)
      asterisk label
      terminal card (with traffic dots)
      content blocks: stat-line / mem-row / ops-row / tbar / stack-layer
      watermark at bottom
    ===================================================
    */
    ${SLIDE_BASE}

    .slide{position:relative;width:540px;height:675px;overflow:hidden;font-family:'Inter',sans-serif;flex-shrink:0;background:#F5F0EA;padding:0;}
    .slide::before{content:'';position:absolute;inset:0;z-index:0;opacity:.12;pointer-events:none;background:linear-gradient(90deg,#C4A882 1px,transparent 1px),linear-gradient(0deg,#C4A882 1px,transparent 1px);background-size:60px 60px;}
    .slide::after{content:'';position:absolute;z-index:0;pointer-events:none;top:30px;right:40px;width:180px;height:120px;opacity:.08;border:1px solid #C4A882;border-top:none;border-left:none;}
    .slide-inner{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;padding:28px 36px 20px;}

    .top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-shrink:0;}
    .handle{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:2px;color:#2A2018;text-transform:uppercase;opacity:.5;}
    .page-ct{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1px;color:#2A2018;opacity:.4;}

    .section-label{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:5px;color:#C4562A;text-transform:uppercase;margin-bottom:8px;flex-shrink:0;}

    .giant{font-family:'Inter',sans-serif;font-weight:900;font-size:62px;line-height:.92;letter-spacing:-2px;color:#2A2018;margin-bottom:16px;flex-shrink:0;}
    .giant .accent{color:#C4562A;}
    .giant.sz-lg{font-size:72px;}.giant.sz-md{font-size:56px;}.giant.sz-sm{font-size:48px;}

    .body-text{font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:500;line-height:1.55;color:#2A2018;text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px;flex-shrink:0;}

    .label-row{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-shrink:0;}
    .label-asterisk{font-size:16px;color:#C4562A;font-weight:700;line-height:1;}
    .label-text{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#C4562A;font-style:italic;}

    .terminal{background:#2A2018;border-radius:12px;overflow:hidden;flex-shrink:0;position:relative;}
    .terminal-bar{display:flex;align-items:center;gap:6px;padding:10px 14px 0;}
    .tdot{width:10px;height:10px;border-radius:50%;}
    .tdot-r{background:#FF6059;}.tdot-y{background:#FEBC2E;}.tdot-g{background:#28CA42;}
    .terminal-body{padding:12px 18px 16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#D4C4B0;line-height:1.65;}
    .terminal-body .cmd{font-weight:700;color:#F0E8DD;}
    .terminal-body .prompt{color:#C4562A;font-weight:700;}
    .terminal-body .arrow{color:#888;margin-right:4px;}
    .terminal-body .check{color:#28CA42;font-weight:700;}
    .terminal-body .dim{opacity:.6;}

    .watermark{text-align:center;margin-top:auto;padding-top:10px;flex-shrink:0;}
    .watermark-text{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:3px;color:#2A2018;opacity:.2;text-transform:uppercase;}
    .bottom-bar{display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-shrink:0;}

    .stat-line{display:flex;align-items:baseline;gap:10px;padding:6px 0;border-bottom:1px solid rgba(42,32,24,.08);}
    .stat-line:last-child{border-bottom:none;}
    .stat-num{font-family:'Inter',sans-serif;font-weight:900;font-size:28px;color:#C4562A;flex-shrink:0;min-width:70px;}
    .stat-desc{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.3px;line-height:1.4;}

    .mem-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;margin-bottom:4px;}
    .mem-icon{font-size:16px;flex-shrink:0;}
    .mem-name{font-size:10px;font-weight:800;margin-bottom:1px;}
    .mem-desc{font-size:7.5px;line-height:1.35;opacity:.8;}
    .mem-tag{margin-left:auto;font-size:7px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;letter-spacing:.5px;}

    .ops-row{display:flex;gap:8px;margin-bottom:8px;}
    .ops-card{flex:1;border-radius:8px;padding:10px 8px;text-align:center;border:1.5px solid;}
    .ops-card-icon{font-size:18px;margin-bottom:3px;}
    .ops-card-name{font-size:10px;font-weight:800;margin-bottom:2px;}
    .ops-card-desc{font-size:7.5px;line-height:1.35;}

    .stack-layer{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1.5px solid #2A2018;border-bottom:none;}
    .stack-layer:first-child{border-radius:8px 8px 0 0;}
    .stack-layer:last-child{border-bottom:1.5px solid #2A2018;border-radius:0 0 8px 8px;}
    .stack-num{font-family:'Inter',sans-serif;font-weight:900;font-size:22px;color:#C4562A;width:20px;flex-shrink:0;}
    .stack-name{font-size:10px;font-weight:800;color:#2A2018;}
    .stack-desc{font-size:7.5px;color:#888;line-height:1.3;}
    .stack-tag{margin-left:auto;font-size:6.5px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;letter-spacing:.5px;text-transform:uppercase;}

    .cta-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
    .cta-giant{font-family:'Inter',sans-serif;font-weight:900;font-size:68px;line-height:.92;letter-spacing:-2px;color:#2A2018;margin-bottom:16px;}
    .cta-giant .accent{color:#C4562A;}
    .cta-body{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.5px;line-height:1.6;max-width:380px;margin-bottom:24px;text-align:center;}
    .cta-btn{display:inline-block;border:2px solid #C4562A;border-radius:8px;padding:14px 36px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;letter-spacing:4px;color:#C4562A;text-transform:uppercase;margin-bottom:16px;}
    .cta-follow{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:#2A2018;text-transform:uppercase;letter-spacing:1px;}
    .cta-follow .accent{color:#C4562A;}
  </style>
</head>
<body>

  <!-- S01: COVER -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">01 / 06</div></div>
    <div class="section-label">Claude Code</div>
    <div class="giant sz-lg">KARPATHY +<br>OBSIDIAN =<br><span class="accent">71.5X LESS<br>TOKENS</span></div>
    <div class="body-text">Here's how to set it up in 3 steps using Andrej Karpathy's system.</div>
    <div class="label-row"><div class="label-asterisk">*</div><div class="label-text">The numbers:</div></div>
    <div class="terminal">
      <div class="terminal-bar"><div class="tdot tdot-r"></div><div class="tdot tdot-y"></div><div class="tdot tdot-g"></div></div>
      <div class="terminal-body">
        <span class="prompt">$ </span><span class="cmd">claude --usage</span><br>
        <span class="arrow">&rarr;</span> before: 20,000 tokens/session<br>
        <span class="arrow">&rarr;</span> after: 280 tokens/session<br>
        <span class="check">&check;</span> 71.5x reduction
      </div>
    </div>
    <div class="watermark"><div class="watermark-text">@slideshot</div></div>
    <div class="bottom-bar"></div>
  </div></div>

  <!-- S02: PROBLEM -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">02 / 06</div></div>
    <div class="section-label">The Problem</div>
    <div class="giant">CLAUDE<br><span class="accent">RE-READS<br>EVERYTHING</span></div>
    <div class="body-text">Every new chat re-reads all your files from scratch &mdash; eating up your usage before you start.</div>
    <div class="label-row"><div class="label-asterisk">*</div><div class="label-text">What it looks like:</div></div>
    <div class="terminal">
      <div class="terminal-bar"><div class="tdot tdot-r"></div><div class="tdot tdot-y"></div><div class="tdot tdot-g"></div></div>
      <div class="terminal-body">
        <span class="prompt">$ </span><span class="cmd">new session started</span><br>
        <span class="arrow">&rarr;</span> reading file 1/37...<br>
        <span class="arrow">&rarr;</span> reading file 2/37...<br>
        <span class="arrow">&rarr;</span> <span class="dim">20,000 tokens gone. haven't asked anything yet.</span>
      </div>
    </div>
    <div class="watermark"><div class="watermark-text">@slideshot</div></div>
    <div class="bottom-bar"></div>
  </div></div>

  <!-- S03: REAL COST -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">03 / 06</div></div>
    <div class="section-label">The Real Cost</div>
    <div class="giant sz-md">200K TOKENS<br>OF <span class="accent">RAM.</span><br><span class="accent">NO DISK.</span></div>
    <div class="body-text">"The LLM is an amnesiac reasoner in a finite window." &mdash; Karpathy</div>
    <div style="margin-bottom:8px;">
      <div class="stat-line"><div class="stat-num">~40%</div><div class="stat-desc">of AI coding errors are context failures, not capability failures</div></div>
      <div class="stat-line"><div class="stat-num">O(n&sup2;)</div><div class="stat-desc">attention cost &mdash; longer context does NOT mean better</div></div>
      <div class="stat-line"><div class="stat-num">0</div><div class="stat-desc">knowledge persists between sessions. every chat starts from zero.</div></div>
    </div>
    <div class="watermark"><div class="watermark-text">@slideshot</div></div>
    <div class="bottom-bar"></div>
  </div></div>

  <!-- S04: MEMORY TYPES -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">04 / 06</div></div>
    <div class="section-label">Memory Types</div>
    <div class="giant sz-md">4 TYPES.<br><span class="accent">YOU USE<br>ONE.</span></div>
    <div style="margin-bottom:8px;">
      <div class="mem-row" style="background:#F0EEFF"><div class="mem-icon" style="color:#5540AA">&curren;</div><div style="flex:1"><div class="mem-name" style="color:#5540AA">In-Context (RAM)</div><div class="mem-desc" style="color:#665599">Tokens loaded now. Wiped at session end.</div></div><div class="mem-tag" style="background:#E0D8FF;color:#5540AA">VOLATILE</div></div>
      <div class="mem-row" style="background:#E0F5EE"><div class="mem-icon" style="color:#006644">&equiv;</div><div style="flex:1"><div class="mem-name" style="color:#006644">External Storage (Disk)</div><div class="mem-desc" style="color:#336655">Files, wikis, DBs. Persistent. Must be loaded.</div></div><div class="mem-tag" style="background:#C8FFEE;color:#006644">PERSISTENT</div></div>
      <div class="mem-row" style="background:#FFF5E0"><div class="mem-icon" style="color:#885500">&infin;</div><div style="flex:1"><div class="mem-name" style="color:#885500">In-Weights (Instinct)</div><div class="mem-desc" style="color:#665533">Baked in training. Knows patterns &mdash; not your project.</div></div><div class="mem-tag" style="background:#FFEDD8;color:#885500">GENERAL</div></div>
      <div class="mem-row" style="background:#F5F5F5"><div class="mem-icon" style="color:#555">&raquo;</div><div style="flex:1"><div class="mem-name" style="color:#555">KV Cache (Recall)</div><div class="mem-desc" style="color:#777">Stable CLAUDE.md = prefix cache = free reuse.</div></div><div class="mem-tag" style="background:#EEE;color:#555">FREE</div></div>
    </div>
    <div class="watermark"><div class="watermark-text">@slideshot</div></div>
    <div class="bottom-bar"></div>
  </div></div>

  <!-- S05: 5-LAYER STACK -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">05 / 06</div></div>
    <div class="section-label">The Stack</div>
    <div class="giant sz-md">THE COMPLETE<br><span class="accent">5-LAYER<br>STACK</span></div>
    <div style="margin-bottom:8px;">
      <div class="stack-layer" style="background:#FFF5E0"><div class="stack-num">5</div><div style="flex:1"><div class="stack-name">Karpathy's LLM Wiki Theory</div><div class="stack-desc">LLM = OS, context = RAM, files = disk</div></div><div class="stack-tag" style="background:#FFEDD8;color:#885500">THEORY</div></div>
      <div class="stack-layer" style="background:#F0EEFF"><div class="stack-num">4</div><div style="flex:1"><div class="stack-name">Graphify &mdash; Knowledge Graph</div><div class="stack-desc">raw files &rarr; structured graph &middot; 71.5x fewer tokens</div></div><div class="stack-tag" style="background:#E0D8FF;color:#5540AA">COMPILE</div></div>
      <div class="stack-layer" style="background:#E8F0F8"><div class="stack-num">3</div><div style="flex:1"><div class="stack-name">Obsidian &mdash; Visual IDE</div><div class="stack-desc">Navigate graph, annotate decisions, MCP</div></div><div class="stack-tag" style="background:#D0E8FF;color:#2255AA">VISUALIZE</div></div>
      <div class="stack-layer" style="background:#E0F5EE"><div class="stack-num">2</div><div style="flex:1"><div class="stack-name">Acontext &mdash; Skill Memory</div><div class="stack-desc">Auto-capture learnings &rarr; load next session</div></div><div class="stack-tag" style="background:#C8FFEE;color:#006644">PERSIST</div></div>
      <div class="stack-layer" style="background:#FFE8E8"><div class="stack-num">1</div><div style="flex:1"><div class="stack-name">Token Efficiency Rules</div><div class="stack-desc">Front-load, compress, hierarchical load</div></div><div class="stack-tag" style="background:#FFD8D8;color:#AA3333">OPTIMIZE</div></div>
    </div>
    <div class="watermark"><div class="watermark-text">@slideshot</div></div>
    <div class="bottom-bar"></div>
  </div></div>

  <!-- S06: CTA -->
  <div class="slide"><div class="slide-inner">
    <div class="top-bar"><div class="handle">@slideshot</div><div class="page-ct">06 / 06</div></div>
    <div class="cta-center">
      <div class="cta-giant">IF THIS<br><span class="accent">HELPED,</span><br>SHARE IT</div>
      <div class="cta-body">Save this carousel. Send it to someone burning tokens. Follow for more AI engineering breakdowns.</div>
      <div class="cta-btn">FOLLOW + SHARE</div>
      <div class="cta-follow" style="margin-top:12px;">Follow <span class="accent">@slideshot</span></div>
    </div>
    <div class="bottom-bar"></div>
  </div></div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // INFOGRAPHIC — "Data Cards" — Startup Annual Report
  // Colors: #10B981, #F59E0B, #1A1A1A, #F8FAFC, #E5E7EB
  // Font: DM Sans
  // ─────────────────────────────────────────────────────
  infographic: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    DATA CARDS — STARTUP ANNUAL REPORT
    ===================================================
    Colors:
      Green:       #10B981   — Growth indicators, positive
      Amber:       #F59E0B   — Highlights, warnings
      Black:       #1A1A1A   — Headlines
      Slate:       #F8FAFC   — Card backgrounds
      Border:      #E5E7EB   — Dividers
      Body Copy:   #64748B   — Paragraphs
      Muted:       #94A3B8   — Captions

    Typography:
      Primary:  DM Sans (Google Fonts)
      Weights:  400, 500, 600, 700, 800
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #FFFFFF;
      padding: 40px;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      flex-shrink: 0;
    }

    .header {
      border-bottom: 2px solid #1A1A1A;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }

    .tag {
      font-size: 10px;
      font-weight: 700;
      color: #10B981;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .h1 {
      font-size: 32px;
      font-weight: 800;
      color: #1A1A1A;
      line-height: 1.15;
    }

    .h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1A1A1A;
      line-height: 1.2;
    }

    .desc {
      font-size: 13px;
      color: #64748B;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .kpi {
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      padding: 18px;
    }

    .kpi-val {
      font-size: 32px;
      font-weight: 800;
      color: #1A1A1A;
    }

    .kpi-lbl {
      font-size: 10px;
      color: #94A3B8;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .kpi-change {
      font-size: 11px;
      font-weight: 600;
      color: #10B981;
      margin-top: 4px;
    }

    .kpi-change.amber { color: #F59E0B; }

    .bar-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bar-label {
      font-size: 11px;
      font-weight: 600;
      color: #1A1A1A;
      width: 90px;
      flex-shrink: 0;
    }

    .bar-track {
      flex: 1;
      height: 20px;
      background: #F1F5F9;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 6px;
    }

    .bar-val {
      font-size: 9px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .milestone-list {
      list-style: none;
    }

    .milestone {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #F1F5F9;
    }
    .milestone:last-child { border-bottom: none; }

    .milestone-q {
      font-size: 10px;
      font-weight: 700;
      color: #10B981;
      min-width: 36px;
    }

    .milestone-text {
      font-size: 12px;
      color: #1A1A1A;
      font-weight: 600;
    }

    .milestone-sub {
      font-size: 11px;
      color: #94A3B8;
      margin-top: 2px;
    }

    .ft {
      position: absolute;
      bottom: 20px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94A3B8;
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="header">
      <div class="tag">Annual Report 2025</div>
      <div class="h1">Meridian<br>Year in Review</div>
    </div>
    <p class="desc">Our third year of operations. Revenue grew 3.2x while maintaining profitability. Here's the full breakdown.</p>
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-val">$4.2M</div>
        <div class="kpi-lbl">Annual Revenue</div>
        <div class="kpi-change">↑ 218% YoY</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">12.4k</div>
        <div class="kpi-lbl">Active Users</div>
        <div class="kpi-change">↑ 340% YoY</div>
      </div>
    </div>
    <div class="ft"><span>Meridian Inc.</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="header">
      <div class="tag">Revenue Breakdown</div>
      <div class="h2">Where the Money<br>Comes From</div>
    </div>
    <div class="bar-group">
      <div class="bar-row">
        <span class="bar-label">SaaS</span>
        <div class="bar-track"><div class="bar-fill" style="width:72%;background:#10B981"><span class="bar-val">72%</span></div></div>
      </div>
      <div class="bar-row">
        <span class="bar-label">Enterprise</span>
        <div class="bar-track"><div class="bar-fill" style="width:18%;background:#F59E0B"><span class="bar-val">18%</span></div></div>
      </div>
      <div class="bar-row">
        <span class="bar-label">Services</span>
        <div class="bar-track"><div class="bar-fill" style="width:10%;background:#1A1A1A"><span class="bar-val">10%</span></div></div>
      </div>
    </div>
    <div class="kpi-grid" style="margin-top:20px">
      <div class="kpi">
        <div class="kpi-val">94%</div>
        <div class="kpi-lbl">Gross Margin</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">$128</div>
        <div class="kpi-lbl">Avg MRR / User</div>
        <div class="kpi-change">↑ 22% QoQ</div>
      </div>
    </div>
    <div class="ft"><span>Meridian Inc.</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="header">
      <div class="tag">Key Milestones</div>
      <div class="h2">What We<br>Shipped</div>
    </div>
    <ul class="milestone-list">
      <li class="milestone">
        <span class="milestone-q">Q1</span>
        <div>
          <div class="milestone-text">Launched v2.0 Platform</div>
          <div class="milestone-sub">Complete rewrite — 60% faster load times</div>
        </div>
      </li>
      <li class="milestone">
        <span class="milestone-q">Q2</span>
        <div>
          <div class="milestone-text">Series A — $8M Raised</div>
          <div class="milestone-sub">Led by Sequoia, with Index Ventures participating</div>
        </div>
      </li>
      <li class="milestone">
        <span class="milestone-q">Q3</span>
        <div>
          <div class="milestone-text">Enterprise Tier Launch</div>
          <div class="milestone-sub">SSO, audit logs, SOC 2 compliance — 14 enterprise deals closed</div>
        </div>
      </li>
      <li class="milestone">
        <span class="milestone-q">Q4</span>
        <div>
          <div class="milestone-text">Team Doubled to 28</div>
          <div class="milestone-sub">Engineering, sales, and customer success hiring across 3 countries</div>
        </div>
      </li>
    </ul>
    <div class="ft"><span>Meridian Inc.</span><span>03 / 04</span></div>
  </div>

  <div class="slide">
    <div class="header">
      <div class="tag">Looking Ahead</div>
      <div class="h1">2026<br>Goals</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-val">$12M</div>
        <div class="kpi-lbl">Revenue Target</div>
        <div class="kpi-change amber">2.8x growth</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">50k</div>
        <div class="kpi-lbl">Users Target</div>
        <div class="kpi-change amber">4x growth</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">3</div>
        <div class="kpi-lbl">New Markets</div>
        <div class="kpi-change">EU, APAC, LATAM</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">50</div>
        <div class="kpi-lbl">Team Size</div>
        <div class="kpi-change amber">+22 hires</div>
      </div>
    </div>
    <p class="desc">Focused on product-led growth, expanding self-serve, and building the enterprise sales motion.</p>
    <div class="ft"><span>Meridian Inc.</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // PITCH DECK — "Corporate" — Company Pitch
  // Colors: #0A0A0A, #FFFFFF, #E8E8E8, #FF4444
  // Font: Inter
  // ─────────────────────────────────────────────────────
  "pitch-deck": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    CORPORATE — COMPANY PITCH DECK
    ===================================================
    Colors:
      Black:       #0A0A0A   — Dark header backgrounds
      White:       #FFFFFF   — Body backgrounds, text on dark
      Light Gray:  #E8E8E8   — Borders, dividers
      Red:         #FF4444   — Accent, CTAs, highlights
      Slate:       #F8F8F8   — Card backgrounds
      Body Copy:   #666666   — Paragraphs
      Muted:       #999999   — Captions

    Typography:
      Primary:  Inter (Google Fonts)
      Weights:  400, 500, 600, 700, 800
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #FFFFFF;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      background: #0A0A0A;
      padding: 32px 40px;
      color: #FFFFFF;
      flex-shrink: 0;
    }

    .top-bar .tag {
      font-size: 10px;
      font-weight: 700;
      color: #FF4444;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .top-bar h1 {
      font-size: 36px;
      font-weight: 800;
      line-height: 1.1;
      color: #FFFFFF;
    }

    .top-bar h2 {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.1;
      color: #FFFFFF;
    }

    .body {
      padding: 28px 40px;
      flex: 1;
    }

    .desc {
      font-size: 13px;
      color: #666666;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 20px;
    }

    .kpi {
      border: 2px solid #E8E8E8;
      border-radius: 8px;
      padding: 18px;
    }

    .kpi-val {
      font-size: 32px;
      font-weight: 800;
      color: #0A0A0A;
    }

    .kpi-lbl {
      font-size: 10px;
      color: #999999;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .kpi-change {
      font-size: 11px;
      font-weight: 600;
      color: #FF4444;
      margin-top: 4px;
    }

    .problem-card {
      background: #F8F8F8;
      border-left: 4px solid #FF4444;
      padding: 18px 20px;
      margin-bottom: 12px;
    }

    .problem-title {
      font-size: 14px;
      font-weight: 700;
      color: #0A0A0A;
      margin-bottom: 4px;
    }

    .problem-desc {
      font-size: 12px;
      color: #666666;
      line-height: 1.5;
    }

    .team-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .team-card {
      background: #F8F8F8;
      padding: 16px;
      border-radius: 8px;
    }

    .team-name {
      font-size: 13px;
      font-weight: 700;
      color: #0A0A0A;
      margin-bottom: 2px;
    }

    .team-role {
      font-size: 10px;
      color: #FF4444;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .team-bio {
      font-size: 10px;
      color: #666666;
      line-height: 1.4;
    }

    .ft {
      position: absolute;
      bottom: 20px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #999999;
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="top-bar">
      <div class="tag">Seed Round</div>
      <h1>Vertex<br>Analytics</h1>
    </div>
    <div class="body">
      <p class="desc">Real-time analytics for e-commerce teams. Track conversions, optimize funnels, and increase revenue — without engineering support.</p>
      <div class="kpi-grid">
        <div class="kpi">
          <div class="kpi-val">$1.8M</div>
          <div class="kpi-lbl">ARR</div>
          <div class="kpi-change">↑ 12% MoM</div>
        </div>
        <div class="kpi">
          <div class="kpi-val">340+</div>
          <div class="kpi-lbl">Paying Customers</div>
          <div class="kpi-change">↑ 28% QoQ</div>
        </div>
      </div>
    </div>
    <div class="ft"><span>Vertex Analytics</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="top-bar">
      <div class="tag">The Problem</div>
      <h2>Why Current<br>Tools Fail</h2>
    </div>
    <div class="body">
      <div class="problem-card">
        <div class="problem-title">Data Silos</div>
        <div class="problem-desc">Teams juggle 5+ analytics tools. No single source of truth for conversion data.</div>
      </div>
      <div class="problem-card">
        <div class="problem-title">Engineer Dependency</div>
        <div class="problem-desc">Every tracking change requires an engineering ticket. 2-week average turnaround.</div>
      </div>
      <div class="problem-card">
        <div class="problem-title">Stale Insights</div>
        <div class="problem-desc">Batch processing means yesterday's data. By the time you see the drop, revenue is already lost.</div>
      </div>
    </div>
    <div class="ft"><span>Vertex Analytics</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="top-bar">
      <div class="tag">The Team</div>
      <h2>Who's<br>Building This</h2>
    </div>
    <div class="body">
      <div class="team-grid">
        <div class="team-card">
          <div class="team-name">Sarah Kim</div>
          <div class="team-role">CEO / Co-founder</div>
          <div class="team-bio">Ex-Shopify PM. Led analytics products serving 200k merchants.</div>
        </div>
        <div class="team-card">
          <div class="team-name">Marcus Liu</div>
          <div class="team-role">CTO / Co-founder</div>
          <div class="team-bio">Ex-Datadog. Built real-time streaming infra processing 2B events/day.</div>
        </div>
        <div class="team-card">
          <div class="team-name">Priya Patel</div>
          <div class="team-role">VP Engineering</div>
          <div class="team-bio">Ex-Stripe. 12 years in fintech data infrastructure.</div>
        </div>
        <div class="team-card">
          <div class="team-name">James Rivera</div>
          <div class="team-role">Head of Sales</div>
          <div class="team-bio">Ex-Amplitude. Closed $4M+ in enterprise analytics deals.</div>
        </div>
      </div>
    </div>
    <div class="ft"><span>Vertex Analytics</span><span>03 / 04</span></div>
  </div>

  <div class="slide">
    <div class="top-bar">
      <div class="tag">The Ask</div>
      <h1>Raising<br>$3M Seed</h1>
    </div>
    <div class="body">
      <p class="desc">18 months of runway to hit $5M ARR and expand into EU market.</p>
      <div class="kpi-grid">
        <div class="kpi">
          <div class="kpi-val">$3M</div>
          <div class="kpi-lbl">Raise Amount</div>
        </div>
        <div class="kpi">
          <div class="kpi-val">18mo</div>
          <div class="kpi-lbl">Runway</div>
        </div>
        <div class="kpi">
          <div class="kpi-val">$5M</div>
          <div class="kpi-lbl">ARR Target</div>
          <div class="kpi-change">By Q4 2026</div>
        </div>
        <div class="kpi">
          <div class="kpi-val">1k</div>
          <div class="kpi-lbl">Customers Target</div>
          <div class="kpi-change">3x current</div>
        </div>
      </div>
    </div>
    <div class="ft"><span>Vertex Analytics</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // DARK MODERN — "Dark Neon" — Music Event / Concert Promo
  // Colors: #0A0A0F, #FF6B6B, #FFC107, #1A1A2E
  // Font: Inter
  // ─────────────────────────────────────────────────────
  "dark-modern": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    DARK NEON — MUSIC EVENT PROMO
    ===================================================
    Colors:
      Deep Black:  #0A0A0F   — Slide background
      Coral Red:   #FF6B6B   — Primary accent
      Gold:        #FFC107   — Secondary accent, highlights
      Dark Navy:   #1A1A2E   — Card backgrounds
      White:       #FFFFFF   — Headlines
      Muted:       rgba(255,255,255,0.4) — Body copy

    Typography:
      Primary:  Inter (Google Fonts)
      Weights:  400, 500, 600, 700, 800
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #0A0A0F;
      padding: 48px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .glow {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .glow-gold {
      position: absolute;
      bottom: -80px;
      left: -80px;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .tag {
      display: inline-block;
      border: 1px solid rgba(255,107,107,0.4);
      color: #FF6B6B;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 24px;
      width: fit-content;
    }

    .h1 {
      font-size: 52px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.05;
      margin-bottom: 16px;
    }
    .h1 span { color: #FF6B6B; }
    .h1 em { color: #FFC107; font-style: normal; }

    .h2 {
      font-size: 36px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .desc {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .lineup-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 10px;
    }

    .lineup-time {
      font-size: 10px;
      font-weight: 700;
      color: #FFC107;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }

    .lineup-name {
      font-size: 18px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 2px;
    }

    .lineup-genre {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }

    .info-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 18px;
      text-align: center;
    }

    .info-val {
      font-size: 28px;
      font-weight: 800;
      color: #FFFFFF;
    }

    .info-lbl {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .ticket-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FF6B6B;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 8px;
      width: fit-content;
    }

    .ft {
      position: absolute;
      bottom: 24px;
      left: 48px;
      right: 48px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="glow"></div>
    <div class="tag">Live Event</div>
    <div class="h1">Neon<br><span>Pulse</span><br>Festival</div>
    <p class="desc">Three stages. Twelve artists. One unforgettable night in the heart of downtown.</p>
    <div style="display:flex;gap:12px;align-items:center">
      <div class="ticket-btn">Get Tickets →</div>
      <span style="font-size:12px;color:rgba(255,255,255,0.3)">June 14, 2026</span>
    </div>
    <div class="ft"><span>neonpulse.live</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="glow-gold"></div>
    <div class="tag">Lineup</div>
    <div class="h2">Who's<br>Playing</div>
    <div class="lineup-card">
      <div class="lineup-time">9:00 PM — Main Stage</div>
      <div class="lineup-name">AURORA WAVES</div>
      <div class="lineup-genre">Electronic / Ambient</div>
    </div>
    <div class="lineup-card">
      <div class="lineup-time">10:30 PM — Main Stage</div>
      <div class="lineup-name">ECHO DISTRICT</div>
      <div class="lineup-genre">House / Deep Tech</div>
    </div>
    <div class="lineup-card">
      <div class="lineup-time">12:00 AM — Main Stage</div>
      <div class="lineup-name">SIGNAL NOIR</div>
      <div class="lineup-genre">Techno / Industrial</div>
    </div>
    <div class="ft"><span>neonpulse.live</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="glow"></div>
    <div class="tag">Details</div>
    <div class="h2">Event<br>Info</div>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-val">3</div>
        <div class="info-lbl">Stages</div>
      </div>
      <div class="info-card">
        <div class="info-val">12</div>
        <div class="info-lbl">Artists</div>
      </div>
      <div class="info-card">
        <div class="info-val">8h</div>
        <div class="info-lbl">Duration</div>
      </div>
      <div class="info-card">
        <div class="info-val" style="font-size:20px">21+</div>
        <div class="info-lbl">Age Limit</div>
      </div>
    </div>
    <p class="desc" style="margin-top:8px;margin-bottom:0">Venue: The Foundry, 420 Industrial Blvd. Doors open at 6 PM. Food trucks and bars on-site.</p>
    <div class="ft"><span>neonpulse.live</span><span>03 / 04</span></div>
  </div>

  <div class="slide" style="text-align:center;align-items:center">
    <div class="glow-gold"></div>
    <div class="tag">Tickets</div>
    <div class="h1"><em>Early</em><br><span>Bird</span></div>
    <div class="info-grid" style="width:100%;max-width:360px">
      <div class="info-card">
        <div class="info-val" style="color:#FFC107">$45</div>
        <div class="info-lbl">General</div>
      </div>
      <div class="info-card">
        <div class="info-val" style="color:#FF6B6B">$120</div>
        <div class="info-lbl">VIP Access</div>
      </div>
    </div>
    <p class="desc" style="margin-top:8px">Early bird pricing ends May 30.<br>Limited to first 500 tickets.</p>
    <div class="ticket-btn">Buy Now →</div>
    <div class="ft"><span>neonpulse.live</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // EDITORIAL — Recipe / Food Magazine Feature
  // Colors: #FAF8F5, #C9963B, #2C2824, #E8E3DC
  // Font: Playfair Display + DM Sans
  // ─────────────────────────────────────────────────────
  editorial: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /*
    ===================================================
    EDITORIAL — RECIPE / FOOD MAGAZINE
    ===================================================
    Colors:
      Warm White:  #FAF8F5   — Slide background
      Gold:        #C9963B   — Accents, dividers
      Dark Brown:  #2C2824   — Headlines
      Warm Gray:   #E8E3DC   — Borders, separators
      Body Copy:   #888888   — Paragraphs
      Muted:       #BBBBBB   — Captions

    Typography:
      Display:  Playfair Display (Google Fonts)
      Body:     DM Sans (Google Fonts)
    ===================================================
    */
    ${SLIDE_BASE}

    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      background: #FAF8F5;
      padding: 48px;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .divider {
      width: 48px;
      height: 3px;
      background: #C9963B;
      margin-bottom: 24px;
    }

    .tag {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      color: #C9963B;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .h1 {
      font-family: 'Playfair Display', serif;
      font-size: 52px;
      font-weight: 800;
      color: #2C2824;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    .h1 em { color: #C9963B; font-style: italic; }

    .h2 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      color: #2C2824;
      line-height: 1.15;
      margin-bottom: 16px;
    }
    .h2 em { color: #C9963B; font-style: italic; }

    .desc {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: #888;
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .quote {
      border-left: 3px solid #C9963B;
      padding-left: 20px;
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-style: italic;
      color: #2C2824;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .ingredient-list {
      list-style: none;
      font-family: 'DM Sans', sans-serif;
    }

    .ingredient {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 0.5px solid #E8E3DC;
      font-size: 12px;
    }
    .ingredient:last-child { border-bottom: none; }

    .ingredient-amount {
      font-weight: 600;
      color: #C9963B;
      min-width: 60px;
    }

    .ingredient-name {
      color: #2C2824;
      font-weight: 500;
    }

    .step-list {
      list-style: none;
      font-family: 'DM Sans', sans-serif;
    }

    .step {
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 0.5px solid #E8E3DC;
    }
    .step:last-child { border-bottom: none; margin-bottom: 0; }

    .step-label {
      font-size: 10px;
      font-weight: 600;
      color: #C9963B;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .step-title {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
      color: #2C2824;
      margin-bottom: 4px;
    }

    .step-desc {
      font-size: 12px;
      color: #888;
      line-height: 1.5;
    }

    .info-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      font-family: 'DM Sans', sans-serif;
    }

    .info-item {
      text-align: center;
    }

    .info-val {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 700;
      color: #2C2824;
    }

    .info-lbl {
      font-size: 9px;
      color: #BBB;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }

    .ft {
      position: absolute;
      bottom: 24px;
      left: 48px;
      right: 48px;
      display: flex;
      justify-content: space-between;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      color: #BBB;
    }
  </style>
</head>
<body>

  <div class="slide">
    <div class="divider"></div>
    <div class="tag">From the Kitchen</div>
    <div class="h1">Saffron<br><em>Risotto</em><br>al Limone</div>
    <p class="desc">A Milanese classic reimagined with bright citrus notes. Creamy, fragrant, and impossibly elegant for a weeknight dinner.</p>
    <div class="info-row">
      <div class="info-item">
        <div class="info-val">35</div>
        <div class="info-lbl">Minutes</div>
      </div>
      <div class="info-item">
        <div class="info-val">4</div>
        <div class="info-lbl">Servings</div>
      </div>
      <div class="info-item">
        <div class="info-val">Easy</div>
        <div class="info-lbl">Difficulty</div>
      </div>
    </div>
    <div class="ft"><span>The Kitchen Edit</span><span>01 / 04</span></div>
  </div>

  <div class="slide">
    <div class="divider"></div>
    <div class="tag">Ingredients</div>
    <div class="h2">What<br>You'll <em>Need</em></div>
    <ul class="ingredient-list">
      <li class="ingredient">
        <span class="ingredient-amount">320g</span>
        <span class="ingredient-name">Arborio or Carnaroli rice</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">1L</span>
        <span class="ingredient-name">Vegetable stock, warmed</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">0.5g</span>
        <span class="ingredient-name">Saffron threads</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">1</span>
        <span class="ingredient-name">Lemon — zest and juice</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">80g</span>
        <span class="ingredient-name">Parmigiano-Reggiano, finely grated</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">40g</span>
        <span class="ingredient-name">Unsalted butter, cold and cubed</span>
      </li>
      <li class="ingredient">
        <span class="ingredient-amount">1</span>
        <span class="ingredient-name">Shallot, finely diced</span>
      </li>
    </ul>
    <div class="ft"><span>The Kitchen Edit</span><span>02 / 04</span></div>
  </div>

  <div class="slide">
    <div class="divider"></div>
    <div class="tag">Method</div>
    <div class="h2">How to<br><em>Make</em> It</div>
    <ul class="step-list">
      <li class="step">
        <div class="step-label">Step One</div>
        <div class="step-title">Toast the Rice</div>
        <div class="step-desc">Saut&eacute; shallot in olive oil until soft. Add rice, stir 2 minutes until edges turn translucent.</div>
      </li>
      <li class="step">
        <div class="step-label">Step Two</div>
        <div class="step-title">Build the Broth</div>
        <div class="step-desc">Add saffron to warm stock. Ladle stock into rice one scoop at a time, stirring constantly, 18–20 minutes.</div>
      </li>
      <li class="step">
        <div class="step-label">Step Three</div>
        <div class="step-title">Finish with Mantecatura</div>
        <div class="step-desc">Off heat, fold in cold butter, parmesan, lemon zest, and a squeeze of juice. Rest 2 minutes before plating.</div>
      </li>
    </ul>
    <div class="ft"><span>The Kitchen Edit</span><span>03 / 04</span></div>
  </div>

  <div class="slide" style="text-align:center;align-items:center">
    <div class="divider" style="margin-left:auto;margin-right:auto"></div>
    <div class="tag">Chef's Note</div>
    <div class="quote">"The secret is patience. Never rush a risotto — each ladle of stock should be fully absorbed before the next."</div>
    <p class="desc" style="max-width:340px">Serve immediately in warmed bowls with an extra grating of parmesan and a twist of black pepper.</p>
    <div class="ft"><span>The Kitchen Edit</span><span>04 / 04</span></div>
  </div>

</body>
</html>`,


  // ─────────────────────────────────────────────────────
  // BROWSER SHELL — Browser Window Chrome — Nature Example
  // Colors: #FFD233, #12122A, #0A0A0A, #FFFFFF
  // Font: Bebas Neue + DM Sans
  // ─────────────────────────────────────────────────────
  "browser-shell": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet">
  <style>
    ${SLIDE_BASE}
    .slide{position:relative;width:540px;height:675px;overflow:hidden;font-family:'DM Sans',sans-serif;flex-shrink:0;background:#FFD233;padding:20px}
    .browser{width:100%;height:100%;background:#12122A;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 2px 0 rgba(255,255,255,0.06) inset,0 20px 50px rgba(0,0,0,0.35)}
    .browser-bar{background:#12122A;padding:0 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;height:42px}
    .dots{display:flex;gap:7px;align-items:center}.dot{width:11px;height:11px;border-radius:50%;flex-shrink:0}
    .dot-r{background:#FF6059}.dot-o{background:#FEBC2E}.dot-g{background:#2A2A44}
    .brand-name{color:#fff;font-size:17px;font-weight:700;letter-spacing:-0.3px;font-family:'DM Sans',sans-serif}
    .browser-body{background:#fff;flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}
    .browser-foot{background:#12122A;padding:10px 24px;text-align:center;flex-shrink:0}
    .foot-txt{color:#fff;font-size:9.5px;font-weight:600;letter-spacing:2.2px;text-transform:uppercase}
    .s1-top{padding:16px 24px 12px;border-bottom:2.5px solid #12122A;flex-shrink:0}
    .big-headline{font-family:'Bebas Neue',sans-serif;font-size:70px;color:#0A0A0A;line-height:0.9;letter-spacing:1px}
    .sub-headline{font-size:9.5px;font-weight:600;letter-spacing:2.8px;color:#0A0A0A;margin-top:7px;text-transform:uppercase}
    .illus-wrap{margin:10px 24px 0;border-radius:10px;background:#FFD233;height:188px;overflow:hidden;position:relative;flex-shrink:0}
    .illus-wrap svg{width:100%;height:100%}
    .job-body{padding:10px 24px 12px;display:flex;gap:16px;flex:1;min-height:0}
    .jb-left{flex:0 0 44%}.jb-right{flex:1}
    .job-title{font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.3px}
    .d-list{list-style:none;margin-bottom:9px}
    .d-list li{font-size:10.5px;font-weight:700;color:#0A0A0A;display:flex;align-items:flex-start;gap:5px;margin-bottom:4px;line-height:1.3}
    .d-list li::before{content:'\\25C6';color:#FFD233;font-size:8px;margin-top:2px;flex-shrink:0;-webkit-text-stroke:0.8px #0A0A0A}
    .desc-p{font-size:9px;color:#555;line-height:1.55}
    .b-list{list-style:none}
    .b-list li{font-size:9.5px;color:#444;display:flex;gap:5px;margin-bottom:5px;line-height:1.4}
    .b-list li::before{content:'\\2022';color:#0A0A0A;flex-shrink:0}
    .s2-accent-bar{background:#FFD233;padding:20px 24px 18px;border-bottom:2.5px solid #12122A;flex-shrink:0}
    .open-badge{display:inline-block;background:#12122A;color:#FFD233;font-size:8px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:2px;margin-bottom:8px;text-transform:uppercase}
    .role-big{font-family:'Bebas Neue',sans-serif;font-size:48px;color:#0A0A0A;line-height:0.92}
    .s2-content{padding:16px 24px;flex:1;display:flex;flex-direction:column;min-height:0}
    .stat-row{display:flex;gap:10px;margin-bottom:18px}
    .stat-card{flex:1;border:2px solid #0A0A0A;border-radius:8px;padding:12px 14px}
    .stat-lbl{font-size:7.5px;font-weight:700;letter-spacing:2px;color:#999;text-transform:uppercase;margin-bottom:3px}
    .stat-val{font-family:'Bebas Neue',sans-serif;font-size:30px;color:#0A0A0A;line-height:1}
    .stat-sub{font-size:9px;color:#666;margin-top:2px;font-weight:500}
    .sec-lbl{font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:8px}
    .skill-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
    .stag{background:#FFD233;color:#0A0A0A;font-size:10px;font-weight:700;padding:5px 12px;border-radius:4px;border:1.5px solid #0A0A0A}
    .stag.outline{background:#fff}
    .perk-row{display:flex;gap:10px}
    .perk-chip{flex:1;display:flex;align-items:center;gap:8px;border:1.5px solid #E8E8E8;border-radius:8px;padding:10px 12px}
    .perk-icon{font-size:20px}
    .perk-txt{font-size:9.5px;font-weight:600;color:#0A0A0A;line-height:1.3}
    .perk-sub{font-size:8.5px;color:#888;font-weight:400}
    .s3-top{padding:16px 24px 12px;border-bottom:2.5px solid #12122A;flex-shrink:0}
    .s3-eyebrow{font-size:8.5px;font-weight:700;letter-spacing:2.5px;color:#aaa;text-transform:uppercase;margin-bottom:4px}
    .s3-headline{font-family:'Bebas Neue',sans-serif;font-size:56px;color:#0A0A0A;line-height:0.9}
    .resp-list{padding:8px 24px 12px;flex:1;list-style:none;display:flex;flex-direction:column;justify-content:space-evenly;min-height:0}
    .resp-item{display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #F0F0F0}
    .resp-item:last-child{border-bottom:none}
    .resp-num{font-family:'Bebas Neue',sans-serif;font-size:36px;color:#FFD233;line-height:1;flex-shrink:0;width:32px;-webkit-text-stroke:1.5px #0A0A0A}
    .resp-title{font-size:11px;font-weight:700;color:#0A0A0A;margin-bottom:2px;line-height:1.2}
    .resp-desc{font-size:9px;color:#666;line-height:1.45}
    .s4-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;position:relative}
    .apply-eyebrow{font-size:8.5px;font-weight:700;letter-spacing:3px;color:#bbb;text-transform:uppercase;margin-bottom:10px}
    .apply-headline{font-family:'Bebas Neue',sans-serif;font-size:68px;color:#0A0A0A;line-height:0.88;margin-bottom:14px}
    .apply-divider{width:48px;height:3px;background:#FFD233;border:1.5px solid #0A0A0A;margin:0 auto 16px}
    .apply-desc{font-size:11px;color:#666;line-height:1.65;max-width:310px;margin-bottom:22px}
    .email-box{display:inline-flex;align-items:center;gap:10px;background:#FFD233;border:2.5px solid #0A0A0A;border-radius:6px;padding:13px 22px;margin-bottom:10px}
    .email-at{font-size:18px;font-weight:800;color:#0A0A0A}
    .email-addr{font-size:13px;font-weight:800;color:#0A0A0A;letter-spacing:0.3px}
    .apply-note{font-size:8.5px;color:#bbb;letter-spacing:1px;text-transform:uppercase}
  </style>
</head>
<body>

  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div></div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body">
        <div class="s1-top">
          <div class="big-headline">MANTIS<br>SHRIMP</div>
          <div class="sub-headline">NATURE'S MOST EXTRAORDINARY HUNTER.</div>
        </div>
        <div class="illus-wrap">
          <svg viewBox="0 0 452 188" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <rect width="452" height="188" fill="#FFD233"/><ellipse cx="226" cy="200" rx="260" ry="80" fill="#12122A" opacity="0.08"/>
            <rect x="130" y="70" width="192" height="48" rx="24" fill="#12122A"/><rect x="148" y="78" width="156" height="32" rx="16" fill="#FFD233" opacity="0.4"/>
            <circle cx="150" cy="84" r="14" fill="#12122A"/><circle cx="146" cy="80" r="6" fill="#FFD233"/><circle cx="146" cy="80" r="3" fill="#12122A"/>
          </svg>
        </div>
        <div class="job-body">
          <div class="jb-left">
            <div class="job-title">Quick Facts</div>
            <ul class="d-list">
              <li>16 Color Receptors</li>
              <li>Strike: 23 m/s</li>
              <li>Force: 1,500 N</li>
            </ul>
            <p class="desc-p">A tiny crustacean with superhuman vision and a punch powerful enough to boil water and shatter aquarium glass.</p>
          </div>
          <div class="jb-right">
            <ul class="b-list">
              <li>Sees ultraviolet, infrared &amp; circular polarized light</li>
              <li>Creates cavitation bubbles at solar-surface temps</li>
              <li>Strikes with bullet-equivalent speed</li>
              <li>Two distinct variants — Spearers &amp; Smashers</li>
              <li>Bio-structure inspires modern armor &amp; helmets</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="browser-foot"><div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div></div>
    </div>
  </div>

  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div></div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body">
        <div class="s2-accent-bar">
          <div class="open-badge">SENSORY BIOLOGY</div>
          <div class="role-big">VISION &amp;<br>STRIKE POWER</div>
        </div>
        <div class="s2-content">
          <div class="stat-row">
            <div class="stat-card">
              <div class="stat-lbl">Color Cones</div>
              <div class="stat-val">16</div>
              <div class="stat-sub">vs human's 3</div>
            </div>
            <div class="stat-card" style="background:#FFD233;border-color:#0A0A0A;">
              <div class="stat-lbl" style="color:#665500;">Strike Speed</div>
              <div class="stat-val">23</div>
              <div class="stat-sub">m/s — bullet speed</div>
            </div>
            <div class="stat-card">
              <div class="stat-lbl">Impact Force</div>
              <div class="stat-val" style="font-size:22px;line-height:1.1;margin-top:2px;">1,500</div>
              <div class="stat-sub">Newtons of force</div>
            </div>
          </div>
          <div class="sec-lbl">Vision Capabilities</div>
          <div class="skill-tags">
            <span class="stag">Ultraviolet</span>
            <span class="stag">Infrared</span>
            <span class="stag">Circular Polarized</span>
            <span class="stag outline">16 Photoreceptors</span>
            <span class="stag outline">Speed-optimized</span>
          </div>
          <div class="sec-lbl">Strike Mechanics</div>
          <div class="perk-row">
            <div class="perk-chip">
              <div class="perk-icon">💥</div>
              <div><div class="perk-txt">Double Impact</div><div class="perk-sub">Cavitation 2nd hit</div></div>
            </div>
            <div class="perk-chip">
              <div class="perk-icon">🌞</div>
              <div><div class="perk-txt">~5,500°C</div><div class="perk-sub">Bubble temperature</div></div>
            </div>
            <div class="perk-chip">
              <div class="perk-icon">🔬</div>
              <div><div class="perk-txt">2× Per Strike</div><div class="perk-sub">Direct + shockwave</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="browser-foot"><div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div></div>
    </div>
  </div>

  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div></div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body">
        <div class="s3-top">
          <div class="s3-eyebrow">Mantis Shrimp — Classification &amp; Engineering</div>
          <div class="s3-headline">WHAT MAKES<br>IT DEADLY</div>
        </div>
        <ol class="resp-list">
          <li class="resp-item">
            <div class="resp-num">01</div>
            <div><div class="resp-title">Spearers — Precision Hunters</div><div class="resp-desc">Sharp spine appendages designed to impale soft-bodied fish mid-water with pinpoint accuracy.</div></div>
          </li>
          <li class="resp-item">
            <div class="resp-num">02</div>
            <div><div class="resp-title">Smashers — Brute Force Specialists</div><div class="resp-desc">Club-like dactyl appendages crack open crabs, snails and mollusks.</div></div>
          </li>
          <li class="resp-item">
            <div class="resp-num">03</div>
            <div><div class="resp-title">Helicoidal Fiber Structure</div><div class="resp-desc">The dactyl club is built like a spiral staircase — rotating fiber layers distribute impact.</div></div>
          </li>
          <li class="resp-item">
            <div class="resp-num">04</div>
            <div><div class="resp-title">Bio-Inspired Material Science</div><div class="resp-desc">Engineers replicate this structure to design stronger helmets and body armor.</div></div>
          </li>
          <li class="resp-item">
            <div class="resp-num">05</div>
            <div><div class="resp-title">Cavitation Phenomenon</div><div class="resp-desc">Strike collapses water bubbles at near-solar temps, generating a second shockwave.</div></div>
          </li>
        </ol>
      </div>
      <div class="browser-foot"><div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div></div>
    </div>
  </div>

  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div></div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body" style="position:relative;">
        <div class="s4-body">
          <div class="apply-eyebrow">Stomatopoda · ~450 Species · Ocean Floors</div>
          <div class="apply-headline">NATURE'S<br>MOST<br>EXTREME</div>
          <div class="apply-divider"></div>
          <p class="apply-desc">The mantis shrimp has been perfecting its design for over 400 million years. Its body is a masterclass in biological engineering.</p>
          <div class="email-box">
            <div class="email-at">🦐</div>
            <div class="email-addr">MANTIS SHRIMP</div>
          </div>
          <div class="apply-note">The apex micro-predator of the ocean floor</div>
        </div>
      </div>
      <div class="browser-foot"><div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div></div>
    </div>
  </div>

</body>
</html>`,

  // ─────────────────────────────────────────────────────
  // ACADEMIC POSTER — IBM Plex Serif + Mono — IEEE/ACM aesthetic
  // ─────────────────────────────────────────────────────
  "academic-poster": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${SLIDE_BASE}
    .slide{position:relative;width:540px;height:675px;padding:36px 40px;overflow:hidden;font-family:'IBM Plex Sans',sans-serif;flex-shrink:0;background:#FBF8F1;color:#0E1B33;border-top:6px double #0E1B33;}
    .slide::before{content:'';position:absolute;top:0;right:0;width:120px;height:6px;background:#A22E2E;}
    .slide h1{font-family:'IBM Plex Serif',serif;font-size:34px;font-weight:700;line-height:1.12;letter-spacing:-0.5px;margin-bottom:10px;color:#0E1B33;}
    .slide h2{font-family:'IBM Plex Serif',serif;font-size:22px;font-weight:600;line-height:1.2;margin-bottom:10px;color:#0E1B33;}
    .slide p{font-family:'IBM Plex Serif',serif;font-size:13px;line-height:1.6;color:#1F2C44;margin-bottom:10px;}
    .label{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.18em;color:#A22E2E;text-transform:uppercase;margin-bottom:14px;}
    .poster-rule{height:1px;background:#0E1B33;margin:14px 0;opacity:.25;}
    .abstract{background:#F2EBDC;border-left:3px solid #A22E2E;padding:12px 14px;font-family:'IBM Plex Serif',serif;font-size:12px;line-height:1.6;color:#0E1B33;margin:12px 0;}
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;}
    .stat-card{background:#fff;border:1px solid #0E1B33;padding:14px 16px;}
    .stat-card .num{font-family:'IBM Plex Serif',serif;font-size:30px;font-weight:700;color:#0E1B33;line-height:1;}
    .stat-card .slbl{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#5C6781;margin-top:6px;letter-spacing:.1em;text-transform:uppercase;}
    .poster-foot{position:absolute;bottom:14px;left:40px;right:40px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#5C6781;letter-spacing:.12em;text-transform:uppercase;}
  </style>
</head>
<body>
  <div class="slide">
    <div class="label">Working Paper · 2026</div>
    <h1>On the Diminishing Returns of Scaling Pretrained Transformers</h1>
    <p style="font-style:italic;">A meta-analysis of 142 published runs from 2020-2025</p>
    <div class="poster-rule"></div>
    <div class="abstract">We examine compute-vs-loss curves across 142 runs and find a phase transition near 10²² FLOPs after which marginal gains decline by 31%.</div>
    <div class="poster-foot"><span>SLIDESHOT POSTER SERIES</span><span>FIG. 1 / 2</span></div>
  </div>
  <div class="slide">
    <div class="label">Results · Selected Metrics</div>
    <h2>Headline Findings</h2>
    <div class="poster-rule"></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="num">142</div><div class="slbl">Studies Reviewed</div></div>
      <div class="stat-card"><div class="num">31%</div><div class="slbl">Marginal Drop-off</div></div>
      <div class="stat-card"><div class="num">10²²</div><div class="slbl">FLOPs Threshold</div></div>
      <div class="stat-card"><div class="num">0.87</div><div class="slbl">Pearson Correlation</div></div>
    </div>
    <div class="poster-foot"><span>SLIDESHOT POSTER SERIES</span><span>FIG. 2 / 2</span></div>
  </div>
</body>
</html>`,

  // ─────────────────────────────────────────────────────
  // CLINICAL MEDICAL — Source Sans + Serif — Medical chart aesthetic
  // ─────────────────────────────────────────────────────
  "clinical-medical": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    ${SLIDE_BASE}
    .slide{position:relative;width:540px;height:675px;padding:32px 36px;overflow:hidden;font-family:'Source Sans 3',sans-serif;flex-shrink:0;background:#FAFCFD;color:#0F2D3D;border-top:4px solid #0FA3A8;}
    .slide::after{content:'';position:absolute;top:0;left:0;right:0;height:24px;background:repeating-linear-gradient(90deg,transparent 0,transparent 9px,rgba(15,163,168,.18) 9px,rgba(15,163,168,.18) 10px);}
    .med-header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #D2E3E8;padding-bottom:8px;margin-bottom:14px;}
    .med-id{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;letter-spacing:.16em;text-transform:uppercase;}
    .med-status{font-family:'JetBrains Mono',monospace;font-size:9px;color:#0FA3A8;letter-spacing:.16em;text-transform:uppercase;font-weight:600;}
    .slide h1{font-family:'Source Serif 4',serif;font-size:32px;font-weight:700;color:#0F2D3D;line-height:1.12;margin-bottom:10px;}
    .slide h2{font-family:'Source Serif 4',serif;font-size:22px;font-weight:600;color:#0F2D3D;line-height:1.2;margin-bottom:10px;}
    .slide p{font-size:13px;line-height:1.6;color:#385468;margin-bottom:8px;}
    .label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.2em;color:#0FA3A8;text-transform:uppercase;margin-bottom:12px;}
    .vital-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0;}
    .vital-card{background:#fff;border:1px solid #D2E3E8;border-left:3px solid #0FA3A8;padding:12px 14px;}
    .vital-card.alert{border-left-color:#D8484F;}
    .vital-card .num{font-family:'Source Serif 4',serif;font-size:28px;font-weight:700;color:#0F2D3D;line-height:1;}
    .vital-card.alert .num{color:#D8484F;}
    .vital-card .slbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;margin-top:4px;letter-spacing:.1em;text-transform:uppercase;}
  </style>
</head>
<body>
  <div class="slide">
    <div class="med-header"><div class="med-id">Record · Page 1/2</div><div class="med-status">INTAKE FORM</div></div>
    <div class="label">Patient Brief</div>
    <h1>Hypertension Stage II — Differential Diagnosis</h1>
    <p>Cross-referenced against 32 comorbidity markers and lipid panels. Recommend immediate lifestyle intervention; monitor BP daily for 14 days.</p>
    <div class="vital-grid">
      <div class="vital-card alert"><div class="num">156/98</div><div class="slbl">Blood Pressure</div></div>
      <div class="vital-card"><div class="num">72</div><div class="slbl">Heart Rate · BPM</div></div>
      <div class="vital-card"><div class="num">98.4</div><div class="slbl">Temperature · °F</div></div>
      <div class="vital-card alert"><div class="num">214</div><div class="slbl">LDL · mg/dL</div></div>
    </div>
  </div>
  <div class="slide">
    <div class="med-header"><div class="med-id">Record · Page 2/2</div><div class="med-status">PROTOCOL</div></div>
    <div class="label">Care Plan · 14-Day Window</div>
    <h2>Recommended Course</h2>
    <p>Initiate ACE inhibitor (Lisinopril 10mg) and dietary sodium restriction. Re-evaluate at day 14; escalate if systolic remains > 140 mmHg.</p>
  </div>
</body>
</html>`,

  // ─────────────────────────────────────────────────────
  // SKETCH HANDDRAWN — Caveat + Architects Daughter — whiteboard feel
  // ─────────────────────────────────────────────────────
  "sketch-handdrawn": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Architects+Daughter&family=Patrick+Hand&display=swap" rel="stylesheet">
  <style>
    ${SLIDE_BASE}
    .slide{position:relative;width:540px;height:675px;padding:36px 40px;overflow:hidden;font-family:'Patrick Hand',cursive;flex-shrink:0;background:#FFFEF7;color:#1F1F1F;}
    .slide::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 1px 1px,rgba(0,0,0,.08) 1px,transparent 0);background-size:18px 18px;opacity:.5;}
    .slide::after{content:'';position:absolute;inset:14px;border:2px dashed #1F1F1F;pointer-events:none;border-radius:4px;}
    .slide-inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;}
    .slide h1{font-family:'Caveat',cursive;font-size:48px;font-weight:700;line-height:1;margin-bottom:14px;transform:rotate(-1deg);}
    .slide h2{font-family:'Caveat',cursive;font-size:34px;font-weight:600;line-height:1.05;margin-bottom:10px;transform:rotate(-0.5deg);}
    .slide p{font-family:'Architects Daughter',cursive;font-size:14px;line-height:1.65;color:#333;margin-bottom:10px;}
    .label{font-family:'Architects Daughter',cursive;font-size:13px;color:#D9534F;letter-spacing:.05em;margin-bottom:14px;text-transform:uppercase;font-weight:600;}
    .label::before{content:'~ ';}.label::after{content:' ~';}
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0;}
    .stat-card{background:#FFFCEE;border:2px solid #1F1F1F;padding:14px 16px;border-radius:6px;transform:rotate(-0.4deg);}
    .stat-card:nth-child(2n){transform:rotate(0.6deg);}
    .stat-card .num{font-family:'Caveat',cursive;font-size:38px;font-weight:700;line-height:1;}
    .stat-card .slbl{font-family:'Architects Daughter',cursive;font-size:11px;color:#666;margin-top:4px;}
    .badge{display:inline-block;padding:5px 12px;font-family:'Architects Daughter',cursive;font-size:11px;font-weight:600;background:#FFF6CC;color:#1F1F1F;border:2px solid #1F1F1F;border-radius:14px;margin:3px;transform:rotate(-1deg);}
  </style>
</head>
<body>
  <div class="slide"><div class="slide-inner">
    <div class="label">Sprint Retro · Week 14</div>
    <h1>What we shipped, what slipped</h1>
    <p>We hit 4 of 6 commitments. Here's what we learned.</p>
    <div class="stat-grid">
      <div class="stat-card"><div class="num">4/6</div><div class="slbl">commits delivered</div></div>
      <div class="stat-card"><div class="num">12d</div><div class="slbl">cycle time (-3d)</div></div>
    </div>
    <div style="margin-top:14px;">
      <span class="badge">paid-tier</span>
      <span class="badge">migrations</span>
      <span class="badge">blocked-on-design</span>
    </div>
  </div></div>
  <div class="slide"><div class="slide-inner">
    <div class="label">Key Takeaway</div>
    <h2>Smaller PRs ship 2x faster.</h2>
    <p>Every PR &gt; 400 LoC took at least 2 review cycles this sprint. Cap at 200.</p>
  </div></div>
</body>
</html>`,

};
