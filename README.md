# 💼 Job Application Tracker

A modern, full-stack Job Application Tracker built with **Next.js 15 (App Router)**, **TypeScript in strict mode**, and **Tailwind CSS**.

---

## 🎯 Problem It Solves

Job seekers often apply to dozens of companies across different platforms and lose track of:
- Where they applied and for which role
- The active status of each application (Applied, Interview, Offer, Rejected)
- Job posting links and specific recruiter notes
- **When to follow up** on pending applications that have gone unanswered

This app provides a centralized, server-rendered dashboard with automatic follow-up reminders and a table view for managing your job hunt.

---

## ✨ Features

1. **Server-Side Rendered (SSR) Dashboard (`/`)**:
   - Total applications counter.
   - Breakdown by status: **Applied**, **In Interview**, **Offers**, and **Rejected** using metric `StatCard` components.
   - Conversion / response rate progress indicator.
   - Recent activity list with status badges and quick links.

2. **Applications Management Table (`/applications`)**:
   - Data table displaying: Company, Role, Date Applied, Status, Job URL link, Notes, and Actions.
   - Responsive **Desktop Table** and **Mobile Cards View** for narrow screens.

3. **Add / Edit / Delete with Strict Validation**:
   - Accessible modal form with real-time validation for required fields (company, role, date applied, status) and valid HTTP/HTTPS URL checking.
   - Safe deletion with inline confirmation to prevent accidental loss.

4. **Live Search & Filter**:
   - Instant search by company name and role.
   - Status tabs with live counter badges (`All`, `Applied`, `Interview`, `Offer`, `Rejected`).
   - One-click reset filters button.

5. **Automatic Follow-Up Reminder**:
   - Applications with status **"Applied" older than 7 days** are automatically flagged.
   - Visual amber warning badge and row highlights in the table.
   - Follow-up reminder banner on the dashboard and dedicated quick-filter button (`Follow-up Due`).

6. **Next.js REST API Route Handlers**:
   - `GET /api/applications` - Retrieve all applications (with optional `?status=` and `?search=` filters).
   - `POST /api/applications` - Add a new application with validation.
   - `GET /api/applications/[id]` - Retrieve a single application by ID.
   - `PUT /api/applications/[id]` - Update an application by ID.
   - `DELETE /api/applications/[id]` - Remove an application by ID.
   - JSON file persistence (`data/applications.json`) with atomic writes and seed data.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router with React Server Components)
- **Language**: TypeScript (`"strict": true`, strict null checks, no implicit any)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Persistence**: JSON file storage with atomic writes (`lib/storage.ts`)

```
├── app/
│   ├── api/
│   │   └── applications/
│   │       ├── route.ts          # GET (all/filtered) & POST
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE by ID
│   ├── applications/
│   │   └── page.tsx              # Interactive applications page (Client Component + Suspense)
│   ├── globals.css               # Tailwind CSS directives and theme variables
│   ├── layout.tsx                # Global root layout with sticky Navbar and footer
│   └── page.tsx                  # Dashboard page (Server-Side Rendered)
├── components/
│   ├── ApplicationForm.tsx       # Modal form for Add/Edit with validation
│   ├── ApplicationTable.tsx      # Responsive desktop table and mobile cards
│   ├── EmptyState.tsx            # Clean empty / no-results fallback
│   ├── FollowUpAlert.tsx         # Alert banner highlighting applications > 7 days
│   ├── Navbar.tsx                # Sticky navigation header
│   ├── StatCard.tsx              # Analytics metric card
│   └── StatusBadge.tsx           # Color-coded badge with follow-up tag
├── data/
│   └── applications.json         # JSON database storage
├── lib/
│   ├── storage.ts                # File-backed CRUD operations & atomic file writes
│   └── validation.ts             # Input sanitization and field-level validation
└── types/
    └── application.ts            # Core TypeScript interfaces reused across the app
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure **Node.js 18+** (or v20 / v24) and **npm** are installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run TypeScript Check
```bash
npm run type-check
```

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Reference

| Endpoint | Method | Description | Status Codes |
|---|---|---|---|
| `/api/applications` | `GET` | Get all applications (`?status=...&search=...`) | `200`, `500` |
| `/api/applications` | `POST` | Create a new application | `201`, `400`, `500` |
| `/api/applications/[id]` | `GET` | Get application by ID | `200`, `404`, `500` |
| `/api/applications/[id]` | `PUT` | Update application by ID | `200`, `400`, `404`, `500` |
| `/api/applications/[id]` | `DELETE` | Delete application by ID | `200`, `404`, `500` |

### Sample Payload (`POST` / `PUT`)
```json
{
  "company": "Stripe",
  "role": "Senior Frontend Engineer",
  "dateApplied": "2026-10-18",
  "status": "Applied",
  "link": "https://stripe.com/jobs/senior-frontend",
  "notes": "Referred by team member."
}
```

---

## 📝 License
MIT License.
