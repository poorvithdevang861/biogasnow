import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function RangeBar({
  min = 0,
  max = 0,
  unit = 'm³/day',
  label = 'Estimated output range',
  sublabel = 'Indicative biological spread based on documented feedstock benchmarks',
  accentColor = 'emerald',
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  const colorStyles = {
    emerald: {
      bar: 'bg-forest-900',
      track: 'bg-zinc-100',
      pill: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      text: 'text-zinc-900',
    },
    orange: {
      bar: 'bg-forest-900',
      track: 'bg-zinc-100',
      pill: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      text: 'text-zinc-900',
    },
    teal: {
      bar: 'bg-forest-900',
      track: 'bg-zinc-100',
      pill: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      text: 'text-zinc-900',
    },
  }[accentColor] || colorStyles.emerald;

  const midpoint = Math.round(((min + max) / 2) * 10) / 10;

  return (
    <div className={`space-y-3 p-4 sm:p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-sans ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs text-zinc-500 block">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-2xl sm:text-3xl font-medium tracking-tight tabular-nums ${colorStyles.text}`}>
              {min} – {max}
            </span>
            <span className="text-xs text-zinc-500">{unit}</span>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${colorStyles.pill}`}>
          Indicative range
        </span>
      </div>

      {/* Visual Range Indicator Bar */}
      <div className="space-y-1 pt-1">
        <div className={`relative h-2 w-full rounded-full overflow-hidden ${colorStyles.track}`}>
          <motion.div
            initial={shouldReduceMotion ? { width: '85%' } : { width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${colorStyles.bar}`}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-zinc-400 tabular-nums">
          <span>Min: {min} {unit.split('/')[0]}</span>
          <span>Benchmark avg: ~{midpoint}</span>
          <span>Max: {max} {unit.split('/')[0]}</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 leading-normal border-t border-zinc-100 pt-2">
        {sublabel}. Yield varies with operating temperature, retention time, and moisture dilution.
      </p>
    </div>
  );
}

export default RangeBar;
