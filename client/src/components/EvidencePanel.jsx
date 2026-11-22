import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BookOpen, Calendar, Info, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function EvidencePanel({
  assumptions = {},
  title = 'Documented calculation assumptions',
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const {
    wasteType,
    yieldRange,
    methaneConcentration,
    source = 'Research benchmark database',
    date = '2024',
    caveat = 'Yield is subject to feedstock purity, volatile solids ratio, and digester operating temperature.',
  } = assumptions;

  return (
    <div
      className={`bg-white rounded-xl border border-zinc-200/90 p-4 sm:p-5 text-zinc-900 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-sans ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-forest-900 shrink-0 stroke-[1.5]" aria-hidden="true" />
          <h4 className="text-xs sm:text-sm font-medium text-zinc-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="illustrative" size="sm" label="Illustrative data" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-500 hover:text-zinc-800 p-1 rounded-lg cursor-pointer"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse evidence details' : 'Expand evidence details'}
          >
            {isOpen ? <ChevronUp size={14} className="stroke-[1.5]" /> : <ChevronDown size={14} className="stroke-[1.5]" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3 text-xs leading-relaxed overflow-hidden"
          >
            {yieldRange && (
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div>
                  <span className="text-[11px] text-zinc-500 block">
                    Baseline conversion
                  </span>
                  <span className="font-medium text-zinc-900 text-xs tabular-nums">{yieldRange}</span>
                </div>
                {methaneConcentration && (
                  <div>
                    <span className="text-[11px] text-zinc-500 block">
                      CH₄ concentration
                    </span>
                    <span className="font-medium text-zinc-900 text-xs tabular-nums">{methaneConcentration}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1 text-zinc-600">
              <div className="flex items-start gap-1.5">
                <Info size={13} className="text-zinc-400 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
                <span>
                  <strong className="text-zinc-800 font-medium">Source:</strong> {source}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-400 shrink-0 stroke-[1.5]" aria-hidden="true" />
                <span>
                  <strong className="text-zinc-800 font-medium">Reference date:</strong> {date}
                </span>
              </div>
            </div>

            {caveat && (
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-700 flex items-start gap-2">
                <ShieldAlert size={14} className="text-zinc-500 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
                <div className="space-y-0.5">
                  <span className="font-medium block text-zinc-900">Engineering caveat</span>
                  <p className="leading-normal text-zinc-600">{caveat}</p>
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
