import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\顶顶顶顶\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");
const baseUrl = process.env.PERSONAL_PAGE_URL || "http://127.0.0.1:4178/index.html";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(5000);
await page.emulateMedia({ reducedMotion: "reduce" });
const errors = [];
const failedResponses = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

await page.goto(baseUrl, { waitUntil: "networkidle" });
assert.equal(
  await page.locator(".dashboard-proof-frame img").getAttribute("src"),
  "rfm-original-desensitized-v2.png",
  "hero proof must use the fixed real desensitized RFM screenshot"
);

const manxiTrigger = page.locator('[data-case="manxi"]').first();
await manxiTrigger.click();
assert.ok(await page.locator("#caseDialog").evaluate((dialog) => dialog.open), "case dialog should open");
assert.match(await page.locator("#caseTitle").textContent(), /嫚熙/);
assert.ok(await page.locator("#caseFeatured").isVisible(), "Manxi case should use the featured layout");
assert.equal(await page.locator(".case-kpi").count(), 4, "featured case should lead with four KPI cards");
assert.match(await page.locator("#caseFeatured").textContent(), /占比更高，增长更快/);
assert.doesNotMatch(await page.locator("#caseFeatured").textContent(), /22\.8%/);
assert.match(await page.locator("#caseFeatured").textContent(), /商智行业单品前 5/);
assert.match(await page.locator("#caseFeatured").textContent(), /成长与感悟/);
assert.doesNotMatch(await page.locator("#caseFeatured").textContent(), /复盘边界/);
await page.locator("#caseDialog").screenshot({ path: "preview-interaction-case-dialog.png" });
await page.locator(".case-story-section").nth(1).screenshot({ path: "preview-case-evidence.png" });
await page.locator(".case-story-section").nth(3).screenshot({ path: "preview-case-action.png" });
await page.locator(".case-story-section").nth(4).screenshot({ path: "preview-case-result.png" });
await page.locator(".case-story-section").nth(5).screenshot({ path: "preview-case-learning.png" });
await page.locator("#closeCaseDialog").click();
assert.ok(!(await page.locator("#caseDialog").evaluate((dialog) => dialog.open)), "case dialog should close");

await page.locator('[data-case="ashley-internship"]').first().click();
assert.match(await page.locator("#caseTitle").textContent(), /艾诗/);
assert.equal(await page.locator("#caseDialog").getAttribute("data-case"), "ashley-internship");
assert.match(await page.locator("#caseFeatured").textContent(), /199 - 100/);
assert.match(await page.locator("#caseFeatured").textContent(), /全店客单价/);
assert.match(await page.locator("#caseFeatured").textContent(), /ROI 保持 5\+/);
await page.locator("#caseDialog").screenshot({ path: "preview-ashley-case-dialog.png" });
await page.locator(".case-story-section").nth(1).screenshot({ path: "preview-ashley-mechanism.png" });
await page.locator(".case-story-section").nth(3).screenshot({ path: "preview-ashley-ad-logic.png" });
await page.locator(".case-story-section").nth(5).screenshot({ path: "preview-ashley-learning.png" });
await page.locator("#closeCaseDialog").click();

const remainingExperienceCases = [
  { key: "by-health", title: /汤臣倍健/, proof: /均完成确认并按表执行/, sections: 6, file: "preview-by-health-case-dialog.png" },
  { key: "mead-johnson", title: /美赞臣/, proof: /约 40% → 70%/, sections: 8, file: "preview-mead-johnson-case-dialog.png" },
  { key: "suibao", title: /穗宝/, proof: /约 9 个月/, sections: 7, file: "preview-suibao-case-dialog.png" }
];

for (const experienceCase of remainingExperienceCases) {
  await page.locator(`[data-case="${experienceCase.key}"]`).first().click();
  assert.equal(await page.locator("#caseDialog").getAttribute("data-case"), experienceCase.key);
  assert.match(await page.locator("#caseTitle").textContent(), experienceCase.title);
  assert.ok(await page.locator("#caseFeatured").isVisible(), `${experienceCase.key} should use the featured layout`);
  assert.equal(await page.locator(".case-kpi").count(), 4, `${experienceCase.key} should lead with four summary cards`);
  assert.equal(await page.locator(".case-story-section").count(), experienceCase.sections, `${experienceCase.key} should contain its planned story sections`);
  assert.match(await page.locator("#caseFeatured").textContent(), experienceCase.proof);
  await page.locator("#caseDialog").screenshot({ path: experienceCase.file });
  if (experienceCase.key === "mead-johnson") {
    const meadText = await page.locator("#caseFeatured").textContent();
    assert.match(meadText, /小罐订单人数同比增长 100%\+/);
    assert.match(meadText, /约 20%逐步提升至约 40%/);
    assert.match(meadText, /复购 3 罐大罐赠玩具/);
    assert.match(meadText, /整体月末库存周转天数持续控制在60天以内/);
    assert.match(meadText, /周转天数 180 天 → 安全库存/);
    await page.locator("#caseFeatured .case-story-section").nth(1).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-mead-johnson-opportunity.png" });
    await page.locator("#caseFeatured .case-story-section").nth(3).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-mead-johnson-mechanism.png" });
    await page.locator("#caseFeatured .case-story-section").nth(6).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-mead-johnson-result.png" });
  }
  if (experienceCase.key === "suibao") {
    assert.match(await page.locator("#caseFeatured").textContent(), /自然流量与行业排名持续提升/);
    await page.locator("#caseFeatured .case-story-section").nth(2).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-suibao-user-insight.png" });
    await page.locator("#caseFeatured .case-story-section").nth(4).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-suibao-product-path.png" });
    await page.locator("#caseFeatured .case-product-stage").nth(1).evaluate((stage) => stage.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-suibao-sellpoint-test.png" });
  }
  await page.locator("#closeCaseDialog").click();
}

await page.locator("#openDataDashboard").click();
assert.ok(await page.locator("#dataDashboardDialog").evaluate((dialog) => dialog.open), "data dashboard dialog should open");
const dashboardFrameSrc = await page.locator("#operationsDashboardFrame").getAttribute("src");
assert.match(dashboardFrameSrc || "", /assets\/operations-dashboard\/index\.html$/, "dashboard should load the developed system");
await page.keyboard.press("Escape");
assert.ok(!(await page.locator("#dataDashboardDialog").evaluate((dialog) => dialog.open)), "Escape should close the data dashboard");
await page.locator("#openDataDashboard").click();
await page.locator("#closeDataDashboard").click();
assert.ok(!(await page.locator("#dataDashboardDialog").evaluate((dialog) => dialog.open)), "data dashboard dialog should close");
assert.equal(await page.evaluate(() => document.activeElement?.id), "openDataDashboard", "focus should return to the dashboard trigger");

await page.locator("#campaignGoal").selectOption("new-product");
await page.locator('[data-role="design"]').click();
assert.equal(await page.locator('[data-role="design"]').getAttribute("aria-pressed"), "true");
assert.match(await page.locator("#campaignTasks").textContent(), /设计|素材|视觉/);

const initialProgress = await page.locator("#campaignProgress").textContent();
const initialInsight = await page.locator("#campaignInsight").textContent();
await page.locator("#advanceCampaign").click();
assert.notEqual(await page.locator("#campaignProgress").textContent(), initialProgress);
assert.notEqual(await page.locator("#campaignInsight").textContent(), initialInsight);

await page.locator("#blockCampaign").click();
assert.match(await page.locator("#campaignTasks").textContent(), /阻塞/);
await page.locator("#building").screenshot({ path: "preview-interaction-campaign-block.png" });

await page.locator("#resetCampaign").click();
assert.match(await page.locator("#campaignProgress").textContent(), /0%/);

assert.equal(await page.locator(".note-entry").count(), 12, "the notes library should initially show twelve cards");
await page.locator('[data-note-experience="suibao"]').click();
assert.equal(await page.locator(".note-entry").count(), 12, "Suibao should expose twelve verified notes");
assert.match(await page.locator("#noteLibrary").textContent(), /品牌过去的传播/);
await page.locator(".note-entry").first().click();
assert.ok(await page.locator("#noteDialog").evaluate((dialog) => dialog.open), "operating note dialog should open");
assert.match(await page.locator("#noteDialogBrand").textContent(), /穗宝/);
assert.match(await page.locator("#noteDialogEvidence").textContent(), /店铺无人专职运营/);
assert.equal(await page.locator("#noteDialogMethod li").count(), 3, "each note should show a reusable three-step method");
assert.match(await page.locator("#noteDialogMap").textContent(), /能力地图对应/);
await page.locator("#noteDialog").screenshot({ path: "preview-operating-note-dialog.png" });
await page.locator("#closeNoteDialog").click();
assert.ok(!(await page.locator("#noteDialog").evaluate((dialog) => dialog.open)), "operating note dialog should close");
await page.locator('[data-note-source="observation"]').click();
assert.equal(await page.locator(".note-entry").count(), 12, "industry observations should initially expose twelve notes");
assert.match(await page.locator("#noteLibrary").textContent(), /先发优势抢心智/);
await page.locator(".note-entry").first().click();
assert.match(await page.locator("#noteDialogSource").textContent(), /行业观察/);
assert.match(await page.locator("#noteEvidenceLabel").textContent(), /观点来源与观察边界/);
await page.locator("#closeNoteDialog").click();
await page.locator('[data-note-source="all"]').click();
await page.locator("#noteLoadMore").click();
assert.equal(await page.locator(".note-entry").count(), 24, "the notes library should progressively reveal more cards");
await page.locator("#notes").screenshot({ path: "preview-operating-notes-library.png" });
assert.equal(errors.length, 0, `console errors: ${errors.join(" | ")}; failed responses: ${failedResponses.join(" | ")}`);

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.locator('[data-case="manxi"]').first().click();
const dialogBox = await page.locator("#caseDialog").boundingBox();
assert.ok(dialogBox.width <= 390, "mobile case dialog should fit the viewport");
const featuredDialogLayout = await page.locator("#caseDialog").evaluate((element) => ({
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth
}));
assert.ok(featuredDialogLayout.scrollWidth <= featuredDialogLayout.clientWidth + 1, "mobile featured case should not overflow horizontally");
await page.locator("#caseDialog").screenshot({ path: "preview-mobile-case-dialog.png" });
await page.locator(".case-story-section").nth(1).screenshot({ path: "preview-mobile-case-evidence.png" });
await page.locator(".case-story-section").nth(3).screenshot({ path: "preview-mobile-case-action.png" });
await page.locator("#closeCaseDialog").click();
await page.locator('[data-case="ashley-internship"]').first().click();
const ashleyMobileLayout = await page.locator("#caseDialog").evaluate((element) => ({
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth
}));
assert.ok(ashleyMobileLayout.scrollWidth <= ashleyMobileLayout.clientWidth + 1, "mobile Ashley case should not overflow horizontally");
await page.locator("#caseDialog").screenshot({ path: "preview-mobile-ashley-case.png" });
await page.locator("#closeCaseDialog").click();
for (const experienceCase of remainingExperienceCases) {
  await page.locator(`[data-case="${experienceCase.key}"]`).first().click();
  const mobileCaseLayout = await page.locator("#caseDialog").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  assert.ok(mobileCaseLayout.scrollWidth <= mobileCaseLayout.clientWidth + 1, `mobile ${experienceCase.key} case should not overflow horizontally`);
  if (experienceCase.key === "mead-johnson") {
    await page.locator("#caseDialog").screenshot({ path: "preview-mobile-mead-johnson-case.png" });
    await page.locator("#caseFeatured .case-story-section").nth(6).evaluate((section) => section.scrollIntoView({ block: "start" }));
    await page.locator("#caseDialog").screenshot({ path: "preview-mobile-mead-johnson-inventory.png" });
  }
  await page.locator("#closeCaseDialog").click();
}
await page.locator("#openDataDashboard").click();
const dataDialogBox = await page.locator("#dataDashboardDialog").boundingBox();
assert.ok(dataDialogBox.width <= 390, "mobile data dashboard should fit the viewport");
const dashboardFrame = page.frameLocator("#operationsDashboardFrame");
await dashboardFrame.locator('[data-page-target="promotion-analysis"]').first().click();
assert.ok(await dashboardFrame.locator('[data-page="promotion-analysis"]').isVisible(), "promotion dashboard should open inside the embedded system");
const dataDialogLayout = await page.locator("#dataDashboardDialog").evaluate((element) => ({
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth
}));
assert.ok(dataDialogLayout.scrollWidth <= dataDialogLayout.clientWidth + 1, "mobile data dashboard should not overflow horizontally");
await page.locator("#dataDashboardDialog").screenshot({ path: "preview-mobile-data-dashboard.png" });
await page.locator("#closeDataDashboard").click();
await page.locator('[data-note-experience="mead-johnson"]').click();
assert.equal(await page.locator(".note-entry").count(), 12, "Mead Johnson should expose twelve notes on mobile");
await page.locator(".note-entry").first().click();
const noteDialogLayout = await page.locator("#noteDialog").evaluate((element) => ({
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth
}));
assert.ok(noteDialogLayout.scrollWidth <= noteDialogLayout.clientWidth + 1, "mobile operating note should not overflow horizontally");
await page.locator("#noteDialog").screenshot({ path: "preview-mobile-operating-note.png" });
await page.locator("#closeNoteDialog").click();
await page.locator('[data-role="design"]').click();
await page.locator("#blockCampaign").click();
const mobileLayout = await page.evaluate(() => ({
  viewportWidth: document.documentElement.clientWidth,
  documentWidth: document.documentElement.scrollWidth
}));
assert.ok(mobileLayout.documentWidth <= mobileLayout.viewportWidth + 1, "mobile interactions should not create horizontal overflow");
assert.equal(errors.length, 0, `console errors after mobile interactions: ${errors.join(" | ")}`);
await page.locator("#building").screenshot({ path: "preview-mobile-interaction.png" });

await browser.close();
console.log("interactive project explorer, data dashboard, and campaign demo checks passed");
