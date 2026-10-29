import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Job Application Tracker | Manage Your Job Search',
  description:
    'Track job applications, interview stages, offers, and follow-up reminders in one intuitive dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>
            Job Application Tracker &bull; Next.js App Router &bull; TypeScript strict mode &bull; Tailwind CSS
          </p>
        </footer>
      </body>
    </html>
  );
}
