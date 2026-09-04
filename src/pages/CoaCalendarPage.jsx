import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StampBadge from '../components/StampBadge';
import { Calendar, Filter, Clock, MapPin, Database } from 'lucide-react';

export const CoaCalendarPage = () => {
  const { data, selectedZone } = useData();
  const windows = data.coaAvailability || [];
  const corridors = data.corridors || [];

  const [selectedCorridorId, setSelectedCorridorId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredWindows = useMemo(() => {
    return windows.filter(w => {
      if (selectedCorridorId !== 'ALL' && w.corridor_id !== selectedCorridorId) return false;
      if (statusFilter !== 'ALL' && w.availability_status !== statusFilter) return false;
      return true;
    }).slice(0, 100);
  }, [windows, selectedCorridorId, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Calendar className="w-7 h-7 text-[#7A1F2B]" /> COA AVAILABILITY RESERVATION CHART
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            CONTROL OFFICE APPLICATION (COA) LIVE BLOCK MARGIN FEED • TIMETABLE VIEW
          </p>
        </div>

        {/* Local Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCorridorId}
            onChange={(e) => setSelectedCorridorId(e.target.value)}
            className="bg-[#0B1F3A] text-[#F3ECD9] text-xs font-mono uppercase font-bold p-2 rounded border border-[#D4AF37]"
          >
            <option value="ALL">ALL CORRIDORS</option>
            {corridors.slice(0, 30).map(c => (
              <option key={c.corridor_id} value={c.corridor_id}>{c.corridor_id} - {c.corridor_name?.slice(0, 20)}...</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1B4D3E] text-white text-xs font-mono uppercase font-bold p-2 rounded border border-[#D4AF37]"
          >
            <option value="ALL">ALL MARGIN STATUSES</option>
            <option value="Available">AVAILABLE</option>
            <option value="Occupied by Freight">OCCUPIED BY FREIGHT</option>
            <option value="Blocked for Track Machine">BLOCKED FOR MACHINE</option>
            <option value="Reserved">RESERVED</option>
          </select>
        </div>
      </div>

      {/* Reservation Chart Vintage Table */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi rounded overflow-hidden">
        <div className="bg-[#0B1F3A] text-[#F3ECD9] px-6 py-3 border-b-4 border-[#7A1F2B] flex items-center justify-between">
          <span className="font-display text-xl uppercase tracking-widest">
            INDIAN RAILWAYS RESERVATION CHART • BLOCK MARGINS
          </span>
          <span className="font-mono text-xs text-[#D4AF37]">
            FEED SOURCE: COA INTEGRATED SYSTEM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="reservation-chart-table">
            <thead>
              <tr>
                <th>WINDOW ID</th>
                <th>CORRIDOR ID</th>
                <th>BLOCK DATE</th>
                <th>WINDOW TIME</th>
                <th>DURATION</th>
                <th>STATUS</th>
                <th>DATA SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {filteredWindows.map((win) => (
                <tr key={win.block_window_id}>
                  <td className="font-bold text-[#7A1F2B]">{win.block_window_id}</td>
                  <td className="font-bold text-[#0B1F3A]">{win.corridor_id}</td>
                  <td>{win.block_date}</td>
                  <td className="font-bold text-[#1B4D3E]">{win.window_start} ➔ {win.window_end}</td>
                  <td>{win.available_duration_min} MINS</td>
                  <td>
                    <StampBadge status={win.availability_status} type={win.availability_status} />
                  </td>
                  <td className="text-[11px] text-[#0B1F3A]/70 uppercase">{win.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoaCalendarPage;
