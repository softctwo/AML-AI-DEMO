

import React from 'react';
import { GEO_RISK_DATA } from '../constants';

export const RiskHeatmap: React.FC = () => {
  
  const getRiskColor = (risk: number) => {
      if (risk > 80) return '#ef4444'; // Red (High Risk)
      if (risk > 50) return '#f97316'; // Orange (Medium)
      return '#3b82f6'; // Blue (Low/Normal)
  };

  // Equirectangular projection approximation for 800x400 SVG
  // Center (0,0) is at (400, 200)
  const getCoordinates = (id: string) => {
      switch(id) {
          // Approximated pixel coordinates for 800x400 World Map
          case 'CN': return { x: 625, y: 135 }; // China
          case 'US': return { x: 180, y: 130 }; // USA
          case 'RU': return { x: 580, y: 80 };  // Russia
          case 'KY': return { x: 230, y: 185 }; // Cayman Islands (approx)
          case 'VG': return { x: 245, y: 180 }; // BVI (approx)
          case 'SG': return { x: 620, y: 225 }; // Singapore
          case 'PH': return { x: 660, y: 215 }; // Philippines
          default: return { x: 400, y: 200 };
      }
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden relative h-full min-h-[300px] flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                全球资金风险热力图
            </h3>
            <p className="text-slate-400 text-xs mt-1">基于客户国籍与跨境汇款流向监测</p>
        </div>

        {/* World Map SVG */}
        <svg viewBox="0 0 800 400" className="w-full h-full object-contain">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="800" height="400" fill="url(#bgGradient)" />

            {/* Grid Lines */}
            <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
                <line x1="0" y1="100" x2="800" y2="100" />
                <line x1="0" y1="200" x2="800" y2="200" />
                <line x1="0" y1="300" x2="800" y2="300" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="400" y1="0" x2="400" y2="400" />
                <line x1="600" y1="0" x2="600" y2="400" />
            </g>

            {/* 
                Simplified World Map Path (High Quality)
                This path represents the continents in an Equirectangular projection suitable for 800x400.
            */}
            <path 
                d="M622.6,130.4l-6.8,4.8l-9.2,13.2l-16.4,3.6l-12-7.6l-15.2,4.4l-8.4,14.8l12.8,12.4l16.4-3.2l10.4,8l15.6-2.4l8.8-11.6l-3.6-14.8L622.6,130.4z M166.6,128.8l-12.4-6.4l-18,11.2l-4,16.8l15.6,15.2l21.6-5.2l9.2-15.6l-6.8-14.4L166.6,128.8z M585.4,83.2l-16.4,1.2l-10.4,15.6l8,14l18.4,2.4l12.8-8.4l-1.2-16.8L585.4,83.2z M231,185.6l-4.4,6.8l5.2,8.4l9.6-2l3.2-8.8l-5.2-5.2L231,185.6z M247.8,179.2l-2.4,4l3.6,4.8l5.6-1.6l1.2-5.2l-3.6-3.2L247.8,179.2z M628.2,224.8l-3.6,2.8l2.4,4.8l6,0.4l2.4-3.2l-2-4.4L628.2,224.8z M661.4,214.4l-4.4,6l2.8,9.2l8.4,1.2l4.8-6.8l-2.8-8.8L661.4,214.4z M422.2,249.6l-10.8-8.4l-14.4,3.6l-3.6,14.4l11.2,10.8l16-2.4l5.2-12.8L422.2,249.6z M273,282l-13.2,1.6l-6.4,13.2l8.4,12.8l16.8,1.2l8.8-9.6l-3.6-14.4L273,282z M477.8,54l-12.8,5.6l-2.4,15.2l11.2,10.4l16.8-2.8l4.8-14l-8-12.4L477.8,54z M675.8,288.4l-14.8,2.4l-5.2,14.4l10.4,11.2l17.6-1.6l6-12.8l-5.6-12L675.8,288.4z M388.6,135.2l-9.6,10.8l1.6,15.6l14.4,6.4l12.8-4.8l3.6-14.4l-10-12L388.6,135.2z M103.4,72.8l-14.4,10.4l1.2,18l16.8,6.8l15.2-6l2-16.4l-10.8-12L103.4,72.8z"
                fill="#334155" 
                stroke="#475569" 
                strokeWidth="0.5"
            />
            
            {/* Connecting Flow Lines (Animated) */}
            {GEO_RISK_DATA.map((item, idx) => {
                if (item.id === 'CN') return null; // Skip destination itself for now
                const start = getCoordinates(item.id);
                const end = getCoordinates('CN'); // Assuming flows to/from CN for demo
                
                // Control point for curve
                const cx = (start.x + end.x) / 2;
                const cy = Math.min(start.y, end.y) - 50;

                return (
                    <path 
                        key={`flow-${idx}`}
                        d={`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`}
                        fill="none"
                        stroke={getRiskColor(item.risk)}
                        strokeWidth="1"
                        strokeOpacity="0.4"
                        strokeDasharray="5,5"
                    >
                         <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${3 + idx}s`} repeatCount="indefinite" />
                    </path>
                );
            })}

            {/* Risk Data Points (Hotspots) */}
            {GEO_RISK_DATA.map((item) => {
                const coords = getCoordinates(item.id);
                const color = getRiskColor(item.risk);
                
                return (
                    <g key={item.id} transform={`translate(${coords.x}, ${coords.y})`}>
                        {/* Pulse Effect for High Risk */}
                        {item.risk > 50 && (
                            <circle r="15" fill={color} opacity="0.2">
                                <animate attributeName="r" values="5;20;5" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                            </circle>
                        )}
                        
                        {/* Core Dot */}
                        <circle r={Math.max(4, item.value / 100)} fill={color} stroke="white" strokeWidth="1.5" filter="url(#glow)" />
                        
                        {/* Label */}
                        <text y="-10" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" opacity="0.8" style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>
                            {item.id}
                        </text>
                    </g>
                );
            })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-800/90 p-2 rounded text-[10px] text-slate-300 flex flex-col gap-1.5 border border-slate-700 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span> 
                极高风险 (制裁/洗钱)
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span> 
                高风险 (离岸/博彩)
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 
                一般业务流
            </div>
        </div>
    </div>
  );
};
