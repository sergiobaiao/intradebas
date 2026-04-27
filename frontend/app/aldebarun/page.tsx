import { getAldebarunResults, getAldebarunSports } from '../lib';

function formatSchedule(value?: string | null) {
  if (!value) {
    return 'Agenda a confirmar';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Fortaleza',
  }).format(new Date(value));
}

function formatRawScore(value?: number | null) {
  if (value == null) {
    return 'Tempo nao informado';
  }

  const totalSeconds = Math.max(Math.round(value), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default async function AldebarunPage() {
  const [sports, results] = await Promise.all([getAldebarunSports(), getAldebarunResults()]);

  const groupedResults = sports.map((sport) => ({
    sport,
    results: results.filter((result) => result.sport.id === sport.id),
  }));

  return (
    <main className="section">
      <div className="shell">
        <div className="card">
          <span className="eyebrow">ALDEBARUN II</span>
          <h1>Corrida da Familia</h1>
          <p>
            Pagina dedicada da corrida com modalidades reais, agenda operacional e ranking por
            tempo a partir dos resultados gravados no backend.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/inscricao">
              Fazer inscricao
            </a>
            <a className="button secondary" href="/resultados">
              Ver placar geral
            </a>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '24px' }}>
          <article className="card">
            <small>Modalidades</small>
            <strong>{sports.length}</strong>
            <span>Corridas marcadas como ALDEBARUN no cadastro de modalidades.</span>
          </article>
          <article className="card">
            <small>Resultados</small>
            <strong>{results.length}</strong>
            <span>Tempos e colocacoes publicadas pela comissao organizadora.</span>
          </article>
          <article className="card">
            <small>Status</small>
            <strong>Dados reais</strong>
            <span>Sem fallback mockado no portal publico.</span>
          </article>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gap: '24px' }}>
          {groupedResults.map(({ sport, results: sportResults }) => (
            <section key={sport.id} className="card">
              <span className="eyebrow">{sport.category}</span>
              <h2>{sport.name}</h2>
              <p>{sport.description || 'Modalidade dedicada da corrida ALDEBARUN.'}</p>
              <p>
                <strong>Agenda:</strong> {formatSchedule(sport.scheduleDate)}
              </p>
              {sport.scheduleNotes ? (
                <p>
                  <strong>Observacoes:</strong> {sport.scheduleNotes}
                </p>
              ) : null}

              {sportResults.length === 0 ? (
                <p style={{ marginTop: '16px' }}>
                  Ainda nao ha tempos publicados para esta prova.
                </p>
              ) : (
                <div className="ranking-list" style={{ marginTop: '16px' }}>
                  {sportResults.map((result) => (
                    <article key={result.id} className="ranking-item">
                      <div>
                        <small>{result.position}o lugar</small>
                        <h3>{result.team?.name ?? 'Equipe nao informada'}</h3>
                        <span>{result.notes ?? 'Resultado oficial da corrida'}</span>
                      </div>
                      <strong>{formatRawScore(result.rawScore)}</strong>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}

          {sports.length === 0 ? (
            <section className="card">
              <h2>Nenhuma prova ALDEBARUN cadastrada</h2>
              <p>
                Cadastre modalidades com a flag ALDEBARUN no painel administrativo para publicar a
                agenda e os rankings da corrida.
              </p>
            </section>
          ) : null}
        </div>

        <section className="card" style={{ marginTop: '24px' }}>
          <h2>Observacao de regulamento</h2>
          <p>
            O documento tecnico aponta que as faixas etarias e categorias por sexo ainda dependem
            de regulamento oficial da organizacao. Ate essa definicao, a publicacao fica por prova
            cadastrada e por tempo/colocacao oficial.
          </p>
        </section>
      </div>
    </main>
  );
}
