# NINI 开发日志

> 品牌：NINI | Fine-Line & Botanical Tattoo Studio in Tokyo  
> 技术栈：单页 HTML + Tailwind CDN + 原生 JS  
> 最后更新：2026-04-13

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
- **工作流**：`.github/workflows/deploy-pages.yml`（push 到 `main` 时自动部署）  
- **上线地址**（部署成功后）：https://lt2020669-eng.github.io/tattooing/

**首次需在 GitHub 开启 Pages 源为 Actions**

1. 打开：https://github.com/lt2020669-eng/tattooing/settings/pages  
2. **Build and deployment** → **Source** 选 **GitHub Actions**  
3. 打开 **Actions** 标签页，确认工作流 **Deploy static site to GitHub Pages** 已成功跑完（绿勾）  
4. 若几分钟内站点未更新，在 Actions 里可手动 **Re-run** 一次

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
