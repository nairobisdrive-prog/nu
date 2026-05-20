'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const PAGES_WITH_OWN_HEADER = ['/', '/dashboard'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = PAGES_WITH_OWN_HEADER.includes(pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
