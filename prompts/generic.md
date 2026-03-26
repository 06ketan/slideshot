Generate HTML slides for a visual carousel. Each `.slide` is 540x675px, overflow:hidden, no JS.

Template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; padding: 48px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start; }
    .slide { position: relative; width: 540px; height: 675px; padding: 32px 40px; overflow: hidden; font-family: 'Inter', sans-serif; flex-shrink: 0; }
    /* your custom styles here */
  </style>
</head>
<body>
  <div class="slide"> <!-- Slide 1 --> </div>
  <div class="slide"> <!-- Slide 2 --> </div>
</body>
</html>
```

Tool screenshots each `.slide` at 4x.
