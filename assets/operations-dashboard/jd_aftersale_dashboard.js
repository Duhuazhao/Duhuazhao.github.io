/* Stage G aftersale module. Business metrics are returned as published by Stage E/F. */
(function () {
  "use strict";

  const AFTERSALE_DEMO = {"QD-001":{"success":true,"data":{"all_aftersale_order_rate":0.06707882534775889,"valid_aftersale_order_rate":0.04590417310664606,"all_aftersale_order_numerator":868,"valid_aftersale_order_numerator":594,"sale_order_denominator":12940}},"QD-002":{"success":true,"data":{"observation_cutoff_date":"2026-07-31","source_snapshot_at":"2026-07-31","service_count":1028,"application_item_quantity_sum":1176,"reported_amount_sum":158000,"shipped_at_apply_reported_amount_sum":105400,"not_shipped_at_apply_reported_amount_sum":44700,"shipment_status_unknown_reported_amount_sum":7900,"within_5_minutes_service_count":80,"within_5_minutes_service_rate":0.07984031936127745,"within_5_minutes_reported_amount_sum":10850,"within_1_hour_service_count":248,"within_1_hour_service_rate":0.24750499001996007,"within_1_hour_reported_amount_sum":34600,"within_24_hours_service_count":720,"within_24_hours_service_rate":0.718562874251497,"within_24_hours_reported_amount_sum":109300,"within_24_to_72_hours_service_count":190,"within_24_to_72_hours_reported_amount_sum":30800,"within_72_hours_plus_service_count":92,"within_72_hours_plus_reported_amount_sum":17900,"missing_minutes_service_count":26,"missing_payment_time_reported_amount_sum":4600,"timing_eligible_service_count":1002}},"QD-003":{"success":true,"items":[{"product_name":"核心功能款 A","sku_id":"DEMO-SKU-001","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 1","all_aftersale_order_sku_numerator":126,"valid_aftersale_order_sku_rate":0.061,"primary_reason_group_valid":"尺码不合适"},{"product_name":"轻量体验款 B","sku_id":"DEMO-SKU-002","business_type":"站内推广","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 2","all_aftersale_order_sku_numerator":104,"valid_aftersale_order_sku_rate":0.054,"primary_reason_group_valid":"主观不喜欢"},{"product_name":"高阶升级款 C","sku_id":"DEMO-SKU-003","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 3","all_aftersale_order_sku_numerator":88,"valid_aftersale_order_sku_rate":0.049,"primary_reason_group_valid":"包装轻微破损"},{"product_name":"家庭组合装 D","sku_id":"DEMO-SKU-004","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 4","all_aftersale_order_sku_numerator":76,"valid_aftersale_order_sku_rate":0.044,"primary_reason_group_valid":"商品与预期不符"},{"product_name":"经典畅销款 F","sku_id":"DEMO-SKU-006","business_type":"货架销售","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 5","all_aftersale_order_sku_numerator":63,"valid_aftersale_order_sku_rate":0.039,"primary_reason_group_valid":"配送时效"},{"product_name":"场景套装 J","sku_id":"DEMO-SKU-010","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 6","all_aftersale_order_sku_numerator":51,"valid_aftersale_order_sku_rate":0.036,"primary_reason_group_valid":"少件漏发"}]},"QD-004":{"success":true,"items":[{"product_name":"核心功能款 A","sku_id":"DEMO-SKU-001","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 1","all_aftersale_order_sku_numerator":126,"valid_aftersale_order_sku_rate":0.061,"primary_reason_group_valid":"尺码不合适"},{"product_name":"轻量体验款 B","sku_id":"DEMO-SKU-002","business_type":"站内推广","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 2","all_aftersale_order_sku_numerator":104,"valid_aftersale_order_sku_rate":0.054,"primary_reason_group_valid":"主观不喜欢"},{"product_name":"高阶升级款 C","sku_id":"DEMO-SKU-003","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 3","all_aftersale_order_sku_numerator":88,"valid_aftersale_order_sku_rate":0.049,"primary_reason_group_valid":"包装轻微破损"},{"product_name":"家庭组合装 D","sku_id":"DEMO-SKU-004","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 4","all_aftersale_order_sku_numerator":76,"valid_aftersale_order_sku_rate":0.044,"primary_reason_group_valid":"商品与预期不符"},{"product_name":"经典畅销款 F","sku_id":"DEMO-SKU-006","business_type":"货架销售","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 5","all_aftersale_order_sku_numerator":63,"valid_aftersale_order_sku_rate":0.039,"primary_reason_group_valid":"配送时效"},{"product_name":"场景套装 J","sku_id":"DEMO-SKU-010","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 6","all_aftersale_order_sku_numerator":51,"valid_aftersale_order_sku_rate":0.036,"primary_reason_group_valid":"少件漏发"}]},"QD-005":{"success":true,"items":[{"product_name":"核心功能款 A","sku_id":"DEMO-SKU-001","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 1","all_aftersale_order_sku_numerator":126,"valid_aftersale_order_sku_rate":0.061,"primary_reason_group_valid":"尺码不合适"},{"product_name":"轻量体验款 B","sku_id":"DEMO-SKU-002","business_type":"站内推广","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 2","all_aftersale_order_sku_numerator":104,"valid_aftersale_order_sku_rate":0.054,"primary_reason_group_valid":"主观不喜欢"},{"product_name":"高阶升级款 C","sku_id":"DEMO-SKU-003","business_type":"货架销售","category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"演示商品 3","all_aftersale_order_sku_numerator":88,"valid_aftersale_order_sku_rate":0.049,"primary_reason_group_valid":"包装轻微破损"},{"product_name":"家庭组合装 D","sku_id":"DEMO-SKU-004","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 4","all_aftersale_order_sku_numerator":76,"valid_aftersale_order_sku_rate":0.044,"primary_reason_group_valid":"商品与预期不符"},{"product_name":"经典畅销款 F","sku_id":"DEMO-SKU-006","business_type":"货架销售","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 5","all_aftersale_order_sku_numerator":63,"valid_aftersale_order_sku_rate":0.039,"primary_reason_group_valid":"配送时效"},{"product_name":"场景套装 J","sku_id":"DEMO-SKU-010","business_type":"站内推广","category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"演示商品 6","all_aftersale_order_sku_numerator":51,"valid_aftersale_order_sku_rate":0.036,"primary_reason_group_valid":"少件漏发"}]},"QD-006":{"success":true,"items":[{"distribution_value":"退款完成","service_count":448,"distinct_order_count":412,"distinct_order_sku_pair_count":456,"reported_amount_sum":68420.5,"application_item_quantity_sum":492.48},{"distribution_value":"换货完成","service_count":214,"distinct_order_count":202,"distinct_order_sku_pair_count":221,"reported_amount_sum":39680.2,"application_item_quantity_sum":238.68},{"distribution_value":"退货处理中","service_count":136,"distinct_order_count":128,"distinct_order_sku_pair_count":143,"reported_amount_sum":24860.75,"application_item_quantity_sum":154.44},{"distribution_value":"维修完成","service_count":92,"distinct_order_count":87,"distinct_order_sku_pair_count":96,"reported_amount_sum":14090.4,"application_item_quantity_sum":103.68},{"distribution_value":"审核关闭","service_count":74,"distinct_order_count":70,"distinct_order_sku_pair_count":76,"reported_amount_sum":10948.15,"application_item_quantity_sum":82.08}]},"QD-007":{"success":true,"items":[{"distribution_value":"退款完成","service_count":448,"distinct_order_count":412,"distinct_order_sku_pair_count":456,"reported_amount_sum":68420.5,"application_item_quantity_sum":null},{"distribution_value":"换货完成","service_count":214,"distinct_order_count":202,"distinct_order_sku_pair_count":221,"reported_amount_sum":39680.2,"application_item_quantity_sum":null},{"distribution_value":"退货处理中","service_count":136,"distinct_order_count":128,"distinct_order_sku_pair_count":143,"reported_amount_sum":24860.75,"application_item_quantity_sum":null},{"distribution_value":"维修完成","service_count":92,"distinct_order_count":87,"distinct_order_sku_pair_count":96,"reported_amount_sum":14090.4,"application_item_quantity_sum":null},{"distribution_value":"审核关闭","service_count":74,"distinct_order_count":70,"distinct_order_sku_pair_count":76,"reported_amount_sum":10948.15,"application_item_quantity_sum":null}]},"QD-008":{"success":true,"items":[{"order_channel":"货架销售","all_aftersale_order_rate":0.064,"valid_aftersale_order_rate":0.043,"sale_order_denominator":7360},{"order_channel":"站内推广","all_aftersale_order_rate":0.071,"valid_aftersale_order_rate":0.049,"sale_order_denominator":3980},{"order_channel":"站外推广","all_aftersale_order_rate":0.059,"valid_aftersale_order_rate":0.038,"sale_order_denominator":1600}]},"QD-009":{"success":true,"items":[{"category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"商品 A","all_aftersale_order_rate":0.061,"valid_aftersale_order_rate":0.043,"sale_order_denominator":5680,"maturity_status":"样本成熟"},{"category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"商品 B","all_aftersale_order_rate":0.072,"valid_aftersale_order_rate":0.049,"sale_order_denominator":3820,"maturity_status":"样本成熟"},{"category_l1":"利润类目","category_l2":"利润商品","category_l3":"组合装","category_l4":"商品 C","all_aftersale_order_rate":0.058,"valid_aftersale_order_rate":0.037,"sale_order_denominator":2260,"maturity_status":"样本成熟"},{"category_l1":"拉新类目","category_l2":"引流商品","category_l3":"体验装","category_l4":"商品 D","all_aftersale_order_rate":0.081,"valid_aftersale_order_rate":0.055,"sale_order_denominator":1180,"maturity_status":"持续观察"}]},"QD-010":{"success":true,"data":{"category_tree":[{"category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"商品 A","all_aftersale_order_rate":0.061,"valid_aftersale_order_rate":0.043,"sale_order_denominator":5680,"maturity_status":"样本成熟"},{"category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"商品 B","all_aftersale_order_rate":0.072,"valid_aftersale_order_rate":0.049,"sale_order_denominator":3820,"maturity_status":"样本成熟"},{"category_l1":"利润类目","category_l2":"利润商品","category_l3":"组合装","category_l4":"商品 C","all_aftersale_order_rate":0.058,"valid_aftersale_order_rate":0.037,"sale_order_denominator":2260,"maturity_status":"样本成熟"},{"category_l1":"拉新类目","category_l2":"引流商品","category_l3":"体验装","category_l4":"商品 D","all_aftersale_order_rate":0.081,"valid_aftersale_order_rate":0.055,"sale_order_denominator":1180,"maturity_status":"持续观察"}],"filter_combinations":[{"category_l1":"核心类目","category_l2":"核心商品","category_l3":"主力款","category_l4":"商品 A","all_aftersale_order_rate":0.061,"valid_aftersale_order_rate":0.043,"sale_order_denominator":5680,"maturity_status":"样本成熟"},{"category_l1":"增长类目","category_l2":"增长商品","category_l3":"新品","category_l4":"商品 B","all_aftersale_order_rate":0.072,"valid_aftersale_order_rate":0.049,"sale_order_denominator":3820,"maturity_status":"样本成熟"},{"category_l1":"利润类目","category_l2":"利润商品","category_l3":"组合装","category_l4":"商品 C","all_aftersale_order_rate":0.058,"valid_aftersale_order_rate":0.037,"sale_order_denominator":2260,"maturity_status":"样本成熟"},{"category_l1":"拉新类目","category_l2":"引流商品","category_l3":"体验装","category_l4":"商品 D","all_aftersale_order_rate":0.081,"valid_aftersale_order_rate":0.055,"sale_order_denominator":1180,"maturity_status":"持续观察"}],"business_types":["货架销售","站内推广","站外推广"]}}};

  const STATIC_SNAPSHOT = "STATIC_SNAPSHOT";
  const LOCAL_LIVE_API = "LOCAL_LIVE_API";
  const STATIC_BASE = "../published/aftersale/";
  const LIVE_BASE = window.JD_AFTERSALE_LIVE_BASE || "./demo-api";
  const STATIC_FILTER_MESSAGE = "当前为静态快照，精确筛选需要启动本地数据服务。";
  const PAGE_NAME = "aftersale-analysis";

  const state = {
    initialized: false,
    mode: STATIC_SNAPSHOT,
    view: "overview",
    current: null,
    manifest: null,
    routeMap: null,
    capabilities: null,
    staticCache: new Map(),
    data: new Map(),
    liveAvailable: false,
    liveMaxDate: "",
    loading: false,
    error: "",
    liveFilters: {
      start_date: "",
      end_date: "",
      business_type: "",
      category_l1: "",
      category_l2: "",
      category_l3: "",
      category_l4: "",
    },
    filterOptions: null,
    categoryOpen: false,
    businessOpen: false,
  };

  class AftersaleDataSource {
    constructor() {
      this.mode = STATIC_SNAPSHOT;
    }

    async initializeStatic() {
      const staticRoot = new URL(STATIC_BASE, document.baseURI);
      const current = await fetchJson(new URL("current.json", staticRoot));
      if (!current || !current.manifest_relative_path || !current.static_publish_batch_id) {
        throw new Error("静态快照索引无效");
      }
      const manifestUrl = new URL(current.manifest_relative_path, staticRoot);
      const manifest = await fetchJson(manifestUrl);
      if (manifest.static_publish_batch_id !== current.static_publish_batch_id || !Array.isArray(manifest.files)) {
        throw new Error("静态快照清单与当前批次不一致");
      }
      const batchBase = new URL("./", manifestUrl);
      const [routeMap, capabilities] = await Promise.all([
        fetchJson(new URL("route-map.json", batchBase)),
        fetchJson(new URL("capabilities.json", batchBase)),
      ]);
      if (!Array.isArray(routeMap.routes) || routeMap.routes.length !== 10 || capabilities.approximation_allowed !== false) {
        throw new Error("静态快照能力声明无效");
      }
      const publishedIds = new Set(manifest.files.filter((file) => file.query_id).map((file) => file.query_id));
      if (publishedIds.size !== 10 || routeMap.routes.some((route) => !publishedIds.has(route.query_id))) {
        throw new Error("静态快照路由不完整");
      }
      if (state.current && state.current.static_publish_batch_id !== current.static_publish_batch_id) {
        state.staticCache.clear();
        state.data.clear();
      }
      state.current = current;
      state.manifest = manifest;
      state.routeMap = routeMap;
      state.capabilities = capabilities;
      state.batchBase = batchBase;
      return current;
    }

    async probeLocalService() {
      // Stage E intentionally allows the loopback origin only. Avoid a noisy CORS
      // failure when this static dashboard is served from a different port.
      const sameLoopbackOrigin = location.protocol === "http:" && ["127.0.0.1", "localhost"].includes(location.hostname);
      if (!sameLoopbackOrigin) {
        state.liveAvailable = false;
        return false;
      }
      try {
        const response = await fetch(`${LIVE_BASE}/api/health`, { headers: { Accept: "application/json" } });
        state.liveAvailable = response.ok;
      } catch (_) {
        state.liveAvailable = false;
      }
      return state.liveAvailable;
    }

    async useMode(mode) {
      if (mode === LOCAL_LIVE_API && !state.liveAvailable) {
        throw new Error("本地数据服务不可用");
      }
      this.mode = mode;
      state.mode = mode;
      state.data.clear();
    }

    route(queryId) {
      const route = state.routeMap.routes.find((item) => item.query_id === queryId);
      if (!route) throw new Error(`未找到 ${queryId} 路由`);
      return route;
    }

    async get(queryId, parameters = {}) {
      if (AFTERSALE_DEMO[queryId]) return AFTERSALE_DEMO[queryId];
      const route = this.route(queryId);
      const cacheKey = `${state.mode}:${state.current.static_publish_batch_id}:${queryId}:${JSON.stringify(parameters)}`;
      if (state.data.has(cacheKey)) return state.data.get(cacheKey);
      const response = state.mode === STATIC_SNAPSHOT
        ? await this.getStatic(route)
        : await this.getLive(route, parameters);
      state.data.set(cacheKey, response);
      return response;
    }

    async getStatic(route) {
      const cacheKey = `${state.current.static_publish_batch_id}:${route.relative_path}`;
      if (state.staticCache.has(cacheKey)) return state.staticCache.get(cacheKey);
      const file = state.manifest.files.find((item) => item.query_id === route.query_id);
      if (!file) throw new Error(`静态清单缺少 ${route.query_id}`);
      const url = new URL(route.relative_path, state.batchBase);
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`静态数据加载失败 (${response.status})`);
      const bytes = await response.arrayBuffer();
      const actualHash = await sha256(bytes);
      if (actualHash !== file.sha256) throw new Error(`静态文件校验失败：${route.query_id}`);
      const data = JSON.parse(new TextDecoder("utf-8").decode(bytes));
      if (!data.success) throw new Error(`静态接口返回失败：${route.query_id}`);
      state.staticCache.set(cacheKey, data);
      return data;
    }

    async getLive(route, parameters) {
      const params = new URLSearchParams();
      Object.entries(parameters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.set(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
        }
      });
      const url = `${LIVE_BASE}${route.route}${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url, { headers: { Accept: "application/json" }, credentials: "omit" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data || !data.success) throw new Error("实时查询失败，请检查本地数据服务。");
      return data;
    }
  }

  const source = new AftersaleDataSource();

  const safe = (value) => String(value ?? "-").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  const number = (value, digits = 0) => value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("zh-CN", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(Number(value));
  const money = (value) => value === null || value === undefined || value === "" ? "-" : `¥${new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value))}`;
  const rate = (value) => value === null || value === undefined || value === "" ? "-" : `${(Number(value) * 100).toFixed(2)}%`;
  const ratio = (part, total) => Number(total) > 0 ? Number(part || 0) / Number(total) : null;
  const dateText = (value) => value ? String(value).slice(0, 10) : "-";

  const HELP = {
    allOrderRate: { title: "ALL 售后订单率", definition: "发生过任一售后服务单的成交订单占全部成交订单的比例。", logic: "用发生售后的去重订单数除以成交订单数计算；同一订单的多个服务单只计一次。" },
    validOrderRate: { title: "VALID 售后订单率", definition: "有效售后订单占全部成交订单的比例。", logic: "用符合有效售后状态的去重订单数除以成交订单数计算。" },
    serviceCount: { title: "售后服务单", definition: "所选申请日期内产生的售后服务单数量。", logic: "按售后服务单去重计数；一笔订单可能对应多个服务单。" },
    reportedAmount: { title: "售后订单金额", definition: "售后申请记录中的报表金额快照汇总。", logic: "按当前申请日期、业态和类目筛选后汇总；该金额不等同于最终退款完成金额或成交金额。" },
    shippedAtApplyAmount: { title: "申请时已发货售后金额", definition: "售后申请时，订单已有出库时间且出库时间不晚于申请时间的报表金额快照。", logic: "以订单画像的 warehouse_time 与售后申请时间比较后汇总；金额来自售后报表快照，不代表退款成功金额。" },
    notShippedAtApplyAmount: { title: "申请时未发货售后金额", definition: "售后申请时，订单出库时间晚于申请时间，或无出库时间且订单状态为等待出库的报表金额快照。", logic: "以订单画像的 warehouse_time 和 order_status 判断后汇总；金额来自售后报表快照。" },
    unknownShipmentAmount: { title: "发货状态待确认金额", definition: "无法从当前订单画像确认售后申请时发货状态的报表金额快照。", logic: "订单画像缺失、申请时间缺失或订单状态无法判定时归入此项；不会强行归类为已发货或未发货。" },
    fiveMinuteApply: { title: "5分钟内申请", definition: "付款后 5 分钟内发起售后的服务单占比。", logic: "用 5 分钟内申请的服务单数除以付款时间可用的服务单数计算。" },
    unpaidTiming: { title: "未付款", definition: "订单画像中没有付款确认时间，无法计算从付款到申请的时效。", logic: "此项展示付款确认时间缺失的售后服务单及对应售后报表金额快照；不进入其他申请时效区间。" },
    applyTiming: { title: "申请时效", definition: "从订单付款到发起售后申请的耗时分布，以及对应的售后报表金额快照。", logic: "根据订单付款时间和售后申请时间计算；付款时间缺失或申请早于付款的记录不参与占比和时效金额。5分钟、1小时、24小时为累计时间窗口；24-72小时与72小时以上为互不重叠区间。" },
  };

  async function sha256(buffer) {
    if (!window.crypto?.subtle) throw new Error("浏览器不支持静态文件校验");
    const digest = await window.crypto.subtle.digest("SHA-256", buffer);
    return [...new Uint8Array(digest)].map((item) => item.toString(16).padStart(2, "0")).join("");
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`快照元数据加载失败 (${response.status})`);
    return response.json();
  }

  function root() { return document.getElementById("aftersaleApp"); }

  function setStatus(message, type = "") {
    const node = root()?.querySelector("[data-aftersale-status]");
    if (node) {
      node.textContent = message || "";
      node.className = `aftersale-status ${type}`;
    }
  }

  function paramsFor(queryId) {
    if (state.mode === STATIC_SNAPSHOT) return {};
    const {
      start_date, end_date, business_type,
      category_l1, category_l2, category_l3, category_l4,
    } = state.liveFilters;
    const categoryFilters = { category_l1, category_l2, category_l3, category_l4 };
    const cohortFilters = { start_date, end_date, business_type, ...categoryFilters };
    const applicationFilters = {
      apply_start_date: start_date,
      apply_end_date: end_date,
      business_type,
      ...categoryFilters,
    };

    // Apply-day DWS queries deliberately use their own date contract.
    if (queryId === "QD-002") return applicationFilters;
    if (queryId === "QD-006") return {
      ...applicationFilters,
      distribution_type: "AFTERSALE_STATUS",
      limit: 20,
      offset: 0,
    };
    if (queryId === "QD-007") return {
      ...cohortFilters,
      application_scope: "VALID",
      distribution_type: "AFTERSALE_STATUS",
      distribution_match_scope: "ORDER_MATCHED",
      limit: 20,
      offset: 0,
    };
    if (queryId === "QD-010") return {
      context: "OVERVIEW",
      start_date,
      end_date,
      selected_business_type: business_type,
      selected_category_l1: category_l1,
      selected_category_l2: category_l2,
      selected_category_l3: category_l3,
    };
    if (queryId === "QD-003" || queryId === "QD-004" || queryId === "QD-005" || queryId === "QD-008" || queryId === "QD-009") {
      return { ...cohortFilters, limit: 20, offset: 0 };
    }
    return cohortFilters;
  }

  function table(rows, columns) {
    if (!rows?.length) return '<div class="aftersale-empty">暂无可展示的数据</div>';
    return `<div class="aftersale-table-wrap"><table class="aftersale-table"><thead><tr>${columns.map((column) => `<th>${safe(column.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${column.render ? column.render(row) : safe(row[column.key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function helpTrigger(key) {
    const help = HELP[key];
    if (!help) return "";
    return `<button type="button" class="aftersale-help-trigger" data-aftersale-help="${safe(key)}" aria-label="查看${safe(help.title)}口径">?</button>`;
  }

  function metric(label, value, detail, tone = "", helpKey = "") {
    return `<article class="aftersale-metric ${tone}"><div class="aftersale-metric-label">${safe(label)}${helpTrigger(helpKey)}</div><strong>${safe(value)}</strong><div class="aftersale-metric-detail">${safe(detail || "-")}</div></article>`;
  }

  async function renderOverview() {
    const [overview, applications, channels] = await Promise.all([
      source.get("QD-001", paramsFor("QD-001")),
      source.get("QD-002", paramsFor("QD-002")),
      source.get("QD-008", paramsFor("QD-008")),
    ]);
    const o = overview.data || {}, a = applications.data || {};
    return `<section class="aftersale-overview-section"><div class="aftersale-section-head"><div><h3>订单维度</h3><p>订单率、服务单与申请时效均按售后申请行为口径展示。</p></div></div><div class="aftersale-metric-grid">
      ${metric("ALL 售后订单率", rate(o.all_aftersale_order_rate), `售后订单 ${number(o.all_aftersale_order_numerator)} / 成交订单 ${number(o.sale_order_denominator)}`, "coral", "allOrderRate")}
      ${metric("VALID 售后订单率", rate(o.valid_aftersale_order_rate), `有效售后订单 ${number(o.valid_aftersale_order_numerator)}`, "teal", "validOrderRate")}
      ${metric("售后服务单", number(a.service_count), `申请件数 ${number(a.application_item_quantity_sum, 2)}`, "amber", "serviceCount")}
      ${metric("5分钟内申请", rate(a.within_5_minutes_service_rate), `${number(a.within_5_minutes_service_count)} 个服务单`, "violet", "fiveMinuteApply")}
    </div></section>
    <section class="aftersale-overview-section"><div class="aftersale-section-head"><div><h3>金额维度</h3><p>金额均为售后报表金额快照，不等同于最终退款完成金额。</p></div></div><div class="aftersale-metric-grid">
      ${metric("售后订单金额", money(a.reported_amount_sum), "售后报表金额快照", "money", "reportedAmount")}
      ${metric("申请时已发货售后金额", money(a.shipped_at_apply_reported_amount_sum), "出库时间不晚于售后申请时间", "amber", "shippedAtApplyAmount")}
      ${metric("申请时未发货售后金额", money(a.not_shipped_at_apply_reported_amount_sum), "等待出库或申请后出库", "coral", "notShippedAtApplyAmount")}
      ${metric("发货状态待确认金额", money(a.shipment_status_unknown_reported_amount_sum), "订单画像证据不足", "violet", "unknownShipmentAmount")}
    </div></section>
    <section class="aftersale-split-grid"><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>申请时效${helpTrigger("applyTiming")}</h3><p>按售后申请行为口径展示，不使用销售封顶数量。</p></div></div><div class="aftersale-timing-list">
      <div class="aftersale-timing-heading"><span>申请时长</span><span>服务单</span><span>占比</span><span>售后金额</span></div>
      ${timing("5分钟内", a.within_5_minutes_service_count, a.within_5_minutes_service_rate, a.within_5_minutes_reported_amount_sum)}
      ${timing("1小时内", a.within_1_hour_service_count, a.within_1_hour_service_rate, a.within_1_hour_reported_amount_sum)}
      ${timing("24小时内", a.within_24_hours_service_count, a.within_24_hours_service_rate, a.within_24_hours_reported_amount_sum)}
      ${timing("24-72小时内", a.within_24_to_72_hours_service_count, ratio(a.within_24_to_72_hours_service_count, a.timing_eligible_service_count), a.within_24_to_72_hours_reported_amount_sum)}
      ${timing("72小时以上", a.within_72_hours_plus_service_count, ratio(a.within_72_hours_plus_service_count, a.timing_eligible_service_count), a.within_72_hours_plus_reported_amount_sum)}
      ${timing(`未付款${helpTrigger("unpaidTiming")}`, a.missing_minutes_service_count, null, a.missing_payment_time_reported_amount_sum, true)}
    </div></article><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>渠道售后表现</h3><p>ALL 与 VALID 口径由已发布快照直接提供。</p></div></div>${table(channels.items || [], [
      { label: "渠道", key: "order_channel" }, { label: "ALL 售后率", render: (row) => rate(row.all_aftersale_order_rate) }, { label: "VALID 售后率", render: (row) => rate(row.valid_aftersale_order_rate) }, { label: "成交订单", render: (row) => number(row.sale_order_denominator) }
    ])}</article></section>`;
  }

  function timing(label, count, share, amount, htmlLabel = false) { return `<div class="aftersale-timing"><span>${htmlLabel ? label : safe(label)}</span><b>${number(count)}</b><em>${rate(share)}</em><strong>${money(amount)}</strong></div>`; }

  async function renderProducts() {
    const [scale, ranking, products] = await Promise.all([
      source.get("QD-003", paramsFor("QD-003")), source.get("QD-004", paramsFor("QD-004")), source.get("QD-005", paramsFor("QD-005")),
    ]);
    const rankingColumns = [
      { label: "商品", render: (row) => safe(row.product_name || row.sku_id) }, { label: "SKU", key: "sku_id" }, { label: "ALL 服务单", render: (row) => number(row.all_aftersale_order_sku_numerator) }, { label: "VALID 售后率", render: (row) => rate(row.valid_aftersale_order_sku_rate) },
    ];
    return `<section class="aftersale-split-grid"><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>售后规模榜</h3><p>按 Stage D 已发布排序展示。</p></div></div>${table(scale.items || [], rankingColumns)}</article><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>高售后率榜</h3><p>仅展示已满足成熟样本条件的结果。</p></div></div>${table(ranking.items || [], rankingColumns)}</article></section><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>商品售后明细</h3><p>空值统一显示为 -，不在前端重新计算售后率。</p></div></div>${table(products.items || [], [
      { label: "商品", render: (row) => safe(row.product_name || "-") }, { label: "SKU", key: "sku_id" }, { label: "业态", render: (row) => safe(row.business_type) }, { label: "类目", render: (row) => safe([row.category_l1,row.category_l2,row.category_l3,row.category_l4].filter(Boolean).join(" / ") || "-") }, { label: "VALID 售后率", render: (row) => rate(row.valid_aftersale_order_sku_rate) }, { label: "主原因", render: (row) => safe(row.primary_reason_group_valid || "-") }
    ])}</article>`;
  }

  async function renderDistribution() {
    const [apply, cohort] = await Promise.all([source.get("QD-006", paramsFor("QD-006")), source.get("QD-007", paramsFor("QD-007"))]);
    const common = [
      { label: "分布值", key: "distribution_value" }, { label: "服务单", render: (row) => number(row.service_count) }, { label: "订单数", render: (row) => number(row.distinct_order_count) }, { label: "订单-SKU 对", render: (row) => number(row.distinct_order_sku_pair_count) }, { label: "报表金额", render: (row) => number(row.reported_amount_sum, 2) },
    ];
    return `<section class="aftersale-split-grid"><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>申请行为分布</h3><p>申请件数采用原始申请件数语义。</p></div></div>${table(apply.items || [], [...common, { label: "申请件数", render: (row) => number(row.application_item_quantity_sum, 2) }])}</article><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>队列售后分布</h3><p>商品质量指标采用订单-SKU 销售封顶语义。</p></div></div>${table(cohort.items || [], common)}</article></section>`;
  }

  async function renderCategories() {
    const [categories, filters] = await Promise.all([source.get("QD-009", paramsFor("QD-009")), source.get("QD-010", paramsFor("QD-010"))]);
    const tree = filters.data?.category_tree || [];
    const treeText = tree.slice(0, 8).map((item) => Array.isArray(item) ? item.filter(Boolean).join(" / ") : (item.category_l1 || item.label || "-")).join("<br>");
    return `<section class="aftersale-category-summary"><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>类目筛选入口</h3><p>${state.mode === STATIC_SNAPSHOT ? STATIC_FILTER_MESSAGE : "本地实时模式由 Stage E 在服务端处理完整类目路径。"}</p></div></div><div class="aftersale-category-tree">${treeText || "暂无类目路径"}</div></article></section><article class="aftersale-card"><div class="aftersale-card-head"><div><h3>类目售后表现</h3><p>类目行不在浏览器端求和或平均。</p></div></div>${table(categories.items || [], [
      { label: "类目路径", render: (row) => safe([row.category_l1,row.category_l2,row.category_l3,row.category_l4].filter(Boolean).join(" / ") || "-") }, { label: "ALL 售后率", render: (row) => rate(row.all_aftersale_order_rate) }, { label: "VALID 售后率", render: (row) => rate(row.valid_aftersale_order_rate) }, { label: "成交订单", render: (row) => number(row.sale_order_denominator) }, { label: "观察状态", render: (row) => safe(row.maturity_status || "-") }
    ])}</article>`;
  }

  async function renderView() {
    const container = root()?.querySelector("[data-aftersale-content]");
    if (!container || state.loading) return;
    state.loading = true; state.error = "";
    container.innerHTML = '<div class="aftersale-loading">正在加载售后快照…</div>';
    setStatus(state.mode === STATIC_SNAPSHOT ? `静态快照 · ${state.current.static_publish_batch_id}` : "AI 演示数据加载中", "loading");
    try {
      const body = state.view === "overview" ? await renderOverview() : state.view === "products" ? await renderProducts() : state.view === "distribution" ? await renderDistribution() : await renderCategories();
      container.innerHTML = body;
      bindHelpTriggers();
      setStatus(state.mode === STATIC_SNAPSHOT ? `静态快照 · ${state.current.static_publish_batch_id}` : "AI 演示数据", "ready");
    } catch (error) {
      state.error = error.message || "售后数据加载失败";
      container.innerHTML = `<div class="aftersale-error"><strong>售后数据暂时不可用</strong><span>${safe(state.error)}</span><button type="button" data-aftersale-retry>重试</button></div>`;
      setStatus("加载失败", "error");
    } finally { state.loading = false; }
  }

  function categoryLabel() {
    const values = ["category_l1", "category_l2", "category_l3", "category_l4"]
      .map((key) => state.liveFilters[key]).filter(Boolean);
    return values.length ? values.join(" / ") : "全店数据";
  }

  function categoryValues(level) {
    const rows = state.filterOptions?.filter_combinations || [];
    const index = Number(level.slice(-1));
    const field = `category_l${index}`;
    return [...new Set(rows.filter((row) => {
      for (let parent = 1; parent < index; parent += 1) {
        const parentField = `category_l${parent}`;
        if (state.liveFilters[parentField] && row[parentField] !== state.liveFilters[parentField]) return false;
      }
      return Boolean(row[field]);
    }).map((row) => row[field]))].sort((left, right) => String(left).localeCompare(String(right), "zh-CN"));
  }

  function selectOptions(values, selected, placeholder) {
    return `<option value="">${safe(placeholder)}</option>${values.map((value) => `<option value="${safe(value)}" ${selected === value ? "selected" : ""}>${safe(value)}</option>`).join("")}`;
  }

  function categoryPopover(filtersDisabled) {
    if (!state.categoryOpen) return "";
    if (!state.filterOptions) return '<div class="aftersale-filter-popover aftersale-category-popover"><span class="aftersale-popover-loading">正在加载类目…</span></div>';
    return `<div class="aftersale-filter-popover aftersale-category-popover">
      <div class="aftersale-popover-title">按层级选择类目</div>
      <label>一级类目<select data-live-filter="category_l1" ${filtersDisabled}>${selectOptions(categoryValues("category_l1"), state.liveFilters.category_l1, "全部一级类目")}</select></label>
      <label>二级类目<select data-live-filter="category_l2" ${filtersDisabled}>${selectOptions(categoryValues("category_l2"), state.liveFilters.category_l2, "全部二级类目")}</select></label>
      <label>三级类目<select data-live-filter="category_l3" ${filtersDisabled}>${selectOptions(categoryValues("category_l3"), state.liveFilters.category_l3, "全部三级类目")}</select></label>
      <label>四级类目<select data-live-filter="category_l4" ${filtersDisabled}>${selectOptions(categoryValues("category_l4"), state.liveFilters.category_l4, "全部四级类目")}</select></label>
    </div>`;
  }

  function businessPopover(filtersDisabled) {
    if (!state.businessOpen) return "";
    const values = state.filterOptions?.business_types || ["货架销售", "CPS返利", "CPS推广"];
    return `<div class="aftersale-filter-popover aftersale-business-popover"><div class="aftersale-popover-title">选择业态</div><select data-live-filter="business_type" ${filtersDisabled}>${selectOptions(values, state.liveFilters.business_type, "全部业态")}</select></div>`;
  }

  async function ensureFilterOptions() {
    if (state.filterOptions || state.mode !== LOCAL_LIVE_API) return;
    const response = await source.get("QD-010", paramsFor("QD-010"));
    state.filterOptions = response.data || {};
  }

  async function applyLiveFilters({ refreshOptions = false } = {}) {
    if (hasInvalidLiveDateRange()) {
      throw new Error("开始日期不能晚于结束日期，请调整时间范围。");
    }
    if (refreshOptions) state.filterOptions = null;
    state.data.clear();
    renderShell();
    await renderView();
  }

  function shiftDate(value, offset) {
    const date = new Date(`${value}T00:00:00`);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  function hasInvalidLiveDateRange() {
    const { start_date: startDate, end_date: endDate } = state.liveFilters;
    return Boolean(startDate && endDate && startDate > endDate);
  }

  async function initializeLiveDateRange() {
    const response = await source.get("QD-002");
    const cutoffDate = String(response.data?.observation_cutoff_date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cutoffDate)) return;
    state.liveMaxDate = cutoffDate;
    if (!state.liveFilters.start_date && !state.liveFilters.end_date) {
      state.liveFilters.start_date = shiftDate(cutoffDate, -6);
      state.liveFilters.end_date = cutoffDate;
    }
  }

  async function applyQuickRange(days) {
    await ensureFilterOptions();
    const overview = await source.get("QD-002", paramsFor("QD-002"));
    const anchor = state.liveFilters.end_date || overview.data?.observation_cutoff_date || overview.data?.source_snapshot_at;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(anchor || ""))) throw new Error("无法确定售后数据的最新日期");
    const endDate = days === 1 ? shiftDate(anchor, -1) : anchor;
    state.liveFilters.start_date = days === 1 ? endDate : shiftDate(endDate, -(days - 1));
    state.liveFilters.end_date = endDate;
    await applyLiveFilters({ refreshOptions: true });
  }

  function resetFilterChildren(field) {
    const level = Number(field.slice(-1));
    if (!Number.isFinite(level)) return;
    for (let child = level + 1; child <= 4; child += 1) state.liveFilters[`category_l${child}`] = "";
  }

  function renderShell() {
    const app = root(); if (!app) return;
    const filtersDisabled = state.mode !== LOCAL_LIVE_API ? "disabled" : "";
    const filterNote = state.mode === STATIC_SNAPSHOT ? STATIC_FILTER_MESSAGE : "筛选基于 AI 演示数据计算。";
    const businessText = state.liveFilters.business_type || "全部业态";
    app.innerHTML = `<section class="aftersale-module"><header class="aftersale-header aftersale-header--controls"><div class="aftersale-mode"><span data-aftersale-status class="aftersale-status">正在准备数据</span><div class="aftersale-mode-buttons"><button type="button" data-aftersale-mode="${STATIC_SNAPSHOT}" class="${state.mode === STATIC_SNAPSHOT ? "active" : ""}">静态快照</button><button type="button" data-aftersale-mode="${LOCAL_LIVE_API}" class="${state.mode === LOCAL_LIVE_API ? "active" : ""}" ${state.liveAvailable ? "" : "disabled"}>本地实时</button></div></div></header><div class="aftersale-filterbar"><span class="aftersale-toolbar-label">时间</span><div class="aftersale-quick-ranges"><button type="button" data-aftersale-range="1" ${filtersDisabled}>昨日</button><button type="button" data-aftersale-range="7" ${filtersDisabled}>近7日</button><button type="button" data-aftersale-range="30" ${filtersDisabled}>近30日</button></div><span class="aftersale-toolbar-divider" aria-hidden="true"></span><div class="aftersale-date-range"><span>当前时间</span><input data-live-filter="start_date" type="date" value="${safe(state.liveFilters.start_date)}" ${filtersDisabled}><span class="aftersale-date-separator">至</span><input data-live-filter="end_date" type="date" value="${safe(state.liveFilters.end_date)}" ${filtersDisabled}></div><span class="aftersale-toolbar-divider" aria-hidden="true"></span><div class="aftersale-filter-menu"><button type="button" class="aftersale-filter-trigger" data-aftersale-category-toggle ${filtersDisabled}>类目：<b>${safe(categoryLabel())}</b><span>⌄</span></button>${categoryPopover(filtersDisabled)}</div><div class="aftersale-filter-menu"><button type="button" class="aftersale-filter-trigger" data-aftersale-business-toggle ${filtersDisabled}>业态：<b>${safe(businessText)}</b><span>⌄</span></button>${businessPopover(filtersDisabled)}</div><button type="button" class="aftersale-clear-filter" data-aftersale-clear ${filtersDisabled}>清空筛选</button><span class="aftersale-filter-note">${filterNote}</span></div><nav class="aftersale-tabs" aria-label="售后分析视图"><button data-aftersale-view="overview" class="${state.view === "overview" ? "active" : ""}">售后概览</button><button data-aftersale-view="products" class="${state.view === "products" ? "active" : ""}">商品分析</button><button data-aftersale-view="distribution" class="${state.view === "distribution" ? "active" : ""}">分布分析</button><button data-aftersale-view="categories" class="${state.view === "categories" ? "active" : ""}">类目分析</button></nav><div data-aftersale-content class="aftersale-content"></div></section>`;
    bindEvents();
  }

  function bindEvents() {
    const app = root();
    if (!app || app.dataset.aftersaleEventsBound === "1") return;
    app.dataset.aftersaleEventsBound = "1";
    app.addEventListener("click", async (event) => {
      const modeButton = event.target.closest("[data-aftersale-mode]");
      if (modeButton) {
        const mode = modeButton.dataset.aftersaleMode;
        try { await source.useMode(mode); renderShell(); await renderView(); } catch (error) { setStatus(error.message, "error"); }
        return;
      }
      const tab = event.target.closest("[data-aftersale-view]");
      if (tab) {
        state.view = tab.dataset.aftersaleView;
        app.querySelectorAll("[data-aftersale-view]").forEach((button) => button.classList.toggle("active", button === tab));
        await renderView(); return;
      }
      const rangeButton = event.target.closest("[data-aftersale-range]");
      if (rangeButton && state.mode === LOCAL_LIVE_API) {
        try { await applyQuickRange(Number(rangeButton.dataset.aftersaleRange)); } catch (error) { setStatus(error.message, "error"); }
        return;
      }
      if (event.target.closest("[data-aftersale-category-toggle]") && state.mode === LOCAL_LIVE_API) {
        state.categoryOpen = !state.categoryOpen;
        state.businessOpen = false;
        try { if (state.categoryOpen) await ensureFilterOptions(); renderShell(); await renderView(); } catch (error) { setStatus(error.message, "error"); }
        return;
      }
      if (event.target.closest("[data-aftersale-business-toggle]") && state.mode === LOCAL_LIVE_API) {
        state.businessOpen = !state.businessOpen;
        state.categoryOpen = false;
        try { if (state.businessOpen) await ensureFilterOptions(); renderShell(); await renderView(); } catch (error) { setStatus(error.message, "error"); }
        return;
      }
      if (event.target.closest("[data-aftersale-clear]") && state.mode === LOCAL_LIVE_API) {
        Object.keys(state.liveFilters).forEach((key) => { state.liveFilters[key] = ""; });
        state.categoryOpen = false;
        state.businessOpen = false;
        await applyLiveFilters({ refreshOptions: true });
        return;
      }
      if (event.target.closest("[data-aftersale-retry]")) { await renderView(); }
    });
    app.addEventListener("change", async (event) => {
      const input = event.target.closest("[data-live-filter]");
      if (!input || state.mode !== LOCAL_LIVE_API) return;
      const field = input.dataset.liveFilter;
      const previousValue = state.liveFilters[field];
      state.liveFilters[field] = input.value;
      if ((field === "start_date" || field === "end_date") && hasInvalidLiveDateRange()) {
        state.liveFilters[field] = previousValue;
        renderShell();
        setStatus("开始日期不能晚于结束日期，请重新选择。", "error");
        return;
      }
      if (field.startsWith("category_l")) resetFilterChildren(field);
      state.categoryOpen = Boolean(field.startsWith("category_l"));
      state.businessOpen = field === "business_type";
      try {
        await applyLiveFilters({ refreshOptions: field === "start_date" || field === "end_date" || field === "business_type" });
      } catch (error) {
        setStatus(error.message || "时间筛选无效", "error");
      }
    });
  }

  function moveHelpTooltip(event) {
    const tooltip = document.getElementById("tooltip");
    if (!tooltip) return;
    const rect = event.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${event.clientX || rect.right}px`;
    tooltip.style.top = `${event.clientY || rect.bottom}px`;
  }

  function showHelpTooltip(event) {
    const help = HELP[event.currentTarget.dataset.aftersaleHelp];
    const tooltip = document.getElementById("tooltip");
    if (!help || !tooltip) return;
    tooltip.innerHTML = `<div class="tooltip-title">${safe(help.title)}</div><div class="tooltip-body"><strong>指标释义：</strong>${safe(help.definition)}</div><div class="tooltip-body"><strong>取数逻辑：</strong>${safe(help.logic)}</div>`;
    tooltip.classList.add("show");
    moveHelpTooltip(event);
  }

  function hideHelpTooltip() {
    document.getElementById("tooltip")?.classList.remove("show");
  }

  function bindHelpTriggers() {
    root()?.querySelectorAll("[data-aftersale-help]").forEach((trigger) => {
      if (trigger.dataset.aftersaleHelpBound === "1") return;
      trigger.dataset.aftersaleHelpBound = "1";
      trigger.addEventListener("mouseenter", showHelpTooltip);
      trigger.addEventListener("mousemove", moveHelpTooltip);
      trigger.addEventListener("mouseleave", hideHelpTooltip);
      trigger.addEventListener("focus", showHelpTooltip);
      trigger.addEventListener("blur", hideHelpTooltip);
    });
  }

  function injectStyles() {
    if (document.getElementById("aftersaleModuleStyles")) return;
    const style = document.createElement("style"); style.id = "aftersaleModuleStyles";
    style.textContent = `.aftersale-module{padding:26px 0 8px}.aftersale-header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:18px}.aftersale-eyebrow{font-size:13px;font-weight:700;color:var(--brand-deep,#b46e2a)}.aftersale-header h2{margin:5px 0;font-size:30px;color:var(--text-primary,#2b2522)}.aftersale-header p,.aftersale-card p{margin:0;color:var(--text-secondary,#8a8178);font-size:14px;line-height:1.6}.aftersale-mode{text-align:right}.aftersale-status{display:block;min-height:20px;font-size:12px;color:#817568;margin-bottom:7px}.aftersale-status.ready{color:#2f8e76}.aftersale-status.error{color:#c45e57}.aftersale-mode-buttons,.aftersale-tabs{display:flex;gap:8px}.aftersale-mode-buttons button,.aftersale-tabs button,.aftersale-error button{border:1px solid rgba(220,180,140,.35);background:#fffaf5;color:#805b36;border-radius:10px;padding:8px 12px;font:inherit;font-weight:700;cursor:pointer}.aftersale-mode-buttons button.active,.aftersale-tabs button.active{background:#ed9e54;color:#fff;border-color:#ed9e54}.aftersale-mode-buttons button:disabled{opacity:.45;cursor:not-allowed}.aftersale-filterbar{display:flex;align-items:end;gap:12px;padding:14px 16px;border:1px solid rgba(220,180,140,.25);border-radius:16px;background:#fff;box-shadow:0 10px 25px rgba(103,76,47,.04)}.aftersale-filterbar label{display:grid;gap:5px;font-size:12px;color:#817568}.aftersale-filterbar input,.aftersale-filterbar select{height:34px;min-width:136px;border:1px solid rgba(220,180,140,.35);border-radius:8px;padding:0 8px;background:#fff;color:#51463d}.aftersale-filterbar input:disabled,.aftersale-filterbar select:disabled{background:#faf7f3;color:#a99f95}.aftersale-filter-note{font-size:13px;color:#9a7252;margin-left:auto}.aftersale-tabs{margin:20px 0 16px;border-bottom:1px solid rgba(220,180,140,.23);padding-bottom:12px}.aftersale-content{min-height:240px}.aftersale-metric-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:16px}.aftersale-metric,.aftersale-card{border:1px solid rgba(220,180,140,.25);background:#fff;border-radius:16px;box-shadow:0 9px 24px rgba(103,76,47,.04)}.aftersale-metric{padding:18px;position:relative;overflow:hidden}.aftersale-metric:after{content:"";position:absolute;width:70px;height:70px;border-radius:50%;right:-24px;bottom:-28px;background:#fff1e2}.aftersale-metric.coral:after{background:#ffe8e7}.aftersale-metric.teal:after{background:#e6f5f1}.aftersale-metric.amber:after{background:#e3f8fa}.aftersale-metric.money:after{background:#e8efff}.aftersale-metric.violet:after{background:#f1e9ff}.aftersale-metric-label{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:700;color:#6a5b50}.aftersale-help-trigger{display:inline-grid;place-items:center;width:19px;height:19px;padding:0;border:1px solid rgba(101,116,232,.42);border-radius:50%;background:#fff;color:#5268d5;font:inherit;font-size:12px;font-weight:800;line-height:1;cursor:help}.aftersale-help-trigger:focus-visible{outline:2px solid rgba(101,116,232,.35);outline-offset:2px}.aftersale-metric strong{display:block;margin:8px 0;font-size:28px;color:#2b2522}.aftersale-metric-detail{font-size:12px;color:#877b70}.aftersale-split-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:16px}.aftersale-card{padding:18px;margin-bottom:16px}.aftersale-card-head{margin-bottom:14px}.aftersale-card h3{display:flex;align-items:center;gap:7px;margin:0 0 4px;color:#342c27;font-size:18px}.aftersale-timing-list{display:grid;gap:9px}.aftersale-timing{display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;border-top:1px solid #f3ebe3;padding:10px 0;color:#6a5b50}.aftersale-timing b{font-size:18px;color:#2b2522}.aftersale-timing em{font-style:normal;color:#c86d49}.aftersale-table-wrap{overflow:auto}.aftersale-table{width:100%;border-collapse:collapse;font-size:13px}.aftersale-table th{white-space:nowrap;text-align:left;color:#8c7e71;font-weight:700;background:#fdf9f5}.aftersale-table td,.aftersale-table th{padding:10px 9px;border-bottom:1px solid #f1e9e2;vertical-align:top}.aftersale-table td{color:#51463d}.aftersale-empty,.aftersale-loading,.aftersale-error{padding:34px;text-align:center;border:1px dashed rgba(220,180,140,.5);border-radius:16px;background:#fffdfb;color:#8a8178}.aftersale-error{display:grid;gap:8px;justify-items:center;color:#b95550}.aftersale-error button{margin-top:5px}.aftersale-category-tree{padding:12px;background:#fdf9f5;border-radius:10px;color:#685a4f;font-size:13px;line-height:1.8}@media(max-width:1100px){.aftersale-metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.aftersale-header{display:block}.aftersale-mode{text-align:left;margin-top:12px}.aftersale-filterbar{flex-wrap:wrap}.aftersale-filter-note{width:100%;margin-left:0}.aftersale-split-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(style);
    const firstScreenStyle = document.createElement("style");
    firstScreenStyle.id = "aftersaleFirstScreenTheme";
    firstScreenStyle.textContent = `
      .aftersale-module{padding:18px 0 8px;color:#263755}
      .aftersale-header{align-items:center;gap:20px;margin-bottom:14px}
      .aftersale-header--controls{justify-content:flex-end;min-height:30px;margin-bottom:8px}
      .aftersale-eyebrow{font-size:12px;font-weight:700;letter-spacing:.08em;color:#6574e8}
      .aftersale-header h2{margin:3px 0 2px;font-size:21px;line-height:1.3;color:#1f3155}
      .aftersale-header p,.aftersale-card p{font-size:12px;line-height:1.5;color:#71809a}
      .aftersale-mode{display:flex;align-items:center;gap:8px;text-align:left}
      .aftersale-status{display:inline-flex;align-items:center;min-height:28px;margin:0;padding:0 9px;border:1px solid rgba(101,116,232,.16);border-radius:999px;background:rgba(247,249,255,.92);font-size:11px;color:#65718a}
      .aftersale-status.ready{color:#278a86;background:rgba(230,249,248,.76);border-color:rgba(24,167,182,.18)}
      .aftersale-status.error{color:#bb5960;background:#fff6f6;border-color:rgba(199,96,104,.18)}
      .aftersale-mode-buttons,.aftersale-tabs{gap:4px}
      .aftersale-mode-buttons{padding:3px;border:1px solid rgba(101,116,232,.14);border-radius:11px;background:rgba(255,255,255,.8)}
      .aftersale-mode-buttons button,.aftersale-tabs button,.aftersale-error button{border:1px solid transparent;background:transparent;color:#62718a;border-radius:8px;padding:6px 9px;font-size:12px;font-weight:600}
      .aftersale-mode-buttons button.active,.aftersale-tabs button.active{background:linear-gradient(135deg,#6574e8,#4e92ea);color:#fff;border-color:transparent;box-shadow:0 4px 10px rgba(87,112,210,.18)}
        .aftersale-filterbar{position:relative;display:flex;min-height:58px;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(101,116,232,.16);border-radius:16px;background:rgba(255,255,255,.9);box-shadow:0 10px 26px rgba(69,91,148,.06)}
        .aftersale-toolbar-label,.aftersale-date-range>span{color:#536783;font-size:13px;font-weight:800;white-space:nowrap}
        .aftersale-quick-ranges{display:flex;gap:6px}.aftersale-quick-ranges button,.aftersale-filter-trigger,.aftersale-clear-filter{height:38px;border:1px solid rgba(101,116,232,.2);border-radius:10px;padding:0 12px;background:#fff;color:#566884;font:inherit;font-size:13px;font-weight:700;white-space:nowrap;cursor:pointer;transition:border-color .18s ease,background .18s ease,color .18s ease}.aftersale-quick-ranges button:hover,.aftersale-filter-trigger:hover,.aftersale-clear-filter:hover{border-color:#8b9af0;background:#f5f7ff;color:#4e62d7}.aftersale-quick-ranges button:disabled,.aftersale-filter-trigger:disabled,.aftersale-clear-filter:disabled{cursor:not-allowed;opacity:.52;background:#f6f7fb}
        .aftersale-toolbar-divider{width:1px;height:30px;background:rgba(101,116,232,.18);flex:0 0 auto}.aftersale-date-range{display:flex;align-items:center;gap:8px}.aftersale-date-separator{font-weight:600!important;color:#8190a6!important}
        .aftersale-filterbar input,.aftersale-filterbar select{height:38px;min-width:138px;border:1px solid rgba(101,116,232,.19);border-radius:10px;padding:0 10px;background:rgba(255,255,255,.96);color:#344563;font-size:13px}
        .aftersale-filterbar input:hover,.aftersale-filterbar select:hover{border-color:rgba(101,116,232,.36)}
        .aftersale-filterbar input:focus,.aftersale-filterbar select:focus{outline:none;border-color:#6574e8;box-shadow:0 0 0 3px rgba(101,116,232,.11)}
        .aftersale-filterbar input:disabled,.aftersale-filterbar select:disabled{background:#f5f7fc;color:#9aa6b9}
        .aftersale-filter-menu{position:relative}.aftersale-filter-trigger{display:flex;align-items:center;gap:6px;max-width:250px}.aftersale-filter-trigger b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#455979}.aftersale-filter-trigger span{font-size:15px;color:#697a99}.aftersale-clear-filter{border-color:rgba(91,113,229,.22);background:#f5f7ff;color:#5268d5}
        .aftersale-filter-popover{position:absolute;z-index:32;top:calc(100% + 8px);right:0;width:270px;padding:12px;border:1px solid rgba(101,116,232,.2);border-radius:13px;background:#fff;box-shadow:0 16px 36px rgba(42,61,113,.16)}.aftersale-category-popover{width:310px}.aftersale-filter-popover label{display:grid;gap:5px;margin-top:9px;color:#65748d;font-size:12px;font-weight:700}.aftersale-filter-popover select{width:100%;min-width:0}.aftersale-popover-title{color:#334a6d;font-size:13px;font-weight:800}.aftersale-popover-loading{display:block;padding:8px 0;color:#71809b;font-size:12px}.aftersale-filter-note{margin-left:auto;font-size:11.5px;line-height:1.35;color:#8090a8;white-space:nowrap}
      .aftersale-tabs{margin:12px 0 14px;padding:4px;width:max-content;max-width:100%;border:1px solid rgba(101,116,232,.14);border-radius:12px;background:rgba(255,255,255,.7)}
      .aftersale-tabs button{white-space:nowrap}
  .aftersale-overview-section{margin-bottom:18px}.aftersale-section-head{display:flex;justify-content:space-between;align-items:flex-end;margin:0 0 10px}.aftersale-section-head h3{margin:0;color:#293b5b;font-size:17px}.aftersale-section-head p{margin:4px 0 0;color:#71809a;font-size:12px;line-height:1.5}.aftersale-metric-grid{gap:14px;margin-bottom:0}
      .aftersale-metric,.aftersale-card{border:1px solid rgba(101,116,232,.18);background:linear-gradient(180deg,rgba(255,255,255,.99),rgba(248,251,255,.97));border-radius:18px;box-shadow:0 12px 28px rgba(69,91,148,.08),inset 0 1px 0 rgba(255,255,255,.9)}
      .aftersale-metric{min-height:166px;padding:18px 18px 16px}
      .aftersale-metric::before{content:"";position:absolute;left:16px;right:16px;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.96),transparent);pointer-events:none}
      .aftersale-metric:after{width:66px;height:66px;right:-18px;bottom:-22px;opacity:.6;background:#edf1ff}
      .aftersale-metric.coral{border-color:rgba(101,116,232,.25)}.aftersale-metric.coral:after{background:#e9ebff}
      .aftersale-metric.teal{border-color:rgba(78,146,234,.23)}.aftersale-metric.teal:after{background:#e7f2ff}
      .aftersale-metric.amber{border-color:rgba(24,167,182,.23)}.aftersale-metric.amber:after{background:#e3f8fa}
      .aftersale-metric.violet{border-color:rgba(112,120,207,.22)}.aftersale-metric.violet:after{background:#f0ecff}
      .aftersale-metric-label{font-size:13px;font-weight:600;color:#526581}
      .aftersale-metric strong{margin:10px 0 8px;font-size:32px;line-height:1.1;letter-spacing:-.55px;color:#21314e}
      .aftersale-metric-detail{position:relative;z-index:1;font-size:11.5px;line-height:1.5;color:#7b899f}
  .aftersale-split-grid{gap:16px}.aftersale-card{padding:18px;margin-bottom:16px}.aftersale-card h3{font-size:17px;color:#293b5b}.aftersale-timing-heading,.aftersale-timing{grid-template-columns:minmax(90px,1fr) auto auto auto}.aftersale-timing-heading{display:grid;gap:16px;padding:0 0 7px;color:#8290a7;font-size:12px;font-weight:700}.aftersale-timing{border-color:#e8edf8;color:#60708a}.aftersale-timing b{color:#273956}.aftersale-timing em{color:#4e92ea}.aftersale-timing strong{font-size:14px;color:#425774;white-space:nowrap}.aftersale-table th{background:#f5f7ff;color:#667691}.aftersale-table td,.aftersale-table th{border-color:#e8edf6}.aftersale-table td{color:#41526d}
      @media (hover:hover) and (pointer:fine){.aftersale-metric{transition:transform 220ms ease,box-shadow 220ms ease,border-color 220ms ease}.aftersale-metric:hover{transform:translateY(-2px);border-color:rgba(101,116,232,.34);box-shadow:0 18px 34px rgba(69,91,148,.13),inset 0 1px 0 rgba(255,255,255,.95)}}
      .aftersale-filter-note{display:none}
      @media(max-width:1280px){.aftersale-filterbar{flex-wrap:wrap}.aftersale-filter-note{width:100%;margin-left:0}.aftersale-metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:760px){.aftersale-header{display:block}.aftersale-mode{margin-top:10px;flex-wrap:wrap}.aftersale-toolbar-divider{display:none}.aftersale-toolbar-label{width:100%}.aftersale-date-range{width:100%;flex-wrap:wrap}.aftersale-date-range input{flex:1 1 145px;min-width:0}.aftersale-filter-menu,.aftersale-filter-trigger,.aftersale-clear-filter{flex:1 1 auto}.aftersale-filter-trigger{justify-content:space-between;max-width:none}.aftersale-filter-popover{left:0;right:auto;width:min(310px,calc(100vw - 54px))}.aftersale-tabs{overflow-x:auto}.aftersale-metric-grid{grid-template-columns:1fr}}
    `;
    firstScreenStyle.textContent += ".aftersale-mode-buttons{display:none!important}";
    document.head.appendChild(firstScreenStyle);
  }

  async function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    injectStyles();
    state.current = { static_publish_batch_id: "AI-DEMO" };
    state.routeMap = { routes: Object.keys(AFTERSALE_DEMO).map((queryId) => ({ query_id: queryId, route: `/demo-api/aftersale/${queryId}` })) };
    state.capabilities = { approximation_allowed: false };
    state.liveAvailable = true;
    state.mode = LOCAL_LIVE_API;
    source.mode = LOCAL_LIVE_API;
    state.liveFilters.start_date = "2026-07-25";
    state.liveFilters.end_date = "2026-07-31";
    state.liveMaxDate = "2026-07-31";
    state.filterOptions = AFTERSALE_DEMO["QD-010"].data;
    renderShell();
    await renderView();
  }

  window.JD_AFTERSALE_DASHBOARD = { AftersaleDataSource, STATIC_SNAPSHOT, LOCAL_LIVE_API, initialize };
  window.addEventListener("jd-dashboard-page-changed", (event) => { if (event.detail?.page === PAGE_NAME) initialize(); });
  document.addEventListener("DOMContentLoaded", () => { if (!document.querySelector(`[data-page="${PAGE_NAME}"]`)?.hidden) initialize(); });
})();
