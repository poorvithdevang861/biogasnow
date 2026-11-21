import React from 'react';
import { HelpCircle, CheckSquare, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Help() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Role Selection</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
          <HelpCircle size={24} className="text-amber-400 shrink-0" aria-hidden="true" />
          Assisted Data Entry Checklist
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          For participants without immediate access to organic waste quantities or heating metrics. Use this reference checklist to gather information on behalf of a site owner or community kitchen.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-100 border-b border-zinc-800 pb-3">
          Required Site & Feedstock Information
        </h2>

        <div className="space-y-3.5">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-start gap-3">
            <CheckSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-zinc-100 block">1. Feedstock Volume and Frequency</span>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Approximate weight or container count per cycle (e.g. 120-litre wheelie bins per day or week). State whether kitchen waste is separated from packaging.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-start gap-3">
            <CheckSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-zinc-100 block">2. Physical Site Access & Layout</span>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Ground area available for reactor vessel, storage footprint, and vehicle access for slurry tankers or maintenance technicians.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-start gap-3">
            <CheckSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-zinc-100 block">3. Biogas Offtake Requirements</span>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Expected end-use: direct gas cooking rings, commercial boiler water heating, or micro-generator power. State if backup fuel is required for uninterrupted continuity.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2.5">
          <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <span className="font-semibold block mb-0.5 text-amber-100">"Not sure" inputs are always accepted</span>
            All step forms permit selecting "Not sure" for any specification. The platform flags these fields as <strong>"Assessment required"</strong> rather than applying speculative defaults.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
