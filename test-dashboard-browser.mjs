import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\顶顶顶顶\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");
const baseUrl = process.env.DASHBOARD_URL || "http://127.0.0.1:4179/assets/operations-dashboard/index.html";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(10000);
await page.emulateMedia({ reducedMotion: "reduce" });

const consoleErrors = [];
const failedResponses = [];
page.on("console", (message) => {
  if (message.type() === "error") {
    const location = message.location();
    consoleErrors.push(`${message.text()}${location.url ? ` @ ${location.url}:${location.lineNumber}` : ""}`);
  }
});
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.locator("#dataSourceStatus").filter({ hasText: "AI 演示数据" }).waitFor();
assert.match(await page.locator("body").innerText(), /数据由 AI 生成 · 仅用于演示 · 非真实经营数据/);
assert.match(await page.locator("#dataSourceStatus").innerText(), /AI-DEMO/);

const modules = [
  { key: "order-income", title: "店铺销售", ready: ".metric-card .metric-value" },
  { key: "consumer-insight", title: "消费者洞察", ready: "#customerDealGrid .segment-card" },
  { key: "product-performance", title: "商品表现", ready: "#productTable tbody tr" },
  { key: "promotion-analysis", title: "推广分析", ready: "#promotionSummaryGrid .metric-card" },
  { key: "aftersale-analysis", title: "售后分析", ready: "#aftersaleApp .aftersale-module" },
];

for (const module of modules) {
  await page.locator(`[data-page-target="${module.key}"]`).first().click();
  const panel = page.locator(`[data-page="${module.key}"]`);
  await panel.waitFor({ state: "visible" });
  await panel.locator(module.ready).first().waitFor({ state: "visible" });
  await page.waitForTimeout(150);
  assert.equal((await page.locator("#pageTitle").innerText()).trim(), module.title);
  const visibleText = await panel.innerText();
  assert.doesNotMatch(visibleText, /服务不可用|数据加载失败|推广数据加载失败|暂无数据|开发中|计算中|正在加载/);
  assert.match(visibleText, /\d/, `${module.title} should expose populated metrics`);
}

await page.locator('[data-page-target="consumer-insight"]').first().click();
await page.locator(".bundle-summary-card").first().waitFor({ state: "visible" });
const bundleSummary = await page.locator(".bundle-summary-card").allTextContents();
const bundleChart = await page.locator(".bundle-bar-row").allTextContents();
assert.equal(bundleSummary.length, 3);
assert.equal(bundleChart.length, 3);
assert.match(bundleSummary[0], /非套购[\s\S]*71\.90%[\s\S]*371 单[\s\S]*64\.00%/);
assert.match(bundleSummary[1], /同三级类目套购[\s\S]*18\.02%[\s\S]*93 单[\s\S]*22\.00%/);
assert.match(bundleSummary[2], /跨三级类目套购[\s\S]*10\.08%[\s\S]*52 单[\s\S]*14\.00%/);
assert.doesNotMatch(bundleChart.join(" "), /0\.00%\s*0 单/);

await page.locator('[data-page-target="order-income"]').first().click();
const moneyValues = await page.locator('[data-page="order-income"] .metric-card .metric-value').evaluateAll((nodes) =>
  nodes.slice(0, 3).map((node) => Number(node.textContent.replace(/[^\d.-]/g, ""))),
);
assert.equal(moneyValues.length, 3);
assert.ok(Math.abs((moneyValues[0] - moneyValues[1]) - moneyValues[2]) < 0.02, "成交金额 - 退款金额 should equal 净收入金额");

await page.screenshot({ path: "preview-dashboard-public-qa.png", fullPage: true });
assert.deepEqual(failedResponses, [], `failed responses: ${failedResponses.join(" | ")}`);
assert.deepEqual(consoleErrors, [], `console errors: ${consoleErrors.join(" | ")}; failed responses: ${failedResponses.join(" | ")}`);

await browser.close();
console.log("dashboard browser modules and AI demo data checks passed");
