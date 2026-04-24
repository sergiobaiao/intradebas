'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AthleteSummary,
  TeamSummary,
  adminDeleteTeam,
  adminFetchJson,
  adminUpdateTeam,
} from '../../lib';

export default function AdminEquipesPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('');

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

  async function saveTeam(teamId: string) {
    setError(null);
    try {
      const updated = await adminUpdateTeam(teamId, {
        name: teamName || undefined,
        color: teamColor || undefined,
      });
      setTeams((current) =>
        current.map((team) => (team.id === teamId ? { ...team, ...updated } : team)),
      );
      setEditingId(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar equipe');
    }
  }

  async function deleteTeam(teamId: string) {
    setDeletingId(teamId);
    setError(null);

    try {
      await adminDeleteTeam(teamId);
      setTeams((current) => current.filter((team) => team.id !== teamId));
      setAthletes((current) => current.filter((athlete) => athlete.team?.id !== teamId));
      if (editingId === teamId) {
        setEditingId(null);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao excluir equipe');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Equipes</span>
        <h1>Gestao de equipes</h1>
        <p>Visao consolidada das equipes, composicao de atletas e placar acumulado.</p>
        <div className="cta-row">
          <a className="button primary" href="/admin/equipes/nova">
            Nova equipe
          </a>
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>
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
                {editingId === team.id ? (
                  <div className="form-grid">
                    <label>
                      <span>Nome</span>
                      <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                    </label>
                    <label>
                      <span>Cor</span>
                      <input value={teamColor} onChange={(event) => setTeamColor(event.target.value)} />
                    </label>
                  </div>
                ) : null}
                <div className="cta-row">
                  <a className="button secondary" href={`/admin/equipes/${team.id}`}>
                    Ver equipe
                  </a>
                  {editingId === team.id ? (
                    <>
                      <button className="button primary" type="button" onClick={() => saveTeam(team.id)}>
                        Salvar
                      </button>
                      <button className="button secondary" type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(team.id);
                          setTeamName(team.name);
                          setTeamColor(team.color ?? '');
                        }}
                      >
                        Editar equipe
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => deleteTeam(team.id)}
                        disabled={deletingId === team.id}
                      >
                        {deletingId === team.id ? 'Removendo...' : 'Excluir equipe'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
