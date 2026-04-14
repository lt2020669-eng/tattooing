# 内容校验说明

本项目内置了一个内容校验脚本，用于检查文案与作品数据是否完整、规范：

- 脚本文件：`validate-content.mjs`
- 在项目根目录运行：

```bash
node validate-content.mjs
```

## 校验范围

- `data/i18n.json`
  - 必须是 JSON 对象
  - `index.html` 中引用的每个 i18n key 都必须存在
  - 每个必需 key 必须包含非空的 `en`、`zh`、`ja` 翻译
  - 对未被引用的 i18n key 给出警告（warning）

- `data/stories.json`
  - 必须是 JSON 数组
  - 每条 story 必须包含以下必填字段：
    - `title`、`tag`、`category`、`featured`、`img`、`hook`、`content`
  - `category` 必须是非空字符串，且仅允许：
    - `character`
    - `life`
    - `other`
  - `featured` 必须是布尔值（`true` / `false`）
  - `img` 字段校验规则：
    - 本地路径：文件必须存在
    - 远程 URL：仅提示警告（不会主动请求远程链接判断是否可访问）
  - 文本字段支持两种格式：
    - 单字符串（会提示 warning：当前为单语言内容）
    - 翻译对象（必须包含 `en`、`zh`、`ja`）

## 退出码说明

- `0`：未发现错误（errors）
- `1`：发现至少一个错误（errors）
