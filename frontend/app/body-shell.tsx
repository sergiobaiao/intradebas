'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

function shouldHidePublicShell(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/api');
}

export function BodyShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hidePublicShell = shouldHidePublicShell(pathname);

  return (
    <>
      {hidePublicShell ? null : <SiteHeader />}
      {children}
      {hidePublicShell ? null : <SiteFooter />}
    </>
  );
}
