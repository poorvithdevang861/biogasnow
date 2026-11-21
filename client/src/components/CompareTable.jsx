import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, Clock, Building2, Check, X, Info } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

/**
 * CompareTable Component
 * Side-by-side comparison of 2 to 3 plant providers with uniform rows and visibly flagged missing data.
 */
export function CompareTable({
  plants = [],
  selectedForEnquiry = [],
  onToggleSelect,
  onRemove,
  className = '',
}) {
  if (!plants || plants.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
        Please select at least 2 plant providers to view side-by-side comparison.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto bg-white rounded-2xl border border-zinc-200 shadow-subtle ${className}`}>
      <table className="w-full text-left border-collapse text-xs font-sans">
        {/* Table Header: Providers */}
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/80">
            <th className="p-4 sm:p-5 w-1/4 min-w-[180px] text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Comparison Metric
            </th>
            {plants.map((plant) => {
              const isSelected = selectedForEnquiry.includes(plant.id);
              return (
                <th key={plant.id} className="p-4 sm:p-5 min-w-[240px] align-top">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-zinc-900 block">{plant.organisation}</span>
                      {onRemove && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => onRemove(plant.id)}
                          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors cursor-pointer"
                          title="Remove from comparison"
                          aria-label={`Remove ${plant.organisation} from comparison`}
                        >
                          <X size={15} />
                        </motion.button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="capitalize text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        Scale: {plant.scale}
                      </span>
                    </div>

                    {onToggleSelect && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => onToggleSelect(plant.id)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-forest-900 text-white border-forest-800 hover:bg-forest-800 shadow-subtle'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        {isSelected ? <Check size={13} className="stroke-[3]" /> : null}
                        <span>{isSelected ? 'Selected for Enquiry' : 'Select for Enquiry'}</span>
                      </motion.button>
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
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              Capacity Range
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 sm:p-5 text-zinc-700 font-medium">
                {p.capacityRange}
              </td>
            ))}
          </tr>

          {/* Row 2: Service Area */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              Service Area
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 sm:p-5 text-zinc-700">
                <div className="flex flex-wrap gap-1">
                  {p.serviceArea.map((area) => (
                    <span key={area} className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px]">
                      {area}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Row 3: Stated O&M Offering (Claim) */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Stated O&M Agreement</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Provider's commercial claim</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 sm:p-5 text-zinc-700">
                {p.isOmMissing ? (
                  <StatusBadge status="missing" label="Not provided / Not verified" size="sm" />
                ) : (
                  <p className="leading-relaxed text-xs">{p.statedOmOffering}</p>
                )}
              </td>
            ))}
          </tr>

          {/* Row 4: Warranty Coverage */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Warranty Coverage</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Component & vessel guarantees</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 sm:p-5 text-zinc-700">
                {p.isWarrantyMissing ? (
                  <StatusBadge status="missing" label="Not provided / Not verified" size="sm" />
                ) : (
                  <span className="font-medium text-zinc-800">{p.statedWarranty}</span>
                )}
              </td>
            ))}
          </tr>

          {/* SECTION HEADER: VERIFIED EVIDENCE */}
          <tr className="bg-forest-50/70 border-y border-forest-200">
            <td colSpan={plants.length + 1} className="px-4 sm:px-5 py-2.5 font-bold text-forest-950 text-xs tracking-wide">
              Documented & Independent Evidence
            </td>
          </tr>

          {/* Row 5: Commissioning Certificate */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Commissioning Sign-off</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Safety, pressure & gas compliance</span>
              </div>
            </td>
            {plants.map((p) => {
              const comm = p.evidenceDetails?.commissioning;
              return (
                <td key={p.id} className="p-4 sm:p-5 space-y-1.5">
                  <StatusBadge status={comm?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{comm?.title}</p>
                  {comm?.source && comm.source !== 'Not provided' && (
                    <span className="text-[10px] text-zinc-400 block">Ref: {comm.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 6: Customer Reference */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Client Reference</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Verified continuous uptime</span>
              </div>
            </td>
            {plants.map((p) => {
              const ref = p.evidenceDetails?.reference;
              return (
                <td key={p.id} className="p-4 sm:p-5 space-y-1.5">
                  <StatusBadge status={ref?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{ref?.title}</p>
                  {ref?.source && ref.source !== 'Not provided' && (
                    <span className="text-[10px] text-zinc-400 block">Ref: {ref.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 7: Demonstrated Project Example */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Case Study Example</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Operating installation</span>
              </div>
            </td>
            {plants.map((p) => {
              const proj = p.evidenceDetails?.projectExample;
              return (
                <td key={p.id} className="p-4 sm:p-5 space-y-1.5">
                  <StatusBadge status={proj?.status || 'missing'} size="sm" />
                  <p className="text-[11px] text-zinc-700">{proj?.title}</p>
                  {proj?.source && proj.source !== 'Not provided' && (
                    <span className="text-[10px] text-zinc-400 block">Ref: {proj.source}</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 8: Supply Continuity */}
          <tr>
            <td className="p-4 sm:p-5 font-semibold text-zinc-800 bg-zinc-50/50">
              <div>
                <span>Continuity & Winter Risk</span>
                <span className="text-[10px] text-zinc-500 block font-normal">Thermal insulation & storage</span>
              </div>
            </td>
            {plants.map((p) => (
              <td key={p.id} className="p-4 sm:p-5 text-zinc-700 leading-relaxed text-[11px]">
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
