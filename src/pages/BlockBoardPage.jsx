import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TicketCard from '../components/TicketCard';
import StampBadge from '../components/StampBadge';
import { Kanban, Clock, Calendar, CheckCircle2, AlertOctagon, XCircle, FileSpreadsheet } from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'Pending', label: '1. PENDING STAMP', color: 'bg-[#D4AF37] text-[#0B1F3A]' },
  { id: 'Approved', label: '2. APPROVED / GRANTED', color: 'bg-[#1B4D3E] text-white' },
  { id: 'Scheduled', label: '3. SCHEDULED ON COA', color: 'bg-[#0B1F3A] text-white' },
  { id: 'Conflict Flagged', label: '4. CLASH FLAGGED', color: 'bg-[#7A1F2B] text-white' },
  { id: 'Rejected', label: '5. REJECTED', color: 'bg-gray-700 text-white' }
];

export const BlockBoardPage = () => {
  const { data, selectedDept } = useData();
  const requests = data.blockRequests || [];

  // Interactive local status update store for stamp animation moment
  const [localStatuses, setLocalStatuses] = useState({});

  const handleStampStatus = (reqId, newStatus) => {
    setLocalStatuses(prev => ({ ...prev, [reqId]: newStatus }));
  };

  const getEffectiveStatus = (r) => {
    return localStatuses[r.block_request_id] || r.request_status || 'Pending';
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (selectedDept !== 'ALL' && r.department !== selectedDept) return false;
      return true;
    });
  }, [requests, selectedDept]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Kanban className="w-7 h-7 text-[#7A1F2B]" /> BLOCK REQUEST KANBAN BOARD
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            WORKFLOW TRACKER FOR 6,000 POSSESSION REQUESTS • CLICK STAMP BUTTONS TO PUNCH & TRANSITION
          </p>
        </div>
      </div>

      {/* Kanban Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((col) => {
          const colCards = filteredRequests.filter(r => getEffectiveStatus(r) === col.id);

          return (
            <div key={col.id} className="bg-[#F9F6EE] border-2 border-[#0B1F3A] rounded shadow-desi flex flex-col min-w-[260px]">
              {/* Column Header */}
              <div className={`${col.color} p-3 border-b-2 border-[#0B1F3A] flex items-center justify-between font-mono font-bold text-xs uppercase`}>
                <span>{col.label}</span>
                <span className="bg-white/30 px-2 py-0.5 rounded border border-white/40">
                  {colCards.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-4 max-h-[70vh] overflow-y-auto flex-1">
                {colCards.slice(0, 20).map((req) => (
                  <div key={req.block_request_id} className="ticket-stub p-3 rounded text-xs font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#0B1F3A]">{req.block_request_id}</span>
                      <StampBadge status={getEffectiveStatus(req)} type={getEffectiveStatus(req)} animate={Boolean(localStatuses[req.block_request_id])} />
                    </div>

                    <div className="bg-[#F3ECD9] p-2 rounded border border-[#0B1F3A]/20 mb-2">
                      <span className="text-[10px] text-[#0B1F3A]/60 block">TASK ID & CORRIDOR</span>
                      <span className="font-bold text-[#7A1F2B]">{req.task_id} • {req.corridor_id}</span>
                    </div>

                    <div className="space-y-1 mb-3 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#0B1F3A]/70">DURATION:</span>
                        <span className="font-bold">{req.requested_duration_min} MINS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0B1F3A]/70">DATE:</span>
                        <span className="font-bold">{req.requested_date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0B1F3A]/70">PRIORITY:</span>
                        <span className="font-bold text-[#7A1F2B]">{req.priority}</span>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="pt-2 border-t border-dashed border-[#0B1F3A]/20 flex items-center justify-between gap-1">
                      {getEffectiveStatus(req) !== 'Approved' && (
                        <button
                          onClick={() => handleStampStatus(req.block_request_id, 'Approved')}
                          className="bg-[#1B4D3E] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-[#0B1F3A] transition-colors"
                        >
                          STAMP APPROVE
                        </button>
                      )}
                      {getEffectiveStatus(req) !== 'Rejected' && (
                        <button
                          onClick={() => handleStampStatus(req.block_request_id, 'Rejected')}
                          className="bg-[#7A1F2B] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-black transition-colors"
                        >
                          REJECT
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlockBoardPage;
