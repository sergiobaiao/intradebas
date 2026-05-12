'use client';

import { useEffect, useState } from 'react';
import {
  AthleteSummary,
  adminDeleteAthlete,
  adminDownloadAthletesCsv,
  adminFetchJson,
  adminGetAthleteReviewPage,
  adminUpdateAthleteStatus,
} from '../../lib';

export default function AdminAthletesPage() {
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [teamIdFilter, setTeamIdFilter] = useState('');
  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    void loadAthletes();
  }, [page, statusFilter, teamIdFilter, search]);

  async function loadAthletes() {
    setLoading(true);
    setError(null);

    try {
      const [response, loadedTeams] = await Promise.all([
        adminGetAthleteReviewPage({
          page,
          pageSize: 12,
          status: statusFilter,
          teamId: teamIdFilter,
          search,
        }),
        adminFetchJson<{ id: string; name: string }[]>('/teams'),
      ]);
      setAthletes(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setTeams(loadedTeams);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar atletas');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(athleteId: string, status: 'active' | 'rejected') {
    setPendingActionId(athleteId);
    setError(null);

    try {
      const updated = await adminUpdateAthleteStatus(athleteId, status);
      setAthletes((current) =>
        current.map((athlete) => (athlete.id === athleteId ? updated : athlete)),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar atleta');
    } finally {
      setPendingActionId(null);
    }
  }

  async function deleteAthlete(athleteId: string) {
    if (!confirm('Tem certeza que deseja excluir este atleta?')) return;
    setDeletingId(athleteId);
    setError(null);

    try {
      await adminDeleteAthlete(athleteId);
      setAthletes((current) => current.filter((athlete) => athlete.id !== athleteId));
      setTotal((current) => Math.max(current - 1, 0));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao excluir atleta');
    } finally {
      setDeletingId(null);
    }
  }

  async function exportCsv() {
    setExporting(true);
    setError(null);

    try {
      const csv = await adminDownloadAthletesCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'atletas.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Falha ao exportar atletas');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Gestao de Atletas</span>
          <h1>Revisao de inscricoes</h1>
        </div>
        <div className="admin-topbar-actions">
          <button
            className="admin-quick-action"
            style={{ minHeight: '38px', padding: '0 14px', background: 'transparent', border: '1px solid rgba(17,24,39,0.1)', color: '#111827' }}
            type="button"
            onClick={exportCsv}
            disabled={exporting}
          >
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <a className="admin-quick-action" style={{ minHeight: '38px', padding: '0 14px' }} href="/admin/atletas/novo">
            Novo atleta
          </a>
        </div>
      </header>

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="form-grid" style={{ marginTop: 0 }}>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Status</span>
            <select
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={statusFilter}
              onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }}
            >
              <option value="">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="active">Ativos</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Equipe</span>
            <select
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={teamIdFilter}
              onChange={(event) => { setPage(1); setTeamIdFilter(event.target.value); }}
            >
              <option value="">Todas</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="field-span">
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Busca por nome/CPF</span>
            <input
              style={{ minHeight: '40px', borderRadius: '10px' }}
              placeholder="Digite o nome ou CPF..."
              value={search}
              onChange={(event) => { setPage(1); setSearch(event.target.value); }}
            />
          </label>
        </div>
        <p className="admin-kicker" style={{ marginTop: '16px', textTransform: 'none' }}>
          Total filtrado: <strong>{total}</strong> atletas
        </p>
      </section>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Lista de Atletas</h2>
            <p>Visualizacao e acoes rapidas para inscricoes.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span className="admin-kicker">Pagina {page} de {totalPages}</span>
             <div className="admin-topbar-actions" style={{ marginTop: 0 }}>
                <button
                  className="admin-topbar-actions a"
                  style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  Anterior
                </button>
                <button
                  className="admin-topbar-actions a"
                  style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Proxima
                </button>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <strong>Carregando...</strong>
            <span>Buscando registros de atletas no sistema.</span>
          </div>
        ) : null}

        {!loading && athletes.length === 0 ? (
          <div className="admin-empty-state">
            <strong>Nenhum atleta encontrado.</strong>
            <span>Ajuste os filtros para ampliar a busca.</span>
          </div>
        ) : null}

        {!loading && athletes.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Equipe</th>
                  <th>Status</th>
                  <th>CPF</th>
                  <th>Modalidades</th>
                  <th style={{ textAlign: 'right' }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete) => (
                  <tr key={athlete.id}>
                    <td>
                      <a href={`/admin/atletas/${athlete.id}`}>{athlete.name}</a>
                    </td>
                    <td>{athlete.team?.name ?? '—'}</td>
                    <td>
                      <span className={`admin-table-status status-pill ${athlete.status}`}>
                        {athlete.status}
                      </span>
                    </td>
                    <td>{athlete.cpf}</td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {athlete.sports.map((s) => s.name).join(', ') || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {athlete.status === 'pending' ? (
                          <>
                            <button
                              className="admin-topbar-actions a"
                              style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem', background: '#111827', color: '#fff', border: 'none' }}
                              disabled={pendingActionId === athlete.id}
                              onClick={() => updateStatus(athlete.id, 'active')}
                              type="button"
                            >
                              Aprovar
                            </button>
                            <button
                              className="admin-topbar-actions a"
                              style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem' }}
                              disabled={pendingActionId === athlete.id}
                              onClick={() => updateStatus(athlete.id, 'rejected')}
                              type="button"
                            >
                              Rejeitar
                            </button>
                          </>
                        ) : null}
                        <button
                          className="admin-topbar-actions a"
                          style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                          disabled={deletingId === athlete.id}
                          onClick={() => deleteAthlete(athlete.id)}
                          type="button"
                        >
                          {deletingId === athlete.id ? '...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
