# 嫚熙经营数据看板 Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在个人页中增加一个基于真实已交付项目、公开数据已脱敏的嫚熙经营数据看板全屏 Demo。

**Architecture:** 在现有单文件页面新增一个入口卡片和原生 `<dialog>` 全屏看板。看板内使用内嵌、不可反推原始金额的脱敏数据，保留真实趋势、占比和指标关系；四个模块共享同一状态与渲染函数，完全离线运行。

**Tech Stack:** HTML、CSS、原生 JavaScript、Node.js 静态测试、Playwright 浏览器回归。

## Global Constraints

- 品牌公开显示为“嫚熙 Emexx”。
- 默认观察周期为最近 90 天。
- 金额必须脱敏，但趋势、占比、ROI 与模块间勾稽关系保持一致。
- 模块包含销售趋势、商品分析、推广投放、用户板块。
- 必须展示 AI 经营结论与“51 项字段独立复算一致”的可信度说明。
- 不新增第三方前端依赖，不读取公开页面之外的本地业务数据。

---

### Task 1: 冻结可见结构与交互合同

**Files:**
- Modify: `test-page.mjs`
- Modify: `interaction-check.mjs`
- Test: `test-page.mjs`, `interaction-check.mjs`

**Interfaces:**
- Produces: `#openDataDashboard`、`#dataDashboardDialog`、`#closeDataDashboard`、`[data-dashboard-module]`、`#dashboardKpis`、`#dashboardVisual`、`#dashboardInsight`。

- [ ] 在静态测试中断言入口、全屏弹层、四个模块、脱敏说明和校验说明存在。
- [ ] 在浏览器测试中断言打开/关闭弹层、四模块切换、模块内容变化、Escape 关闭与移动端无溢出。
- [ ] 运行静态测试，确认因功能尚未实现而失败。

### Task 2: 实现入口与全屏看板界面

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1 冻结的 DOM id 与 data attribute。
- Produces: 键盘可访问的全屏 `<dialog>`，以及适配桌面和移动端的四模块布局。

- [ ] 在 AI 协作 Demo 前增加“已完成项目”入口卡片，说明品牌、90 天范围、脱敏规则与数据校验。
- [ ] 增加全屏弹层，包含顶部品牌信息、模块导航、KPI 区、主图表区、明细区和 AI 结论区。
- [ ] 增加响应式样式，移动端模块导航横向滚动、内容单列、弹层占满视口。

### Task 3: 实现真实关系的脱敏数据与交互

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: `renderDataDashboard(moduleKey)`；输入 `sales|product|promotion|customer`，同步更新 KPI、图表、明细和结论。

- [ ] 内嵌最近 90 天的脱敏指标、趋势点、商品排名、投放构成与用户结构。
- [ ] 使用 CSS/SVG 原生图形呈现趋势和结构，不引入图表库。
- [ ] 绑定入口、关闭、遮罩、Escape 与模块切换行为，并在关闭后把焦点还给入口。
- [ ] 运行静态测试与浏览器交互测试，修复全部失败。

### Task 4: 视觉与回归验收

**Files:**
- Modify: `visual-check.mjs`（仅在需要补看板截图时）
- Verify: `index.html`

**Interfaces:**
- Produces: 桌面与移动端截图及零溢出、零控制台错误的验收结果。

- [ ] 运行完整结构测试、交互测试和视觉检查。
- [ ] 检查桌面 1440px 与移动 390px 的弹层截图。
- [ ] 搜索未脱敏的店铺名称、用户明细和原始金额，确保它们未进入个人页。

