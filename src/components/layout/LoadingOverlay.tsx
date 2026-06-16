import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Fetching latest market data..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19]/85 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center space-y-6">
        {/* Glow behind the logo */}
        <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-4 animate-pulse duration-1000" />
        
        {/* SVG Logo with animations */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 relative z-10">
          <defs>
            <linearGradient id="loadLeg1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#0057FF" />
            </linearGradient>
            <linearGradient id="loadLeg2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#0080FF" />
            </linearGradient>
            <filter id="loadShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>
          {/* Left Leg */}
          <path d="M50 10 L15 90 L35 90 L50 50 Z" fill="url(#loadLeg1)" className="opacity-80 animate-pulse duration-1000" />
          {/* Right Leg */}
          <path d="M50 10 L50 50 L65 90 L85 90 Z" fill="url(#loadLeg2)" className="opacity-80 animate-pulse duration-1000" />
          {/* Zigzag Arrow overlapping */}
          <g filter="url(#loadShadow)">
            <path 
              d="M10 75 L35 45 L50 60 L85 20" 
              stroke="#00F0FF" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{
                strokeDasharray: '150',
                strokeDashoffset: '150',
                animation: 'drawArrow 1.6s ease-in-out infinite'
              }}
            />
            <polygon 
              points="73,22 88,16 82,32" 
              fill="#00F0FF" 
              style={{
                animation: 'pulseArrowHead 1.6s ease-in-out infinite'
              }}
            />
          </g>
        </svg>

        {/* Text Details */}
        <div className="text-center relative z-10 space-y-2">
          <div className="text-[24px] tracking-tight text-white flex items-center justify-center">
            <span className="font-extrabold">Apex</span>
            <span className="font-light text-slate-300">Rate</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <p className="text-xs font-semibold text-slate-400 ml-1">{message}</p>
          </div>
        </div>
      </div>
      
      {/* Dynamic Keyframes Style */}
      <style>{`
        @keyframes drawArrow {
          0% {
            stroke-dashoffset: 150;
          }
          45%, 55% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -150;
          }
        }
        @keyframes pulseArrowHead {
          0%, 100% {
            transform: scale(0.9) translate(2px, -2px);
            opacity: 0.5;
          }
          45%, 55% {
            transform: scale(1.1) translate(-1px, 1px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
