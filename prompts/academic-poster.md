# Academic Poster — DNA Specification

A compact carousel themed after IEEE/ACM conference posters. Built for working papers, lit reviews, methodology decks, and thesis summaries. Each slide is 540×675px, overflow:hidden, no JS.

## Canvas

- Background: `#FBF8F1` (parchment cream) with no texture noise.
- Top edge: 6px double border in `#0E1B33` (deep navy). One short 120×6px crimson bar (`#A22E2E`) flush-right anchors the eye.
- Bottom edge: a `.poster-foot` row at 14px from the bottom showing the series label and figure number.

## Typography

- Display + body serif: **IBM Plex Serif** (700 for `h1`, 600 for `h2`, 400 for paragraphs).
- Sans: **IBM Plex Sans** for `.slide` default, used sparingly.
- Monospace: **IBM Plex Mono** at 9-10px for labels, item numbers, and citations — always uppercase and wide-tracked (`letter-spacing: .14-.2em`).

## Anatomy

Every slide carries:
1. A `.label` (Plex Mono, crimson, uppercase) — section/figure metadata.
2. A serif `h1` or `h2` headline.
3. A `.poster-rule` (1px navy 25% opacity) horizontal divider beneath the headline.
4. The body — paragraphs, stat cards, ordered lists, etc.
5. The `.poster-foot` (Plex Mono, 9px, navy 60% opacity) — `SLIDESHOT POSTER SERIES · FIG. n / total`.

## Palette

| Role | Hex |
|------|-----|
| Cream paper | `#FBF8F1` |
| Beige callout | `#F2EBDC` |
| Deep navy | `#0E1B33` |
| Crimson accent | `#A22E2E` |
| Slate body | `#5C6781` |

## Block library

- `.abstract` — beige callout with crimson left border, Plex Serif italics, 12px.
- `.stat-grid` — 2-col grid; cards have a 1px navy outline, white fill, serif numerals.
- `.item-list` — `[01]` style numerals in Plex Mono crimson, dotted bottom borders.
- `.quote-block` — italic Plex Serif on crimson left border.
- `.compare-grid` — two side-by-side `.compare-col` outlined in navy.
- `.timeline` — left rail in crimson with square markers (no bullets).
- `.code-block` — inverted: navy background, parchment text in Plex Mono.

## Voice

Formal academic register. Use measured language, citations, and precise numerals. Treat each slide like a poster panel, not a Tweet.
