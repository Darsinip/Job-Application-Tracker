'use client';

import React, { useState, useEffect } from 'react';
import { Application, ApplicationFormData, ApplicationStatus, APPLICATION_STATUSES } from '@/types/application';
import { validateApplication } from '@/lib/validation';
import { X, Loader2, Building2, Briefcase, Calendar, Link as LinkIcon, FileText } from 'lucide-react';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<boolean | void>;
  initialData?: Application | null;
}

const DEFAULT_FORM_DATA: ApplicationFormData = {
  company: '',
  role: '',
  dateApplied: new Date().toISOString().split('T')[0],
  status: 'Applied',
  link: '',
  notes: '',
};

/**
 * ApplicationForm Component
 * Accessible modal dialog with real-time field validation for adding or editing an application
 */
export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  // Synchronize form values when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          company: initialData.company,
          role: initialData.role,
          dateApplied: initialData.dateApplied,
          status: initialData.status,
          link: initialData.link || '',
          notes: initialData.notes || '',
        });
      } else {
        setFormData({
          ...DEFAULT_FORM_DATA,
          dateApplied: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, initialData]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate using shared validation library
    const validation = validateApplication(formData);
    if (!validation.isValid || !validation.data) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(validation.data);
      onClose();
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'An error occurred while saving the application.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
              {isEditing ? 'Edit Application' : 'Add New Application'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Update company, status, or notes for this job application.'
                : 'Track a new job opportunity you applied to.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {serverError}
            </div>
          )}

          {/* Company Name */}
          <div>
            <label htmlFor="company" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder="e.g. Stripe, Acme Corp"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.company ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-rose-600">{errors.company}</p>
            )}
          </div>

          {/* Role / Job Title */}
          <div>
            <label htmlFor="role" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Role / Position <span className="text-rose-500">*</span>
            </label>
            <input
              id="role"
              name="role"
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.role ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            {errors.role && (
              <p className="mt-1 text-xs text-rose-600">{errors.role}</p>
            )}
          </div>

          {/* Date Applied & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateApplied" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date Applied <span className="text-rose-500">*</span>
              </label>
              <input
                id="dateApplied"
                name="dateApplied"
                type="date"
                required
                value={formData.dateApplied}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.dateApplied ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              {errors.dateApplied && (
                <p className="mt-1 text-xs text-rose-600">{errors.dateApplied}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.status ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
                } bg-white focus:outline-none focus:ring-2 focus:border-transparent`}
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-rose-600">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Job Posting Link */}
          <div>
            <label htmlFor="link" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              Job Posting URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="https://company.com/jobs/123"
              value={formData.link || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.link ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            {errors.link && (
              <p className="mt-1 text-xs text-rose-600">{errors.link}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes / Follow-up info <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="e.g. Referred by friend, round 1 technical interview, follow-up on Friday..."
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-rose-600">{errors.notes}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
