(() => {
  const data = {};
  const loaded = new Set();
  const loading = {};
  const CACHE_TTL = 30 * 60 * 1000;
  const COMMERCE_API = "./demo-api";
  const DASHBOARD_API_ROUTE = "dashboard-data";
  const COMMERCE_STATIC_DASHBOARD = "./dashboard-demo.json?v=20260805-bundle-fix";
  const commerceState = { source: "dynamic", batch: "ai-demo-2026-08", snapshotAt: "AI_GENERATED_DEMO", degraded: false };
  let bundlePromise = null;

  function adaptCustomerRows(rows) {
    const grouped = new Map();
    (rows || []).forEach((row) => {
      const key = `${row.date}|${row.businessType}`;
      const item = grouped.get(key) || { date: row.date, businessType: row.businessType, newUserAmount: 0, oldUserAmount: 0, unidentifiedUserAmount: 0, totalAmount: 0, newUserCount: 0, oldUserCount: 0, totalUserCount: 0, newUserOrderCount: 0, oldUserOrderCount: 0, totalOrderCount: 0, newUserItemQuantity: 0, oldUserItemQuantity: 0, totalItemQuantity: 0, newUserCategory3Count: 0, oldUserCategory3Count: 0, totalCategory3Count: 0 };
      const prefix = row.segment === "new" ? "newUser" : row.segment === "old" ? "oldUser" : "unidentifiedUser";
      const amount = Number(row.netAmount || 0);
      item[`${prefix}Amount`] += amount; item.totalAmount += amount;
      item.totalOrderCount += Number(row.orderCount || 0); item.totalItemQuantity += Number(row.itemQuantity || 0);
      if (row.segment !== "unknown") {
        item[`${prefix}Count`] += Number(row.userCount || 0); item.totalUserCount += Number(row.userCount || 0);
        item[`${prefix}OrderCount`] += Number(row.orderCount || 0); item[`${prefix}ItemQuantity`] += Number(row.itemQuantity || 0);
        item[`${prefix}Category3Count`] += Number(row.category3Count || 0); item.totalCategory3Count += Number(row.category3Count || 0);
      }
      grouped.set(key, item);
    });
    return [...grouped.values()].sort((left, right) => `${left.date}|${left.businessType}`.localeCompare(`${right.date}|${right.businessType}`));
  }

  const CATEGORY_LEVEL_DEFS = [
    { key: "categoryL1", label: "一级类目" },
    { key: "categoryL2", label: "二级类目" },
    { key: "categoryL3", label: "三级类目" },
    { key: "leafCategory", label: "末级类目" },
  ];

  function buildCategoryLevels(rows) {
    return CATEGORY_LEVEL_DEFS.map((level) => ({
      ...level,
      values: [...new Set((rows || []).map((row) => row[level.key] || "未匹配"))].sort(),
    })).filter((level) => level.values.length);
  }

  function adaptDashboardBundle(payload) {
    const source = payload.data || payload || {};
    const rawSegments = source.customerSegments || { all: source.customerDaily || [] };
    const customerSegments = Object.fromEntries(Object.entries(rawSegments).map(([key, rows]) => [key, { key, daily: adaptCustomerRows(rows) }]));
    const daily = source.salesDaily || [];
    const categoryDaily = source.categoryDaily || [];
    return {
      daily: source.sameDayDaily || daily, attributedDaily: daily, categoryDaily, attributedCategoryDaily: categoryDaily,
      customerDaily: customerSegments.all?.daily || adaptCustomerRows(source.customerDaily || []), customerSegments,
      customerCategoryDaily: source.customerCategoryDaily || [], bundleDaily: source.bundleDaily || [],
      categoryLevels: source.categoryLevels || buildCategoryLevels(categoryDaily),
      rfmProfiles: source.rfmProfiles || {},
      bundleBuckets: source.bundleBuckets || [
        { key: "product1", label: "1种商品" }, { key: "product2", label: "2种商品" }, { key: "product3", label: "3种商品" }, { key: "product4", label: "4种商品" }, { key: "product5Plus", label: "5种及以上" },
      ],
      repurchaseDaily: source.repurchaseDaily || [], repurchaseSummary: source.repurchaseSummary || {},
      customerOldWindowDefault: "all", customerOldWindowOptions: [
        { key: "180", label: "180天老客", days: 180 }, { key: "365", label: "365天老客", days: 365 }, { key: "all", label: "不限周期老客", days: null },
      ],
      businessTypes: [...new Set(daily.map((row) => row.businessType))].sort(),
      commerce_publish_batch_id: source.commerce_publish_batch_id || payload.meta?.commerce_publish_batch_id || null,
    };
  }

  function adaptCommerceDashboardData(name, results) {
    const payloads = results.map((item) => item.data || {});
    const sales = payloads.find((item) => item.salesDaily)?.salesDaily;
    const customers = payloads.find((item) => item.customerDaily)?.customerDaily;
    const categories = payloads.find((item) => item.categoryDaily)?.categoryDaily;
    const customerCategories = payloads.find((item) => item.customerCategoryDaily)?.customerCategoryDaily;
    const bundles = payloads.find((item) => item.bundleDaily)?.bundleDaily;
    const chunk = {};
    if (sales) chunk.daily = sales;
    if (categories) chunk.categoryDaily = categories;
    if (customerCategories) chunk.customerCategoryDaily = customerCategories;
    if (bundles) chunk.bundleDaily = bundles;
    if (customers) {
      const grouped = new Map();
      customers.forEach((row) => {
        const key = `${row.date}|${row.businessType}`;
        const target = grouped.get(key) || { date: row.date, businessType: row.businessType, newUserAmount: 0, oldUserAmount: 0, unidentifiedUserAmount: 0, totalAmount: 0, newUserCount: 0, oldUserCount: 0, totalUserCount: 0, newUserOrderCount: 0, oldUserOrderCount: 0, totalOrderCount: 0, newUserItemQuantity: 0, oldUserItemQuantity: 0, totalItemQuantity: 0 };
        const prefix = row.segment === "new" ? "newUser" : row.segment === "old" ? "oldUser" : "unidentifiedUser";
        target[`${prefix}Amount`] = Number(row.netAmount || 0); target.totalAmount += Number(row.netAmount || 0);
        if (row.segment !== "unknown") { target[`${prefix}Count`] = Number(row.userCount || 0); target.totalUserCount += Number(row.userCount || 0); }
        if (row.segment !== "unknown") target[`${prefix}OrderCount`] = Number(row.orderCount || 0);
        target.totalOrderCount += Number(row.orderCount || 0); if (row.segment !== "unknown") target[`${prefix}ItemQuantity`] = Number(row.itemQuantity || 0); target.totalItemQuantity += Number(row.itemQuantity || 0);
        grouped.set(key, target);
      });
      chunk.customerDaily = [...grouped.values()];
    }
    return chunk;
  }

  async function fetchCommerceRoutes(name) {
    const routes = commerceRoutes[name] || [];
    if (!routes.length || !canUseFetch()) return null;
    const results = await Promise.all(routes.map(async (route) => {
      const response = await fetch(`${COMMERCE_API}/${route}`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Commerce API ${route} failed: ${response.status}`);
      return response.json();
    }));
    const batches = new Set(results.map((item) => item.meta?.commerce_publish_batch_id).filter(Boolean));
    if (batches.size > 1) throw new Error("Commerce API publish batch mismatch");
    const meta = results.map((item) => item.meta || {}).find((item) => item.commerce_publish_batch_id) || {};
    commerceState.source = "dynamic"; commerceState.batch = meta.commerce_publish_batch_id || null;
    commerceState.snapshotAt = meta.source_snapshot_at || null; commerceState.degraded = false;
    return results;
  }

  async function fetchCommerceStaticDashboard(name) {
    if (!canUseFetch() || !["overview", "trend", "store_user", "consumer"].includes(name)) return null;
    const response = await fetch(COMMERCE_STATIC_DASHBOARD, { cache: "no-cache" });
    if (!response.ok) return null;
    const payload = await response.json();
    commerceState.source = "dynamic"; commerceState.batch = payload.commerce_publish_batch_id || null;
    commerceState.snapshotAt = null; commerceState.degraded = false;
    return adaptCommerceDashboardData(name, [{ data: payload }]);
  }

  function mergeChunk(name, chunk) {
    if (!chunk) {
      return data;
    }
    Object.assign(data, chunk);
    loaded.add(name);
    document.dispatchEvent(new CustomEvent("dashboard:data-loaded", { detail: { name } }));
    return data;
  }

  function canUseFetch() {
    return location.protocol === "http:" || location.protocol === "https:";
  }

  function readCache(name) {
    try {
      const raw = localStorage.getItem(`jd-dashboard:${name}`);
      if (!raw) {
        return null;
      }
      const cached = JSON.parse(raw);
      if (!cached || Date.now() - cached.time > CACHE_TTL) {
        localStorage.removeItem(`jd-dashboard:${name}`);
        return null;
      }
      return cached.data;
    } catch {
      return null;
    }
  }

  function writeCache(name, payload) {
    if (!["overview", "trend"].includes(name)) {
      return;
    }
    try {
      localStorage.setItem(`jd-dashboard:${name}`, JSON.stringify({ time: Date.now(), data: payload }));
    } catch {
      // Large analytical chunks intentionally skip localStorage.
    }
  }

  async function fetchChunk(name) {
    const cached = readCache(name);
    if (cached) {
      return cached;
    }
    try {
      const dynamic = await fetchCommerceRoutes(name);
      if (dynamic) {
        const chunk = adaptCommerceDashboardData(name, dynamic);
        if (Object.keys(chunk).length) return chunk;
        document.dispatchEvent(new CustomEvent("dashboard:commerce-api-loaded", { detail: { name, source: commerceState.source, batch: commerceState.batch, results: dynamic } }));
      }
    } catch {
      commerceState.source = "dynamic"; commerceState.degraded = false;
    }
    const commerceStatic = await fetchCommerceStaticDashboard(name);
    if (commerceStatic && Object.keys(commerceStatic).length) return commerceStatic;
    const response = await fetch(`${BASE_PATH}/${name}.json`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Data chunk ${name} failed: ${response.status}`);
    }
    const payload = await response.json();
    const chunk = payload.data || payload;
    writeCache(name, chunk);
    return chunk;
  }

  function loadScriptChunk(name) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${BASE_PATH}/${name}.js`;
      script.async = true;
      script.onload = () => resolve(chunkStore[name] || {});
      script.onerror = () => reject(new Error(`Data script ${name} failed`));
      document.head.appendChild(script);
    });
  }

  async function loadChunk(name) {
    return loadDashboardBundle();
  }

  async function loadDashboardBundle() {
    if (bundlePromise) return bundlePromise;
    bundlePromise = (async () => {
      const response = await fetch(COMMERCE_STATIC_DASHBOARD, { cache: "no-cache" });
      if (!response.ok) throw new Error("No dashboard data source is available");
      const payload = await response.json();
      commerceState.source = "dynamic"; commerceState.batch = payload.meta?.commerce_publish_batch_id || "AI-DEMO";
      commerceState.snapshotAt = payload.meta?.source_snapshot_at || "AI_GENERATED_DEMO"; commerceState.degraded = false;
      Object.assign(data, adaptDashboardBundle(payload));
      loaded.add("dashboard");
      document.dispatchEvent(new CustomEvent("dashboard:data-loaded", { detail: { name: "dashboard" } }));
      return data;
    })();
    return bundlePromise;
  }

  async function fetchCustomerConversion(filters) {
    if (!canUseFetch()) throw new Error("Local data service is unavailable");
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, values]) => {
      (Array.isArray(values) ? values : [values]).filter((value) => value !== undefined && value !== null && value !== "").forEach((value) => params.append(key, value));
    });
    const response = await fetch(`${COMMERCE_API}/${DASHBOARD_API_ROUTE}/customer-conversion?${params.toString()}`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Customer conversion failed: ${response.status}`);
    const payload = await response.json();
    if (!payload.success) throw new Error("Customer conversion did not return success");
    return payload.data || {};
  }

  async function fetchBundleDistribution(filters) {
    if (!canUseFetch()) throw new Error("Local data service is unavailable");
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, values]) => {
      (Array.isArray(values) ? values : [values]).filter((value) => value !== undefined && value !== null && value !== "").forEach((value) => params.append(key, value));
    });
    const response = await fetch(`${COMMERCE_API}/${DASHBOARD_API_ROUTE}/bundle-distribution?${params.toString()}`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Bundle distribution failed: ${response.status}`);
    const payload = await response.json();
    if (!payload.success) throw new Error("Bundle distribution did not return success");
    return payload.data?.bundleDaily || [];
  }

  async function fetchRfmProfile(windowDays) {
    return data.rfmProfiles?.[String(windowDays)] || data.rfmProfiles?.["180"] || { windowDays: String(windowDays), segments: [] };
  }

  async function fetchRfmDetail(windowDays, segment) {
    return {
      segment,
      topCategories: [
        { label: "核心类目", orderCount: 428 },
        { label: "增长类目", orderCount: 276 },
        { label: "利润类目", orderCount: 154 }
      ],
      aftersaleServiceCount: 36,
      aftersaleServicePerCustomer: 0.02
    };
  }

  async function ensureChunks(names) {
    for (const name of names) {
      await loadChunk(name);
    }
    return data;
  }

  window.JD_DASHBOARD_API = {
    getInitialData: () => data,
    getCommerceApiBase: () => COMMERCE_API,
    loadDashboardBundle,
    loadChunk,
    ensureChunks,
    fetchCustomerConversion,
    fetchBundleDistribution,
    fetchRfmProfile,
    fetchRfmDetail,
    isLoaded: (name) => loaded.has(name),
    getCommerceState: () => ({ ...commerceState }),
  };
})();
