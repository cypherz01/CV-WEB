import { expect, type Page, test } from "@playwright/test";

// Neutral palette from the design spec. The accent is deliberately NOT pinned here:
// it is expected to change (milestone M6), so it is judged on contrast only.
const SPEC_PALETTE = {
  light: {
    "--background": "rgb(255, 255, 255)", // #FFFFFF
    "--foreground": "rgb(9, 9, 11)", // #09090B
    "--muted": "rgb(244, 244, 245)", // #F4F4F5
    "--muted-foreground": "rgb(113, 113, 122)", // #71717A
    "--border": "rgb(228, 228, 231)", // #E4E4E7
  },
  dark: {
    "--background": "rgb(9, 9, 11)", // #09090B
    "--foreground": "rgb(250, 250, 250)", // #FAFAFA
    "--muted": "rgb(24, 24, 27)", // #18181B
    "--muted-foreground": "rgb(161, 161, 170)", // #A1A1AA
    "--border": "rgb(39, 39, 42)", // #27272A
  },
} as const;

const WCAG_AA_BODY_TEXT = 4.5;

/**
 * Chrome reports colours in their authored space (oklch(), lab(), ...), so every colour
 * is painted onto a 1x1 canvas and read back as sRGB rgb() before comparing.
 */
const TO_RGB = `(colour) => {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return "rgb(" + r + ", " + g + ", " + b + ")";
}`;

/** Resolves a CSS custom property on :root to rgb(). Fails if the token is not defined. */
async function resolveColour(page: Page, token: string): Promise<string> {
  const { defined, rgb } = await page.evaluate(
    ([name, toRgb]) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const probe = document.createElement("span");
      probe.style.color = `var(${name})`;
      document.body.append(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();
      return { defined: raw !== "", rgb: (0, eval)(toRgb)(computed) as string };
    },
    [token, TO_RGB] as const,
  );
  expect(defined, `${token} is defined`).toBe(true);
  return rgb;
}

async function bodyColours(page: Page) {
  return page.evaluate((toRgb) => {
    const style = getComputedStyle(document.body);
    const convert = (0, eval)(toRgb) as (c: string) => string;
    return { bg: convert(style.backgroundColor), fg: convert(style.color) };
  }, TO_RGB);
}

function contrastRatio(a: string, b: string): number {
  const luminance = (rgb: string) => {
    const [r, g, bl] = rgb.match(/\d+(\.\d+)?/g)!.slice(0, 3).map(Number).map((c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`${scheme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("./");
    });

    test("uses the spec's neutral palette", async ({ page }) => {
      for (const [token, expected] of Object.entries(SPEC_PALETTE[scheme])) {
        expect(await resolveColour(page, token), token).toBe(expected);
      }
    });

    test("paints the page with the background and foreground tokens", async ({ page }) => {
      const body = await bodyColours(page);
      expect(body.bg).toBe(SPEC_PALETTE[scheme]["--background"]);
      expect(body.fg).toBe(SPEC_PALETTE[scheme]["--foreground"]);
    });

    for (const token of ["--foreground", "--muted-foreground", "--accent-brand"]) {
      test(`${token} meets WCAG AA contrast on the background`, async ({ page }) => {
        const fg = await resolveColour(page, token);
        const bg = await resolveColour(page, "--background");
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(WCAG_AA_BODY_TEXT);
      });
    }
  });
}
