# NINI 开发日志（现状版）

> 品牌：NINI | Tattoo Studio in Tokyo  
> 技术栈：单页 `index.html` + Tailwind CDN + 原生 JS + JSON 数据源  
> 最后更新：2026-04-14

---

## 本次已确认架构

### 内容与配置拆分（已完成）

- 画廊数据已从页面内联迁移到 `data/stories.json`
- 多语言词典已从页面内联迁移到 `data/i18n.json`
- 页面初始化顺序：先加载 `i18n`，再加载 `stories`，再渲染 UI

### 画廊模型（当前）

- 分类固定三类（内部值）：
  - `character`
  - `life`
  - `other`
- 筛选栏文案通过 i18n 映射：
  - `filter_character`
  - `filter_life`
  - `filter_other`
- `stories` 单条结构（当前实际使用）：
  - `title`
  - `tag`
  - `category`
  - `featured`
  - `img`
  - `hook`
  - `content`

### 弹窗内容模型（已改）

- 旧模型 `background/symbolism/technique` 已并为单字段 `content`
- 弹窗中 `content` 会按空行自动分段显示
- 已取消段落图标与段落标题（纯正文分段）

---

## 本轮主要变更记录

### 1) SEO 与 Hero 文案

- `meta description` 已改为精简版品牌表达
- Hero 区新增长文故事段（由 i18n 控制）

### 2) 分类体系迁移

- 旧分类（`botanical/geometric/celestial`）迁移到新分类体系
- 分类按钮由“首字母大写”改为 i18n 显示

### 3) 数据源扩展

- 已批量把本地素材写入 `data/stories.json`
  - `image/Life/*`
  - `image/Character/*`
  - `image/Other/*`
- 当前很多条目采用“先占位后补文案”的方式（`title/hook/content` 部分为空）

### 4) 校验器建设

- 新增 `validate-content.mjs`
- 覆盖校验：
  - `i18n` key 完整性
  - `stories` 字段完整性
  - 分类合法性（仅允许 `character/life/other`）
  - 图片路径存在性（本地）
- 使用说明：`README-content-validation.md`

---

## 当前状态与注意事项

### 当前存在的“预期中”报错

- 因为大量作品条目仍是占位状态，校验器会报：
  - `title/hook/content` 为空
- 这是当前“先挂图后填文案”流程的自然结果，不是程序异常

### 已知风险

- 数据条目较多且手工录入，容易出现重复/空值/路径拼写问题
- 目前故事文本多为英文单语，切换到中文/日文时正文不会自动本地化

---

## 当前正确的“新增作品”方式

在 `data/stories.json` 追加对象（不要再改 `index.html` 里的内联数据）：

```json
{
  "title": "",
  "tag": "Life",
  "category": "life",
  "featured": false,
  "img": "image/Life/xxx.jpg",
  "hook": "",
  "content": ""
}
```

可选规则建议：

- 先占位：只填 `img/tag/category/featured`
- 后补文案：再完善 `title/hook/content`
- 每次批量改动后运行：
  - `node validate-content.mjs`

---

## 当前项目结构（实际）

```text
Xin/
├── index.html
├── data/
│   ├── stories.json
│   ├── i18n.json
│   
├── image/
│   ├── Artists/
│   ├── Character/
│   ├── Life/
│   └── Other/
├── validate-content.mjs
├── dev-log1.md
├── deep-research-report.md
└── deep-research-report (1).md
└── README-content-validation.md
```

---

## 下一步建议（按优先级）

1. 批量补全空条目的 `title/hook/content`（至少先补 `hook`）
2. 给 `stories` 增加唯一 `id`（后续维护、排序、去重更稳）
3. 校验器增加“草稿模式”开关（允许空字段但给 warning）
4. 再推进三语故事正文（`content` 改为 `{en,zh,ja}`）
# NINI 开发日志

> 品牌：NINI | Fine-Line & Botanical Tattoo Studio in Tokyo  
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
| `<title>` | → `NINI \| Fine-Line & Botanical Tattoo Studio in Tokyo` |
| meta description | 新增，内容：NINI is a boutique tattoo studio in Tokyo... |

### 第一阶段 1.2：画廊内容填充 ✅

- 3 张画廊图片加上 **Hover Overlay**（标题 + 风格标签 + 引子 + View Story）
- 新增 **Story Modal 弹窗**（点击作品后弹出）
- 为 3 张图撰写了匹配的 **英文故事**（背景 / 象征 / 技法）

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
| 9 | **未部署** | 目前仅本地文件 | 部署到 Vercel / Netlify / GitHub Pages |
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
| **3.1** | **真实图片替换** | 建 images/ 文件夹，替换占位图 | ⬜ 待做 |
| **3.2** | **部署上线** | GitHub Pages（代码已 push；见上文首次开启 Pages） | ✅ 已 push |
| **3.3** | **SEO 完善** | sitemap + robots.txt + OG 标签 | ⬜ 待做 |
| **3.4** | **数据分析** | 接入 GA4 | ⬜ 待做 |
