import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectDir = dirname(fileURLToPath(import.meta.url));
const python = process.env.PYTHON_EXE
  || "C:\\Users\\顶顶顶顶\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const port = 4180;
const server = spawn(python, ["lan_server.py", "--host", "127.0.0.1", "--port", String(port)], {
  cwd: projectDir,
  stdio: ["ignore", "pipe", "pipe"]
});

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("LAN preview server did not become ready");
}

try {
  await waitForServer();

  const home = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-type") || "", /text\/html/);
  assert.match(await home.text(), /杜华钊｜电商运营职业实践档案/);
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");

  const explicitPage = await fetch(`http://127.0.0.1:${port}/index.html`);
  assert.equal(explicitPage.status, 200);

  const dashboardPreview = await fetch(`http://127.0.0.1:${port}/rfm-original-desensitized-v2.png`);
  assert.equal(dashboardPreview.status, 200);
  assert.equal(dashboardPreview.headers.get("content-type"), "image/png");
  assert.ok((await dashboardPreview.arrayBuffer()).byteLength > 1000);

  const operatingNotes = await fetch(`http://127.0.0.1:${port}/assets/operating-notes.js`);
  assert.equal(operatingNotes.status, 200);
  assert.match(operatingNotes.headers.get("content-type") || "", /javascript/);
  assert.match(await operatingNotes.text(), /window\.OPERATING_NOTES/);

  const industryNotes = await fetch(`http://127.0.0.1:${port}/assets/industry-notes.js`);
  assert.equal(industryNotes.status, 200);
  assert.match(industryNotes.headers.get("content-type") || "", /javascript/);
  assert.match(await industryNotes.text(), /sourceGroup: "observation"/);

  const noteMethodology = await fetch(`http://127.0.0.1:${port}/assets/note-methodology.js`);
  assert.equal(noteMethodology.status, 200);
  assert.match(noteMethodology.headers.get("content-type") || "", /javascript/);
  assert.match(await noteMethodology.text(), /window\.NOTE_METHOD_SERIES/);

  const profilePhoto = await fetch(`http://127.0.0.1:${port}/assets/du-huazhao-profile-2026.png`);
  assert.equal(profilePhoto.status, 200);
  assert.equal(profilePhoto.headers.get("content-type"), "image/png");
  assert.ok((await profilePhoto.arrayBuffer()).byteLength > 1000);

  const brandAssets = [
    ["/assets/brand-logos/by-health.png", /image\/png/],
    ["/assets/brand-logos/mead-johnson.png", /image\/png/],
    ["/assets/brand-logos/suibao-icon.png", /image\/png/],
    ["/assets/brand-logos/enchanteur.svg", /image\/svg\+xml/],
  ];
  for (const [assetPath, contentType] of brandAssets) {
    const logo = await fetch(`http://127.0.0.1:${port}${assetPath}`);
    assert.equal(logo.status, 200, `${assetPath} must be publicly available`);
    assert.match(logo.headers.get("content-type") || "", contentType);
    assert.ok((await logo.arrayBuffer()).byteLength > 500, `${assetPath} must contain image data`);
  }

  const operationsDashboard = await fetch(`http://127.0.0.1:${port}/assets/operations-dashboard/index.html`);
  assert.equal(operationsDashboard.status, 200);
  assert.match(operationsDashboard.headers.get("content-type") || "", /text\/html/);
  const operationsDashboardHtml = await operationsDashboard.text();
  assert.match(operationsDashboardHtml, /京东\s*POP\s*业务经营驾驶舱/);
  assert.match(operationsDashboardHtml, /数据由 AI 生成 · 仅用于演示 · 非真实经营数据/);

  const operationsDashboardApi = await fetch(`http://127.0.0.1:${port}/assets/operations-dashboard/jd_dashboard_api.js`);
  assert.equal(operationsDashboardApi.status, 200);
  assert.match(operationsDashboardApi.headers.get("content-type") || "", /javascript/);
  const operationsDashboardApiText = await operationsDashboardApi.text();
  assert.match(operationsDashboardApiText, /dashboard-demo\.json/);
  assert.doesNotMatch(operationsDashboardApiText, /window\.location\.hostname}:8765/);

  const promotionDemo = await fetch(`http://127.0.0.1:${port}/assets/operations-dashboard/jd_promotion_demo.js`);
  assert.equal(promotionDemo.status, 200);
  assert.match(promotionDemo.headers.get("content-type") || "", /javascript/);
  const promotionDemoText = await promotionDemo.text();
  assert.match(promotionDemoText, /京准通快车/);
  assert.match(promotionDemoText, /全站营销/);
  assert.match(promotionDemoText, /net_roi_excluding_cps/);
  assert.match(promotionDemoText, /AI_GENERATED_DEMO/);
  assert.match(promotionDemoText, /dashboard-data\/customer-conversion/);
  assert.match(promotionDemoText, /dashboard-data\/bundle-distribution/);
  assert.match(promotionDemoText, /products\/ranking/);

  const aftersaleDemo = await fetch(`http://127.0.0.1:${port}/assets/operations-dashboard/jd_aftersale_dashboard.js`);
  assert.equal(aftersaleDemo.status, 200);
  assert.match(aftersaleDemo.headers.get("content-type") || "", /javascript/);
  const aftersaleDemoText = await aftersaleDemo.text();
  assert.match(aftersaleDemoText, /AFTERSALE_DEMO/);
  for (let queryIndex = 1; queryIndex <= 10; queryIndex += 1) {
    assert.match(aftersaleDemoText, new RegExp(`QD-${String(queryIndex).padStart(3, "0")}`));
  }

  const operationsDashboardData = await fetch(`http://127.0.0.1:${port}/assets/operations-dashboard/dashboard-demo.json`);
  assert.equal(operationsDashboardData.status, 200);
  assert.match(operationsDashboardData.headers.get("content-type") || "", /application\/json/);
  const operationsDashboardDataText = await operationsDashboardData.text();
  assert.match(operationsDashboardDataText, /ai-demo-2026-08/);
  assert.match(operationsDashboardDataText, /repurchaseDaily/);
  assert.doesNotMatch(operationsDashboardDataText, /嫚熙|EMXEE|Emexx/i);

  const privateFile = await fetch(`http://127.0.0.1:${port}/test-page.mjs`);
  assert.equal(privateFile.status, 404, "test files must not be exposed on the LAN");

  const post = await fetch(`http://127.0.0.1:${port}/`, { method: "POST" });
  assert.equal(post.status, 405, "the preview server must be read-only");

  console.log("LAN preview server checks passed");
} finally {
  server.kill();
}
