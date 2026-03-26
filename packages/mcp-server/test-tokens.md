# Token Utilization Test — slideshot-mcp v2.8.1 vs v2.9.0

## Test Scenario

**Prompt:** "Give me Info about JioBlackRock AMC & its current & future impact + ecosystem. Use slideshot MCP to generate slides."

| Parameter | Value |
|-----------|-------|
| Theme | Browser Shell |
| Aspect Ratio | Portrait (PDF / LinkedIn / Social) |
| Output Format | PDF |
| Slide Count | 8 slides |

## Results Summary

```
╔══════════════════════════════════════════════════════════════╗
║  v2.8.1 total:   168,801 tokens                            ║
║  v2.9.0 total:     7,329 tokens                            ║
║  Savings:        161,472 tokens (96% reduction)             ║
║  Ratio:          23.0x fewer tokens                         ║
╚══════════════════════════════════════════════════════════════╝
```

## Detailed Breakdown: v2.8.1 (npm published)

| Step | Tool Call | Tokens | Images | Notes |
|------|-----------|-------:|:------:|-------|
| - | Tool descriptions (per turn) | 677 | 0 | Always in context window |
| - | Schema descriptions (per turn) | 289 | 0 | Always in context window |
| 1 | `create_slides(discover)` response | 2,115 | 0 | Full THEME_CATALOG with 8 SVG icons + OUTPUT_PRESETS |
| 2 | `get_slide_prompt(browser-shell)` response | 5,750 | 0 | Full 23KB prompt with complete 4-slide example HTML |
| 3 | Model generates HTML (output) | 1,920 | 0 | 8 slides of JioBlackRock content |
| 4 | `create_slides(preview)` input | 1,992 | 0 | Full HTML string in tool args |
| 5 | `create_slides(preview)` response | 16,974 | 1 | base64 WebP image + full HTML echo-back + JSON |
| 6 | `create_slides(review)` input | 1,992 | 0 | Full HTML string sent AGAIN |
| 7 | `create_slides(review)` response | 120,029 | 8 | 8x base64 WebP thumbnail images |
| 8 | `render_html_to_images` input | 1,999 | 0 | Full HTML string sent THIRD time |
| 9 | `render_html_to_images` response | 15,064 | 1 | JSON + base64 preview (default: webp+pdf) |
| **TOTAL** | | **168,801** | **10** | |

### v2.8.1 Workflow Steps (Claude Desktop)

```
1. Model calls create_slides(discover)
   → Receives 2,115 tokens of themes with SVGs + presets

2. Model presents themes, user picks Browser Shell + Portrait + PDF

3. Model calls get_slide_prompt(browser-shell)
   → Receives 5,750 tokens of prompt (23KB with full example HTML)

4. Model generates 8-slide HTML deck
   → ~1,920 output tokens

5. Model calls create_slides(preview, html=<FULL HTML>)
   → Sends ~1,992 tokens of HTML
   → Puppeteer launches, screenshots slide 1
   → Receives base64 WebP + HTML echo = 16,974 tokens

6. User approves

7. Model calls create_slides(review, html=<FULL HTML AGAIN>)
   → Sends ~1,992 tokens of HTML AGAIN
   → Puppeteer screenshots ALL 8 slides
   → Receives 8x base64 WebP = 120,029 tokens (!!!)

8. User approves

9. Model calls render_html_to_images(html=<FULL HTML THIRD TIME>)
   → Sends ~1,999 tokens of HTML
   → Default formats: ["webp", "pdf"] — generates both
   → Receives JSON + base64 preview = 15,064 tokens
```

## Detailed Breakdown: v2.9.0 (local optimized)

| Step | Tool Call | Tokens | Images | Notes |
|------|-----------|-------:|:------:|-------|
| - | Tool descriptions (per turn) | 207 | 0 | Trimmed 3x shorter |
| - | Schema descriptions (per turn) | 232 | 0 | Trimmed descriptions |
| 1 | `create_slides(discover)` response | 422 | 0 | Compact: no SVGs, no OUTPUT_PRESETS |
| 2 | `get_slide_prompt(browser-shell)` response | 2,145 | 0 | Compressed prompt (CSS-only, no example HTML) |
| 3 | Model generates HTML (output) | 1,920 | 0 | Same 8 slides |
| 4 | `create_slides(preview)` input | 1,992 | 0 | HTML sent (first and last time) |
| 5 | `create_slides(preview)` response | 178 | 0 | JSON only: {slideCount, htmlPath}. NO images. |
| 6 | `create_slides(review)` input | 22 | 0 | Just htmlPath string |
| 7 | `create_slides(review)` response | 152 | 0 | JSON only: {slideCount, htmlPath}. NO images. |
| 8 | `render_html_to_images` input | 29 | 0 | Just htmlPath, NO HTML re-send |
| 9 | `render_html_to_images` response | 30 | 0 | JSON paths only. NO base64. |
| **TOTAL** | | **7,329** | **0** | |

### v2.9.0 Workflow Steps (Claude Desktop)

```
1. Model calls create_slides(discover)
   → Receives 422 tokens of compact theme list

2. Model presents themes, user picks Browser Shell + Portrait + PDF

3. Model calls get_slide_prompt(browser-shell)
   → Receives 2,145 tokens (8.6KB CSS-only prompt)

4. Model generates 8-slide HTML deck
   → ~1,920 output tokens

5. Model calls create_slides(preview, html=<HTML>)
   → Sends ~1,992 tokens of HTML (ONLY time HTML is sent)
   → MCP saves to ~/Desktop/slideshot-output/slides.html
   → Returns 178 tokens of JSON: {slideCount: 8, htmlPath: "..."}
   → NO Puppeteer. NO images. Instant.
   → Model shows HTML as code block (client renders preview)

6. User approves

7. Model calls create_slides(review, htmlPath="...")
   → Sends 22 tokens (just the file path!)
   → MCP reads from disk, counts slides
   → Returns 152 tokens of JSON
   → NO images. Instant.

8. User approves

9. Model calls render_html_to_images(htmlPath="...", formats:["pdf"])
   → Sends 29 tokens (file path + format)
   → Direct page.pdf() — no raster screenshots
   → Returns 30 tokens of JSON paths
   → NO base64 preview image
```

## Where the Savings Come From

| Optimization | v2.8.1 | v2.9.0 | Saved |
|-------------|-------:|-------:|------:|
| Tool + schema descriptions (x12 turns) | 11,592 | 5,268 | 6,324 |
| discover payload | 2,115 | 422 | 1,693 |
| Prompt template (browser-shell.md) | 5,750 | 2,145 | 3,605 |
| Preview response (base64 + HTML echo) | 16,974 | 178 | 16,796 |
| Review input (HTML re-send) | 1,992 | 22 | 1,970 |
| Review response (8x base64 images) | 120,029 | 152 | **119,877** |
| Render input (HTML re-send) | 1,999 | 29 | 1,970 |
| Render response (base64 + webp files) | 15,064 | 30 | 15,034 |

**Single biggest win: Removing base64 images from review (120K tokens → 152 tokens)**

## Test Methodology

- Token estimation: ~4 chars per token for text, ~3 bytes per token for base64 image data
- Preview/review image sizes estimated at ~45KB base64 per slide (typical 540x675 @ 1x WebP)
- discover and get_slide_prompt results are measured from actual tool handler calls
- HTML content is a realistic 8-slide JioBlackRock deck (~7.7KB)
- Test script: `/tmp/slideshot-token-test/measure.mjs`

## How to Reproduce

### Test A — npm v2.8.1
```bash
# In Claude Desktop MCP config:
{ "command": "npx", "args": ["-y", "slideshot-mcp@2.8.1"] }
```

### Test B — Local v2.9.0
```bash
cd html-to-slides && npm run build:mcp
# In Claude Desktop MCP config:
{ "command": "node", "args": ["/path/to/html-to-slides/packages/mcp-server/dist/index.js"] }
```

Use the same prompt for both and record token usage from Claude's session info.

## Further Optimization Opportunities

1. **Fetch prompts from webapp API** — eliminates bundled prompt files, enables hot updates
2. **Skip get_slide_prompt for known themes** — if model already knows CSS, save ~2,145 tokens
3. **Merge discover + get_slide_prompt** — when user provides all answers upfront, one call instead of two
4. **Remove MCP prompt registration** — 8 prompts loaded at startup are rarely used via prompts API
