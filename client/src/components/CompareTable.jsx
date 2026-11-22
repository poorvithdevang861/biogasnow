import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, Clock, Building2, Check, X, Info } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function CompareTable({
  plants = [],
  selectedForEnquiry = [],
  onToggleSelect,
  onRemove,
  className = '',
}) {
  if (!plants || plants.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs">
        Please select at least 2 plant providers to view side-by-side comparison.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}>
      <table className="w-full text-left border-collapse text-xs font-sans">
        {/* Table Header: Providers */}
        <thead>
          <tr className="border-b border-zinc-200/90 bg-zinc-50/70">
            <th className="p-4 w-1/4 min-w-[180px] text-xs font-medium text-zinc-500">
              Comparison metric
            </th>
            {plants.map((plant) => {
              const isSelected = selectedForEnquiry.includes(plant.id);
              return (
                <th key={plant.id} className="p-4 min-w-[240px] align-top">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-zinc-900 block">{plant.organisation}</span>
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(plant.id)}
                          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors cursor-pointer"
                          title="Remove from comparison"
                          aria-label={`Remove ${plant.organisation} from comparison`}
                        >
                          <X size={14} className="stroke-[1.5]" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="capitalize text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        Scale: {plant.scale}
                      </span>
                    </div>

                    {onToggleSelect && (
                      <button
                        type="button"
                        onClick={() => onToggleSelect(plant.id)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {isSelected ? <Check size={13} className="stroke-[1.5]" /> : null}
                        <span>{isSelected ? 'Selected for proposal' : 'Select for proposal'}</span>
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-100">
          {/* Row 1: Capacity Range */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              Capacity range
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 text-zinc-700 tabular-nums">
                {p.capacityRange}
              </td>
            ))}
          </tr>

          {/* Row 2: Service Area */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              Service area
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 text-zinc-700">
                <div className="flex flex-wrap gap-1">
                  {p.serviceArea.map((area) => (
                    <span key={area} className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px]">
                      {area}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Row 3: Stated O&M Offering */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Stated O&M agreement</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Commercial SLA</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 text-zinc-700">
                {p.isOmMissing ? (
                  <StatusBadge status="missing" label="Not provided" size="sm" />
                ) : (
                  <p className="leading-relaxed text-xs">{p.statedOmOffering}</p>
                )}
              </td>
            ))}
          </tr>

          {/* Row 4: Warranty Coverage */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Warranty coverage</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Hardware & vessel terms</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 text-zinc-700">
                {p.isWarrantyMissing ? (
                  <StatusBadge status="missing" label="Not provided" size="sm" />
                ) : (
                  <span className="text-zinc-800">{p.statedWarranty}</span>
                )}
              </td>
            ))}
          </tr>

          {/* SECTION HEADER: VERIFIED EVIDENCE */}
          <tr className="bg-zinc-50 border-y border-zinc-200/80">
            <td colSpan={plants.length + 1} className="px-4 py-2 font-medium text-zinc-900 text-xs">
              Documented & audited evidence
            </td>
          </tr>

          {/* Row 5: Commissioning Certificate */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Commissioning sign-off</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Safety, pressure & gas tests</span>
              </div>
            </td>
            {plants.map((p) => {
              const comm = p.evidenceDetails?.commissioning;
              return (
                <td key={p.id} className="p-4 space-y-1">
                  <StatusBadge status={comm?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{comm?.title}</p>
                  {comm?.source && comm.source !== 'Not provided' && (
                    <span className="text-[11px] text-zinc-400 block">Ref: {comm.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 6: Customer Reference */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Client reference</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Operating client verification</span>
              </div>
            </td>
            {plants.map((p) => {
              const ref = p.evidenceDetails?.reference;
              return (
                <td key={p.id} className="p-4 space-y-1">
                  <StatusBadge status={ref?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{ref?.title}</p>
                  {ref?.source && ref.source !== 'Not provided' && (
                    <span className="text-[11px] text-zinc-400 block">Ref: {ref.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 7: Demonstrated Project Example */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Demonstrated project</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Operating case study</span>
              </div>
            </td>
            {plants.map((p) => {
              const proj = p.evidenceDetails?.projectExample;
              return (
                <td key={p.id} className="p-4 space-y-1">
                  <StatusBadge status={proj?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{proj?.title}</p>
                  {proj?.source && proj.source !== 'Not provided' && (
                    <span className="text-[11px] text-zinc-400 block">Ref: {proj.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 8: Supply Continuity */}
          <tr>
            <td className="p-4 font-medium text-zinc-800 bg-zinc-50/40">
              <div>
                <span>Continuity & winter risk</span>
                <span className="text-[11px] text-zinc-400 block font-normal">Thermal insulation & buffer</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 text-zinc-700 leading-relaxed text-xs">
                {p.continuityRisk}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CompareTable;
