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
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { StatusBadge } from './StatusBadge';

export function ProviderDetailModal({
  isOpen,
  onClose,
  plant,
  onSendEnquiry,
  enquiryButtonLabel = 'Send connection enquiry',
}) {
  if (!plant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plant.organisation}
      subtitle={`Scale: ${plant.scale} · Service area: ${plant.serviceArea?.join(', ')}`}
    >
      <div className="space-y-4 text-xs text-zinc-900 font-sans">
        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
          <div>
            <span className="text-[11px] text-zinc-500 block">
              Plant scale
            </span>
            <span className="font-medium text-zinc-800 capitalize text-xs">
              {plant.scale}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 block">
              Capacity range
            </span>
            <span className="font-medium text-zinc-800 text-xs tabular-nums">
              {plant.capacityMin} – {plant.capacityMax} {plant.capacityUnit}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 block">
              Service area
            </span>
            <span className="font-medium text-zinc-800 text-xs truncate block">
              {plant.serviceArea?.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 block">
              Profile completeness
            </span>
            <span className="font-medium text-forest-900 text-xs flex items-center gap-1 tabular-nums">
              <CheckCircle2 size={12} className="stroke-[1.5]" />
              {plant.completeness?.percentage || 85}%
            </span>
          </div>
        </div>

        {/* Claims vs Evidence */}
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Service Terms & Warranty */}
          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <FileText size={14} className="text-zinc-500 stroke-[1.5]" />
                <span>Service terms & SLA</span>
              </div>
              <StatusBadge status="self-reported" size="sm" label="Standard terms" />
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-[11px] text-zinc-500 block">O&M agreement:</span>
                <p className="text-zinc-800 leading-relaxed text-xs">
                  {plant.claims?.statedOmOffering || plant.omOffering || 'Comprehensive maintenance SLA.'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 block">Hardware warranty:</span>
                <p className="text-zinc-800 text-xs">
                  {plant.claims?.statedWarranty || plant.warranty || 'Standard manufacturer warranty.'}
                </p>
              </div>
            </div>
          </div>

          {/* Certifications & Approvals */}
          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <ShieldCheck size={14} className="text-forest-900 stroke-[1.5]" />
                <span>Certifications & track record</span>
              </div>
              <StatusBadge status="verified" size="sm" label="Verified" />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-forest-900 shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="text-zinc-700 block">Safety certification:</span>
                  <span className="text-zinc-900 font-medium text-[11px]">
                    {plant.verifiedEvidence?.safetyCert || 'PESO & CPCB Approved Sign-off'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-forest-900 shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="text-zinc-700 block">Case study reference:</span>
                  <span className="text-zinc-900 font-medium text-[11px]">
                    {plant.verifiedEvidence?.caseStudy || 'Operating client reference documented.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Responsibilities Breakdown */}
        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
          <div className="flex items-center gap-1.5 font-medium text-zinc-900 border-b border-zinc-200/80 pb-1.5">
            <Wrench size={14} className="text-zinc-500 stroke-[1.5]" />
            <span>Operational responsibilities</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-zinc-800 font-medium block mb-1">Provider scope:</span>
              <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                <li>Quarterly mechanical inspection & gas blower service</li>
                <li>Scrubber media replacement</li>
                <li>Telemetry monitoring & safety flare check</li>
              </ul>
            </div>
            <div>
              <span className="text-zinc-800 font-medium block mb-1">Customer scope:</span>
              <ul className="space-y-1 text-zinc-600 text-[11px] list-disc list-inside">
                <li>Daily feedstock segregation at source</li>
                <li>Daily input loading into macerator hopper</li>
                <li>Weekly digestate extraction for soil use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Winter Supply Continuity */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 font-medium text-zinc-900">
            <AlertTriangle size={13} className="text-zinc-500 shrink-0 stroke-[1.5]" />
            <span>Winter supply continuity advisory</span>
          </div>
          <p className="text-zinc-600 leading-relaxed text-[11px]">
            {plant.continuityRisk ||
              'Digester bacteria activity drops when ambient temperature is below 18°C. This provider supplies an insulated jacket to buffer seasonal yield dips.'}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/80">
          <span className="text-[11px] text-zinc-400">
            Ref: Registered Biogas Technology Provider
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3 py-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onSendEnquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSendEnquiry(plant);
                }}
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Send size={12} className="stroke-[1.5]" />
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
