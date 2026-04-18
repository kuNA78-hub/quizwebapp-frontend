import React from 'react';

export const NeoButton = ({ children, onClick, className = "", variant = "primary", type = "button" }) => {
  const variants = {
    primary: "bg-[#5c94ff] text-white",
    secondary: "bg-white text-black",
    accent: "bg-yellow-400 text-black",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`brutal-border brutal-shadow-sm brutal-interactive px-6 py-2 font-black uppercase tracking-tight ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
