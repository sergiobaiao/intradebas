import { getTeams } from '../lib';

export default async function ResultadosPage() {
  const teams = await getTeams();
  const ranking = [...teams].sort((left, right) => right.totalScore - left.totalScore);

  return (
    <main className="section">
      <div className="shell">
        <div className="card">
          <span className="eyebrow">Live score</span>
          <h1>Central de resultados</h1>
          <p>
            Leitura inicial do ranking consolidado por equipe. O contrato publico
            ja esta preparado no backend em `/api/v1/teams`.
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

