import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes conditionally and cleanly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format YYYY-MM-DD into a human-readable date (e.g., 'Oct 18, 2026')
 * Pure helper safe for both React Server Components and Client Components
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Checks if an application in 'Applied' status was submitted 7 or more days ago
 * Pure helper safe for both React Server Components and Client Components
 */
export function checkIsOverdue(dateAppliedStr: string, status: string): boolean {
  if (status !== 'Applied') return false;
  const appliedDate = new Date(`${dateAppliedStr}T00:00:00`);
  if (isNaN(appliedDate.getTime())) return false;
  const now = new Date();
  const diffTime = now.getTime() - appliedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 7;
}
