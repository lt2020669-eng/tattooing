# NINI 开发日志（现状版）

> 品牌：NINI | Tattoo Studio in Tokyo  
> 技术栈：单页 `index.html` + Tailwind CDN + 原生 JS + JSON 数据源  
> 最后更新：2026-04-14

---

## 当前真实架构

### 内容与配置拆分（已完成）

- 页面框架文案：`data/i18n.json`
- 作品结构数据：`data/stories.json`
- 作品三语内容：`data/storieslanguage.json`
- 页面初始化顺序：
  - 先加载 `i18n`
  - 再加载 `stories`
  - 再加载 `storieslanguage`
  - 最后渲染导航、筛选、画廊与弹窗

### 画廊数据模型（当前实际使用）

- 分类固定三类（内部值）：
  - `character`
  - `life`
  - `other`
- `data/stories.json` 单条结构：
  - `id`
  - `category`
  - `featured`
  - `img`
  - `modal_object_position`（可选）
  - `card_object_position`（可选）
- `data/storieslanguage.json` 单条结构：
  - `title.{en,zh,ja}`
  - `tag.{en,zh,ja}`
  - `hook.{en,zh,ja}`
  - `content.{en,zh,ja}`

### 弹窗与图片显示模型（当前）

- 旧模型 `background/symbolism/technique` 已并为单字段 `content`
- 弹窗正文按空行自动分段显示
- 已取消自动段落图标与段落标题，保留纯正文分段
- 支持单条作品图片焦点微调：
  - `modal_object_position`：控制弹窗主图裁切焦点
  - `card_object_position`：控制画廊卡片主图裁切焦点

---

## 最近已完成的关键更新

### 1) 三语故事内容已补齐

- `storieslanguage.json` 已覆盖所有作品的 `title/tag/hook/content`
- 当前支持：
  - 英文 `en`
  - 中文 `zh`
  - 日文 `ja`
- 画廊卡片与弹窗均通过 `getLocalizedStoryField()` 读取三语内容
- 当前内容校验结果：
  - `Errors: 0`
  - `Warnings: 0`

### 2) 导航与页面结构更新

- 顶部导航已调整为：
  - `Artists`
  - `Gallery`
  - `Price`
  - `Booking`
  - `Studio`
- 已新增 `#price` 锚点 section
- `#price` 放置在 `#gallery` 与 `#booking` 之间，更符合用户决策路径

### 3) Price 区块（已上线）

- 已新增简洁说明式价格区块
- 当前采用 Version A 结构：
  - `5cm` 以内：`20,000 日元`
  - `10cm` 以内：`40,000 日元`
  - 超过 `10cm`：另行沟通报价
- `Price` 区块文案已写入 `data/i18n.json`
- 导航 `nav_price` 已接入三语切换

### 4) 图片裁切可维护性增强

- 为个别需要微调的图片引入可选焦点字段，避免全局改样式影响全部作品
- 当前已使用：
  - `be-yourself`：`modal_object_position`
  - `swallows-introspective-life-stream`：`modal_object_position`
  - `i-love-you-and-you-tamed-me`：`card_object_position`

### 5) 注释与可维护性补充

- `renderGallery()` 关键逻辑已补充中文注释
- `renderModal()` 及筛选/初始化相关逻辑已补充中文注释
- 当前更适合后续继续做内容型维护，而不是再把数据写回页面内联

---

## 当前状态与注意事项

### 当前校验状态

- `node validate-content.mjs` 当前结果为：
  - `Errors: 0`
  - `Warnings: 0`
- 说明当前：
  - i18n key 完整
  - 图片路径有效
  - `stories` / `storieslanguage` 结构一致
  - 三语数据在当前规则下已全部通过

### 当前仍需注意的点

- `storieslanguage.json` 中文案量较大，后续继续维护时要避免手工修改导致：
  - JSON 格式错误
  - 多语言 key 不一致
  - 段落换行被误删
- `stories.json` 目前已是“结构层”文件，不应再把 `title/tag/hook/content` 放回这里
- 图片焦点字段应按“单条作品微调”的原则使用，避免演变成大量全局样式分叉

### 页脚占位链接待办（项目管理清单）

当前页脚的社媒与联系入口已完成首轮接线：

- `Instagram`
- `TikTok`
- `Contact`
- `邮箱：ninitattooing@gmail.com`

当前仍保留为后续待办的入口：

- `Privacy`
- `Terms`

当前页脚状态如下：

- `Instagram`：已接入真实账号主页
- `TikTok`：已接入真实账号主页
- `Contact`：已改为联系入口，内含 Instagram / TikTok / 邮箱
- `Privacy`：暂未接入真实目标
- `Terms`：暂未接入真实目标

#### 待办项

- `Done`：`Instagram` 已接入真实社媒主页链接
- `Done`：`TikTok` 已接入真实社媒主页链接
- `Done`：`Contact` 已升级为联系入口，聚合 Instagram / TikTok / 邮箱
- `P2`：补充 `Privacy` 的真实目标
  - 可选：独立 `privacy.html`
  - 可选：站内独立 section
- `P2`：补充 `Terms` 的真实目标
  - 可选：独立 `terms.html`
  - 可选：站内独立 section

#### 当前影响评估

- 视觉层面：页脚结构更完整，社媒与联系路径更清晰
- 交互层面：用户现在可以直接进入 Instagram / TikTok，或通过 Contact 找到邮箱
- 上线层面：核心社媒与联系入口已经具备可用性，剩余主要是合规页面补齐

#### 处理策略建议

- 短期策略：保持当前社媒/联系入口方案，优先准备 `Privacy` / `Terms`
- 中期策略：在正式公开推广前补齐合规页面
- 保守策略：如果短期仍不准备补这些页面，可暂时隐藏 `Privacy` / `Terms`，减少占位感

---

## 当前正确的“新增作品”方式

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
  "tag": { "en": "Life", "zh": "生活", "ja": "ライフ" },
  "hook": { "en": "", "zh": "", "ja": "" },
  "content": { "en": "", "zh": "", "ja": "" }
}
```

### 第三步：每次批量改动后运行

- `node validate-content.mjs`

---

## 当前项目结构（实际）

```text
Xin/
├── index.html
├── data/
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

## 下一步建议（当前优先级）

1. 把 `Price` 区块如有需要进一步微调为更接近日式工作室语气，但保持 Version A 价格结构不变
2. 继续补充更多真实作品与故事，沿用 `stories.json + storieslanguage.json` 模型
3. 视上线需要补充 `sitemap.xml`、`robots.txt`、OG 标签
4. 如后续内容维护频率继续提高，可考虑把校验器增加“格式化建议”或“草稿模式”

---

## 历史阶段日志（保留归档）

# NINI 开发日志

> 品牌：NINI | Tattoo Studio in Tokyo  
> 技术栈：单页 HTML + Tailwind CDN + 原生 JS  
> 最后更新：2026-04-14

---

## 已完成的工作

### 第一阶段 1.1：基础修复 ✅

| 项目 | 改动 |
|------|------|
| 品牌名 | Komorebi Atelier → **NINI**（全文 5 处） |
| 重复资源 | Material Symbols `<link>` 写了两次，删除重复 |
| 图片 alt | `data-alt` → `alt`（6 处），修复 SEO 和无障碍 |

### 第一阶段 1.2：画廊内容填充 ✅

- 3 张画廊图片加上 **Hover Overlay**（标题 + 风格标签 + 引子 + View Story）
- 新增 **Story Modal 弹窗**（点击作品后弹出）
- 为 3 张图撰写了匹配的 **英文故事**（content）

### 画廊架构重构 ✅

- 画廊从硬编码 HTML 重构为 **数据驱动**（JS 数组 `stories[]`）
- 新增 **筛选标签栏**（All / Botanical / Geometric / Celestial，自动从数据生成）
- 新增 **Load More 按钮 + 计数器**（默认展示 6 张，每次加载 6 张）
- Modal 新增 **Prev / Next 导航** + **键盘 ← → 支持** + **位置计数 `1/3`**
- 新增卡片 **fadeUp 入场动画**
- 响应式网格：桌面 3 列 / 平板 2 列 / 手机 1 列

### 第二阶段 2.1：多语言切换 ✅

- 建立 `i18n` 翻译字典（约 30 条中英文映射）
- 所有页面框架静态文本加上 `data-i18n` 属性
- `setLang()` 函数 + 画廊/Modal 动态文本跟随语言切换
- 语言下拉菜单（EN / 中文）接上真实切换逻辑
- `localStorage` 记忆用户语言偏好
- 故事内容暂保留英文，未翻译

### 第二阶段 2.2：Calendly 预约接入 ✅

- 移除旧的静态假日历（HTML 假日历 + 假时段按钮）
- 接入 Calendly 内嵌 widget：`https://calendly.com/ninitattooing/tattoo-consultation`
- 所有 "Book Now / 立即预约" 按钮跳转至预约区
- 作品弹窗中 "Book Your Tattoo Now" 按钮关闭弹窗后滚动到预约区

### 第二阶段 2.4：导航锚点定位 ✅

- 补齐锚点 ID：`#artists`（Hero）/ `#gallery` / `#booking` / `#studio`（Locations）
- 导航链接全部从 `href="#"` 改为真实锚点
- NINI logo 点击回顶部，View Portfolio 按钮跳到 `#gallery`
- CSS `scroll-behavior: smooth` 平滑滚动
- `scroll-margin-top: 120px` 防止 fixed 导航遮挡

### P2 小修复打包 ✅

- 版权年份动态化：`© {year}` 使用 `new Date().getFullYear()` 自动更新
- Shibuya Atelier → **Shibuya Studio**（HTML + i18n 统一）
- 清理 11 条废弃 i18n 条目（旧静态日历相关：booking_month, day_sun 等）

---

## 当前存在的问题（待解决）

### P1 — 必须解决

| # | 问题 | 说明 | 建议方案 |
|---|------|------|---------|
| 1 | **图片全部是外部占位图** | 来自 `lh3.googleusercontent.com/aida-public/...`，AI 生成图，非真实作品 | 替换为真实作品照片，建 `images/` 文件夹或上传到图床 |

### P2 — 应该解决

| # | 问题 | 说明 | 建议方案 |
|---|------|------|---------|
| 5 | **暗色模式无开关** | 已配好 `dark:` 类，无切换入口（已决定跳过，不影响功能） | 后续按需添加 |
| 8 | **画廊只有 3 张作品** | 架构已就绪但内容偏少 | 持续添加作品到 `stories[]` 数组 |

### P3 — 上线前处理

| # | 问题 | 说明 | 建议方案 |
|---|------|------|---------|
| 9 | 部署 | 目前仅本地文件 | 部署到  GitHub Pages |
| 10 | **无 SEO 完善** | 缺 sitemap.xml、robots.txt、Open Graph 标签 | 上线前补齐 |
| 11 | **无数据分析** | 无法追踪访客和预约转化 | 接入 Google Analytics 4 |
| 12 | **图片未优化** | 外部图没有压缩 | 真实图片用 WebP 格式 + 压缩 |

---

## 如何添加新作品

在 `index.html` 的 `stories` 数组末尾（`];` 前）添加：

```javascript
,
{
  title: "作品名",
  tag: "显示标签，如 Watercolor · Floral",
  category: "分类key（小写英文，如 watercolor）",
  featured: true,
  img: "图片URL或本地路径如 images/xxx.jpg",
  hook: "一句引子（hover 时显示，20字内）",
  background: "创作背景（2-4句话）",
  symbolism: "象征意义（2-3句话）",
  technique: "技法说明（2-3句话）"
}
```

**会自动发生**：筛选栏出现新分类 / 网格多一张卡片 / Modal Prev/Next 更新 / 计数器更新 / 超过 6 张时 Load More 出现。

---

## 项目文件结构

```
Xin/
├── index.html                    ← 主页面（单文件，含 HTML + CSS + JS）
├── deep-research-report.md       ← 调研报告：内容策略 + 故事模板 + 社媒 + SEO
├── deep-research-report (1).md   ← 调研报告：技术实现指南（Next.js / 预约 / 部署）
├── dev-log1.md                   ← 本文件：开发日志
└── images/                       ← （待建）存放真实作品图片
```

---

## GitHub Pages 部署（2026-04-13）

- **仓库**：https://github.com/lt2020669-eng/tattooing  
- **远程**：`https://github.com/lt2020669-eng/tattooing.git`（分支 `main`）  
- **方式**：**从分支部署**（根目录静态站，无需 GitHub Actions；避免工作流权限/环境导致的失败）  
- **上线地址**：https://lt2020669-eng.github.io/tattooing/

**在 GitHub 上这样设置（约 30 秒）**

1. 打开：https://github.com/lt2020669-eng/tattooing/settings/pages  
2. **Build and deployment** → **Source** 选 **Deploy from a branch**（不要选 GitHub Actions）  
3. **Branch** 选 **main**，文件夹选 **/ (root)**，保存  
4. 等待 1～3 分钟后再访问上线地址；若仍 404，强制刷新或无痕窗口再试  

**若仍想用 Actions 部署**：仓库需 **Settings → Actions → General → Workflow permissions** 设为 **Read and write**，且 Pages 源为 GitHub Actions；静态单页站点用「从分支部署」更简单可靠。

---

## 下一步执行计划

| 阶段 | 步骤 | 内容 | 状态 |
|------|------|------|------|
| 1.1 | 基础修复 | 品牌名 + SEO + alt | ✅ 完成 |
| 1.2 | 画廊内容填充 | Hover + 故事弹窗 | ✅ 完成 |
| 1.3 | 画廊分类筛选 | Filter 标签栏 | ✅ 完成 |
| 1.4 | 作品故事弹窗 | Modal + Prev/Next | ✅ 完成 |
| 2.1 | 多语言切换 | 中/英 i18n + localStorage | ✅ 完成 |
| 2.2 | 预约接入 Calendly | 内嵌 widget | ✅ 完成 |
| 2.3 | 暗色模式切换 | — | ⏭ 跳过 |
| 2.4 | 导航锚点定位 | 锚点 + 平滑滚动 | ✅ 完成 |
| P2 | 小修复打包 | 年份 + 命名 + 清理 | ✅ 完成 |
| 3.1 | 真实图片替换 | 已切换为本地 image/ 目录素材（替换占位图） | ✅ 完成 |
| **3.2** | **部署上线** | GitHub Pages（代码已 push；见上文首次开启 Pages） | ✅ 已 push |
| **3.3** | **SEO 完善** | sitemap + robots.txt + OG 标签 | ⬜ 待做 |
| **3.4** | **数据分析** | 接入 GA4 | ⬜ 待做 |
