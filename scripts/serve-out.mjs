// Serves ./out at /CV-WEB/ the way GitHub Pages does: for Playwright, Lighthouse and the cv.pdf build.
// CLI: node scripts/serve-out.mjs   (PORT and BASE_PATH env vars override the defaults)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = join(process.cwd(), "out");

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

/**
 * Starts the server and resolves once it is listening. Port 0 picks a free port.
 * Returns { server, url } where url is the site root, e.g. "http://localhost:4173/CV-WEB/".
 */
export function serveOut({ port = 4173, base = "/CV-WEB" } = {}) {
  const server = createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");
    if (pathname === base) {
      res.writeHead(301, { Location: `${base}/` }).end();
      return;
    }
    if (base && !pathname.startsWith(`${base}/`)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const file = await resolveFile(pathname.slice(base.length));
    if (!file) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  });

  return new Promise((resolve) =>
    server.listen(port, () => resolve({ server, url: `http://localhost:${server.address().port}${base}/` })),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await serveOut({
    port: Number(process.env.PORT ?? 4173),
    base: process.env.BASE_PATH ?? "/CV-WEB",
  });
  console.log(`Serving out/ at ${url}`);
}
