




import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ModelConfigModal } from './components/ModelConfigModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { RiskModelConfigModal } from './components/RiskModelConfigModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { UserEditModal } from './components/UserEditModal';
import { SelfInspectionModule } from './components/SelfInspectionModule';
import { ScreeningModule } from './components/ScreeningModule';
import { BeneficialOwnerModule } from './components/BeneficialOwnerModule';
import { CddModule } from './components/CddModule';
import { CopilotWidget } from './components/CopilotWidget'; // Scheme B
import { CaseInvestigationModule } from './components/CaseInvestigationModule'; // Scheme C
import { RiskHeatmap } from './components/RiskHeatmap'; // Phase 4
import { SystemGuide } from './components/SystemGuide'; // System Guide Component
import { MOCK_TRANSACTIONS, STAT_DATA, MOCK_CUSTOMERS, MOCK_ACCOUNTS, MOCK_MODELS, MOCK_RISK_MODELS, MOCK_USERS, MOCK_SYSTEM_LOGS, RISK_DIST_DATA, TRX_VOLUME_DATA, MOCK_REPORTS, MOCK_CDD_CASES, MOCK_INSPECTION_ITEMS, MOCK_MONITORED_ENTITIES, MOCK_INVESTIGATION_CASES, MOCK_REGULATORY_NEWS } from './constants';
import { Transaction, ReportStatus, TransactionType, MonitoringModel, RiskRatingModel, AiFeedback, Customer, RiskLevel, SystemUser, RegulatoryReport, InspectionStatus, CddStatus } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { AlertOctagon, Banknote, CheckCircle2, Clock, Search, Filter, Plus, User, Building2, FileSearch, Settings2, Globe, AlertTriangle, Send, Bot, ArrowRightLeft, ShieldCheck, RefreshCw, FileCheck, ClipboardCheck, ScanFace, TrendingUp, FileText, Settings, Trash2, Users, Edit, Shield, FileClock, Briefcase, BrainCircuit, Network, Binary, Zap, Bell, Newspaper, Download, ExternalLink, ChevronRight } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Data Query State
  const [queryTab, setQueryTab] = useState<'customer' | 'account' | 'transaction'>('customer');
  const [querySearch, setQuerySearch] = useState('');

  // Models State
  const [models, setModels] = useState<MonitoringModel[]>(MOCK_MODELS);
  const [modelFilter, setModelFilter] = useState<'all' | 'rule' | 'ml' | 'graph'>('all');
  
  // Risk Management State
  const [riskMgmtTab, setRiskMgmtTab] = useState<'query' | 'model'>('query');
  const [riskModels, setRiskModels] = useState<RiskRatingModel[]>(MOCK_RISK_MODELS);
  const [reAssessing, setReAssessing] = useState<string | null>(null); // Customer ID being assessed
  
  // Report State
  const [reports, setReports] = useState<RegulatoryReport[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<RegulatoryReport | null>(null);

  // System Management State
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [systemTab, setSystemTab] = useState<'users' | 'logs'>('users');
  
  // Modals
  const [editingModel, setEditingModel] = useState<MonitoringModel | null>(null);
  const [isCreatingModel, setIsCreatingModel] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [editingRiskModel, setEditingRiskModel] = useState<RiskRatingModel | null>(null);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Alert View State
  const [alertTab, setAlertTab] = useState<'large' | 'suspicious'>('large');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusUpdate = (id: string, status: ReportStatus, feedback?: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { 
        ...tx, 
        status: status, 
        aiAnalysis: selectedTransaction?.id === id ? selectedTransaction.aiAnalysis : tx.aiAnalysis,
        feedbackMessage: feedback 
      } : tx
    ));
  };

  const handleAiFeedback = (id: string, feedback: AiFeedback) => {
    setTransactions(prev => prev.map(tx =>
      tx.id === id ? { ...tx, aiFeedback: feedback } : tx
    ));
  };

  const handleSaveModel = (updatedModel: MonitoringModel) => {
      if (models.find(m => m.id === updatedModel.id)) {
        setModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
      } else {
        setModels(prev => [...prev, updatedModel]);
      }
      setEditingModel(null);
      setIsCreatingModel(false);
  };

  const handleSaveRiskModel = (updatedModel: RiskRatingModel) => {
      setRiskModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
      setEditingRiskModel(null);
  };

  const handleSaveUser = (updatedUser: SystemUser) => {
      if (isCreatingUser) {
          setUsers(prev => [...prev, updatedUser]);
      } else {
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
      setEditingUser(null);
      setIsCreatingUser(false);
  };

  // Simulate Re-assessment
  const handleReAssess = (customerId: string) => {
      setReAssessing(customerId);
      setTimeout(() => {
          setReAssessing(null);
          alert(`客户 ${customerId} 风险重评完成。当前风险等级保持不变。`);
      }, 1500);
  };

  // Navigate from Transaction to Customer view
  const handleJumpToCustomer = (customerId: string) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
    if (customer) {
      setViewingTransaction(null); // Close transaction modal
      setActiveView('data-query'); // Switch to data query view
      setQueryTab('customer'); // Switch to customer tab
      setSelectedCustomer(customer); // Open customer detail modal
    }
  };

  // Derived State for Alerts
  const pendingCount = transactions.filter(t => t.status === ReportStatus.PENDING_REVIEW).length;

  // Filtered Transactions for Alert View
  const currentType = alertTab === 'large' ? TransactionType.LARGE_VALUE : TransactionType.SUSPICIOUS;
  const filteredTransactions = transactions.filter(tx => {
    if (tx.type !== currentType) return false;
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    return true;
  });

  // --- Dashboard Logic ---
  const renderDashboard = () => {
    // CDD Logic
    const activeCddCases = MOCK_CDD_CASES.filter(c => c.status !== CddStatus.APPROVED && c.status !== CddStatus.REJECTED).length;
    
    // Self Inspection Logic
    const totalInspection = MOCK_INSPECTION_ITEMS.length;
    const compliantInspection = MOCK_INSPECTION_ITEMS.filter(i => i.status === InspectionStatus.COMPLIANT).length;
    const complianceScore = Math.round((compliantInspection / totalInspection) * 100);
    
    // Risk Logic
    const highRiskCustomers = MOCK_CUSTOMERS.filter(c => c.riskRating === RiskLevel.CRITICAL || c.riskRating === RiskLevel.HIGH).length;
    
    // Investigation Cases Logic
    const openCasesCount = MOCK_INVESTIGATION_CASES.filter(c => c.status === '调查中').length;

    // Latest 4 suspicious transactions for the feed
    const recentAlerts = transactions
        .filter(t => t.type === TransactionType.SUSPICIOUS)
        .slice(0, 4);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Row 1: Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="待处置预警" 
            value={pendingCount} 
            icon={<AlertTriangle size={20} />} 
            trend="+12% 较昨日" 
            colorClass="bg-white border-l-4 border-l-amber-500" 
          />
          <StatCard 
            title="尽调任务待办" 
            value={activeCddCases} 
            icon={<FileSearch size={20} />} 
            trend="3 笔即将超期" 
            colorClass="bg-white border-l-4 border-l-blue-500" 
          />
           <StatCard 
            title="在查案卷" 
            value={openCasesCount} 
            icon={<Briefcase size={20} />} 
            trend="1 笔高风险" 
            colorClass="bg-white border-l-4 border-l-purple-500" 
          />
          <StatCard 
            title="高风险客户" 
            value={highRiskCustomers} 
            icon={<ShieldCheck size={20} />} 
            trend="占总客户 8%" 
            colorClass="bg-white border-l-4 border-l-red-500" 
          />
          <StatCard 
            title="合规自检得分" 
            value={complianceScore} 
            icon={<ClipboardCheck size={20} />} 
            trend={complianceScore < 90 ? "需整改" : "达标"} 
            colorClass={`bg-white border-l-4 ${complianceScore < 90 ? 'border-l-amber-500' : 'border-l-emerald-500'}`} 
          />
        </div>

        {/* Row 2: Main Visuals (Map & Feed) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Risk Heatmap (Center Stage) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[450px]">
                <RiskHeatmap />
            </div>

            {/* Right Column: Quick Actions & Live Feed */}
            <div className="flex flex-col gap-6 h-[450px]">
                {/* Quick Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500"/> 快捷入口
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setActiveView('screening')} className="p-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors text-left flex items-center gap-2">
                            <ScanFace size={14}/> 名单筛查
                        </button>
                        <button onClick={() => setActiveView('reports')} className="p-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors text-left flex items-center gap-2">
                            <Download size={14}/> 下载日报
                        </button>
                        <button onClick={() => setActiveView('cdd')} className="p-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors text-left flex items-center gap-2">
                            <Plus size={14}/> 新增尽调
                        </button>
                        <button onClick={() => setActiveView('models')} className="p-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors text-left flex items-center gap-2">
                            <Settings2 size={14}/> 模型参数
                        </button>
                    </div>
                </div>

                {/* Live Alert Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                         <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Bell size={16} className="text-red-500"/> 实时预警流
                        </h3>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {recentAlerts.map(alert => (
                            <div key={alert.id} onClick={() => setSelectedTransaction(alert)} className="p-3 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-slate-500">{alert.date.split(' ')[1]}</span>
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 rounded border border-red-100">High Risk</span>
                                </div>
                                <p className="text-xs font-bold text-slate-800 truncate">{alert.triggerRule}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-600">{alert.sender.name}</span>
                                    <span className="text-xs font-mono font-bold text-slate-800">{alert.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Row 3: Trends & News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
             {/* Transaction Flow Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[300px] flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-blue-500"/> 交易监测趋势 (7日)
                </h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TRX_VOLUME_DATA}>
                        <defs>
                            <linearGradient id="colorLarge" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(value: number) => [`${value}万元`, '金额']} />
                        <Area type="monotone" dataKey="largeValue" name="大额交易金额" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLarge)" />
                        <Area type="monotone" dataKey="suspicious" name="可疑交易金额" stackId="1" stroke="#ef4444" fillOpacity={1} fill="url(#colorSuspicious)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Regulatory News */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[300px] overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Newspaper size={18} className="text-indigo-500"/> 监管动态速递
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {MOCK_REGULATORY_NEWS.map(news => (
                         <div key={news.id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">{news.type}</span>
                                 <span className="text-[10px] text-slate-400">{news.date}</span>
                             </div>
                             <h4 className="text-xs font-bold text-slate-800 mb-1 line-clamp-2">{news.title}</h4>
                             <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                 <span>{news.source}</span>
                                 <ExternalLink size={10} />
                             </div>
                         </div>
                     ))}
                 </div>
                 <div className="p-3 border-t border-slate-100 text-center">
                     <button className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-center gap-1">
                         查看更多 <ChevronRight size={12} />
                     </button>
                 </div>
            </div>
        </div>
      </div>
    );
  };

  const renderAlerts = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-bold text-slate-800">大额/可疑案例处置中心</h2>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 justify-between items-center">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setAlertTab('large')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${alertTab === 'large' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            大额预警
          </button>
          <button 
            onClick={() => setAlertTab('suspicious')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${alertTab === 'suspicious' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            可疑预警
          </button>
        </div>

        <div className="flex gap-3 items-center">
           <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
           >
              <Filter size={18} />
           </button>
           {showFilters && (
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
             >
                <option value="all">全部状态</option>
                <option value={ReportStatus.PENDING_REVIEW}>待复核</option>
                <option value={ReportStatus.ANALYZED}>已分析</option>
                <option value={ReportStatus.SUBMITTED}>已上报</option>
                <option value={ReportStatus.ACCEPTED}>中心已接收</option>
                <option value={ReportStatus.REJECTED}>中心驳回</option>
             </select>
           )}
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="搜索流水号/客户..." 
               className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
             />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">流水号 / 时间</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">交易主体</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">金额</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">触发规则</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">状态</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm text-slate-700">{tx.id}</span>
                    <span className="text-xs text-slate-400">{tx.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                          <span className="text-xs bg-slate-100 px-1 rounded text-slate-500">付</span>
                          <span className="text-sm text-slate-800 font-medium">{tx.sender.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <span className="text-xs bg-slate-100 px-1 rounded text-slate-500">收</span>
                          <span className="text-sm text-slate-600">{tx.recipient.name}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="block font-mono font-medium text-slate-700">
                    {tx.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">{tx.currency}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block max-w-[200px] truncate text-xs px-2 py-1 rounded border ${alertTab === 'suspicious' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {tx.triggerRule}
                  </span>
                </td>
                <td className="px-6 py-4">
                   {tx.status === ReportStatus.ACCEPTED ? (
                       <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full w-fit">
                           <CheckCircle2 size={12} /> {tx.status}
                       </span>
                   ) : tx.status === ReportStatus.SUBMITTED ? (
                        <span className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full w-fit">
                           <Send size={12} /> {tx.status}
                       </span>
                   ) : tx.aiAnalysis ? (
                       <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full w-fit">
                           <Bot size={12} /> 已分析
                       </span>
                   ) : (
                       <span className="text-xs text-slate-400">待处理</span>
                   )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setSelectedTransaction(tx)}
                    className={`text-sm font-medium hover:underline flex items-center justify-center gap-1 w-full ${tx.status === ReportStatus.PENDING_REVIEW ? 'text-indigo-600 hover:text-indigo-800' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    {tx.status === ReportStatus.PENDING_REVIEW ? (
                        tx.type === TransactionType.LARGE_VALUE ? (
                            <><FileCheck size={14}/> 复核上报</>
                        ) : (
                            <><Bot size={14}/> AI智能分析</>
                        )
                    ) : '查看详情'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Monitoring Model Configuration View
  const renderModels = () => {
      const filteredModels = models.filter(m => {
          if (modelFilter === 'all') return true;
          if (modelFilter === 'rule') return m.techType === '规则';
          if (modelFilter === 'ml') return m.techType === '机器学习';
          if (modelFilter === 'graph') return m.techType === '图谱';
          return true;
      });

      const getTechIcon = (type: string) => {
          switch(type) {
              case '机器学习': return <BrainCircuit size={20} />;
              case '图谱': return <Network size={20} />;
              default: return <Binary size={20} />;
          }
      };

      const getTechColor = (type: string) => {
        switch(type) {
            case '机器学习': return 'bg-purple-100 text-purple-600';
            case '图谱': return 'bg-orange-100 text-orange-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

      return (
        <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">监测模型管理中心</h2>
            <button 
                onClick={() => { setEditingModel(null); setIsCreatingModel(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
                <Plus size={18} /> 新增模型
            </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex">
            {[
                { id: 'all', label: '全部模型' },
                { id: 'rule', label: '规则引擎' },
                { id: 'ml', label: '机器学习 (AI)' },
                { id: 'graph', label: '图谱分析' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setModelFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${modelFilter === tab.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model) => (
                <div key={model.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTechColor(model.techType)}`}>
                            {getTechIcon(model.techType)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                {model.name}
                                <span className="text-xs font-normal text-slate-400 px-2 py-0.5 border border-slate-100 rounded bg-slate-50">{model.techType}</span>
                            </h3>
                            <span className="text-xs text-slate-500 font-mono">{model.id}</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${model.isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${model.isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    {model.isEnabled ? '运行中' : '已停用'}
                    </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 h-10 line-clamp-2">{model.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div>
                        <span className="text-xs text-slate-400 block">
                            {model.techType === '规则' ? '触发阈值' : model.techType === '机器学习' ? '判别阈值' : '参数配置'}
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                            {model.threshold > 0 ? `${model.threshold.toLocaleString()} ${model.thresholdCurrency}` : '自定义'}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block">风险分值</span>
                        <span className="text-sm font-bold text-slate-700">{model.riskScoreWeight}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block">日均预警</span>
                        <span className="text-sm font-bold text-slate-700">{model.stats?.dailyAlerts || '-'}</span>
                    </div>
                </div>

                {/* Tech Specific Params Preview */}
                {model.techType !== '规则' && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(model.parameters).slice(0, 3).map(([key, val]) => (
                            <span key={key} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">
                                {key}: {val}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">更新于: {model.lastUpdated}</span>
                    <button 
                    onClick={() => setEditingModel(model)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                    <Settings2 size={16} /> 配置
                    </button>
                </div>
                </div>
            ))}
        </div>
        </div>
      );
  };

  // Risk Rating Management View (Query & Model Config)
  const renderRiskManagement = () => (
      <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <button 
                onClick={() => setRiskMgmtTab('query')}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${riskMgmtTab === 'query' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  <Search size={16} /> 客户评级查询
              </button>
              <button 
                onClick={() => setRiskMgmtTab('model')}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${riskMgmtTab === 'model' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  <Settings2 size={16} /> 评级模型配置
              </button>
        </div>

        {riskMgmtTab === 'query' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                     <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="输入客户名称或ID进行查询..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">查询</button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3">客户名称</th>
                            <th className="px-6 py-3">当前等级</th>
                            <th className="px-6 py-3">评级日期</th>
                            <th className="px-6 py-3">触发因素</th>
                            <th className="px-6 py-3">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_CUSTOMERS.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-medium text-slate-800">
                                    <div className="flex items-center gap-2">
                                        {c.type === '企业' ? <Building2 size={16} className="text-slate-400"/> : <User size={16} className="text-slate-400"/>}
                                        {c.name}
                                        <span className="text-xs text-slate-400">({c.id})</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.riskRating === RiskLevel.LOW ? 'bg-green-100 text-green-700' : c.riskRating === RiskLevel.MEDIUM ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                        {c.riskRating}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-500">
                                    {c.riskHistory && c.riskHistory.length > 0 ? c.riskHistory[0].date : '2023-01-01'}
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-500 max-w-[200px] truncate">
                                    {c.riskHistory && c.riskHistory.length > 0 ? c.riskHistory[0].reason : '初始评级'}
                                </td>
                                <td className="px-6 py-3">
                                    <button 
                                        onClick={() => handleReAssess(c.id)}
                                        disabled={reAssessing === c.id}
                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50"
                                    >
                                        <RefreshCw size={14} className={reAssessing === c.id ? 'animate-spin' : ''} />
                                        {reAssessing === c.id ? '评级中...' : '重新评级'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {riskModels.map(rm => (
                    <div key={rm.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    {rm.name}
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{rm.version}</span>
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">{rm.description}</p>
                            </div>
                                <button 
                                onClick={() => setEditingRiskModel(rm)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Settings2 size={20} />
                                </button>
                        </div>
                        
                        <div className="space-y-3">
                            {rm.factors.map(f => (
                                <div key={f.id} className="flex items-center gap-3">
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{width: `${f.weight}%`}}></div>
                                    </div>
                                    <div className="flex justify-between w-full max-w-xs text-xs">
                                        <span className="font-medium text-slate-700">{f.name}</span>
                                        <span className="font-mono text-slate-500">{f.weight}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                            <span>状态: <span className="text-emerald-600 font-medium">{rm.status}</span></span>
                            <span>上次修订: {rm.lastUpdated}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
  );

  const renderDataQuery = () => (
      <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-6 border-b border-slate-100 pb-4 mb-4">
                <button onClick={() => setQueryTab('customer')} className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${queryTab === 'customer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>客户信息查询</button>
                <button onClick={() => setQueryTab('account')} className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${queryTab === 'account' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>账户信息查询</button>
                <button onClick={() => setQueryTab('transaction')} className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${queryTab === 'transaction' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>交易记录查询</button>
            </div>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={querySearch}
                        onChange={(e) => setQuerySearch(e.target.value)}
                        placeholder={
                            queryTab === 'customer' ? '搜索客户名称/证件号...' : 
                            queryTab === 'account' ? '搜索账号/客户ID...' : 
                            '搜索交易流水号/金额/对手方...'
                        }
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">查询</button>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        {queryTab === 'customer' ? (
                            <>
                                <th className="px-6 py-3">客户名称</th>
                                <th className="px-6 py-3">类型</th>
                                <th className="px-6 py-3">风险等级</th>
                                <th className="px-6 py-3">国籍/地区</th>
                                <th className="px-6 py-3">注册日期</th>
                                <th className="px-6 py-3">操作</th>
                            </>
                        ) : queryTab === 'account' ? (
                            <>
                                <th className="px-6 py-3">账号</th>
                                <th className="px-6 py-3">所属客户</th>
                                <th className="px-6 py-3">状态</th>
                                <th className="px-6 py-3 text-right">余额</th>
                                <th className="px-6 py-3">开户行</th>
                                <th className="px-6 py-3">操作</th>
                            </>
                        ) : (
                            <>
                                <th className="px-6 py-3">交易时间</th>
                                <th className="px-6 py-3">流水号</th>
                                <th className="px-6 py-3">收/付</th>
                                <th className="px-6 py-3 text-right">金额</th>
                                <th className="px-6 py-3">对手方</th>
                                <th className="px-6 py-3">操作</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {queryTab === 'customer' ? MOCK_CUSTOMERS.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium text-slate-800 flex items-center gap-2">
                                {c.type === '企业' ? <Building2 size={16} className="text-slate-400" /> : <User size={16} className="text-slate-400" />}
                                {c.name}
                            </td>
                            <td className="px-6 py-3 text-slate-500">{c.type}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${c.riskRating === RiskLevel.LOW ? 'bg-green-100 text-green-700' : c.riskRating === RiskLevel.MEDIUM ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                    {c.riskRating}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-slate-500">{c.country}</td>
                            <td className="px-6 py-3 text-slate-500">{c.regDate}</td>
                            <td className="px-6 py-3">
                                <button 
                                    onClick={() => setSelectedCustomer(c)}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    详情
                                </button>
                            </td>
                        </tr>
                    )) : queryTab === 'account' ? MOCK_ACCOUNTS.map(a => (
                         <tr key={a.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-mono text-slate-700">{a.accountNo}</td>
                            <td className="px-6 py-3 text-slate-600">{a.customerId}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs ${a.status === '正常' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{a.status}</span>
                            </td>
                            <td className="px-6 py-3 text-right font-mono font-medium">{a.balance.toLocaleString()} {a.currency}</td>
                            <td className="px-6 py-3 text-slate-500">{a.branch}</td>
                            <td className="px-6 py-3">
                                <button 
                                    onClick={() => handleJumpToCustomer(a.customerId)}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    查看客户
                                </button>
                            </td>
                        </tr>
                    )) : transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 text-slate-500 text-xs">{tx.date}</td>
                            <td className="px-6 py-3 font-mono text-slate-700 text-xs">{tx.id}</td>
                            <td className="px-6 py-3">
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs">
                                    {tx.sender.name.includes('我行') ? '转出' : '转入'} (模拟)
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right font-mono">{tx.amount.toLocaleString()} {tx.currency}</td>
                            <td className="px-6 py-3 text-slate-600">{tx.recipient.name}</td>
                            <td className="px-6 py-3">
                                <button 
                                    onClick={() => setViewingTransaction(tx)}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    查看详情
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
  );

  const renderReports = () => (
      <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                <FileSearch size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">监管报送中心</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                在此查看已生成的 STR (可疑交易报告) 和 LCTR (大额交易报告) 上报状态。系统自动对接反洗钱监测中心接口。
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-bold text-slate-700 mb-1">今日已上报</h4>
                    <p className="text-2xl font-bold text-emerald-600">12 <span className="text-sm text-slate-400 font-normal">份</span></p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-bold text-slate-700 mb-1">待处理回执</h4>
                    <p className="text-2xl font-bold text-amber-500">3 <span className="text-sm text-slate-400 font-normal">份</span></p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-bold text-slate-700 mb-1">校验失败</h4>
                    <p className="text-2xl font-bold text-red-500">1 <span className="text-sm text-slate-400 font-normal">份</span></p>
                </div>
            </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">最近报送记录</div>
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-6 py-3 text-left">报文文件名</th>
                        <th className="px-6 py-3 text-left">报送时间</th>
                        <th className="px-6 py-3 text-left">类型</th>
                        <th className="px-6 py-3 text-left">包含交易数</th>
                        <th className="px-6 py-3 text-left">状态</th>
                        <th className="px-6 py-3 text-left">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {reports.map(report => (
                        <tr key={report.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-mono text-slate-700">{report.fileName}</td>
                            <td className="px-6 py-3 text-slate-500">{report.reportDate}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${report.type === '可疑交易报告' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {report.type}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-slate-700">{report.transactionCount}</td>
                            <td className="px-6 py-3">
                                <span className={`flex items-center gap-1 text-xs font-medium ${
                                    report.status === '校验通过' ? 'text-emerald-600' :
                                    report.status === '校验失败' ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                    {report.status === '校验通过' && <CheckCircle2 size={14} />}
                                    {report.status === '校验失败' && <AlertTriangle size={14} />}
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-3">
                                <button 
                                    onClick={() => setSelectedReport(report)}
                                    className="text-blue-600 hover:underline"
                                >
                                    查看详情
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
  );

  const renderSystem = () => (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
             <div>
                 <h2 className="text-2xl font-bold text-slate-800">系统管理</h2>
                 <p className="text-sm text-slate-500">用户权限、日志审计与系统参数配置</p>
             </div>
        </div>

        {/* System Management Tabs */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 w-fit">
            <button 
                onClick={() => setSystemTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${systemTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Users size={16} /> 用户管理
            </button>
            <button 
                onClick={() => setSystemTab('logs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${systemTab === 'logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <FileClock size={16} /> 系统审计日志
            </button>
        </div>
        
        {/* Content based on Tab */}
        {systemTab === 'users' ? (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={18} className="text-blue-600" /> 用户权限列表
                    </h3>
                    <button 
                        onClick={() => { setEditingUser(null); setIsCreatingUser(true); }}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium shadow-sm"
                    >
                        <Plus size={16} /> 新增用户
                    </button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3">用户名</th>
                            <th className="px-6 py-3">角色</th>
                            <th className="px-6 py-3">部门</th>
                            <th className="px-6 py-3">最近登录</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-bold text-slate-700">{user.username}</td>
                                <td className="px-6 py-3">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-600">{user.department}</td>
                                <td className="px-6 py-3 text-slate-500 font-mono text-xs">{user.lastLogin}</td>
                                <td className="px-6 py-3">
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === '启用' ? 'text-green-600' : 'text-slate-400'}`}>
                                        <div className={`w-2 h-2 rounded-full ${user.status === '启用' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button 
                                        onClick={() => { setEditingUser(user); setIsCreatingUser(false); }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <Edit size={14} /> 编辑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                 <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Settings size={18} className="text-slate-600" /> 操作日志记录 (最近10条)
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2 text-slate-400" size={14} />
                        <input type="text" placeholder="搜索日志..." className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3">时间</th>
                            <th className="px-6 py-3">操作员</th>
                            <th className="px-6 py-3">模块</th>
                            <th className="px-6 py-3">动作</th>
                            <th className="px-6 py-3">详情</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_SYSTEM_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-3 font-medium text-slate-700">{log.operator}</td>
                                <td className="px-6 py-3 text-slate-600">{log.module}</td>
                                <td className="px-6 py-3 text-slate-600">{log.action}</td>
                                <td className="px-6 py-3 text-slate-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64 p-8">
        <div className="w-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {activeView === 'dashboard' && '运营概览 (Dashboard)'}
                        {activeView === 'alerts' && '案例处置中心 (Case Management)'}
                        {activeView === 'models' && '监测模型管理 (Model Management)'}
                        {activeView === 'risk-rating' && '客户风险评级 (Risk Rating)'}
                        {activeView === 'reports' && '监管报送 (Regulatory Reporting)'}
                        {activeView === 'data-query' && '综合数据查询 (Data Query)'}
                        {activeView === 'system' && '系统管理 (System Admin)'}
                        {activeView === 'inspection' && '现场检查自检 (Self-Inspection)'}
                        {activeView === 'screening' && '智能名单筛查 (Screening)'}
                        {activeView === 'ubo' && '受益所有人管理 (UBO)'}
                        {activeView === 'cdd' && '客户尽职调查 (CDD)'}
                        {activeView === 'cases' && '调查案卷中心 (Investigation Cases)'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* System Guide Button */}
                    <SystemGuide />

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-600">AI 引擎在线</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200">
                        Ad
                    </div>
                </div>
            </header>

            {/* Dynamic Content */}
            <main className="pb-16">
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'alerts' && renderAlerts()}
                {activeView === 'models' && renderModels()}
                {activeView === 'risk-rating' && renderRiskManagement()}
                {activeView === 'reports' && renderReports()}
                {activeView === 'data-query' && renderDataQuery()}
                {activeView === 'system' && renderSystem()}
                {activeView === 'inspection' && <SelfInspectionModule />}
                {activeView === 'screening' && <ScreeningModule />}
                {activeView === 'ubo' && <BeneficialOwnerModule />}
                {activeView === 'cdd' && <CddModule />}
                {activeView === 'cases' && <CaseInvestigationModule />}
            </main>
        </div>
      </div>

      {/* Global Copilot Widget */}
      <CopilotWidget />

      {/* Global Modals */}
      {selectedTransaction && (
        <AnalysisPanel 
            transaction={selectedTransaction} 
            onClose={() => setSelectedTransaction(null)}
            onUpdateStatus={handleStatusUpdate}
            onFeedback={handleAiFeedback}
        />
      )}

      {viewingTransaction && (
          <TransactionDetailModal 
              transaction={viewingTransaction} 
              onClose={() => setViewingTransaction(null)}
              onViewCustomer={handleJumpToCustomer}
          />
      )}

      {(editingModel || isCreatingModel) && (
        <ModelConfigModal 
          model={editingModel} 
          onClose={() => { setEditingModel(null); setIsCreatingModel(false); }} 
          onSave={handleSaveModel} 
        />
      )}

      {(editingUser || isCreatingUser) && (
          <UserEditModal 
            user={editingUser}
            isCreating={isCreatingUser}
            onClose={() => { setEditingUser(null); setIsCreatingUser(false); }}
            onSave={handleSaveUser}
          />
      )}

      {selectedCustomer && (
        <CustomerDetailModal 
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
        />
      )}

      {editingRiskModel && (
          <RiskModelConfigModal 
            model={editingRiskModel}
            onClose={() => setEditingRiskModel(null)}
            onSave={handleSaveRiskModel}
          />
      )}

      {selectedReport && (
          <ReportDetailModal 
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
      )}

    </div>
  );
}

export default App;
