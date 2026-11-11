// Serves ./out at /CV-WEB/ the way GitHub Pages does, for Playwright.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = join(process.cwd(), "out");
const BASE = process.env.BASE_PATH ?? "/CV-WEB";
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const candidates = [safe, join(safe, "index.html"), `${safe}.html`];
  for (const rel of candidates) {
    const full = join(ROOT, rel);
    if (!full.startsWith(ROOT)) return null;
    try {
      if ((await stat(full)).isFile()) return full;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (pathname === BASE) {
    res.writeHead(301, { Location: `${BASE}/` }).end();
    return;
  }
  if (BASE && !pathname.startsWith(`${BASE}/`)) {
    res.writeHead(404).end("Not found");
    return;
  }
  const file = await resolveFile(pathname.slice(BASE.length));
  if (!file) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
