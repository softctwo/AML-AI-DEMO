# AML Sentinel AI (智能反洗钱监测系统)

**Next-Generation Anti-Money Laundering Reporting System featuring AI-driven Analysis.**

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Tailwind%20%7C%20Gemini%20AI-green)

## 📖 项目简介

**AML Sentinel AI** 是一款面向现代银行业的智能反洗钱（AML）合规管理系统原型。它集成了传统规则引擎与生成式 AI（Google Gemini）能力，旨在提升合规人员在反洗钱监测、分析、尽职调查及监管报送环节的效率。

系统严格对标中国人民银行（PBOC）及国际反洗钱监管标准（FATF），涵盖了从客户准入、风险评级、交易监测到可疑交易报告（STR）生成的全流程闭环。

## 🚀 核心功能

### 1. 🧠 AI 智能研判 (AI-Driven Analysis)
*   **智能甄别**：集成 Google Gemini 2.5 Flash 模型，对触发预警的交易进行深度分析。
*   **自动生成报告**：AI 自动撰写符合监管要求的《可疑交易甄别分析报告》及报送理由。
*   **人机协同**：支持人工反馈（Feedback loop），持续优化 AI 模型准确度。

### 2. 📊 全景驾驶舱 (Dashboard)
*   实时监控全行合规运营健康度。
*   可视化展示待处置预警、尽调任务堆积、高风险客户占比及合规自检得分。

### 3. 🔍 客户尽职调查 (CDD/KYC)
*   **看板管理**：基于 Kanban 的尽调任务流转（新建 -> 尽调中 -> 待审批 -> 归档）。
*   **自动化检查**：集成 OCR、人脸识别、制裁名单筛查等模拟接口状态。
*   **风险评分**：动态计算客户风险分值，支持增强尽职调查（EDD）流程。

### 4. 🕸️ 受益所有人管理 (UBO)
*   **股权穿透图谱**：可视化展示多层级股权结构，自动识别最终受益人（UBO）。
*   **核实管理**：管理受益人身份信息核实状态及证件有效期。

### 5. 🚨 监测模型与预警 (Transaction Monitoring)
*   **双引擎监测**：支持“大额交易（LCTR）”与“可疑交易（STR）”监测。
*   **模型配置**：低代码配置监测规则（如：快进快出、频繁跨境、夜间涉赌等），支持参数回测。

### 6. 📋 智能名单筛查 (Screening)
*   集成制裁名单（Sanctions）、政治公众人物（PEP）、负面媒体（Adverse Media）筛查。
*   支持模糊匹配与持续监控名单管理。

### 7. 📝 监管报送 (Regulatory Reporting)
*   自动生成符合监管标准的 XML 报文。
*   模拟反洗钱中心回执反馈（通过/驳回/错误）。

### 8. 🛡️ 风险评级 (Risk Rating)
*   自定义评分因子（地域、行业、产品等）与权重配置。
*   记录评级变更历史轨迹。

### 9. ✅ 现场检查自检 (Self-Inspection)
*   内置合规自查清单（内控制度、KYC、资料保存等）。
*   **300号文接口**：模拟生成银发〔2017〕300号文要求的标准数据提取接口（XML/Excel）。

## 🛠️ 技术栈

*   **前端框架**: React 19 (TypeScript)
*   **样式库**: Tailwind CSS
*   **图标库**: Lucide React
*   **图表库**: Recharts
*   **AI SDK**: Google GenAI SDK (`@google/genai`)
*   **Markdown 渲染**: React Markdown

## 💻 安装与运行

### 前置要求
*   Node.js (v18+)
*   Google Gemini API Key (用于 AI 功能)

### 步骤

1.  **获取代码**
    ```bash
    git clone https://github.com/your-repo/aml-sentinel-ai.git
    cd aml-sentinel-ai
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    在项目根目录创建 `.env` 文件或设置环境变量：
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *(注意：在演示环境中，API Key 通常通过构建工具注入 `process.env`)*

4.  **启动开发服务器**
    ```bash
    npm start
    # 或
    npm run dev
    ```

5.  **访问系统**
    打开浏览器访问 `http://localhost:3000`

## 📂 项目结构

```
src/
├── components/          # 业务组件模块
│   ├── AnalysisPanel.tsx    # AI 分析面板
│   ├── CddModule.tsx        # 尽职调查模块
│   ├── BeneficialOwnerModule.tsx # UBO 模块
│   ├── ScreeningModule.tsx  # 名单筛查模块
│   ├── Sidebar.tsx          # 侧边导航
│   └── ...
├── services/            # 服务层
│   └── geminiService.ts     # Google Gemini API 封装
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 模拟数据 (Mock Data)
├── App.tsx              # 主应用入口与路由逻辑
└── index.tsx            # 渲染入口
```

## ⚠️ 免责声明

本项目为 **概念验证 (PoC) 原型**，仅用于演示 AI 在反洗钱领域的应用场景。
*   系统中的客户数据、交易记录均为虚构的模拟数据。
*   生成的法律文书、监管报文仅供参考，不具备实际法律效力。
*   实际生产部署需对接真实的银行核心系统、黑名单数据库及监管报送专线。

## 📄 License

MIT License
