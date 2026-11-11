# CV-WEB

Single-page CV site: Next.js (static export), Tailwind CSS v4, shadcn/ui and Magic UI, hosted on GitHub Pages.

- Plan: [`docs/MILESTONES.md`](docs/MILESTONES.md)
- Content: [`docs/CONTENT.md`](docs/CONTENT.md) (copied into `src/data/resume.ts` in M1)

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at http://localhost:3000 |
| `npm run build:pages` | Static export to `out/`, under `/CV-WEB/` like GitHub Pages, then prints `out/cv.pdf` from the print styles (needs `npx playwright install chromium`) |
| `npm run test:unit` | Vitest: content module (S1) and rendered sections (S2) |
| `npm run test:build` | Builds, then Vitest checks the static output, JS budget and `cv.pdf` (S3). `SKIP_BUILD=1` reuses `out/` |
| `npm run test:e2e` | Builds, then Playwright runs in Chromium against `out/` served at `/CV-WEB/` (S4) |
| `npm run test:lighthouse` | Lighthouse CI on mobile against `out/` (S5). Set `CHROME_PATH`, e.g. to Playwright's Chromium |
| `npm run test:smoke` | Playwright against the live site (`PROD_URL` to override). CI runs it after every deploy |
| `npm test` | Unit tests, build tests, then browser tests |

## Updating the CV

Edit `src/data/resume.ts` and push. The tests check the content rules, and the build regenerates the page,
`cv.pdf`, the link-preview image, the sitemap and the JSON-LD from that one file.

## Changing the accent colour

Edit `--accent-brand` in `src/app/globals.css` (once in `:root`, once in `.dark`) and run `npm test`.
The colour tests check AA contrast in both themes, so no test needs editing.
