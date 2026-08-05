import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const dashboardJson = await readFile(new URL("./assets/operations-dashboard/dashboard-demo.json", import.meta.url), "utf8");
const bundle = JSON.parse(dashboardJson);
assert.equal(bundle.meta.source_snapshot_at, "AI_GENERATED_DEMO");
assert.ok(bundle.data.salesDaily.length > 200);
assert.ok(bundle.data.repurchaseDaily.length > 100);
assert.doesNotMatch(dashboardJson, /嫚熙|EMXEE|Emexx|美赞臣|穗宝|汤臣倍健|艾诗/i);

for (const row of bundle.data.salesDaily) {
  assert.ok(Math.abs((row.orderAmount - row.refundAmount) - row.netAmount) < 0.02);
}
for (const profile of Object.values(bundle.data.rfmProfiles)) {
  assert.equal(
    profile.segments.reduce((total, segment) => total + segment.customerCount, 0),
    profile.identifiableUserCount,
  );
}

const promotionSource = await readFile(new URL("./assets/operations-dashboard/jd_promotion_demo.js", import.meta.url), "utf8");
const context = {
  URL,
  Response,
  console,
  window: {
    location: { href: "http://demo.local/assets/operations-dashboard/index.html" },
    fetch: async () => { throw new Error("Unexpected non-demo request"); },
  },
};
vm.createContext(context);
vm.runInContext(promotionSource, context);

async function demoJson(path) {
  const response = await context.window.fetch(`http://demo.local${path}`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.success, true);
  assert.equal(payload.meta.source, "AI_GENERATED_DEMO");
  return payload.data;
}

const query = "start_date=2026-07-01&end_date=2026-07-31";
const promotion = await demoJson(`/demo-api/promotion/summary?${query}`);
assert.ok(Math.abs((promotion.order_amount - promotion.refund_amount) - promotion.net_amount) < 0.02);
assert.ok(Math.abs(
  promotion.net_amount
    - promotion.direct_net_amount
    - promotion.indirect_net_amount
    - promotion.unmapped_net_amount,
) < 0.02);
assert.ok(Math.abs(promotion.net_roi - promotion.net_amount / promotion.spend_amount) < 0.000001);

const conversion = await demoJson(`/demo-api/dashboard-data/customer-conversion?${query}`);
assert.ok(conversion.eligibleUserCount > conversion.convertedUserCount);
assert.ok(Math.abs(conversion.conversionRate - conversion.convertedUserCount / conversion.eligibleUserCount) < 0.001);

const distribution = await demoJson(`/demo-api/dashboard-data/bundle-distribution?${query}`);
assert.ok(distribution.bundleDaily.length > 0);
for (const row of distribution.bundleDaily) {
  const bucketOrderTotal = row.buckets.reduce((total, bucket) => total + bucket.orderCount, 0);
  const bucketAmountTotal = row.buckets.reduce((total, bucket) => total + bucket.amount, 0);
  const bundleTypeOrderTotal = row.categoryBundleTypes.reduce((total, bucket) => total + bucket.orderCount, 0);
  const bundleTypeAmountTotal = row.categoryBundleTypes.reduce((total, bucket) => total + bucket.amount, 0);
  const single = row.categoryBundleTypes.find((bucket) => bucket.key === "singleProduct");
  const same = row.categoryBundleTypes.find((bucket) => bucket.key === "sameCategory3");
  const cross = row.categoryBundleTypes.find((bucket) => bucket.key === "crossCategory3");

  assert.equal(bucketOrderTotal, row.totalOrderCount);
  assert.ok(Math.abs(bucketAmountTotal - row.totalAmount) < 0.02);
  assert.equal(bundleTypeOrderTotal, row.totalOrderCount);
  assert.ok(Math.abs(bundleTypeAmountTotal - row.totalAmount) < 0.02);
  assert.equal(same.orderCount + cross.orderCount, row.multiItemOrderCount);
  assert.ok(Math.abs((same.amount + cross.amount) - row.multiItemAmount) < 0.02);
  assert.equal(single.orderCount + row.multiItemOrderCount, row.totalOrderCount);
  assert.ok(Math.abs((single.amount + row.multiItemAmount) - row.totalAmount) < 0.02);
  assert.ok(same.orderCount > 0);
  assert.ok(cross.orderCount > 0);
}

const products = await demoJson(`/demo-api/products/ranking?${query}&limit=24`);
assert.equal(products.pagination.total, 24);
for (const product of products.items) {
  assert.match(product.spu_id, /^DEMO-SPU-/);
  assert.ok(Math.abs(product.net_amount - product.new_customer_amount - product.old_customer_amount) < 0.02);
}

const aftersaleSource = await readFile(new URL("./assets/operations-dashboard/jd_aftersale_dashboard.js", import.meta.url), "utf8");
assert.match(aftersaleSource, /const AFTERSALE_DEMO =/);
for (let index = 1; index <= 10; index += 1) {
  assert.match(aftersaleSource, new RegExp(`QD-${String(index).padStart(3, "0")}`));
}
assert.doesNotMatch(aftersaleSource, /嫚熙|EMXEE|Emexx|美赞臣|穗宝|汤臣倍健|艾诗/i);

console.log("dashboard AI demo data checks passed");
