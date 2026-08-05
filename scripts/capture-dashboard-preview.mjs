import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\顶顶顶顶\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");
const baseUrl = process.env.PERSONAL_PAGE_URL || "http://127.0.0.1:4179";
const output = resolve("assets/operations-dashboard/preview-ai-demo.png");

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${baseUrl}/assets/operations-dashboard/index.html`, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.locator("#pageTitle").waitFor({ state: "visible", timeout: 30_000 });
await page.waitForTimeout(2_000);
await page.locator("body").evaluate((body) => {
  body.querySelectorAll(".portfolio-return, .portfolio-back-link, [data-return-portfolio]").forEach((element) => {
    element.style.display = "none";
  });
});
await page.screenshot({ path: output, animations: "disabled" });
await browser.close();
console.log(`Captured ${output}`);
