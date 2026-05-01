# Sketch Handdrawn — DNA Specification

An informal, whiteboard-style aesthetic: hand-drawn fonts, dashed borders, gentle rotations. For internal team explainers, brainstorm recaps, "napkin math" carousels, and onboarding decks where authority is *not* the goal. Each slide is {{SLIDE_DIMS}}px ({{SLIDE_W}}×{{SLIDE_H}} px canvas), overflow:hidden, no JS.

## Canvas

- Background: `#FFFEF7` (warm paper) plus a 0.08-opacity dotted noise grid (1px radial-gradient at 18px tile).
- A 2px dashed inner border (`#1F1F1F`) inset 14px on every side, with a subtle `border-radius: 4px`. Reads as a sticky-note frame.
- Slides intentionally feel a touch crooked — `transform: rotate(-1deg to 1deg)` on cards and badges.

## Typography

- Display: **Caveat** (handwriting, 700) for `h1`/`h2` and `.tname`. Used at 48px+ for headlines.
- Body: **Architects Daughter** (400) for paragraphs, item labels, badges.
- Default `.slide` font: **Patrick Hand** for everything else.

All three are Google Fonts with consistent ink weight; never mix in a sterile sans-serif.

## Palette

| Role | Hex |
|------|-----|
| Warm paper | `#FFFEF7` |
| Sticky cream | `#FFFCEE` |
| Highlighter yellow | `#FFF6CC` |
| Marker red | `#D9534F` |
| Ink black | `#1F1F1F` |

## Anatomy

Every slide opens with `.label` styled as `~ EYEBROW ~` (red, Architects Daughter, uppercase). Use it to anchor the slide to a section.

Standard blocks:
- `.stat-card` — sticky cream rectangles, 2px ink border, 6px radius, gently rotated. Numerals in Caveat 38px.
- `.item-list li` — Caveat numerals (red) + Architects Daughter labels, dotted bottom borders.
- `.quote-block` — highlighter-yellow box with ink border, Caveat 24px italic, optional `— Attribution`.
- `.badge` — pill-shaped, sticky cream fill, ink border, slight rotation.
- `.compare-grid` — left card stays sticky cream, right card switches to `#F0FFF4` (mint) with mirrored rotation.
- `.timeline` — dashed vertical rail; markers are red ★ characters, not circles.
- `.team-card` — circular avatar with ink border and yellow fill; name in Caveat 20px.

## Voice

Conversational, plainspoken, occasional dashes — em-dashes and "(roughly)" parentheticals welcome. Treat each slide like a marker drawing on a fresh sticky note: idea-first, polish-last.
