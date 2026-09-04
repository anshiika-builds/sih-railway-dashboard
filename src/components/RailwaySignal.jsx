import React from 'react';

export const RailwaySignal = ({ state = 'GREEN', size = 'md', label = '', className = '' }) => {
  // state: 'GREEN' | 'AMBER' | 'RED'
  const isGreen = state.toUpperCase().includes('GREEN') || state.toUpperCase().includes('APPROV') || state.toUpperCase().includes('OPERAT');
  const isAmber = state.toUpperCase().includes('AMBER') || state.toUpperCase().includes('PEND') || state.toUpperCase().includes('SCHED') || state.toUpperCase().includes('ATTENT');
  const isRed = state.toUpperCase().includes('RED') || state.toUpperCase().includes('CLASH') || state.toUpperCase().includes('CRIT') || state.toUpperCase().includes('BLOCK');

  const sizeClasses = size === 'sm' ? 'w-4 h-9 p-0.5' : size === 'lg' ? 'w-8 h-20 p-1.5' : 'w-6 h-14 p-1';
  const bulbSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Physical Railway Signal Post Housing */}
      <div className={`bg-[#070F1A] border-2 border-[#D4AF37] rounded-full flex flex-col items-center justify-between shadow-[0_0_8px_rgba(0,0,0,0.8)] relative ${sizeClasses}`}>
        {/* Signal Hood Shades */}
        {/* Red Light (Top) */}
        <div className="relative group">
          <div
            className={`${bulbSize} rounded-full transition-all duration-300 ${
              isRed
                ? 'bg-[#FF2E4C] shadow-[0_0_10px_#FF2E4C] border border-white opacity-100 animate-pulse'
                : 'bg-[#4A0A10] opacity-40 border border-black'
            }`}
          />
        </div>

        {/* Amber Light (Middle) */}
        <div className="relative group">
          <div
            className={`${bulbSize} rounded-full transition-all duration-300 ${
              isAmber
                ? 'bg-[#FFB800] shadow-[0_0_10px_#FFB800] border border-white opacity-100 animate-pulse'
                : 'bg-[#4A3500] opacity-40 border border-black'
            }`}
          />
        </div>

        {/* Green Light (Bottom) */}
        <div className="relative group">
          <div
            className={`${bulbSize} rounded-full transition-all duration-300 ${
              isGreen
                ? 'bg-[#00FF66] shadow-[0_0_12px_#00FF66] border border-white opacity-100'
                : 'bg-[#003B18] opacity-40 border border-black'
            }`}
          />
        </div>
      </div>

      {label && (
        <div className="flex flex-col text-[10px] font-mono leading-tight">
          <span className={`font-bold uppercase tracking-wider ${
            isRed ? 'text-[#FF2E4C]' : isAmber ? 'text-[#FFB800]' : 'text-[#00FF66]'
          }`}>
            ● {isRed ? 'RED BLOCK' : isAmber ? 'AMBER CAUTION' : 'GREEN CLEAR'}
          </span>
          <span className="text-[#F3ECD9]/70 text-[9px] uppercase tracking-widest">{label}</span>
        </div>
      )}
    </div>
  );
};

export default RailwaySignal;
