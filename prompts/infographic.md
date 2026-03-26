Generate infographic slides — data-heavy, structured, icon-rich. 540x675px, DM Sans + Inter, bg #F8FAFC, blue (#2563EB) / emerald (#10B981) / amber (#F59E0B).

CSS:
```
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
```

Font: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">`
