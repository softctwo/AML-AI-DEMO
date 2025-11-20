
import React, { useState } from 'react';
import { Customer, RiskLevel, TransactionType } from '../types';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../constants';
import { X, User, Building2, MapPin, Briefcase, Calendar, ShieldAlert, AlertTriangle, History, Globe, Users, LayoutGrid, FileText, Wallet, ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'accounts' | 'transactions' | 'risk'>('overview');

  // Filter accounts for this customer
  const customerAccounts = MOCK_ACCOUNTS.filter(acc => acc.customerId === customer.id);

  // Filter transactions for this customer
  const customerTransactions = MOCK_TRANSACTIONS.filter(
    tx => tx.sender.id === customer.id || tx.recipient.id === customer.id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getRiskColor = (rating: RiskLevel) => {
    if (rating === RiskLevel.CRITICAL) return 'bg-red-600 text-white';
    if (rating === RiskLevel.HIGH) return 'bg-red-100 text-red-700';
    if (rating === RiskLevel.MEDIUM) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header with Gradient Background */}
        <div className="bg-slate-900 text-white p-6 shrink-0">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${customer.type === '企业' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                        {customer.type === '企业' ? <Building2 size={32} /> : <User size={32} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            {customer.name}
                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide ${getRiskColor(customer.riskRating)}`}>
                                {customer.riskRating}
                            </span>
                        </h2>
                        <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {customer.country}</span>
                            <span className="flex items-center gap-1"><Briefcase size={14} /> {customer.industry || 'N/A'}</span>
                            <span className="flex items-center gap-1 font-mono"><LayoutGrid size={14} /> ID: {customer.id}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 shrink-0 overflow-x-auto">
            {[
                { id: 'overview', label: '基本画像', icon: FileText },
                { id: 'structure', label: '股权与关联', icon: Users },
                { id: 'accounts', label: '账户全景', icon: LayoutGrid },
                { id: 'transactions', label: '交易记录', icon: ArrowRightLeft },
                { id: 'risk', label: '风险档案', icon: ShieldAlert },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Left Column: Basic Info */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <User size={18} className="text-blue-500" /> 身份信息
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">证件/注册号码</label>
                                    <p className="font-medium text-slate-700 font-mono">{customer.idNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">注册/出生日期</label>
                                    <p className="font-medium text-slate-700">{customer.regDate || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400 block mb-1">注册/居住地址</label>
                                    <p className="font-medium text-slate-700">{customer.address || '未知地址'}</p>
                                </div>
                                {customer.legalRep && (
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">法定代表人</label>
                                        <p className="font-medium text-slate-700">{customer.legalRep}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500" /> 尽职调查摘要
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                该客户于 {customer.regDate} 建立业务关系。目前的尽职调查状态为 <span className="text-green-600 font-bold">有效</span>。
                                根据最近一次的定期复核，客户的主要经营活动与其申报的行业背景一致。无明显的跨行业经营迹象。
                                客户的主要交易对手集中在 {customer.country === 'CN' ? '国内' : '东南亚及欧美地区'}。
                            </p>
                            <div className="mt-4 flex gap-2">
                                {customer.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">风险概览</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">当前评级</span>
                                    <span className={`font-bold ${customer.riskRating.includes('高') ? 'text-red-600' : 'text-slate-700'}`}>{customer.riskRating}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">可疑报告(STR)</span>
                                    <span className="font-bold text-slate-700">0 次</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">大额报告(LCTR)</span>
                                    <span className="font-bold text-slate-700">12 次</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">黑名单命中</span>
                                    <span className="font-bold text-green-600">无</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Structure Tab */}
            {activeTab === 'structure' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    {customer.type === '个人' ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <User size={64} className="mb-4 opacity-20" />
                            <p>个人客户无复杂股权结构信息。</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Users size={18} className="text-blue-500" /> 受益所有人 (UBO)
                                </h3>
                                {customer.beneficialOwners && customer.beneficialOwners.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 font-medium text-slate-500">
                                                <tr>
                                                    <th className="px-4 py-3">姓名/名称</th>
                                                    <th className="px-4 py-3">持股比例</th>
                                                    <th className="px-4 py-3">控制方式/角色</th>
                                                    <th className="px-4 py-3">国籍/注册地</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {customer.beneficialOwners.map((ubo, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 font-medium text-slate-800">{ubo.name}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-500" style={{width: `${ubo.ratio}%`}}></div>
                                                                </div>
                                                                {ubo.ratio}%
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">{ubo.role}</td>
                                                        <td className="px-4 py-3 text-slate-600">{ubo.country}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">暂无穿透后的受益所有人信息。</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {customerAccounts.length > 0 ? customerAccounts.map(acc => (
                        <div key={acc.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                                <Wallet size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-mono font-bold text-slate-800">{acc.accountNo}</h4>
                                        <p className="text-xs text-slate-500">{acc.branch || '总行营业部'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${acc.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {acc.status}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-2xl font-bold text-slate-900">{acc.balance.toLocaleString()}</span>
                                    <span className="text-sm text-slate-500 font-medium">{acc.currency}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
                                    <div>
                                        <span className="text-slate-400 block">开户日期</span>
                                        <span className="text-slate-600 font-medium">{acc.openDate}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">日均余额</span>
                                        <span className="text-slate-600 font-medium">{(acc.avgDailyBalance || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center py-12 text-slate-500">
                            该客户名下暂无关联账户。
                        </div>
                    )}
                </div>
            )}

            {/* Transactions Tab (New) */}
            {activeTab === 'transactions' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <ArrowRightLeft size={18} className="text-blue-500" /> 历史交易记录
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Search size={14} />
                            <span>共找到 {customerTransactions.length} 条相关记录</span>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 font-medium text-slate-500">
                            <tr>
                                <th className="px-6 py-3">交易时间</th>
                                <th className="px-6 py-3">交易流水号</th>
                                <th className="px-6 py-3">方向</th>
                                <th className="px-6 py-3 text-right">金额</th>
                                <th className="px-6 py-3">交易对手</th>
                                <th className="px-6 py-3">类型</th>
                                <th className="px-6 py-3">附言</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customerTransactions.length > 0 ? customerTransactions.map(tx => {
                                const isIncoming = tx.recipient.id === customer.id;
                                return (
                                    <tr key={tx.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-slate-500">{tx.date}</td>
                                        <td className="px-6 py-3 font-mono text-slate-600 text-xs">{tx.id}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${isIncoming ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isIncoming ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                                {isIncoming ? '汇入' : '汇出'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-3 text-right font-mono font-medium ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                                            {isIncoming ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-xs text-slate-400">{tx.currency}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 font-medium">{isIncoming ? tx.sender.name : tx.recipient.name}</span>
                                                <span className="text-xs text-slate-400">{isIncoming ? tx.sender.id : tx.recipient.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`text-xs px-1.5 py-0.5 rounded border ${tx.type === TransactionType.SUSPICIOUS ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500 text-xs max-w-[150px] truncate" title={tx.summary}>
                                            {tx.summary || '-'}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        该客户暂无相关交易记录。
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Risk Tab */}
            {activeTab === 'risk' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Negative News */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" /> 负面舆情监测
                        </h3>
                        {customer.negativeNews && customer.negativeNews.length > 0 ? (
                            <div className="space-y-4">
                                {customer.negativeNews.map((news, idx) => (
                                    <div key={idx} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-red-900 text-sm">{news.title}</h4>
                                            <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 whitespace-nowrap">
                                                {news.riskTag}
                                            </span>
                                        </div>
                                        <p className="text-xs text-red-800 mb-2 line-clamp-2">{news.snippet}</p>
                                        <div className="flex justify-between text-xs text-red-400">
                                            <span>来源: {news.source}</span>
                                            <span>{news.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-green-50 border border-green-100 rounded-lg text-center text-green-700 text-sm">
                                <ShieldAlert className="mx-auto mb-2 text-green-500" size={24} />
                                暂未监测到该客户的负面舆情信息。
                            </div>
                        )}
                    </div>

                    {/* Risk Assessment History */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <History size={18} className="text-blue-500" /> 风险评级变更记录
                        </h3>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                            {customer.riskHistory?.map((log, idx) => (
                                <div key={idx} className="ml-6 relative">
                                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-slate-800">{log.date}</span>
                                        <span className="text-xs text-slate-400">操作员: {log.operator}</span>
                                    </div>
                                    <div className="mt-1 p-3 bg-slate-50 rounded border border-slate-200">
                                        <div className="flex items-center gap-2 text-sm mb-1">
                                            <span className="text-slate-500">{log.previousLevel}</span>
                                            <span className="text-slate-300">→</span>
                                            <span className="font-bold text-slate-800">{log.newLevel}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">{log.reason}</p>
                                    </div>
                                </div>
                            ))}
                            {!customer.riskHistory && <p className="text-sm text-slate-500 ml-6">暂无历史评级变更记录。</p>}
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
