# CV-WEB

Single-page CV site: Next.js (static export), Tailwind CSS v4, shadcn/ui and Magic UI, hosted on GitHub Pages.

- Plan: [`docs/MILESTONES.md`](docs/MILESTONES.md)
- Content: [`docs/CONTENT.md`](docs/CONTENT.md) (copied into `src/data/resume.ts` in M1)

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at http://localhost:3000 |
| `npm run build:pages` | Static export to `out/`, under `/CV-WEB/` like GitHub Pages |
| `npm run test:unit` | Vitest: content module (S1) and rendered sections (S2) |
| `npm run test:build` | Builds, then Vitest checks the static output (S3). `SKIP_BUILD=1` reuses `out/` |
| `npm run test:e2e` | Builds, then Playwright runs in Chromium against `out/` served at `/CV-WEB/` (S4) |
| `npm test` | Unit tests, build tests, then browser tests |

## Changing the accent colour

Edit `--accent-brand` in `src/app/globals.css` (once in `:root`, once in `.dark`) and run `npm test`.
The colour tests check AA contrast in both themes, so no test needs editing.
