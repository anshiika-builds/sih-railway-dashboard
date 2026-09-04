import React from 'react';
import { useData } from '../context/DataContext';
import RailwaySignal from './RailwaySignal';
import {
  LayoutDashboard,
  MapPin,
  Wrench,
  Kanban,
  Zap,
  Calendar,
  Clock,
  Activity,
  AlertTriangle,
  Train
} from 'lucide-react';

const STATIONS = [
  { id: 'overview', label: 'OVERVIEW HERO', stationCode: 'CP-01', icon: LayoutDashboard, status: 'GREEN' },
  { id: 'corridors', label: 'CORRIDOR MAP', stationCode: 'CP-02', icon: MapPin, status: 'GREEN' },
  { id: 'maintenance', label: 'MAINTENANCE', stationCode: 'CP-03', icon: Wrench, status: 'AMBER' },
  { id: 'board', label: 'BLOCK BOARD', stationCode: 'CP-04', icon: Kanban, status: 'GREEN' },
  { id: 'ai-vs-manual', label: 'AI VS MANUAL', stationCode: 'CP-05', icon: Zap, status: 'GREEN' },
  { id: 'coa-calendar', label: 'COA TIMETABLE', stationCode: 'CP-06', icon: Calendar, status: 'GREEN' },
  { id: 'goods-forecast', label: 'GOODS FORECAST', stationCode: 'CP-07', icon: Clock, status: 'GREEN' },
  { id: 'asset-overview', label: 'ASSET CONDITION', stationCode: 'CP-08', icon: Activity, status: 'GREEN' },
  { id: 'conflicts', label: 'CONFLICT DETECTOR', stationCode: 'CP-09', icon: AlertTriangle, status: 'RED' },
  { id: 'schedules', label: 'LIVE DEPARTURES', stationCode: 'CP-10', icon: Train, status: 'GREEN' },
];

export const RailwayTrackNav = () => {
  const { activeTab, setActiveTab } = useData();

  return (
    <div className="bg-[#070F1A] border-y-4 border-[#7A1F2B] py-3 px-4 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1F3A_1px,transparent_1px),linear-gradient(to_bottom,#0B1F3A_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none"></div>

      {/* Main Track & Stations Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Control Track Header */}
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-[#D4AF37]">
          <div className="flex items-center gap-2 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
            <span>INDIAN RAILWAYS MAINLINE TRACK NAVIGATION • SECTION CONTROL</span>
          </div>
          <span className="hidden md:inline text-[11px] text-[#F3ECD9]/70 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-[#D4AF37]/30">
            AUTO-SIGNAL BLOCKING ACTIVE
          </span>
        </div>

        {/* Horizontal Railway Track System */}
        <div className="relative my-4 pt-8 pb-4 overflow-x-auto scrollbar-thin">
          <div className="min-w-[1050px] relative px-4">
            
            {/* THE RAILWAY TRACK (Rails + Sleepers + Ballast Bed) */}
            <div className="relative h-10 w-full flex items-center justify-center my-3 bg-[#0D1826] border-y border-[#D4AF37]/30 rounded shadow-inner">
              {/* Ballast / Sleeper Pattern */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#1B2A3D,#1B2A3D_6px,#0D1826_6px,#0D1826_18px)] opacity-80"></div>
              
              {/* Top Rail (Metallic Sheen Line) */}
              <div className="absolute top-1.5 inset-x-0 h-1 bg-gradient-to-r from-[#8A9BA8] via-[#E2E8F0] to-[#8A9BA8] shadow-[0_0_4px_#E2E8F0]"></div>
              
              {/* Bottom Rail (Metallic Sheen Line) */}
              <div className="absolute bottom-1.5 inset-x-0 h-1 bg-gradient-to-r from-[#8A9BA8] via-[#E2E8F0] to-[#8A9BA8] shadow-[0_0_4px_#E2E8F0]"></div>

              {/* Data Pulse Line travelling along track */}
              <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent opacity-60 animate-pulse"></div>

              {/* ANIMATED INDIAN RAILWAY LOCOMOTIVE + COACHES */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 z-30 pointer-events-none animate-train-loop flex items-center">
                {/* Engine Headlight Beam */}
                <div className="w-16 h-8 bg-gradient-to-r from-[#FFF5C0] to-transparent opacity-70 blur-[2px] -mr-3"></div>

                {/* Locomotive WAP-7 Style Engine */}
                <div className="h-6 w-14 bg-[#7A1F2B] border border-[#D4AF37] rounded-r-md flex items-center justify-between px-1 shadow-[0_0_8px_rgba(212,175,55,0.8)] relative">
                  <div className="w-2 h-2 bg-[#FFFF00] rounded-full shadow-[0_0_6px_#FFFF00] border border-black"></div>
                  <span className="font-mono text-[7px] text-[#D4AF37] font-bold">WAP-7</span>
                  <div className="w-2 h-3 bg-[#070F1A] rounded-sm"></div>
                </div>

                {/* Coach 1 */}
                <div className="h-5 w-10 bg-[#1B4D3E] border border-[#D4AF37]/80 rounded-sm ml-0.5 flex items-center justify-evenly px-0.5">
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                </div>

                {/* Coach 2 */}
                <div className="h-5 w-10 bg-[#1B4D3E] border border-[#D4AF37]/80 rounded-sm ml-0.5 flex items-center justify-evenly px-0.5">
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-[#FFF] rounded-xs opacity-80"></div>
                </div>

                {/* Guard Van */}
                <div className="h-5 w-8 bg-[#7A1F2B] border border-[#D4AF37]/80 rounded-l-md ml-0.5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#FF2E4C] rounded-full animate-ping"></div>
                </div>
              </div>

            </div>

            {/* STATIONS ALONG THE RAILWAY TRACK */}
            <div className="flex items-start justify-between relative z-20 -mt-14">
              {STATIONS.map((stn) => {
                const Icon = stn.icon;
                const isActive = activeTab === stn.id;
                const signalState = isActive ? 'GREEN' : stn.status;

                return (
                  <button
                    key={stn.id}
                    onClick={() => setActiveTab(stn.id)}
                    className={`group flex flex-col items-center transition-all duration-300 focus:outline-none ${
                      isActive ? '-translate-y-2' : 'hover:-translate-y-1'
                    }`}
                  >
                    {/* Station Box Node */}
                    <div
                      className={`p-2.5 rounded border-2 transition-all duration-300 flex flex-col items-center text-center shadow-lg min-w-[92px] ${
                        isActive
                          ? 'bg-[#7A1F2B] text-[#F3ECD9] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)] ring-2 ring-[#D4AF37]/50'
                          : 'bg-[#0B1320] text-[#F3ECD9]/80 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#1B2A3D] hover:text-white'
                      }`}
                    >
                      {/* Station Code Badge & Signal */}
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[9px] font-mono font-bold px-1 rounded border ${
                          isActive ? 'bg-[#D4AF37] text-[#070F1A] border-white' : 'bg-black/50 text-[#D4AF37] border-[#D4AF37]/30'
                        }`}>
                          {stn.stationCode}
                        </span>
                        <RailwaySignal state={signalState} size="sm" />
                      </div>

                      {/* Station Icon & Title */}
                      <Icon className={`w-4 h-4 mb-1 transition-colors ${
                        isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70 group-hover:text-[#D4AF37]'
                      }`} />

                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider leading-tight">
                        {stn.label}
                      </span>
                    </div>

                    {/* Vertical Track Connection Line (Spur) */}
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[#D4AF37] to-[#8A9BA8] my-1 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] absolute top-0 -left-0.5"></div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RailwayTrackNav;
