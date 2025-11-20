import React from 'react';
import { LayoutDashboard, AlertTriangle, FileText, ShieldCheck, Activity, Database, Sliders, TrendingUp, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: '首页概览', icon: LayoutDashboard },
    { id: 'alerts', label: '预警处理', icon: AlertTriangle },
    { id: 'data-query', label: '数据查询', icon: Database },
    { id: 'models', label: '监测模型配置', icon: Sliders },
    { id: 'risk-rating', label: '风险评级管理', icon: TrendingUp },
    { id: 'reports', label: '监管报送', icon: FileText },
    { id: 'system', label: '系统管理', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <ShieldCheck className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="font-bold text-white tracking-tight">AML 哨兵 AI</h1>
          <p className="text-xs text-slate-500">智能反洗钱系统</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg">
            <Activity className="text-green-400 w-5 h-5 animate-pulse" />
            <div>
                <p className="text-xs text-slate-400">系统状态</p>
                <p className="text-sm font-bold text-green-400">运行正常</p>
            </div>
        </div>
      </div>
    </div>
  );
};