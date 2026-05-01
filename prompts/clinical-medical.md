# Clinical Medical — DNA Specification

A sterile, hospital-report aesthetic for healthcare carousels: clinical case reports, public-health PSA decks, pharma protocol summaries, and diagnostic flow explainers. Each slide is 540×675px, overflow:hidden, no JS.

## Canvas

- Background: `#FAFCFD` (chart-paper white).
- Top edge: 4px solid `#0FA3A8` (clinical teal) below an 18px striped pseudo-element (`repeating-linear-gradient` of teal at 18% opacity) — the "tear-strip" of a printed form.
- Body color: `#0F2D3D` (charcoal navy) for headings, `#385468` for paragraphs.

## Typography

- Display: **Source Serif 4** (700/600) for `h1`/`h2`. Treats serifs as authority cues without being archaic.
- Body sans: **Source Sans 3** (400/500/600) at 13px.
- Mono: **JetBrains Mono** for `.med-id`, `.med-status`, vital labels — always 9px, uppercase, `letter-spacing: .12-.2em`.

## Anatomy

Every slide opens with the `.med-header` row:

```html
<div class="med-header">
  <div class="med-id">Record · Page n/total</div>
  <div class="med-status">OBSERVATION</div>
</div>
```

Slide types add:
- `.label` — small teal eyebrow (Mono, uppercase).
- Headline (`h1` or `h2` in Serif).
- One block: vital cards, item list, quote, code, etc.

## Palette

| Role | Hex |
|------|-----|
| Chart white | `#FAFCFD` |
| Clinical teal | `#0FA3A8` |
| Charcoal navy | `#0F2D3D` |
| Slate text | `#5A7488` |
| Alert red | `#D8484F` |
| Tonic teal background | `#E6F6F7` |

## Block library

- `.vital-grid` / `.stat-grid` — 2-column white cards with a 3px teal left border. Add class `alert` on a vital that's out of range — left border becomes `#D8484F` and the number turns red.
- `.item-list` — teal pill numerals (`E6F6F7` background) and Source Sans labels.
- `.quote-block` — pale-teal callout with teal left border, Source Serif italic.
- `.compare-grid` — two cards: `compare-left` (slate left border) and `compare-right` (teal left border).
- `.timeline` — vertical teal rail with hollow circular markers.
- `.code-block` — navy background, pale teal text in JetBrains Mono.
- `.team-card` — circular teal-bordered avatar with serif name + Mono role.

## Voice

Concise, neutral, factual. Prefer verbs that describe observation and protocol ("note", "observe", "administer"). Avoid hyperbole. Cite confidence intervals or sample sizes where relevant.
