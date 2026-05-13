'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ThemeSelect } from '@/components/theme-select';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/inscricao', label: 'Inscricoes' },
  { href: '/resultados', label: 'Resultados' },
  { href: '/midia', label: 'Midia' },
  { href: '/aldebarun', label: 'ALDEBARUN' },
  { href: '/patrocinio', label: 'Patrocinio' },
  { href: '/atleta', label: 'Area do atleta' },
];

function PublicNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {navigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              mobile && 'block px-0 py-3 text-base',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-[var(--brand-header)] backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-sm font-black text-background">
            IN
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-sm font-extrabold uppercase tracking-[0.14em] text-foreground">
              INTRADEBAS
            </strong>
            <span className="block truncate text-sm text-muted-foreground">
              Jogos Internos Aldebaran Ville
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <PublicNavLinks />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeSelect compact className="min-w-[12rem]" />
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/privacidade">LGPD</Link>
          </Button>
          <Button asChild className="rounded-lg">
            <Link href="/inscricao">Quero me inscrever</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[20rem]">
              <SheetHeader>
                <SheetTitle>INTRADEBAS 2026</SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                <ThemeSelect />
                <PublicNavLinks mobile />
                <div className="mt-4 grid gap-3">
                  <Button asChild className="rounded-lg">
                    <Link href="/inscricao">Quero me inscrever</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg">
                    <Link href="/privacidade">Politica de privacidade</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
