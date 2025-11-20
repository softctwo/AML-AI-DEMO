
import React, { useState } from 'react';
import { Transaction, TransactionType, ReportStatus, RiskLevel } from '../types';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_LINKS } from '../constants';
import { X, ArrowRight, Globe, Monitor, CreditCard, FileText, Calendar, AlertTriangle, ExternalLink, UserCircle, GitCommit, Activity } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
  onViewCustomer: (customerId: string) => void;
}

// --- Scheme A: Link Analysis Graph Component ---
const LinkAnalysisGraph: React.FC = () => {
    const nodes = MOCK_GRAPH_NODES;
    const links = MOCK_GRAPH_LINKS;
    
    // Static positions for simplicity in this prototype
    // Center: 300, 150
    // Left (Upstream): x=50
    // Right (Downstream): x=550
    const positions: Record<string, {x: number, y: number}> = {
        'N1': { x: 50, y: 80 },
        'N2': { x: 50, y: 220 },
        'CENTER': { x: 300, y: 150 },
        'N3': { x: 550, y: 80 },
        'N4': { x: 550, y: 220 },
    };

    const getRiskColor = (level: RiskLevel) => {
        switch(level) {
            case RiskLevel.CRITICAL: return '#ef4444'; // Red
            case RiskLevel.HIGH: return '#f97316'; // Orange
            case RiskLevel.MEDIUM: return '#eab308'; // Yellow
            default: return '#3b82f6'; // Blue
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner relative h-[400px]">
            <div className="absolute top-4 left-4 z-10 bg-slate-800/80 p-2 rounded border border-slate-700 backdrop-blur-sm">
                <h4 className="text-slate-300 text-xs font-bold flex items-center gap-2">
                    <Activity size={14} className="text-blue-400"/> 资金穿透图谱 (Beta)
                </h4>
                <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> 高风险</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 低风险</span>
                </div>
            </div>

            <svg width="100%" height="100%" viewBox="0 0 600 300" className="w-full h-full">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="18" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Links */}
                {links.map((link, idx) => {
                    const start = positions[link.source];
                    const end = positions[link.target];
                    const pathD = `M ${start.x} ${start.y} C ${start.x + 100} ${start.y}, ${end.x - 100} ${end.y}, ${end.x} ${end.y}`;
                    
                    return (
                        <g key={idx}>
                            {/* Path Background */}
                            <path d={pathD} fill="none" stroke="#334155" strokeWidth="4" />
                            {/* Path Flow Animation */}
                            <path d={pathD} fill="none" stroke={link.isSuspicious ? "#ef4444" : "#94a3b8"} strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" className="animate-dash-flow opacity-70" />
                            {/* Label */}
                            <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 10} textAnchor="middle" fill="#94a3b8" fontSize="10" className="bg-slate-900">
                                {link.amount.toLocaleString()}
                            </text>
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                    const pos = positions[node.id];
                    return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                            {/* Outer Glow ring for Focus node */}
                            {node.isFocus && (
                                <circle r="25" fill="none" stroke="white" strokeWidth="1" opacity="0.3" className="animate-ping" />
                            )}
                            {/* Main Circle */}
                            <circle r="15" fill={getRiskColor(node.riskLevel)} stroke="white" strokeWidth="2" filter="url(#glow)" />
                            {/* Text Label */}
                            <text y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{node.name}</text>
                            <text y="42" textAnchor="middle" fill="#64748b" fontSize="9">{node.type}</text>
                        </g>
                    );
                })}
            </svg>

            {/* CSS Animation for SVG Dash array */}
            <style>{`
                @keyframes dash-flow {
                    to {
                        stroke-dashoffset: -20;
                    }
                }
                .animate-dash-flow {
                    animation: dash-flow 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose, onViewCustomer }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'link_analysis'>('details');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
             <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-800">交易详情</h2>
                <span className="font-mono text-sm text-slate-500 bg-white px-2 py-1 border border-slate-200 rounded">{transaction.id}</span>
             </div>
             <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${transaction.type === TransactionType.SUSPICIOUS ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {transaction.type}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">{transaction.date}</span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6">
             <button 
                onClick={() => setActiveTab('details')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
             >
                 <FileText size={16} /> 基础详情
             </button>
             <button 
                onClick={() => setActiveTab('link_analysis')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'link_analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
             >
                 <GitCommit size={16} /> 资金链路图谱
             </button>
        </div>

        <div className="overflow-y-auto p-6 bg-slate-50/50 flex-1">
            {activeTab === 'link_analysis' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <LinkAnalysisGraph />
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <Activity size={16} /> 分析发现
                        </h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            系统检测到该笔交易属于典型的 <strong>"分散转入、集中转出"</strong> 模式。
                            上游资金来自多个低风险个体户，汇聚至当前账户后，在30分钟内迅速全额转出至境外高风险博彩相关账户 (Downstream N3)。
                            <br/>
                            <strong>建议：</strong>重点核查下游收款方 N3 的背景及资金用途。
                        </p>
                    </div>
                </div>
            ) : (
                // Basic Details View
                <>
                    {/* Visual Flow */}
                    <div className="flex items-stretch gap-4 mb-6">
                        {/* Sender */}
                        <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">付款方 / Sender</span>
                                    <button 
                                        onClick={() => onViewCustomer(transaction.sender.id)}
                                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors"
                                    >
                                        <UserCircle size={12} />
                                        {transaction.sender.id}
                                        <ExternalLink size={10} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mt-2">{transaction.sender.name}</h3>
                                <p className="text-sm text-slate-500">{transaction.sender.country}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">账号</span>
                                    <span className="font-mono text-slate-600">6222****8888</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">开户行</span>
                                    <span className="text-slate-600">总行营业部</span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Info (Center) */}
                        <div className="w-48 flex flex-col items-center justify-center text-center">
                            <div className="mb-2">
                                <p className="text-2xl font-bold text-blue-600 font-mono">{transaction.amount.toLocaleString()}</p>
                                <p className="text-xs font-bold text-slate-400">{transaction.currency}</p>
                            </div>
                            <div className="w-full h-0.5 bg-slate-300 relative my-2">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-1">
                                    <ArrowRight size={20} className="text-slate-400" />
                                </div>
                            </div>
                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded mt-2">
                                {transaction.channel || '未知渠道'}
                            </span>
                        </div>

                        {/* Recipient */}
                        <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">收款方 / Recipient</span>
                                    <button 
                                        onClick={() => onViewCustomer(transaction.recipient.id)}
                                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors"
                                    >
                                        <UserCircle size={12} />
                                        {transaction.recipient.id}
                                        <ExternalLink size={10} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mt-2">{transaction.recipient.name}</h3>
                                <p className="text-sm text-slate-500">{transaction.recipient.country}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">账号</span>
                                    <span className="font-mono text-slate-600">4555****9999</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">开户行</span>
                                    <span className="text-slate-600">境外/跨行</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Metadata */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6 overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">技术元数据</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1"><Globe size={12} /> IP 地址</span>
                                <span className="text-sm font-mono text-slate-700">{transaction.ipAddress || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1"><Monitor size={12} /> 设备指纹</span>
                                <span className="text-sm font-mono text-slate-700 truncate" title={transaction.deviceId}>{transaction.deviceId || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1"><FileText size={12} /> 交易附言</span>
                                <span className="text-sm text-slate-700">{transaction.summary || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1"><CreditCard size={12} /> 支付网关</span>
                                <span className="text-sm text-slate-700">CNAPS 2代</span>
                            </div>
                        </div>
                    </div>

                    {/* Trigger Rule */}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-amber-800 mb-1">触发监测规则</h4>
                            <p className="text-sm text-amber-700">{transaction.triggerRule}</p>
                            {transaction.aiAnalysis && (
                                <div className="mt-3 pt-3 border-t border-amber-200/50">
                                    <span className="text-xs font-bold text-amber-800 block mb-1">AI 初步分析结论:</span>
                                    <p className="text-xs text-amber-800/80 line-clamp-2">{transaction.aiAnalysis}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

        </div>
      </div>
    </div>
  );
};
