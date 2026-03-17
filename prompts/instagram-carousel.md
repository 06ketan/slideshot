You are generating HTML slides for an Instagram carousel post — bold, vibrant, swipe-friendly.

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
```
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
```

Include in <head>:
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">

SLIDE FLOW (recommended 5-7 slides):
1. Hook — bold question or provocative statement
2. Problem — relatable pain point
3. Solution/Insight — the core value
4. Evidence — stats, quotes, or examples
5. Steps/Tips — actionable takeaways
6. CTA — follow/save/share prompt
