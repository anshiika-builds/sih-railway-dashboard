import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const EnamelSign = ({ title, message, level = 'warning', className = '' }) => {
  const isDanger = level === 'danger';
  const bgColor = isDanger ? 'bg-[#7A1F2B]' : 'bg-[#0B1F3A]';
  const accentColor = isDanger ? 'text-[#F3ECD9]' : 'text-[#D4AF37]';

  return (
    <div className={`enamel-sign ${bgColor} p-4 rounded relative overflow-hidden ${className}`}>
      {/* Brass Rivets */}
      <div className="brass-rivet tl"></div>
      <div className="brass-rivet tr"></div>
      <div className="brass-rivet bl"></div>
      <div className="brass-rivet br"></div>

      <div className="flex items-start gap-3.5 pl-3">
        <div className={`p-2.5 rounded bg-black/30 border border-white/20 ${accentColor}`}>
          {isDanger ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <h4 className="font-display text-lg tracking-wide uppercase text-[#F3ECD9] flex items-center gap-2">
            <span>⚠ CAUTION / ALERT:</span> {title}
          </h4>
          <p className="text-sm font-sans text-[#F3ECD9]/90 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnamelSign;
