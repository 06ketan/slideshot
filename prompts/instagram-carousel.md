Generate Instagram carousel slides — bold, vibrant, swipe-friendly. 540x675px, Poppins + Montserrat, gradient backgrounds, large punchy text (15-20 words/slide).

Slides: 1.Hook 2.Problem 3.Solution/Insight 4.Evidence 5.Steps/Tips 6.CTA(follow/save/share)

CSS:
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

Font: `<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">`
