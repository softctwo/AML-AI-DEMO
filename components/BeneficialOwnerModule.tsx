
import React, { useState } from 'react';
import { Customer, BeneficialOwner, ShareholderNode, CustomerStructure } from '../types';
import { MOCK_CUSTOMERS, MOCK_STRUCTURES } from '../constants';
import { Users, Search, Building2, User, CheckCircle2, AlertTriangle, ArrowRight, FileCheck, Shield, Calendar, ChevronRight, Info } from 'lucide-react';

// --- Visualization Components ---

interface TreeNodeProps {
    node: ShareholderNode;
    depth?: number;
    isLast?: boolean;
}

const ShareholderTree: React.FC<TreeNodeProps> = ({ node, depth = 0 }) => {
    return (
        <div className="flex flex-col items-center">
            {/* Node Card */}
            <div className={`relative p-4 rounded-lg border shadow-sm min-w-[200px] flex flex-col items-center gap-2 z-10 transition-all hover:scale-105 ${node.isUBO ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-100' : 'bg-white text-slate-800 border-slate-200'}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                    {node.type === '企业' ? <Building2 size={16} /> : <User size={16} />}
                    {node.name}
                </div>
                <div className="flex items-center gap-4 text-xs w-full justify-between border-t border-white/20 pt-2">
                    <span className={`${node.isUBO ? 'text-blue-100' : 'text-slate-500'}`}>{node.country || 'CN'}</span>
                    <span className={`font-mono font-bold ${node.isUBO ? 'text-white' : 'text-blue-600'}`}>{node.ratio}% 持股</span>
                </div>
                {node.isUBO && (
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white">
                        UBO
                    </div>
                )}
            </div>

            {/* Children */}
            {node.children && node.children.length > 0 && (
                <div className="flex flex-col items-center mt-6 relative">
                    {/* Vertical Line from Parent */}
                    <div className="absolute -top-6 left-1/2 w-px h-6 bg-slate-300"></div>
                    
                    <div className="flex gap-8 pt-4 relative">
                        {/* Horizontal Connector Line */}
                        {node.children.length > 1 && (
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-slate-300" style={{width: `calc(100% - ${100 / node.children.length}%)`}}></div>
                        )}

                        {node.children.map((child, index) => (
                            <div key={child.id} className="flex flex-col items-center relative">
                                {/* Vertical Line to Child */}
                                <div className="absolute -top-4 left-1/2 w-px h-4 bg-slate-300"></div>
                                <ShareholderTree node={child} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Module Component ---

export const BeneficialOwnerModule: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter corporate customers only for UBO management
  const corporateCustomers = MOCK_CUSTOMERS.filter(c => 
    c.type === '企业' && 
    (c.name.includes(searchTerm) || c.id.includes(searchTerm))
  );

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId);
  const structure = MOCK_STRUCTURES.find(s => s.customerId === selectedCustomerId);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in">
        {/* Left Sidebar: Customer List */}
        <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" /> 对公客户列表
                </h3>
                <div className="mt-3 relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索企业名称..." 
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {corporateCustomers.map(c => {
                    const isSelected = c.id === selectedCustomerId;
                    const uboCount = c.beneficialOwners?.length || 0;
                    const pendingCount = c.beneficialOwners?.filter(u => u.status === '待核实').length || 0;

                    return (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCustomerId(c.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                                isSelected 
                                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm truncate ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{c.name}</span>
                                {pendingCount > 0 && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold">待办</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>ID: {c.id}</span>
                                <span className="flex items-center gap-1">
                                    <Users size={12} /> {uboCount}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {selectedCustomer ? (
                <>
                    {/* Top: UBO Identification & Verification Panel */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Shield size={18} className="text-blue-600" /> 受益所有人 (UBO) 认定与核实
                            </h3>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                依据: 银发[2018]164号 / 235号文
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 font-medium text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">姓名</th>
                                        <th className="px-4 py-3">角色/持股</th>
                                        <th className="px-4 py-3">证件类型/号码</th>
                                        <th className="px-4 py-3">核实状态</th>
                                        <th className="px-4 py-3">有效期</th>
                                        <th className="px-4 py-3 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedCustomer.beneficialOwners && selectedCustomer.beneficialOwners.length > 0 ? (
                                        selectedCustomer.beneficialOwners.map((ubo, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-bold text-slate-800">{ubo.name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-700 font-medium">{ubo.role}</span>
                                                        <span className="text-xs text-blue-600">{ubo.ratio > 0 ? `持股 ${ubo.ratio}%` : '控制人'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {ubo.idType ? `${ubo.idType}: ${ubo.idNumber || '***'}` : <span className="text-slate-400 italic">未录入</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                        ubo.status === '已核实' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        ubo.status === '待核实' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {ubo.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">
                                                    {ubo.expiryDate || '2030-12-31'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {ubo.status === '待核实' ? (
                                                        <button className="text-blue-600 hover:underline font-medium text-xs">
                                                            上传证件
                                                        </button>
                                                    ) : (
                                                        <button className="text-slate-400 hover:text-blue-600 text-xs">
                                                            查看档案
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                暂未认定受益所有人，请依据下方股权结构图进行添加。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom: Equity Structure Visualization */}
                    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Users size={18} className="text-blue-600" /> 股权穿透图谱 (Penetration Graph)
                            </h3>
                            {structure && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={14} /> 数据更新: {structure.updateDate}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                            {structure ? (
                                <ShareholderTree node={structure.rootNode} />
                            ) : (
                                <div className="text-center text-slate-400 mt-20">
                                    <Building2 size={64} className="mx-auto mb-4 opacity-20" />
                                    <h4 className="text-lg font-medium">暂无股权结构数据</h4>
                                    <p className="text-sm opacity-70">请联系数据中心获取该客户的工商/注册信息。</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-full bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Shield size={64} className="mb-6 opacity-20 text-blue-500" />
                    <h3 className="text-xl font-bold text-slate-600">请选择一个对公客户</h3>
                    <p className="text-slate-500 mt-2">查看其股权架构及受益所有人核实情况</p>
                </div>
            )}
        </div>
    </div>
  );
};
