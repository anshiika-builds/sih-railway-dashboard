import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RecommendationCard from './RecommendationCard';
import StampBadge from './StampBadge';
import RailwaySignal from './RailwaySignal';
import { X, Wrench, AlertTriangle, ShieldCheck, Clock, Layers, FileText, CheckCircle2 } from 'lucide-react';

export const TaskInspectorModal = ({ taskId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const [taskRes, recRes, candRes, confRes] = await Promise.allSettled([
          api.getMaintenanceTask(taskId),
          api.getRecommendation(taskId),
          api.getCandidates({ task_id: taskId }),
          api.getConflicts({ task_id: taskId }),
        ]);

        if (isMounted) {
          if (taskRes.status === 'fulfilled') setTaskDetail(taskRes.value);
          if (recRes.status === 'fulfilled') setRecommendation(recRes.value);
          if (candRes.status === 'fulfilled') setCandidates(candRes.value || []);
          if (confRes.status === 'fulfilled') setConflicts(confRes.value || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed loading task inspection data');
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#070F1A] border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(0,0,0,0.9)] rounded max-w-3xl w-full p-6 relative animate-in fade-in zoom-in duration-200 text-[#F3ECD9]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#7A1F2B] text-white p-1.5 rounded border border-[#D4AF37] hover:bg-black transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b-2 border-[#D4AF37] pb-3 mb-4">
          <div className="w-10 h-10 bg-[#7A1F2B] text-[#D4AF37] rounded flex items-center justify-center border border-[#D4AF37]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block">
              RAILWISE CONTROL DISPATCH DOSSIER • TASK #{taskId}
            </span>
            <h3 className="font-display text-2xl uppercase text-[#F3ECD9]">
              MAINTENANCE TASK INSPECTION & AI RECOMMENDATION
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono space-y-3">
            <div className="w-8 h-8 border-4 border-[#00FF66] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-[#D4AF37] uppercase tracking-wider">
              CONNECTING TO RAILWAY OPTIMIZATION ENGINE...
            </p>
          </div>
        ) : error && !recommendation && !taskDetail ? (
          <div className="p-8 bg-[#7A1F2B]/20 border border-[#7A1F2B] rounded text-center font-mono">
            <AlertTriangle className="w-8 h-8 text-[#FF2E4C] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#FF2E4C] uppercase">DATA RECORD UNAVAILABLE</p>
            <p className="text-xs text-white/70 mt-1">{error}</p>
          </div>
        ) : (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            
            {/* 1. Primary AI Recommendation Card */}
            {recommendation ? (
              <div>
                <span className="font-mono text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                  1. AI DISPATCH RECOMMENDATION (FROM RAILWISE CP-SAT OPTIMIZER):
                </span>
                <RecommendationCard recommendation={recommendation} />
              </div>
            ) : (
              <div className="p-4 bg-black/40 border border-[#D4AF37]/30 rounded font-mono text-xs text-[#FFB800]">
                Notice: Task data loaded from registry; no direct optimization output record matched.
              </div>
            )}

            {/* 2. Task & Asset Specifications */}
            {taskDetail && (
              <div className="bg-[#0B1320] border-2 border-[#D4AF37]/40 p-4 rounded font-mono text-xs">
                <span className="text-[#D4AF37] font-bold uppercase tracking-wider block mb-3 border-b border-white/10 pb-1">
                  2. MAINTENANCE TASK SPECIFICATIONS:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-white/60 block">ASSET ID</span>
                    <span className="font-bold text-white">{taskDetail.asset_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">ASSET TYPE</span>
                    <span className="font-bold text-white">{taskDetail.asset_type || 'Infrastructure'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">DEPARTMENT</span>
                    <span className="font-bold text-[#D4AF37]">{taskDetail.department || 'Engineering'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">CORRIDOR</span>
                    <span className="font-bold text-white">{taskDetail.corridor_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">LOCATION KM</span>
                    <span className="font-bold text-white">KM {taskDetail.location_km}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">SEVERITY</span>
                    <span className="font-bold text-[#FF2E4C]">{taskDetail.severity || 'Major'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">OVERDUE DAYS</span>
                    <span className="font-bold text-white">{taskDetail.overdue_days || 0} DAYS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">POSSESSION REQ</span>
                    <span className="font-bold text-[#00FF66]">{taskDetail.possession_required || 'Yes'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Train Conflicts Analysis */}
            {conflicts.length > 0 && (
              <div className="bg-[#0B1320] border-2 border-[#7A1F2B] p-4 rounded font-mono text-xs">
                <span className="text-[#FF2E4C] font-bold uppercase tracking-wider block mb-3 border-b border-white/10 pb-1">
                  3. TRAIN CONFLICT ANALYSIS (FROM CONFLICT_ANALYSIS.CSV):
                </span>
                <div className="space-y-2">
                  {conflicts.map((c, idx) => (
                    <div key={idx} className="bg-black/60 p-2.5 rounded border border-[#7A1F2B]/40 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#FF2E4C] block">TRAIN #{c.train_no} ({c.movement_type || 'Express'})</span>
                        <span className="text-[10px] text-white/70 block">WINDOW: {c.movement_start} ➔ {c.movement_end}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#FFB800] block">CONFLICT: {c.conflict_duration_min} MINS</span>
                        <span className="text-[10px] text-white/60 block">BUFFER: {c.conflict_buffer_min} MINS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Evaluated Candidate Windows */}
            {candidates.length > 0 && (
              <div className="bg-[#0B1320] border-2 border-[#D4AF37]/40 p-4 rounded font-mono text-xs">
                <span className="text-[#D4AF37] font-bold uppercase tracking-wider block mb-3 border-b border-white/10 pb-1">
                  4. EVALUATED CANDIDATE WINDOWS ({candidates.length} CANDIDATES):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {candidates.slice(0, 4).map((cand, idx) => (
                    <div key={idx} className="bg-black/40 p-2 rounded border border-white/10">
                      <span className="text-[#D4AF37] font-bold block">{cand.block_window_id} ({cand.block_date})</span>
                      <span className="text-[11px] text-white/80 block">DURATION: {cand.duration_min} MINS • CONFLICTS: {cand.train_conflicts}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInspectorModal;
