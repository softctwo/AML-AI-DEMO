
import React, { useState, useEffect } from 'react';
import { InvestigationCase } from '../types';
import { draftInvestigationReport } from '../services/geminiService';
import { X, Sparkles, Save, FileText, Copy, Check, RefreshCw, Bold, Italic, List, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportDraftingStudioProps {
  caseInfo: InvestigationCase;
  onClose: () => void;
}

export const ReportDraftingStudio: React.FC<ReportDraftingStudioProps> = ({ caseInfo, onClose }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    handleGenerateDraft();
  }, []);

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    const draft = await draftInvestigationReport(caseInfo);
    setContent(draft);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-lg">智能报告撰写工坊</h2>
                    <p className="text-xs text-slate-400">AI-Assisted STR Drafting Studio</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={handleGenerateDraft} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs transition-colors border border-slate-700">
                    <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                    {isGenerating ? 'AI 撰写中...' : '重新生成'}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left: Context Panel */}
            <div className="w-80 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <FileText size={14} /> 案卷素材 (Context)
                </h3>
                
                <div className="space-y-4">
                    <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                        <label className="text-[10px] text-slate-400 block mb-1">案件标题</label>
                        <p className="text-sm font-bold text-slate-800">{caseInfo.title}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                        <label className="text-[10px] text-slate-400 block mb-1">主要嫌疑人</label>
                        <p className="text-sm text-slate-800">{caseInfo.primarySubjectName} ({caseInfo.primarySubjectId})</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                        <label className="text-[10px] text-slate-400 block mb-1">案情摘要</label>
                        <p className="text-xs text-slate-600 leading-relaxed">{caseInfo.description}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                        <label className="text-[10px] text-slate-400 block mb-1">关联证据</label>
                        <div className="flex flex-wrap gap-2">
                            {caseInfo.linkedAlerts.map(alert => (
                                <span key={alert} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">{alert}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Editor Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                {/* Editor Toolbar */}
                <div className="border-b border-slate-200 p-2 flex items-center gap-2 bg-white sticky top-0 z-10">
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><Bold size={16} /></button>
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><Italic size={16} /></button>
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><List size={16} /></button>
                    <div className="w-px h-4 bg-slate-300 mx-2"></div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded ml-auto"
                    >
                        {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        {isCopied ? '已复制' : '复制全文'}
                    </button>
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {isGenerating ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                            <br />
                            <div className="h-6 bg-slate-100 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                        </div>
                    ) : (
                        <textarea 
                            className="w-full h-full resize-none outline-none text-slate-800 text-base leading-relaxed font-serif"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            spellCheck={false}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded text-sm font-medium">取消</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200">
                        <Save size={16} /> 保存至案卷
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                        <Download size={16} /> 导出 Word
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
