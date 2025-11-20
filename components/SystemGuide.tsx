
import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, ChevronRight, FileText, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const SystemGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Hardcoded content mimicking the README or official user manual
  const guideContent = `
# AML Sentinel AI 系统说明书

**下一代智能反洗钱监测系统**

---

## 🚀 核心功能指南

### 1. 🧠 AI 智能研判
- **功能入口**: 首页待处置预警 -> 点击 "AI智能分析"
- **核心价值**: 集成 Google Gemini 模型，自动对可疑交易进行资金路径分析、行为特征识别，并生成标准的甄别分析报告。

### 2. 🌍 全球风险热力图
- **功能入口**: 首页概览 (Dashboard)
- **核心价值**: 可视化展示高风险国家/地区的资金流动热点，辅助宏观风险把控。

### 3. 🕸️ 资金链路图谱
- **功能入口**: 交易详情 -> 资金链路图谱 Tab
- **核心价值**: 自动梳理交易的上下游资金流向，识别"快进快出"、"分散转入集中转出"等洗钱拓扑结构。

### 4. 💼 调查案卷中心
- **功能入口**: 侧边栏 -> 调查案卷中心
- **核心价值**: 支持将多个关联预警合并为一个案件（Case），进行全生命周期的调查管理、证据留存及审批流转。

### 5. 🤖 AML Copilot (AI 助手)
- **功能入口**: 页面右下角悬浮图标
- **核心价值**: 随时唤起的智能助手，可回答法规咨询、起草邮件或解释专业术语。

### 6. 📋 智能名单筛查
- **功能入口**: 侧边栏 -> 智能名单筛查
- **核心价值**: 集成制裁名单、PEP、负面新闻数据库。支持单次快速检索和批量持续监控。

### 7. 🔍 客户尽职调查 (CDD)
- **功能入口**: 侧边栏 -> 客户尽职调查
- **核心价值**: 基于看板（Kanban）的任务管理，涵盖新户准入、定期复核及触发式调查。

### 8. 👥 受益所有人 (UBO)
- **功能入口**: 侧边栏 -> 受益所有人管理
- **核心价值**: 提供股权穿透图谱，自动计算持股比例，识别最终受益人。

### 9. ✅ 现场检查自检
- **功能入口**: 侧边栏 -> 现场检查自检
- **核心价值**: 内置监管检查清单，并支持导出符合300号文规范的数据接口包。

---

## ❓ 常见问题 (FAQ)

**Q: 如何配置新的监测规则？**
A: 进入"监测模型管理"，点击右上角"新增模型"，或点击现有模型进行阈值和参数调整。

**Q: AI 分析结果不准确怎么办？**
A: 在分析报告下方点击"误报/遗漏风险"（拇指向下图标），并提交反馈意见。系统会基于反馈微调提示词。

**Q: 如何导出监管报表？**
A: 进入"监管报送"模块，系统会自动生成 XML 报文。点击"下载"即可。
`;

  return (
    <>
      {/* Trigger Button (Top Right in Header) */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all"
        title="系统功能说明书"
      >
        <HelpCircle size={20} />
        <span className="absolute top-12 right-0 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            系统说明书
        </span>
      </button>

      {/* Slide-over Panel (Drawer) */}
      <div className={`fixed inset-0 z-[100] flex justify-end transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsOpen(false)}
            style={{ opacity: isOpen ? 1 : 0 }}
          ></div>

          {/* Panel */}
          <div className={`relative w-full max-w-lg bg-white shadow-2xl h-full transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <BookOpen size={20} />
                      </div>
                      <div>
                          <h2 className="font-bold text-slate-800">系统功能说明书</h2>
                          <p className="text-xs text-slate-500">操作指南与业务逻辑说明</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                  >
                      <X size={20} />
                  </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                  <div className="prose prose-sm prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-800">
                      <ReactMarkdown>{guideContent}</ReactMarkdown>
                  </div>
                  
                  {/* Quick Links Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">快速跳转</h4>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition-colors">
                                <Activity size={16} className="text-blue-600"/>
                                <div className="text-xs">
                                    <span className="font-bold text-blue-800 block">监测模型</span>
                                    <span className="text-blue-600">配置规则</span>
                                </div>
                          </div>
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-emerald-100 transition-colors">
                                <ShieldCheck size={16} className="text-emerald-600"/>
                                <div className="text-xs">
                                    <span className="font-bold text-emerald-800 block">合规自检</span>
                                    <span className="text-emerald-600">查看清单</span>
                                </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                  <p className="text-xs text-slate-400">AML Sentinel AI v1.0.2 | 最后更新: 2023-10-25</p>
              </div>
          </div>
      </div>
    </>
  );
};
