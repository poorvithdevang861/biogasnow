import React from 'react';
import {
  ShieldCheck,
  FileText,
  Clock,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

/**
 * StatusBadge Component
 * Semantic, accessible trust indicator combining icon, label, and high-contrast color.
 * Does not rely solely on color for accessibility.
 */
export function StatusBadge({
  status = 'illustrative',
  label,
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const normalizedStatus = status?.toLowerCase() || 'illustrative';

  let config = {
    bg: 'bg-zinc-100 border-zinc-200 text-zinc-700',
    icon: Info,
    defaultLabel: 'Illustrative benchmark',
  };

  switch (normalizedStatus) {
    case 'verified':
    case 'provided':
      config = {
        bg: 'bg-forest-50 border-forest-200 text-forest-900',
        icon: ShieldCheck,
        defaultLabel: 'Verified / Audited',
      };
      break;

    case 'self-reported':
    case 'self_reported':
      config = {
        bg: 'bg-zinc-100 border-zinc-200 text-zinc-800',
        icon: FileText,
        defaultLabel: 'Self-reported claim',
      };
      break;

    case 'pending':
    case 'pending_review':
      config = {
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
        icon: Clock,
        defaultLabel: 'Pending audit',
      };
      break;

    case 'missing':
    case 'not provided':
    case 'not verified':
      config = {
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
        icon: AlertCircle,
        defaultLabel: 'Not provided / Missing',
      };
      break;

    case 'notsure':
    case 'not sure':
    case 'assessment required':
      config = {
        bg: 'bg-amber-50/60 border-amber-200 text-amber-900',
        icon: HelpCircle,
        defaultLabel: 'Assessment required',
      };
      break;

    default:
      config = {
        bg: 'bg-zinc-100 border-zinc-200 text-zinc-700',
        icon: Info,
        defaultLabel: 'Illustrative benchmark',
      };
      break;
  }

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      } ${className}`}
    >
      <Icon size={isSm ? 11 : 13} className="shrink-0 stroke-[2.2]" aria-hidden="true" />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
}

export default StatusBadge;
