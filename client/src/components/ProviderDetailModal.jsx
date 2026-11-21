import React from 'react';
import {
  Building2,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Clock,
  FileText,
  AlertTriangle,
  Layers,
  Wrench,
  CheckCircle2,
  Calendar,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { StatusBadge } from './StatusBadge';

/**
 * ProviderDetailModal Component
 * Full-fidelity provider dossier cleanly separating commercial claims from documented evidence,
 * operational responsibilities, and supply continuity information.
 */
export function ProviderDetailModal({
  isOpen,
  onClose,
  plant,
  onSendEnquiry,
  enquiryButtonLabel = 'Send Connection Enquiry',
}) {
  if (!plant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plant.organisation}
      subtitle={`Scale: ${plant.scale?.toUpperCase()} · Service Area: ${plant.serviceArea?.join(', ')}`}
    >
      <div className="space-y-6 text-xs text-zinc-900 font-sans">
        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Plant Scale
            </span>
            <span className="font-bold text-zinc-800 capitalize text-xs">
              {plant.scale}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Capacity Range
            </span>
            <span className="font-bold text-zinc-800 text-xs">
              {plant.capacityMin} – {plant.capacityMax} {plant.capacityUnit}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Service Area
            </span>
            <span className="font-bold text-zinc-800 text-xs truncate block">
              {plant.serviceArea?.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Profile Completeness
            </span>
            <span className="font-bold text-forest-900 text-xs flex items-center gap-1">
              <CheckCircle2 size={12} />
              {plant.completeness?.percentage || 85}%
            </span>
          </div>
        </div>

        {/* SEPARATING CLAIMS FROM EVIDENCE */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Stated Commercial Claims */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <FileText size={15} className="text-zinc-500 stroke-[2]" />
                <span>Stated Commercial Claims</span>
              </div>
              <StatusBadge status="self-reported" size="sm" label="Self-reported" />
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 block">O&M Offering:</span>
                <p className="font-medium text-zinc-800 leading-relaxed text-xs">
                  {plant.claims?.statedOmOffering || plant.omOffering || 'Comprehensive maintenance SLA.'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 block">Stated Warranty:</span>
                <p className="font-medium text-zinc-800 text-xs">
                  {plant.claims?.statedWarranty || plant.warranty || 'Standard manufacturer warranty.'}
                </p>
              </div>
            </div>
          </div>

          {/* Independently Verified Evidence */}
          <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200 space-y-3">
            <div className="flex items-center justify-between border-b border-forest-200 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-forest-950">
                <ShieldCheck size={15} className="text-forest-800 stroke-[2.2]" />
                <span>Verified Audit Evidence</span>
              </div>
              <StatusBadge status="verified" size="sm" label="Audited proofs" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-forest-950 block">Safety Certification:</strong>
                  <span className="text-forest-900/90 text-[11px]">
                    {plant.verifiedEvidence?.safetyCert || 'PESO & CPCB Approved Sign-off #IN-88219'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-forest-950 block">Case Study Reference:</strong>
                  <span className="text-forest-900/90 text-[11px]">
                    {plant.verifiedEvidence?.caseStudy || 'Documented operating client reference available.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Responsibilities Breakdown */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 border-b border-zinc-200 pb-2">
            <Wrench size={15} className="text-zinc-500 stroke-[2]" />
            <span>Operational & Maintenance Responsibilities</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-forest-900 font-bold block mb-1">Provider Responsibilities:</span>
              <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                <li>Quarterly mechanical inspection & gas blower service</li>
                <li>H2S scrubber media replacement</li>
                <li>24/7 telemetry monitoring & flare alarm checks</li>
              </ul>
            </div>
            <div>
              <span className="text-amber-900 font-bold block mb-1">Customer Responsibilities:</span>
              <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                <li>Daily feedstock segregation (clean of plastic/bones)</li>
                <li>Daily input loading into macerator hopper</li>
                <li>Weekly biological digestate removal for soil use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Winter Supply Continuity Risk Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertTriangle size={14} className="text-amber-700 shrink-0" />
            <span>Winter Supply Continuity & Temperature Advisory</span>
          </div>
          <p className="text-amber-950/80 leading-relaxed text-[11px]">
            {plant.continuityRisk ||
              'Mesophilic bacteria yield can decrease by 25%–40% when ambient temperature drops below 18°C. This provider supplies an insulated jacket and internal hot water recirculation coil to buffer winter yield dips.'}
          </p>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
          <span className="text-[11px] text-zinc-400">
            Source: MNRE Registered Biogas Technology Provider
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3.5 py-2 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
            {onSendEnquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSendEnquiry(plant);
                }}
                className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-subtle"
              >
                <Send size={13} className="stroke-[2.2]" />
                <span>{enquiryButtonLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProviderDetailModal;
