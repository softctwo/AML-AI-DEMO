import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between`}>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {trend && <p className="text-xs font-medium mt-2 text-emerald-600">{trend}</p>}
      </div>
      <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
        {icon}
      </div>
    </div>
  );
};