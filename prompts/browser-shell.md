# Browser Shell Carousel — Browser Window Chrome Style

Generate a **4-slide carousel** using a browser-window chrome design. The content can be about any topic — nature, technology, education, storytelling, etc.

## Design Tokens

```
Colors:
  Primary Yellow:   #FFD233
  Dark Navy:        #12122A
  Black Text:       #0A0A0A
  White:            #FFFFFF
  Body Copy:        #444444
  Subtle Gray:      #F4F4F4
  Border/HR:        #12122A

Typography:
  Display / Hero:   Bebas Neue (Google Fonts)
  Body / UI:        DM Sans (Google Fonts)
  Weights:          300, 400, 500, 600, 700, 800

Spacing Scale:
  Base unit: 8px
  Sections: 24px padding (3 units)
  Slide outer: 20px (2.5 units)

Border Radius:
  Browser shell: 14px
  Illustration box: 10px
  Tags: 4px
  Stat cards: 8px
```

## Layout System

- Outer slide: `#FFD233` bg + 20px padding = visible yellow border
- Browser shell: 14px border-radius, navy with subtle inset highlight
- Traffic lights: red `#FF6059`, amber `#FEBC2E`, inactive `#2A2A44`
- Content padding: 24px horizontal throughout
- HR dividers: 2.5px solid `#12122A`

## Slide Structure

Each slide is 540×675px with this shell:

```html
<div class="slide">          <!-- yellow bg, 20px padding -->
  <div class="browser">      <!-- navy shell, 14px radius -->
    <div class="browser-bar"> <!-- traffic lights + brand -->
    <div class="browser-body"><!-- white content area -->
    <div class="browser-foot"><!-- navy footer bar -->
  </div>
</div>
```

## 4 Slides

1. **Main Cover** — Bold headline (Bebas Neue 70px), illustration area, key facts in 2-column layout
2. **Stats & Details** — Yellow accent header with badge, 3 stat cards, tag chips, info chips
3. **Breakdown / List** — Numbered list (01–05) with Bebas Neue numbers, title + description per item
4. **Closing CTA** — Centered layout, large headline, call-to-action box with yellow bg, decorative blobs

## Complete HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #1a1a1a;
      padding: 48px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      align-items: flex-start;
    }
    .slide {
      position: relative;
      width: 540px;
      height: 675px;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      flex-shrink: 0;
      background: #FFD233;
      padding: 20px;
    }
    .browser {
      width: 100%;
      height: 100%;
      background: #12122A;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 0 rgba(255,255,255,0.06) inset, 0 20px 50px rgba(0,0,0,0.35);
    }
    .browser-bar {
      background: #12122A;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      height: 42px;
    }
    .dots { display: flex; gap: 7px; align-items: center; }
    .dot  { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
    .dot-r { background: #FF6059; }
    .dot-o { background: #FEBC2E; }
    .dot-g { background: #2A2A44; }
    .brand-name {
      color: #fff;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.3px;
      font-family: 'DM Sans', sans-serif;
    }
    .browser-body {
      background: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }
    .browser-foot {
      background: #12122A;
      padding: 10px 24px;
      text-align: center;
      flex-shrink: 0;
    }
    .foot-txt {
      color: #fff;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 2.2px;
      text-transform: uppercase;
    }

    /* SLIDE 1 */
    .s1-top {
      padding: 16px 24px 12px;
      border-bottom: 2.5px solid #12122A;
      flex-shrink: 0;
    }
    .big-headline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 70px;
      color: #0A0A0A;
      line-height: 0.9;
      letter-spacing: 1px;
    }
    .sub-headline {
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 2.8px;
      color: #0A0A0A;
      margin-top: 7px;
      text-transform: uppercase;
    }
    .illus-wrap {
      margin: 10px 24px 0;
      border-radius: 10px;
      background: #FFD233;
      height: 188px;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }
    .illus-wrap svg { width: 100%; height: 100%; }
    .job-body {
      padding: 10px 24px 12px;
      display: flex;
      gap: 16px;
      flex: 1;
      min-height: 0;
    }
    .jb-left { flex: 0 0 44%; }
    .jb-right { flex: 1; }
    .job-title {
      font-size: 13px;
      font-weight: 800;
      color: #0A0A0A;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .d-list { list-style: none; margin-bottom: 9px; }
    .d-list li {
      font-size: 10.5px;
      font-weight: 700;
      color: #0A0A0A;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .d-list li::before {
      content: '\25C6';
      color: #FFD233;
      font-size: 8px;
      margin-top: 2px;
      flex-shrink: 0;
      -webkit-text-stroke: 0.8px #0A0A0A;
    }
    .desc-p { font-size: 9px; color: #555; line-height: 1.55; }
    .b-list { list-style: none; }
    .b-list li {
      font-size: 9.5px;
      color: #444;
      display: flex;
      gap: 5px;
      margin-bottom: 5px;
      line-height: 1.4;
    }
    .b-list li::before { content: '\2022'; color: #0A0A0A; flex-shrink: 0; }

    /* SLIDE 2 */
    .s2-accent-bar {
      background: #FFD233;
      padding: 20px 24px 18px;
      border-bottom: 2.5px solid #12122A;
      flex-shrink: 0;
    }
    .open-badge {
      display: inline-block;
      background: #12122A;
      color: #FFD233;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 4px 10px;
      border-radius: 2px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .role-big {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 48px;
      color: #0A0A0A;
      line-height: 0.92;
    }
    .s2-content {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .stat-row { display: flex; gap: 10px; margin-bottom: 18px; }
    .stat-card {
      flex: 1;
      border: 2px solid #0A0A0A;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .stat-lbl {
      font-size: 7.5px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .stat-val {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 30px;
      color: #0A0A0A;
      line-height: 1;
    }
    .stat-sub { font-size: 9px; color: #666; margin-top: 2px; font-weight: 500; }
    .sec-lbl {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 8px;
    }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
    .stag {
      background: #FFD233;
      color: #0A0A0A;
      font-size: 10px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 4px;
      border: 1.5px solid #0A0A0A;
    }
    .stag.outline { background: #fff; }
    .perk-row { display: flex; gap: 10px; }
    .perk-chip {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1.5px solid #E8E8E8;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .perk-icon { font-size: 20px; }
    .perk-txt { font-size: 9.5px; font-weight: 600; color: #0A0A0A; line-height: 1.3; }
    .perk-sub { font-size: 8.5px; color: #888; font-weight: 400; }

    /* SLIDE 3 */
    .s3-top {
      padding: 16px 24px 12px;
      border-bottom: 2.5px solid #12122A;
      flex-shrink: 0;
    }
    .s3-eyebrow {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 2.5px;
      color: #aaa;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .s3-headline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 56px;
      color: #0A0A0A;
      line-height: 0.9;
    }
    .resp-list {
      padding: 8px 24px 12px;
      flex: 1;
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      min-height: 0;
    }
    .resp-item {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid #F0F0F0;
    }
    .resp-item:last-child { border-bottom: none; }
    .resp-num {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 36px;
      color: #FFD233;
      line-height: 1;
      flex-shrink: 0;
      width: 32px;
      -webkit-text-stroke: 1.5px #0A0A0A;
    }
    .resp-title { font-size: 11px; font-weight: 700; color: #0A0A0A; margin-bottom: 2px; line-height: 1.2; }
    .resp-desc { font-size: 9px; color: #666; line-height: 1.45; }

    /* SLIDE 4 */
    .s4-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      position: relative;
    }
    .apply-eyebrow {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #bbb;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .apply-headline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 68px;
      color: #0A0A0A;
      line-height: 0.88;
      margin-bottom: 14px;
    }
    .apply-divider {
      width: 48px;
      height: 3px;
      background: #FFD233;
      border: 1.5px solid #0A0A0A;
      margin: 0 auto 16px;
    }
    .apply-desc {
      font-size: 11px;
      color: #666;
      line-height: 1.65;
      max-width: 310px;
      margin-bottom: 22px;
    }
    .email-box {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #FFD233;
      border: 2.5px solid #0A0A0A;
      border-radius: 6px;
      padding: 13px 22px;
      margin-bottom: 10px;
    }
    .email-at { font-size: 18px; font-weight: 800; color: #0A0A0A; }
    .email-addr { font-size: 13px; font-weight: 800; color: #0A0A0A; letter-spacing: 0.3px; }
    .apply-note { font-size: 8.5px; color: #bbb; letter-spacing: 1px; text-transform: uppercase; }
    .blob {
      position: absolute;
      border-radius: 50%;
      background: #FFD233;
      opacity: 0.12;
      pointer-events: none;
    }
    .s4-company-row {
      position: absolute;
      bottom: 20px;
      left: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .s4-logo { font-size: 22px; font-weight: 800; color: #ddd; letter-spacing: -0.5px; }
    .s4-tagline { font-size: 8px; color: #bbb; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; }
  </style>
</head>
<body>

  <!-- SLIDE 1 — MAIN COVER -->
  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots">
          <div class="dot dot-r"></div>
          <div class="dot dot-o"></div>
          <div class="dot dot-g"></div>
        </div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body">
        <div class="s1-top">
          <div class="big-headline">MANTIS<br>SHRIMP</div>
          <div class="sub-headline">NATURE'S MOST EXTRAORDINARY HUNTER.</div>
        </div>
        <div class="illus-wrap">
          <svg viewBox="0 0 452 188" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <rect width="452" height="188" fill="#FFD233"/>
            <ellipse cx="226" cy="200" rx="260" ry="80" fill="#12122A" opacity="0.08"/>
            <rect x="130" y="70" width="192" height="48" rx="24" fill="#12122A"/>
            <rect x="148" y="78" width="156" height="32" rx="16" fill="#FFD233" opacity="0.4"/>
            <line x1="178" y1="70" x2="178" y2="118" stroke="#FFD233" stroke-width="2"/>
            <line x1="210" y1="70" x2="210" y2="118" stroke="#FFD233" stroke-width="2"/>
            <line x1="242" y1="70" x2="242" y2="118" stroke="#FFD233" stroke-width="2"/>
            <line x1="274" y1="70" x2="274" y2="118" stroke="#FFD233" stroke-width="2"/>
            <line x1="306" y1="70" x2="306" y2="118" stroke="#FFD233" stroke-width="2"/>
            <ellipse cx="330" cy="94" rx="14" ry="8" fill="#12122A" transform="rotate(-15 330 94)"/>
            <ellipse cx="343" cy="88" rx="12" ry="6" fill="#12122A" transform="rotate(-30 343 88)"/>
            <ellipse cx="343" cy="100" rx="12" ry="6" fill="#12122A" transform="rotate(30 343 100)"/>
            <ellipse cx="354" cy="94" rx="10" ry="5" fill="#12122A" transform="rotate(-45 354 94)"/>
            <ellipse cx="354" cy="99" rx="10" ry="5" fill="#12122A" transform="rotate(45 354 99)"/>
            <circle cx="150" cy="84" r="14" fill="#12122A"/>
            <circle cx="146" cy="80" r="6" fill="#FFD233"/>
            <circle cx="146" cy="80" r="3" fill="#12122A"/>
            <rect x="100" y="82" width="46" height="14" rx="7" fill="#12122A" transform="rotate(-20 100 82)"/>
            <ellipse cx="96" cy="76" rx="12" ry="8" fill="#12122A" transform="rotate(-20 96 76)"/>
            <line x1="148" y1="72" x2="80" y2="36" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="155" y1="70" x2="98" y2="24" stroke="#12122A" stroke-width="2" stroke-linecap="round"/>
            <line x1="180" y1="118" x2="165" y2="148" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="200" y1="118" x2="192" y2="152" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="220" y1="118" x2="218" y2="154" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="240" y1="118" x2="244" y2="152" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="260" y1="118" x2="270" y2="148" stroke="#12122A" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="72" cy="80" r="22" fill="none" stroke="#12122A" stroke-width="2" stroke-dasharray="4 3"/>
            <line x1="58" y1="66" x2="48" y2="56" stroke="#12122A" stroke-width="2"/>
            <line x1="50" y1="80" x2="36" y2="80" stroke="#12122A" stroke-width="2"/>
            <line x1="58" y1="94" x2="48" y2="104" stroke="#12122A" stroke-width="2"/>
            <rect x="0" y="168" width="452" height="20" fill="#12122A" opacity="0.12" rx="2"/>
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
              <li>Sees ultraviolet, infrared & circular polarized light</li>
              <li>Creates cavitation bubbles at solar-surface temps</li>
              <li>Strikes with bullet-equivalent speed</li>
              <li>Two distinct variants — Spearers & Smashers</li>
              <li>Bio-structure inspires modern armor & helmets</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="browser-foot">
        <div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div>
      </div>
    </div>
  </div>

  <!-- SLIDE 2 — VISION & STRIKE STATS -->
  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots">
          <div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div>
        </div>
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
              <div>
                <div class="perk-txt">Double Impact</div>
                <div class="perk-sub">Cavitation 2nd hit</div>
              </div>
            </div>
            <div class="perk-chip">
              <div class="perk-icon">🌞</div>
              <div>
                <div class="perk-txt">~5,500°C</div>
                <div class="perk-sub">Bubble temperature</div>
              </div>
            </div>
            <div class="perk-chip">
              <div class="perk-icon">🔬</div>
              <div>
                <div class="perk-txt">2× Per Strike</div>
                <div class="perk-sub">Direct + shockwave</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="browser-foot">
        <div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div>
      </div>
    </div>
  </div>

  <!-- SLIDE 3 — CLASSIFICATION & ENGINEERING -->
  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots">
          <div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div>
        </div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body">
        <div class="s3-top">
          <div class="s3-eyebrow">Mantis Shrimp — Classification & Engineering</div>
          <div class="s3-headline">WHAT MAKES<br>IT DEADLY</div>
        </div>
        <ol class="resp-list">
          <li class="resp-item">
            <div class="resp-num">01</div>
            <div>
              <div class="resp-title">Spearers — Precision Hunters</div>
              <div class="resp-desc">Sharp spine appendages designed to impale soft-bodied fish mid-water with pinpoint accuracy and explosive speed.</div>
            </div>
          </li>
          <li class="resp-item">
            <div class="resp-num">02</div>
            <div>
              <div class="resp-title">Smashers — Brute Force Specialists</div>
              <div class="resp-desc">Club-like dactyl appendages crack open crabs, snails and mollusks — powerful enough to shatter aquarium glass.</div>
            </div>
          </li>
          <li class="resp-item">
            <div class="resp-num">03</div>
            <div>
              <div class="resp-title">Helicoidal Fiber Structure</div>
              <div class="resp-desc">The dactyl club is built like a spiral staircase — rotating fiber layers distribute impact and prevent fractures.</div>
            </div>
          </li>
          <li class="resp-item">
            <div class="resp-num">04</div>
            <div>
              <div class="resp-title">Bio-Inspired Material Science</div>
              <div class="resp-desc">Engineers replicate this structure to design stronger helmets, body armor, and aerospace impact panels.</div>
            </div>
          </li>
          <li class="resp-item">
            <div class="resp-num">05</div>
            <div>
              <div class="resp-title">Cavitation Phenomenon</div>
              <div class="resp-desc">Strike collapses water bubbles at near-solar temps (~5,500°C), generating a second devastating shockwave on every hit.</div>
            </div>
          </li>
        </ol>
      </div>
      <div class="browser-foot">
        <div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div>
      </div>
    </div>
  </div>

  <!-- SLIDE 4 — CLOSING FACTS CTA -->
  <div class="slide">
    <div class="browser">
      <div class="browser-bar">
        <div class="dots">
          <div class="dot dot-r"></div><div class="dot dot-o"></div><div class="dot dot-g"></div>
        </div>
        <div class="brand-name">nature.wiki</div>
      </div>
      <div class="browser-body" style="position:relative;">
        <div class="blob" style="width:260px;height:260px;top:-60px;right:-60px;"></div>
        <div class="blob" style="width:160px;height:160px;bottom:40px;left:-40px;"></div>
        <div class="s4-body">
          <div class="apply-eyebrow">Stomatopoda · ~450 Species · Ocean Floors</div>
          <div class="apply-headline">NATURE'S<br>MOST<br>EXTREME</div>
          <div class="apply-divider"></div>
          <p class="apply-desc">The mantis shrimp has been perfecting its design for over 400 million years. Its body is a masterclass in biological engineering — and science is only beginning to catch up.</p>
          <div class="email-box">
            <div class="email-at">🦐</div>
            <div class="email-addr">MANTIS SHRIMP</div>
          </div>
          <div class="apply-note">The apex micro-predator of the ocean floor</div>
        </div>
        <div class="s4-company-row">
          <div class="s4-logo">nature.wiki</div>
          <div class="s4-tagline">Deep Sea Chronicles · Vol. 1</div>
        </div>
      </div>
      <div class="browser-foot">
        <div class="foot-txt">DEEP SEA CHRONICLES — STOMATOPODA EDITION</div>
      </div>
    </div>
  </div>

</body>
</html>
```
