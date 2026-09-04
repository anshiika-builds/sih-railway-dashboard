import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TicketCard from '../components/TicketCard';
import StampBadge from '../components/StampBadge';
import { Wrench, ShieldAlert, Clock, Users, Search, Filter, AlertOctagon } from 'lucide-react';

export const MaintenanceQueuePage = () => {
  const { data, selectedDept, setSelectedDept, globalSearch } = useData();
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
      .sort((a, b) => (b.maintenance_priority_score || 0) - (a.maintenance_priority_score || 0));
  }, [tasks, selectedDept, statusFilter, severityFilter, localSearch, globalSearch]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Wrench className="w-7 h-7 text-[#7A1F2B]" /> UNIFIED MAINTENANCE PRIORITY QUEUE
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            14,400 WORK ORDERS RANKED BY AI PRIORITY SCORE (URGENCY + RISK + DOWNTIME IMPACT)
          </p>
        </div>

        {/* Local Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60" />
            <input
              type="text"
              placeholder="Search Asset ID / Corridor..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-white border-2 border-[#0B1F3A] text-xs font-mono pl-8 pr-2 py-1 rounded w-44 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B1F3A] text-[#F3ECD9] text-xs font-mono uppercase font-bold p-1.5 rounded border border-[#D4AF37]"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="Pending">PENDING</option>
            <option value="Scheduled">SCHEDULED</option>
            <option value="In Progress">IN PROGRESS</option>
            <option value="Completed">COMPLETED</option>
          </select>

          <span className="font-mono text-xs bg-[#7A1F2B] text-[#F3ECD9] px-3 py-1.5 rounded font-bold border border-[#0B1F3A]">
            SHOWING {filteredTasks.slice(0, 100).length} OF {filteredTasks.length}
          </span>
        </div>
      </div>

      {/* Grid of Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.slice(0, 48).map((t) => (
          <TicketCard
            key={t.task_id}
            title={`${t.department} • ${t.asset_type}`}
            serialNo={t.task_id}
            headerBg={t.severity === 'Critical' ? 'bg-[#7A1F2B]' : 'bg-[#0B1F3A]'}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#7A1F2B] bg-[#7A1F2B]/10 px-2 py-0.5 rounded border border-[#7A1F2B]/30">
                PRIORITY SCORE: {t.maintenance_priority_score} / 100
              </span>
              <StampBadge status={t.status} type={t.status} />
            </div>

            <h4 className="font-display text-base uppercase text-[#0B1F3A] mb-2 leading-tight">
              {t.defect_or_task}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
              <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">ASSET & CORRIDOR</span>
                <span className="font-bold text-[#0B1F3A]">{t.asset_id} • {t.corridor_id}</span>
              </div>
              <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20">
                <span className="text-[10px] text-[#0B1F3A]/60 block uppercase">LOCATION KM</span>
                <span className="font-bold text-[#7A1F2B]">KM {t.location_km}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-dashed border-[#0B1F3A]/20">
              <span className="flex items-center gap-1 text-[#0B1F3A]">
                <Clock className="w-3.5 h-3.5 text-[#7A1F2B]" /> {t.estimated_duration_min} MINS
              </span>
              <span className="flex items-center gap-1 text-[#0B1F3A]">
                <Users className="w-3.5 h-3.5 text-[#1B4D3E]" /> TEAM: {t.required_team_size}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.possession_required === 'Yes' ? 'bg-[#7A1F2B] text-white' : 'bg-[#1B4D3E] text-white'}`}>
                {t.possession_required === 'Yes' ? 'POSSESSION REQ' : 'NO POSSESSION'}
              </span>
            </div>
          </TicketCard>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceQueuePage;
