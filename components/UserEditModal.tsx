
import React, { useState, useEffect } from 'react';
import { SystemUser } from '../types';
import { AVAILABLE_PERMISSIONS } from '../constants';
import { X, Save, User, Shield, Briefcase } from 'lucide-react';

interface UserEditModalProps {
  user: SystemUser | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (user: SystemUser) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, isCreating, onClose, onSave }) => {
  const defaultUser: SystemUser = {
    id: `U${Date.now()}`,
    username: '',
    role: '分析员',
    department: '',
    lastLogin: '未登录',
    status: '启用',
    permissions: ['DATA_QUERY']
  };

  const [formData, setFormData] = useState<SystemUser>(user ? { ...user } : defaultUser);

  const handlePermissionToggle = (permKey: string) => {
    const currentPerms = formData.permissions || [];
    if (currentPerms.includes(permKey)) {
      setFormData({ ...formData, permissions: currentPerms.filter(p => p !== permKey) });
    } else {
      setFormData({ ...formData, permissions: [...currentPerms, permKey] });
    }
  };

  const handleRoleChange = (role: any) => {
    // Auto-assign default permissions based on role
    let defaultPerms: string[] = [];
    if (role === '管理员') defaultPerms = ['ALL'];
    else if (role === '合规主管') defaultPerms = ['REVIEW', 'REPORT_SUBMIT', 'MODEL_VIEW', 'ALERT_HANDLE', 'DATA_QUERY'];
    else if (role === '分析员') defaultPerms = ['ALERT_HANDLE', 'DATA_QUERY'];

    setFormData({ ...formData, role, permissions: defaultPerms });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{isCreating ? '新增系统用户' : '编辑用户权限'}</h2>
            <p className="text-sm text-slate-500">{isCreating ? '创建新账号并分配初始权限' : `管理 ${formData.username} 的角色与功能访问权限`}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">用户名 (登录账号)</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            disabled={!isCreating}
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="例如: zhangsan"
                        />
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">所属部门</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={16} />
                         <input 
                            type="text" 
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="例如: 合规部"
                        />
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">系统角色</label>
                    <select 
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="管理员">管理员</option>
                        <option value="合规主管">合规主管</option>
                        <option value="分析员">分析员</option>
                    </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">账号状态</label>
                    <div className="flex items-center gap-3 mt-2">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="status" 
                                checked={formData.status === '启用'} 
                                onChange={() => setFormData({...formData, status: '启用'})}
                                className="accent-blue-600"
                            />
                            <span className="text-sm text-slate-700">启用</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="status" 
                                checked={formData.status === '禁用'} 
                                onChange={() => setFormData({...formData, status: '禁用'})}
                                className="accent-red-600"
                            />
                            <span className="text-sm text-slate-700">禁用</span>
                         </label>
                    </div>
                </div>
            </div>

            {/* Permission Config */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" /> 
                    详细权限配置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                        const isChecked = formData.permissions?.includes(perm.key);
                        return (
                            <label 
                                key={perm.key} 
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-white border-blue-300 shadow-sm' : 'border-transparent hover:bg-white hover:border-slate-200'}`}
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                    {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={isChecked}
                                    onChange={() => handlePermissionToggle(perm.key)}
                                />
                                <span className={`text-sm ${isChecked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{perm.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Save size={18} />
            {isCreating ? '创建用户' : '保存配置'}
          </button>
        </div>
      </div>
    </div>
  );
};
