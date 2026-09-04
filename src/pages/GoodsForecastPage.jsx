import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StampBadge from '../components/StampBadge';
import { Clock, Train, TrendingUp, AlertCircle, Compass } from 'lucide-react';

export const GoodsForecastPage = () => {
  const { data } = useData();
  const forecasts = data.goodsForecast || [];
  const corridors = data.corridors || [];

  const [selectedCorridorId, setSelectedCorridorId] = useState(forecasts[0]?.corridor_id || 'COR-001');

  const selectedForecasts = useMemo(() => {
    return forecasts.filter(f => f.corridor_id === selectedCorridorId).slice(0, 12);
  }, [forecasts, selectedCorridorId]);

  const activeForecast = selectedForecasts[0] || {
    forecast_goods_trains: 28,
    peak_period: 'Night (22:00-04:00)',
    confidence_pct: 92.4
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi p-5 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <Clock className="w-7 h-7 text-[#7A1F2B]" /> GOODS TRAIN TRAFFIC FORECAST
          </h2>
          <p className="font-mono text-xs text-[#7A1F2B] font-bold uppercase mt-1">
            FREIGHT RAKE TRAFFIC PREDICTION DIALS & STATION CLOCK WIDGETS (3,000 FORECAST RECORDS)
          </p>
        </div>

        {/* Corridor Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0B1F3A] uppercase">SELECT SECTION:</span>
          <select
            value={selectedCorridorId}
            onChange={(e) => setSelectedCorridorId(e.target.value)}
            className="bg-[#0B1F3A] text-[#F3ECD9] text-xs font-mono font-bold uppercase p-2 rounded border border-[#D4AF37]"
          >
            {corridors.slice(0, 40).map(c => (
              <option key={c.corridor_id} value={c.corridor_id}>
                {c.corridor_id} — {c.corridor_name?.slice(0, 25)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Clock Gauge Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vintage Railway Station Clock Dial Widget */}
        <div className="ticket-stub p-6 rounded text-center flex flex-col items-center justify-center bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi-lg">
          <span className="font-mono text-xs font-bold text-[#7A1F2B] uppercase tracking-widest mb-3">
            STATION CLOCK DIAL • TRAFFIC INTENSITY
          </span>

          {/* Clock Circle Visual */}
          <div className="w-48 h-48 rounded-full border-8 border-[#0B1F3A] bg-[#F3ECD9] shadow-inner relative flex items-center justify-center my-2">
            <div className="absolute inset-2 border-2 border-dashed border-[#7A1F2B]/40 rounded-full"></div>
            
            {/* Clock Hands / Needle */}
            <div className="w-1.5 h-16 bg-[#7A1F2B] absolute bottom-1/2 left-1/2 -ml-0.75 origin-bottom transform rotate-45 rounded-t shadow"></div>
            <div className="w-3 h-3 bg-[#0B1F3A] border-2 border-[#D4AF37] rounded-full z-10"></div>

            {/* Dial Center Text */}
            <div className="absolute bottom-8 text-center">
              <span className="font-display text-3xl text-[#0B1F3A] block font-bold leading-none">
                {activeForecast.forecast_goods_trains}
              </span>
              <span className="font-mono text-[9px] text-[#7A1F2B] uppercase font-bold tracking-wider">
                FREIGHT RAKES / DAY
              </span>
            </div>
          </div>

          <StampBadge status={`${activeForecast.confidence_pct}% CONFIDENCE`} type="APPROVED" />
        </div>

        {/* Forecast Breakdown Cards */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#0B1F3A] text-[#F3ECD9] p-5 rounded border-2 border-[#D4AF37] shadow-desi">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-[#D4AF37]">
                SECTION TRAFFIC FORECAST SUMMARY ({selectedCorridorId})
              </h3>
              <span className="font-mono text-xs text-white/80">AI FORECAST MODEL v4</span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-center">
              <div className="bg-[#F3ECD9]/10 p-3 rounded border border-white/20">
                <span className="text-[10px] text-[#D4AF37] uppercase block">PREDICTED GOODS TRAINS</span>
                <span className="font-display text-2xl text-white block mt-1">{activeForecast.forecast_goods_trains}</span>
              </div>
              <div className="bg-[#F3ECD9]/10 p-3 rounded border border-white/20">
                <span className="text-[10px] text-[#D4AF37] uppercase block">PEAK TRAFFIC PERIOD</span>
                <span className="font-display text-lg text-white block mt-1">{activeForecast.peak_period}</span>
              </div>
              <div className="bg-[#F3ECD9]/10 p-3 rounded border border-white/20">
                <span className="text-[10px] text-[#D4AF37] uppercase block">MODEL CONFIDENCE</span>
                <span className="font-display text-2xl text-[#D4AF37] block mt-1">{activeForecast.confidence_pct}%</span>
              </div>
            </div>
          </div>

          {/* List of upcoming days forecast */}
          <div className="bg-[#F9F6EE] border-2 border-[#0B1F3A] rounded p-4 shadow-desi">
            <h4 className="font-display text-lg uppercase text-[#0B1F3A] mb-3">UPCOMING DAY-WISE FORECASTS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              {selectedForecasts.map((f) => (
                <div key={f.forecast_id} className="bg-[#F3ECD9] p-3 rounded border border-[#0B1F3A]/20">
                  <span className="text-[#7A1F2B] font-bold block">{f.forecast_date}</span>
                  <span className="font-bold text-[#0B1F3A] text-base block my-1">{f.forecast_goods_trains} RAKES</span>
                  <span className="text-[10px] text-[#0B1F3A]/70 uppercase block">{f.peak_period}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsForecastPage;
