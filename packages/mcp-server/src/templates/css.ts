interface ThemeCSS {
  font: string;
  css: string;
  dimensions: { width: number; height: number };
}

const BASE_RESET = `*{margin:0;padding:0;box-sizing:border-box;}`;
const BASE_BODY = `body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}`;

export const THEME_CSS: Record<string, ThemeCSS> = {
  generic: {
    font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;padding:32px 40px;overflow:hidden;font-family:'Inter',sans-serif;flex-shrink:0;background:#FFF;color:#1a1a1a;}
.slide h1{font-size:38px;font-weight:700;line-height:1.1;margin-bottom:14px;}
.slide h2{font-size:26px;font-weight:700;line-height:1.2;margin-bottom:10px;}
.slide h3{font-size:18px;font-weight:600;margin-bottom:8px;color:#555;}
.slide p{font-size:14px;line-height:1.6;color:#555;margin-bottom:12px;}
.label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:#888;margin-bottom:14px;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0;}
.stat-card{background:#F8F8F8;border-radius:10px;padding:18px;}
.stat-card .num{font-size:32px;font-weight:700;color:#1a1a1a;line-height:1;}
.stat-card .slbl{font-size:11px;color:#888;margin-top:6px;}
.item-list{list-style:none;margin:12px 0;}
.item-list li{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #eee;align-items:flex-start;}
.item-list li:last-child{border-bottom:none;}
.item-num{font-size:18px;font-weight:700;color:#ccc;min-width:28px;}
.item-title{font-size:14px;font-weight:700;color:#1a1a1a;}
.item-desc{font-size:12px;color:#888;margin-top:2px;}
.quote-block{border-left:3px solid #1a1a1a;padding:16px 0 16px 20px;margin:16px 0;font-size:18px;font-style:italic;line-height:1.5;color:#333;}
.attribution{font-size:12px;color:#888;margin-top:8px;font-style:normal;}
.cta-center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:600;background:#f0f0f0;color:#555;margin:3px;}
.tag-row{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;}
.divider{width:100%;height:1px;background:#eee;margin:14px 0;}
.code-block{background:#f5f5f5;border-radius:8px;padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.6;color:#333;overflow:hidden;white-space:pre-wrap;margin:10px 0;}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
.compare-col{padding:16px;border-radius:8px;}
.compare-left{background:#f8f8f8;border:1px solid #eee;}
.compare-right{background:#f0faf5;border:1px solid #d5edd8;}
.compare-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;color:#888;}
.compare-item{margin-bottom:8px;}.compare-item .ci-label{font-size:12px;font-weight:700;color:#1a1a1a;}.compare-item .ci-desc{font-size:10px;color:#888;margin-top:2px;}
.timeline{position:relative;padding-left:24px;border-left:2px solid #eee;margin:12px 0;}.tl-item{position:relative;padding:10px 0 10px 16px;}.tl-item::before{content:'';position:absolute;left:-29px;top:14px;width:10px;height:10px;border-radius:50%;background:#1a1a1a;border:2px solid #FFF;}
.tl-year{font-size:11px;font-weight:700;color:#1a1a1a;}.tl-desc{font-size:12px;color:#888;margin-top:2px;}
.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}.team-card{text-align:center;padding:16px;background:#f8f8f8;border-radius:12px;}.team-card .avatar{width:48px;height:48px;border-radius:50%;background:#eee;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:18px;}.team-card .tname{font-size:14px;font-weight:700;}.team-card .trole{font-size:11px;color:#888;margin-top:2px;}`,
    dimensions: { width: 540, height: 675 },
  },

  "instagram-carousel": {
    font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
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
.tdot{width:10px;height:10px;border-radius:50%;}.tdot-r{background:#FF6059;}.tdot-y{background:#FEBC2E;}.tdot-g{background:#28CA42;}
.terminal-body{padding:12px 18px 16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#D4C4B0;line-height:1.65;}
.terminal-body .cmd{font-weight:700;color:#F0E8DD;}.terminal-body .prompt{color:#C4562A;font-weight:700;}
.terminal-body .arrow{color:#888;margin-right:4px;}.terminal-body .check{color:#28CA42;font-weight:700;}.terminal-body .dim{opacity:.6;}
.watermark{text-align:center;margin-top:auto;padding-top:10px;flex-shrink:0;}
.watermark-text{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:3px;color:#2A2018;opacity:.2;text-transform:uppercase;}
.bottom-bar{display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-shrink:0;}
.spacer{flex:1;min-height:0;}
.stat-line{display:flex;align-items:baseline;gap:10px;padding:6px 0;border-bottom:1px solid rgba(42,32,24,.08);}
.stat-line:last-child{border-bottom:none;}
.stat-num{font-family:'Inter',sans-serif;font-weight:900;font-size:28px;color:#C4562A;flex-shrink:0;min-width:70px;}
.stat-desc{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.3px;line-height:1.4;}
.os-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:6px;margin-bottom:12px;}
.os-col{display:flex;flex-direction:column;gap:5px;}
.os-col-head{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888;text-align:center;}
.os-cell{border-radius:6px;padding:7px 8px;text-align:center;}
.os-cell-name{font-size:10px;font-weight:800;margin-bottom:1px;}
.os-cell-desc{font-size:7.5px;opacity:.7;}
.os-eq-col{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-top:14px;}
.os-eq{font-size:18px;font-weight:900;color:#C4562A;}
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
.tbar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.tbar-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;width:34px;text-align:right;flex-shrink:0;}
.tbar-track{flex:1;height:22px;border-radius:4px;background:rgba(42,32,24,.06);overflow:hidden;}
.tbar-fill{height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;}
.tbar-pct{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:800;color:#fff;white-space:nowrap;}
.stack-layer{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1.5px solid #2A2018;border-bottom:none;}
.stack-layer:first-child{border-radius:8px 8px 0 0;}
.stack-layer:last-child{border-bottom:1.5px solid #2A2018;border-radius:0 0 8px 8px;}
.stack-num{font-family:'Inter',sans-serif;font-weight:900;font-size:22px;color:#C4562A;width:20px;flex-shrink:0;}
.stack-name{font-size:10px;font-weight:800;color:#2A2018;}
.stack-desc{font-size:7.5px;color:#888;line-height:1.3;}
.stack-tag{margin-left:auto;font-size:6.5px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;letter-spacing:.5px;text-transform:uppercase;}
.footnote{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;color:#2A2018;opacity:.45;font-style:italic;line-height:1.4;margin-top:4px;flex-shrink:0;}
.cta-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
.cta-giant{font-family:'Inter',sans-serif;font-weight:900;font-size:68px;line-height:.92;letter-spacing:-2px;color:#2A2018;margin-bottom:16px;}
.cta-giant .accent{color:#C4562A;}
.cta-body{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#2A2018;text-transform:uppercase;letter-spacing:.5px;line-height:1.6;max-width:380px;margin-bottom:24px;text-align:center;}
.cta-btn{display:inline-block;border:2px solid #C4562A;border-radius:8px;padding:14px 36px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;letter-spacing:4px;color:#C4562A;text-transform:uppercase;margin-bottom:16px;}
.cta-follow{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:#2A2018;text-transform:uppercase;letter-spacing:1px;}
.cta-follow .accent{color:#C4562A;}`,
    dimensions: { width: 540, height: 675 },
  },

  infographic: {
    font: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;padding:36px 32px;overflow:hidden;font-family:'DM Sans',sans-serif;flex-shrink:0;background:#F8FAFC;color:#1E293B;}
.slide h1{font-size:32px;font-weight:700;line-height:1.15;margin-bottom:8px;}
.slide h2{font-size:22px;font-weight:700;line-height:1.2;margin-bottom:6px;}
.slide p{font-size:13px;line-height:1.5;color:#64748B;font-family:'Inter',sans-serif;margin-bottom:12px;}
.section-header{border-left:3px solid #2563EB;padding-left:12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#2563EB;margin-bottom:14px;}
.stat-card{background:#FFF;border-radius:10px;padding:16px;border-top:3px solid #2563EB;}.stat-card .num{font-size:36px;font-weight:700;line-height:1;color:#2563EB;}.stat-card .label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#1E293B;margin-top:6px;}.stat-card .sub{font-size:10px;color:#64748B;margin-top:2px;}
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
.progress-bar{height:10px;background:#E2E8F0;border-radius:5px;overflow:hidden;margin:6px 0;}.progress-fill{height:100%;border-radius:5px;}
.fill-blue{background:#2563EB;}.fill-green{background:#10B981;}.fill-amber{background:#F59E0B;}.fill-red{background:#EF4444;}
.icon-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0;}.icon-cell{background:#FFF;border:1px solid #E2E8F0;border-radius:8px;padding:14px 10px;text-align:center;}.icon-cell .ico{font-size:24px;margin-bottom:6px;}.icon-cell .itxt{font-size:10px;font-weight:600;color:#1E293B;}
.data-table{width:100%;margin:10px 0;}.data-table .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:12px;}.data-table .row:last-child{border-bottom:none;}.data-table .key{color:#64748B;}.data-table .val{font-weight:700;color:#1E293B;}
.callout{background:#EFF6FF;border-left:3px solid #2563EB;border-radius:0 8px 8px 0;padding:12px 14px;margin:10px 0;font-size:12px;color:#1E293B;}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}.badge-blue{background:#DBEAFE;color:#2563EB;}.badge-green{background:#D1FAE5;color:#059669;}.badge-amber{background:#FEF3C7;color:#D97706;}
.divider{width:100%;height:1px;background:#E2E8F0;margin:14px 0;}
.numbered-list{list-style:none;counter-reset:nl;}.numbered-list li{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px;align-items:flex-start;}.numbered-list li::before{counter-increment:nl;content:counter(nl);background:#2563EB;color:#FFF;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.flow-row{display:flex;align-items:center;gap:0;margin:12px 0;}.flow-step{flex:1;text-align:center;padding:10px 6px;background:#FFF;border:1px solid #E2E8F0;border-radius:8px;font-size:10px;font-weight:600;}.flow-arrow{font-size:16px;color:#2563EB;padding:0 4px;}
.slide-num{position:absolute;top:20px;right:24px;font-size:10px;font-weight:700;color:#CBD5E1;}`,
    dimensions: { width: 540, height: 675 },
  },

  "pitch-deck": {
    font: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
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
.slide-number{position:absolute;bottom:16px;right:24px;font-size:11px;font-weight:500;color:#CBD5E1;}`,
    dimensions: { width: 540, height: 675 },
  },

  "dark-modern": {
    font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
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
.chip{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,.1);color:#94A3B8;margin:3px;}.chip-cyan{border-color:rgba(34,211,238,.3);color:#22D3EE;}.chip-magenta{border-color:rgba(232,121,249,.3);color:#E879F9;}
.step-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;}.step{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:16px;}.step .snum{font-size:28px;font-weight:700;color:rgba(34,211,238,.3);line-height:1;margin-bottom:6px;}.step .stitle{font-size:13px;font-weight:600;margin-bottom:4px;}.step .sdesc{font-size:11px;color:#64748B;}
.slide-tag{position:absolute;top:24px;right:24px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#475569;}`,
    dimensions: { width: 540, height: 675 },
  },

  editorial: {
    font: `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;padding:40px 36px;overflow:hidden;flex-shrink:0;background:#FAF8F5;color:#2C2824;font-family:'Source Sans 3',sans-serif;}
.ed-dark{background:#1A1814;color:#E8E3DC;}
.slide h1{font-family:'Playfair Display',serif;font-size:44px;font-weight:900;line-height:1.05;margin-bottom:14px;letter-spacing:-.02em;}
.slide h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;line-height:1.15;margin-bottom:10px;}
.slide h3{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;line-height:1.2;margin-bottom:8px;}
.slide p{font-size:13.5px;line-height:1.65;color:#5C564E;margin-bottom:12px;}.ed-dark p{color:#9C968E;}
.ed-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:#C9963B;margin-bottom:18px;padding-bottom:8px;border-bottom:1px solid #C9963B;}
.ed-quote{position:relative;padding:20px 0 20px 24px;margin:16px 0;border-left:2px solid #C9963B;font-family:'Playfair Display',serif;font-size:20px;font-style:italic;line-height:1.4;color:#2C2824;}.ed-dark .ed-quote{color:#E8E3DC;}
.ed-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:12px 0;}
.ed-divider{width:100%;height:1px;background:#C9963B;margin:16px 0;opacity:.4;}
.ed-footer{position:absolute;bottom:20px;left:36px;right:36px;display:flex;justify-content:space-between;font-size:10px;color:#8C857C;text-transform:uppercase;letter-spacing:.1em;}
.ed-number{font-family:'Playfair Display',serif;font-size:80px;font-weight:900;color:#C9963B;opacity:.15;line-height:1;position:absolute;}
.ed-body{columns:2;column-gap:20px;font-size:12px;line-height:1.7;color:#5C564E;margin:10px 0;}.ed-dark .ed-body{color:#9C968E;}
.ed-tag{display:inline-block;padding:4px 10px;border:1px solid #DDD8D0;border-radius:2px;font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#8C857C;margin:3px;}.ed-dark .ed-tag{border-color:#3C3832;color:#6C665E;}`,
    dimensions: { width: 540, height: 675 },
  },

  branded: {
    font: `<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
body{background:#1A1A1A;padding:48px;font-family:'Space Mono',monospace;display:flex;flex-direction:column;align-items:flex-start;gap:40px;}
.slide{position:relative;width:540px;height:675px;background:#F0EDE7;padding:32px 40px 52px;overflow:hidden;font-family:'Space Mono',monospace;flex-shrink:0;}
.slide::before{content:'';position:absolute;top:24px;right:24px;width:80px;height:80px;border-top:1px solid #B8B4AD;border-right:1px solid #B8B4AD;pointer-events:none;}
.slide::after{content:'';position:absolute;bottom:24px;left:24px;width:60px;height:60px;border-bottom:1px solid #B8B4AD;border-left:1px solid #B8B4AD;pointer-events:none;}
.dark{background:#0D0D0D;}.dark::before{border-color:#252525;}.dark::after{border-color:#252525;}
.dots{display:flex;gap:5px;margin-bottom:18px;}.dot{width:17px;height:17px;border-radius:50%;background:#C8C4BC;display:flex;align-items:center;justify-content:center;font-size:6.5px;font-weight:700;color:transparent;}.dot.on{background:#1A1A1A;color:#FFF;}.dot.tl{background:#00B894;color:#FFF;}
.ft{position:absolute;bottom:0;left:0;right:0;padding:0px 24px 8px;display:flex;justify-content:space-between;align-items:flex-end;}.ft-l{display:flex;flex-direction:row;gap:1px;}.ft-pl{font-size:8.5px;color:#888;letter-spacing:.12em;text-transform:uppercase;}.ft-h{font-size:8.5px;font-weight:700;color:#1A1A1A;}.ft-sw{font-size:8.5px;color:#888;}.dark .ft-h{color:#FFF;}.dark .ft-pl,.dark .ft-sw{color:#444;}
.btag{display:inline-flex;align-items:center;gap:7px;background:#1A1A1A;border-radius:100px;padding:5px 12px 5px 8px;margin-bottom:16px;}.bdot{width:8px;height:8px;background:#E84C1E;border-radius:50%;}.btxt{font-size:8.5px;font-weight:700;color:#FFF;letter-spacing:.12em;text-transform:uppercase;}
.h1{font-size:72px;font-weight:700;line-height:1.0;margin-bottom:18px;color:#1A1A1A;letter-spacing:-.02em;}.h1 i{color:#00B894;font-style:italic;}.h1 s{color:#C0BCB5;text-decoration:none;}.dark .h1{color:#F0EDE7;}
.h2{font-size:46px;font-weight:700;line-height:1.05;margin-bottom:14px;letter-spacing:-.02em;color:#1A1A1A;}.h2 i{color:#00B894;font-style:italic;}.dark .h2{color:#F0EDE7;}
.lbl{font-size:10px;color:#888;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;}.dark .lbl{color:#444;}
.scols{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:13px;}.sc{background:#FFF;border:.5px solid #DEDAD4;border-radius:6px;padding:11px 10px;}.sn{font-size:24px;font-weight:700;line-height:1;}.sb{width:24px;height:2px;background:#1A1A1A;margin:5px 0;}.sk{font-size:8px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:.1em;}.sd{font-size:7.5px;color:#888;margin-top:2px;}
.ul{list-style:none;}.ur{display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:.5px solid #DEDAD4;}.ur:last-child{border-bottom:none;}.un{font-size:10px;color:#AAA;min-width:16px;}.um{font-size:10.5px;color:#1A1A1A;flex:1;font-weight:700;}.us{font-size:8.5px;color:#888;display:block;font-weight:400;margin-top:2px;}.utg{font-size:7.5px;color:#888;background:#F5F3EE;border:.5px solid #DEDAD4;border-radius:4px;padding:2px 6px;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;}.cc{padding:14px;border-radius:6px;}.cbad{background:#161616;border:.5px solid #2A2A2A;}.cgood{background:#0A1A14;border:.5px solid #00B894;}.ct{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;}.cbad .ct{color:#444;}.cgood .ct{color:#00B894;}.ci{margin-bottom:9px;}.cil{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;display:block;}.cid{font-size:8px;margin-top:2px;}.cbad .cil{color:#444;}.cbad .cid{color:#333;}.cgood .cil{color:#00B894;}.cgood .cid{color:#556;}
.hr{width:100%;height:.5px;background:#C8C4BC;margin:13px 0;}
.al{list-style:none;}.ai{display:flex;gap:12px;padding:10px 0;border-bottom:.5px solid #DEDAD4;}.ai:last-child{border-bottom:none;}.an{font-size:10px;font-weight:700;color:#C0BCB5;min-width:18px;}.at{font-size:10.5px;font-weight:700;color:#1A1A1A;}.as{font-size:8.5px;color:#888;display:block;font-weight:400;margin-top:2px;}`,
    dimensions: { width: 540, height: 675 },
  },

  "browser-shell": {
    font: `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;overflow:hidden;font-family:'DM Sans',sans-serif;flex-shrink:0;background:#FFD233;padding:20px;}
.browser{width:100%;height:100%;background:#12122A;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 2px 0 rgba(255,255,255,0.06) inset,0 20px 50px rgba(0,0,0,0.35);}
.browser-bar{background:#12122A;padding:0 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;height:42px;}
.brdots{display:flex;gap:7px;align-items:center;}.brdot{width:11px;height:11px;border-radius:50%;flex-shrink:0;}
.brdot-r{background:#FF6059;}.brdot-o{background:#FEBC2E;}.brdot-g{background:#2A2A44;}
.brand-name{color:#fff;font-size:17px;font-weight:700;letter-spacing:-0.3px;}
.browser-body{background:#fff;flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;}
.browser-foot{background:#12122A;padding:10px 24px;text-align:center;flex-shrink:0;}
.foot-txt{color:#fff;font-size:9.5px;font-weight:600;letter-spacing:2.2px;text-transform:uppercase;}
.s-top{padding:16px 24px 12px;border-bottom:2.5px solid #12122A;flex-shrink:0;}
.big-headline{font-family:'Bebas Neue',sans-serif;font-size:70px;color:#0A0A0A;line-height:0.9;letter-spacing:1px;}
.sub-headline{font-size:9.5px;font-weight:600;letter-spacing:2.8px;color:#0A0A0A;margin-top:7px;text-transform:uppercase;}
.s-content{padding:16px 24px;flex:1;display:flex;flex-direction:column;min-height:0;}
.sec-lbl{font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:8px;}
.stat-row{display:flex;gap:10px;margin-bottom:18px;}
.stat-card{flex:1;border:2px solid #0A0A0A;border-radius:8px;padding:12px 14px;}
.stat-lbl{font-size:7.5px;font-weight:700;letter-spacing:2px;color:#999;text-transform:uppercase;margin-bottom:3px;}
.stat-val{font-family:'Bebas Neue',sans-serif;font-size:30px;color:#0A0A0A;line-height:1;}
.stat-sub{font-size:9px;color:#666;margin-top:2px;font-weight:500;}
.skill-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
.stag{background:#FFD233;color:#0A0A0A;font-size:10px;font-weight:700;padding:5px 12px;border-radius:4px;border:1.5px solid #0A0A0A;}.stag.outline{background:#fff;}
.resp-list{padding:8px 24px 12px;flex:1;list-style:none;display:flex;flex-direction:column;justify-content:space-evenly;min-height:0;}
.resp-item{display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #F0F0F0;}.resp-item:last-child{border-bottom:none;}
.resp-num{font-family:'Bebas Neue',sans-serif;font-size:36px;color:#FFD233;line-height:1;flex-shrink:0;width:32px;-webkit-text-stroke:1.5px #0A0A0A;}
.resp-title{font-size:11px;font-weight:700;color:#0A0A0A;margin-bottom:2px;line-height:1.2;}
.resp-desc{font-size:9px;color:#666;line-height:1.45;}
.cta-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;}
.apply-eyebrow{font-size:8.5px;font-weight:700;letter-spacing:3px;color:#bbb;text-transform:uppercase;margin-bottom:10px;}
.apply-headline{font-family:'Bebas Neue',sans-serif;font-size:68px;color:#0A0A0A;line-height:0.88;margin-bottom:14px;}
.apply-divider{width:48px;height:3px;background:#FFD233;border:1.5px solid #0A0A0A;margin:0 auto 16px;}
.apply-desc{font-size:11px;color:#666;line-height:1.65;max-width:310px;margin-bottom:22px;}
.email-box{display:inline-flex;align-items:center;gap:10px;background:#FFD233;border:2.5px solid #0A0A0A;border-radius:6px;padding:13px 22px;margin-bottom:10px;}
.email-at{font-size:18px;font-weight:800;color:#0A0A0A;}
.email-addr{font-size:13px;font-weight:800;color:#0A0A0A;letter-spacing:0.3px;}
.apply-note{font-size:8.5px;color:#bbb;letter-spacing:1px;text-transform:uppercase;}`,
    dimensions: { width: 540, height: 675 },
  },

  /**
   * Academic Poster — IEEE/ACM conference poster aesthetic.
   * IBM Plex Serif headings + IBM Plex Mono code, deep navy + parchment.
   */
  "academic-poster": {
    font: `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;padding:36px 40px;overflow:hidden;font-family:'IBM Plex Sans',sans-serif;flex-shrink:0;background:#FBF8F1;color:#0E1B33;border-top:6px double #0E1B33;}
.slide::before{content:'';position:absolute;top:0;right:0;width:120px;height:6px;background:#A22E2E;}
.slide h1,.slide h2{font-family:'IBM Plex Serif',serif;color:#0E1B33;}
.slide h1{font-size:34px;font-weight:700;line-height:1.12;letter-spacing:-0.5px;margin-bottom:10px;}
.slide h2{font-size:22px;font-weight:600;line-height:1.2;margin-bottom:10px;}
.slide p{font-family:'IBM Plex Serif',serif;font-size:13px;line-height:1.6;color:#1F2C44;margin-bottom:10px;}
.label{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.18em;color:#A22E2E;text-transform:uppercase;margin-bottom:14px;}
.poster-rule{height:1px;background:#0E1B33;margin:14px 0;opacity:.25;}
.abstract{background:#F2EBDC;border-left:3px solid #A22E2E;padding:12px 14px;font-family:'IBM Plex Serif',serif;font-size:12px;line-height:1.6;color:#0E1B33;margin:12px 0;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;}
.stat-card{background:#fff;border:1px solid #0E1B33;padding:14px 16px;}
.stat-card .num{font-family:'IBM Plex Serif',serif;font-size:30px;font-weight:700;color:#0E1B33;line-height:1;}
.stat-card .slbl{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#5C6781;margin-top:6px;letter-spacing:.1em;text-transform:uppercase;}
.item-list{list-style:none;margin:10px 0;}
.item-list li{display:flex;gap:12px;padding:10px 0;border-bottom:1px dotted #0E1B33;align-items:flex-start;}
.item-list li:last-child{border-bottom:none;}
.item-num{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;color:#A22E2E;min-width:32px;}
.item-title{font-family:'IBM Plex Serif',serif;font-size:13px;font-weight:600;color:#0E1B33;}
.item-desc{font-family:'IBM Plex Serif',serif;font-size:11px;color:#5C6781;margin-top:2px;line-height:1.5;}
.quote-block{font-family:'IBM Plex Serif',serif;font-style:italic;font-size:18px;line-height:1.5;color:#0E1B33;border-left:3px solid #A22E2E;padding:12px 0 12px 18px;margin:14px 0;}
.attribution{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#5C6781;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;}
.cta-center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;}
.badge{display:inline-block;padding:3px 10px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;background:transparent;color:#A22E2E;border:1px solid #A22E2E;letter-spacing:.1em;text-transform:uppercase;margin:2px;}
.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0;}
.code-block{background:#0E1B33;color:#FBF8F1;padding:12px 14px;font-family:'IBM Plex Mono',monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;margin:10px 0;}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.compare-col{padding:14px;border:1px solid #0E1B33;background:#fff;}
.compare-label{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#A22E2E;margin-bottom:8px;}
.compare-item{margin-bottom:8px;}.compare-item .ci-label{font-family:'IBM Plex Serif',serif;font-size:12px;font-weight:600;color:#0E1B33;}.compare-item .ci-desc{font-family:'IBM Plex Serif',serif;font-size:10px;color:#5C6781;margin-top:2px;}
.timeline{position:relative;padding-left:22px;border-left:2px solid #A22E2E;margin:10px 0;}
.tl-item{position:relative;padding:8px 0 8px 14px;}
.tl-item::before{content:'';position:absolute;left:-27px;top:14px;width:8px;height:8px;background:#A22E2E;}
.tl-year{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;color:#A22E2E;letter-spacing:.1em;}
.tl-desc{font-family:'IBM Plex Serif',serif;font-size:11px;color:#0E1B33;margin-top:2px;line-height:1.5;}
.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.team-card{padding:12px;background:#fff;border:1px solid #0E1B33;text-align:center;}
.team-card .avatar{width:42px;height:42px;background:#0E1B33;color:#FBF8F1;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:16px;}
.team-card .tname{font-family:'IBM Plex Serif',serif;font-size:13px;font-weight:600;}
.team-card .trole{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#5C6781;margin-top:2px;letter-spacing:.08em;text-transform:uppercase;}
.poster-foot{position:absolute;bottom:14px;left:40px;right:40px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#5C6781;letter-spacing:.12em;text-transform:uppercase;}`,
    dimensions: { width: 540, height: 675 },
  },

  /**
   * Clinical Medical — sterile medical-report aesthetic.
   * Source Sans 3 + Source Serif 4, white + clinical teal + alert red.
   */
  "clinical-medical": {
    font: `<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
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
.vital-card .num{font-family:'Source Serif 4',serif;font-size:28px;font-weight:700;color:#0F2D3D;line-height:1;}
.vital-card .slbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;margin-top:4px;letter-spacing:.1em;text-transform:uppercase;}
.vital-card.alert{border-left-color:#D8484F;}
.vital-card.alert .num{color:#D8484F;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0;}
.stat-card{background:#fff;border:1px solid #D2E3E8;border-left:3px solid #0FA3A8;padding:12px 14px;}
.stat-card .num{font-family:'Source Serif 4',serif;font-size:28px;font-weight:700;color:#0F2D3D;line-height:1;}
.stat-card .slbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;margin-top:4px;letter-spacing:.1em;text-transform:uppercase;}
.item-list{list-style:none;margin:10px 0;}
.item-list li{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #E8EFF2;align-items:flex-start;}
.item-list li:last-child{border-bottom:none;}
.item-num{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:#0FA3A8;min-width:28px;background:#E6F6F7;padding:2px 6px;border-radius:3px;text-align:center;height:fit-content;}
.item-title{font-size:13px;font-weight:600;color:#0F2D3D;}
.item-desc{font-size:11px;color:#5A7488;margin-top:2px;line-height:1.5;}
.quote-block{background:#E6F6F7;border-left:3px solid #0FA3A8;padding:12px 14px;font-family:'Source Serif 4',serif;font-style:italic;font-size:16px;line-height:1.5;color:#0F2D3D;margin:12px 0;}
.attribution{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;letter-spacing:.12em;text-transform:uppercase;margin-top:6px;font-style:normal;}
.cta-center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;}
.badge{display:inline-block;padding:3px 10px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;background:#E6F6F7;color:#0FA3A8;border:1px solid #0FA3A8;letter-spacing:.1em;text-transform:uppercase;margin:2px;border-radius:3px;}
.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0;}
.code-block{background:#0F2D3D;color:#A8DDDF;padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;border-radius:4px;margin:10px 0;}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.compare-col{padding:14px;background:#fff;border:1px solid #D2E3E8;border-radius:4px;}
.compare-left{border-left:3px solid #5A7488;}
.compare-right{border-left:3px solid #0FA3A8;}
.compare-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#5A7488;margin-bottom:8px;}
.compare-item{margin-bottom:8px;}.compare-item .ci-label{font-size:12px;font-weight:600;color:#0F2D3D;}.compare-item .ci-desc{font-size:10px;color:#5A7488;margin-top:2px;}
.timeline{position:relative;padding-left:22px;border-left:2px solid #0FA3A8;margin:10px 0;}
.tl-item{position:relative;padding:8px 0 8px 14px;}
.tl-item::before{content:'';position:absolute;left:-27px;top:14px;width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid #0FA3A8;}
.tl-year{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:#0FA3A8;letter-spacing:.1em;}
.tl-desc{font-size:11px;color:#385468;margin-top:2px;line-height:1.5;}
.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.team-card{padding:14px;background:#fff;border:1px solid #D2E3E8;border-radius:4px;text-align:center;}
.team-card .avatar{width:44px;height:44px;border-radius:50%;background:#E6F6F7;color:#0FA3A8;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid #0FA3A8;}
.team-card .tname{font-family:'Source Serif 4',serif;font-size:13px;font-weight:600;color:#0F2D3D;}
.team-card .trole{font-family:'JetBrains Mono',monospace;font-size:9px;color:#5A7488;margin-top:2px;letter-spacing:.1em;text-transform:uppercase;}`,
    dimensions: { width: 540, height: 675 },
  },

  /**
   * Sketch Handdrawn — informal whiteboard aesthetic.
   * Caveat + Architects Daughter, paper background, dashed borders, hand-drawn arrows.
   */
  "sketch-handdrawn": {
    font: `<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Architects+Daughter&family=Patrick+Hand&display=swap" rel="stylesheet">`,
    css: `${BASE_RESET}
${BASE_BODY}
.slide{position:relative;width:540px;height:675px;padding:36px 40px;overflow:hidden;font-family:'Patrick Hand',cursive;flex-shrink:0;background:#FFFEF7;color:#1F1F1F;}
.slide::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 1px 1px,rgba(0,0,0,.08) 1px,transparent 0);background-size:18px 18px;opacity:.5;}
.slide::after{content:'';position:absolute;inset:14px;border:2px dashed #1F1F1F;pointer-events:none;border-radius:4px;}
.slide-inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;}
.slide h1{font-family:'Caveat',cursive;font-size:48px;font-weight:700;color:#1F1F1F;line-height:1;margin-bottom:14px;transform:rotate(-1deg);}
.slide h2{font-family:'Caveat',cursive;font-size:34px;font-weight:600;color:#1F1F1F;line-height:1.05;margin-bottom:10px;transform:rotate(-0.5deg);}
.slide p{font-family:'Architects Daughter',cursive;font-size:14px;line-height:1.65;color:#333;margin-bottom:10px;}
.label{font-family:'Architects Daughter',cursive;font-size:13px;color:#D9534F;letter-spacing:.05em;margin-bottom:14px;text-transform:uppercase;font-weight:600;}
.label::before{content:'~ ';color:#D9534F;}.label::after{content:' ~';color:#D9534F;}
.sketch-arrow{display:inline-block;color:#D9534F;font-family:'Caveat',cursive;font-size:28px;font-weight:700;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0;}
.stat-card{background:#FFFCEE;border:2px solid #1F1F1F;padding:14px 16px;position:relative;border-radius:6px;transform:rotate(-0.4deg);}
.stat-card:nth-child(2n){transform:rotate(0.6deg);}
.stat-card:nth-child(3n){transform:rotate(-0.8deg);}
.stat-card .num{font-family:'Caveat',cursive;font-size:38px;font-weight:700;color:#1F1F1F;line-height:1;}
.stat-card .slbl{font-family:'Architects Daughter',cursive;font-size:11px;color:#666;margin-top:4px;}
.item-list{list-style:none;margin:12px 0;}
.item-list li{display:flex;gap:12px;padding:10px 0;align-items:flex-start;border-bottom:2px dotted #1F1F1F;}
.item-list li:last-child{border-bottom:none;}
.item-num{font-family:'Caveat',cursive;font-size:28px;font-weight:700;color:#D9534F;min-width:36px;line-height:1;}
.item-title{font-family:'Architects Daughter',cursive;font-size:14px;font-weight:600;color:#1F1F1F;}
.item-desc{font-family:'Architects Daughter',cursive;font-size:12px;color:#555;margin-top:3px;line-height:1.5;}
.quote-block{font-family:'Caveat',cursive;font-size:24px;line-height:1.3;color:#1F1F1F;padding:16px 20px;background:#FFF6CC;border:2px solid #1F1F1F;border-radius:8px;margin:14px 0;transform:rotate(-0.5deg);}
.attribution{font-family:'Architects Daughter',cursive;font-size:11px;color:#666;margin-top:8px;}
.attribution::before{content:'— ';}
.cta-center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;}
.badge{display:inline-block;padding:5px 12px;font-family:'Architects Daughter',cursive;font-size:11px;font-weight:600;background:#FFF6CC;color:#1F1F1F;border:2px solid #1F1F1F;border-radius:14px;margin:3px;transform:rotate(-1deg);}
.badge:nth-child(2n){transform:rotate(1deg);}
.tag-row{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;}
.code-block{background:#FFFCEE;border:2px solid #1F1F1F;border-radius:6px;padding:14px 16px;font-family:'Patrick Hand',cursive;font-size:13px;color:#1F1F1F;white-space:pre-wrap;margin:10px 0;line-height:1.5;}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
.compare-col{padding:14px;border:2px solid #1F1F1F;border-radius:6px;background:#FFFCEE;transform:rotate(-0.4deg);}
.compare-col:last-child{transform:rotate(0.4deg);background:#F0FFF4;}
.compare-label{font-family:'Caveat',cursive;font-size:20px;font-weight:700;color:#D9534F;margin-bottom:8px;}
.compare-item{margin-bottom:8px;}.compare-item .ci-label{font-family:'Architects Daughter',cursive;font-size:12px;font-weight:600;color:#1F1F1F;}.compare-item .ci-desc{font-family:'Architects Daughter',cursive;font-size:10px;color:#555;margin-top:2px;}
.timeline{position:relative;padding-left:24px;margin:12px 0;border-left:2px dashed #1F1F1F;}
.tl-item{position:relative;padding:8px 0 8px 14px;}
.tl-item::before{content:'★';position:absolute;left:-29px;top:6px;color:#D9534F;font-size:18px;}
.tl-year{font-family:'Caveat',cursive;font-size:20px;font-weight:700;color:#D9534F;}
.tl-desc{font-family:'Architects Daughter',cursive;font-size:12px;color:#1F1F1F;margin-top:2px;line-height:1.5;}
.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
.team-card{padding:14px;background:#FFFCEE;border:2px solid #1F1F1F;border-radius:8px;text-align:center;transform:rotate(-0.6deg);}
.team-card:nth-child(2n){transform:rotate(0.6deg);}
.team-card .avatar{width:48px;height:48px;border-radius:50%;background:#FFF6CC;border:2px solid #1F1F1F;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:20px;}
.team-card .tname{font-family:'Caveat',cursive;font-size:20px;font-weight:700;color:#1F1F1F;}
.team-card .trole{font-family:'Architects Daughter',cursive;font-size:10px;color:#666;margin-top:2px;}`,
    dimensions: { width: 540, height: 675 },
  },
};

export function getThemeCSS(theme: string): ThemeCSS | null {
  return THEME_CSS[theme] ?? null;
}
