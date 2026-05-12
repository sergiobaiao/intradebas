import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PublicSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn('px-4 py-8 sm:px-6 lg:px-8', className)}>{children}</section>;
}

export function PublicSectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('mx-auto w-full max-w-7xl', className)}>{children}</div>;
}
