import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BookOpen, Calendar, Info, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

/**
 * EvidencePanel Component (Dual Theme: Light + Dark Unslop)
 * Displays transparent assumptions, sources, dates, units, and caveats for any claim or yield range.
 */
export function EvidencePanel({
  assumptions = {},
  title = 'Documented Calculation Assumptions',
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const {
    wasteType,
    yieldRange,
    methaneConcentration,
    source = 'Research Benchmark Database',
    date = '2024',
    caveat = 'Yield is subject to feedstock purity, volatile solids ratio, and digester operating temperature.',
  } = assumptions;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 text-zinc-900 dark:text-zinc-100 space-y-3 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2]" aria-hidden="true" />
          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="illustrative" size="sm" label="Illustrative data" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse evidence details' : 'Expand evidence details'}
          >
            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 text-xs leading-relaxed overflow-hidden"
          >
            {yieldRange && (
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider font-mono">
                    Baseline Conversion
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs font-mono">{yieldRange}</span>
                </div>
                {methaneConcentration && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider font-mono">
                      CH4 Concentration
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs font-mono">{methaneConcentration}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-1.5">
                <Info size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-zinc-800 dark:text-zinc-200">Source:</strong> {source}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-zinc-800 dark:text-zinc-200">Reference Date:</strong> {date}
                </span>
              </div>
            </div>

            {caveat && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold block mb-0.5 text-amber-950 dark:text-amber-300">Engineering Caveat</span>
                  <p className="leading-normal">{caveat}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EvidencePanel;
