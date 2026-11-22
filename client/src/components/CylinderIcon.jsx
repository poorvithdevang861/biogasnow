import React from 'react';

/**
 * Premium SVG representation of a commercial LPG cylinder (19 kg standard)
 */
export function CylinderIcon({ size = 28, className = 'text-rose-600', filled = true }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.55)}
      viewBox="0 0 24 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top collar / handle */}
      <path
        d="M6 5.5C6 4.12 7.12 3 8.5 3H15.5C16.88 3 18 4.12 18 5.5V8.5H6V5.5Z"
        fill="currentColor"
        fillOpacity={filled ? 0.85 : 0.2}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Valve nozzle */}
      <rect x="10.5" y="1.5" width="3" height="3" rx="0.5" fill="currentColor" />
      {/* Neck ring */}
      <rect x="7" y="8" width="10" height="2" rx="0.5" fill="currentColor" fillOpacity={0.9} />
      {/* Main tank dome */}
      <path
        d="M4 14C4 10.5 7.5 9.5 12 9.5C16.5 9.5 20 10.5 20 14V30C20 32.5 17.5 34 12 34C6.5 34 4 32.5 4 30V14Z"
        fill="currentColor"
        fillOpacity={filled ? 0.95 : 0.15}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Body highlight sheen */}
      {filled && (
        <>
          <path
            d="M7 13.5V30.5"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M12 18C10.5 18 9 19.5 9 21.5C9 23.5 10.5 25 12 25C13.5 25 15 23.5 15 21.5C15 19.5 13.5 18 12 18Z"
            fill="white"
            fillOpacity="0.25"
          />
        </>
      )}
      {/* Base ring */}
      <path
        d="M6 34C6 33.5 7.5 33 12 33C16.5 33 18 33.5 18 34V36.5H6V34Z"
        fill="currentColor"
        fillOpacity={filled ? 0.9 : 0.3}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Visual Cylinder Group Display
 * Shows a stack or row of cylinders with count and savings badges
 */
export function CylinderDisplay({ count = 1, showLabel = true, size = 26, maxIcons = 8 }) {
  const num = Math.max(1, Math.round(Number(count) || 1));
  const visibleIcons = Math.min(num, maxIcons);
  const remaining = num - visibleIcons;

  return (
    <div className="inline-flex flex-col gap-1.5">
      <div className="flex items-end gap-1.5 flex-wrap">
        {Array.from({ length: visibleIcons }).map((_, idx) => (
          <div
            key={idx}
            className="transition-transform hover:-translate-y-1 duration-150"
            title={`LPG Cylinder #${idx + 1}`}
          >
            <CylinderIcon size={size} className="text-amber-700" filled />
          </div>
        ))}
        {remaining > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 self-center">
            +{remaining} more
          </span>
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-zinc-700">
          <strong className="text-zinc-900 font-semibold">{num}</strong> commercial 19 kg cylinders
        </span>
      )}
    </div>
  );
}

export default CylinderDisplay;
