You are generating HTML slides in a magazine/editorial style — elegant, serif-driven, sophisticated.

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
```
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
```

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
