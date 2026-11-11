# CV Website — TDD Milestones

Sources: `SPEC_C_web.md` (Next.js static export + Tailwind v4 + shadcn/ui + Magic UI) and
`CONTENT.md` (content).

Every milestone is built as **vertical slices**: write one failing test, then the least code that passes it, then
the next test. Never write a milestone's tests all at once. The test lists below give the *planned order of slices*.
Refactoring happens in review between milestones, not inside the red → green loop.

## Decisions

| Topic | Decision | Effect on the plan |
|---|---|---|
| Test seams | S1–S5 below, confirmed | No tests outside them |
| Hosting | **GitHub Pages** | `basePath` comes from an env var, `images.unoptimized`, `.nojekyll`, deploy through `actions/deploy-pages`, no Vercel Analytics, so no analytics at all |
| Accent | **Indigo for now (600 light / 400 dark); will change later** | Accent lives in one token pair. Tests are written so a swap needs no test edits (M2 #16, M6) |
| Content | **Drafted in `CONTENT.md`** | Generic personal statement; 2–4 bullets per role; phone left off |
| Projects | **1–6, room to add more later** | The grid adapts to the number of projects; no empty placeholder cards |
| Avatar | **GitHub profile photo** | Saved as `public/avatar.webp`; company logos fall back to initials |
| Public `cv.pdf` | **Generated from the site's print styles** | One source of truth; reuses M2 #14 |
| Repo / URL | **`CV-WEB` → `cypherz01.github.io/CV-WEB/`** | `BASE_PATH=/CV-WEB` |

---

## Test seams (confirmed)

| # | Seam | What we observe | Tooling |
|---|------|-----------------|---------|
| S1 | **Content module**: `src/data/resume.ts` and its pure helpers (`formatDateRange`, `sortRolesNewestFirst`, `toPersonJsonLd`, `validateResume`) | Return values for given input | Vitest |
| S2 | **Rendered sections**: each section component rendered with a resume fixture | Accessible roles, names, text and links (`getByRole`, never class names) | Vitest + React Testing Library + jsdom |
| S3 | **Static build output**: `out/` after `next build` | Content in HTML without JS; meta tags; JSON-LD; sitemap and robots; asset URLs under the base path | Vitest + `node-html-parser` |
| S4 | **Real browser**: the exported site served **under the GitHub Pages base path** | Layout at 375/768/1024/1440, keyboard path, reduced motion, theme, print to PDF, axe | Playwright + `@axe-core/playwright` |
| S5 | **Audit budgets**: Lighthouse and bundle size | Scores ≥ 95, LCP/CLS, JS < 150 KB gz | Lighthouse CI + bundle-size check |

The test fixture `resumeFixture` uses invented, hard-coded values, not the real CV. That way section tests can't pass
just because they read the same data as the code, and editing the real CV never breaks them.

---

## Content

All site copy is drafted in [`CONTENT.md`](CONTENT.md) and already follows the spec's rules. M1 #10 copies it into
`resume.ts`, which then becomes the single source of truth. Skill groups follow the CV's 5 categories, so groups
come from the data, not the spec's fixed 4.

---

## M0 — Test harness, scaffold, GitHub Pages deploy

**Goal:** an empty static-export site deployed to GitHub Pages, with every test layer wired up and one passing
test for each seam.

Slices:
1. S3: `next build` writes `out/index.html` with `<html lang="en">`. Code: `output: 'export'`.
2. S3: when built with `BASE_PATH=/CV-WEB`, every `<script src>` and `<link href>` in `out/index.html` starts with `/CV-WEB/`. Code: `basePath`/`assetPrefix` read from the env var.
3. S3: `out/.nojekyll` exists. Without it, GitHub Pages hides the `_next/` folder.
4. S2: rendering `<Page />` gives a `main` landmark. Code: minimal layout.
5. S4: Playwright opens the site under the base path and finds `main`. Code: a static server that serves `out/` at `/CV-WEB/`.
6. S4: `<html>` gets `class="dark"` when the browser prefers dark, and no class when it prefers light. Code: next-themes with `attribute="class"` and `defaultTheme="system"`.
7. S3: Geist Sans and Geist Mono are self-hosted in `out/` with no request to Google Fonts. Code: `next/font`.
   - Added S4 slice: `<html>` and `<body>` compute to Geist. This caught the scaffold's Arial body rule and shadcn's self-referencing `--font-sans`.
8. S4: the neutral tokens equal the spec's values in both themes; foreground, muted-foreground and `--accent-brand` reach 4.5:1 on the background. Code: colour tokens in `globals.css`.
   - The accent is checked by contrast only, never by value, so M6 needs no test edits. axe's `color-contrast` rule starts working in M2 #15, once the page has text.
   - Light accent is **indigo 600 `#4F46E5`**: the spec's indigo 500 `#6366F1` is only 4.47:1 on white, below AA. Dark stays indigo 400 `#818CF8`.

**Status:** all 8 slices green locally (`npm test`), plus lint and type check. Remaining: push to GitHub and turn on Pages.

Setup (not test-driven):
- Run the setup commands (npm instead of pnpm, which is not installed; Magic UI components are added in M3 when they are first used).
- Add Vitest, Testing Library, Playwright and axe.
- Add a GitHub Actions workflow: `test:unit` → `build` → `test:e2e` → on `main`, upload `out/` and deploy with `actions/deploy-pages`.
- Create the GitHub repo and turn on Pages with "GitHub Actions" as the source.

**Done when:** CI is green and the empty page is live at `https://cypherz01.github.io/<repo>/`.

---

## M1 — Content model (S1)

**Goal:** `resume.ts` is the single source of truth, and invalid content fails CI.

Slices:
1. `formatDateRange({start:"2024-09"})` returns `"Sept 2024 – Present"`, and `{start:"2021", end:"2022"}` returns `"2021 – 2022"`. Year-only dates are allowed because most CV roles have only years.
2. `sortRolesNewestFirst` puts the newest `start` first, and puts an ongoing role (no `end`) above a finished role that started in the same year.
3. `validateResume` rejects a date that is neither `YYYY` nor `YYYY-MM`.
4. `validateResume` rejects a role with 1 or 5 highlights (the limit is 2–4).
5. `validateResume` rejects a project summary over 140 characters.
6. `validateResume` rejects more than one `featured` project, and 0 or 7 projects (the limit is 1–6).
7. `formatStat({value:85, prefix:"£", suffix:"k"})` returns `"£85k"`, and `{value:5, suffix:"+"}` returns `"5+"`.
8. `validateResume` rejects a `contact.email` that isn't a valid email address, and a `pitch` over 160 characters (it doubles as the meta description).
9. `toPersonJsonLd(resumeFixture)` returns a `Person` with `name`, `jobTitle` (the first role), `address.addressLocality`, `email` as `mailto:`, and `sameAs` holding the social URLs that are present.
10. **Content entry:** copy `CONTENT.md` into `resume.ts`. Test: the real `resume` passes `validateResume`. This test is the CI guard on every later content edit.

**Done when:** the real CV content passes validation.

**Status:** done. 42 unit tests green. Types: `src/data/types.ts`; helpers: `src/lib/cv.ts`; content: `src/data/resume.ts`; fixture: `src/test/resume-fixture.ts`. `Project.image` is optional and `Project.year`, `Resume.availability` and `Education.start` were added for the real content.

---

## M2 — Content, no effects (S2, S3, S4). Shippable at the end.

**Goal:** every section renders from `resume.ts` using shadcn/ui only; responsive and print styles work.

Section slices (for each one, write the S2 test first, then the component):
1. **Hero:** exactly one `h1` with the name; the avatar image with alt text equal to the name; the first role; location; a "Download CV" link to `{basePath}/cv.pdf`; a "Contact" link to `#contact`.
2. **About:** an `h2` "About"; the summary; each stat's label and **final** value are in the output.
3. **Experience:** one entry per role, newest first; title, company and date range are visible; the bullets sit behind a button with `aria-expanded`, and Enter or Space toggles it. The "Technologies" line is shown as badges.
4. **Skills:** an `h3` for each group *in the data* (adding a group to the fixture makes it render), with that group's badges under it.
5. **Projects:** one card per project; live and code links only where the URLs exist; `image` is optional: a card with no image shows text, tech badges and links only, with no empty image space; when an image is present it has `alt` text.
6. **Education:** qualification, institution and years for each entry.
7. **Contact:** a `mailto:` link; external links have `target="_blank"` and a `rel` that includes `noopener`; **no phone number anywhere in the page**.
8. **Footer:** shows `lastUpdated`.
9. **Skip link:** the first focusable element is "Skip to content", and it targets `main`.
10. **Section ids:** `#top #about #work #skills #projects #education #contact` all exist.

Browser and build slices:
11. S3: with no JS, every piece of section text is in `out/index.html`, **including the experience bullets**. Code: render the accordion content with `forceMount` and toggle `hidden`.
12. S4 at 375 px: the `h1`, the role and the Contact CTA are all inside the first screen.
13. S4: the projects grid is 1 column below 768 px. At 1024 px the featured card spans the full width and the others sit 2 per row. Run this with the real 2 projects and with a 5-project fixture, so adding projects later needs no layout work.
14. S4 print: emulate `print`, and the A4 PDF has ≤ 2 pages; Dock and buttons are hidden; accordion bullets show; link URLs appear after the link text; the light theme is forced.
15. S4: axe finds zero violations in light and dark.
16. S4 **accent swap guard:** inject a different `--accent-brand` value. Links, focus rings and the primary CTA all compute to the new colour. This proves no component hard-codes indigo, so the later swap (M6) is one edit.

**Done when:** a fixture with an extra role renders that role with no component change. This proves the spec's "updating a job requires editing only `resume.ts`".

**Status:** all 16 slices and the "done when" test green: 68 unit, 12 build and 28 browser tests, plus lint and type check.
Notes:
- Sections live in `src/components/sections/`; `src/components/cv-page.tsx` composes them and `page.tsx` passes the real `resume`.
- Bullets use a plain button disclosure (`role-highlights.tsx`) instead of the Radix Accordion: the list is always rendered and toggled with `hidden`, so it is in the static HTML (#11) and print CSS can reveal it (#14).
- Links to files in `public/` go through `withBasePath` (`src/lib/base-path.ts`); `next.config.ts` inlines `NEXT_PUBLIC_BASE_PATH` and sets `images.unoptimized`.
- Print forces light by scoping the `.dark` tokens and the `dark:` variant to `not print`; the root font drops to 10 px so the CV fits 2 A4 pages.
- One accent focus outline for every element (`:focus-visible` in `globals.css`); shadcn Button's own grey ring was removed.
- The 5-project layout case clones cards in the browser, since the static export only holds the real data.
- Title and meta description are already set from `resume` (M4 #5 will test them).
- "Download CV" links to `/CV-WEB/cv.pdf`, which 404s until M5 #1 generates it.

---

## M3 — Magic UI layer (S2, S3, S4)

**Goal:** add the effects without breaking anything from M2. **M2's tests must stay green without being changed.**
That is the main guard for this milestone.

Slices:
1. S4: after hydration, a section below the fold starts hidden and appears once 20% of it is on screen (BlurFade, `once`).
2. S3: before hydration, the same section's text is in the HTML and is not `opacity:0` in the server markup.
3. S4: the hero role cycles through `resume.roles` every ~2.5 s (Playwright clock).
4. S4: the About stats reach their final values once scrolled into view (NumberTicker).
5. S2: the featured project card renders a beam with `aria-hidden="true"`; the other cards don't.
6. S4: the Dock sits fixed at the bottom centre; every icon has an accessible name and a tooltip; clicking a section icon scrolls to that section (under the base path).
7. S4: Dock icons have tap targets of at least 40×40 px at 375 px; magnification doesn't run on touch (`hasTouch`).
8. S4: the theme toggle switches `html.dark`, and the choice survives a reload.
9. S4: the ScrollProgress bar grows as the page scrolls.
10. S2: `DotPattern` and `IconCloud` are `aria-hidden`; `IconCloud` isn't in the DOM at 375 px.
11. S4: at most one infinitely looping animation runs at any time (`document.getAnimations()`).
12. S4: the Border Beam and Shimmer Button use `--accent-brand`, so M2 #16 still passes with effects on.

**Done when:** every M2 test passes untouched, plus the slices above.

**Status:** all 12 slices green, with no M2 test file edited: 73 unit, 14 build and 50 browser tests (150/150 over 3 repeats), plus lint and type check.
Magic UI components were copied in with the shadcn CLI (`@magicui` registry in `components.json`) and adapted where the
tests demanded it; each file's header comment says what changed and why:
- **BlurFade**: rewritten without motion. The server HTML is never hidden (#2); JS hides a section only if it is fully off screen at load, then reveals it at 20% (#1). Print forces it visible.
- **NumberTicker**: server-renders the final value, resets to 0 only when off screen, then springs up in view. The whole ticker is `aria-hidden`, and an `sr-only` copy carries the final value, so M2's "£85k is in the page" tests hold.
- **WordRotate**: a `<span>`, not a second `<h1>`; a CSS entry animation (tw-animate-css) replaces AnimatePresence, whose exit never finished under Playwright's paused clock.
- **BorderBeam / ShimmerButton**: one CSS keyframe each, coloured from `--accent-brand`, paused off screen by `usePlayWhenVisible` so only one infinite loop runs at a time (#11). The shimmer is a link (`ShimmerLink`) with `data-slot="button"` so print hides it.
- **Dock**: icons fill their 40 px tap target; magnification is off for `(hover: none), (pointer: coarse)`. Labels are shared by `aria-label` and the Radix tooltip. 8 icons (no Education) so it fits 375 px.
- **IconCloud**: image URLs only (inline SVG data URIs from `simple-icons`, no icon CDN), no pause button or canvas role, stops when off screen or with reduced motion; only mounted at ≥ 1024 px.
- **DotPattern**: one SVG `<pattern>`, no JS or motion.

**For M4 #7:** initial JS is ~285 KB gzipped. The chunks without effects (React DOM, Next runtime and router) already total ~172 KB, so the 150 KB budget cannot be met by trimming effects alone. Options: raise the budget, lazy-load IconCloud and the Dock tooltips, or replace motion in the Dock and ScrollProgress.

---

## M4 — Hardening (S3, S4, S5)

Slices:
1. S4 reduced motion (`emulateMedia({ reducedMotion: 'reduce' })`): `document.getAnimations()` is empty after load and after scrolling the whole page.
2. Reduced motion: the hero shows the first role and it hasn't changed after 5 s; stats show their final values immediately; every section is visible without scrolling to it.
3. Reduced motion: `scroll-behavior` is `auto`; with motion allowed it is `smooth`.
4. Keyboard: tabbing from the top visits, in order: skip link → hero CTAs → each accordion → each project link → contact links → each Dock icon. Every focused element shows a visible focus ring.
5. S3 SEO:
   - `<title>` is `"Tom Cuthbertson — Software Engineer"`.
   - The meta description is under 160 characters.
   - `og:image` is an absolute URL (including the base path) to a 1200×630 image.
   - The JSON-LD equals `toPersonJsonLd(resume)`.
   - `sitemap.xml` and `robots.txt` exist and contain the full Pages URL.
6. S3 privacy: no analytics or other third-party scripts; no phone number in any built file.
7. S5: initial JS is at most 150 KB gzipped, and going over fails the build.
8. S5: Lighthouse CI on mobile asserts all four scores ≥ 0.95, LCP < 2000 ms and CLS < 0.05.
   - Images aren't optimised automatically on Pages (`unoptimized`), so they must be pre-sized WebP/AVIF files.
9. S4: axe again finds zero violations in both themes, with reduced motion on and off.

**Done when:** every item on the spec's acceptance checklist is covered by a passing automated test (table below).

---

## M5 — Launch

1. Generate the public `cv.pdf` from the site's print styles (a build script using Playwright `page.pdf`) and put it in `public/`. S3 test: it exists in `out/` and is at most 2 pages.
2. Optional: custom domain. Add a `CNAME` and set `BASE_PATH` to empty. The S3 base-path test runs in both setups.
3. Smoke test (S4 against production): the page returns 200 over HTTPS, and `cv.pdf` is served as `application/pdf`.
4. Run Lighthouse CI once against production.
5. Manual: link the site from the GitHub profile (and LinkedIn, if added).

---

## M6 — Accent colour swap

**Goal:** replace indigo with your own brand colour after the site is built.

1. Pick the light and dark values for the new colour.
2. Change only `--accent-brand` (light and dark) in `globals.css`.
3. Run the full suite with **no test edits**. The contrast checks in M0 #8, M2 #15 and M4 #9 and the swap guard in M2 #16 / M3 #12 decide whether the new colour passes.
4. If contrast fails, adjust the shade, not the tests.

---

## Acceptance checklist → tests

| Spec acceptance item | Covered by |
|---|---|
| Name, role, contact CTA above the fold at 375 px | M2 #12 |
| Lighthouse mobile 95+ in all four | M4 #8, M5 #4 |
| All content visible with JS disabled | M2 #11, M3 #2 |
| Reduced motion: nothing animates or loops | M4 #1–3 |
| Full keyboard navigation with visible focus | M2 #3, #9; M4 #4 |
| Light and dark both pass AA contrast | M0 #8, M2 #15, M4 #9, M6 |
| Prints to 2 A4 pages, no Dock or backgrounds | M2 #14 |
| Updating a job requires editing only `resume.ts` | M1 #10, M2 "done when" |

---

## Possible later updates (out of scope for now)

- Project screenshots (1200×750 WebP). The `image` field is already optional, so adding one is a data edit.
- Live URLs for projects.
- Company logos (the Avatar falls back to initials until then).
- More projects (up to 6).
