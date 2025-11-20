
import React from 'react';
import { GEO_RISK_DATA } from '../constants';
import { Tooltip, ResponsiveContainer } from 'recharts';

export const RiskHeatmap: React.FC = () => {
  // Simplified World Map SVG Path Data (Abstract representation)
  // In a real app, use react-simple-maps or similar. Here we use abstract blobs for demo purposes to keep file count low.
  
  const getRiskColor = (risk: number) => {
      if (risk > 80) return '#ef4444'; // Red
      if (risk > 50) return '#f97316'; // Orange
      return '#3b82f6'; // Blue
  };

  const getOpacity = (risk: number) => 0.4 + (risk / 200);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden relative h-full min-h-[300px] flex items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                全球资金风险热力图
            </h3>
            <p className="text-slate-400 text-xs">基于客户国籍与跨境汇款流向</p>
        </div>

        {/* Stylized Map Background */}
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-80">
            {/* Base Grid */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Abstract Continents - highly simplified for demo */}
            {/* North America */}
            <path d="M 50 50 Q 150 50 180 150 T 100 200 Z" fill="#334155" opacity="0.3" />
            {/* South America */}
            <path d="M 120 220 Q 180 220 150 350 T 120 220 Z" fill="#334155" opacity="0.3" />
            {/* Europe/Asia */}
            <path d="M 350 50 Q 600 20 700 100 T 600 250 T 400 200 Z" fill="#334155" opacity="0.3" />
            {/* Africa */}
            <path d="M 380 220 Q 450 220 420 350 T 380 220 Z" fill="#334155" opacity="0.3" />
            {/* Australia */}
            <path d="M 650 300 Q 720 300 700 350 T 650 300 Z" fill="#334155" opacity="0.3" />

            {/* Data Points (Hotspots) */}
            {/* Positions are approximated for the abstract map above */}
            {/* CN */}
            <circle cx="600" cy="120" r={GEO_RISK_DATA[0].risk / 3} fill={getRiskColor(GEO_RISK_DATA[0].risk)} fillOpacity={getOpacity(GEO_RISK_DATA[0].risk)}>
                <animate attributeName="r" values={`${GEO_RISK_DATA[0].risk / 3};${GEO_RISK_DATA[0].risk / 2};${GEO_RISK_DATA[0].risk / 3}`} dur="3s" repeatCount="indefinite" />
            </circle>
            
            {/* US */}
            <circle cx="120" cy="100" r={GEO_RISK_DATA[1].risk / 3} fill={getRiskColor(GEO_RISK_DATA[1].risk)} fillOpacity={getOpacity(GEO_RISK_DATA[1].risk)} />
            
            {/* RU */}
            <circle cx="450" cy="80" r={GEO_RISK_DATA[2].risk / 3} fill={getRiskColor(GEO_RISK_DATA[2].risk)} fillOpacity={getOpacity(GEO_RISK_DATA[2].risk)} className="animate-pulse" />

            {/* Cayman (Offshore) */}
            <circle cx="150" cy="180" r="8" fill="#facc15" stroke="white" strokeWidth="1" className="animate-ping" />
            
            {/* PH (Gambling) */}
            <circle cx="620" cy="200" r="12" fill="#ef4444" fillOpacity="0.6" />

            {/* Connecting Lines (Flows) */}
            <path d="M 600 120 Q 300 50 150 180" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="5,5" opacity="0.5">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
            </path>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-800/90 p-2 rounded text-[10px] text-slate-300 flex flex-col gap-1 border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> 极高风险 (制裁/洗钱)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> 高风险 (离岸/博彩)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> 一般业务流</div>
        </div>
    </div>
  );
};
