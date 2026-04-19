'use client';

import { useEffect, useMemo, useState } from 'react';
import { AthleteSummary, TeamSummary, adminFetchJson } from '../../lib';

export default function AdminEquipesPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [loadedTeams, loadedAthletes] = await Promise.all([
        adminFetchJson<TeamSummary[]>('/teams'),
        adminFetchJson<AthleteSummary[]>('/athletes'),
      ]);
      setTeams(loadedTeams);
      setAthletes(loadedAthletes);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar equipes');
    } finally {
      setLoading(false);
    }
  }

  const grouped = useMemo(
    () =>
      teams.map((team) => ({
        ...team,
        athletes: athletes.filter((athlete) => athlete.team?.id === team.id),
      })),
    [athletes, teams],
  );

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Equipes</span>
        <h1>Gestao de equipes</h1>
        <p>Visao consolidada das equipes, composicao de atletas e placar acumulado.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando equipes...</p> : null}
        {!loading && grouped.length === 0 ? <div className="card empty-state"><strong>Nenhuma equipe cadastrada.</strong></div> : null}
        {!loading ? (
          <div className="review-grid">
            {grouped.map((team) => (
              <article key={team.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{team.name}</h3>
                    <small>Placar atual: {team.totalScore}</small>
                  </div>
                  <span className="status-pill active">{team.athletes.length} atletas</span>
                </div>
                <p>Cor da equipe: {team.color ?? 'Nao definida'}</p>
                <p>
                  Ativos: {team.athletes.filter((athlete) => athlete.status === 'active').length} · Pendentes:{' '}
                  {team.athletes.filter((athlete) => athlete.status === 'pending').length}
                </p>
                <p>
                  Modalidades: {Array.from(new Set(team.athletes.flatMap((athlete) => athlete.sports.map((sport) => sport.name)))).join(', ') || 'Nenhuma'}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
