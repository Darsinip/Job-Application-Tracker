'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, ListFilter, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal?: () => void;
}

/**
 * Navbar Component
 * Responsive top navigation bar with active route highlighting and quick add action
 */
export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const pathname = usePathname();

  const isDashboard = pathname === '/';
  const isApplications = pathname === '/applications';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight leading-none text-base">
                  JobTrack<span className="text-sky-600">.</span>
                </span>
                <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold mt-0.5">
                  Application Hub
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDashboard
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                href="/applications"
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isApplications
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                Applications
              </Link>
            </nav>
          </div>

          {/* Quick Add Action & Mobile Links */}
          <div className="flex items-center gap-3">
            <div className="flex sm:hidden items-center gap-1">
              <Link
                href="/"
                className={`p-2 rounded-lg text-sm font-medium ${
                  isDashboard ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link
                href="/applications"
                className={`p-2 rounded-lg text-sm font-medium ${
                  isApplications ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
                }`}
                title="Applications"
              >
                <ListFilter className="w-5 h-5" />
              </Link>
            </div>

            {onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-all shadow-sky-600/10 hover:shadow-sky-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>New Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
