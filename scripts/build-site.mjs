import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const assetDefinitions = [
  ["/rfm-original-desensitized-v2.png", "rfm-original-desensitized-v2.png", "image/png"],
  ["/assets/operating-notes.js", "assets/operating-notes.js", "text/javascript; charset=utf-8"],
  ["/assets/industry-notes.js", "assets/industry-notes.js", "text/javascript; charset=utf-8"],
  ["/assets/note-methodology.js", "assets/note-methodology.js", "text/javascript; charset=utf-8"],
  ["/assets/du-huazhao-profile-2026.png", "assets/du-huazhao-profile-2026.png", "image/png"],
  ["/assets/brand-logos/by-health.png", "assets/brand-logos/by-health.png", "image/png"],
  ["/assets/brand-logos/mead-johnson.png", "assets/brand-logos/mead-johnson.png", "image/png"],
  ["/assets/brand-logos/suibao-icon.png", "assets/brand-logos/suibao-icon.png", "image/png"],
  ["/assets/brand-logos/enchanteur.svg", "assets/brand-logos/enchanteur.svg", "image/svg+xml; charset=utf-8"],
  ["/assets/operations-dashboard/index.html", "assets/operations-dashboard/index.html", "text/html; charset=utf-8"],
  ["/assets/operations-dashboard/preview-ai-demo.png", "assets/operations-dashboard/preview-ai-demo.png", "image/png"],
  ["/assets/operations-dashboard/jd_dashboard_api.js", "assets/operations-dashboard/jd_dashboard_api.js", "text/javascript; charset=utf-8"],
  ["/assets/operations-dashboard/jd_promotion_demo.js", "assets/operations-dashboard/jd_promotion_demo.js", "text/javascript; charset=utf-8"],
  ["/assets/operations-dashboard/jd_aftersale_dashboard.js", "assets/operations-dashboard/jd_aftersale_dashboard.js", "text/javascript; charset=utf-8"],
  ["/assets/operations-dashboard/dashboard-demo.json", "assets/operations-dashboard/dashboard-demo.json", "application/json; charset=utf-8"],
];
const assets = Object.fromEntries(await Promise.all(assetDefinitions.map(async ([pathname, file, contentType]) => [
  pathname,
  {
    contentType,
    body: (await readFile(resolve(root, file))).toString("base64"),
  },
])));

const worker = `const HTML = ${JSON.stringify(html)};
const ASSETS = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    if (url.pathname === "/health") {
      return new Response("ok", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    const asset = ASSETS[url.pathname];
    if (asset) {
      const bytes = Uint8Array.from(atob(asset.body), (character) => character.charCodeAt(0));
      return new Response(request.method === "HEAD" ? null : bytes, {
        headers: {
          "content-type": asset.contentType,
          "cache-control": "public, max-age=86400",
          "x-content-type-options": "nosniff",
        },
      });
    }

    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(request.method === "HEAD" ? null : HTML, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
      },
    });
  },
};
`;

const output = resolve(root, "dist/server/index.js");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, worker, "utf8");
console.log(`Built ${output}`);
