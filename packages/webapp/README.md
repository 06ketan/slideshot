# slideshot — Web App

[![GitHub stars](https://img.shields.io/github/stars/06ketan/slideshot)](https://github.com/06ketan/slideshot)

The web interface for [slideshot](https://github.com/06ketan/slideshot). Paste HTML, preview slides live, export to high-res PNG, WebP, and PDF.

**[Live App](https://slideshot.vercel.app)** · **[npm CLI](https://www.npmjs.com/package/slideshot)** · **[npm MCP](https://www.npmjs.com/package/slideshot-mcp)** · **[GitHub](https://github.com/06ketan/slideshot)**

## Features

- Paste HTML with `.slide` elements
- Live preview in iframe
- Export to PNG, WebP, PDF (or all at once)
- Configurable selector, dimensions, scale factor
- Built-in AI prompt templates (generic + branded)
- Acid Brutalist UI

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Puppeteer (server-side rendering)
- JSZip (ZIP bundling)

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The app is deployed at [slideshot.vercel.app](https://slideshot.vercel.app).

To deploy your own:

1. Fork the [GitHub repo](https://github.com/06ketan/slideshot)
2. Import in [Vercel](https://vercel.com/new)
3. Set root directory to `packages/webapp`
4. Deploy

## Related

- **[slideshot](https://www.npmjs.com/package/slideshot)** — CLI: `npx slideshot ./slides.html`
- **[slideshot-mcp](https://www.npmjs.com/package/slideshot-mcp)** — MCP server for Claude / Cursor
- **[GitHub](https://github.com/06ketan/slideshot)** — source code & issues

## License

MIT
