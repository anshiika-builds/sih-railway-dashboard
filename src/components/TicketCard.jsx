import React from 'react';

export const TicketCard = ({ title, serialNo, children, className = '', headerBg = 'bg-[#0B1F3A]' }) => {
  return (
    <div className={`ticket-stub rounded-sm overflow-hidden ${className}`}>
      {/* Ticket Header Bar */}
      <div className={`${headerBg} text-[#F3ECD9] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#0B1F3A]`}>
        <h3 className="font-display tracking-wider text-base uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37]"></span>
          {title}
        </h3>
        {serialNo && (
          <span className="font-mono text-xs text-[#D4AF37] opacity-90 tracking-widest bg-black/30 px-2 py-0.5 rounded border border-[#D4AF37]/40">
            TICKET #{serialNo}
          </span>
        )}
      </div>

      {/* Ticket Content Body */}
      <div className="p-4 relative">
        {children}
      </div>

      {/* Perforated Divider Line */}
      <div className="border-t-2 border-dashed border-[#0B1F3A]/30 my-1 mx-4"></div>

      {/* Ticket Footer Stamp Line */}
      <div className="px-4 py-2 bg-[#F3ECD9]/60 flex items-center justify-between text-[11px] font-mono text-[#0B1F3A]/70 uppercase tracking-wider">
        <span>IR-BLOCK-SEC / SIH26027</span>
        <span>AUTH SEAL: OK</span>
      </div>
    </div>
  );
};

export default TicketCard;
