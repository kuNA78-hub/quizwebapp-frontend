import React from 'react';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`brutal-input w-full rounded-none border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
