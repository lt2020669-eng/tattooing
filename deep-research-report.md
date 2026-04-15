# NINI 深度研究与现状同步报告

> 品牌：NINI | Tattoo Studio in Tokyo  
> 项目形态：静态单页站点  
> 技术栈：`index.html` + Tailwind CDN + 原生 JavaScript + JSON 数据源  
> 同步依据：`dev-log1.md` 最新开发记录  
> 最后同步：2026-04-15

---

## 执行摘要

本报告已根据最新开发日志完成同步更新，定位从早期“概念研究与策划建议”调整为“当前真实实现说明 + 后续内容与运营参考”。

NINI 当前已落地为一个基于单页 `index.html` 的静态站点，页面内容与结构已完成拆分：`data/i18n.json` 负责页面框架文案，`data/artists.json` 负责艺术家结构数据，`data/artistslanguage.json` 负责艺术家三语内容，`data/stories.json` 负责作品结构数据，`data/storieslanguage.json` 负责作品三语内容。页面初始化顺序为：先加载 `i18n`，再加载 `artists`，再加载 `artistslanguage`，再加载 `stories`，再加载 `storieslanguage`，最后渲染艺术家区块、导航、筛选、画廊与弹窗。

当前站点已完成英文、中文、日文三语内容接入。艺术家区块通过 `artists.json + artistslanguage.json` 读取 `avatar`、`name`、`intro` 与 `bio`；画廊卡片与作品弹窗均通过本地化字段读取 `title`、`tag`、`hook` 与 `content`。顶部导航已更新为 `Artists / Gallery / Price / Booking / Studio`，并新增 `#price` 区块，位于 `#gallery` 与 `#booking` 之间。作品正文模型已从旧版 `background / symbolism / technique` 结构收敛为单字段 `content`，弹窗正文按空行自动分段显示。当前内容校验结果为 `Errors: 0`、`Warnings: 0`，说明多语言键、图片路径及数据结构一致性均已通过验证。

因此，项目当前重点已不再是“是否要做画廊文字、多语言、价格区块”，而是继续补充真实作品与故事、完善合规页面、补足 SEO 基础项，并为后续内容型运营提供稳定的维护方式。

---

## 当前真实实现

### 内容与配置拆分

当前项目已完成内容层与结构层拆分，实际使用方式如下：

- 页面框架文案：`data/i18n.json`
- 艺术家结构数据：`data/artists.json`
- 艺术家三语内容：`data/artistslanguage.json`
- 作品结构数据：`data/stories.json`
- 作品三语内容：`data/storieslanguage.json`

当前页面初始化顺序：

1. 加载 `i18n`
2. 加载 `artists`
3. 加载 `artistslanguage`
4. 加载 `stories`
5. 加载 `storieslanguage`
6. 渲染艺术家区块、导航、筛选、画廊与弹窗

这一结构意味着：页面框架文案、艺术家结构、艺术家内容、作品结构、作品内容五部分已经可以分别维护，不再需要把大量内容重新写回 `index.html` 内联。

### 当前艺术家数据模型

当前艺术家信息已从 `index.html` 与 `i18n.json` 的单人硬编码模式中拆出，改为数据驱动维护。

`data/artists.json` 的单条结构当前实际包含：

- `id`
- `featured`
- `sort`
- `active`
- `avatar`
- `avatar_alt`（可选）
- `hero_object_position`（可选）
- `card_object_position`（可选）
- `instagram`（可选）
- `tiktok`（可选）
- `booking_url`（可选）
- `story_ids`（可选）

`data/artistslanguage.json` 的单条结构当前实际包含：

- `name.{en,zh,ja}`
- `title.{en,zh,ja}`
- `intro.{en,zh,ja}`
- `bio.{en,zh,ja}`
- `specialties.{en,zh,ja[]}`
- `philosophy.{en,zh,ja}`

其中：

- `i18n.json` 继续负责页面框架级文案
- `artistslanguage.json` 负责具体艺术家身份、简介与理念内容
- 当前首页默认渲染排序最优先、且 `active !== false` 的主艺术家

### 当前画廊数据模型

当前作品分类固定为三类内部值：

- `character`
- `life`
- `other`

`data/stories.json` 的单条结构当前实际包含：

- `id`
- `category`
- `featured`
- `img`
- `modal_object_position`（可选）
- `card_object_position`（可选）

`data/storieslanguage.json` 的单条结构当前实际包含：

- `title.{en,zh,ja}`
- `tag.{en,zh,ja}`
- `hook.{en,zh,ja}`
- `content.{en,zh,ja}`

### 当前弹窗与图片显示模型

项目早期曾以 `background / symbolism / technique` 作为故事结构参考，但当前前端实际渲染模型已经统一收敛为单字段 `content`。

当前规则如下：

- 旧模型 `background / symbolism / technique` 已并为单字段 `content`
- 弹窗正文按空行自动分段显示
- 已取消自动段落图标与段落标题
- 保留纯正文分段，以适配更自然的叙事型内容

此外，项目已支持对单条作品进行图片焦点微调：

- `modal_object_position`：控制弹窗主图裁切焦点
- `card_object_position`：控制画廊卡片裁切焦点

这使得个别图片可以单独修正展示效果，而无需通过全局样式影响全部作品。

---

## 已完成的关键更新

### 1. 三语故事内容已补齐

当前 `storieslanguage.json` 已覆盖所有作品的三语内容，支持：

- 英文 `en`
- 中文 `zh`
- 日文 `ja`

画廊卡片与弹窗均通过统一逻辑读取本地化字段，当前内容校验结果为：

- `Errors: 0`
- `Warnings: 0`

这意味着当前多语言内容在现有规则下已经完整可用。

### 2. 导航与页面结构更新

当前顶部导航已调整为：

- `Artists`
- `Gallery`
- `Price`
- `Booking`
- `Studio`

同时，页面已新增 `#price` 锚点 section，并将其放置于 `#gallery` 与 `#booking` 之间，使用户在浏览作品后，可以更自然地进入价格认知与预约决策。

### 3. Price 区块已上线

当前价格区块采用简洁说明式结构，已正式接入页面，并支持三语切换。

当前使用的 Version A 价格结构为：

- `5cm` 以内：`20,000 日元`
- `10cm` 以内：`40,000 日元`
- 超过 `10cm`：另行沟通报价

相关文案已写入 `data/i18n.json`，导航中的 `nav_price` 也已接入三语切换。

### 4. 图片裁切可维护性增强

项目已为部分需要视觉微调的作品加入可选焦点字段，避免通过统一 CSS 改动误伤全部内容。

当前已使用的作品包括：

- `be-yourself`：`modal_object_position`
- `swallows-introspective-life-stream`：`modal_object_position`
- `i-love-you-and-you-tamed-me`：`card_object_position`

### 5. 渲染逻辑注释与维护性增强

当前 `renderGallery()`、`renderModal()` 以及筛选/初始化相关逻辑已补充中文注释，整体已更适合后续继续做内容型维护，而不是重新回到“把内容直接写死在页面里”的模式。

---

## 当前状态与注意事项

### 当前校验状态

运行 `node validate-content.mjs` 的结果为：

- `Errors: 0`
- `Warnings: 0`

这说明当前项目满足以下条件：

- i18n key 完整
- 图片路径有效
- `stories` / `storieslanguage` 结构一致
- 三语数据在现行规则下已全部通过校验

### 当前仍需注意的点

虽然当前结构已较稳定，但后续维护仍需注意：

- `storieslanguage.json` 文案量较大，手工改动时要避免 JSON 格式错误
- 多语言 key 需要严格保持一致
- 正文中的空行分段不应被误删
- `stories.json` 当前已是结构层文件，不应再放回 `title / tag / hook / content`
- 图片焦点字段应坚持“单条作品微调”原则，不宜演变为大量样式分叉

---

## 当前页脚状态与待办

当前页脚的社媒与联系入口已完成第一轮接线：

- `Instagram`
- `TikTok`
- `Contact`
- 邮箱：`ninitattooing@gmail.com`

当前仍保留为后续待办的入口：

- `Privacy`
- `Terms`

当前状态如下：

- `Instagram`：已接入真实账号主页
- `TikTok`：已接入真实账号主页
- `Contact`：已改为联系入口，内含 Instagram / TikTok / 邮箱
- `Privacy`：暂未接入真实目标
- `Terms`：暂未接入真实目标

当前影响评估：

- 视觉层面：页脚结构更完整，社媒与联系路径更清晰
- 交互层面：用户现在可以直接进入 Instagram / TikTok，或通过 Contact 找到邮箱
- 上线层面：核心社媒与联系入口已经可用，剩余主要是合规页面补齐

建议策略：

- 短期：保持当前社媒/联系入口方案，优先准备 `Privacy` / `Terms`
- 中期：在正式公开推广前补齐合规页面
- 保守方案：若短期不准备补齐，可临时隐藏 `Privacy` / `Terms`，降低占位感

---

## 当前正确的新增作品方式

### 第一步：在 `data/stories.json` 追加结构项

```json
{
  "id": "new-story-id",
  "category": "life",
  "featured": false,
  "img": "image/Life/xxx.jpg"
}
```

可选字段：

- `modal_object_position`
- `card_object_position`

### 第二步：在 `data/storieslanguage.json` 追加同 `id` 的三语内容

```json
"new-story-id": {
  "title": { "en": "", "zh": "", "ja": "" },
  "tag": { "en": "", "zh": "", "ja": "" },
  "hook": { "en": "", "zh": "", "ja": "" },
  "content": { "en": "", "zh": "", "ja": "" }
}
```

### 第三步：批量改动后运行校验

每次批量增删改作品内容后，运行：

- `node validate-content.mjs`

目标是保持：

- `Errors: 0`
- `Warnings: 0`

---

## 内容策划参考模板

以下内容保留为“内容写作参考”，用于后续继续撰写作品故事。需要注意：这些模块不是当前前端的字段结构，而是可用于组织叙事思路的策划模板。当前前端实际只使用 `content` 字段承载正文，并按空行自动分段显示。

建议的作品故事写作模块如下：

- 标题（Title）
- 引子（Hook）
- 创作背景
- 象征意义
- 客户故事或情感共鸣
- 技法说明
- 护理提示
- CTA（号召性用语）

适合的语气方向：

- 温暖
- 真诚
- 克制
- 有画面感
- 避免过度营销化表达

内容长度建议：

- `title`：短而有记忆点
- `hook`：一句能抓住情绪或故事入口的话
- `content`：以 2 至 4 段为宜，每段聚焦一个角度

适合放入 `content` 的信息包括：

- 设计灵感来源
- 图像元素象征意义
- 客户与图案的关系
- 纹身完成后的心理感受
- 风格与技法的简短说明

---

## 页面与内容运营建议

### 内容层面

当前项目已经具备稳定的数据驱动基础，后续更值得投入的是内容质量，而不是重复做结构改造。建议持续补充：

- 更完整的真实作品数量
- 更成熟的三语故事表达
- 更统一的标签命名风格
- 更有辨识度的封面图裁切

### 页面层面

当前页面主结构已可用，后续优化重点建议放在：

- 保持 Price 文案简洁但更贴近日式工作室语气
- 继续提升移动端阅读节奏
- 视情况补充更明确的 CTA 位置
- 控制正文长度，确保弹窗阅读负担不过重

### 上线前基础项

在正式公开推广前，建议补充：

- `sitemap.xml`
- `robots.txt`
- Open Graph 标签
- `Privacy`
- `Terms`

这些并不改变当前核心功能，但会影响搜索表现、合规完整度与品牌可信度。

---

## 社交媒体与 SEO 参考

以下内容保留为后续运营参考，不代表当前项目尚未落地。

### 社媒内容方向建议

适合继续围绕每件作品输出以下类型内容：

- 作品完成图 + 简短故事摘要
- 设计灵感来源
- 局部细节展示
- 预约前沟通片段
- 客户故事关键词提炼

适合的社媒文案结构：

1. 情绪切入
2. 作品亮点
3. 一句简短故事
4. 行动引导

示例方向：

- “这不是一张图，而是一段被留在皮肤上的记忆。”
- “A tattoo can be more than an image. It can be a promise, a memory, or a quiet way to keep someone close.”

### SEO 关键词方向建议

中英关键词可围绕以下方向逐步完善：

- 东京纹身
- 东京纹身店
- 定制纹身
- 日式纹身工作室
- Tokyo tattoo studio
- Custom tattoo Tokyo
- Tattoo artist in Tokyo
- Meaningful tattoo story

同时建议确保：

- 图片具有描述性 `alt`
- 页面标题与描述包含品牌 + 地域 + 服务关键词
- 后续 OG 标签与分享图统一品牌语气

---

## 当前项目结构（实际）

```text
Xin/
├── index.html
├── data/
│   ├── artists.json
│   ├── artistslanguage.json
│   ├── stories.json
│   ├── storieslanguage.json
│   ├── i18n.json
│   └── README-content-validation.md
├── image/
│   ├── Artists/
│   ├── Character/
│   ├── Life/
│   └── Other/
├── validate-content.mjs
├── dev-log1.md
├── deep-research-report.md
└── deep-research-report (1).md
```

---

## 下一步优先级建议

1. 在不改变当前 Version A 价格结构的前提下，微调 `Price` 区块语气，使其更符合日式工作室的沟通风格。
2. 按当前 `stories.json + storieslanguage.json` 模型持续补充更多真实作品与三语故事内容。
3. 在正式公开推广前补充 `sitemap.xml`、`robots.txt` 与 Open Graph 标签。
4. 视上线需要补齐 `Privacy` 与 `Terms` 的真实目标页面或站内 section。
5. 如果后续内容维护频率继续提升，可考虑增强 `validate-content.mjs`，加入格式化建议或草稿模式。

---

## 结论

NINI 当前已经从“研究阶段的作品集设想”进入“可持续维护的已实现状态”。项目当前最有价值的方向，不再是反复讨论是否要做多语言、价格区块或故事模块，而是继续围绕现有数据模型提升内容质量、扩充真实作品、完善上线基础设施，并让整个站点逐步从“可展示”走向“可转化、可持续运营”。

本报告后续应继续作为“现状同步 + 内容运营参考”文档使用；若再出现结构调整、字段变化或上线策略更新，应优先以 `dev-log1.md` 的最新记录为准，并同步更新本报告的“当前真实实现”部分。
