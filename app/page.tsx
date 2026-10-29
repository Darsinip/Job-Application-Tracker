import Link from 'next/link';
import { getAllApplications, getDashboardStats, isFollowUpDue } from '@/lib/storage';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import FollowUpAlert from '@/components/FollowUpAlert';
import { formatDate } from '@/lib/utils';
import {
  Briefcase,
  Send,
  Users,
  Award,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

// Force dynamic server-side rendering on every request
export const dynamic = 'force-dynamic';

/**
 * Dashboard Page (Server Component)
 * Server-side rendered analytics and application overview
 */
export default async function DashboardPage() {
  // Directly retrieve applications and statistics on the server
  const [stats, allApplications] = await Promise.all([
    getDashboardStats(),
    getAllApplications(),
  ]);

  const overdueApplications = allApplications.filter((app) => isFollowUpDue(app));
  const recentApplications = allApplications.slice(0, 5);

  // Compute interview rate metric
  const responseRate =
    stats.total > 0
      ? Math.round(((stats.interview + stats.offer) / stats.total) * 100)
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Job Search Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Application Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status tracking, follow-up alerts, and application pipeline insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/applications?add=true"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </Link>
        </div>
      </div>

      {/* Overdue Follow-up Alert (if any applications > 7 days in Applied) */}
      {overdueApplications.length > 0 && (
        <FollowUpAlert overdueApplications={overdueApplications} />
      )}

      {/* Key Metric Summary Cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Application Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Submitted"
            value={stats.total}
            icon={Briefcase}
            color="slate"
            description="All tracked jobs"
            href="/applications"
          />
          <StatCard
            title="Applied"
            value={stats.applied}
            icon={Send}
            color="blue"
            description="Awaiting response"
            href="/applications?status=Applied"
          />
          <StatCard
            title="In Interview"
            value={stats.interview}
            icon={Users}
            color="purple"
            description="Active rounds"
            href="/applications?status=Interview"
          />
          <StatCard
            title="Offers"
            value={stats.offer}
            icon={Award}
            color="emerald"
            description="Received offers"
            href="/applications?status=Offer"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="rose"
            description="Archived"
            href="/applications?status=Rejected"
          />
          <StatCard
            title="Follow-up Due"
            value={stats.needsFollowUp}
            icon={Clock}
            color="amber"
            description="Applied &gt; 7 days"
            href="/applications?filter=overdue"
          />
        </div>
      </section>

      {/* Response Rate & Pipeline Insights Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg border border-sky-100">
            {responseRate}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Positive Response Rate</h3>
            <p className="text-xs text-slate-500">
              Applications converted into Interviews or Offers ({stats.interview + stats.offer} of {stats.total})
            </p>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="flex-1 max-w-xs w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(responseRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Applications Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest job applications added to your tracker
            </p>
          </div>

          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
          >
            <span>View All ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            No applications tracked yet. Click &quot;New Application&quot; to add your first!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentApplications.map((app) => {
              const isOverdue = isFollowUpDue(app);

              return (
                <div
                  key={app.id}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors ${
                    isOverdue ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200 shrink-0">
                      {app.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm truncate">
                          {app.company}
                        </span>
                        {app.link && (
                          <a
                            href={app.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-sky-600"
                            title="Job URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{app.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {formatDate(app.dateApplied)}
                    </span>
                    <StatusBadge status={app.status} isOverdue={isOverdue} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
