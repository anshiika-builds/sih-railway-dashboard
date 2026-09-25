import React from 'react';
import { useData } from '../context/DataContext';
import RailwaySignal from './RailwaySignal';
import { Search, Filter, AlertCircle, Train, Compass, Radio, CheckCircle, XCircle } from 'lucide-react';

export const Header = () => {
  const {
    globalSearch,
    setGlobalSearch,
    selectedZone,
    setSelectedZone,
    selectedDept,
    setSelectedDept,
    apiConnected
  } = useData();

  return (
    <header className="bg-[#070F1A] text-[#F3ECD9] border-b-4 border-[#7A1F2B] shadow-[0_4px_20px_rgba(0,0,0,0.9)] sticky top-0 z-40">
      {/* Top Heritage Control Bar */}
      <div className="bg-[#7A1F2B] px-4 py-1 flex items-center justify-between text-xs font-mono border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-[#D4AF37] uppercase tracking-wider">
            <Train className="w-3.5 h-3.5" /> INDIAN RAILWAYS • AI OPERATIONS CONTROL
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-[#F3ECD9]/90 text-[11px]">
            PROBLEM STATEMENT SIH26027: AUTOMATIC BLOCK PLANNING
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Real Backend Status Indicator */}
          {apiConnected ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00FF66] bg-black/50 px-2 py-0.5 rounded border border-[#00FF66]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span>🟢 Backend Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF2E4C] bg-black/50 px-2 py-0.5 rounded border border-[#FF2E4C]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF2E4C] animate-ping"></span>
              <span>🔴 Backend Offline</span>
            </div>
          )}

          <span className="bg-[#D4AF37] text-[#070F1A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            CONTROL ROOM v2.4
          </span>
        </div>
      </div>

      {/* Main Title & Global Control Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title / Emblem Box */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B4D3E] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-md relative">
              <span className="font-display text-xl text-[#D4AF37] font-bold">IR</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#7A1F2B] border border-white rounded-full flex items-center justify-center text-[7px] font-mono text-white">
                AI
              </span>
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl tracking-wide uppercase text-[#F3ECD9] leading-tight">
                SECTION THROUGHPUT OPTIMIZER
              </h1>
              <p className="font-mono text-[10px] text-[#D4AF37] tracking-wider uppercase">
                AI-POWERED AUTOMATIC BLOCK PLANNING & CONFLICT DETECTION
              </p>
            </div>
          </div>
        </div>

        {/* Global Search & Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Global Search Input */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search Asset, Corridor, Task ID..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#0B1320] text-[#F3ECD9] font-mono text-xs pl-8 pr-3 py-1.5 border-2 border-[#D4AF37]/50 rounded shadow-sm focus:border-[#D4AF37] focus:outline-none placeholder:text-[#F3ECD9]/40 font-medium"
            />
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1.5 bg-[#1B4D3E] px-2 py-1 border border-[#D4AF37] rounded">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-transparent text-[#F3ECD9] font-mono text-xs font-bold uppercase focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-[#070F1A] text-white">ALL ZONES</option>
              <option value="Northern Railway" className="bg-[#070F1A] text-white">NORTHERN RAILWAY</option>
              <option value="Eastern Railway" className="bg-[#070F1A] text-white">EASTERN RAILWAY</option>
              <option value="Western Railway" className="bg-[#070F1A] text-white">WESTERN RAILWAY</option>
              <option value="Central Railway" className="bg-[#070F1A] text-white">CENTRAL RAILWAY</option>
              <option value="Southern Railway" className="bg-[#070F1A] text-white">SOUTHERN RAILWAY</option>
              <option value="South Central Railway" className="bg-[#070F1A] text-white">SOUTH CENTRAL</option>
            </select>
          </div>

          {/* Department Selector */}
          <div className="flex items-center gap-1.5 bg-[#7A1F2B] px-2 py-1 border border-[#D4AF37] rounded">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-[#F3ECD9] font-mono text-xs font-bold uppercase focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-[#070F1A] text-white">ALL DEPTS</option>
              <option value="Engineering" className="bg-[#070F1A] text-white">ENGINEERING (CIVIL)</option>
              <option value="Signal & Telecom" className="bg-[#070F1A] text-white">SIGNAL & TELECOM</option>
              <option value="Electrical" className="bg-[#070F1A] text-white">ELECTRICAL (OHE)</option>
              <option value="Operating" className="bg-[#070F1A] text-white">OPERATING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real Backend Data Source Label */}
      <div className="bg-[#1B4D3E] text-[#F3ECD9] px-4 py-1 text-center font-mono text-[10px] font-bold border-t border-[#D4AF37]/30 flex items-center justify-center gap-2 shadow-inner">
        <Radio className="w-3.5 h-3.5 text-[#00FF66] animate-pulse" />
        <span className="tracking-wider">
          RAILWISE BACKEND • PROCESSED OPERATIONAL DATA • FASTAPI OPTIMIZATION ENGINE SYNCHRONIZED
        </span>
      </div>
    </header>
  );
};

export default Header;
