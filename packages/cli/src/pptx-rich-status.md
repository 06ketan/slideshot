# Rich-Native PPTX — Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| 0. Scaffold | ✅ Done | Type definitions, NotImplementedError, schema flag |
| 1. Shape extraction | 🔜 Not started | Walk all visible elements, capture rect+fill+stroke |
| 2. Pseudo-elements | 🔜 Not started | ::before/::after via getComputedStyle |
| 3. Backgrounds | 🔜 Not started | linear-gradient → PPTX gradient stops |
| 4. SVG | 🔜 Not started | Flatten or freeform |
| 5. Layout fidelity | 🔜 Not started | Resize page to target before extraction |
| 6. Validation | 🔜 Not started | LibreOffice render-back + pixelmatch |

Update this table as phases complete.
