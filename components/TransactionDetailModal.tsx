
import React from 'react';
import { Transaction, TransactionType, ReportStatus } from '../types';
import { X, ArrowRight, Globe, Monitor, CreditCard, FileText, Calendar, AlertTriangle, ExternalLink, UserCircle } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
  onViewCustomer: (customerId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose, onViewCustomer }) => {
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

        <div className="overflow-y-auto p-6 bg-slate-50/50">
            
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

        </div>
      </div>
    </div>
  );
};
