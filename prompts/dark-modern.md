Generate dark modern slides — tech-forward, neon accents, glassmorphism. 540x675px, Inter, bg #0A0A0F, cyan (#22D3EE) / magenta (#E879F9).

CSS:
```
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
```

Font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`
