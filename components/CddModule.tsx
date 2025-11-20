
import React, { useState } from 'react';
import { CddCase, CddStatus, RiskLevel } from '../types';
import { MOCK_CDD_CASES, MOCK_CUSTOMERS } from '../constants';
import { ClipboardCheck, Search, Filter, MoreHorizontal, Clock, AlertTriangle, CheckCircle2, XCircle, FileText, Shield, User, Calendar, ArrowRight, AlertOctagon, Plus, Save } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const CddModule: React.FC = () => {
  const [cases, setCases] = useState<CddCase[]>(MOCK_CDD_CASES);
  const [selectedCase, setSelectedCase] = useState<CddCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Case Form State
  const [newCaseForm, setNewCaseForm] = useState({
      customerId: '',
      type: '新户准入',
      priority: '中',
      assignee: '',
      dueDate: ''
  });

  // Kanban Columns
  const columns = [
    { id: CddStatus.NEW, title: '待分配 / 新建', color: 'border-slate-200', bg: 'bg-slate-50' },
    { id: CddStatus.IN_PROGRESS, title: '尽调中', color: 'border-blue-200', bg: 'bg-blue-50' },
    { id: CddStatus.PENDING_APPROVAL, title: '待审批', color: 'border-amber-200', bg: 'bg-amber-50' },
    { id: CddStatus.APPROVED, title: '已归档 (通过/拒绝)', color: 'border-green-200', bg: 'bg-green-50' }
  ];

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case '高': return 'text-red-600 bg-red-100';
          case '中': return 'text-amber-600 bg-amber-100';
          default: return 'text-green-600 bg-green-100';
      }
  };

  const handleStatusUpdate = (caseId: string, newStatus: CddStatus) => {
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
      if (selectedCase && selectedCase.id === caseId) {
          setSelectedCase(prev => prev ? { ...prev, status: newStatus } : null);
      }
  };

  const handleCreateCase = () => {
      if (!newCaseForm.customerId || !newCaseForm.dueDate) {
          alert("请填写完整的案例信息");
          return;
      }

      const customer = MOCK_CUSTOMERS.find(c => c.id === newCaseForm.customerId);
      
      const newCase: CddCase = {
          id: `CDD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          customerId: newCaseForm.customerId,
          customerName: customer ? customer.name : 'Unknown',
          type: newCaseForm.type as any,
          status: CddStatus.NEW,
          priority: newCaseForm.priority as any,
          assignee: newCaseForm.assignee || 'Unassigned',
          createDate: new Date().toISOString().split('T')[0],
          dueDate: newCaseForm.dueDate,
          riskScore: 0, // Initial
          riskComponents: [],
          kycChecks: [],
          comments: []
      };

      setCases([...cases, newCase]);
      setIsCreating(false);
      setNewCaseForm({ customerId: '', type: '新户准入', priority: '中', assignee: '', dueDate: '' });
  };

  // --- Render Sub-components ---

  const NewCaseModal = () => {
      if (!isCreating) return null;

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="font-bold text-slate-800">新建尽职调查案例</h3>
                    <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">目标客户</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={newCaseForm.customerId}
                            onChange={(e) => setNewCaseForm({...newCaseForm, customerId: e.target.value})}
                        >
                            <option value="">请选择客户...</option>
                            {MOCK_CUSTOMERS.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">调查类型</label>
                            <select 
                                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={newCaseForm.type}
                                onChange={(e) => setNewCaseForm({...newCaseForm, type: e.target.value})}
                            >
                                <option value="新户准入">新户准入</option>
                                <option value="定期复核">定期复核</option>
                                <option value="触发式调查">触发式调查</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">优先级</label>
                            <select 
                                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={newCaseForm.priority}
                                onChange={(e) => setNewCaseForm({...newCaseForm, priority: e.target.value})}
                            >
                                <option value="高">高</option>
                                <option value="中">中</option>
                                <option value="低">低</option>
                            </select>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">经办人员 (可选)</label>
                         <input 
                            type="text" 
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="输入用户名"
                            value={newCaseForm.assignee}
                            onChange={(e) => setNewCaseForm({...newCaseForm, assignee: e.target.value})}
                         />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">截止日期</label>
                         <input 
                            type="date" 
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={newCaseForm.dueDate}
                            onChange={(e) => setNewCaseForm({...newCaseForm, dueDate: e.target.value})}
                         />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm">取消</button>
                    <button onClick={handleCreateCase} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                        <Save size={16} /> 创建案例
                    </button>
                </div>
            </div>
        </div>
      );
  };

  const CaseCard = ({ cddCase }: { cddCase: CddCase }) => (
      <div 
        onClick={() => setSelectedCase(cddCase)}
        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
          <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-400">{cddCase.id}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getPriorityColor(cddCase.priority)}`}>
                  {cddCase.priority}
              </span>
          </div>
          <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{cddCase.customerName}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded">{cddCase.type}</span>
              <span>•</span>
              <span>{cddCase.assignee}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {cddCase.dueDate}
              </div>
              {cddCase.riskScore > 0 && (
                  <div className={`text-xs font-bold ${cddCase.riskScore >= 80 ? 'text-red-600' : cddCase.riskScore >= 60 ? 'text-amber-600' : 'text-green-600'}`}>
                      风险分: {cddCase.riskScore}
                  </div>
              )}
          </div>
      </div>
  );

  const DetailModal = () => {
      if (!selectedCase) return null;

      const riskData = [
        { name: '风险分', value: selectedCase.riskScore, color: selectedCase.riskScore >= 80 ? '#ef4444' : selectedCase.riskScore >= 60 ? '#f59e0b' : '#10b981' },
        { name: '剩余', value: 100 - selectedCase.riskScore, color: '#e2e8f0' },
      ];

      return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                          <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl font-bold text-slate-800">{selectedCase.customerName}</h2>
                              <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                  ID: {selectedCase.customerId}
                              </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1"><FileText size={14}/> {selectedCase.type}</span>
                              <span className="flex items-center gap-1"><User size={14}/> 经办: {selectedCase.assignee}</span>
                              <span className="flex items-center gap-1"><Clock size={14}/> 截止: {selectedCase.dueDate}</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end mr-4">
                                <span className="text-xs text-slate-400 uppercase">当前状态</span>
                                <span className="font-bold text-slate-700">{selectedCase.status}</span>
                          </div>
                          <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                              <XCircle size={24} />
                          </button>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 gap-8 bg-slate-50/50">
                      
                      {/* Left: Risk Profile */}
                      <div className="space-y-6">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <AlertOctagon size={18} className="text-blue-600" /> 综合风险评分
                              </h3>
                              <div className="flex items-center justify-center h-40 relative">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                          <Pie
                                              data={riskData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={40}
                                              outerRadius={55}
                                              startAngle={180}
                                              endAngle={0}
                                              dataKey="value"
                                          >
                                              {riskData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                              ))}
                                          </Pie>
                                      </PieChart>
                                  </ResponsiveContainer>
                                  <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                      <span className="text-3xl font-bold text-slate-800">{selectedCase.riskScore}</span>
                                      <span className="block text-xs text-slate-400">/100</span>
                                  </div>
                              </div>
                              <div className="space-y-3 mt-2">
                                  {selectedCase.riskComponents.map((comp, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm">
                                          <span className="text-slate-600">{comp.category}</span>
                                          <div className="flex items-center gap-2">
                                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                  <div 
                                                    className={`h-full ${comp.riskLevel === RiskLevel.CRITICAL ? 'bg-red-500' : comp.riskLevel === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-blue-500'}`} 
                                                    style={{width: `${comp.score}%`}}
                                                  ></div>
                                              </div>
                                              <span className="font-mono text-xs">{comp.score}</span>
                                          </div>
                                      </div>
                                  ))}
                                  {selectedCase.riskComponents.length === 0 && (
                                      <p className="text-center text-xs text-slate-400 py-2">暂无高风险因子触发</p>
                                  )}
                              </div>
                          </div>

                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Shield size={18} className="text-blue-600" /> 调查备注/结论
                                </h3>
                                <div className="space-y-3">
                                    {selectedCase.comments?.map((comment, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700">
                                            {comment}
                                        </div>
                                    ))}
                                    <textarea 
                                        placeholder="添加调查备注..." 
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mt-2"
                                        rows={3}
                                    />
                                </div>
                          </div>
                      </div>

                      {/* Right: KYC Checks & Details */}
                      <div className="col-span-2 space-y-6">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ClipboardCheck size={18} className="text-emerald-600" /> 自动化 KYC 检查结果
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedCase.kycChecks.map(check => (
                                        <div key={check.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${
                                                    check.status === 'PASS' ? 'bg-green-100 text-green-600' :
                                                    check.status === 'FAIL' ? 'bg-red-100 text-red-600' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {check.status === 'PASS' ? <CheckCircle2 size={20} /> : 
                                                     check.status === 'FAIL' ? <XCircle size={20} /> : 
                                                     <AlertTriangle size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">{check.name}</h4>
                                                    <p className="text-xs text-slate-500">{check.details}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">{check.timestamp}</span>
                                        </div>
                                    ))}
                                    {selectedCase.kycChecks.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            尚未执行自动化检查
                                        </div>
                                    )}
                                </div>
                          </div>

                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-1">审批决策</h3>
                                    <p className="text-sm text-slate-500">请根据风险评分及KYC结果进行人工复核。</p>
                                </div>
                                <div className="flex gap-3">
                                    {selectedCase.status === CddStatus.PENDING_APPROVAL ? (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedCase.id, CddStatus.ENHANCED_DUE_DILIGENCE)}
                                                className="px-4 py-2 bg-amber-50 text-amber-700 font-medium rounded-lg hover:bg-amber-100 border border-amber-200 transition-colors"
                                            >
                                                转入增强尽调 (EDD)
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedCase.id, CddStatus.REJECTED)}
                                                className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                                            >
                                                拒绝准入
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedCase.id, CddStatus.APPROVED)}
                                                className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                                            >
                                                审核通过
                                            </button>
                                        </>
                                    ) : selectedCase.status === CddStatus.NEW ? (
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedCase.id, CddStatus.IN_PROGRESS)}
                                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            开始尽调 <ArrowRight size={16} />
                                        </button>
                                    ) : selectedCase.status === CddStatus.IN_PROGRESS ? (
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedCase.id, CddStatus.PENDING_APPROVAL)}
                                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            提交审批 <ArrowRight size={16} />
                                        </button>
                                    ) : (
                                        <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg font-medium cursor-not-allowed">
                                            流程已结束
                                        </div>
                                    )}
                                </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in">
        {/* Header Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">客户尽职调查 (CDD)</h2>
                <p className="text-sm text-slate-500">管理 KYC 流程、风险准入及定期复核任务</p>
            </div>
            <div className="flex gap-4">
                 <div className="relative">
                     <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        placeholder="搜索客户或案例ID..." 
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                     />
                 </div>
                 <button 
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"
                 >
                     <Plus size={16} /> 新建尽调案例
                 </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-6 h-full min-w-[1000px]">
                {columns.map(col => {
                    const colCases = cases.filter(c => 
                        c.status === col.id || 
                        (col.id === CddStatus.APPROVED && (c.status === CddStatus.REJECTED || c.status === CddStatus.ENHANCED_DUE_DILIGENCE))
                    );

                    return (
                        <div key={col.id} className="flex-1 flex flex-col min-w-[300px] bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
                            <div className={`p-4 border-b ${col.color} ${col.bg} flex justify-between items-center`}>
                                <h3 className="font-bold text-slate-700">{col.title}</h3>
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                                    {colCases.length}
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {colCases.map(c => (
                                    <CaseCard key={c.id} cddCase={c} />
                                ))}
                                {colCases.length === 0 && (
                                    <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                        暂无案例
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <DetailModal />
        <NewCaseModal />
    </div>
  );
};
