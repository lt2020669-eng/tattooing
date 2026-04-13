# 执行摘要  
本指南面向初级工程师和非技术纹身师，介绍如何将已完成的Stitch原型通过Cursor生成React/Next.js代码，构建响应式多语言网站，并集成预约系统与Qclaw(OpenClaw/Lobster)自动化。前提假设：Stitch已设计完成原型、工程师可使用Cursor，无特定后端限制。指南分阶段详细说明：导出设计、初始化项目、前端框架配置、样式与响应式、图片和SEO优化、多语言实现、预约集成、部署、以及自动化脚本示例。每步附命令行示例、代码片段、文件结构建议、常见问题和排查技巧，并在适当位置给出中英文可复制文案和CTA。最后附开发时间表和成本估算。此文结合官方文档与最佳实践，帮助快速落地项目。

## 前提假设  
- **Stitch原型已完成**：所有页面设计在Stitch中实现并可导出代码或Figma资源。  
- **使用Cursor**：团队已有Cursor账户，习惯使用“Copy as Code”或导入Figma设计。  
- **无后端偏好**：默认使用无服务器架构，可部署在Vercel/Netlify或普通主机。  
- **工具准备**：已安装最新 Node.js (建议22+【60†L169-L175】)、npm/Yarn；拥有Calendly、Typeform等账号；已申请OpenClaw/Lobster所需API Key。  

## 操作流程概览  
1. **导出设计**：在Stitch中使用“Copy as Code”或“导出到Figma”，获取可用的HTML/CSS框架代码或Figma文件。  
2. **建立项目**：用 `npx create-next-app mysite` 创建Next.js项目，或自定义React脚手架。示例：`npm init next-app mysite --use-npm`。  
3. **前端框架配置**：安装必要依赖并设置项目结构（常见结构示例见下表）。配置`next.config.js`开启图片优化和国际化选项。  
4. **样式与响应式**：将Stitch导出的CSS/样式迁移到项目中。可采用CSS模块或Tailwind等工具。确保移动优先：使用Flex/Grid实现流式布局，测试不同分辨率。  
5. **图片与SEO优化**：使用Next.js的`<Image>`组件优化图片。为每页添加`<Head>`设置标题、Meta描述和Meta标签（如`robots`）。使用描述性`alt`属性（如“樱花纹身”）提升SEO【46†L169-L175】。  
6. **多语言支持**：提供两种方案：  
   - **Weglot插件**：注册Weglot，获取API Key。在`_app.js`或自定义`_document.js`中插入Weglot JavaScript代码片段，即可自动翻译页面【22†L130-L134】。优点：快速无代码，缺点免费版有翻译上限。部署时确保API Key已配置。  
   - **本地i18n**：使用`next-i18next`或`react-i18next`。示例`next-i18next.config.js`：  
     ```js
     module.exports = {
       i18n: {
         locales: ['en','zh'],
         defaultLocale: 'en',
       },
     };
     ```  
     在`pages/_app.js`中初始化i18n，内容文件放在`public/locales/{en,zh}/`，路由保持如 `/about` 和 `/zh/about`。在页面`<Head>`中手动添加hreflang：  
     ```jsx
     <Head>
       <link rel="alternate" hrefLang="en" href="https://site.com/about" />
       <link rel="alternate" hrefLang="zh" href="https://site.com/zh/about" />
     </Head>
     ```  
     本地方案控制更多，需编写翻译json文件并管理。  
7. **预约系统集成**：  
   - **Calendly嵌入**：在页面合适位置插入Calendly提供的嵌入代码。例如：  
     ```html
     <div class="calendly-inline-widget" data-url="https://calendly.com/YourUsername?background_color=ffffff&text_color=000000"></div>
     <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>
     ```  
     按照Calendly帮助文档操作，复制生成的代码【64†L469-L477】。   
   - **Typeform嵌入**：在页面中放置Typeform嵌入代码，例如标准嵌入：  
     ```html
     <div class="typeform-widget" data-url="https://yourform.typeform.com/to/XYZ" style="width:100%;height:500px;"></div>
     <script> (function(){ var qs,js,q,s,d=document; qs='https://embed.typeform.com/'; js=d.createElement('script'); js.src=qs+'embed.js'; d.head.appendChild(js);} )(); </script>
     ```  
     编辑你的Typeform表单，点击“Share->Embed”获取代码。注意只能在HTTPS站点嵌入【66†L89-L91】。  
   - **接收预约通知**：使用Netlify Functions或Vercel Serverless编写Webhook。示例(Netlify):  
     ```js
     // netlify/functions/notify.js
     const axios = require('axios');
     exports.handler = async (event) => {
       const data = JSON.parse(event.body);
       // data来自Calendly/Typeform的Webhook调用
       await axios.post("https://api.sendgrid.com/v3/mail/send", { /* 邮件参数 */ },{
         headers: { Authorization: `Bearer ${process.env.SENDGRID_KEY}` }
       });
       return { statusCode: 200, body: 'OK' };
     };
     ```  
     配置Calendly/Typeform后台，将Webhook指向上述函数URL。可用Twilio发送SMS（需替换SendGrid示例）。  
8. **部署与Host**：选择Vercel、Netlify或自建服务器。示例Vercel部署：在项目根运行 `vercel`，跟随向导设置域名。确保环境变量（如SENDGRID_KEY、WEGLOT_KEY等）在平台已配置。  

```mermaid
flowchart LR
    Stitch[Stitch 原型] --> Cursor[Cursor 转换代码]
    Cursor --> Next[Next.js 项目]
    Next --> Style[样式/响应式]
    Next --> Images[图片/SEO]
    Next --> Lang[多语言 (Weglot/i18n)]
    Next --> Booking[嵌入预约系统]
    Next --> Deploy[部署 (Vercel/Netlify)]
    Deploy --> Qclaw[Qclaw(OpenClaw) 自动化]
```  

## Cursor 使用指南  
- **导入设计**：将Stitch生成的HTML/CSS“Copy as Code”粘贴到Cursor新建项目中，或使用“Copy to Figma”后在Cursor导入Figma文件。  
- **生成组件**：在Cursor内询问AI “Generate React components from this design”并提供页面结构提示。如 `"Generate a responsive Next.js component from this Figma page"`.  
- **代码审核**：AI生成后，使用Cursor审查功能检查可访问性、语义标签等问题。示例Prompt：`"Review this JSX code for potential issues: (粘贴代码)".` 审查清单应包括：检查className拼写、缺失key、多语言文本替换点等。  
- **修正流程**：对出现问题的组件，使用Cursor做小段落修改，如`"Change this <div> to a <header> with role='banner'"`。  

## 工具与依赖  
- **Node.js**：推荐22以上版本【60†L169-L175】。验证：`node --version`。  
- **包管理器**：npm或Yarn均可。  
- **关键库**：  
  - `next`、`react`、`react-dom` (初始化项目时自动安装)。  
  - `axios` (HTTP请求)。  
  - `i18next` + `react-i18next` 或 `next-i18next` (本地化支持)。  
  - `weglot` (若使用Weglot，通常通过JS snippet而非npm)。  
  - 可选：UI库如Ant Design、Tailwind CSS（根据需要）。  
- **安装示例**：  
  ```bash
  npm install next react react-dom axios i18next react-i18next next-i18next
  ```  
- **环境变量**：`.env.local` 文件中配置：  
  ```
  SENDGRID_KEY=xxx
  WEGLOT_KEY=xxx
  OPENCLAW_KEY=xxx
  ```
  注意在Vercel/Netlify控制面板同步这些变量。

## 常见错误与排查  
- **构建失败**：检查`next.config.js`语法，删除Stitch导出的多余`!important`规则。  
- **样式冲突**：若样式乱掉，确认CSS作用域，尽量使用CSS模块或Scoped CSS。  
- **移动端显示问题**：使用Chrome DevTools模拟各种设备，确保meta viewport存在。  
- **多语言路由404**：确认`next.config.js`和`pages/`目录语言文件对应；运行 `next build` 观察输出错误信息。  
- **预约代码不加载**：确保页面为HTTPS，Calendly/Typeform脚本必须在安全上下文加载【66†L89-L91】。  
- **自动化执行失败**：检查Node版本及OpenClaw服务是否在运行；查看日志确认API连接正常。

## 测试与上线检查  
- **功能测试**：逐个点击所有页面和按钮，验证多语言切换、预约弹窗、表单提交等功能是否正常。  
- **跨浏览器测试**：在Chrome、Safari、Firefox手机/PC上测试网站兼容性。  
- **移动端测试**：确保页面在常见手机屏幕上无横向滚动，按钮可点击。  
- **SEO检查**：使用Lighthouse检查Meta标签、标题、描述是否有效；生成并提交sitemap.xml到搜索引擎。  
- **性能分析**：使用Lighthouse检查加载速度和资源大小，对大图片启用懒加载（`loading="lazy"`）。  
- **可访问性**：使用Lighthouse Accessibility审计，确保alt文本完整、对比度足够、表单标签关联正确。  
- **隐私合规**：如面向欧美用户，确保符合GDPR，弹窗收集cookie需用户同意。

## 时间与成本估算  

| 阶段        | 时间 (周)  | 主要任务                           |
|-----------|---------|---------------------------------|
| MVP 开发     | 1–2周    | 验证设计导出、基本页面搭建、多语言框架 |
| 功能完善     | 3–6周    | 添加完整预约系统、自动化脚本、安全优化   |

- **托管费用**：Vercel/Netlify 基本免费计划足够开发测试，升级团队计划约$20/月。  
- **WeGlot**：免费版5000词限制，可先用免费；专业版约€9/月（支持多语言）。  
- **Calendly**：基础免费；付费版约$12/月可使用更多功能。  
- **Typeform**：免费有问题数量限制；专业版约$24/月。  
- **Cursor**：个人版约$20/月【50†L46-L54】。  
- **域名**：$10–15/年（根据注册商）。  

## 可复制文案片段与CTA示例  
- 中文预约CTA：`“立即预约纹身”` / 英文 `“Book Your Tattoo Now”`。  
- 英文网站页脚示例：`“Contact us for custom designs and bookings.”`  
- 社媒摘要示例：`“Introducing our new custom tattoo design: a cherry blossom warrior—symbolizing love and courage. Want to get your own meaningful tattoo? Click to book!”`  

## 下一步行动清单  
1. **完成Stitch导出**并在Cursor中初始化项目，验证组件生成。  
2. **配置Next.js环境**：安装依赖、设置i18n配置、测试多语言页面。  
3. **集成预约代码**：获取Calendly/Typeform嵌入代码，嵌入网站并测试。  
4. **部署网站**到Vercel/Netlify，配置环境变量并运行测试。  
5. **设置OpenClaw自动化**：部署OpenClaw Agent，编写示例脚本，实现至少一个自动化任务（如关注#TokyoTattoo）。