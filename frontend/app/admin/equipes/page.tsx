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
    if (!confirm('Tem certeza que deseja excluir esta equipe?')) return;
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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Equipes</h1>
        </div>
        <div className="admin-topbar-actions">
          <a className="admin-quick-action" style={{ minHeight: '38px', padding: '0 14px' }} href="/admin/equipes/nova">
            Nova equipe
          </a>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <p className="admin-kicker" style={{ textTransform: 'none' }}>
          Visao consolidada das equipes, composicao de atletas e placar acumulado do evento.
        </p>
      </section>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
          <span>Buscando registros de equipes no sistema.</span>
        </div>
      ) : null}

      {!loading && grouped.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Nenhuma equipe cadastrada.</strong>
          <span>Clique em "Nova equipe" para comecar.</span>
        </div>
      ) : null}

      {!loading && grouped.length > 0 ? (
        <div className="review-grid">
          {grouped.map((team) => (
            <article key={team.id} className="admin-panel" style={{ padding: '18px' }}>
              <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem' }}>{team.name}</h2>
                  <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>Placar: {team.totalScore} pts</span>
                </div>
                <span className="admin-table-status" style={{ background: 'rgba(45, 106, 79, 0.1)', color: '#2d6a4f' }}>
                  {team.athletes.length} atletas
                </span>
              </div>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                   <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: team.color || '#ccc', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                   <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Cor: {team.color || 'Padrao'}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                  <strong>Ativos:</strong> {team.athletes.filter((a) => a.status === 'active').length} · 
                  <strong> Pendentes:</strong> {team.athletes.filter((a) => a.status === 'pending').length}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <strong>Modalidades:</strong> {Array.from(new Set(team.athletes.flatMap((a) => a.sports.map((s) => s.name)))).join(', ') || 'Nenhuma'}
                </p>
              </div>

              {editingId === team.id ? (
                <div className="form-grid" style={{ marginTop: 0, marginBottom: '16px', gap: '10px' }}>
                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome</span>
                    <input style={{ minHeight: '36px', borderRadius: '8px' }} value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                  </label>
                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Cor (Hex)</span>
                    <input style={{ minHeight: '36px', borderRadius: '8px' }} value={teamColor} onChange={(event) => setTeamColor(event.target.value)} />
                  </label>
                </div>
              ) : null}

              <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                <a className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }} href={`/admin/equipes/${team.id}`}>
                  Ver detalhes
                </a>
                {editingId === team.id ? (
                  <>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', background: '#111827', color: '#fff' }} type="button" onClick={() => saveTeam(team.id)}>
                      Salvar
                    </button>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }} type="button" onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-topbar-actions a"
                      style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                      type="button"
                      onClick={() => {
                        setEditingId(team.id);
                        setTeamName(team.name);
                        setTeamColor(team.color ?? '');
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-topbar-actions a"
                      style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                      type="button"
                      onClick={() => deleteTeam(team.id)}
                      disabled={deletingId === team.id}
                    >
                      {deletingId === team.id ? '...' : 'Excluir'}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
