import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

export type StatCardColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'slate';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: StatCardColor;
  description?: string;
  href?: string;
}

const COLOR_MAP: Record<
  StatCardColor,
  {
    bg: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  blue: {
    bg: 'bg-white hover:border-sky-300',
    iconBg: 'bg-sky-50 text-sky-600',
    iconColor: 'text-sky-600',
    borderColor: 'border-slate-200',
    textColor: 'text-sky-700',
  },
  purple: {
    bg: 'bg-white hover:border-purple-300',
    iconBg: 'bg-purple-50 text-purple-600',
    iconColor: 'text-purple-600',
    borderColor: 'border-slate-200',
    textColor: 'text-purple-700',
  },
  emerald: {
    bg: 'bg-white hover:border-emerald-300',
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconColor: 'text-emerald-600',
    borderColor: 'border-slate-200',
    textColor: 'text-emerald-700',
  },
  rose: {
    bg: 'bg-white hover:border-rose-300',
    iconBg: 'bg-rose-50 text-rose-600',
    iconColor: 'text-rose-600',
    borderColor: 'border-slate-200',
    textColor: 'text-rose-700',
  },
  amber: {
    bg: 'bg-amber-50/50 hover:border-amber-400',
    iconBg: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
  },
  slate: {
    bg: 'bg-white hover:border-slate-300',
    iconBg: 'bg-slate-100 text-slate-700',
    iconColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-800',
  },
};

/**
 * StatCard Component
 * Displays metric summaries on the dashboard with accent color, icon, and optional navigation link
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'slate',
  description,
  href,
}) => {
  const styles = COLOR_MAP[color] || COLOR_MAP.slate;

  const content = (
    <div
      className={`p-6 rounded-xl border ${styles.borderColor} ${styles.bg} shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-lg ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>

      {href && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>View applications</span>
          <span aria-hidden="true">&rarr;</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block group">{content}</Link>;
  }

  return content;
};

export default StatCard;
