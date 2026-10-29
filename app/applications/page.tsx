'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Application, ApplicationFormData, StatusFilterOption, APPLICATION_STATUSES } from '@/types/application';
import ApplicationTable from '@/components/ApplicationTable';
import { checkIsOverdue } from '@/lib/utils';
import ApplicationForm from '@/components/ApplicationForm';
import EmptyState from '@/components/EmptyState';
import {
  Search,
  Plus,
  Filter,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  X,
  Loader2,
} from 'lucide-react';

/**
 * Inner interactive applications page reading URL query parameters
 */
function ApplicationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Applications list and UI states
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterOption>('All');
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  // Toast / notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Read URL query parameters on initial mount
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && (APPLICATION_STATUSES as readonly string[]).includes(statusParam)) {
      setSelectedStatus(statusParam as StatusFilterOption);
    }

    const filterParam = searchParams.get('filter');
    if (filterParam === 'overdue') {
      setShowOverdueOnly(true);
    }

    const addParam = searchParams.get('add');
    if (addParam === 'true') {
      setIsFormOpen(true);
      // Clean query parameter from URL
      router.replace('/applications');
    }
  }, [searchParams, router]);

  // Load all applications from API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApplications(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch applications');
      }
    } catch (err: unknown) {
      console.error(err);
      showToast('error', 'Could not load applications from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (app: Application) => {
    setEditingApplication(app);
    setIsFormOpen(true);
  };

  // Handle Form Submission (Add or Update)
  const handleSubmitForm = async (formData: ApplicationFormData) => {
    if (editingApplication) {
      // PUT update
      const res = await fetch(`/api/applications/${editingApplication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to update application');
      }
      showToast('success', `Updated application for ${formData.company}`);
    } else {
      // POST create
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to create application');
      }
      showToast('success', `Added new application for ${formData.company}`);
    }

    await fetchApplications();
  };

  // Handle Delete
  const handleDeleteApplication = async (id: string) => {
    const appToDelete = applications.find((a) => a.id === id);
    const res = await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();

    if (!res.ok || !result.success) {
      showToast('error', result.error || 'Failed to delete application');
      return;
    }

    setApplications((prev) => prev.filter((app) => app.id !== id));
    showToast('success', `Deleted application for ${appToDelete?.company || 'job'}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setShowOverdueOnly(false);
  };

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 1. Status Filter
      if (selectedStatus !== 'All' && app.status !== selectedStatus) {
        return false;
      }

      // 2. Overdue Filter (> 7 days in Applied status)
      if (showOverdueOnly && !checkIsOverdue(app.dateApplied, app.status)) {
        return false;
      }

      // 3. Search Query Filter (match company or role)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        const matchesCompany = app.company.toLowerCase().includes(query);
        const matchesRole = app.role.toLowerCase().includes(query);
        if (!matchesCompany && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [applications, selectedStatus, showOverdueOnly, searchQuery]);

  // Status counts for tab badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: applications.length,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      overdue: 0,
    };
    for (const app of applications) {
      if (counts[app.status] !== undefined) {
        counts[app.status] += 1;
      }
      if (checkIsOverdue(app.dateApplied, app.status)) {
        counts.overdue += 1;
      }
    }
    return counts;
  }, [applications]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedStatus !== 'All' || showOverdueOnly;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border border-slate-700'
              : 'bg-rose-600 text-white'
          }`}
          role="status"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-200" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, edit, and keep track of your active job pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Overdue Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showOverdueOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Clock className={`w-4 h-4 ${showOverdueOnly ? 'text-amber-700' : 'text-slate-400'}`} />
            <span>Follow-up Due</span>
            {statusCounts.overdue > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  showOverdueOnly ? 'bg-amber-200 text-amber-900' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {statusCounts.overdue}
              </span>
            )}
          </button>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-medium mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>

          {(['All', ...APPLICATION_STATUSES] as StatusFilterOption[]).map((st) => {
            const isSelected = selectedStatus === st;
            const count = statusCounts[st] || 0;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Empty State */}
      {filteredApplications.length > 0 ? (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span>
              Showing {filteredApplications.length} of {applications.length}{' '}
              {applications.length === 1 ? 'application' : 'applications'}
            </span>
          </div>

          <ApplicationTable
            applications={filteredApplications}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteApplication}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <EmptyState
          title={hasActiveFilters ? 'No matching applications found' : 'No applications tracked yet'}
          description={
            hasActiveFilters
              ? 'Try modifying your search keywords or clearing active filters to see all applications.'
              : 'Add your first job application using the button below to start tracking your interviews and offers.'
          }
          icon={hasActiveFilters ? Search : Briefcase}
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add First Application'}
          onAction={hasActiveFilters ? handleResetFilters : handleOpenAddModal}
        />
      )}

      {/* Modal Dialog for Add / Edit */}
      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApplication(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editingApplication}
      />
    </div>
  );
}

/**
 * Fallback skeleton while Suspense hydrates query parameters
 */
function ApplicationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
      <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
    </div>
  );
}

/**
 * Applications Page (Client Component with Suspense)
 */
export default function ApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoadingSkeleton />}>
      <ApplicationsContent />
    </Suspense>
  );
}
