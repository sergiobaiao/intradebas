import { getBackdropSponsors } from '../lib';

export default async function BackdropPage() {
  const sponsors = await getBackdropSponsors();

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Backdrop Digital</span>
        <h1>Patrocinadores ativos</h1>
        <p>
          Exposicao publica das marcas confirmadas no evento, priorizando as cotas de maior destaque.
        </p>

        {sponsors.length === 0 ? (
          <div className="card">
            <p>Nenhum patrocinador ativo foi publicado no backdrop ainda.</p>
          </div>
        ) : (
          <div className="grid-3 sponsorship-grid">
            {sponsors.map((sponsor) => (
              <article key={sponsor.id} className="card sponsorship-card">
                <span className="eyebrow">{sponsor.level.toUpperCase()}</span>
                <h3>{sponsor.companyName}</h3>
                <p>Prioridade de exposicao: {sponsor.backdropPriority}</p>
                {sponsor.logoUrl ? (
                  <a className="button secondary" href={sponsor.logoUrl} target="_blank" rel="noreferrer">
                    Ver logo
                  </a>
                ) : (
                  <small>Logo ainda nao enviada.</small>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
