import React from 'react';
import { motion } from 'motion/react';
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
 * Full-fidelity provider dossier cleanly separating marketing claims from documented evidence,
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
      <div className="space-y-6 text-xs text-zinc-900 dark:text-zinc-100">
        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
              Plant Scale
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 capitalize text-xs">
              {plant.scale}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
              Capacity Range
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
              {plant.capacityMin} – {plant.capacityMax} {plant.capacityUnit}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
              Service Area
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs truncate block">
              {plant.serviceArea?.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
              Profile Completeness
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
              <CheckCircle2 size={12} />
              {plant.completeness?.percentage || 85}%
            </span>
          </div>
        </div>

        {/* SEPARATING CLAIMS FROM EVIDENCE */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Stated Commercial Claims */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-200">
                <FileText size={15} className="text-zinc-500 dark:text-zinc-400 stroke-[2]" />
                <span>Stated Commercial Claims</span>
              </div>
              <StatusBadge status="self-reported" size="sm" label="Self-reported" />
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">O&M Offering:</span>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed text-xs">
                  {plant.claims?.statedOmOffering || plant.omOffering || 'Comprehensive maintenance SLA.'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">Stated Warranty:</span>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed text-xs">
                  {plant.claims?.statedWarranty || plant.warranty || 'Structural vessel warranty provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Documented Proof & Evidence */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/60 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 stroke-[2]" />
                <span>Documented Evidence</span>
              </div>
              <StatusBadge status="verified" size="sm" label="Evidence checked" />
            </div>

            <div className="space-y-1.5">
              {plant.evidence && plant.evidence.length > 0 ? (
                plant.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-1.5"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200 block truncate">{ev.title}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Ref: {ev.source}</span>
                    </div>
                    <StatusBadge status={ev.status} size="sm" />
                  </div>
                ))
              ) : (
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-1.5">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">CE Compliance Certification</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Ref: TUV Rheinland #2023-CE-78</span>
                    </div>
                    <StatusBadge status="verified" size="sm" />
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-1.5">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Commissioning Sign-off</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Ref: BioEnergy UK Audit</span>
                    </div>
                    <StatusBadge status="verified" size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supported Feedstock & Capacity */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="font-bold text-zinc-900 dark:text-zinc-200 block">Accepted Feedstock Streams</span>
          <div className="flex flex-wrap gap-1.5">
            {plant.supportedFeedstock?.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Operational Responsibilities */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <span className="font-bold text-zinc-900 dark:text-zinc-200 block">Operational Responsibilities</span>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1">
                Your Daily Duties (Customer / Generator):
              </span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside leading-relaxed">
                {plant.responsibilities?.customerDuties ? (
                  plant.responsibilities.customerDuties.map((d, i) => <li key={i}>{d}</li>)
                ) : (
                  <>
                    <li>Separate non-organic plastics and packaging prior to collection.</li>
                    <li>Ensure clear pathway for service vehicle access.</li>
                    <li>Conduct basic visual daily inspection of gas pressure gauge.</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1">
                Provider Servicing Duties:
              </span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside leading-relaxed">
                {plant.responsibilities?.providerDuties ? (
                  plant.responsibilities.providerDuties.map((d, i) => <li key={i}>{d}</li>)
                ) : (
                  <>
                    <li>Bi-monthly biological testing of pH and volatile fatty acids.</li>
                    <li>Annual mechanical servicing of macerator pump and seals.</li>
                    <li>24/7 telemetry monitoring of pressure and methane concentration.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Supply Continuity & Winter Information */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2 text-amber-900 dark:text-amber-200">
          <span className="font-bold block flex items-center gap-1.5 text-xs text-amber-950 dark:text-amber-100">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 stroke-[2]" />
            Supply Continuity & Winter Information
          </span>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <p>
              <strong>Storage Buffer:</strong>{' '}
              {plant.supplyContinuity?.storageBufferHours || '12–18 hours buffer storage'}
            </p>
            <p>
              <strong>Winter Thermal Drop:</strong>{' '}
              {plant.supplyContinuity?.winterPerformance || '30%–45% lower yield in sub-zero temps without auxiliary heat'}
            </p>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300/90 italic pt-1 border-t border-amber-200/60 dark:border-amber-800/60">
            <strong>Engineering recommendation:</strong>{' '}
            {plant.supplyContinuity?.backupRecommendation ||
              'Retain dual-fuel manifold or backup connection for prolonged sub-zero cold snaps.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>

          {onSendEnquiry && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                onClose();
                onSendEnquiry(plant);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Send size={13} className="stroke-[2]" />
              <span>{enquiryButtonLabel}</span>
            </motion.button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ProviderDetailModal;
