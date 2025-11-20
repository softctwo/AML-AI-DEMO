
# AML Sentinel AI (智能反洗钱监测系统)

**Next-Generation Anti-Money Laundering Reporting System featuring AI-driven Analysis.**

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Tailwind%20%7C%20Gemini%20AI-green)

## 📖 项目简介

**AML Sentinel AI** 是一款面向现代银行业的智能反洗钱（AML）合规管理系统原型。它打破了传统规则引擎与人工智能的界限，集成了**资金链路可视化**、**生成式 AI 助手**以及**案件全生命周期管理**功能，旨在赋能合规人员高效识别复杂的洗钱网络。

系统严格对标中国人民银行（PBOC）及国际反洗钱监管标准（FATF），涵盖了从客户准入、风险评级、交易监测、深度调查到监管报送的全流程闭环。

## 🚀 核心功能 (全新升级)

### 1. 🧠 AI 智能研判与助手 (AI-Driven Analysis & Copilot)
*   **Transaction Analysis**: 集成 Google Gemini 2.5 Flash 模型，自动撰写《可疑交易甄别分析报告》。
*   **AML Copilot (AI 合规助手)**: 全局悬浮的智能助手，随时回答法规咨询（如3号令、164号文）、起草尽调话术或解释风险模型。
*   **STR Drafting Studio (智能撰写工坊)**: AI 自动基于案件全貌（Context）撰写完整的《可疑交易报告》长文。

### 2. 🌍 全球风险态势 (Global Risk Visualization)
*   **风险热力图**: 仪表盘集成全球资金风险地图，直观展示高风险司法管辖区（如制裁国家、避税天堂）的资金流动情况。

### 3. 📈 实体风险全景时间轴 (Entity Risk Timeline)
*   **全生命周期**: 在客户详情页展示从开户、预警、评级变更到结案的所有风险事件时间线，辅助分析员快速回溯历史。

### 4. 🕸️ 资金穿透与链路图谱 (Transaction Link Analysis)
*   **可视化溯源**: 在交易详情中提供动态资金流向图。
*   **上下游穿透**: 自动展示资金来源（Upstream）与资金去向（Downstream），快速识别“分散转入集中转出”、“回路交易”等洗钱特征。
*   **风险高亮**: 用颜色区分高风险节点与异常资金路径。

### 5. 💼 统一调查案卷中心 (Case Investigation)
*   **一案一档**: 将分散的预警（Alerts）聚合为案件（Cases）进行统一管理。
*   **全景视图**: 一个案卷可关联多个可疑交易、多个实体及证据材料。
*   **生命周期管理**: 支持立案、调查、复核、结案（上报/排除）的全流程记录。

### 6. 📊 全景驾驶舱 (Dashboard)
*   实时监控全行合规运营健康度。
*   可视化展示待处置预警、尽调任务堆积、高风险客户占比及合规自检得分。

### 7. 🔍 客户尽职调查 (CDD/KYC)
*   **看板管理**: 基于 Kanban 的尽调任务流转（新建 -> 尽调中 -> 待审批 -> 归档）。
*   **自动化检查**: 集成模拟的 OCR、人脸识别、制裁名单筛查接口。
*   **风险评分**: 动态计算客户风险分值，支持增强尽职调查（EDD）流程。

### 8. 👥 受益所有人管理 (UBO)
*   **股权穿透图谱**: 可视化展示多层级股权结构，自动识别最终受益人（UBO）。
*   **核实管理**: 管理受益人身份信息核实状态及证件有效期。

### 9. 🚨 监测模型与预警 (Transaction Monitoring)
*   **双引擎监测**: 支持“大额交易（LCTR）”与“可疑交易（STR）”监测。
*   **低代码配置**: 灵活配置监测规则（如：快进快出、频繁跨境、夜间涉赌等），支持参数回测。

### 10. 📋 智能名单筛查 (Screening)
*   集成制裁名单（Sanctions）、政治公众人物（PEP）、负面媒体（Adverse Media）筛查。
*   支持模糊匹配与持续监控名单管理。

### 11. ✅ 现场检查自检 (Self-Inspection)
*   内置合规自查清单（内控制度、KYC、资料保存等）。
*   **300号文接口**: 模拟生成银发〔2017〕300号文要求的标准数据提取接口（XML/Excel）。

### 12. 📖 系统说明书 (System Guide) `NEW`
*   **功能入口**: 页面右上角“问号”图标。
*   **说明**: 内置交互式系统功能文档，支持随时查阅各模块的操作指南和业务逻辑说明。

## 🛠️ 技术栈

*   **前端框架**: React 19 (TypeScript)
*   **样式库**: Tailwind CSS
*   **图标库**: Lucide React
*   **图表与可视化**: Recharts (统计图表) / SVG (资金链路图谱/热力图)
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
├── components/              # 业务组件模块
│   ├── AnalysisPanel.tsx        # AI 分析面板
│   ├── ReportDraftingStudio.tsx # AI 撰写工坊
│   ├── RiskHeatmap.tsx          # 全球风险热力图
│   ├── CaseInvestigationModule.tsx # 调查案卷模块
│   ├── CopilotWidget.tsx        # AI 合规助手悬浮窗
│   ├── SystemGuide.tsx          # 系统说明书组件 (NEW)
│   ├── TransactionDetailModal.tsx # 包含资金链路图谱
│   ├── CddModule.tsx            # 尽职调查模块
│   ├── BeneficialOwnerModule.tsx # UBO 模块
│   ├── ScreeningModule.tsx      # 名单筛查模块
│   ├── Sidebar.tsx              # 侧边导航
│   └── ...
├── services/                # 服务层
│   └── geminiService.ts         # Google Gemini API 封装
├── types.ts                 # TypeScript 类型定义
├── constants.ts             # 模拟数据 (Mock Data)
├── App.tsx                  # 主应用入口与路由逻辑
└── index.tsx                # 渲染入口
```

## ⚠️ 免责声明

本项目为 **概念验证 (PoC) 原型**，仅用于演示 AI 在反洗钱领域的应用场景。
*   系统中的客户数据、交易记录均为虚构的模拟数据。
*   生成的法律文书、监管报文仅供参考，不具备实际法律效力。
*   实际生产部署需对接真实的银行核心系统、黑名单数据库及监管报送专线。

## 📄 License

MIT License