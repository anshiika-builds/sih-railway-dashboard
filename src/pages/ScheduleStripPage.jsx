import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StampBadge from '../components/StampBadge';
import { Train, Clock, MapPin, Filter, Radio } from 'lucide-react';

export const ScheduleStripPage = () => {
  const { data, selectedZone } = useData();
  const schedules = data.trainSchedule || [];

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stationFilter, setStationFilter] = useState('ALL');

  const filteredSchedules = useMemo(() => {
    return schedules
      .filter(s => {
        if (typeFilter !== 'ALL' && s.train_type !== typeFilter) return false;
        if (stationFilter !== 'ALL' && s.source_station_code !== stationFilter) return false;
        return true;
      })
      .slice(0, 150);
  }, [schedules, typeFilter, stationFilter]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Train className="w-7 h-7 text-[#7A1F2B]" /> VINTAGE STATION DEPARTURE BOARD & TICKER
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            LIVE TICKER OF 26,736 TRAIN TIMETABLE ENTRIES • SPLIT-FLAP STATION DEPARTURE STYLE
          </p>
        </div>

        {/* Local Filters */}
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0B1F3A] text-[#F3ECD9] text-xs font-mono uppercase font-bold p-2 rounded border border-[#D4AF37]"
          >
            <option value="ALL">ALL TRAIN TYPES</option>
            <option value="Rajdhani">RAJDHANI EXPRESS</option>
            <option value="Vande Bharat">VANDE BHARAT</option>
            <option value="Shatabdi">SHATABDI EXPRESS</option>
            <option value="Superfast">SUPERFAST</option>
            <option value="Goods / Freight">FREIGHT RAKES</option>
          </select>
        </div>
      </div>

      {/* Split-Flap Departure Board Container */}
      <div className="bg-[#0B1F3A] text-[#F3ECD9] border-4 border-[#7A1F2B] shadow-desi-lg p-6 rounded relative overflow-hidden">
        <div className="jaali-pattern absolute top-0 left-0 w-full h-2 opacity-30"></div>

        <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <h3 className="font-display text-2xl uppercase tracking-widest text-[#F3ECD9]">
              LIVE PASSENGER & FREIGHT DEPARTURES
            </h3>
          </div>
          <span className="font-mono text-xs text-[#D4AF37] bg-black/40 px-3 py-1 rounded border border-[#D4AF37]/40">
            AUTO-TICKER ACTIVE
          </span>
        </div>

        {/* Ticker Cards Grid / Horizontal Scroll */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredSchedules.map((s) => (
            <div
              key={s.schedule_id}
              className="bg-black/60 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] p-3 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#7A1F2B] text-[#F3ECD9] font-bold text-sm px-2.5 py-1 rounded border border-white/20 min-w-[70px] text-center">
                  #{s.train_no}
                </span>
                <div>
                  <h4 className="font-display text-lg uppercase text-[#F3ECD9] leading-tight">
                    {s.train_name}
                  </h4>
                  <span className="text-[11px] text-[#D4AF37] uppercase">
                    {s.train_type} • RUNNING: {s.running_days}
                  </span>
                </div>
              </div>

              <div className="bg-[#0B1F3A] px-3 py-1.5 rounded border border-[#D4AF37]/30 flex items-center gap-4 text-center">
                <div>
                  <span className="text-[9px] text-white/50 block">FROM STN</span>
                  <span className="font-bold text-[#F3ECD9]">{s.source_station_code}</span>
                </div>
                <span className="text-[#D4AF37] font-bold">➔</span>
                <div>
                  <span className="text-[9px] text-white/50 block">TO STN</span>
                  <span className="font-bold text-[#F3ECD9]">{s.destination_station_code}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-[#D4AF37] block">DEP TIME</span>
                  <span className="font-bold text-base text-white">{s.departure_time}</span>
                </div>
                <StampBadge status={s.direction} type={s.direction} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleStripPage;
