
import React, { useState, useMemo } from 'react';
import { InspectionItem, InspectionStatus, InspectionCategory, StandardReportTable } from '../types';
import { MOCK_INSPECTION_ITEMS, MOCK_STANDARD_TABLES, MOCK_CUSTOMERS, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../constants';
import { ClipboardCheck, PieChart, AlertCircle, CheckCircle2, Edit3, Save, Filter, Download, ChevronRight, FileSpreadsheet, Database, Calendar, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, PieChart as ReChartsPie, Pie, Cell, Tooltip } from 'recharts';

const CATEGORIES: InspectionCategory[] = ['内控制度', '客户身份识别(KYC)', '大额可疑报送', '资料保存', '员工培训', '反洗钱保密'];

export const SelfInspectionModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'data_interface'>('checklist');

  // --- Checklist State ---
  const [items, setItems] = useState<InspectionItem[]>(MOCK_INSPECTION_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editRemark, setEditRemark] = useState('');

  // --- Data Interface State ---
  const [selectedTableId, setSelectedTableId] = useState<string | null>(MOCK_STANDARD_TABLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Checklist Logic ---
  const stats = useMemo(() => {
    const total = items.length;
    const compliant = items.filter(i => i.status === InspectionStatus.COMPLIANT).length;
    const partial = items.filter(i => i.status === InspectionStatus.PARTIAL).length;
    const nonCompliant = items.filter(i => i.status === InspectionStatus.NON_COMPLIANT).length;
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

    return { total, compliant, partial, nonCompliant, complianceRate };
  }, [items]);

  const chartData = [
    { name: '达标', value: stats.compliant, color: '#10b981' },
    { name: '部分达标', value: stats.partial, color: '#f59e0b' },
    { name: '未达标', value: stats.nonCompliant, color: '#ef4444' },
  ];

  const filteredItems = activeCategory === 'ALL' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  const handleStatusChange = (id: string, status: InspectionStatus) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status, lastChecked: new Date().toISOString().split('T')[0] } : item));
  };

  const startEditing = (item: InspectionItem) => {
    setEditingItem(item.id);
    setEditRemark(item.remark || '');
  };

  const saveRemark = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, remark: editRemark } : item));
    setEditingItem(null);
  };

  // --- Data Interface Logic ---
  const selectedTable = MOCK_STANDARD_TABLES.find(t => t.id === selectedTableId);

  const getTablePreviewData = () => {
      if (!selectedTable) return [];
      switch(selectedTable.tableCode) {
          case 'GRKHXX': return MOCK_CUSTOMERS.filter(c => c.type === '个人');
          case 'DWKHXX': return MOCK_CUSTOMERS.filter(c => c.type === '企业');
          case 'ZHXX': return MOCK_ACCOUNTS;
          case 'JYLS': return MOCK_TRANSACTIONS;
          default: return [];
      }
  };
  
  const previewData = getTablePreviewData();

  const handleGenerateData = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          alert('数据提取完成，已生成 ZIP 压缩包');
      }, 2000);
  };

  const renderChecklistView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2">
        {/* Top Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Score Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-500 font-medium mb-1">反洗钱合规自检得分</p>
                    <h2 className="text-5xl font-bold text-slate-800">{stats.complianceRate}<span className="text-2xl text-slate-400 ml-1">/100</span></h2>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-green-500" /> 
                        上次全面自检: 2023-10-25
                    </p>
                </div>
                <div className="h-24 w-24 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPie>
                            <Pie
                                data={chartData}
                                innerRadius={30}
                                outerRadius={45}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </ReChartsPie>
                    </ResponsiveContainer>
                </div>
                <div className="absolute -right-4 -bottom-4 text-slate-100 opacity-50 transform rotate-12">
                    <ClipboardCheck size={150} />
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center justify-center p-2 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-2xl font-bold text-green-600">{stats.compliant}</span>
                    <span className="text-xs text-green-700 font-medium mt-1">已达标</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <span className="text-2xl font-bold text-amber-600">{stats.partial}</span>
                    <span className="text-xs text-amber-700 font-medium mt-1">部分达标</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-2xl font-bold text-red-600">{stats.nonCompliant}</span>
                    <span className="text-xs text-red-700 font-medium mt-1">未达标</span>
                </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <AlertCircle className="text-amber-400" size={20} /> 
                        整改任务提醒
                    </h3>
                    <p className="text-slate-300 text-sm mt-2 opacity-90">
                        当前共有 <span className="text-amber-400 font-bold">{stats.partial + stats.nonCompliant}</span> 项检查点需要整改或补充材料。
                    </p>
                </div>
                <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> 导出自检报告 (PDF)
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-450px)] min-h-[400px]">
            {/* Sidebar Categories */}
            <div className="w-full lg:w-64 bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible shrink-0 h-fit">
                <button 
                    onClick={() => setActiveCategory('ALL')}
                    className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium mb-1 transition-colors shrink-0 ${activeCategory === 'ALL' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <span>全部检查项</span>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
                </button>
                {CATEGORIES.map(cat => {
                    const count = items.filter(i => i.category === cat).length;
                    const alertCount = items.filter(i => i.category === cat && i.status !== InspectionStatus.COMPLIANT).length;
                    return (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium mb-1 transition-colors shrink-0 ${activeCategory === cat ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-2">
                                {alertCount > 0 && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                <span>{cat}</span>
                            </div>
                            <span className="text-slate-400 text-xs">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Checklist */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Filter size={16} className="text-blue-600" />
                        检查清单: {activeCategory === 'ALL' ? '所有项目' : activeCategory}
                    </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition-shadow group">
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 font-mono">
                                            {item.id}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center">
                                            <ChevronRight size={12} /> {item.category}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-2">{item.requirement}</h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 mb-2">
                                        <span className="font-bold text-slate-500 text-xs block mb-1">检查要点 (Audit Point):</span>
                                        {item.auditPoint}
                                    </p>
                                </div>

                                <div className="w-full md:w-48 flex flex-col gap-2 shrink-0">
                                    <span className="text-xs font-bold text-slate-400">自检结论</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => handleStatusChange(item.id, InspectionStatus.COMPLIANT)}
                                            className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border ${item.status === InspectionStatus.COMPLIANT ? 'bg-green-500 text-white border-green-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            达标
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(item.id, InspectionStatus.NON_COMPLIANT)}
                                            className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border ${item.status === InspectionStatus.NON_COMPLIANT ? 'bg-red-500 text-white border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            未达标
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(item.id, InspectionStatus.PARTIAL)}
                                            className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border ${item.status === InspectionStatus.PARTIAL ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            部分
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(item.id, InspectionStatus.NOT_APPLICABLE)}
                                            className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border ${item.status === InspectionStatus.NOT_APPLICABLE ? 'bg-slate-500 text-white border-slate-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            不适用
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-right mt-1">更新于: {item.lastChecked || '未检查'}</p>
                                </div>
                            </div>

                            {/* Remarks Section */}
                            {(item.status !== InspectionStatus.COMPLIANT && item.status !== InspectionStatus.NOT_APPLICABLE) && (
                                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
                                    {editingItem === item.id ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea 
                                                value={editRemark}
                                                onChange={(e) => setEditRemark(e.target.value)}
                                                className="w-full p-3 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={3}
                                                placeholder="请填写具体的整改措施、问题描述或预计完成时间..."
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setEditingItem(null)}
                                                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded"
                                                >
                                                    取消
                                                </button>
                                                <button 
                                                    onClick={() => saveRemark(item.id)}
                                                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <Save size={12} /> 保存备注
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            onClick={() => startEditing(item)}
                                            className="bg-amber-50 border border-amber-100 rounded-lg p-3 cursor-pointer hover:bg-amber-100 transition-colors group/remark"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                                                    <Edit3 size={10} /> 
                                                    整改措施/备注
                                                </span>
                                                <span className="text-[10px] text-amber-600 opacity-0 group-hover/remark:opacity-100 transition-opacity">点击编辑</span>
                                            </div>
                                            <p className="text-sm text-amber-900 italic">
                                                {item.remark || "暂无备注信息... (点击此处添加)"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderDataInterfaceView = () => (
      <div className="animate-in fade-in slide-in-from-bottom-2 h-[calc(100vh-200px)] flex flex-col">
          {/* Control Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Database size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">现场检查数据接口 (300号文)</h3>
                    <p className="text-xs text-slate-500">银发〔2017〕300号 - 反洗钱现场检查数据接口规范</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">提取范围:</span>
                    <select className="bg-transparent text-sm font-medium text-slate-700 outline-none">
                        <option>近 1 年</option>
                        <option>近 2 年</option>
                        <option>自定义</option>
                    </select>
                </div>
                <button 
                    onClick={handleGenerateData}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                    {isGenerating ? '生成中...' : '批量导出 XML 包'}
                </button>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
               {/* Table List Sidebar */}
               <div className="w-full lg:w-72 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm">
                        标准数据表清单
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {MOCK_STANDARD_TABLES.map(table => (
                            <button
                                key={table.id}
                                onClick={() => setSelectedTableId(table.id)}
                                className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                                    selectedTableId === table.id 
                                    ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold text-sm ${selectedTableId === table.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {table.tableCode}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                        {table.recordCount > 1000 ? (table.recordCount / 1000).toFixed(1) + 'k' : table.recordCount}
                                    </span>
                                </div>
                                <div className={`text-xs ${selectedTableId === table.id ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {table.tableName}
                                </div>
                            </button>
                        ))}
                    </div>
               </div>

               {/* Data Preview Area */}
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                         <div className="flex items-center gap-2">
                            <FileSpreadsheet size={18} className="text-green-600" />
                            <span className="font-bold text-slate-800">{selectedTable?.tableName} ({selectedTable?.tableCode})</span>
                         </div>
                         <span className="text-xs text-slate-400">{selectedTable?.description}</span>
                    </div>

                    <div className="flex-1 overflow-auto relative">
                        {previewData.length > 0 ? (
                             <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                                    <tr>
                                        {Object.keys(previewData[0]).slice(0, 8).map(key => (
                                            <th key={key} className="px-4 py-3 font-medium border-b border-slate-200 bg-slate-50 capitalize">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {previewData.slice(0, 50).map((row: any, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50">
                                            {Object.values(row).slice(0, 8).map((val: any, vIdx) => (
                                                <td key={vIdx} className="px-4 py-2 text-slate-600 border-r border-slate-50 last:border-0 max-w-[200px] truncate">
                                                    {typeof val === 'object' ? JSON.stringify(val).slice(0, 20) + '...' : String(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col">
                                <Database size={48} className="mb-2 opacity-20" />
                                <p>暂无预览数据或该表为空</p>
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400">
                        仅显示前 50 条记录供预览。完整数据请使用导出功能。
                    </div>
               </div>
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">现场检查支持平台</h1>
                <p className="text-sm text-slate-500">提供监管现场检查所需的自查清单及标准数据接口导出</p>
            </div>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                <button 
                    onClick={() => setActiveTab('checklist')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'checklist' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    合规自检 (Checklist)
                </button>
                <button 
                    onClick={() => setActiveTab('data_interface')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'data_interface' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    数据接口 (300号文)
                </button>
            </div>
        </div>

        {activeTab === 'checklist' ? renderChecklistView() : renderDataInterfaceView()}
    </div>
  );
};
