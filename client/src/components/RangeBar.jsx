import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Gauge } from 'lucide-react';

/**
 * RangeBar Component (Dual Theme: Light + Dark Unslop)
 * Renders an indicative min-to-max range bar with animated spread fill.
 */
export function RangeBar({
  min = 0,
  max = 0,
  unit = 'm³/day',
  label = 'Estimated Output Range',
  sublabel = 'Indicative biological spread based on documented feedstock benchmarks',
  accentColor = 'emerald', // 'emerald' | 'orange' | 'teal'
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  const colorStyles = {
    emerald: {
      bar: 'bg-emerald-500',
      track: 'bg-zinc-100 dark:bg-zinc-800',
      pill: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    orange: {
      bar: 'bg-amber-500',
      track: 'bg-zinc-100 dark:bg-zinc-800',
      pill: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
    },
    teal: {
      bar: 'bg-teal-500',
      track: 'bg-zinc-100 dark:bg-zinc-800',
      pill: 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
      text: 'text-teal-600 dark:text-teal-400',
    },
  }[accentColor] || colorStyles.emerald;

  const midpoint = Math.round(((min + max) / 2) * 10) / 10;

  return (
    <div className={`space-y-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            {label}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums ${colorStyles.text}`}>
              {min} – {max}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">{unit}</span>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorStyles.pill}`}>
          Indicative Range
        </span>
      </div>

      {/* Visual Range Indicator Bar */}
      <div className="space-y-1.5 pt-1">
        <div className={`relative h-2.5 w-full rounded-full overflow-hidden ${colorStyles.track}`}>
          <motion.div
            initial={shouldReduceMotion ? { width: '85%' } : { width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${colorStyles.bar}`}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Min: {min} {unit.split('/')[0]}</span>
          <span className="text-zinc-400 dark:text-zinc-500">Benchmark avg: ~{midpoint}</span>
          <span>Max: {max} {unit.split('/')[0]}</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal border-t border-zinc-100 dark:border-zinc-800/80 pt-2.5">
        {sublabel}. Yield varies with operating temperature, retention time, and dilution.
      </p>
    </div>
  );
}

export default RangeBar;