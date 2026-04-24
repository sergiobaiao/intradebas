'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { PublicFooter } from './public-footer';

export function BodyShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hidePublicFooter =
    pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/api');

  return (
    <>
      {children}
      {hidePublicFooter ? null : <PublicFooter />}
    </>
  );
}
