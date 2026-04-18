import React from 'react';

export const Card = ({ className, children, ...props }) => (
  <div className={`brutal-card bg-white rounded-none ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={`border-b-2 border-black p-4 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-xl font-bold ${className}`} {...props}>{children}</h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={`border-t-2 border-black p-4 ${className}`} {...props}>{children}</div>
);
