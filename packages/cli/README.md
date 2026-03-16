# slideshot

[![npm](https://img.shields.io/npm/v/slideshot)](https://www.npmjs.com/package/slideshot)
[![npm downloads](https://img.shields.io/npm/dm/slideshot)](https://www.npmjs.com/package/slideshot)
[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)

Convert HTML slides to high-resolution PNG, WebP, and PDF. Works as both a **CLI** and a **Node.js library**.

**[Web App](https://slideshot.vercel.app)** · **[MCP Server](https://www.npmjs.com/package/slideshot-mcp)** · **[GitHub](https://github.com/06ketan/slideshot)**

## CLI

```bash
npx slideshot slides.html
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --selector <sel>` | CSS selector for slide elements | `.slide` |
| `-W, --width <n>` | Slide width (CSS px) | `540` |
| `-H, --height <n>` | Slide height (CSS px) | `675` |
| `--scale <n>` | Device scale factor (2-6) | `4` |
| `-f, --formats <list>` | Comma-separated: `png,webp,pdf` | `png,webp,pdf` |
| `-q, --quality <n>` | WebP quality (0-100) | `95` |
| `-o, --out <dir>` | Output directory | `./slides` |

### Examples

```bash
# PNG only, 2x scale
npx slideshot deck.html -f png --scale 2

# Custom selector and output dir
npx slideshot deck.html -s ".card" -o ./output

# Get AI prompt template
npx slideshot prompt generic
npx slideshot prompt branded
```

## Programmatic API

```bash
npm install slideshot
```

### `renderSlides(options): Promise<RenderResult>`

Renders slides to files on disk.

```typescript
import { renderSlides } from "slideshot";

const result = await renderSlides({
  htmlPath: "./slides.html",   // or html: "<div class='slide'>...</div>"
  selector: ".slide",
  width: 540,
  height: 675,
  scale: 4,
  formats: ["png", "webp", "pdf"],
  outDir: "./output",
});

console.log(result.files);      // ["/abs/path/slide-01.png", ...]
console.log(result.slideCount); // 5
```

### `renderToBuffers(options): Promise<BufferResult>`

Returns in-memory buffers (useful for web servers, APIs, streaming).

```typescript
import { renderToBuffers } from "slideshot";

const { images, pdf, slideCount } = await renderToBuffers({
  html: "<div class='slide'>Hello</div>",
  formats: ["png", "pdf"],
});

// images: [{ name: "slide-01.png", buffer: Buffer, type: "png" }]
// pdf: Buffer | undefined
```

### Types

```typescript
type ImageFormat = "png" | "webp" | "pdf";

interface RenderOptions {
  html?: string;
  htmlPath?: string;
  selector?: string;    // default: ".slide"
  width?: number;       // default: 540
  height?: number;      // default: 675
  scale?: number;       // default: 4
  formats?: ImageFormat[]; // default: ["png", "webp", "pdf"]
  webpQuality?: number; // default: 95
  outDir: string;
}

interface RenderResult {
  files: string[];
  slideCount: number;
}
```

## AI Prompt

Tell your AI to generate HTML with `.slide` divs at 540x675px. Get the full prompt:

```bash
npx slideshot prompt generic   # clean minimal slides
npx slideshot prompt branded   # Ketan Slides design system
```

## Related

- **[slideshot-mcp](https://www.npmjs.com/package/slideshot-mcp)** — MCP server for Claude Desktop & Cursor
- **[Web App](https://slideshot.vercel.app)** — paste HTML, preview, export online
- **[GitHub](https://github.com/06ketan/slideshot)** — source code & issues

## License

MIT
