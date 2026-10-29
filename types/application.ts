/**
 * Application Status Types
 */
export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
] as const;

/**
 * Core Application Interface reused throughout the app
 */
export interface Application {
  id: string;
  company: string;
  role: string;
  dateApplied: string; // ISO date format YYYY-MM-DD
  status: ApplicationStatus;
  link?: string;
  notes?: string;
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

/**
 * Form payload type when creating or editing an application
 */
export type ApplicationFormData = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Summary statistics for the Dashboard
 */
export interface DashboardStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  needsFollowUp: number;
}

/**
 * Filter options for the applications list
 */
export type StatusFilterOption = ApplicationStatus | 'All';

/**
 * Standard API Response formats
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string>;
}
