import React from 'react';
import { ApplicationStatus } from '@/types/application';
import { Clock, CheckCircle2, XCircle, Send, Users } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  isOverdue?: boolean;
  className?: string;
}

// Visual configuration for each application status
const STATUS_STYLES: Record<
  ApplicationStatus,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Applied: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
    dot: 'bg-sky-500',
    icon: Send,
  },
  Interview: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
    icon: Users,
  },
  Offer: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  Rejected: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

/**
 * StatusBadge Component
 * Renders color-coded status badge with status icon and optional follow-up warning tag
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isOverdue = false,
  className = '',
}) => {
  const config = STATUS_STYLES[status] || STATUS_STYLES.Applied;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>

      {/* Follow-up reminder indicator tag when Applied > 7 days */}
      {isOverdue && status === 'Applied' && (
        <span
          title="Applied more than 7 days ago. Consider sending a follow-up email."
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
        >
          <Clock className="w-3 h-3 text-amber-600" />
          Follow-up due
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
