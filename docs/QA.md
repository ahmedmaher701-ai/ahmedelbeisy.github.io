# Validation

Tested in headless desktop Chrome on 2026-10-17 through a local static HTTP server.

- Viewports: 1440, 1024, 768, 390 and 320 CSS pixels; no horizontal overflow.
- Full-page desktop and mobile screenshots reviewed visually.
- Mobile navigation opens/closes, exposes expanded state, closes on navigation and Escape, and restores focus on Escape.
- All category filters show the matching card; reset restores three cards and updates the live count.
- Native case study expansion works with Enter and without JavaScript.
- CV action downloads the expected text file.
- Reduced-motion emulation yields automatic rather than smooth scrolling.
- All internal fragment destinations resolve; local CSS, JS, portrait, social image, favicon and CV return HTTP 200.
- Navigation and case studies remain usable with JavaScript disabled.
- No JavaScript runtime exceptions observed; `node --check script.js` passed.

## Reproduce

Serve the repository on port 4173. With Playwright available to Node and Google Chrome installed, run from the repository root:

```sh
node scripts/browser-check.cjs
```

If needed, install Playwright as a local development-only tool with `npm install --no-save playwright`. Screenshots are saved to `qa/` and ignored by Git. The site itself has no package or build dependency.

## Limits

No physical-device, Safari/Firefox, screen-reader, external contact destination, live GitHub Pages deployment or social crawler verification was performed. Career statements remain self-reported. Google Fonts requires an internet connection; system fallbacks are specified. The expected project URL still needs confirmation against GitHub Pages settings.

## Browser comment revisions

Rechecked at 1537, 1024, 768, 390 and 320 CSS pixels. All image assets loaded, the requested copy changes were confirmed, and no horizontal overflow or JavaScript exceptions occurred. Measured all nine capability boxes with icons shown and hidden; widths and heights remained identical at every tested width. Project artwork and icon-grid screenshots were visually reviewed.
