import Link from 'next/link';

const footerLinks = [
  { href: '/resultados', label: 'Resultados ao vivo' },
  { href: '/midia', label: 'Galeria de midia' },
  { href: '/inscricao', label: 'Inscricao de atleta' },
  { href: '/patrocinio', label: 'Quero patrocinar' },
  { href: '/atleta', label: 'Area do atleta' },
  { href: '/patrocinador', label: 'Portal do patrocinador' },
  { href: '/privacidade', label: 'Politica de privacidade' },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-[var(--brand-footer)] text-[var(--brand-canvas-soft)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--brand-muted)]">
              Portal oficial
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--brand-canvas)]">
              INTRADEBAS 2026 + ALDEBARUN
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--brand-canvas-soft)]/80">
            Inscricoes, resultados, patrocinio, backdrop digital e operacao administrativa
            em um unico portal para os Jogos Internos do Aldebaran Ville.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--brand-canvas)]">
            Navegacao
          </h3>
          <div className="grid gap-3 text-sm font-semibold text-[var(--brand-canvas-soft)]/85">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[var(--brand-canvas)]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--brand-canvas)]">
            Suporte
          </h3>
          <p className="text-sm leading-7 text-[var(--brand-canvas-soft)]/80">
            Dúvidas sobre cadastro, cupons, resultados ou patrocinio podem ser tratadas
            diretamente com a comissao organizadora.
          </p>
          <a
            href="https://wa.me/5586988265569?text=Ola%2C%20preciso%20de%20suporte%20no%20portal%20INTRADEBAS%202026."
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-[12px] bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-[var(--brand-canvas)] transition hover:opacity-90"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
