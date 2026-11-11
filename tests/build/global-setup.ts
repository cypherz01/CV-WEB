// Builds out/ once before the S3 (static build output) tests.
// Set SKIP_BUILD=1 when out/ was already built with BASE_PATH=/CV-WEB (e.g. in CI).
import { buildPages } from "../../scripts/build-pages.mjs";

export default function setup() {
  if (process.env.SKIP_BUILD === "1") return;
  buildPages();
}
