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
              AI-assisted synchronization of track maintenance blocks, passenger services, goods trains and corridor availability across {data.corridors.length || aggregations.activeCorridorsCount || '...'} key rail sections.
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
                <span className="font-display text-lg text-[#F3ECD9] block">
                  {aggregations.requestsAnalyzed != null ? aggregations.requestsAnalyzed.toLocaleString() : (data.finalRecommendations?.length ? data.finalRecommendations.length.toLocaleString() : '...')}
                </span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">CONFLICTS DETECTED</span>
                <span className="font-display text-lg text-[#FFB800] block">
                  {aggregations.conflictsDetected != null ? aggregations.conflictsDetected.toLocaleString() : (data.conflicts?.length ? data.conflicts.length.toLocaleString() : '...')}
                </span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">CONFLICTS RESOLVED</span>
                <span className="font-display text-lg text-[#00FF66] block">
                  {aggregations.conflictsResolved != null ? aggregations.conflictsResolved.toLocaleString() : '...'}
                </span>
              </div>
              <div className="bg-[#0B1320] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[9px] text-[#F3ECD9]/60 block uppercase">DELAY SAVED</span>
                <span className="font-display text-lg text-[#D4AF37] block">
                  {aggregations.delaySavedMin != null ? `${aggregations.delaySavedMin} MINS` : '...'}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-dashed border-[#D4AF37]/30 flex items-center justify-between text-[10px] text-[#00FF66] font-bold">
              <span>● SYSTEM STATUS: {aggregations.systemStatus || 'ACTIVE'} & OPTIMAL</span>
              <span className="text-[#F3ECD9]/60">SIH26027 MATRIX</span>
            </div>
          </div>

        </div>

        {/* Big Headline Stat Grid (4 Key Metrics - Real Backend Values) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5 pt-4 border-t-2 border-[#D4AF37]/30">
          {/* Active Corridors: Loaded from backend corridors dataset */}
          <div className="bg-[#1B4D3E] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">ACTIVE CORRIDORS</span>
            <span className="font-display text-3xl text-[#F3ECD9] block mt-0.5">
              {aggregations.activeCorridorsCount ?? (data.corridors?.length || '...')}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">
              {aggregations.activeCorridorsCount ?? data.corridors.length} SECTIONS MONITORED
            </span>
          </div>

          {/* Pending Requests: Computed from backend recommendations where request_status is DEFERRED or NO FEASIBLE BLOCK */}
          <div className="bg-[#7A1F2B] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">PENDING REQUESTS</span>
            <span className="font-display text-3xl text-[#F3ECD9] block mt-0.5">
              {aggregations.pendingBlockRequestsCount != null ? aggregations.pendingBlockRequestsCount.toLocaleString() : '...'}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">BLOCKS AWAITING STAMP</span>
          </div>

          {/* Network Availability: Calculated from mean availability_pct in backend asset_master dataset */}
          <div className="bg-[#0B1320] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">NETWORK AVAILABILITY</span>
            <span className="font-display text-3xl text-[#D4AF37] block mt-0.5">
              {aggregations.networkAvailabilityPct != null ? `${aggregations.networkAvailabilityPct}%` : '...'}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">TARGET &gt; 95% OPERATIONAL</span>
          </div>

          {/* AI Conflict Reduction: Calculated from backend baseline_comparison dataset */}
          <div className="bg-[#1B4D3E] p-3 rounded border-2 border-[#D4AF37] shadow-desi text-center relative">
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block">AI CONFLICT REDUCTION</span>
            <span className="font-display text-3xl text-[#00FF66] block mt-0.5">
              {aggregations.aiVsManual?.conflictReductionPct != null ? `${aggregations.aiVsManual.conflictReductionPct}%` : '...'}
            </span>
            <span className="text-[9px] font-mono text-white/80 block">VS MANUAL SCHEDULING</span>
          </div>
        </div>
      </section>

      {/* AI Automatic Block Optimization Pipeline */}
      <section className="bg-[#0B1320] border-4 border-[#D4AF37] p-4 md:p-5 rounded shadow-desi">
        <div className="flex items-center justify-between border-b-2 border-[#D4AF37]/40 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display text-lg md:text-xl uppercase tracking-wider text-[#F3ECD9]">
              AI BLOCK OPTIMIZATION PIPELINE
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#00FF66] bg-black/40 px-2.5 py-0.5 rounded border border-[#00FF66]/30 uppercase font-bold">
            AUTOMATED 5-STAGE WORKFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {/* Stage 1 */}
          <div className="bg-[#070F1A] border-2 border-[#D4AF37]/40 p-3 rounded relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#7A1F2B] text-[#F3ECD9] text-[9px] font-bold px-1.5 py-0.5 rounded">STAGE 1</span>
                <span className="text-[10px] text-white/50">INPUT</span>
              </div>
              <h4 className="font-bold text-[#F3ECD9] text-sm">Maintenance Request</h4>
              <p className="text-[10px] text-white/70 mt-1">
                Unified maintenance work orders & track inspection logs logged by department.
              </p>
            </div>
            <div className="mt-3 text-[9px] text-[#D4AF37] font-bold border-t border-white/10 pt-1.5">
              {aggregations.totalMaintenanceCount ? `${aggregations.totalMaintenanceCount.toLocaleString()} WORK ORDERS` : '14,400+ RECORDS'}
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-[#070F1A] border-2 border-[#D4AF37]/40 p-3 rounded relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#1B4D3E] text-[#00FF66] text-[9px] font-bold px-1.5 py-0.5 rounded">STAGE 2</span>
                <span className="text-[10px] text-white/50">AI MODEL</span>
              </div>
              <h4 className="font-bold text-[#D4AF37] text-sm">AI Priority Prediction</h4>
              <p className="text-[10px] text-white/70 mt-1">
                Risk prediction matrix calculates priority score (1-100) based on overdue days & asset health.
              </p>
            </div>
            <div className="mt-3 text-[9px] text-[#00FF66] font-bold border-t border-white/10 pt-1.5">
              PRIORITY SCORING ACTIVE
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-[#070F1A] border-2 border-[#D4AF37]/40 p-3 rounded relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#7A1F2B] text-[#FF2E4C] text-[9px] font-bold px-1.5 py-0.5 rounded">STAGE 3</span>
                <span className="text-[10px] text-white/50">SAFETY MATRIX</span>
              </div>
              <h4 className="font-bold text-[#FFB800] text-sm">Conflict Detection</h4>
              <p className="text-[10px] text-white/70 mt-1">
                Cross-references train timetables & goods forecasts to identify exact clash minutes.
              </p>
            </div>
            <div className="mt-3 text-[9px] text-[#FFB800] font-bold border-t border-white/10 pt-1.5">
              {aggregations.conflictsDetected ? `${aggregations.conflictsDetected} CONFLICTS ANALYZED` : '743 CONFLICTS'}
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-[#070F1A] border-2 border-[#D4AF37]/40 p-3 rounded relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#1B4D3E] text-[#D4AF37] text-[9px] font-bold px-1.5 py-0.5 rounded">STAGE 4</span>
                <span className="text-[10px] text-white/50">CP-SAT SOLVER</span>
              </div>
              <h4 className="font-bold text-[#00FF66] text-sm">Block Optimization</h4>
              <p className="text-[10px] text-white/70 mt-1">
                Constraint satisfaction shifts windows into COA margin slots minimizing delays.
              </p>
            </div>
            <div className="mt-3 text-[9px] text-[#00FF66] font-bold border-t border-white/10 pt-1.5">
              {aggregations.optimizedBlocksCount ? `${aggregations.optimizedBlocksCount} OPTIMIZED BLOCKS` : '258 OPTIMIZED'}
            </div>
          </div>

          {/* Stage 5 */}
          <div className="bg-[#070F1A] border-2 border-[#00FF66] p-3 rounded relative shadow-[0_0_10px_rgba(0,255,102,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#00FF66] text-[#070F1A] text-[9px] font-bold px-1.5 py-0.5 rounded">STAGE 5</span>
                <span className="text-[10px] text-[#00FF66]">OUTPUT</span>
              </div>
              <h4 className="font-bold text-[#F3ECD9] text-sm">Feasible Recommendation</h4>
              <p className="text-[10px] text-white/70 mt-1">
                Final stamped block dossier with start/end time, zero conflict window & resource assignment.
              </p>
            </div>
            <div className="mt-3 text-[9px] text-[#00FF66] font-bold border-t border-white/10 pt-1.5">
              ✦ AI RECOMMENDED
            </div>
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
              Explore {data.corridors.length || aggregations.activeCorridorsCount || '...'} rail corridors color-coded by traffic density & criticality. View track electrification, speed limits, and joined active task loads.
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
              Control room view of {data.unifiedMaintenance.length ? data.unifiedMaintenance.length.toLocaleString() : (aggregations.totalMaintenanceCount ? aggregations.totalMaintenanceCount.toLocaleString() : '...')} maintenance tasks ranked by priority score. Filter by department, urgency, and downtime risk.
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
