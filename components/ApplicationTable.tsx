'use client';

import React, { useState } from 'react';
import { Application } from '@/types/application';
import StatusBadge from './StatusBadge';
import {
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Building,
  Briefcase,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

import { formatDate, checkIsOverdue } from '@/lib/utils';
export { formatDate, checkIsOverdue };

/**
 * ApplicationTable Component
 * Responsive table and mobile card view with follow-up warnings, inline links, and action buttons
 */
export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return null; // Empty state is handled by parent or EmptyState component
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ================= DESKTOP TABLE VIEW (md and up) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4">Company</th>
              <th scope="col" className="py-3.5 px-4">Role</th>
              <th scope="col" className="py-3.5 px-4">Date Applied</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Link</th>
              <th scope="col" className="py-3.5 px-4">Notes</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {applications.map((app) => {
              const isOverdue = checkIsOverdue(app.dateApplied, app.status);

              return (
                <tr
                  key={app.id}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isOverdue
                      ? 'bg-amber-50/30 border-l-4 border-l-amber-500'
                      : ''
                  }`}
                >
                  {/* Company */}
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200 shrink-0">
                        {app.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span>{app.company}</span>
                        {isOverdue && (
                          <span className="block text-[11px] font-normal text-amber-700 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Applied &gt; 7 days ago
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {app.role}
                  </td>

                  {/* Date Applied */}
                  <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(app.dateApplied)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={app.status} isOverdue={isOverdue} />
                  </td>

                  {/* Link */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {app.link ? (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 hover:underline"
                        title={app.link}
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="py-4 px-4 text-slate-600 text-xs max-w-xs truncate" title={app.notes || ''}>
                    {app.notes ? app.notes : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => onEdit(app)}
                        aria-label={`Edit ${app.company} application`}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {confirmDeleteId === app.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 animate-in fade-in">
                          <span className="text-[11px] font-medium text-rose-700">Delete?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(app.id)}
                            disabled={deletingId === app.id}
                            className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded transition-colors"
                          >
                            {deletingId === app.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'Yes'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] font-medium text-slate-600 hover:text-slate-800 px-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(app.id)}
                          aria-label={`Delete ${app.company} application`}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS VIEW (< md) ================= */}
      <div className="block md:hidden divide-y divide-slate-100">
        {applications.map((app) => {
          const isOverdue = checkIsOverdue(app.dateApplied, app.status);

          return (
            <div
              key={app.id}
              className={`p-4 space-y-3 ${
                isOverdue ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''
              }`}
            >
              {/* Header: Company & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">{app.company}</h3>
                  <p className="text-sm font-medium text-slate-700">{app.role}</p>
                </div>
                <StatusBadge status={app.status} isOverdue={isOverdue} />
              </div>

              {/* Date & Link */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Applied {formatDate(app.dateApplied)}
                </span>
                {app.link && (
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-sky-600 hover:text-sky-800"
                  >
                    <span>Posting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Notes */}
              {app.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {app.notes}
                </p>
              )}

              {/* Mobile Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onEdit(app)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>

                {confirmDeleteId === app.id ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                    <span className="text-xs text-rose-700 font-medium">Confirm?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id)}
                      disabled={deletingId === app.id}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
                    >
                      {deletingId === app.id ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-1 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(app.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTable;
