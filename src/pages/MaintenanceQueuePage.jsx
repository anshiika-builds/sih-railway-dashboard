import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TicketCard from '../components/TicketCard';
import StampBadge from '../components/StampBadge';
import { Wrench, ShieldAlert, Clock, Users, Search, Filter, Eye } from 'lucide-react';

export const MaintenanceQueuePage = () => {
  const { data, selectedDept, setSelectedDept, globalSearch, setInspectedTaskId } = useData();
  const tasks = data.unifiedMaintenance || [];

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
        if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;

        const q = (localSearch || globalSearch).toLowerCase();
        if (q) {
          const matchAsset = t.asset_id?.toString().toLowerCase().includes(q);
          const matchCorridor = t.corridor_id?.toString().toLowerCase().includes(q);
          const matchTask = t.task_id?.toString().toLowerCase().includes(q);
          const matchDefect = t.defect_or_task?.toString().toLowerCase().includes(q);
          return matchAsset || matchCorridor || matchTask || matchDefect;
        }
        return true;
      })
      .sort((a, b) => (b.maintenance_priority_score || b.predicted_priority || 0) - (a.maintenance_priority_score || a.predicted_priority || 0));
  }, [tasks, selectedDept, statusFilter, severityFilter, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0B1320] border-4 border-[#D4AF37] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#F3ECD9] flex items-center gap-2">
            <Wrench className="w-7 h-7 text-[#D4AF37]" /> UNIFIED MAINTENANCE PRIORITY QUEUE
          </h2>
          <p className="font-mono text-xs text-[#D4AF37] font-bold uppercase mt-1">
            {tasks.length.toLocaleString()} WORK ORDERS RANKED BY AI PRIORITY SCORE • CLICK ANY TASK TO INSPECT BACKEND RECOMMENDATION
          </p>
        </div>

        {/* Local Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search Asset ID / Corridor..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-[#070F1A] border-2 border-[#D4AF37]/50 text-xs text-[#F3ECD9] pl-8 pr-2 py-1 rounded w-44 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1B4D3E] text-[#F3ECD9] text-xs uppercase font-bold p-1.5 rounded border border-[#D4AF37]"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="Pending">PENDING</option>
            <option value="Scheduled">SCHEDULED</option>
            <option value="In Progress">IN PROGRESS</option>
            <option value="Completed">COMPLETED</option>
          </select>

          <span className="text-xs bg-[#7A1F2B] text-[#F3ECD9] px-3 py-1.5 rounded font-bold border border-[#D4AF37]">
            SHOWING {filteredTasks.slice(0, 100).length} OF {filteredTasks.length}
          </span>
        </div>
      </div>

      {/* Grid of Ticket Cards */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#0B1320] border-2 border-[#D4AF37]/40 p-12 text-center rounded font-mono text-xs text-[#D4AF37]">
          NO MATCHING MAINTENANCE TASKS FOUND FOR CURRENT FILTERS
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.slice(0, 48).map((t) => {
            const priorityVal = t.maintenance_priority_score ?? t.predicted_priority;
            const formattedScore = typeof priorityVal === 'number' ? priorityVal.toFixed(1) : (priorityVal || 'N/A');

            return (
              <div
                key={t.task_id}
                onClick={() => setInspectedTaskId(t.task_id)}
                className="cursor-pointer group"
              >
                <TicketCard
                  title={`${t.department || 'CIVIL'} • ${t.asset_type || 'TRACK'}`}
                  serialNo={t.task_id}
                  headerBg={t.severity === 'Critical' ? 'bg-[#7A1F2B]' : 'bg-[#0B1320]'}
                  className="group-hover:border-[#00FF66] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#7A1F2B] bg-[#7A1F2B]/10 px-2 py-0.5 rounded border border-[#7A1F2B]/30">
                      PRIORITY SCORE: {formattedScore} / 100 {t.priority_category ? `(${t.priority_category})` : ''}
                    </span>
                    <StampBadge status={t.status || 'PENDING'} type={t.status || 'Pending'} />
                  </div>

                  <h4 className="font-display text-base uppercase text-[#070F1A] mb-2 leading-tight group-hover:text-[#7A1F2B] transition-colors">
                    {t.defect_or_task || 'Track Maintenance Work Order'}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                    <div className="bg-[#F8F4E6] p-2 rounded border border-[#070F1A]/20">
                      <span className="text-[10px] text-[#070F1A]/60 block uppercase">ASSET & CORRIDOR</span>
                      <span className="font-bold text-[#070F1A]">{t.asset_id} • {t.corridor_id}</span>
                    </div>
                    <div className="bg-[#F8F4E6] p-2 rounded border border-[#070F1A]/20">
                      <span className="text-[10px] text-[#070F1A]/60 block uppercase">LOCATION KM</span>
                      <span className="font-bold text-[#7A1F2B]">KM {t.location_km}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-dashed border-[#070F1A]/20">
                    <span className="flex items-center gap-1 text-[#070F1A]">
                      <Clock className="w-3.5 h-3.5 text-[#7A1F2B]" /> {t.estimated_duration_min} MINS
                    </span>
                    <button className="bg-[#070F1A] text-[#D4AF37] px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 group-hover:bg-[#7A1F2B] group-hover:text-white transition-colors">
                      <Eye className="w-3 h-3" /> INSPECT AI RECOM ➔
                    </button>
                  </div>
                </TicketCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaintenanceQueuePage;
