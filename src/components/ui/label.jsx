import React from 'react';

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-bold mb-1 block ${className}`}
    {...props}
  />
));
Label.displayName = "Label";
