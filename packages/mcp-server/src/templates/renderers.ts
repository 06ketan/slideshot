import type { SlideData } from "./types.js";

type SlideRenderer = (slide: SlideData, index: number, total: number) => string;
type ThemeRendererMap = Record<string, SlideRenderer>;

function esc(s: string | undefined | null): string {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Generic ──

const genericRenderers: ThemeRendererMap = {
  cover: (s) => {
    if (s.type !== "cover") return "";
    return `<div class="slide">
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
  ${s.badges?.length ? `<div class="tag-row">${s.badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}</div>` : ""}
</div>`;
  },
  content: (s) => {
    if (s.type !== "content") return "";
    return `<div class="slide">
  ${s.label ? `<div class="label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  ${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("\n  ")}
</div>`;
  },
  stats: (s) => {
    if (s.type !== "stats") return "";
    return `<div class="slide">
  ${s.label ? `<div class="label">${esc(s.label)}</div>` : ""}
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="stat-grid">
    ${(s.cards ?? []).map(c => `<div class="stat-card"><div class="num">${esc(c.value)}</div><div class="slbl">${esc(c.label)}</div>${c.sub ? `<div class="slbl">${esc(c.sub)}</div>` : ""}</div>`).join("\n    ")}
  </div>
  ${s.tags?.length ? `<div class="tag-row">${s.tags.map(t => `<span class="badge">${esc(t)}</span>`).join("")}</div>` : ""}
</div>`;
  },
  list: (s) => {
    if (s.type !== "list") return "";
    return `<div class="slide">
  ${s.label ? `<div class="label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  <ul class="item-list">
    ${(s.items ?? []).map((it, i) => `<li><span class="item-num">${String(i + 1).padStart(2, "0")}</span><div><span class="item-title">${esc(it.title)}</span>${it.description ? `<span class="item-desc">${esc(it.description)}</span>` : ""}${it.tag ? ` <span class="badge">${esc(it.tag)}</span>` : ""}</div></li>`).join("\n    ")}
  </ul>
</div>`;
  },
  steps: (s) => {
    if (s.type !== "steps") return "";
    return `<div class="slide">
  ${s.label ? `<div class="label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  <ul class="item-list">
    ${(s.items ?? []).map(it => `<li><span class="item-num">${it.num}</span><div><span class="item-title">${esc(it.title)}</span><span class="item-desc">${esc(it.description)}</span></div></li>`).join("\n    ")}
  </ul>
</div>`;
  },
  comparison: (s) => {
    if (s.type !== "comparison") return "";
    return `<div class="slide">
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="compare-grid">
    <div class="compare-col compare-left">
      <div class="compare-label">${esc(s.leftLabel)}</div>
      ${(s.left ?? []).map(it => `<div class="compare-item"><div class="ci-label">${esc(it.label)}</div>${it.description ? `<div class="ci-desc">${esc(it.description)}</div>` : ""}</div>`).join("\n      ")}
    </div>
    <div class="compare-col compare-right">
      <div class="compare-label">${esc(s.rightLabel)}</div>
      ${(s.right ?? []).map(it => `<div class="compare-item"><div class="ci-label">${esc(it.label)}</div>${it.description ? `<div class="ci-desc">${esc(it.description)}</div>` : ""}</div>`).join("\n      ")}
    </div>
  </div>
</div>`;
  },
  quote: (s) => {
    if (s.type !== "quote") return "";
    return `<div class="slide">
  ${s.label ? `<div class="label">${esc(s.label)}</div>` : ""}
  <div class="quote-block">${esc(s.quote)}</div>
  ${s.attribution ? `<div class="attribution">— ${esc(s.attribution)}</div>` : ""}
</div>`;
  },
  code: (s) => {
    if (s.type !== "code") return "";
    return `<div class="slide">
  <h2>${esc(s.title)}</h2>
  <div class="code-block">${esc(s.code)}</div>
</div>`;
  },
  cta: (s) => {
    if (s.type !== "cta") return "";
    return `<div class="slide">
  <div class="cta-center">
    <h1>${esc(s.headline)}</h1>
    ${s.description ? `<p>${esc(s.description)}</p>` : ""}
    ${s.action ? `<div class="badge">${esc(s.action)}</div>` : ""}
    ${s.email ? `<p style="font-weight:700;margin-top:12px;">${esc(s.email)}</p>` : ""}
    ${s.note ? `<p style="font-size:11px;color:#888;margin-top:8px;">${esc(s.note)}</p>` : ""}
  </div>
</div>`;
  },
  timeline: (s) => {
    if (s.type !== "timeline") return "";
    return `<div class="slide">
  <h2>${esc(s.title)}</h2>
  <div class="timeline">
    ${(s.items ?? []).map(it => `<div class="tl-item"><div class="tl-year">${esc(it.year)}</div><div class="tl-desc">${esc(it.description)}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
  team: (s) => {
    if (s.type !== "team") return "";
    return `<div class="slide">
  <h2>${esc(s.title)}</h2>
  <div class="team-grid">
    ${(s.members ?? []).map(m => `<div class="team-card"><div class="avatar">${m.emoji || "👤"}</div><div class="tname">${esc(m.name)}</div><div class="trole">${esc(m.role)}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
};

// ── Instagram Carousel ──

const GRADIENTS = ["gradient-purple", "gradient-pink", "gradient-blue", "gradient-sunset"];

const instagramRenderers: ThemeRendererMap = {
  cover: (s, idx) => {
    if (s.type !== "cover") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
  ${s.badges?.length ? `<div>${s.badges.map(b => `<span class="tag">${esc(b)}</span>`).join("")}</div>` : ""}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  content: (s, idx) => {
    if (s.type !== "content") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  <h2>${esc(s.title)}</h2>
  ${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("\n  ")}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  stats: (s, idx) => {
    if (s.type !== "stats") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  ${(s.cards ?? []).map(c => `<div class="card"><div class="stat-big">${esc(c.value)}</div><div class="stat-label">${esc(c.label)}</div></div>`).join("\n  ")}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  list: (s, idx) => {
    if (s.type !== "list") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  <h2>${esc(s.title)}</h2>
  ${(s.items ?? []).map(it => `<div class="card"><strong>${esc(it.title)}</strong>${it.description ? `<p style="margin:4px 0 0;font-size:14px;color:#555;">${esc(it.description)}</p>` : ""}</div>`).join("\n  ")}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  steps: (s, idx) => {
    if (s.type !== "steps") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  <h2>${esc(s.title)}</h2>
  ${(s.items ?? []).map(it => `<div class="card"><strong>${it.num}. ${esc(it.title)}</strong><p style="margin:4px 0 0;font-size:14px;color:#555;">${esc(it.description)}</p></div>`).join("\n  ")}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  quote: (s, idx) => {
    if (s.type !== "quote") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}">
  <div class="quote">${esc(s.quote)}</div>
  ${s.attribution ? `<p style="font-size:14px;color:rgba(255,255,255,.7);">— ${esc(s.attribution)}</p>` : ""}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
  cta: (s, idx) => {
    if (s.type !== "cta") return "";
    const g = GRADIENTS[idx % GRADIENTS.length];
    return `<div class="slide ${g}" style="text-align:center;">
  <h1>${esc(s.headline)}</h1>
  ${s.description ? `<p>${esc(s.description)}</p>` : ""}
  ${s.action ? `<span class="pill pill-white">${esc(s.action)}</span>` : ""}
  <div class="swipe-dots">${Array.from({ length: 6 }, (_, i) => `<div class="sdot${i === idx ? " active" : ""}"></div>`).join("")}</div>
</div>`;
  },
};

// ── Infographic ──

const infographicRenderers: ThemeRendererMap = {
  cover: (s, idx, total) => {
    if (s.type !== "cover") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
  ${s.badges?.length ? `<div>${s.badges.map(b => `<span class="badge badge-blue">${esc(b)}</span>`).join(" ")}</div>` : ""}
</div>`;
  },
  stats: (s, idx, total) => {
    if (s.type !== "stats") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-header">${esc(s.label)}</div>` : ""}
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="stat-row">
    ${(s.cards ?? []).map(c => `<div class="stat-card"><div class="num">${esc(c.value)}</div><div class="label">${esc(c.label)}</div>${c.sub ? `<div class="sub">${esc(c.sub)}</div>` : ""}</div>`).join("\n    ")}
  </div>
</div>`;
  },
  list: (s, idx, total) => {
    if (s.type !== "list") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-header">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  <ul class="numbered-list">
    ${(s.items ?? []).map(it => `<li><div><strong>${esc(it.title)}</strong>${it.description ? `<br><span style="font-size:11px;color:#64748B;">${esc(it.description)}</span>` : ""}</div></li>`).join("\n    ")}
  </ul>
</div>`;
  },
  steps: (s, idx, total) => {
    if (s.type !== "steps") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  <h2>${esc(s.title)}</h2>
  <div class="flow-row">
    ${(s.items ?? []).map((it, i) => `${i > 0 ? '<span class="flow-arrow">→</span>' : ""}<div class="flow-step">${esc(it.title)}</div>`).join("\n    ")}
  </div>
</div>`;
  },
  content: (s, idx, total) => {
    if (s.type !== "content") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-header">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  ${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("\n  ")}
</div>`;
  },
  cta: (s, idx, total) => {
    if (s.type !== "cta") return "";
    return `<div class="slide">
  <span class="slide-num">${idx + 1}/${total}</span>
  <h1>${esc(s.headline)}</h1>
  ${s.description ? `<div class="callout">${esc(s.description)}</div>` : ""}
  ${s.action ? `<span class="badge badge-blue" style="font-size:14px;padding:8px 20px;">${esc(s.action)}</span>` : ""}
</div>`;
  },
};

// ── Pitch Deck ──

const pitchDeckRenderers: ThemeRendererMap = {
  cover: (s, idx, total) => {
    if (s.type !== "cover") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  <div class="section-label">INTRODUCTION</div>
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<h3>${esc(s.subtitle)}</h3>` : ""}
</div>`;
  },
  content: (s, idx, total) => {
    if (s.type !== "content") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  ${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("\n  ")}
</div>`;
  },
  stats: (s, idx, total) => {
    if (s.type !== "stats") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-label">${esc(s.label)}</div>` : ""}
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="kpi-grid">
    ${(s.cards ?? []).map(c => `<div class="kpi"><div class="num">${esc(c.value)}</div><div class="label">${esc(c.label)}</div>${c.trend ? `<div class="trend">${esc(c.trend)}</div>` : ""}</div>`).join("\n    ")}
  </div>
</div>`;
  },
  list: (s, idx, total) => {
    if (s.type !== "list") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  ${s.label ? `<div class="section-label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  <div class="feature-list">
    ${(s.items ?? []).map(it => `<div class="feature"><span class="check">✓</span><div><span class="ftxt">${esc(it.title)}</span>${it.description ? `<span class="fsub">${esc(it.description)}</span>` : ""}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
  timeline: (s, idx, total) => {
    if (s.type !== "timeline") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  <div class="section-label">TIMELINE</div>
  <h2>${esc(s.title)}</h2>
  <div class="timeline">
    ${(s.items ?? []).map(it => `<div class="tl-item"><div class="year">${esc(it.year)}</div><div class="desc">${esc(it.description)}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
  team: (s, idx, total) => {
    if (s.type !== "team") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  <div class="section-label">TEAM</div>
  <h2>${esc(s.title)}</h2>
  <div class="team-grid">
    ${(s.members ?? []).map(m => `<div class="team-card"><div class="avatar">${m.emoji || "👤"}</div><div class="name">${esc(m.name)}</div><div class="role">${esc(m.role)}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
  cta: (s, idx, total) => {
    if (s.type !== "cta") return "";
    return `<div class="slide">
  <div class="accent-bar"></div>
  <span class="slide-number">${idx + 1}/${total}</span>
  <div class="section-label">NEXT STEPS</div>
  <h1>${esc(s.headline)}</h1>
  ${s.description ? `<p>${esc(s.description)}</p>` : ""}
  ${s.email ? `<p style="font-weight:700;color:#3B82F6;margin-top:12px;">${esc(s.email)}</p>` : ""}
</div>`;
  },
};

// ── Dark Modern ──

const darkModernRenderers: ThemeRendererMap = {
  cover: (s) => {
    if (s.type !== "cover") return "";
    return `<div class="slide grid-bg">
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
  <div class="accent-line"></div>
  ${s.badges?.length ? `<div>${s.badges.map(b => `<span class="chip chip-cyan">${esc(b)}</span>`).join("")}</div>` : ""}
</div>`;
  },
  content: (s) => {
    if (s.type !== "content") return "";
    return `<div class="slide grid-bg">
  <h2>${esc(s.title)}</h2>
  <div class="accent-line"></div>
  ${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("\n  ")}
</div>`;
  },
  stats: (s) => {
    if (s.type !== "stats") return "";
    return `<div class="slide grid-bg">
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="metric-row">
    ${(s.cards ?? []).map(c => `<div class="metric glow-cyan"><div class="val">${esc(c.value)}</div><div class="mlabel">${esc(c.label)}</div></div>`).join("\n    ")}
  </div>
  ${s.tags?.length ? `<div style="margin-top:12px;">${s.tags.map(t => `<span class="chip chip-magenta">${esc(t)}</span>`).join("")}</div>` : ""}
</div>`;
  },
  steps: (s) => {
    if (s.type !== "steps") return "";
    return `<div class="slide grid-bg">
  <h2>${esc(s.title)}</h2>
  <div class="step-grid">
    ${(s.items ?? []).map(it => `<div class="step glow-cyan"><div class="snum">${String(it.num).padStart(2, "0")}</div><div class="stitle">${esc(it.title)}</div><div class="sdesc">${esc(it.description)}</div></div>`).join("\n    ")}
  </div>
</div>`;
  },
  code: (s) => {
    if (s.type !== "code") return "";
    return `<div class="slide grid-bg">
  <h2>${esc(s.title)}</h2>
  <div class="code-block">${esc(s.code)}</div>
</div>`;
  },
  cta: (s) => {
    if (s.type !== "cta") return "";
    return `<div class="slide grid-bg" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
  <h1><span class="neon-text">${esc(s.headline)}</span></h1>
  ${s.description ? `<p>${esc(s.description)}</p>` : ""}
  <div class="accent-line" style="width:60px;"></div>
  ${s.action ? `<span class="chip chip-cyan" style="font-size:14px;padding:8px 20px;">${esc(s.action)}</span>` : ""}
  ${s.email ? `<p style="color:#22D3EE;font-weight:700;margin-top:12px;">${esc(s.email)}</p>` : ""}
</div>`;
  },
};

// ── Editorial ──

const editorialRenderers: ThemeRendererMap = {
  cover: (s) => {
    if (s.type !== "cover") return "";
    return `<div class="slide">
  <div class="ed-label">FEATURE</div>
  <h1>${esc(s.headline)}</h1>
  ${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ""}
  <div class="ed-divider"></div>
  ${s.badges?.length ? `<div>${s.badges.map(b => `<span class="ed-tag">${esc(b)}</span>`).join("")}</div>` : ""}
</div>`;
  },
  content: (s) => {
    if (s.type !== "content") return "";
    return `<div class="slide">
  ${s.label ? `<div class="ed-label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  <div class="ed-body">${(s.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("")}</div>
</div>`;
  },
  quote: (s) => {
    if (s.type !== "quote") return "";
    return `<div class="slide">
  ${s.label ? `<div class="ed-label">${esc(s.label)}</div>` : ""}
  <div class="ed-quote">${esc(s.quote)}</div>
  ${s.attribution ? `<p style="font-size:12px;color:#8C857C;margin-top:8px;">— ${esc(s.attribution)}</p>` : ""}
</div>`;
  },
  stats: (s) => {
    if (s.type !== "stats") return "";
    return `<div class="slide">
  ${s.label ? `<div class="ed-label">${esc(s.label)}</div>` : ""}
  ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
  <div class="ed-cols">
    ${(s.cards ?? []).map(c => `<div><div style="font-family:'Playfair Display',serif;font-size:36px;font-weight:900;color:#C9963B;">${esc(c.value)}</div><div style="font-size:12px;font-weight:600;margin-top:4px;">${esc(c.label)}</div>${c.sub ? `<div style="font-size:10px;color:#8C857C;margin-top:2px;">${esc(c.sub)}</div>` : ""}</div>`).join("\n    ")}
  </div>
</div>`;
  },
  list: (s) => {
    if (s.type !== "list") return "";
    return `<div class="slide">
  ${s.label ? `<div class="ed-label">${esc(s.label)}</div>` : ""}
  <h2>${esc(s.title)}</h2>
  ${(s.items ?? []).map(it => `<div style="padding:10px 0;border-bottom:1px solid rgba(201,150,59,.2);"><strong>${esc(it.title)}</strong>${it.description ? `<p style="font-size:12px;color:#8C857C;margin-top:2px;">${esc(it.description)}</p>` : ""}</div>`).join("\n  ")}
</div>`;
  },
  cta: (s) => {
    if (s.type !== "cta") return "";
    return `<div class="slide" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
  <div class="ed-label">NEXT</div>
  <h1>${esc(s.headline)}</h1>
  ${s.description ? `<p>${esc(s.description)}</p>` : ""}
  <div class="ed-divider" style="width:60px;"></div>
  ${s.email ? `<p style="font-weight:700;color:#C9963B;">${esc(s.email)}</p>` : ""}
</div>`;
  },
};

// ── Branded (Ketan Slides) ──

const brandedRenderers: ThemeRendererMap = {
  cover: (s, idx, total) => {
    if (s.type !== "cover") return "";
    const dots = Array.from({ length: total }, (_, i) =>
      `<div class="dot${i === idx ? " on" : ""}">${i + 1}</div>`
    ).join("");
    return `<div class="slide">
  <div class="dots">${dots}</div>
  <div class="btag"><div class="bdot"></div><span class="btxt">SLIDES</span></div>
  <div class="h1">${esc(s.headline)}</div>
  ${s.subtitle ? `<p style="font-size:10px;color:#888;">${esc(s.subtitle)}</p>` : ""}
  ${s.facts?.length ? s.facts.map(f => `<p style="font-size:9px;color:#555;">${esc(f)}</p>`).join("\n  ") : ""}
  <div class="ft"><div class="ft-l"><span class="ft-pl">SLIDESHOT</span></div><span class="ft-sw">${idx + 1}/${total}</span></div>
</div>`;
  },
  stats: (s, idx, total) => {
    if (s.type !== "stats") return "";
    const dots = Array.from({ length: total }, (_, i) =>
      `<div class="dot${i === idx ? " on" : ""}">${i + 1}</div>`
    ).join("");
    return `<div class="slide">
  <div class="dots">${dots}</div>
  ${s.label ? `<div class="lbl">${esc(s.label)}</div>` : ""}
  ${s.title ? `<div class="h2">${esc(s.title)}</div>` : ""}
  <div class="scols">
    ${(s.cards ?? []).map(c => `<div class="sc"><div class="sn">${esc(c.value)}</div><div class="sb"></div><div class="sk">${esc(c.label)}</div>${c.sub ? `<div class="sd">${esc(c.sub)}</div>` : ""}</div>`).join("\n    ")}
  </div>
  ${s.tags?.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">${s.tags.map(t => `<span style="font-size:7.5px;color:#00B894;border:.5px solid #00B894;border-radius:4px;padding:3px 7px;">${esc(t)}</span>`).join("")}</div>` : ""}
  <div class="ft"><div class="ft-l"><span class="ft-pl">SLIDESHOT</span></div><span class="ft-sw">${idx + 1}/${total}</span></div>
</div>`;
  },
  list: (s, idx, total) => {
    if (s.type !== "list") return "";
    const dots = Array.from({ length: total }, (_, i) =>
      `<div class="dot${i === idx ? " on" : ""}">${i + 1}</div>`
    ).join("");
    return `<div class="slide">
  <div class="dots">${dots}</div>
  ${s.label ? `<div class="lbl">${esc(s.label)}</div>` : ""}
  <div class="h2">${esc(s.title)}</div>
  <ul class="ul">
    ${(s.items ?? []).map((it, i) => `<div class="ur"><span class="un">${String(i + 1).padStart(2, "0")}</span><div><span class="um">${esc(it.title)}</span>${it.description ? `<span class="us">${esc(it.description)}</span>` : ""}${it.tag ? ` <span class="utg">${esc(it.tag)}</span>` : ""}</div></div>`).join("\n    ")}
  </ul>
  <div class="ft"><div class="ft-l"><span class="ft-pl">SLIDESHOT</span></div><span class="ft-sw">${idx + 1}/${total}</span></div>
</div>`;
  },
  comparison: (s, idx, total) => {
    if (s.type !== "comparison") return "";
    const dots = Array.from({ length: total }, (_, i) =>
      `<div class="dot${i === idx ? " on" : ""}">${i + 1}</div>`
    ).join("");
    return `<div class="slide dark">
  <div class="dots">${dots}</div>
  ${s.title ? `<div class="h2">${esc(s.title)}</div>` : ""}
  <div class="cg">
    <div class="cc cbad"><div class="ct">${esc(s.leftLabel)}</div>${(s.left ?? []).map(it => `<div class="ci"><span class="cil">${esc(it.label)}</span>${it.description ? `<span class="cid">${esc(it.description)}</span>` : ""}</div>`).join("")}</div>
    <div class="cc cgood"><div class="ct">${esc(s.rightLabel)}</div>${(s.right ?? []).map(it => `<div class="ci"><span class="cil">${esc(it.label)}</span>${it.description ? `<span class="cid">${esc(it.description)}</span>` : ""}</div>`).join("")}</div>
  </div>
  <div class="ft"><div class="ft-l"><span class="ft-pl">SLIDESHOT</span></div><span class="ft-sw">${idx + 1}/${total}</span></div>
</div>`;
  },
  cta: (s, idx, total) => {
    if (s.type !== "cta") return "";
    const dots = Array.from({ length: total }, (_, i) =>
      `<div class="dot${i === idx ? " tl" : ""}">${i + 1}</div>`
    ).join("");
    return `<div class="slide">
  <div class="dots">${dots}</div>
  <div class="h1"><i>${esc(s.headline)}</i></div>
  ${s.description ? `<p style="font-size:10px;color:#888;margin-bottom:12px;">${esc(s.description)}</p>` : ""}
  ${s.email ? `<div class="btag"><div class="bdot"></div><span class="btxt">${esc(s.email)}</span></div>` : ""}
  ${s.note ? `<p style="font-size:8px;color:#AAA;margin-top:8px;">${esc(s.note)}</p>` : ""}
  <div class="ft"><div class="ft-l"><span class="ft-pl">SLIDESHOT</span></div><span class="ft-sw">${idx + 1}/${total}</span></div>
</div>`;
  },
};

// ── Browser Shell ──

function browserWrap(brandName: string, body: string, footer: string): string {
  return `<div class="slide">
  <div class="browser">
    <div class="browser-bar">
      <div class="brdots"><div class="brdot brdot-r"></div><div class="brdot brdot-o"></div><div class="brdot brdot-g"></div></div>
      <div class="brand-name">${esc(brandName)}</div>
    </div>
    <div class="browser-body">${body}</div>
    <div class="browser-foot"><div class="foot-txt">${esc(footer)}</div></div>
  </div>
</div>`;
}

const browserShellRenderers: ThemeRendererMap = {
  cover: (s) => {
    if (s.type !== "cover") return "";
    const gridSvg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="#E8E4DF" stroke-width=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
    const blobSvg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="position:absolute;bottom:-20px;right:-20px;width:180px;height:180px;opacity:.12;"><path fill="#12122A" d="M45.3,-62.5C56.9,-53.1,63.2,-37.3,67.8,-21.1C72.3,-4.8,75.1,11.9,70.1,26.1C65.1,40.3,52.4,52,38.1,59.5C23.8,67.1,7.9,70.6,-7.5,69.5C-22.9,68.4,-37.8,62.7,-49.8,53C-61.8,43.3,-70.9,29.5,-73.7,14.5C-76.5,-0.5,-73,-16.8,-65.1,-29.8C-57.2,-42.8,-44.9,-52.5,-31.7,-61C-18.5,-69.5,-4.6,-76.7,7.3,-74.4C19.2,-72.1,33.7,-71.9,45.3,-62.5Z" transform="translate(100 100)"/></svg>`;
    const body = `
      <div class="s-top" style="flex-shrink:0;">
        <div class="big-headline">${esc(s.headline)}</div>
        ${s.subtitle ? `<div class="sub-headline">${esc(s.subtitle)}</div>` : ""}
      </div>
      <div style="flex:1;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;opacity:.45;">${gridSvg}</div>
        ${blobSvg}
        <div style="position:relative;z-index:1;padding:18px 24px;display:flex;flex-direction:column;gap:14px;height:100%;">
          ${s.badges?.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${s.badges.map(b => `<span class="stag">${esc(b)}</span>`).join("")}</div>` : ""}
          ${s.facts?.length ? `<div style="margin-top:auto;padding:14px 16px;background:rgba(18,18,42,.06);border-radius:8px;border:1.5px solid #12122A;">${s.facts.map(f => `<p style="font-size:10.5px;color:#333;margin-bottom:5px;font-weight:600;">◆ ${esc(f)}</p>`).join("")}</div>` : ""}
        </div>
      </div>`;
    return browserWrap("slideshot", body, "POWERED BY SLIDESHOT");
  },
  stats: (s) => {
    if (s.type !== "stats") return "";
    const dotSvg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute;bottom:0;left:0;right:0;height:80px;opacity:.08;"><defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#12122A"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>`;
    const body = `
      <div class="s-top" style="background:#FFD233;">
        ${s.title ? `<div class="big-headline" style="font-size:48px;">${esc(s.title)}</div>` : ""}
        ${s.label ? `<div class="sub-headline" style="margin-top:4px;">${esc(s.label)}</div>` : ""}
      </div>
      <div class="s-content" style="position:relative;">
        <div class="stat-row" style="flex-wrap:wrap;">
          ${(s.cards ?? []).map(c => `<div class="stat-card"><div class="stat-lbl">${esc(c.label)}</div><div class="stat-val">${esc(c.value)}</div>${c.sub ? `<div class="stat-sub">${esc(c.sub)}</div>` : ""}</div>`).join("")}
        </div>
        ${s.tags?.length ? `<div class="sec-lbl">SKILLS</div><div class="skill-tags">${s.tags.map(t => `<span class="stag">${esc(t)}</span>`).join("")}</div>` : ""}
        ${dotSvg}
      </div>`;
    return browserWrap("slideshot", body, "POWERED BY SLIDESHOT");
  },
  steps: (s) => {
    if (s.type !== "steps") return "";
    const body = `
      <div class="s-top">
        <div class="big-headline" style="font-size:56px;">${esc(s.title)}</div>
      </div>
      <ol class="resp-list">
        ${(s.items ?? []).map(it => `<li class="resp-item"><div class="resp-num">${it.num}</div><div><div class="resp-title">${esc(it.title)}</div><div class="resp-desc">${esc(it.description)}</div></div></li>`).join("")}
      </ol>`;
    return browserWrap("slideshot", body, "POWERED BY SLIDESHOT");
  },
  list: (s) => {
    if (s.type !== "list") return "";
    const body = `
      <div class="s-top">
        <div class="big-headline" style="font-size:48px;">${esc(s.title)}</div>
      </div>
      <ol class="resp-list">
        ${(s.items ?? []).map((it, i) => `<li class="resp-item"><div class="resp-num">${i + 1}</div><div><div class="resp-title">${esc(it.title)}</div>${it.description ? `<div class="resp-desc">${esc(it.description)}</div>` : ""}</div></li>`).join("")}
      </ol>`;
    return browserWrap("slideshot", body, "POWERED BY SLIDESHOT");
  },
  cta: (s) => {
    if (s.type !== "cta") return "";
    const ringsSvg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;opacity:.06;"><circle cx="50%" cy="50%" r="140" fill="none" stroke="#12122A" stroke-width="1.5"/><circle cx="50%" cy="50%" r="100" fill="none" stroke="#12122A" stroke-width="1"/><circle cx="50%" cy="50%" r="60" fill="none" stroke="#12122A" stroke-width=".75"/></svg>`;
    const body = `
      <div class="cta-body" style="position:relative;">
        ${ringsSvg}
        <div style="position:relative;z-index:1;">
          <div class="apply-eyebrow">GET STARTED</div>
          <div class="apply-headline">${esc(s.headline)}</div>
          <div class="apply-divider"></div>
          ${s.description ? `<div class="apply-desc">${esc(s.description)}</div>` : ""}
          ${s.email ? `<div class="email-box"><span class="email-at">@</span><span class="email-addr">${esc(s.email)}</span></div>` : ""}
          ${s.action ? `<div style="display:inline-block;background:#FFD233;border:2px solid #0A0A0A;border-radius:6px;padding:10px 20px;font-size:12px;font-weight:800;color:#0A0A0A;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">${esc(s.action)}</div>` : ""}
          ${s.note ? `<div class="apply-note">${esc(s.note)}</div>` : ""}
        </div>
      </div>`;
    return browserWrap("slideshot", body, "POWERED BY SLIDESHOT");
  },
};

// ── Registry ──

const THEME_RENDERERS: Record<string, ThemeRendererMap> = {
  generic: genericRenderers,
  "instagram-carousel": instagramRenderers,
  infographic: infographicRenderers,
  "pitch-deck": pitchDeckRenderers,
  "dark-modern": darkModernRenderers,
  editorial: editorialRenderers,
  branded: brandedRenderers,
  "browser-shell": browserShellRenderers,
};

export function renderSlide(
  theme: string,
  slide: SlideData,
  index: number,
  total: number,
): string {
  const renderers = THEME_RENDERERS[theme] ?? THEME_RENDERERS["generic"];
  const renderer = renderers[slide.type] ?? genericRenderers[slide.type];
  if (!renderer) {
    throw new Error(`No renderer for slide type "${slide.type}" in theme "${theme}"`);
  }
  return renderer(slide, index, total);
}

export function getSupportedSlideTypes(theme: string): string[] {
  const renderers = THEME_RENDERERS[theme] ?? THEME_RENDERERS["generic"];
  return Object.keys(renderers);
}
