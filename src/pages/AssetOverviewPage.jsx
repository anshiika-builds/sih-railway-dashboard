import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StampBadge from '../components/StampBadge';
import { Activity, ShieldAlert, Wrench, Search, ArrowUpDown, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const AssetOverviewPage = () => {
  const { data, selectedDept } = useData();
  const assets = data.assetMaster || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueSoon, setFilterDueSoon] = useState(false);
  const [sortField, setSortField] = useState('condition_score_1_5');

  // Compute Days Until Due & Filter Assets
  const enrichedAssets = useMemo(() => {
    const today = new Date('2026-09-04').getTime();
    return assets.map(a => {
      let daysUntil = 999;
      if (a.next_due_date) {
        daysUntil = Math.round((new Date(a.next_due_date).getTime() - today) / (1000 * 3600 * 24));
      }
      return { ...a, daysUntilDue: daysUntil };
    });
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return enrichedAssets
      .filter(a => {
        if (selectedDept !== 'ALL' && a.department !== selectedDept) return false;
        if (filterDueSoon && a.daysUntilDue > 14) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchId = a.asset_id?.toString().toLowerCase().includes(q);
          const matchType = a.asset_type?.toString().toLowerCase().includes(q);
          const matchCorridor = a.corridor_id?.toString().toLowerCase().includes(q);
          return matchId || matchType || matchCorridor;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'daysUntilDue') return a.daysUntilDue - b.daysUntilDue;
        if (sortField === 'condition_score_1_5') return a.condition_score_1_5 - b.condition_score_1_5;
        return (b.availability_pct || 0) - (a.availability_pct || 0);
      });
  }, [enrichedAssets, selectedDept, filterDueSoon, searchQuery, sortField]);

  // Asset Type Pie Chart Data
  const typeCounts = useMemo(() => {
    const counts = {};
    assets.forEach(a => {
      if (a.asset_type) {
        counts[a.asset_type] = (counts[a.asset_type] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [assets]);

  const COLORS = ['#0B1F3A', '#1B4D3E', '#7A1F2B', '#D4AF37', '#9A7B0C', '#4A5568', '#2B6CB0'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#7A1F2B]" /> ASSET CONDITION & MAINTENANCE DUE TRACKER
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            MASTER REGISTRY OF 12,000 INFRASTRUCTURE ASSETS • DAYS UNTIL DUE CALCULATOR
          </p>
        </div>

        {/* Local Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterDueSoon(!filterDueSoon)}
            className={`px-3 py-1.5 rounded font-mono text-xs uppercase font-bold border-2 transition-all flex items-center gap-1.5 ${
              filterDueSoon
                ? 'bg-[#7A1F2B] text-white border-[#0B1F3A] shadow-desi'
                : 'bg-[#F3ECD9] text-[#0B1F3A] border-[#0B1F3A] hover:bg-[#7A1F2B] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {filterDueSoon ? 'DUE SOON (&le; 14 DAYS) ACTIVE' : 'FILTER DUE SOON'}
          </button>

          <input
            type="text"
            placeholder="Search Asset / Corridor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-2 border-[#0B1F3A] text-xs font-mono pl-3 pr-2 py-1.5 rounded w-44 focus:outline-none"
          />
        </div>
      </div>

      {/* Asset Distribution Pie Chart & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col items-center">
          <h3 className="font-display text-lg uppercase text-[#0B1F3A] mb-2">ASSET TYPE BREAKDOWN</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {typeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B1F3A', color: '#F3ECD9', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sortable Reservation Table */}
        <div className="md:col-span-2 bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi rounded overflow-hidden">
          <div className="bg-[#0B1F3A] text-[#F3ECD9] px-6 py-3 border-b-4 border-[#7A1F2B] flex items-center justify-between">
            <span className="font-display text-xl uppercase tracking-widest">ASSET CONDITION REGISTRY</span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span>SORT BY:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="bg-[#1B4D3E] text-white p-1 rounded font-bold uppercase cursor-pointer"
              >
                <option value="condition_score_1_5">CONDITION SCORE</option>
                <option value="daysUntilDue">DAYS UNTIL DUE</option>
                <option value="availability_pct">AVAILABILITY %</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="reservation-chart-table">
              <thead>
                <tr>
                  <th>ASSET ID</th>
                  <th>TYPE</th>
                  <th>DEPT</th>
                  <th>CORRIDOR</th>
                  <th>CONDITION (1-5)</th>
                  <th>AVAILABILITY</th>
                  <th>NEXT DUE DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.slice(0, 100).map((ast) => (
                  <tr key={ast.asset_id}>
                    <td className="font-bold text-[#7A1F2B]">{ast.asset_id}</td>
                    <td className="font-bold">{ast.asset_type}</td>
                    <td>{ast.department}</td>
                    <td>{ast.corridor_id}</td>
                    <td className={`font-bold ${ast.condition_score_1_5 < 2.5 ? 'text-[#7A1F2B]' : 'text-[#1B4D3E]'}`}>
                      {ast.condition_score_1_5} / 5.0
                    </td>
                    <td className="font-bold">{ast.availability_pct}%</td>
                    <td className={`font-bold ${ast.daysUntilDue <= 14 ? 'text-[#7A1F2B]' : 'text-[#0B1F3A]'}`}>
                      {ast.next_due_date} ({ast.daysUntilDue}d)
                    </td>
                    <td>
                      <StampBadge
                        status={ast.daysUntilDue <= 14 ? 'DUE SOON' : ast.active_status}
                        type={ast.daysUntilDue <= 14 ? 'CLASH' : ast.active_status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetOverviewPage;
