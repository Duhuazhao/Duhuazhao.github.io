import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const pageUrl = new URL("./index.html", import.meta.url);
const html = await readFile(pageUrl, "utf8");
const operatingNotesSource = await readFile(new URL("./assets/operating-notes.js", import.meta.url), "utf8");
const industryNotesSource = await readFile(new URL("./assets/industry-notes.js", import.meta.url), "utf8");
const methodologySource = await readFile(new URL("./assets/note-methodology.js", import.meta.url), "utf8");

const requiredSections = [
  "hero",
  "method",
  "capabilities",
  "experience",
  "building",
  "notes",
  "about"
];

for (const id of requiredSections) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id} section`);
}

const sectionOrder = ["hero", "experience", "method", "capabilities", "building", "about", "notes"];
for (let index = 1; index < sectionOrder.length; index += 1) {
  const previous = sectionOrder[index - 1];
  const current = sectionOrder[index];
  assert.ok(html.indexOf(`id="${previous}"`) < html.indexOf(`id="${current}"`), `#${current} must follow #${previous}`);
}
assert.match(html, /工作经历 \/ 01/);
assert.match(html, /<span class="nav-index" aria-hidden="true">01<\/span><span>工作经历<\/span>/);
assert.match(html, /<span class="nav-index" aria-hidden="true">03<\/span><span>AI 探索<\/span>/);
assert.match(html, /<span class="nav-index" aria-hidden="true">04<\/span><span>个人介绍<\/span>/);
assert.match(html, /entry\.target\.id === "capabilities" \? "method" : entry\.target\.id/);
assert.match(html, /我的工作方式 \/ 02/);
assert.match(html, /我的方法论 \/ 03/);

assert.match(html, /把长期思考，<br \/>放回真实经营现场/);
assert.match(html, /id="noteFilters"/);
assert.match(html, /id="noteLibrary"/);
assert.match(html, /id="noteDialog"/);
assert.match(html, /assets\/operating-notes\.js/);
assert.match(html, /assets\/industry-notes\.js/);
assert.match(html, /assets\/note-methodology\.js/);
assert.match(html, /assets\/du-huazhao-profile-2026\.png/);
assert.match(html, /yyaa2882@163\.com/);
assert.match(html, /离职求职中/);
assert.doesNotMatch(html, /手机号/);
assert.match(html, /沿着成长轨迹阅读/);
assert.match(html, /沿着经营方法论阅读/);
assert.match(html, /笔记的观点也会随着经验的成长回溯调整/);
assert.match(html, /id="noteDialogSeries"/);
assert.match(html, /id="notePrevious"/);
assert.match(html, /id="noteNext"/);
assert.match(html, /按来源/);
assert.match(html, /按经历/);
assert.match(html, /按阶段/);
assert.equal([...operatingNotesSource.matchAll(/^\s+id: "/gm)].length, 46, "the operating notes library must contain 46 merged notes");
assert.equal([...industryNotesSource.matchAll(/^\s+id: "/gm)].length, 29, "the industry insight library must contain 29 merged notes");
assert.match(industryNotesSource, /行业观察/);
assert.match(industryNotesSource, /同行交流/);
assert.match(industryNotesSource, /内容启发/);
assert.match(industryNotesSource, /待验证假设/);
assert.match(methodologySource, /window\.NOTE_GROWTH_STAGES/);
assert.match(methodologySource, /window\.NOTE_METHOD_SERIES/);
for (const methodology of ["商品增长方法论", "店铺经营方法论", "用户增长方法论", "项目交付方法论", "数据决策方法论"]) {
  assert.match(methodologySource, new RegExp(methodology), `methodology map needs ${methodology}`);
}
const noteContext = { window: { OPERATING_NOTES: [] } };
vm.createContext(noteContext);
vm.runInContext(operatingNotesSource, noteContext);
vm.runInContext(industryNotesSource, noteContext);
vm.runInContext(methodologySource, noteContext);
const noteIds = noteContext.window.OPERATING_NOTES.map((note) => note.id);
const methodologyNoteIds = noteContext.window.NOTE_METHOD_SERIES.flatMap((series) => series.noteIds);
const growthNoteIds = noteContext.window.NOTE_GROWTH_STAGES.flatMap((stage) => stage.noteIds);
assert.equal(methodologyNoteIds.length, noteIds.length, "every note must occupy one methodology position");
assert.equal(new Set(methodologyNoteIds).size, noteIds.length, "methodology series cannot repeat a note");
assert.deepEqual([...methodologyNoteIds].sort(), [...noteIds].sort(), "methodology series must cover every note without unknown IDs");
assert.equal(growthNoteIds.length, noteIds.length, "every note must occupy one growth position");
assert.equal(new Set(growthNoteIds).size, noteIds.length, "growth stages cannot repeat a note");
assert.deepEqual([...growthNoteIds].sort(), [...noteIds].sort(), "growth stages must cover every note without unknown IDs");
assert.deepEqual(
  Array.from(noteContext.window.NOTE_GROWTH_STAGES, (stage) => stage.id),
  ["enchanteur", "suibao", "mead-johnson", "by-health", "manxi", "insight"],
  "growth stages must stay chronological"
);
for (const stage of ["定款规划", "测款调优", "成熟维护", "用户与店铺", "统筹协同", "汇报复盘"]) {
  assert.match(industryNotesSource, new RegExp(`stage: "${stage}"`), `industry insights need the ${stage} stage`);
}
for (const [experience, expectedCount] of Object.entries({
  manxi: 7,
  "by-health": 8,
  "mead-johnson": 12,
  suibao: 12,
  enchanteur: 7
})) {
  assert.equal(
    [...operatingNotesSource.matchAll(new RegExp(`experience: "${experience}"`, "g"))].length,
    expectedCount,
    `${experience} must have ${expectedCount} operating notes`
  );
}
for (const field of ["map", "evidence", "method", "takeaway", "tags"]) {
  assert.equal(
    [...operatingNotesSource.matchAll(new RegExp(`^\\s+${field}:`, "gm"))].length,
    46,
    `every operating note needs the ${field} field`
  );
}

assert.match(html, /电商运营项目 · 职业实践档案/);
assert.match(html, /我用数据理解生意/);
assert.match(html, /再把判断推动成结果/);
assert.match(html, /我擅长从销售、商品、用户、推广和售后等多源数据出发/);
assert.match(html, /从验证数据、形成结论、制定方案/);
assert.match(html, /贯穿工作提效、管理提效与辅助决策/);
assert.match(html, /到组织团队执行和交付结果，我对完整的经营链路负责/);
assert.match(html, /一盘生意，[\s\S]*不能够只看 GMV/);
assert.match(html, /工作经历 \/ 01/);
assert.match(html, /我的工作方式 \/ 02/);
assert.match(html, /我的方法论 \/ 03/);
assert.doesNotMatch(html, /可追溯的经验 \/ 03|Selected work \/ 03|是最具体的表达/);
assert.doesNotMatch(html, /How I work \/ 01|Capabilities \/ 02/);
assert.match(html, /产品价值链、商品结构、用户复购、组织能力与增长质量/);
assert.match(html, /当下的销售成果，也要转化为未来增长的资源/);
assert.match(html, /项目管理能力则负责让方案真正落地/);
assert.match(html, /大盘、销售、流量、商品、内容、视觉、用户、活动、推广、渠道、售后与团队执行/);
assert.match(html, /曝光、点击、加购、转化、成交与复购逐层拆解/);
assert.match(html, /找到当下真正影响成交与增长的关键卡点/);
assert.match(html, /<h3>决定方案<\/h3>/);
assert.match(html, /兼顾短期收益与长期价值，做出有依据的方案/);
assert.match(html, /数据不及预期时的兜底方案/);
assert.match(html, /<h3>把控落地<\/h3>/);
assert.match(html, /把方案细化到阶段与动作，以及负责人、交付物、时间节点和跨角色协作关系/);
assert.match(html, /在预期时间内交付结果/);
assert.match(html, /持续追踪业务执行反馈，复盘动作是否有效和有价值/);
assert.match(html, /把经验沉淀到下一轮经营/);
assert.match(html, /不是技能清单/);
assert.match(html, /是解决问题的方式/);
assert.match(html, /根据经营目标组合使用这些能力/);
assert.doesNotMatch(html, /经营全链路中多源、多维、彼此关联的数据/);
assert.doesNotMatch(html, /lead-emphasis/);
assert.match(html, /<h3>经营理解<\/h3>/);
assert.match(html, /<h3>数据分析<\/h3>/);
assert.match(html, /<h3>AI 应用<\/h3>/);
assert.match(html, /<h3>项目协作<\/h3>/);
assert.match(html, /class="capability-steps"/);
assert.match(html, /对齐业务阶段与目标/);
assert.match(html, /统一指标口径/);
assert.match(html, /识别提效场景/);
assert.match(html, /明确负责人和交付物/);
assert.match(html, /最终产出/);
assert.match(html, /class="method-arrow"/);
assert.match(html, /结果[\s\S]*复盘[\s\S]*再回到数据/);
assert.match(html, /<p class="hero-proof-title">近期成果<\/p>/);
assert.match(html, /同比 \+23%/);
assert.match(html, /行业前 5/);
assert.match(html, /费率 -7pp/);
assert.match(html, /rfm-original-desensitized-v2\.png/);
assert.doesNotMatch(html, /src=["']preview-interaction-data-dashboard\.png["']/);
assert.match(html, /京东POP经营驾驶舱 \/ 已落地脱敏页面/);
assert.match(html, /5 个已落地/);
assert.match(html, /1 个建设中/);
assert.match(html, /51 项计算字段/);
assert.match(html, /data-open-data-dashboard/);
assert.match(html, /点击图片体验经营驾驶舱，或继续下滑查看我是如何解决经营问题的/);
assert.match(html, /dashboard-proof-guide-arrow/);
assert.match(html, /@keyframes dashboard-guide-nudge/);
assert.doesNotMatch(html, /dashboard-proof-cta|点击图片，查看完整驾驶舱/);
assert.match(html, /继续下滑 · 查看工作经历/);
assert.doesNotMatch(html, /点击进入经营驾驶舱/);
assert.match(html, /class="scroll-cue"/);
assert.match(html, /@keyframes hero-scroll-cue/);
assert.match(html, /京东经营数据系统/);
assert.match(html, /AI 工具提效探索 \/ 04/);
assert.match(html, /把经营方法与前沿 AI 结合/);
assert.match(html, /做成真正可靠的经营辅助系统/);
assert.match(html, /一套本地 BI 数据系统已经投入日常使用/);
assert.match(html, /连接飞书、钉钉的团队协作中台正在开发中/);
assert.match(html, /减少机械重复工作带来的时间与人力消耗/);
assert.match(html, /提升基础任务的准确性与一致性/);
assert.match(html, /AI 团队协作管理中台/);
assert.match(html, /杜华钊 · 电商经营项目负责人方向/);
assert.equal((html.match(/class="desktop-demo-note"/g) || []).length, 2, "both interactive demos should carry the PC experience notice");
assert.equal((html.match(/演示功能针对 PC 端开发，请使用 PC 进行完整体验；手机端暂未适配。/g) || []).length, 2);
assert.match(html, /assets\/operations-dashboard\/preview-ai-demo\.png/);
assert.match(html, /点击查看完整看板/);
assert.match(html, /当前经营目标/);
assert.match(html, /日常经营/);
assert.doesNotMatch(html, /AI 大促协作看板|本轮大促目标|第一版以大促/);
assert.match(html, /运营[\s\S]*策划[\s\S]*设计[\s\S]*推广/);
assert.match(html, /id=["']experience["']/);
assert.match(html, /工作经历 \/ 01/);
assert.match(html, /做过的项目，[^<]*<br \/>是最直接的表达/);
assert.match(html, /从店铺执行，走向整盘经营。我的职业路径始终围绕京东平台经营展开/);
assert.match(html, /class=["']experience-timeline reveal["']/);
assert.equal((html.match(/class="experience-note-count"/g) || []).length, 5, "every work experience must show its operating-note count");
for (const count of [7, 8, 12, 12, 7]) {
  assert.match(html, new RegExp(`<strong>${count}<\\/strong><span>篇经营笔记<\\/span>`));
}
assert.match(html, /嫚熙（Emexx） · 京东 POP/);
assert.match(html, /2026\.01 — 2026\.07/);
assert.match(html, /<span>核心品类运营<\/span>/);
assert.match(html, /<h3>京东 POP 核心品类运营<\/h3>/);
assert.match(html, /2025\.08 — 2025\.12/);
assert.match(html, /广州麦优 · 汤臣倍健京东自营旗舰店/);
assert.match(html, /双11全盘排期落地/);
assert.match(html, /多方需求按表执行/);
assert.match(html, /2023\.04 — 2025\.04/);
assert.match(html, /美赞臣 · 京东 POP/);
assert.match(html, /主责官方店全盘经营 · 参与双 POP 用户增长/);
assert.match(html, /2021\.04 — 2023\.03/);
assert.match(html, /穗宝 · 京东自营/);
assert.match(html, /2020\.09 — 2021\.03/);
assert.match(html, /生本广告 · 艾诗官方旗舰店（京东 POP）/);
assert.match(html, /阶段销售额同比增长 30%\+/);
assert.match(html, /双11销售额同比增长 40%\+/);
assert.match(html, /全店客单价提升约 15%/);
assert.match(html, /接管投放后 ROI 保持 5\+/);
assert.match(html, /data-case=["']by-health["']/);
assert.match(html, /data-case=["']ashley-internship["']/);
assert.equal([...html.matchAll(/class="case-context"/g)].length, 5, "all five work experiences need a detailed case context");
assert.equal([...html.matchAll(/class="case-kpis"/g)].length, 5, "all five work experiences need a detailed KPI or delivery summary");
assert.match(html, /协同的价值不是多发几条消息/);
assert.match(html, /约 40% → 70%/);
assert.match(html, /以全盘经营连接销售、货品与用户增长/);
assert.match(html, /把一次小罐试用，连接成长期用户价值/);
assert.match(html, /小罐订单人数同比增长 100%\+/);
assert.match(html, /会员成交金额 ÷ 总成交金额/);
assert.match(html, /3 个月内复购大罐并登记用户 ÷ 小罐购买总用户/);
assert.match(html, /首次复购率由约 20%逐步提升至约 40%/);
assert.match(html, /由我提出小罐购买绑定入会/);
assert.match(html, /复购 3 罐大罐赠玩具，复购 6 罐返还小罐金额/);
assert.match(html, /整体月末库存周转天数持续控制在60天以内/);
assert.match(html, /周转天数 180 天 → 安全库存/);
assert.match(html, /我不是把任务分给不同端口就结束/);
assert.doesNotMatch(html, /用户运营不是多做几场会员活动/);
assert.match(html, /约 9 个月建立稳定销售/);
assert.match(html, /年销售不足 700 万 → 约 2000 万/);
assert.match(html, /2020 年全年与 2022 年全年对比/);
assert.match(html, /核心爆款累计约 1200 万/);
assert.match(html, /1799 元单面偏软款/);
assert.match(html, /组套关联品出货同比 \+30%\+/);
assert.match(html, /实习生完成带教并转正/);
assert.match(html, /店铺有既有成交，但缺少能够持续承接线上增长的商品结构/);
assert.match(html, /既有线下需求在渠道之间的转移/);
assert.match(html, /自然流量与行业排名持续提升/);
assert.match(html, /建立线上专供商品、拓展新用户，并让关联类目共同增长/);
assert.match(html, /2000—2010 年间持续投放电视广告/);
assert.match(html, /消费者如今更可能集中在 30\+、40\+ 人群/);
assert.match(html, /首轮单面候选/);
assert.match(html, /1899—2099 元/);
assert.match(html, /不在起点押注某一款/);
assert.match(html, /由真实的点击、加购、转化与投放表现决定保留哪一款/);
assert.match(html, /05 \/ 核心爆款打造路径/);
assert.match(html, /1899 元[\s\S]*椰棕填料/);
assert.match(html, /1999 元[\s\S]*山棕填料/);
assert.match(html, /2099 元[\s\S]*椰棕 \+ 记忆棉/);
assert.match(html, /两轮末位淘汰 · 每轮 21 天/);
assert.match(html, /推广数据连续观察 15 天/);
assert.match(html, /A\/B 测试场景建模车图/);
assert.match(html, /关键词与人群保持可比/);
assert.match(html, /后续优化分为两条线/);
assert.match(html, /核心卖点文案表达/);
assert.match(html, /关联卖点拓展验证/);
assert.match(html, /变量 05[\s\S]*测试不同视觉风格/);
assert.doesNotMatch(html, /测试不同核心卖点/);
assert.match(html, /品牌核心认知用户[\s\S]*拓展至行业用户/);
assert.match(html, /日常月销约 100 万元/);
assert.match(html, /大促月最高约 300 万元/);
assert.match(html, /从单品突破走向店铺增长/);
assert.equal([...html.matchAll(/class="case-product-stage(?:\s|"|--)/g)].length, 3, "Suibao product path needs three stages");
assert.doesNotMatch(html, /用户在线上看到的商品缺少差异化理由/);
assert.doesNotMatch(html, /公司需要一款真正为电商场景设计的产品/);
assert.doesNotMatch(html, /目标用户更关注护脊、支撑与睡眠质量/);
assert.equal([...html.matchAll(/class="project-open-label">查看经营详情<\/span>/g)].length, 5, "each experience needs a clear business detail CTA");
assert.equal([...html.matchAll(/class="project-open-arrow"/g)].length, 5, "each business detail CTA needs a visible arrow affordance");
assert.doesNotMatch(html, /查看代表案例/);
assert.equal([...html.matchAll(/class="brand-watermark/g)].length, 5, "each work experience needs one brand watermark");
assert.match(html, /assets\/brand-logos\/by-health\.png/);
assert.match(html, /assets\/brand-logos\/mead-johnson\.png/);
assert.match(html, /assets\/brand-logos\/suibao-icon\.png/);
assert.match(html, /assets\/brand-logos\/enchanteur\.svg/);
assert.match(html, /brand-watermark--emxee[^>]*>EMXEE</);
assert.equal([...html.matchAll(/class="experience-entry experience-entry--/g)].length, 5, "each work experience needs one brand color theme");
assert.match(html, /experience-entry--suibao[\s\S]*?--brand-color:\s*#d20b6e/i, "Suibao theme must use magenta");
assert.match(html, /experience-entry--enchanteur[\s\S]*?--brand-color:\s*#f06fa5/i, "Enchanteur theme must use pink");
assert.equal([...html.matchAll(/class="experience-meta"/g)].length, 5, "each work experience needs one four-field profile");
for (const label of ["公司", "品牌", "店铺", "模式"]) {
  assert.equal([...html.matchAll(new RegExp(`<dt>${label}<\\/dt>`, "g"))].length, 5, `each work experience needs the ${label} field`);
}
for (const brandName of ["EMXEE", "BY-HEALTH", "Mead Johnson", "SOMNOPRO", "Enchanteur"]) {
  assert.match(html, new RegExp(`<span lang="en">${brandName}<\\/span>`), `missing English brand name: ${brandName}`);
}
assert.match(html, /嫚熙控股（广州）有限公司/);
assert.match(html, /上海璞康数据科技有限公司/);
assert.match(html, /穗宝京东自营旗舰店/);
assert.match(html, /京东自营运营主管/);
assert.match(html, /类目退款后销售同比 \+23%/);
assert.match(html, /嫚熙 · 类目退款后销售/);
assert.doesNotMatch(html, /id=["']projectFilters["']|data-filter=["']ai["']/);
const experienceSection = html.match(/<section class="section projects" id="experience">([\s\S]*?)<\/section>/)?.[0] ?? "";
assert.ok(experienceSection, "missing work experience section");
assert.doesNotMatch(experienceSection, /AI|京东经营数据系统|数据与 AI 协作/);
assert.match(html, /id=["']caseDialog["']/);
assert.match(html, /id=["']campaignGoal["']/);
assert.match(html, /id=["']campaignRoles["']/);
assert.match(html, /id=["']campaignTasks["']/);
assert.match(html, /id=["']campaignInsight["']/);
assert.match(html, /id=["']advanceCampaign["']/);
assert.match(html, /id=["']blockCampaign["']/);
assert.match(html, /id=["']resetCampaign["']/);
assert.match(html, /id=["']openDataDashboard["']/);
assert.match(html, /id=["']dataDashboardDialog["']/);
assert.match(html, /id=["']closeDataDashboard["']/);
assert.match(html, /id=["']operationsDashboardFrame["']/);
assert.match(html, /class=["']embedded-dashboard-frame["']/);
assert.match(html, /data-src=["']assets\/operations-dashboard\/index\.html["']/);
assert.match(html, /数据由 AI 生成 · 仅用于演示 · 非真实经营数据/);
assert.match(html, /51 项计算字段/);
assert.doesNotMatch(html, /center:\s*["'][^"']*\\\\A/, "donut labels must not expose CSS escape text");
assert.match(html, /交互概念演示/);
assert.match(html, /模拟数据/);
assert.match(html, /prefers-reduced-motion/);
assert.match(html, /@media\s*\(max-width:/);
assert.doesNotMatch(html, /href=["']#["']/, "empty hash links are not allowed");
assert.doesNotMatch(html, /TODO|lorem ipsum/i, "draft placeholders are not allowed");

console.log("personal page structure checks passed");
