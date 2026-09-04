import React from 'react';
import { useData } from '../context/DataContext';
import StampBadge from '../components/StampBadge';
import TicketCard from '../components/TicketCard';
import RailwaySignal from '../components/RailwaySignal';
import { Train, Zap, ArrowRight, ShieldCheck, Cpu, Radio, Activity, CheckCircle2 } from 'lucide-react';

export const OverviewPage = () => {
  const { aggregations, setActiveTab, data } = useData();

  return (
    <div className="space-y-6">
      {/* Compact Vintage Railway Control Room Hero + AI Dispatch Control Panel */}
      <section className="enamel-sign bg-[#0B1320] p-5 md:p-6 rounded shadow-desi-lg relative overflow-hidden border-4 border-[#7A1F2B]">
        {/* Brass corner rivets */}
        <div className="brass-rivet tl"></div>
        <div className="brass-rivet tr"></div>
        <div className="brass-rivet bl"></div>
        <div className="brass-rivet br"></div>

        <div className="jaali-pattern absolute top-0 right-0 w-64 h-full opacity-15 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Main Title & Subtitle (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#7A1F2B] text-[#D4AF37] border border-[#D4AF37] px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-widest uppercase mb-2 shadow">
              <Train className="w-3.5 h-3.5 text-[#D4AF37]" /> INDIAN RAILWAYS • AI OPERATIONS CONTROL
            </div>

            <h2 className="font-display text-2xl md:text-4xl text-[#F3ECD9] uppercase leading-tight tracking-wide">
              AUTOMATIC BLOCK PLANNING & SECTION THROUGHPUT OPTIMIZER
            </h2>

            <p className="text-xs md:text-sm font-sans text-[#F3ECD9]/90 mt-2 max-w-xl leading-relaxed">
              AI-assisted synchronization of track maintenance blocks, passenger services, goods trains and corridor availability across 100 key rail sections.
            </p>
          </div>

          {/* AI DISPATCH ENGINE CONTROL ROOM PANEL (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-[#070F1A] border-2 border-[#D4AF37] p-4 rounded shadow-inner relative overflow-hidden font-mono">
            {/* Subtle Scanning Line Animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent opacity-40 animate-scanline pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00FF66] animate-pulse" />
                <span className="font-bold text-xs text-[#D4AF37] uppercase tracking-wider">
                  AI DISPATCH ENGINE • LIVE RUNNING
                </span>
              </div>
              <RailwaySignal state="GREEN" size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">REQUESTS ANALYZED</span>
                <span className="font-display text-lg text-[#F3ECD9] block">1,187</span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">CONFLICTS DETECTED</span>
                <span className="font-display text-lg text-[#FFB800] block">24</span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">CONFLICTS RESOLVED</span>
                <span className="font-display text-lg text-[#00FF66] block">22</span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">DELAY SAVED</span>
                <span className="font-display text-lg text-[#D4AF37] block">41 MINS</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-dashed border-[#D4AF37]/30 flex items-center justify-between text-[10px] text-[#00FF66] font-bold">
              <span>● SYSTEM STATUS: ACTIVE & OPTIMAL</span>
              <span className="text-[#F3ECD9]/60">SIH26027 MATRIX</span>
            </div>
          </div>

        </div>

        {/* Big Headline Stat Grid (4 Key Metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5 pt-4 border-t-2 border-[#D4AF37]/30">
          <div className="bg-[#1B4D3E] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">ACTIVE CORRIDORS</span>
            <span className="font-display text-3xl text-[#F3ECD9] block mt-0.5">
              {data.corridors.length || 100}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">10 ZONES MONITORED</span>
          </div>

          <div className="bg-[#7A1F2B] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">PENDING REQUESTS</span>
            <span className="font-display text-3xl text-[#F3ECD9] block mt-0.5">
              {aggregations.pendingBlockRequestsCount || 1420}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">BLOCKS AWAITING STAMP</span>
          </div>

          <div className="bg-[#0B1320] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">NETWORK AVAILABILITY</span>
            <span className="font-display text-3xl text-[#D4AF37] block mt-0.5">
              {aggregations.networkAvailabilityPct || 96.4}%
            </span>
            <span className="text-[9px] font-mono text-white/80 block">TARGET &gt; 95% OPERATIONAL</span>
          </div>

          <div className="bg-[#1B4D3E] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">AI CONFLICT REDUCTION</span>
            <span className="font-display text-3xl text-[#00FF66] block mt-0.5">
              {aggregations.aiVsManual?.conflictReductionPct || 84}%
            </span>
            <span className="text-[9px] font-mono text-white/80 block">VS MANUAL SCHEDULING</span>
          </div>
        </div>
      </section>

      {/* Quick Access Module Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b-2 border-[#D4AF37]/40 pb-2">
          <h3 className="font-display text-xl uppercase tracking-wider text-[#F3ECD9] flex items-center gap-2">
            <span className="w-3 h-3 bg-[#7A1F2B] rounded-full inline-block border border-[#D4AF37]"></span>
            CONTROL DISPATCH MODULES
          </h3>
          <span className="font-mono text-xs text-[#D4AF37] font-bold">SELECT STATION ALONG TRACK ABOVE OR CLICK BELOW</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TicketCard title="Corridor Health Map" serialNo="CP-02" headerBg="bg-[#1B4D3E]">
            <p className="text-xs font-sans text-[#070F1A]/80 mb-3 leading-relaxed">
              Explore 100 rail corridors color-coded by traffic density & criticality. View track electrification, speed limits, and joined active task loads.
            </p>
            <div className="flex items-center justify-between">
              <StampBadge status="OPERATIONAL" type="OPERATIONAL" />
              <button
                onClick={() => setActiveTab('corridors')}
                className="bg-[#070F1A] text-[#F3ECD9] px-3 py-1 rounded font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow hover:bg-[#7A1F2B] transition-colors"
              >
                OPEN MAP <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TicketCard>

          <TicketCard title="Maintenance Priority Queue" serialNo="CP-03" headerBg="bg-[#7A1F2B]">
            <p className="text-xs font-sans text-[#070F1A]/80 mb-3 leading-relaxed">
              Control room view of 14,400 maintenance tasks ranked by priority score. Filter by department, urgency, and downtime risk.
            </p>
            <div className="flex items-center justify-between">
              <StampBadge status="HIGH PRIORITY" type="CLASH" />
              <button
                onClick={() => setActiveTab('maintenance')}
                className="bg-[#070F1A] text-[#F3ECD9] px-3 py-1 rounded font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow hover:bg-[#7A1F2B] transition-colors"
              >
                VIEW QUEUE <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TicketCard>

          <TicketCard title="AI vs Manual Hero Chart" serialNo="CP-05" headerBg="bg-[#0B1320]">
            <p className="text-xs font-sans text-[#070F1A]/80 mb-3 leading-relaxed">
              Visual proof of the AI engine's value: comparing conflict rates and track utilization between traditional manual and AI block plans.
            </p>
            <div className="flex items-center justify-between">
              <StampBadge status="AI PROVED" type="APPROVED" />
              <button
                onClick={() => setActiveTab('ai-vs-manual')}
                className="bg-[#070F1A] text-[#F3ECD9] px-3 py-1 rounded font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow hover:bg-[#7A1F2B] transition-colors"
              >
                BENCHMARK <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TicketCard>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
