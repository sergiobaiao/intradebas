import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}

