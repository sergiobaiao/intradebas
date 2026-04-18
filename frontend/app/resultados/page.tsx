import { getRanking } from '../lib';

export default async function ResultadosPage() {
  const ranking = await getRanking();

  return (
    <main className="section">
      <div className="shell">
        <div className="card">
          <span className="eyebrow">Live score</span>
          <h1>Central de resultados</h1>
          <p>
            Ranking consolidado por equipe com base nos resultados gravados no
            backend.
          </p>
          <div className="ranking-list">
            {ranking.map((team, index) => (
              <article key={team.id} className="ranking-item">
                <div>
                  <small>{index + 1}o lugar</small>
                  <h3>{team.name}</h3>
                </div>
                <strong>{team.totalScore} pts</strong>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
