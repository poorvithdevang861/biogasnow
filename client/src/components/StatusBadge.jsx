import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Info,
  Clock,
  AlertCircle,
} from 'lucide-react';

/**
 * StatusBadge Component (Dark Theme)
 * Displays semantic status with both icon and text on dark graphite.
 */
export function StatusBadge({
  status = 'illustrative',
  label,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const normalizedStatus = status?.toLowerCase() || 'illustrative';

  let config = {
    bg: 'bg-zinc-800/80 border-zinc-700 text-zinc-300',
    icon: Info,
    defaultLabel: 'Illustrative prototype data',
  };

  switch (normalizedStatus) {
    case 'verified':
    case 'provided':
      config = {
        bg: 'bg-emerald-950/70 border-emerald-800 text-emerald-300',
        icon: ShieldCheck,
        defaultLabel: 'Verified / Provided',
      };
      break;

    case 'pending':
      config = {
        bg: 'bg-amber-950/70 border-amber-800 text-amber-300',
        icon: Clock,
        defaultLabel: 'Pending verification',
      };
      break;

    case 'missing':
    case 'not provided':
    case 'not verified':
      config = {
        bg: 'bg-rose-950/70 border-rose-800 text-rose-300',
        icon: AlertCircle,
        defaultLabel: 'Not provided / Not verified',
      };
      break;

    case 'notsure':
    case 'not sure':
    case 'assessment required':
      config = {
        bg: 'bg-amber-950/80 border-amber-700 text-amber-200',
        icon: HelpCircle,
        defaultLabel: 'Assessment required',
      };
      break;

    case 'illustrative':
    case 'sample':
    default:
      config = {
        bg: 'bg-zinc-800/80 border-zinc-700 text-zinc-300',
        icon: Info,
        defaultLabel: 'Illustrative prototype data',
      };
      break;
  }

  const IconComponent = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${config.bg} ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <IconComponent
        size={iconSizes[size]}
        aria-hidden="true"
        className="shrink-0 stroke-[2.2]"
      />
      <span>{displayLabel}</span>
    </span>
  );
}

export default StatusBadge;
