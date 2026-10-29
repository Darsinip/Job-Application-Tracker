import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Application, ApplicationFormData, DashboardStats } from '@/types/application';

// Path to JSON file storage in project root
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');

// Default initial dataset if file does not exist
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    dateApplied: '2026-10-18',
    status: 'Applied',
    link: 'https://stripe.com/jobs/senior-frontend',
    notes: 'Applied via referral from Sarah. Focused on billing UI team.',
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'app-102',
    company: 'Vercel',
    role: 'Full Stack Developer',
    dateApplied: '2026-10-22',
    status: 'Interview',
    link: 'https://vercel.com/careers',
    notes: 'Passed initial recruiter screening. Technical round scheduled for next Tuesday.',
    createdAt: '2026-10-22T14:30:00.000Z',
    updatedAt: '2026-10-24T09:15:00.000Z',
  },
  {
    id: 'app-103',
    company: 'GitHub',
    role: 'Software Engineer II',
    dateApplied: '2026-10-10',
    status: 'Offer',
    link: 'https://github.com/about/careers',
    notes: 'Received written offer! Reviewing compensation package and equity terms.',
    createdAt: '2026-10-10T11:00:00.000Z',
    updatedAt: '2026-10-26T16:45:00.000Z',
  },
  {
    id: 'app-104',
    company: 'Linear',
    role: 'Product Engineer',
    dateApplied: '2026-10-27',
    status: 'Applied',
    link: 'https://linear.app/careers',
    notes: 'Submitted portfolio featuring keyboard-first web applications.',
    createdAt: '2026-10-27T08:20:00.000Z',
    updatedAt: '2026-10-27T08:20:00.000Z',
  },
  {
    id: 'app-105',
    company: 'Datadog',
    role: 'Systems Engineer',
    dateApplied: '2026-10-15',
    status: 'Rejected',
    link: 'https://careers.datadoghq.com',
    notes: 'Automated rejection email after resume review. Role required 8+ years Go experience.',
    createdAt: '2026-10-15T15:10:00.000Z',
    updatedAt: '2026-10-20T11:00:00.000Z',
  },
  {
    id: 'app-106',
    company: 'Figma',
    role: 'Design Systems Engineer',
    dateApplied: '2026-10-12',
    status: 'Applied',
    link: 'https://figma.com/careers',
    notes: 'Sent message to engineering manager on LinkedIn. Follow-up needed.',
    createdAt: '2026-10-12T13:00:00.000Z',
    updatedAt: '2026-10-12T13:00:00.000Z',
  },
];

/**
 * Ensures data directory and JSON file exist. Returns parsed list of applications.
 */
async function ensureDataFile(): Promise<Application[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content) as Application[];
  } catch (error: unknown) {
    // If file doesn't exist, create it with seed data
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_APPLICATIONS, null, 2), 'utf-8');
      return INITIAL_APPLICATIONS;
    }
    throw error;
  }
}

/**
 * Persists applications list to JSON file atomically
 */
async function writeDataFile(applications: Application[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempPath = `${DATA_FILE}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(applications, null, 2), 'utf-8');
  await fs.rename(tempPath, DATA_FILE);
}

/**
 * Check if an application is in 'Applied' status and older than 7 days
 */
export function isFollowUpDue(app: Application, now: Date = new Date()): boolean {
  if (app.status !== 'Applied') return false;
  const appliedDate = new Date(`${app.dateApplied}T00:00:00`);
  if (isNaN(appliedDate.getTime())) return false;
  
  const diffTime = now.getTime() - appliedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 7;
}

/**
 * Retrieve all applications (sorted by most recently applied/created first)
 */
export async function getAllApplications(): Promise<Application[]> {
  const applications = await ensureDataFile();
  return applications.sort((a, b) => {
    // Sort by dateApplied descending, fallback to createdAt
    const dateComparison = new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
    if (dateComparison !== 0) return dateComparison;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}

/**
 * Find single application by unique ID
 */
export async function getApplicationById(id: string): Promise<Application | null> {
  const applications = await ensureDataFile();
  return applications.find((app) => app.id === id) || null;
}

/**
 * Create a new application with generated UUID and timestamps
 */
export async function createApplication(data: ApplicationFormData): Promise<Application> {
  const applications = await ensureDataFile();
  const timestamp = new Date().toISOString();

  const newApp: Application = {
    id: `app-${crypto.randomUUID().slice(0, 8)}`,
    company: data.company.trim(),
    role: data.role.trim(),
    dateApplied: data.dateApplied,
    status: data.status,
    link: data.link ? data.link.trim() : undefined,
    notes: data.notes ? data.notes.trim() : undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  applications.push(newApp);
  await writeDataFile(applications);
  return newApp;
}

/**
 * Update an existing application by ID
 */
export async function updateApplication(
  id: string,
  data: Partial<ApplicationFormData>
): Promise<Application | null> {
  const applications = await ensureDataFile();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return null;
  }

  const existing = applications[index];
  const updated: Application = {
    ...existing,
    ...(data.company !== undefined && { company: data.company.trim() }),
    ...(data.role !== undefined && { role: data.role.trim() }),
    ...(data.dateApplied !== undefined && { dateApplied: data.dateApplied }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.link !== undefined && { link: data.link ? data.link.trim() : undefined }),
    ...(data.notes !== undefined && { notes: data.notes ? data.notes.trim() : undefined }),
    updatedAt: new Date().toISOString(),
  };

  applications[index] = updated;
  await writeDataFile(applications);
  return updated;
}

/**
 * Delete an application by ID
 */
export async function deleteApplication(id: string): Promise<boolean> {
  const applications = await ensureDataFile();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return false;
  }

  applications.splice(index, 1);
  await writeDataFile(applications);
  return true;
}

/**
 * Calculate dashboard summary statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const applications = await ensureDataFile();
  const now = new Date();

  const stats: DashboardStats = {
    total: applications.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    needsFollowUp: 0,
  };

  for (const app of applications) {
    if (app.status === 'Applied') {
      stats.applied += 1;
      if (isFollowUpDue(app, now)) {
        stats.needsFollowUp += 1;
      }
    } else if (app.status === 'Interview') {
      stats.interview += 1;
    } else if (app.status === 'Offer') {
      stats.offer += 1;
    } else if (app.status === 'Rejected') {
      stats.rejected += 1;
    }
  }

  return stats;
}
