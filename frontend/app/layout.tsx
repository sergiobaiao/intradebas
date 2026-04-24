import type { Metadata } from 'next';
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
    <html lang="pt-BR">
      <body>
        <BodyShell>{children}</BodyShell>
      </body>
    </html>
  );
}
