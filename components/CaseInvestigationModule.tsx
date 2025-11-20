
import React, { useState } from 'react';
import { InvestigationCase, CaseStatus } from '../types';
import { MOCK_INVESTIGATION_CASES } from '../constants';
import { Briefcase, Search, Plus, Filter, Clock, User, AlertTriangle, FileText, Paperclip, MessageSquare, ChevronRight, MoreVertical } from 'lucide-react';

export const CaseInvestigationModule: React.FC = () => {
  const [cases, setCases] = useState<InvestigationCase[]>(MOCK_INVESTIGATION_CASES);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);

  const getStatusColor = (status: CaseStatus) => {
      switch(status) {
          case CaseStatus.OPEN: return 'bg-blue-100 text-blue-700';
          case CaseStatus.PENDING_REVIEW: return 'bg-amber-100 text-amber-700';
          case CaseStatus.CLOSED_SUBMITTED: return 'bg-purple-100 text-purple-700';
          case CaseStatus.CLOSED_DISMISSED: return 'bg-slate-100 text-slate-600';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in">
        {/* Case List Sidebar */}
        <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase size={18} className="text-blue-600" /> 调查案卷列表
                    </h3>
                    <button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="搜索案卷号/标题..." 
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {cases.map(c => (
                    <div 
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedCase?.id === c.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-100 hover:border-blue-200'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-slate-400">{c.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(c.status)}`}>{c.status}</span>
                        </div>
                        <h4 className={`text-sm font-bold mb-2 line-clamp-2 ${selectedCase?.id === c.id ? 'text-blue-800' : 'text-slate-800'}`}>{c.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><User size={12}/> {c.owner}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {c.createDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Case Detail View */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {selectedCase ? (
                <>
                    {/* Detail Header */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-slate-800">{selectedCase.title}</h2>
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-bold border border-red-200">
                                    {selectedCase.severity} 风险
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><User size={14} /> 主要嫌疑主体: <span className="font-bold text-slate-700">{selectedCase.primarySubjectName}</span></span>
                                <span className="flex items-center gap-1"><Clock size={14} /> 立案日期: {selectedCase.createDate}</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                            生成调查报告
                        </button>
                    </div>

                    {/* Detail Content */}
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 gap-8">
                        {/* Left: Overview & Description */}
                        <div className="col-span-2 space-y-6">
                            <section>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" /> 案情描述
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
                                    {selectedCase.description}
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-600" /> 关联风险项
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">关联可疑交易 (Alerts)</h4>
                                        <div className="space-y-2">
                                            {selectedCase.linkedAlerts.map(alertId => (
                                                <div key={alertId} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-sm">
                                                    <span className="font-mono text-slate-600">{alertId}</span>
                                                    <ChevronRight size={14} className="text-slate-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">关联实体 (Entities)</h4>
                                        <div className="space-y-2">
                                            {selectedCase.linkedEntities.map(entId => (
                                                <div key={entId} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-sm">
                                                    <span className="font-mono text-slate-600">{entId}</span>
                                                    <ChevronRight size={14} className="text-slate-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: Actions & Logs */}
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">案件处置</h3>
                                <div className="space-y-3">
                                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                        添加调查记录
                                    </button>
                                    <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                                        <Paperclip size={16} /> 上传证据材料
                                    </button>
                                    <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                                        转交上级复核
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-3 text-sm">调查日志</h3>
                                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-slate-300">
                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                        <p className="text-xs text-slate-500 mb-1">2023-10-20 14:30</p>
                                        <p className="text-sm text-slate-700">系统自动立案，关联交易 TRX-2023-006。</p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
                                        <p className="text-xs text-slate-500 mb-1">2023-10-21 09:00</p>
                                        <p className="text-sm text-slate-700">分析员 zhangwei 开始介入调查，调取账户流水。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Briefcase size={64} className="mb-4 opacity-20" />
                    <p>请选择一个调查案卷查看详情</p>
                </div>
            )}
        </div>
    </div>
  );
};
