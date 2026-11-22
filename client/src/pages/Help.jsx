import React from 'react';
import { HelpCircle, CheckSquare, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Help() {
  return (
    <div className="w-full space-y-6 max-w-3xl mx-auto font-sans">
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-900 hover:text-forest-800 transition-colors focus:outline-none"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to home</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-medium text-zinc-900 tracking-tight flex items-center gap-2">
          <HelpCircle size={22} className="text-zinc-600 shrink-0 stroke-[1.5]" aria-hidden="true" />
          Assisted data entry checklist
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Reference checklist to gather information on behalf of a site owner, commercial kitchen, or residential community.
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200/90 space-y-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <h2 className="text-sm font-medium text-zinc-900 border-b border-zinc-100 pb-3">
          Required site & feedstock details
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-zinc-200/80 bg-zinc-50 flex items-start gap-3">
            <CheckSquare size={16} className="text-forest-900 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
            <div className="text-xs sm:text-sm space-y-0.5">
              <span className="font-medium text-zinc-900 block">1. Feedstock volume and pickup frequency</span>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Approximate scrap weight or container count per cycle (e.g. 120-litre bins daily). Note if wet scraps are segregated from dry waste.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-200/80 bg-zinc-50 flex items-start gap-3">
            <CheckSquare size={16} className="text-forest-900 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
            <div className="text-xs sm:text-sm space-y-0.5">
              <span className="font-medium text-zinc-900 block">2. Physical site access & layout</span>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Ground area available for digester tank (10–15 m² minimum) and vehicle service lane access for collection or slurry extraction.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-200/80 bg-zinc-50 flex items-start gap-3">
            <CheckSquare size={16} className="text-forest-900 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
            <div className="text-xs sm:text-sm space-y-0.5">
              <span className="font-medium text-zinc-900 block">3. Biogas offtake needs</span>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Expected application: direct high-heat cooking rings, boiler water pre-heating, or generator fuel.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 flex items-start gap-2.5">
          <ShieldAlert size={15} className="text-zinc-500 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
          <div className="leading-relaxed space-y-0.5">
            <span className="font-medium block text-zinc-900">Uncertain inputs are always supported</span>
            <p className="text-[11px] text-zinc-600">
              All forms permit selecting "Not sure". The platform marks these as assessment items rather than guessing inaccurate defaults.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
