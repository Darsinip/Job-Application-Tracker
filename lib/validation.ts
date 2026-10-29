import { ApplicationFormData, ApplicationStatus, APPLICATION_STATUSES } from '@/types/application';

/**
 * Validates whether a given string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates whether a date string conforms to YYYY-MM-DD and is a valid calendar date
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString.trim())) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates whether a status string matches ApplicationStatus enum
 */
export function isValidStatus(status: unknown): status is ApplicationStatus {
  return typeof status === 'string' && (APPLICATION_STATUSES as readonly string[]).includes(status);
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: ApplicationFormData;
}

/**
 * Validates an incoming application payload (for both client and server)
 */
export function validateApplication(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: { form: 'Invalid payload: expected an object' },
    };
  }

  const raw = input as Record<string, unknown>;

  // Validate company
  const company = typeof raw.company === 'string' ? raw.company.trim() : '';
  if (!company) {
    errors.company = 'Company name is required';
  } else if (company.length > 100) {
    errors.company = 'Company name cannot exceed 100 characters';
  }

  // Validate role
  const role = typeof raw.role === 'string' ? raw.role.trim() : '';
  if (!role) {
    errors.role = 'Role / position is required';
  } else if (role.length > 100) {
    errors.role = 'Role cannot exceed 100 characters';
  }

  // Validate dateApplied
  const dateApplied = typeof raw.dateApplied === 'string' ? raw.dateApplied.trim() : '';
  if (!dateApplied) {
    errors.dateApplied = 'Date applied is required';
  } else if (!isValidDate(dateApplied)) {
    errors.dateApplied = 'Please enter a valid date in YYYY-MM-DD format';
  }

  // Validate status
  const status = raw.status;
  if (!status) {
    errors.status = 'Status is required';
  } else if (!isValidStatus(status)) {
    errors.status = `Status must be one of: ${APPLICATION_STATUSES.join(', ')}`;
  }

  // Validate link (optional, but if provided must be a valid URL)
  let cleanLink: string | undefined = undefined;
  if (raw.link !== undefined && raw.link !== null && String(raw.link).trim() !== '') {
    const linkStr = String(raw.link).trim();
    if (!isValidUrl(linkStr)) {
      errors.link = 'Please enter a valid URL (starting with http:// or https://)';
    } else {
      cleanLink = linkStr;
    }
  }

  // Validate notes (optional)
  let cleanNotes: string | undefined = undefined;
  if (raw.notes !== undefined && raw.notes !== null) {
    const notesStr = String(raw.notes).trim();
    if (notesStr.length > 2000) {
      errors.notes = 'Notes cannot exceed 2000 characters';
    } else {
      cleanNotes = notesStr;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    return { isValid, errors };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      company,
      role,
      dateApplied,
      status: status as ApplicationStatus,
      link: cleanLink,
      notes: cleanNotes,
    },
  };
}
