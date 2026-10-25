# Ahmed El-Beisy — professional portfolio

A buildless, accessible portfolio for data analytics, automation and transformation leadership. Retains the original cream, black and orange identity, Bebas Neue, Inter and Playfair Display fonts, portrait and professional history.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No build, package installation or framework is required to serve the site.

## Files

- `index.html`: semantic page content, career history, project case studies, SEO and sharing metadata.
- `styles.css`: design tokens, layout, responsive styles, focus indicators and reduced motion.
- `script.js`: mobile navigation and progressive project filtering.
- `assets/`: extracted original portrait, favicon, 1200 × 630 sharing image and owner-supplied PDF resume.
- `docs/CONTENT-REVIEW.md`: source provenance and information requiring owner confirmation.
- `docs/QA.md`: browser checks and known limits.
- `scripts/browser-check.cjs`: optional reproducible browser checks; requires Playwright and Chrome on the development machine. Neither is used by the website.

Navigation, contact actions, CV downloads and native expandable case studies work without JavaScript. Project filters appear only when JavaScript is available. Fonts use Google Fonts with system fallbacks; all functional assets are local.

## GitHub Pages

Publish the contents of this repository, with `index.html` at its root. In GitHub **Settings → Pages**, select **Deploy from a branch**, the intended branch and **/(root)**. `.nojekyll` keeps deployment static; no workflow or framework build is necessary.

The expected project URL for the supplied owner and repository name is:

`https://ahmedmaher701-ai.github.io/ahmedelbeisy.github.io/`

Relative CSS, script, image and download URLs support this project subpath. Canonical and Open Graph URLs use that expected URL. If Pages uses a custom domain or another location, update `canonical`, `og:url` and `og:image` in `index.html` before publishing. The site uses the existing GitHub Pages configuration.

## Editing content

Change content directly in `index.html`; the PDF resume is an owner-supplied asset; replace it only with an updated approved resume. Project cards use `data-category` values matching filter buttons. Adding a new card also requires updating the initial project count and the “All projects” count. Native `details` elements provide keyboard-accessible expansion without a modal or focus trap.

Project artwork is generated in a retro infographic style and explicitly labeled as conceptual. Prompts and asset paths are documented in `docs/ARTWORK.md`. Replace each `.project-visual` with an approved image, useful alternative text and caption when available. Retain image dimensions/aspect ratio to avoid layout shifts. Editorial verification notes remain in docs/CONTENT-REVIEW.md.

The Download CV links serve `assets/Ahmed_ElBeisy_Resume_2026.pdf`, the unmodified PDF supplied by the owner. Replace that file with a new approved version when needed, or update all three links if its filename changes.

Maintain the bright orange for backgrounds and large decorative accents. Small orange text uses darker `--rust` for legibility. Keep reduced-motion overrides and visible keyboard focus styles.

## Interactive exhibits (October 2026)

Three full-width project exhibits pair optimized generated artwork with independent finite animations. Each plays once when visible, with pause/replay controls. Motion pauses offscreen and when the tab is hidden. Reduced motion disables autoplay. The reconciliation dashboard filters six synthetic balance-sheet accounts, including two offsetting exceptions. No framework or runtime dependency was added.
