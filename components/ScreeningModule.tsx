
import React, { useState, useEffect } from 'react';
import { Search, Loader2, ShieldAlert, User, Building2, Globe, AlertTriangle, CheckCircle2, Info, AlertOctagon, Eye, Filter } from 'lucide-react';
import { ScreeningHit, ScreeningCategory, MonitoredEntity, RiskLevel } from '../types';
import { MOCK_SCREENING_HITS_DB, MOCK_MONITORED_ENTITIES } from '../constants';

export const ScreeningModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quick' | 'monitoring'>('quick');
  
  // Quick Screen State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ScreeningHit[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Monitoring State
  const [monitoredEntities, setMonitoredEntities] = useState<MonitoredEntity[]>(MOCK_MONITORED_ENTITIES);
  const [monitorFilter, setMonitorFilter] = useState<'all' | 'active' | 'critical'>('all');

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API delay
    setTimeout(() => {
      // Simple mock search logic
      const hits: ScreeningHit[] = [];
      Object.keys(MOCK_SCREENING_HITS_DB).forEach(key => {
          if (searchTerm.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(searchTerm.toLowerCase())) {
              hits.push(...MOCK_SCREENING_HITS_DB[key]);
          }
      });
      
      setSearchResults(hits);
      setIsSearching(false);
    }, 1000);
  };

  const getRiskBadge = (score: number) => {
      if (score >= 90) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200">极高匹配 ({score}%)</span>;
      if (score >= 70) return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">高度匹配 ({score}%)</span>;
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">潜在匹配 ({score}%)</span>;
  };

  const getCategoryIcon = (cat: ScreeningCategory) => {
      switch (cat) {
          case ScreeningCategory.SANCTION: return <AlertOctagon className="text-red-600" size={18} />;
          case ScreeningCategory.PEP: return <User className="text-blue-600" size={18} />;
          case ScreeningCategory.ADVERSE_MEDIA: return <Globe className="text-amber-600" size={18} />;
          case ScreeningCategory.WATCHLIST: return <Eye className="text-slate-600" size={18} />;
      }
  };

  const filteredMonitoring = monitoredEntities.filter(entity => {
      if (monitorFilter === 'active') return entity.status === '监控中';
      if (monitorFilter === 'critical') return entity.riskLevel === RiskLevel.CRITICAL || entity.riskLevel === RiskLevel.HIGH;
      return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">智能名单筛查</h2>
                <p className="text-sm text-slate-500">集成制裁名单、政治公众人物(PEP)、不良媒体及黑名单数据库</p>
            </div>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                <button 
                    onClick={() => setActiveTab('quick')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'quick' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    快速筛查
                </button>
                <button 
                    onClick={() => setActiveTab('monitoring')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'monitoring' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    持续监控管理
                </button>
            </div>
        </div>

        {/* Quick Screen Tab */}
        {activeTab === 'quick' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Search size={18} className="text-blue-500" /> 实时检索
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">实体名称 / 姓名</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="输入姓名 (e.g., Vladimir)" 
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Additional Filters (Mock UI) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">国籍/地区 (可选)</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                                        <option value="">所有地区</option>
                                        <option value="CN">中国</option>
                                        <option value="US">美国</option>
                                        <option value="RU">俄罗斯</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">出生日期 (可选)</label>
                                    <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                    <input type="checkbox" defaultChecked className="accent-blue-600" />
                                    模糊匹配 (Fuzzy Match)
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" defaultChecked className="accent-blue-600" />
                                    包含媒体负面新闻
                                </label>
                            </div>

                            <button 
                                onClick={handleSearch}
                                disabled={isSearching || !searchTerm}
                                className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                开始筛查
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><Info size={16} /> 筛查范围说明</h4>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>OFAC SDN List (美国财政部海外资产控制办公室)</li>
                            <li>UN Consolidated List (联合国安理会制裁名单)</li>
                            <li>EU Sanctions List (欧盟综合制裁名单)</li>
                            <li>Global Politically Exposed Persons (全球 PEP)</li>
                            <li>Interpol Red Notices (国际刑警红色通缉令)</li>
                            <li>Global Adverse Media (全球多语言负面新闻)</li>
                        </ul>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2">
                    {!hasSearched ? (
                        <div className="h-full bg-white rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 p-12">
                            <ShieldAlert size={64} className="mb-4 opacity-20" />
                            <p className="font-medium">请输入名称并点击开始筛查以查看结果</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">筛查结果概览</h3>
                                <span className="text-xs text-slate-500">搜索词: "{searchTerm}"</span>
                            </div>
                            
                            {searchResults && searchResults.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {/* Summary Stats */}
                                    <div className="p-4 grid grid-cols-4 gap-4 bg-slate-50/50">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                                            <p className="text-xs text-slate-500 mb-1">总命中</p>
                                            <p className="text-xl font-bold text-slate-800">{searchResults.length}</p>
                                        </div>
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                                            <p className="text-xs text-red-600 mb-1">制裁命中</p>
                                            <p className="text-xl font-bold text-red-700">{searchResults.filter(r => r.category === ScreeningCategory.SANCTION).length}</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                                            <p className="text-xs text-blue-600 mb-1">PEP 命中</p>
                                            <p className="text-xl font-bold text-blue-700">{searchResults.filter(r => r.category === ScreeningCategory.PEP).length}</p>
                                        </div>
                                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-center">
                                            <p className="text-xs text-amber-600 mb-1">负面媒体</p>
                                            <p className="text-xl font-bold text-amber-700">{searchResults.filter(r => r.category === ScreeningCategory.ADVERSE_MEDIA).length}</p>
                                        </div>
                                    </div>

                                    {/* Result List */}
                                    <div className="p-4 space-y-4">
                                        {searchResults.map(hit => (
                                            <div key={hit.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                                <div className="mt-1 p-2 bg-white rounded-full border border-slate-200 shadow-sm">
                                                    {getCategoryIcon(hit.category)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                                {hit.name}
                                                                <span className="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded">{hit.category}</span>
                                                            </h4>
                                                            <p className="text-xs text-slate-500 mt-1">来源: {hit.sourceList}</p>
                                                        </div>
                                                        {getRiskBadge(hit.matchScore)}
                                                    </div>
                                                    
                                                    <p className="text-sm text-slate-700 mt-3 bg-slate-50 p-3 rounded border border-slate-100">
                                                        {hit.details}
                                                    </p>
                                                    
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-xs text-slate-400">收录日期: {hit.dateAdded}</span>
                                                        {hit.url && (
                                                            <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                                查看原文 <Globe size={12} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-slate-800">未发现风险命中</h4>
                                    <p className="text-slate-500">在当前所有启用的数据库中未找到与 "{searchTerm}" 匹配的记录。</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
            <div className="space-y-6">
                {/* Monitoring Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium">监控中实体总数</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{monitoredEntities.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium">今日新增预警</p>
                        <h3 className="text-3xl font-bold text-red-600 mt-2">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium">上次全量扫描</p>
                        <h3 className="text-lg font-bold text-slate-800 mt-4">2023-10-25 04:00</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-blue-200 font-medium hover:bg-blue-700 transition-colors">
                            + 添加监控实体
                        </button>
                    </div>
                </div>

                {/* Entity List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Eye size={18} className="text-blue-600" /> 监控名单管理
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setMonitorFilter('all')}
                                className={`px-3 py-1 rounded text-xs font-medium border ${monitorFilter === 'all' ? 'bg-white text-blue-600 border-blue-200 shadow-sm' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100'}`}
                            >
                                全部
                            </button>
                            <button 
                                onClick={() => setMonitorFilter('active')}
                                className={`px-3 py-1 rounded text-xs font-medium border ${monitorFilter === 'active' ? 'bg-white text-green-600 border-green-200 shadow-sm' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100'}`}
                            >
                                仅监控中
                            </button>
                            <button 
                                onClick={() => setMonitorFilter('critical')}
                                className={`px-3 py-1 rounded text-xs font-medium border ${monitorFilter === 'critical' ? 'bg-white text-red-600 border-red-200 shadow-sm' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100'}`}
                            >
                                高风险实体
                            </button>
                        </div>
                    </div>
                    
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">实体名称</th>
                                <th className="px-6 py-4">类型</th>
                                <th className="px-6 py-4">加入日期</th>
                                <th className="px-6 py-4">风险等级</th>
                                <th className="px-6 py-4">监控状态</th>
                                <th className="px-6 py-4">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMonitoring.map(entity => (
                                <tr key={entity.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                        {entity.type === '企业' ? <Building2 size={16} className="text-slate-400" /> : <User size={16} className="text-slate-400" />}
                                        {entity.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{entity.type}</td>
                                    <td className="px-6 py-4 text-slate-500">{entity.addedDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            entity.riskLevel === RiskLevel.CRITICAL ? 'bg-red-100 text-red-700' : 
                                            entity.riskLevel === RiskLevel.HIGH ? 'bg-orange-100 text-orange-700' :
                                            entity.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-100 text-amber-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {entity.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${entity.status === '监控中' ? 'text-green-600' : 'text-slate-400'}`}>
                                            <div className={`w-2 h-2 rounded-full ${entity.status === '监控中' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                            {entity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:underline font-medium text-xs">详情</button>
                                        <span className="text-slate-300 mx-2">|</span>
                                        <button className="text-slate-500 hover:text-slate-800 hover:underline text-xs">
                                            {entity.status === '监控中' ? '暂停' : '恢复'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};
