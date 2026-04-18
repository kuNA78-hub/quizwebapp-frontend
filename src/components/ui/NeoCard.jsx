import React from 'react';

export const NeoCard = ({ children, className = "", bg = "bg-white" }) => (
  <div className={`brutal-border brutal-shadow ${bg} p-6 transition-all duration-200 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}
  </div>
);
