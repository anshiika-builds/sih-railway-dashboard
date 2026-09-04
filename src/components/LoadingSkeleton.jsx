import React from 'react';
import { Train, Radio } from 'lucide-react';

export const LoadingSkeleton = ({ status, loadedCount, totalFiles }) => {
  const pct = Math.round((loadedCount / totalFiles) * 100);

  return (
    <div className="min-h-screen bg-[#F3ECD9] flex flex-col items-center justify-center p-6 text-[#0B1F3A]">
      <div className="w-full max-w-md bg-[#F9F6EE] border-4 border-[#0B1F3A] shadow-desi-lg p-6 rounded relative overflow-hidden text-center">
        {/* Top Decorative Railway Bar */}
        <div className="jaali-pattern h-4 -mx-6 -mt-6 mb-6 border-b-2 border-[#0B1F3A]"></div>

        <div className="w-16 h-16 bg-[#7A1F2B] text-[#F3ECD9] rounded-full mx-auto flex items-center justify-center border-2 border-[#0B1F3A] shadow-desi mb-4 animate-bounce">
          <Train className="w-9 h-9" />
        </div>

        <h2 className="font-display text-2xl uppercase tracking-wider text-[#0B1F3A] mb-1">
          INDIAN RAILWAYS
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-[#7A1F2B] font-bold mb-4">
          AUTOMATIC BLOCK PLANNING ENGINE • SIH26027
        </p>

        {/* Progress Bar Container */}
        <div className="bg-[#F3ECD9] border-2 border-[#0B1F3A] p-1 rounded mb-4">
          <div
            className="bg-[#1B4D3E] h-4 rounded transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${Math.max(pct, 8)}%` }}
          >
            <span className="font-mono text-[10px] text-[#F3ECD9] font-bold">
              {pct}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 font-mono text-xs text-[#0B1F3A]/80 bg-[#0B1F3A]/5 py-2 px-3 rounded border border-[#0B1F3A]/20">
          <Radio className="w-4 h-4 text-[#7A1F2B] animate-pulse" />
          <span>{status}</span>
        </div>

        {/* Bottom Ticket Seal */}
        <div className="mt-6 border-t-2 border-dashed border-[#0B1F3A]/30 pt-3 text-[11px] font-mono text-[#0B1F3A]/60 uppercase flex items-center justify-between">
          <span>COA INTERFACE LIVE</span>
          <span>PARSINGSTATIC DATASETS</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
