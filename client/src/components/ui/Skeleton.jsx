import React from 'react';

/**
 * Premium Skeleton Loader Component
 * Subtle shimmer effect for loading states without jarring layout shifts.
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200/80 rounded-lg ${className}`}
      {...props}
    />
  );
}

export default Skeleton;