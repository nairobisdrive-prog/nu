import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "XA'AN | Mexico Real Estate",
  description: "Mexico's premier rental platform. Short-term stays and long-term homes.",
};

// Pages that embed their own header (hero overlaps, dark sections)
const PAGES_WITH_OWN_HEADER = ['/', '/dashboard'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

// Client wrapper handles the conditional header logic per-page
import ConditionalLayout from '@/components/ConditionalLayout';
