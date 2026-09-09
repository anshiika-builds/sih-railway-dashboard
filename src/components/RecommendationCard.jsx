import React from 'react';
import StampBadge from './StampBadge';
import RailwaySignal from './RailwaySignal';
import { CheckCircle2, XCircle, PauseCircle, Clock, AlertTriangle, ShieldCheck, Train, Calendar } from 'lucide-react';

export const RecommendationCard = ({ recommendation, className = '' }) => {
  if (!recommendation) return null;

  const {
    block_request_id,
    task_id,
    asset_id,
    department,
    corridor_id,
    predicted_priority,
    priority_category,
    requested_duration_min,
    recommended_date,
    recommended_start,
    recommended_end,
    recommended_duration_min,
    train_conflict_count,
    conflict_duration_min,
    forecast_goods_trains,
    affected_trains,
    feasibility,
    request_status,
    reason_for_recommendation
  } = recommendation;

  const isFeasible = request_status === 'OPTIMIZED' || (feasibility && feasibility.toLowerCase().includes('feasible'));
  const isDeferred = request_status === 'DEFERRED' || feasibility === 'DEFERRED';
  const isNoFeasible = request_status === 'NO FEASIBLE BLOCK' || feasibility === 'NO FEASIBLE BLOCK';

  return (
    <div className={`rounded border-4 shadow-desi p-5 relative overflow-hidden transition-all ${
      isFeasible
        ? 'bg-[#0B1320] text-[#F3ECD9] border-[#00FF66]'
        : isDeferred
        ? 'bg-[#0B1320] text-[#F3ECD9] border-[#FFB800]'
        : 'bg-[#0B1320] text-[#F3ECD9] border-[#7A1F2B]'
    } ${className}`}>

      {/* Header Banner */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-3 mb-4 font-mono">
        <div className="flex items-center gap-2.5">
          {isFeasible ? (
            <div className="flex items-center gap-1.5 bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66] px-2.5 py-1 rounded text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4" /> ✓ OPTIMIZED BLOCK
            </div>
          ) : isDeferred ? (
            <div className="flex items-center gap-1.5 bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800] px-2.5 py-1 rounded text-xs font-bold uppercase">
              <PauseCircle className="w-4 h-4" /> ⏸ DEFERRED
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#7A1F2B]/20 text-[#FF2E4C] border border-[#7A1F2B] px-2.5 py-1 rounded text-xs font-bold uppercase">
              <XCircle className="w-4 h-4" /> ✕ NO FEASIBLE BLOCK
            </div>
          )}
          <span className="text-xs text-[#D4AF37] font-bold">REQ #{block_request_id}</span>
        </div>

        <RailwaySignal state={isFeasible ? 'GREEN' : isDeferred ? 'AMBER' : 'RED'} size="sm" />
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs mb-4">
        <div className="bg-black/40 p-2.5 rounded border border-white/10">
          <span className="text-[10px] text-white/60 uppercase block">TASK & ASSET</span>
          <span className="font-bold text-[#D4AF37] text-sm block">{task_id}</span>
          <span className="text-[11px] text-white/80 block">{asset_id} • {department || 'CIVIL'}</span>
        </div>

        <div className="bg-black/40 p-2.5 rounded border border-white/10">
          <span className="text-[10px] text-white/60 uppercase block">CORRIDOR SECTION</span>
          <span className="font-bold text-white text-sm block">{corridor_id}</span>
          <span className="text-[11px] text-white/80 block">PRIORITY: {predicted_priority?.toFixed(1)} ({priority_category})</span>
        </div>

        <div className="bg-black/40 p-2.5 rounded border border-white/10">
          <span className="text-[10px] text-white/60 uppercase block">RECOMMENDED SLOT</span>
          {recommended_date ? (
            <span className="font-bold text-[#00FF66] text-sm block">{recommended_date}</span>
          ) : (
            <span className="font-bold text-[#FF2E4C] text-sm block">NONE ALLOCATED</span>
          )}
          <span className="text-[11px] text-white/80 block">
            {recommended_start && recommended_end ? `${recommended_start} ➔ ${recommended_end}` : `REQ: ${requested_duration_min || recommended_duration_min} MINS`}
          </span>
        </div>

        <div className="bg-black/40 p-2.5 rounded border border-white/10">
          <span className="text-[10px] text-white/60 uppercase block">TRAIN CONFLICTS</span>
          <span className={`font-bold text-sm block ${train_conflict_count === 0 ? 'text-[#00FF66]' : 'text-[#FF2E4C]'}`}>
            {train_conflict_count} CONFLICTS ({conflict_duration_min} MINS)
          </span>
          {affected_trains && (
            <span className="text-[10px] text-[#D4AF37] block truncate">TRAINS: {affected_trains}</span>
          )}
        </div>
      </div>

      {/* Reason Box */}
      <div className="bg-black/60 p-3 rounded border border-white/20 font-mono text-xs">
        <span className="text-[10px] text-[#D4AF37] uppercase font-bold block mb-1">
          AI OPTIMIZER REASON & RECOMMENDATION:
        </span>
        <p className="text-white/90 leading-relaxed font-sans text-xs">
          {reason_for_recommendation}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
