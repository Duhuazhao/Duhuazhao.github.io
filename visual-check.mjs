import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\顶顶顶顶\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");
const baseUrl = process.env.PERSONAL_PAGE_URL || "http://127.0.0.1:4178/index.html";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
});

const results = [];
for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
]) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: `preview-${viewport.name}.png`, fullPage: true });
  await page.locator(".site-header").screenshot({ path: `preview-${viewport.name}-navigation.png` });

  if (viewport.name === "desktop") {
    for (const [name, selector] of [
      ["hero", "#hero"],
      ["method", "#method"],
      ["experience", "#experience"],
      ["building", "#building"],
      ["about", "#about"]
    ]) {
      await page.locator(selector).screenshot({ path: `preview-section-${name}.png` });
    }
  }

  const layout = await page.evaluate(() => ({
    title: document.title,
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    sections: document.querySelectorAll("main section").length,
    hiddenRevealBlocks: [...document.querySelectorAll(".reveal")]
      .filter((element) => getComputedStyle(element).opacity === "0").length,
    totalRevealBlocks: document.querySelectorAll(".reveal").length
  }));

  assert.equal(errors.length, 0, `${viewport.name} console errors: ${errors.join(" | ")}`);
  assert.ok(layout.sections >= 7, `${viewport.name} should render all major sections`);
  assert.ok(layout.documentWidth <= layout.viewportWidth + 1, `${viewport.name} has horizontal overflow`);
  assert.equal(layout.hiddenRevealBlocks, 0, `${viewport.name} contains hidden content blocks`);

  if (viewport.name === "mobile") {
    await page.locator(".menu-button").click();
    assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "true");
    assert.ok(await page.locator("#navLinks").evaluate((element) => element.classList.contains("open")));
    await page.screenshot({ path: "preview-mobile-navigation-open.png" });
    await page.locator('#navLinks a[href="#experience"]').click();
    assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
    assert.ok(!(await page.locator("#navLinks").evaluate((element) => element.classList.contains("open"))));
  }

  results.push({ viewport: viewport.name, ...layout });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
