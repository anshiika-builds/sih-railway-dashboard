import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TicketCard from '../components/TicketCard';
import StampBadge from '../components/StampBadge';
import { MapPin, Zap, Gauge, AlertTriangle, X, Wrench, Calendar, Compass, Shield } from 'lucide-react';

export const CorridorHealthPage = () => {
  const { aggregations, selectedZone, setSelectedZone, globalSearch } = useData();
  const corridors = aggregations.enrichedCorridors || [];

  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [filterCriticality, setFilterCriticality] = useState('ALL');

  const filteredCorridors = useMemo(() => {
    return corridors.filter(c => {
      if (selectedZone !== 'ALL' && c.zone !== selectedZone) return false;
      if (filterCriticality !== 'ALL' && c.corridor_criticality !== filterCriticality) return false;
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const matchName = c.corridor_name?.toLowerCase().includes(q);
        const matchId = c.corridor_id?.toLowerCase().includes(q);
        const matchStart = c.start_station_name?.toLowerCase().includes(q);
        const matchEnd = c.end_station_name?.toLowerCase().includes(q);
        return matchName || matchId || matchStart || matchEnd;
      }
      return true;
    });
  }, [corridors, selectedZone, filterCriticality, globalSearch]);

  const getCriticalityColor = (crit) => {
    switch (crit) {
      case 'Critical': return 'bg-[#7A1F2B] text-[#F3ECD9] border-[#7A1F2B]';
      case 'High': return 'bg-[#D4AF37] text-[#0B1F3A] border-[#B48B1B]';
      case 'Medium': return 'bg-[#1B4D3E] text-[#F3ECD9] border-[#1B4D3E]';
      default: return 'bg-[#0B1F3A] text-[#F3ECD9] border-[#0B1F3A]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <MapPin className="w-7 h-7 text-[#7A1F2B]" /> CORRIDOR HEALTH & CRITICALITY MAP
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            MONITORING 100 HIGH-DENSITY SECTIONS • JOINED LIVE MAINTENANCE & BLOCK REQUEST COUNTS
          </p>
        </div>

        {/* Local Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0B1F3A] px-3 py-1.5 rounded border border-[#D4AF37]">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <select
              value={filterCriticality}
              onChange={(e) => setFilterCriticality(e.target.value)}
              className="bg-transparent text-[#F3ECD9] font-mono text-xs uppercase font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0B1F3A]">ALL CRITICALITY LEVELS</option>
              <option value="Critical" className="bg-[#0B1F3A]">CRITICAL ONLY</option>
              <option value="High" className="bg-[#0B1F3A]">HIGH ONLY</option>
              <option value="Medium" className="bg-[#0B1F3A]">MEDIUM ONLY</option>
              <option value="Low" className="bg-[#0B1F3A]">LOW ONLY</option>
            </select>
          </div>
          <span className="font-mono text-xs bg-[#7A1F2B] text-[#F3ECD9] px-3 py-1.5 rounded font-bold border border-[#0B1F3A]">
            SHOWING {filteredCorridors.length} / {corridors.length}
          </span>
        </div>
      </div>

      {/* Grid of Corridor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCorridors.map((c) => (
          <div
            key={c.corridor_id}
            onClick={() => setSelectedCorridor(c)}
            className="ticket-stub p-4 rounded hover:border-[#7A1F2B] transition-all cursor-pointer group"
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b-2 border-[#0B1F3A]/20 pb-2.5 mb-3">
              <span className="font-mono text-xs font-bold text-[#0B1F3A] bg-[#0B1F3A]/10 px-2 py-0.5 rounded border border-[#0B1F3A]/30">
                {c.corridor_id}
              </span>
              <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCriticalityColor(c.corridor_criticality)}`}>
                {c.corridor_criticality} CRITICALITY
              </span>
            </div>

            <h3 className="font-display text-lg uppercase text-[#0B1F3A] group-hover:text-[#7A1F2B] transition-colors leading-tight mb-2">
              {c.corridor_name}
            </h3>

            <div className="font-mono text-xs text-[#0B1F3A]/80 mb-3 flex items-center justify-between bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
              <span className="font-bold">{c.start_station_code} ({c.start_station_name})</span>
              <span className="text-[#7A1F2B] font-bold">➔</span>
              <span className="font-bold">{c.end_station_code} ({c.end_station_name})</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
              <div className="bg-[#0B1F3A]/5 p-2 rounded border border-[#0B1F3A]/10">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">ZONE / DIV</span>
                <span className="font-bold text-[#0B1F3A] truncate block">{c.zone} / {c.division}</span>
              </div>
              <div className="bg-[#0B1F3A]/5 p-2 rounded border border-[#0B1F3A]/10">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">TRAFFIC DENSITY</span>
                <span className="font-bold text-[#7A1F2B] truncate block">{c.traffic_density}</span>
              </div>
            </div>

            {/* Joined Counts Bar */}
            <div className="pt-2 border-t-2 border-dashed border-[#0B1F3A]/20 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-[#7A1F2B] font-bold">
                <Wrench className="w-3.5 h-3.5" /> {c.openTaskCount} TASKS
              </span>
              <span className="flex items-center gap-1 text-[#1B4D3E] font-bold">
                <Calendar className="w-3.5 h-3.5" /> {c.pendingBlockCount} PENDING BLOCKS
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Corridor Detail Drawer / Modal */}
      {selectedCorridor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi-lg rounded max-w-xl w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedCorridor(null)}
              className="absolute top-4 right-4 bg-[#7A1F2B] text-white p-1 rounded border border-[#0B1F3A] hover:bg-[#0B1F3A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7A1F2B] uppercase mb-1">
              <span>CORRIDOR SPECIFICATION DOSSIER</span>
            </div>

            <h3 className="font-display text-2xl uppercase text-[#0B1F3A] border-b-2 border-[#0B1F3A] pb-2 mb-4">
              {selectedCorridor.corridor_name} ({selectedCorridor.corridor_id})
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">START / END STATIONS</span>
                <span className="font-bold text-[#0B1F3A] text-sm">{selectedCorridor.start_station_name} to {selectedCorridor.end_station_name}</span>
              </div>
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">DISTANCE</span>
                <span className="font-bold text-[#7A1F2B] text-sm">{selectedCorridor.distance_km} KM</span>
              </div>
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">MAX SPEED</span>
                <span className="font-bold text-[#1B4D3E] text-sm">{selectedCorridor.maximum_speed_kmph} KMPH</span>
              </div>
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">TRACK TYPE</span>
                <span className="font-bold text-[#0B1F3A] text-sm">{selectedCorridor.track_type}</span>
              </div>
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">ELECTRIFIED</span>
                <span className={`font-bold text-sm ${selectedCorridor.electrified === 'Yes' ? 'text-[#1B4D3E]' : 'text-[#7A1F2B]'}`}>
                  {selectedCorridor.electrified === 'Yes' ? '⚡ ELECTRIFIED (25kV AC)' : 'NON-ELECTRIFIED'}
                </span>
              </div>
              <div className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/30">
                <span className="text-[#0B1F3A]/60 block text-[10px] uppercase">OPERATIONAL STATUS</span>
                <span className="font-bold text-[#0B1F3A] text-sm">{selectedCorridor.operational_status}</span>
              </div>
            </div>

            {/* Joined Live Counts */}
            <div className="bg-[#0B1F3A] text-[#F3ECD9] p-4 rounded border-2 border-[#D4AF37] shadow-desi flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">LIVE MAINTENANCE WORKLOAD</span>
                <span className="font-display text-xl">{selectedCorridor.openTaskCount} OPEN TASKS LOGGED</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">PENDING BLOCK REQUESTS</span>
                <span className="font-display text-xl text-[#D4AF37]">{selectedCorridor.pendingBlockCount} PENDING</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorridorHealthPage;
