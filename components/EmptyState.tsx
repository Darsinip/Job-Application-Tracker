import React from 'react';
import { LucideIcon, Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState Component
 * Clean fallback view when application list or search filter returns no results
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No applications found',
  description = 'Get started by creating your first job application entry to track your job search.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
