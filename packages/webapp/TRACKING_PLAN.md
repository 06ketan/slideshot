# slideshot Tracking Plan

## Platform
- **Primary**: Vercel Analytics (already installed)
- **Supplementary**: Custom events via `@vercel/analytics` `track()` function

## Key Events

| Event Name | Trigger | Properties | Type |
|---|---|---|---|
| `editor_opened` | User navigates to /editor | `source: "nav" \| "hero" \| "cta"` | Engagement |
| `export_clicked` | User clicks Export button in editor | `formats: string, scale: number` | Conversion |
| `export_completed` | Export finishes successfully | `formats: string, scale: number, slide_count: number` | Conversion (Primary) |
| `export_failed` | Export fails | `error: string` | Error |
| `gallery_viewed` | User navigates to /gallery | `source: "nav" \| "cta"` | Engagement |
| `template_opened` | User clicks a template card in gallery | `template: string` | Engagement |
| `prompt_copied` | User copies a prompt from gallery/modal | `template: string` | Conversion |
| `cta_clicked` | User clicks any CTA button | `location: string, text: string` | Engagement |
| `github_star_clicked` | User clicks GitHub star link | `location: string` | Conversion |
| `npm_install_copied` | User copies npm install command | `command: string` | Conversion |
| `faq_expanded` | User opens an FAQ item | `question: string` | Engagement |

## Conversion Events (Priority)
1. `export_completed` — Primary conversion
2. `prompt_copied` — Secondary conversion (content engagement)
3. `github_star_clicked` — Brand/community conversion

## UTM Strategy

| Source | Medium | Campaign | Example |
|---|---|---|---|
| GitHub README | referral | github-readme | `?utm_source=github&utm_medium=referral&utm_campaign=github-readme` |
| npm package page | referral | npm-package | `?utm_source=npm&utm_medium=referral&utm_campaign=npm-package` |
| LinkedIn post | social | linkedin-launch | `?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin-launch` |
| Twitter/X post | social | twitter-launch | `?utm_source=twitter&utm_medium=social&utm_campaign=twitter-launch` |
| Product Hunt | referral | producthunt | `?utm_source=producthunt&utm_medium=referral&utm_campaign=producthunt` |
| Dev.to article | referral | devto-blog | `?utm_source=devto&utm_medium=referral&utm_campaign=devto-blog` |
| MCP server link | referral | mcp-server | `?utm_source=mcp&utm_medium=referral&utm_campaign=mcp-server` |

## Implementation

Events are tracked via the `trackEvent()` function in `src/components/TrackEvent.tsx`, which wraps `@vercel/analytics` `track()` function. Import and call from any client component.

```tsx
import { trackEvent } from "@/components/TrackEvent";

// In an event handler:
trackEvent("export_completed", { formats: "png,webp", scale: 4 });
```

## Privacy Notes
- No PII is collected
- All tracking uses first-party Vercel Analytics (no third-party cookies)
- Events contain only interaction metadata, never user content
- CLI tool collects zero telemetry
