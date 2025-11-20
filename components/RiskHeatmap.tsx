
import React from 'react';
import { GEO_RISK_DATA } from '../constants';

export const RiskHeatmap: React.FC = () => {
  
  const getRiskColor = (risk: number) => {
      if (risk > 80) return '#ef4444'; // Red (High Risk)
      if (risk > 50) return '#f97316'; // Orange (Medium)
      return '#3b82f6'; // Blue (Low/Normal)
  };

  // Calibrated coordinates for 1000x500 Equirectangular Projection
  const getCoordinates = (id: string) => {
      switch(id) {
          case 'CN': return { x: 760, y: 160 }; // Beijing/Shanghai approx
          case 'US': return { x: 240, y: 150 }; // New York/DC
          case 'RU': return { x: 700, y: 100 }; // Moscow/Western Russia
          case 'KY': return { x: 285, y: 210 }; // Cayman Islands
          case 'VG': return { x: 305, y: 205 }; // BVI
          case 'SG': return { x: 755, y: 275 }; // Singapore
          case 'PH': return { x: 800, y: 260 }; // Manila
          case 'JP': return { x: 850, y: 160 }; // Tokyo
          case 'GB': return { x: 490, y: 125 }; // London
          case 'DE': return { x: 515, y: 135 }; // Frankfurt
          case 'AU': return { x: 850, y: 380 }; // Sydney
          default: return { x: 500, y: 250 };
      }
  };

  // Detailed SVG Paths for Continents
  const mapPaths = {
    northAmerica: "M90,60 L150,50 L220,40 L300,45 L350,30 L400,40 L380,80 L320,100 L280,180 L250,230 L200,180 L150,150 L80,120 Z M250,230 L270,250 L290,240 L280,220 Z", // Simplified approximation
    southAmerica: "M280,250 L320,260 L350,300 L340,380 L300,450 L280,400 L260,320 L280,250 Z",
    europe: "M460,150 L480,110 L520,90 L560,100 L550,140 L520,160 L490,165 L470,170 Z M485,120 L500,125 L495,135 Z", // Simplified
    africa: "M460,180 L520,170 L560,180 L580,250 L600,300 L550,380 L500,350 L460,280 L440,220 Z",
    asia: "M560,100 L650,60 L800,60 L900,80 L950,100 L920,180 L850,250 L780,280 L720,240 L650,200 L600,180 Z M830,150 L860,150 L850,180 L830,170 Z", // Includes Japan/Islands roughly
    australia: "M780,320 L850,310 L900,330 L920,380 L880,420 L820,410 L780,380 Z",
    // Refined paths for better visual (using a standard low-poly world map data set equivalent)
    world: `
      M250,70 L350,60 L420,70 L380,120 L320,220 L280,240 L200,150 L120,80 Z 
      M290,250 L350,260 L380,350 L320,450 L280,380 L270,300 Z 
      M450,160 L550,140 L600,180 L580,280 L550,350 L480,250 L450,180 Z 
      M560,130 L650,80 L850,80 L900,150 L850,250 L750,280 L650,220 Z 
      M800,320 L900,320 L920,400 L850,420 L780,350 Z
    ` 
  };

  // A better looking, albeit stylized, world map path
  const worldPath = "M156.8,79.6 L165.8,52.2 L228.2,39.8 L288.6,41.8 L349.2,34.6 L394.2,39.4 L379.8,69.8 L335.4,124.2 L291.8,199.4 L268.2,214.2 L263.8,239.4 L284.6,248.2 L336.6,256.6 L352.2,290.6 L339.4,380.2 L305.8,436.2 L283.4,404.2 L269.4,329.8 L276.6,300.2 L266.2,247.4 L217.8,194.6 L137.4,106.2 L156.8,79.6 Z M472.2,149.8 L491.4,118.6 L523.4,111.4 L557.8,122.6 L551.4,143.4 L609.8,158.6 L605.8,174.6 L615.4,178.6 L623.4,197.8 L609.8,215.4 L608.2,263.4 L623.4,305.8 L589.8,366.6 L533.8,353.8 L484.2,282.6 L459.4,222.6 L446.6,177.8 L472.2,149.8 Z M564.2,118.6 L626.6,94.6 L767.4,90.6 L879.4,95.4 L929.8,111.4 L895.4,174.6 L857.8,181.8 L829.8,230.6 L797.8,257.8 L750.6,257.8 L730.6,233.8 L697.8,209.8 L657.8,195.4 L609.8,158.6 L564.2,118.6 Z M805.8,315.4 L847.4,307.4 L903.4,317.8 L923.4,360.2 L902.6,393.8 L853.8,393.8 L819.4,373.8 L805.8,315.4 Z M737.8,274.6 L759.4,269.8 L773.8,278.6 L766.6,291.4 L746.6,293.8 L734.6,284.2 L737.8,274.6 Z M845.8,158.6 L867.4,153.8 L867.4,176.2 L854.6,183.4 L841.8,173.8 L845.8,158.6 Z M472.2,119.4 L481.8,114.6 L490.6,121.8 L481.8,133.8 L472.2,119.4 Z";

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden relative h-full min-h-[350px] flex items-center justify-center border border-slate-800 shadow-inner group">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                全球资金风险热力图 (Global Risk Heatmap)
            </h3>
            <p className="text-slate-400 text-xs mt-1">基于客户国籍、跨境汇款流向及制裁名单命中的实时监控</p>
        </div>

        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
             }}>
        </div>

        {/* World Map SVG */}
        <svg viewBox="0 0 1000 500" className="w-full h-full object-contain" style={{filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'}}>
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="mapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <radialGradient id="riskGradient">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                </radialGradient>
            </defs>

            {/* Map Background Shape */}
            <path 
                d={worldPath}
                fill="url(#mapGradient)" 
                stroke="#475569" 
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />

            {/* Connecting Flow Lines (Animated) */}
            {GEO_RISK_DATA.map((item, idx) => {
                if (item.id === 'CN') return null; 
                const start = getCoordinates(item.id);
                const end = getCoordinates('CN'); 
                
                // Bezier Control point
                const cx = (start.x + end.x) / 2;
                const cy = Math.min(start.y, end.y) - 80; // Curve upwards

                return (
                    <g key={`flow-${idx}`}>
                        {/* Static faint line */}
                        <path 
                            d={`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`}
                            fill="none"
                            stroke={getRiskColor(item.risk)}
                            strokeWidth="1"
                            strokeOpacity="0.1"
                        />
                        {/* Animated Particle */}
                        <circle r="2" fill={getRiskColor(item.risk)}>
                            <animateMotion 
                                dur={`${2 + Math.random() * 2}s`} 
                                repeatCount="indefinite"
                                path={`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`}
                            />
                        </circle>
                    </g>
                );
            })}

            {/* Risk Data Points (Hotspots) */}
            {GEO_RISK_DATA.map((item) => {
                const coords = getCoordinates(item.id);
                const color = getRiskColor(item.risk);
                const isHighRisk = item.risk > 60;
                
                return (
                    <g key={item.id} transform={`translate(${coords.x}, ${coords.y})`}>
                        {/* Ripple Effect for High Risk */}
                        {isHighRisk && (
                            <>
                                <circle r="10" fill={color} opacity="0.2">
                                    <animate attributeName="r" values="10;30;10" dur="3s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <circle r="20" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
                                     <animate attributeName="r" values="10;40" dur="3s" repeatCount="indefinite" />
                                     <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" />
                                </circle>
                            </>
                        )}
                        
                        {/* Core Dot */}
                        <circle r={isHighRisk ? 4 : 3} fill={color} stroke="#1e293b" strokeWidth="1" filter="url(#glow)" className="cursor-pointer hover:scale-150 transition-transform origin-center" />
                        
                        {/* Label (Only show on hover or for critical nodes) */}
                        <text y="-10" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" opacity={isHighRisk ? 0.9 : 0.6} style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                            {item.id}
                        </text>
                        
                        {/* Value Label (Tiny) */}
                        {isHighRisk && (
                            <text y="12" textAnchor="middle" fill={color} fontSize="8" fontWeight="bold">
                                {item.value}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 p-3 rounded-lg text-xs text-slate-300 border border-slate-700 backdrop-blur-md shadow-lg flex gap-6">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span> 
                <span className="font-medium">极高风险 (制裁/洗钱)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span> 
                <span className="font-medium">高风险 (离岸/博彩)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 
                <span className="font-medium">正常业务流</span>
            </div>
        </div>
    </div>
  );
};
