const teams = [
  {
    name: 'Mucura',
    className: 'mucura',
    text: 'Equipe de ataque e presença forte nas modalidades coletivas.',
  },
  {
    name: 'Jacare',
    className: 'jacare',
    text: 'Equipe tradicional com foco em consistencia e disciplina competitiva.',
  },
  {
    name: 'Capivara',
    className: 'capivara',
    text: 'Equipe orientada por participacao ampla e energia familiar.',
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="shell">
          <span className="eyebrow">Portal oficial do evento</span>
          <div className="hero-grid">
            <div>
              <h1>INTRADEBAS 2026 + ALDEBARUN</h1>
              <p>
                Base inicial do portal dos Jogos Internos do Aldebaran Ville. Esta
                pagina ja reflete o direcionamento do spec: mobile-first, foco em
                atletas, patrocinadores, resultados ao vivo e operacao centralizada.
              </p>
              <div className="cta-row">
                <a className="button primary" href="/api/health">
                  Health frontend
                </a>
                <a className="button secondary" href={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1/health'}>
                  Health backend
                </a>
              </div>
            </div>

            <aside className="card stats">
              <div>
                <small>Escopo carregado</small>
                <strong>5 modulos</strong>
                <span>Atletas, patrocinio, resultados, backdrop e LGPD.</span>
              </div>
              <div>
                <small>Stack definida</small>
                <strong>Next + Nest + Prisma</strong>
                <span>Com Docker, PostgreSQL, Redis, MinIO e Nginx.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="grid-3">
            {teams.map((team) => (
              <article key={team.name} className={`card team ${team.className}`}>
                <h3>{team.name}</h3>
                <p>{team.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

