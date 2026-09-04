import React from 'react';

export const StampBadge = ({ status, type, animate = false }) => {
  const getStatusStyles = (text) => {
    const val = (text || '').toString().toUpperCase();
    if (val.includes('APPROV') || val.includes('COMPLET') || val.includes('EXEC') || val.includes('YES') || val.includes('OPERAT')) {
      return {
        borderColor: '#1B4D3E',
        color: '#1B4D3E',
        bgColor: 'rgba(27, 77, 62, 0.08)',
        label: val.includes('APPROV') ? 'APPROVED' : val
      };
    }
    if (val.includes('PEND') || val.includes('IN PROG') || val.includes('SCHED') || val.includes('UNDER')) {
      return {
        borderColor: '#D4AF37',
        color: '#9A7B0C',
        bgColor: 'rgba(212, 175, 55, 0.12)',
        label: val
      };
    }
    if (val.includes('CLASH') || val.includes('CRIT') || val.includes('REJECT') || val.includes('CANCEL') || val.includes('FLAG') || val.includes('HIGH')) {
      return {
        borderColor: '#7A1F2B',
        color: '#7A1F2B',
        bgColor: 'rgba(122, 31, 43, 0.1)',
        label: val.includes('CLASH') ? 'CLASH DETECTED' : val
      };
    }
    return {
      borderColor: '#0B1F3A',
      color: '#0B1F3A',
      bgColor: 'rgba(11, 31, 58, 0.08)',
      label: val || 'REGISTERED'
    };
  };

  const style = getStatusStyles(status || type);

  return (
    <span
      className={`stamp-badge ${animate ? 'stamp-punch-anim' : ''}`}
      style={{
        borderColor: style.borderColor,
        color: style.color,
        backgroundColor: style.bgColor
      }}
    >
      <span className="mr-1 text-[10px]">★</span>
      {style.label}
      <span className="ml-1 text-[10px]">★</span>
    </span>
  );
};

export default StampBadge;
