import React, { useState } from 'react';
import { BookOpen, Calendar, Info, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

/**
 * EvidencePanel Component (Dark Theme)
 * Displays transparent assumptions, sources, dates, units, and caveats for any claim or yield range.
 */
export function EvidencePanel({
  assumptions = {},
  title = 'Documented Calculation Assumptions',
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(true);

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
      className={`bg-zinc-900 rounded-2xl border border-zinc-800 p-4 sm:p-5 text-zinc-100 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
          <h4 className="text-xs sm:text-sm font-bold text-zinc-100">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="illustrative" size="sm" label="Illustrative data" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-400 hover:text-zinc-200 p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse evidence details' : 'Expand evidence details'}
          >
            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 text-xs leading-relaxed">
          {yieldRange && (
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider font-mono">
                  Baseline Conversion
                </span>
                <span className="font-semibold text-zinc-100 text-xs font-mono">{yieldRange}</span>
              </div>
              {methaneConcentration && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider font-mono">
                    CH4 Concentration
                  </span>
                  <span className="font-semibold text-zinc-100 text-xs font-mono">{methaneConcentration}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5 text-zinc-400">
            <div className="flex items-start gap-1.5">
              <Info size={13} className="text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong className="text-zinc-200">Source:</strong> {source}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-zinc-500 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-zinc-200">Reference Date:</strong> {date}
              </span>
            </div>
          </div>

          {caveat && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-200 flex items-start gap-2">
              <ShieldAlert size={14} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-bold block mb-0.5 text-amber-300">Engineering Caveat</span>
                <p className="leading-normal">{caveat}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvidencePanel;
