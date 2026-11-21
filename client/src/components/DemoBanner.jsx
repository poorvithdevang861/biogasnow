import React, { useState } from 'react';
import { Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export function DemoBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      aria-label="Prototype Notice"
      className="bg-[#FAF3E0] border-b border-amber-200/90 text-amber-950 text-xs px-4 py-2"
    >
      <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-amber-200/80 text-amber-950 text-[11px] tracking-wide">
            <AlertTriangle size={12} className="shrink-0 stroke-[2.2]" aria-hidden="true" />
            Prototype Notice
          </span>
          <span className="font-normal text-slate-700">
            All outputs are illustrative sample ranges with documented assumptions. No savings or fixed yields are guaranteed.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-amber-900 hover:text-amber-950 flex items-center gap-1 underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-amber-700 rounded px-1"
          aria-expanded={expanded}
        >
          <span>{expanded ? 'Close constraints' : 'View prototype constraints'}</span>
          {expanded ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-[1100px] mx-auto mt-2.5 pt-2.5 border-t border-amber-200/70 text-xs text-slate-700 grid sm:grid-cols-3 gap-3">
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/80">
            <span className="font-semibold text-slate-900 block mb-1">Role Persona Switcher</span>
            Switch between Waste Provider, Consumer, and Plant Provider profiles via the top header dropdown. No passwords or signup required.
          </div>
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/80">
            <span className="font-semibold text-slate-900 block mb-1">Visible Missing Evidence</span>
            Unsubmitted commissioning reports or missing warranties stay visibly marked as "Not provided / Not verified".
          </div>
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/80">
            <span className="font-semibold text-slate-900 block mb-1">Simulated Enquiries</span>
            Enquiries are stored locally in the demo data store with review summaries. Real payments and legal contracts are out of scope.
          </div>
        </div>
      )}
    </aside>
  );
}

export default DemoBanner;
