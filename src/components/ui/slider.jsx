import React from 'react';

export function Slider({ className = '', ...props }) {
  return (
    <input
      type="range"
      className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${className}`}
      {...props}
    />
  );
}


