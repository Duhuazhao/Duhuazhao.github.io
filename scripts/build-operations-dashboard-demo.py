#!/usr/bin/env python3
"""Build a public-safe demo from the owner's real operations dashboard UI."""

from __future__ import annotations

import json
import math
import random
from datetime import date, timedelta
from pathlib import Path


PORTFOLIO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path.home() / "Documents" / "京东自动化" / "data" / "outputs"
OUTPUT_ROOT = PORTFOLIO_ROOT / "assets" / "operations-dashboard"


def round2(value: float) -> float:
    return round(value + 1e-9, 2)


def build_demo_bundle() -> dict:
    start = date(2026, 5, 3)
    days = 90
    business_types = [
        ("货架销售", 0.56),
        ("站内推广", 0.31),
        ("站外推广", 0.13),
    ]
    categories = [
        ("核心类目", "核心商品", "主力款", "商品 A", 0.40),
        ("增长类目", "增长商品", "新品", "商品 B", 0.27),
        ("利润类目", "利润商品", "组合装", "商品 C", 0.20),
        ("拉新类目", "引流商品", "体验装", "商品 D", 0.13),
    ]

    sales_daily: list[dict] = []
    same_day_daily: list[dict] = []
    category_daily: list[dict] = []
    customer_segments = {"180": [], "365": [], "all": []}
    bundle_daily: list[dict] = []

    for index in range(days):
        current_date = (start + timedelta(days=index)).isoformat()
        weekday_factor = [0.91, 0.96, 1.0, 1.03, 1.08, 1.16, 0.86][index % 7]
        growth_factor = 1 + index * 0.0062
        pulse = 1 + 0.055 * math.sin(index / 4.7)
        day_net = 47_200 * growth_factor * weekday_factor * pulse
        refund_rate = max(0.105, 0.135 - index * 0.00028)
        day_order = day_net / (1 - refund_rate)
        day_refund = day_order - day_net

        for business_type, business_share in business_types:
            net_amount = round2(day_net * business_share)
            order_amount = round2(day_order * business_share)
            refund_amount = round2(day_refund * business_share)
            order_count = max(1, round(order_amount / 186))
            refund_count = max(0, round(order_count * refund_rate * 0.72))
            row = {
                "date": current_date,
                "businessType": business_type,
                "orderAmount": order_amount,
                "refundAmount": refund_amount,
                "netAmount": net_amount,
                "orderCount": order_count,
                "refundOrderCount": refund_count,
                "orderRows": round(order_count * 1.16),
                "refundRows": round(refund_count * 1.08),
            }
            sales_daily.append(row)
            same_day_daily.append({**row, "refundAmount": round2(refund_amount * 0.82), "netAmount": round2(order_amount - refund_amount * 0.82)})

            for level1, level2, level3, leaf, category_share in categories:
                category_order = round2(order_amount * category_share)
                category_refund = round2(refund_amount * category_share)
                category_net = round2(category_order - category_refund)
                category_daily.append({
                    **row,
                    "orderAmount": category_order,
                    "refundAmount": category_refund,
                    "netAmount": category_net,
                    "orderCount": max(1, round(order_count * category_share)),
                    "refundOrderCount": max(0, round(refund_count * category_share)),
                    "orderRows": max(1, round(order_count * category_share * 1.16)),
                    "refundRows": max(0, round(refund_count * category_share * 1.08)),
                    "categoryL1": level1,
                    "categoryL2": level2,
                    "categoryL3": level3,
                    "leafCategory": leaf,
                })

            segment_shares = [("new", 0.680), ("old", 0.318), ("unknown", 0.002)]
            for segment, segment_share in segment_shares:
                segment_amount = round2(net_amount * segment_share)
                avg_value = 168 if segment == "new" else 198 if segment == "old" else 180
                user_count = 0 if segment == "unknown" else max(1, round(segment_amount / avg_value))
                segment_row = {
                    "date": current_date,
                    "businessType": business_type,
                    "segment": segment,
                    "netAmount": segment_amount,
                    "userCount": user_count,
                    "orderCount": max(1, round(segment_amount / 181)),
                    "itemQuantity": max(1, round(segment_amount / 139)),
                    "category3Count": 4 if segment != "unknown" else 0,
                }
                for window in customer_segments:
                    adjusted = dict(segment_row)
                    if window == "180" and segment == "old":
                        adjusted["netAmount"] = round2(segment_amount * 0.92)
                    if window == "365" and segment == "old":
                        adjusted["netAmount"] = round2(segment_amount * 0.97)
                    customer_segments[window].append(adjusted)

            total_orders = order_count

            # 套购演示口径：28% 的订单购买两种及以上商品，并贡献 36% 的成交额。
            # 订单数和金额都先计算互斥分组，再用差额回填末组，确保各组严格加总到总盘。
            single_order_count = round(total_orders * 0.72)
            product2_order_count = round(total_orders * 0.19)
            product3_order_count = round(total_orders * 0.06)
            product4_order_count = round(total_orders * 0.02)
            product5_order_count = total_orders - single_order_count - product2_order_count - product3_order_count - product4_order_count

            single_amount = round2(net_amount * 0.64)
            product2_amount = round2(net_amount * 0.23)
            product3_amount = round2(net_amount * 0.08)
            product4_amount = round2(net_amount * 0.03)
            product5_amount = round2(net_amount - single_amount - product2_amount - product3_amount - product4_amount)

            multi_item_order_count = total_orders - single_order_count
            multi_item_amount = round2(net_amount - single_amount)
            same_category_order_count = round(multi_item_order_count * (18 / 28))
            cross_category_order_count = multi_item_order_count - same_category_order_count
            same_category_amount = round2(multi_item_amount * (22 / 36))
            cross_category_amount = round2(multi_item_amount - same_category_amount)

            buckets = [
                ("product1", "1种商品", single_order_count, single_amount),
                ("product2", "2种商品", product2_order_count, product2_amount),
                ("product3", "3种商品", product3_order_count, product3_amount),
                ("product4", "4种商品", product4_order_count, product4_amount),
                ("product5Plus", "5种及以上", product5_order_count, product5_amount),
            ]
            bundle_daily.append({
                "date": current_date,
                "businessType": business_type,
                "totalOrderCount": total_orders,
                "totalAmount": net_amount,
                "totalProductKinds": round(total_orders * 1.42),
                "multiItemOrderCount": multi_item_order_count,
                "multiItemOrderShare": round(multi_item_order_count / total_orders, 4),
                "multiItemAmount": multi_item_amount,
                "multiItemAmountShare": round(multi_item_amount / net_amount, 4),
                "buckets": [
                    {
                        "key": key,
                        "label": label,
                        "orderCount": bucket_order_count,
                        "orderShare": round(bucket_order_count / total_orders, 4),
                        "amount": bucket_amount,
                        "amountShare": round(bucket_amount / net_amount, 4),
                    }
                    for key, label, bucket_order_count, bucket_amount in buckets
                ],
                "categoryBundleTypes": [
                    {
                        "key": "singleProduct",
                        "label": "非套购",
                        "note": "1种商品",
                        "orderCount": single_order_count,
                        "amount": single_amount,
                    },
                    {
                        "key": "sameCategory3",
                        "label": "同三级类目套购",
                        "note": "2种及以上商品，三级类目一致",
                        "orderCount": same_category_order_count,
                        "amount": same_category_amount,
                    },
                    {
                        "key": "crossCategory3",
                        "label": "跨三级类目套购",
                        "note": "2种及以上商品，跨多个三级类目",
                        "orderCount": cross_category_order_count,
                        "amount": cross_category_amount,
                    },
                ],
            })

    total_net = sum(row["netAmount"] for row in sales_daily)
    rfm_counts = [3680, 1940, 4820, 2260, 1760, 10540]
    rfm_amount_shares = [0.238, 0.082, 0.161, 0.128, 0.109, 0.282]
    rfm_labels = [
        ("champion", "核心高价值客", 0.78, 24),
        ("growth", "成长客", 0.56, 31),
        ("new", "新客待转化", 0.0, None),
        ("activate", "待激活客", 0.48, 38),
        ("risk", "流失风险客", 0.41, 52),
        ("once", "一次购客", 0.0, None),
    ]
    rfm_profiles = {}
    for window in ("180", "365", "all"):
        segments = []
        for (key, label, repurchase_rate, interval), count, amount_share in zip(rfm_labels, rfm_counts, rfm_amount_shares):
            amount = round2(total_net * amount_share)
            segments.append({
                "key": key,
                "label": label,
                "customerCount": count,
                "netAmount": amount,
                "netAmountShare": amount_share,
                "avgCustomerValue": round2(amount / count),
                "repurchaseRate": repurchase_rate,
                "medianIntervalDays": interval,
                "topCategories": [],
            })
        rfm_profiles[window] = {
            "windowDays": window,
            "anchorDate": (start + timedelta(days=days - 1)).isoformat(),
            "identifiableUserCount": sum(rfm_counts),
            "segments": segments,
        }

    repurchase_daily: list[dict] = []
    cohort_months = [
        "2025-08-01", "2025-09-01", "2025-10-01", "2025-11-01",
        "2025-12-01", "2026-01-01", "2026-02-01", "2026-03-01",
        "2026-04-01", "2026-05-01", "2026-06-01", "2026-07-01",
    ]
    for month_index, first_purchase_date in enumerate(cohort_months):
        for business_index, (business_type, _) in enumerate(business_types):
            base_users = 920 + month_index * 38 + business_index * 64
            average_interval = 35.5 - month_index * 0.22 + business_index * 0.7
            repurchase_daily.append({
                "firstPurchaseDate": first_purchase_date,
                "businessType": business_type,
                "windowDays": 0,
                "eligibleCustomerCount": 1,
                "repurchaseCustomerCount": round2(average_interval),
                "repurchaseRate": round2(33 + business_index * 2 + month_index * 0.08),
            })
            for window_days, base_rate in ((30, 0.086), (60, 0.143), (90, 0.196)):
                rate = base_rate + month_index * 0.0022 + business_index * 0.003
                repurchase_daily.append({
                    "firstPurchaseDate": first_purchase_date,
                    "businessType": business_type,
                    "windowDays": window_days,
                    "eligibleCustomerCount": base_users,
                    "repurchaseCustomerCount": round(base_users * rate),
                    "repurchaseRate": round2(rate),
                })

    return {
        "success": True,
        "data": {
            "commerce_publish_batch_id": "ai-demo-2026-08",
            "salesDaily": sales_daily,
            "sameDayDaily": same_day_daily,
            "categoryDaily": category_daily,
            "customerSegments": customer_segments,
            "customerCategoryDaily": [],
            "bundleDaily": bundle_daily,
            "repurchaseDaily": repurchase_daily,
            "repurchaseSummary": {},
            "rfmProfiles": rfm_profiles,
        },
        "meta": {
            "commerce_publish_batch_id": "ai-demo-2026-08",
            "source_snapshot_at": "AI_GENERATED_DEMO",
        },
    }


def build_promotion_demo_script(bundle_data: dict) -> str:
    randomizer = random.Random(20260804)
    sales_daily = bundle_data["salesDaily"]
    net_by_date: dict[str, float] = {}
    for row in sales_daily:
        net_by_date[row["date"]] = net_by_date.get(row["date"], 0) + float(row["netAmount"])

    tools = [
        ("京准通快车", 0.055, 4.35, 0.72),
        ("全站营销", 0.034, 5.15, 0.64),
    ]
    rows: list[dict] = []
    for day_index, (current_date, all_channel_net) in enumerate(sorted(net_by_date.items())):
        cycle = 1 + 0.08 * math.sin(day_index / 5.2)
        for tool, spend_share, base_roi, direct_share in tools:
            noise = 1 + randomizer.uniform(-0.055, 0.055)
            spend = all_channel_net * spend_share * cycle * noise
            roi = base_roi * (1 + 0.045 * math.cos(day_index / 6.5)) * (1 + randomizer.uniform(-0.035, 0.035))
            net_amount = spend * roi
            refund_rate = 0.105 + 0.012 * math.sin(day_index / 8.0) + randomizer.uniform(-0.006, 0.006)
            order_amount = net_amount / (1 - refund_rate)
            refund_amount = order_amount - net_amount
            unmapped_share = 0.012 if tool == "京准通快车" else 0.006
            direct_amount = net_amount * direct_share
            unmapped_amount = net_amount * unmapped_share
            indirect_amount = net_amount - direct_amount - unmapped_amount
            cost_indirect_amount = indirect_amount * (0.72 if tool == "京准通快车" else 0.66)
            other_indirect_amount = indirect_amount - cost_indirect_amount
            cps_cross_amount = net_amount * (0.075 if tool == "京准通快车" else 0.052)
            rows.append({
                "date": current_date,
                "tool": tool,
                "all_channel_net_amount": round2(all_channel_net),
                "spend_amount": round2(spend),
                "order_amount": round2(order_amount),
                "refund_amount": round2(refund_amount),
                "net_amount": round2(net_amount),
                "direct_net_amount": round2(direct_amount),
                "cost_category_indirect_net_amount": round2(cost_indirect_amount),
                "other_category_indirect_net_amount": round2(other_indirect_amount),
                "unmapped_net_amount": round2(unmapped_amount),
                "cps_promotion_cross_net_amount": round2(cps_cross_amount),
            })

    product_rows: list[dict] = []
    product_names = [
        "核心功能款 A", "轻量体验款 B", "高阶升级款 C", "家庭组合装 D",
        "便携体验装 E", "经典畅销款 F", "限定礼盒 G", "入门基础款 H",
        "高复购耗材 I", "场景套装 J", "高客单旗舰款 K", "渠道专供款 L",
        "利润贡献款 M", "会员权益款 N", "新品测试款 O", "季节趋势款 P",
        "内容种草款 Q", "直播主推款 R", "搜索承接款 S", "人群拓展款 T",
        "老客专享款 U", "拉新引流款 V", "长尾补充款 W", "库存优化款 X",
    ]
    for index, product_name in enumerate(product_names):
        net_amount = 286_000 * (0.89 ** index) * (1 + randomizer.uniform(-0.045, 0.045))
        avg_price = 148 + (index % 6) * 23
        item_quantity = max(18, round(net_amount / avg_price))
        visitors = max(item_quantity + 1, round(item_quantity / (0.075 + (index % 5) * 0.011)))
        new_share = 0.67 - (index % 4) * 0.035
        promotion_share = 0.28 + (index % 5) * 0.025
        onsite_promotion = net_amount * promotion_share
        direct_promotion = onsite_promotion * 0.78
        other_promotion = onsite_promotion - direct_promotion
        promotion_spend = net_amount * (0.068 + (index % 4) * 0.006)
        cps_amount = net_amount * (0.11 + (index % 3) * 0.018)
        shelf_amount = net_amount - onsite_promotion - cps_amount
        product_rows.append({
            "spu_id": f"DEMO-SPU-{index + 1:03d}",
            "product_name": product_name,
            "product_visitors": visitors,
            "post_refund_conversion_rate": round2(item_quantity / visitors),
            "net_amount": round2(net_amount),
            "item_quantity": item_quantity,
            "new_customer_amount": round2(net_amount * new_share),
            "old_customer_amount": round2(net_amount * (1 - new_share)),
            "product_repurchase_90d_rate": round2(0.13 + (index % 7) * 0.013),
            "new_customer_repurchase_90d_rate": round2(0.085 + (index % 6) * 0.011),
            "shelf_sales_amount": round2(shelf_amount),
            "cps_sales_amount": round2(cps_amount),
            "promotion_spend_amount": round2(promotion_spend),
            "promotion_fee_ratio": round2(promotion_spend / net_amount),
            "self_promotion_direct_net_amount": round2(direct_promotion),
            "other_promotion_indirect_net_amount": round2(other_promotion),
            "onsite_promotion_spu_net_amount": round2(onsite_promotion),
            "self_promotion_indirect_net_amount": round2(onsite_promotion * 0.064),
        })

    data_json = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    bundle_json = json.dumps(bundle_data["bundleDaily"], ensure_ascii=False, separators=(",", ":"))
    products_json = json.dumps(product_rows, ensure_ascii=False, separators=(",", ":"))
    return f'''(() => {{
  const daily = {data_json};
  const bundleDaily = {bundle_json};
  const productSeeds = {products_json};
  const originalFetch = window.fetch.bind(window);
  const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);
  const round = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  const selectRows = (url) => daily.filter((row) => row.date >= (url.searchParams.get("start_date") || "0000-01-01") && row.date <= (url.searchParams.get("end_date") || "9999-12-31"));
  const finalize = (rows, tool) => {{
    const result = {{
      ...(tool ? {{ tool }} : {{}}),
      spend_amount: round(sum(rows, "spend_amount")),
      order_amount: round(sum(rows, "order_amount")),
      refund_amount: round(sum(rows, "refund_amount")),
      net_amount: round(sum(rows, "net_amount")),
      direct_net_amount: round(sum(rows, "direct_net_amount")),
      cost_category_indirect_net_amount: round(sum(rows, "cost_category_indirect_net_amount")),
      other_category_indirect_net_amount: round(sum(rows, "other_category_indirect_net_amount")),
      unmapped_net_amount: round(sum(rows, "unmapped_net_amount")),
      cps_promotion_cross_net_amount: round(sum(rows, "cps_promotion_cross_net_amount")),
    }};
    result.indirect_net_amount = round(result.cost_category_indirect_net_amount + result.other_category_indirect_net_amount);
    const allChannelByDate = new Map(rows.map((row) => [row.date, Number(row.all_channel_net_amount || 0)]));
    const allChannelNet = [...allChannelByDate.values()].reduce((total, value) => total + value, 0);
    result.spend_to_all_channel_net_ratio = allChannelNet ? result.spend_amount / allChannelNet : 0;
    result.net_roi = result.spend_amount ? result.net_amount / result.spend_amount : 0;
    result.net_roi_excluding_cps = result.spend_amount ? (result.net_amount - result.cps_promotion_cross_net_amount) / result.spend_amount : 0;
    return result;
  }};
  const buildTools = (rows) => ({{
    success: true,
    data: {{
      items: [...new Set(rows.map((row) => row.tool))].map((tool) => finalize(rows.filter((row) => row.tool === tool), tool))
    }},
    meta: {{ source: "AI_GENERATED_DEMO" }}
  }});
  const buildSummary = (rows) => {{
    const byDate = new Map();
    rows.forEach((row) => {{
      const group = byDate.get(row.date) || [];
      group.push(row);
      byDate.set(row.date, group);
    }});
    const toolCross = [...byDate.values()].reduce((total, dayRows) => total + (dayRows.length > 1 ? Math.min(...dayRows.map((row) => Number(row.net_amount || 0))) * 0.07 : 0), 0);
    const base = finalize(rows);
    const directReduction = toolCross * 0.82;
    const costReduction = toolCross * 0.12;
    const otherReduction = toolCross * 0.06;
    base.tool_cross_net_amount = round(toolCross);
    base.direct_net_amount = round(base.direct_net_amount - directReduction);
    base.cost_category_indirect_net_amount = round(base.cost_category_indirect_net_amount - costReduction);
    base.other_category_indirect_net_amount = round(base.other_category_indirect_net_amount - otherReduction);
    base.indirect_net_amount = round(base.cost_category_indirect_net_amount + base.other_category_indirect_net_amount);
    base.net_amount = round(base.direct_net_amount + base.indirect_net_amount + base.unmapped_net_amount);
    base.refund_amount = round(base.refund_amount - toolCross * 0.08);
    base.order_amount = round(base.net_amount + base.refund_amount);
    base.deduped_cps_promotion_cross_net_amount = round(base.cps_promotion_cross_net_amount * 0.92);
    const allChannelByDate = new Map(rows.map((row) => [row.date, Number(row.all_channel_net_amount || 0)]));
    const allChannelNet = [...allChannelByDate.values()].reduce((total, value) => total + value, 0);
    base.spend_to_all_channel_net_ratio = allChannelNet ? base.spend_amount / allChannelNet : 0;
    base.net_roi = base.spend_amount ? base.net_amount / base.spend_amount : 0;
    base.net_roi_excluding_cps = base.spend_amount ? (base.net_amount - base.deduped_cps_promotion_cross_net_amount) / base.spend_amount : 0;
    return {{ success: true, data: base, meta: {{ source: "AI_GENERATED_DEMO" }} }};
  }};
  const selectedDays = (url) => {{
    const start = new Date(`${{url.searchParams.get("start_date") || "2026-07-31"}}T00:00:00`);
    const end = new Date(`${{url.searchParams.get("end_date") || "2026-07-31"}}T00:00:00`);
    return Math.max(1, Math.round((end - start) / 86400000) + 1);
  }};
  const buildCustomerConversion = (url) => {{
    const days = selectedDays(url);
    const eligibleUserCount = Math.round(days * 486 * (url.searchParams.getAll("business_type").length ? 0.94 : 1));
    const conversionRate = 0.028 + Math.min(days, 30) * 0.00022;
    return {{ success: true, data: {{ eligibleUserCount, convertedUserCount: Math.round(eligibleUserCount * conversionRate), conversionRate }}, meta: {{ source: "AI_GENERATED_DEMO" }} }};
  }};
  const buildBundleDistribution = (url) => {{
    const start = url.searchParams.get("start_date") || "0000-01-01";
    const end = url.searchParams.get("end_date") || "9999-12-31";
    const businessTypes = url.searchParams.getAll("business_type");
    const rows = bundleDaily.filter((row) => row.date >= start && row.date <= end && (!businessTypes.length || businessTypes.includes(row.businessType)));
    return {{ success: true, data: {{ bundleDaily: rows }}, meta: {{ source: "AI_GENERATED_DEMO" }} }};
  }};
  const buildProductRanking = (url) => {{
    const scale = selectedDays(url) / 30;
    const search = (url.searchParams.get("search") || "").trim().toLowerCase();
    const amountKeys = ["net_amount","new_customer_amount","old_customer_amount","shelf_sales_amount","cps_sales_amount","promotion_spend_amount","self_promotion_direct_net_amount","other_promotion_indirect_net_amount","onsite_promotion_spu_net_amount","self_promotion_indirect_net_amount"];
    const integerKeys = ["product_visitors","item_quantity"];
    let items = productSeeds.map((seed) => {{
      const item = {{ ...seed }};
      amountKeys.forEach((key) => {{ item[key] = round(Number(seed[key] || 0) * scale); }});
      integerKeys.forEach((key) => {{ item[key] = Math.max(1, Math.round(Number(seed[key] || 0) * scale)); }});
      return item;
    }}).filter((item) => !search || `${{item.spu_id}} ${{item.product_name}}`.toLowerCase().includes(search));
    const sortBy = url.searchParams.get("sort_by") || "net_amount";
    const direction = url.searchParams.get("sort_order") === "asc" ? 1 : -1;
    items.sort((left, right) => direction * (Number(left[sortBy] || 0) - Number(right[sortBy] || 0)));
    const total = items.length;
    const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
    const limit = Math.max(1, Number(url.searchParams.get("limit") || 10));
    return {{ success: true, data: {{ items: items.slice(offset, offset + limit), pagination: {{ total, limit, offset }}, repurchase_basis: {{ cohort_start_date: "2026-01-01", cohort_end_date: "2026-04-30" }} }}, meta: {{ source: "AI_GENERATED_DEMO" }} }};
  }};
  window.fetch = (input, init) => {{
    const raw = typeof input === "string" ? input : input?.url;
    const url = new URL(raw, window.location.href);
    const isSummary = url.pathname.endsWith("/demo-api/promotion/summary");
    const isTools = url.pathname.endsWith("/demo-api/promotion/tools");
    const isCustomerConversion = url.pathname.endsWith("/demo-api/dashboard-data/customer-conversion");
    const isBundleDistribution = url.pathname.endsWith("/demo-api/dashboard-data/bundle-distribution");
    const isProductRanking = url.pathname.endsWith("/demo-api/products/ranking");
    if (!isSummary && !isTools && !isCustomerConversion && !isBundleDistribution && !isProductRanking) return originalFetch(input, init);
    const payload = isSummary ? buildSummary(selectRows(url))
      : isTools ? buildTools(selectRows(url))
      : isCustomerConversion ? buildCustomerConversion(url)
      : isBundleDistribution ? buildBundleDistribution(url)
      : buildProductRanking(url);
    return Promise.resolve(new Response(JSON.stringify(payload), {{ status: 200, headers: {{ "Content-Type": "application/json; charset=utf-8" }} }}));
  }};
}})();
'''


def patch_dashboard_api(source: str) -> str:
    source = source.replace(
        'const COMMERCE_API = window.location.protocol === "http:"\n    ? `${window.location.protocol}//${window.location.hostname}:8765/api`\n    : "http://127.0.0.1:8765/api";',
        'const COMMERCE_API = "./demo-api";',
    )
    source = source.replace(
        'const COMMERCE_STATIC_DASHBOARD = "../static/commerce/current/dashboard.json";',
        'const COMMERCE_STATIC_DASHBOARD = "./dashboard-demo.json?v=20260805-bundle-fix";',
    )
    source = source.replace(
        'const commerceState = { source: "static", batch: null, snapshotAt: null, degraded: true };',
        'const commerceState = { source: "dynamic", batch: "ai-demo-2026-08", snapshotAt: "AI_GENERATED_DEMO", degraded: false };',
    )
    source = source.replace('commerceState.source = "static"', 'commerceState.source = "dynamic"')
    source = source.replace('commerceState.degraded = true', 'commerceState.degraded = false')
    source = source.replace(
        '''      let payload;
      if (canUseFetch()) {
        try {
          const response = await fetch(`${COMMERCE_API}/${DASHBOARD_API_ROUTE}`, { cache: "no-cache" });
          if (!response.ok) throw new Error(`Commerce dashboard failed: ${response.status}`);
          payload = await response.json();
          commerceState.source = "dynamic"; commerceState.batch = payload.meta?.commerce_publish_batch_id || null;
          commerceState.snapshotAt = payload.meta?.source_snapshot_at || null; commerceState.degraded = false;
        } catch {
          // The entire page falls back together, never individual legacy chunks.
        }
      }
      if (!payload) {
        const response = await fetch(COMMERCE_STATIC_DASHBOARD, { cache: "no-cache" });
        if (!response.ok) throw new Error("No dashboard data source is available");
        payload = await response.json();
        commerceState.source = "dynamic"; commerceState.batch = payload.commerce_publish_batch_id || null;
        commerceState.snapshotAt = null; commerceState.degraded = false;
      }''',
        '''      const response = await fetch(COMMERCE_STATIC_DASHBOARD, { cache: "no-cache" });
      if (!response.ok) throw new Error("No dashboard data source is available");
      const payload = await response.json();
      commerceState.source = "dynamic"; commerceState.batch = payload.meta?.commerce_publish_batch_id || "AI-DEMO";
      commerceState.snapshotAt = payload.meta?.source_snapshot_at || "AI_GENERATED_DEMO"; commerceState.degraded = false;''',
        1,
    )
    source = source.replace(
        'bundleBuckets: source.bundleBuckets || [',
        'rfmProfiles: source.rfmProfiles || {},\n      bundleBuckets: source.bundleBuckets || [',
    )
    profile_start = source.index('  async function fetchRfmProfile(windowDays) {')
    detail_start = source.index('  async function fetchRfmDetail(windowDays, segment) {')
    ensure_start = source.index('  async function ensureChunks(names) {')
    if min(profile_start, detail_start, ensure_start) < 0:
        raise RuntimeError("Unable to patch RFM demo handlers")
    replacement = '''  async function fetchRfmProfile(windowDays) {
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

'''
    source = source[:profile_start] + replacement + source[ensure_start:]
    return source


def build_aftersale_demo_bundle() -> dict:
    sale_orders = 12_940
    all_orders = 868
    valid_orders = 594
    products = [
        ("核心功能款 A", "DEMO-SKU-001", 126, 0.061, "尺码不合适"),
        ("轻量体验款 B", "DEMO-SKU-002", 104, 0.054, "主观不喜欢"),
        ("高阶升级款 C", "DEMO-SKU-003", 88, 0.049, "包装轻微破损"),
        ("家庭组合装 D", "DEMO-SKU-004", 76, 0.044, "商品与预期不符"),
        ("经典畅销款 F", "DEMO-SKU-006", 63, 0.039, "配送时效"),
        ("场景套装 J", "DEMO-SKU-010", 51, 0.036, "少件漏发"),
    ]
    product_items = [
        {
            "product_name": name,
            "sku_id": sku,
            "business_type": "货架销售" if index % 2 == 0 else "站内推广",
            "category_l1": "核心类目" if index < 3 else "增长类目",
            "category_l2": "核心商品" if index < 3 else "增长商品",
            "category_l3": "主力款" if index < 3 else "新品",
            "category_l4": f"演示商品 {index + 1}",
            "all_aftersale_order_sku_numerator": count,
            "valid_aftersale_order_sku_rate": rate,
            "primary_reason_group_valid": reason,
        }
        for index, (name, sku, count, rate, reason) in enumerate(products)
    ]
    distributions = [
        ("退款完成", 448, 412, 456, 68_420.50),
        ("换货完成", 214, 202, 221, 39_680.20),
        ("退货处理中", 136, 128, 143, 24_860.75),
        ("维修完成", 92, 87, 96, 14_090.40),
        ("审核关闭", 74, 70, 76, 10_948.15),
    ]
    distribution_items = [
        {
            "distribution_value": label,
            "service_count": services,
            "distinct_order_count": orders,
            "distinct_order_sku_pair_count": pairs,
            "reported_amount_sum": amount,
            "application_item_quantity_sum": round2(pairs * 1.08),
        }
        for label, services, orders, pairs, amount in distributions
    ]
    category_items = [
        {"category_l1": "核心类目", "category_l2": "核心商品", "category_l3": "主力款", "category_l4": "商品 A", "all_aftersale_order_rate": 0.061, "valid_aftersale_order_rate": 0.043, "sale_order_denominator": 5_680, "maturity_status": "样本成熟"},
        {"category_l1": "增长类目", "category_l2": "增长商品", "category_l3": "新品", "category_l4": "商品 B", "all_aftersale_order_rate": 0.072, "valid_aftersale_order_rate": 0.049, "sale_order_denominator": 3_820, "maturity_status": "样本成熟"},
        {"category_l1": "利润类目", "category_l2": "利润商品", "category_l3": "组合装", "category_l4": "商品 C", "all_aftersale_order_rate": 0.058, "valid_aftersale_order_rate": 0.037, "sale_order_denominator": 2_260, "maturity_status": "样本成熟"},
        {"category_l1": "拉新类目", "category_l2": "引流商品", "category_l3": "体验装", "category_l4": "商品 D", "all_aftersale_order_rate": 0.081, "valid_aftersale_order_rate": 0.055, "sale_order_denominator": 1_180, "maturity_status": "持续观察"},
    ]
    return {
        "QD-001": {"success": True, "data": {"all_aftersale_order_rate": all_orders / sale_orders, "valid_aftersale_order_rate": valid_orders / sale_orders, "all_aftersale_order_numerator": all_orders, "valid_aftersale_order_numerator": valid_orders, "sale_order_denominator": sale_orders}},
        "QD-002": {"success": True, "data": {"observation_cutoff_date": "2026-07-31", "source_snapshot_at": "2026-07-31", "service_count": 1_028, "application_item_quantity_sum": 1_176, "reported_amount_sum": 158_000, "shipped_at_apply_reported_amount_sum": 105_400, "not_shipped_at_apply_reported_amount_sum": 44_700, "shipment_status_unknown_reported_amount_sum": 7_900, "within_5_minutes_service_count": 80, "within_5_minutes_service_rate": 80 / 1_002, "within_5_minutes_reported_amount_sum": 10_850, "within_1_hour_service_count": 248, "within_1_hour_service_rate": 248 / 1_002, "within_1_hour_reported_amount_sum": 34_600, "within_24_hours_service_count": 720, "within_24_hours_service_rate": 720 / 1_002, "within_24_hours_reported_amount_sum": 109_300, "within_24_to_72_hours_service_count": 190, "within_24_to_72_hours_reported_amount_sum": 30_800, "within_72_hours_plus_service_count": 92, "within_72_hours_plus_reported_amount_sum": 17_900, "missing_minutes_service_count": 26, "missing_payment_time_reported_amount_sum": 4_600, "timing_eligible_service_count": 1_002}},
        "QD-003": {"success": True, "items": sorted(product_items, key=lambda item: item["all_aftersale_order_sku_numerator"], reverse=True)},
        "QD-004": {"success": True, "items": sorted(product_items, key=lambda item: item["valid_aftersale_order_sku_rate"], reverse=True)},
        "QD-005": {"success": True, "items": product_items},
        "QD-006": {"success": True, "items": distribution_items},
        "QD-007": {"success": True, "items": [{**item, "application_item_quantity_sum": None} for item in distribution_items]},
        "QD-008": {"success": True, "items": [
            {"order_channel": "货架销售", "all_aftersale_order_rate": 0.064, "valid_aftersale_order_rate": 0.043, "sale_order_denominator": 7_360},
            {"order_channel": "站内推广", "all_aftersale_order_rate": 0.071, "valid_aftersale_order_rate": 0.049, "sale_order_denominator": 3_980},
            {"order_channel": "站外推广", "all_aftersale_order_rate": 0.059, "valid_aftersale_order_rate": 0.038, "sale_order_denominator": 1_600},
        ]},
        "QD-009": {"success": True, "items": category_items},
        "QD-010": {"success": True, "data": {"category_tree": category_items, "filter_combinations": category_items, "business_types": ["货架销售", "站内推广", "站外推广"]}},
    }


def patch_aftersale_dashboard(source: str) -> str:
    demo_json = json.dumps(build_aftersale_demo_bundle(), ensure_ascii=False, separators=(",", ":"))
    source = source.replace('  "use strict";', f'  "use strict";\n\n  const AFTERSALE_DEMO = {demo_json};', 1)
    source = source.replace(
        '    async get(queryId, parameters = {}) {\n      const route = this.route(queryId);',
        '    async get(queryId, parameters = {}) {\n      if (AFTERSALE_DEMO[queryId]) return AFTERSALE_DEMO[queryId];\n      const route = this.route(queryId);',
        1,
    )
    old_initialize = '''  async function initialize() {
    if (state.initialized) return;
    state.initialized = true; injectStyles(); renderShell();
    try {
      await source.initializeStatic();
      const liveAvailable = await source.probeLocalService();
      if (liveAvailable) {
        await source.useMode(LOCAL_LIVE_API);
        await initializeLiveDateRange();
      }
      renderShell();
      await renderView();
    } catch (error) {
      root().innerHTML = `<section class="aftersale-module"><div class="aftersale-error"><strong>售后快照不可用</strong><span>${safe(error.message || "发布批次校验失败")}</span></div></section>`;
    }
  }'''
    new_initialize = '''  async function initialize() {
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
  }'''
    if old_initialize not in source:
        raise RuntimeError("Unable to patch aftersale demo initialization")
    source = source.replace(old_initialize, new_initialize, 1)
    source = source.replace('"本地实时查询中"', '"AI 演示数据加载中"')
    source = source.replace('"本地实时数据"', '"AI 演示数据"')
    source = source.replace('"实时筛选由本地 Stage E 服务端执行。"', '"筛选基于 AI 演示数据计算。"')
    source = source.replace('document.head.appendChild(firstScreenStyle);', 'firstScreenStyle.textContent += ".aftersale-mode-buttons{display:none!important}";\n    document.head.appendChild(firstScreenStyle);')
    return source


def patch_dashboard_html(source: str) -> str:
    source = source.replace(
        "</head>",
        '''  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23132239'/%3E%3Ccircle cx='44' cy='20' r='8' fill='%236574e8'/%3E%3Cpath d='M16 18h18v8H24v8h10v8H24v8h-8z' fill='%23fffdf8'/%3E%3C/svg%3E">\n</head>''',
        1,
    )
    source = source.replace(
        'window.JD_AFTERSALE_LIVE_BASE = window.location.protocol === "http:" ? `${window.location.protocol}//${window.location.hostname}:8765` : "http://127.0.0.1:8765";',
        'window.JD_AFTERSALE_LIVE_BASE = "./demo-api";',
    )
    source = source.replace('"http://127.0.0.1:8765/api"', '"./demo-api"')
    source = source.replace("推广分析（开发中）", "推广分析")
    source = source.replace("数据报表（待开发）", "数据报表")
    source = source.replace(
        '''        const bucket = totals[dataKey]?.[bucketDef.key] || {
          label: bucketDef.label,
          note: bucketDef.note,
          orderCount: 0,
          amount: 0,
        };''',
        '''        const bucket = totals[dataKey]?.[bucketDef.key] || bucketDef || {
          label: bucketDef.label,
          note: bucketDef.note,
          orderCount: 0,
          amount: 0,
        };''',
        1,
    )
    source = source.replace(
        'const source = state.source === "dynamic" ? "统一本地服务" : "静态快照";\n      const suffix = state.degraded ? "（服务不可用）" : "";\n      dataSourceStatus.textContent = `数据来源：${source}${suffix}｜批次：${state.batch || "-"}`;',
        'dataSourceStatus.textContent = "数据来源：AI 演示数据｜批次：AI-DEMO";',
    )
    source = source.replace(
        '<script src="jd_dashboard_api.js?v=20260720-promotion-api-scope"></script>',
        '<script src="jd_promotion_demo.js?v=20260805-bundle-fix"></script>\n  <script src="jd_dashboard_api.js?v=20260805-bundle-fix"></script>',
        1,
    )
    disclosure = '''
  <div class="portfolio-demo-disclosure" role="note">
    数据由 AI 生成 · 仅用于演示 · 非真实经营数据
  </div>
'''
    disclosure_css = '''
  <style>
    .portfolio-demo-disclosure {
      position: fixed;
      z-index: 1000;
      right: 18px;
      bottom: 18px;
      padding: 10px 14px;
      border: 1px solid rgba(53, 105, 221, .24);
      border-radius: 999px;
      background: rgba(255, 255, 255, .94);
      color: #2458c6;
      box-shadow: 0 12px 30px rgba(47, 76, 133, .14);
      font: 700 12px/1.4 "PingFang SC", "Microsoft YaHei", sans-serif;
      backdrop-filter: blur(12px);
    }
    @media (max-width: 640px) {
      .portfolio-demo-disclosure { right: 10px; bottom: 10px; max-width: calc(100vw - 20px); }
    }
  </style>
'''
    source = source.replace("</head>", disclosure_css + "</head>", 1)
    source = source.replace("<body>", "<body>" + disclosure, 1)
    return source


def main() -> None:
    required = [
        SOURCE_ROOT / "jd_order_income_dashboard.html",
        SOURCE_ROOT / "jd_dashboard_api.js",
        SOURCE_ROOT / "jd_aftersale_dashboard.js",
    ]
    missing = [str(path) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing source dashboard assets: " + ", ".join(missing))

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    bundle = build_demo_bundle()
    html = patch_dashboard_html(required[0].read_text(encoding="utf-8"))
    api = patch_dashboard_api(required[1].read_text(encoding="utf-8"))
    aftersale = patch_aftersale_dashboard(
        required[2].read_text(encoding="utf-8").replace(
            '"http://127.0.0.1:8765"',
            '"./demo-api"',
        )
    )
    promotion_demo = build_promotion_demo_script(bundle["data"])
    (OUTPUT_ROOT / "index.html").write_text(html, encoding="utf-8")
    (OUTPUT_ROOT / "jd_dashboard_api.js").write_text(api, encoding="utf-8")
    (OUTPUT_ROOT / "jd_promotion_demo.js").write_text(promotion_demo, encoding="utf-8")
    (OUTPUT_ROOT / "jd_aftersale_dashboard.js").write_text(aftersale, encoding="utf-8")
    (OUTPUT_ROOT / "dashboard-demo.json").write_text(
        json.dumps(bundle, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Built demo dashboard in {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()
