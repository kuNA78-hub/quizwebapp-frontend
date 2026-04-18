import React from 'react';

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses = "brutal-button inline-flex items-center justify-center rounded-none font-bold transition-all focus:outline-none disabled:opacity-50";
  const variants = {
    default: "bg-yellow-400 text-black hover:bg-yellow-500",
    outline: "bg-white text-black hover:bg-gray-100",
    secondary: "bg-black text-white hover:bg-gray-800",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-xs",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
