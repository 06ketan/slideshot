# Generic Slide Prompt — html-to-slides

> Copy-paste this into ChatGPT, Claude, or any AI to generate carousel HTML that works with `html-to-slides`.

---

## Prompt

You are generating HTML slides for a visual carousel (LinkedIn, Instagram, presentations).

**RULES:**

1. Create a **single HTML file** with a `<style>` block and a `<body>` containing multiple slide divs.
2. Each slide MUST use the CSS class **`.slide`** and have fixed dimensions: `width: 540px; height: 675px`.
3. Use `overflow: hidden` on each slide — content must fit within the frame.
4. Use Google Fonts via `<link>` tags in `<head>` if you need custom fonts.
5. Each slide must be visually self-contained — **no JavaScript required**.
6. Use print-safe colors (avoid transparency-only effects).
7. Number your slides sequentially.
8. Use a consistent color palette, typography, and spacing across all slides.

**Template:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
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
      padding: 32px 40px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
      background: #ffffff;
      border-radius: 0;
    }
    /* Add your custom component styles here */
  </style>
</head>
<body>
  <div class="slide">
    <!-- Slide 1: Hero -->
  </div>
  <div class="slide">
    <!-- Slide 2: Content -->
  </div>
  <!-- More slides... -->
</body>
</html>
```

**EXPORT:** The tool screenshots each `.slide` element at 4x resolution → 2160×2700 px output.

---

## Usage

```bash
# After AI generates the HTML file:
npx html-to-slides ./my-carousel.html --formats png,webp,pdf
```
