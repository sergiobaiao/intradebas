import Link from 'next/link';

const footerLinks = [
  { href: '/resultados', label: 'Resultados ao vivo' },
  { href: '/inscricao', label: 'Inscricao de atleta' },
  { href: '/patrocinio', label: 'Quero patrocinar' },
  { href: '/atleta', label: 'Area do atleta' },
  { href: '/patrocinador', label: 'Portal do patrocinador' },
  { href: '/privacidade', label: 'Politica de privacidade' },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-700">
              Portal oficial
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              INTRADEBAS 2026 + ALDEBARUN
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Inscricoes, resultados, patrocinio, backdrop digital e operacao administrativa
            em um unico portal para os Jogos Internos do Aldebaran Ville.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950">
            Navegacao
          </h3>
          <div className="grid gap-3 text-sm font-semibold text-slate-700">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950">
            Suporte
          </h3>
          <p className="text-sm leading-7 text-slate-600">
            Dúvidas sobre cadastro, cupons, resultados ou patrocinio podem ser tratadas
            diretamente com a comissao organizadora.
          </p>
          <a
            href="https://wa.me/5586988265569?text=Ola%2C%20preciso%20de%20suporte%20no%20portal%20INTRADEBAS%202026."
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
