import React from 'react';
import Link from 'next/link';
import { Application } from '@/types/application';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface FollowUpAlertProps {
  overdueApplications: Application[];
  className?: string;
}

/**
 * FollowUpAlert Component
 * Amber notification banner listing applications in 'Applied' status older than 7 days
 */
export const FollowUpAlert: React.FC<FollowUpAlertProps> = ({
  overdueApplications,
  className = '',
}) => {
  if (overdueApplications.length === 0) return null;

  return (
    <div
      className={`rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/80 to-amber-100/40 p-4 sm:p-5 text-amber-900 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              Follow-up Reminder
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-200 text-amber-800">
                {overdueApplications.length} {overdueApplications.length === 1 ? 'Job' : 'Jobs'} Due
              </span>
            </h4>
            <p className="text-xs text-amber-800/90 mt-0.5">
              These applications were submitted over 7 days ago with no status change. Consider sending a friendly follow-up email.
            </p>
          </div>
        </div>

        <Link
          href="/applications?status=Applied"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-end sm:self-auto"
        >
          <span>Review Due Applications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List of overdue applications */}
      <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {overdueApplications.slice(0, 3).map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between p-2 rounded-lg bg-white/70 border border-amber-200 text-xs shadow-xs"
          >
            <div className="truncate mr-2">
              <span className="font-semibold text-slate-900">{app.company}</span>
              <span className="text-slate-500 block truncate">{app.role}</span>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-amber-700">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{formatDate(app.dateApplied)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpAlert;
