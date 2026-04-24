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
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Atletas</span>
        <h1>Revisao de inscricoes</h1>
        <p>Fluxo administrativo para aprovacao e rejeicao de atletas pendentes.</p>

        <div className="cta-row">
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
          <a className="button secondary" href="/admin/atletas/novo">
            Novo atleta
          </a>
          <button className="button secondary" type="button" onClick={exportCsv} disabled={exporting}>
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <div className="form-grid">
            <label>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }}>
                <option value="">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="active">Ativos</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </label>
            <label>
              <span>Equipe</span>
              <select value={teamIdFilter} onChange={(event) => { setPage(1); setTeamIdFilter(event.target.value); }}>
                <option value="">Todas</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </label>
            <label className="field-span">
              <span>Busca por nome/CPF</span>
              <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} />
            </label>
          </div>
          <p style={{ marginTop: '12px' }}>Total filtrado: {total}</p>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        {loading ? <p>Carregando atletas...</p> : null}

        {!loading && athletes.length === 0 ? (
          <div className="card empty-state">
            <strong>Nenhum atleta encontrado.</strong>
            <span>Ajuste os filtros para ampliar a busca.</span>
          </div>
        ) : null}

        {!loading ? (
          <div className="review-grid">
            {athletes.map((athlete) => (
              <article key={athlete.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{athlete.name}</h3>
                    <small>
                      {athlete.team?.name ?? 'Sem equipe'} · status {athlete.status}
                    </small>
                  </div>
                  <span className={`status-pill ${athlete.status}`}>{athlete.status}</span>
                </div>

                <p>CPF: {athlete.cpf}</p>
                <p>
                  Modalidades:{' '}
                  {athlete.sports.map((sport) => sport.name).join(', ') || 'Nenhuma'}
                </p>

                <div className="cta-row">
                  <a className="button secondary" href={`/admin/atletas/${athlete.id}`}>
                    Ver perfil
                  </a>
                  <button
                    className="button secondary"
                    disabled={deletingId === athlete.id}
                    onClick={() => deleteAthlete(athlete.id)}
                    type="button"
                  >
                    {deletingId === athlete.id ? 'Removendo...' : 'Excluir'}
                  </button>

                {athlete.status === 'pending' ? (
                  <>
                    <button
                      className="button primary"
                      disabled={pendingActionId === athlete.id}
                      onClick={() => updateStatus(athlete.id, 'active')}
                      type="button"
                    >
                      Aprovar
                    </button>
                    <button
                      className="button secondary"
                      disabled={pendingActionId === athlete.id}
                      onClick={() => updateStatus(athlete.id, 'rejected')}
                      type="button"
                    >
                      Rejeitar
                    </button>
                  </>
                ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
        <div className="cta-row" style={{ marginTop: '24px' }}>
          <button className="button secondary" type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            Pagina anterior
          </button>
          <span>Pagina {page} de {totalPages}</span>
          <button className="button secondary" type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)}>
            Proxima pagina
          </button>
        </div>
      </div>
    </main>
  );
}
