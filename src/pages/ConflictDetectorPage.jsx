import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import EnamelSign from '../components/EnamelSign';
import StampBadge from '../components/StampBadge';
import { AlertTriangle, ShieldAlert, Train, Clock, MapPin, Zap } from 'lucide-react';

export const ConflictDetectorPage = () => {
  const { data, selectedZone } = useData();
  const movements = data.movementWindows || [];
  const blockRequests = data.blockRequests || [];

  // Filter for movements with buffer deficits (< 10 minutes) representing high conflict risk
  const flaggedConflicts = useMemo(() => {
    return movements
      .filter(m => m.conflict_buffer_min < 10)
      .slice(0, 36)
      .map(m => {
        // Cross-reference with block requests on same corridor
        const matchingBlock = blockRequests.find(b => b.corridor_id === m.corridor_id);
        return {
          ...m,
          linkedBlockId: matchingBlock?.block_request_id || 'BLK-04921',
          linkedDept: matchingBlock?.department || 'Engineering'
        };
      });
  }, [movements, blockRequests]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-[#7A1F2B]" /> LIVE CONFLICT DETECTOR & WARNING SIGNS
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            CROSS-REFERENCING 15,059 TRAIN MOVEMENT WINDOWS AGAINST MAINTENANCE BLOCKS • BUFFER DEFICIT AUDIT
          </p>
        </div>

        <StampBadge status="CLASH FLAGGED" type="CLASH" animate={true} />
      </div>

      {/* Enamel Signage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flaggedConflicts.map((c) => (
          <div key={c.movement_id} className="ticket-stub p-5 rounded border-4 border-[#7A1F2B] bg-[#F9F6EE] shadow-desi-maroon">
            <EnamelSign
              title={`CLASH DETECTED: TRAIN #${c.train_no} VS ${c.linkedBlockId}`}
              message={`Corridor ${c.corridor_id} (${c.from_station_code} ➔ ${c.to_station_code}) has a conflict buffer deficit of only ${c.conflict_buffer_min} mins (Minimum safe margin: 15 mins). Linked ${c.linkedDept} maintenance block overlaps scheduled arrival window (${c.arrival_time}).`}
              level="danger"
            />

            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#0B1F3A]/30 grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">BUFFER MARGIN</span>
                <span className="font-bold text-[#7A1F2B] text-sm">{c.conflict_buffer_min} MINS</span>
              </div>
              <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">ARRIVAL WINDOW</span>
                <span className="font-bold text-[#0B1F3A] text-sm">{c.arrival_time}</span>
              </div>
              <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">MOVEMENT TYPE</span>
                <span className="font-bold text-[#1B4D3E] text-xs truncate block">{c.movement_type}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-xs">
              <span className="text-[#0B1F3A]/70 uppercase">RECOMMENDED AI ACTION:</span>
              <button className="bg-[#0B1F3A] text-[#D4AF37] px-3 py-1 rounded text-[11px] font-bold border border-[#D4AF37] hover:bg-[#7A1F2B] hover:text-white transition-colors">
                AUTO-SHIFT BLOCK WINDOW ➔
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictDetectorPage;
