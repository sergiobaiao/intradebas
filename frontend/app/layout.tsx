import type { Metadata } from 'next';
import Script from 'next/script';
import { buildThemeBootScript, defaultThemeId } from '@/designs';
import { ThemeProvider } from '@/components/theme-provider';
import { BodyShell } from './body-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'INTRADEBAS 2026',
  description: 'Portal oficial dos Jogos Internos Aldebaran Ville',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme={defaultThemeId} suppressHydrationWarning>
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {buildThemeBootScript()}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <BodyShell>{children}</BodyShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
