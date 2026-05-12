'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  BulkResultInput,
  ResultInput,
  ResultAuditLogSummary,
  ResultSummary,
  SportSummary,
  TeamSummary,
  adminCreateResult,
  adminCreateResultsBulk,
  adminFetchJson,
  adminGetResultAuditLogs,
  adminGetResultsPage,
  adminUpdateResult,
} from '../../lib';

function toDatetimeLocalInput(value: string) {
  return value.slice(0, 16);
}

type BulkEntryRow = {
  id: string;
  sportId: string;
  teamId: string;
  position: number;
  rawScore: string;
  notes: string;
};

function makeBulkRow(sportId = '', teamId = ''): BulkEntryRow {
  return {
    id: crypto.randomUUID(),
    sportId,
    teamId,
    position: 1,
    rawScore: '',
    notes: '',
  };
}

export default function AdminResultadosPage() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<ResultAuditLogSummary[]>([]);
  const [sportId, setSportId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [position, setPosition] = useState(1);
  const [rawScore, setRawScore] = useState('');
  const [resultDate, setResultDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultTeamFilter, setResultTeamFilter] = useState('');
  const [resultSportFilter, setResultSportFilter] = useState('');
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().slice(0, 16));
  const [bulkRows, setBulkRows] = useState<BulkEntryRow[]>([]);

  useEffect(() => {
    void loadData();
  }, [page, resultTeamFilter, resultSportFilter]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [loadedResults, loadedTeams, loadedSports] = await Promise.all([
        adminGetResultsPage({
          page,
          pageSize: 12,
          teamId: resultTeamFilter,
          sportId: resultSportFilter,
        }),
        adminFetchJson<TeamSummary[]>('/teams'),
        adminFetchJson<SportSummary[]>('/sports'),
      ]);
      const loadedAuditLogs = await adminGetResultAuditLogs();

      setResults(loadedResults.items);
      setTotalPages(loadedResults.totalPages);
      setTeams(loadedTeams);
      setSports(loadedSports);
      setAuditLogs(loadedAuditLogs);
      setSportId((current) => current || loadedSports[0]?.id || '');
      setTeamId((current) => current || loadedTeams[0]?.id || '');
      setBulkRows((current) =>
        current.length > 0
          ? current
          : [
              makeBulkRow(loadedSports[0]?.id ?? '', loadedTeams[0]?.id ?? ''),
              makeBulkRow(loadedSports[0]?.id ?? '', loadedTeams[0]?.id ?? ''),
              makeBulkRow(loadedSports[0]?.id ?? '', loadedTeams[0]?.id ?? ''),
            ],
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar resultados');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setSportId(sports[0]?.id ?? '');
    setTeamId(teams[0]?.id ?? '');
    setPosition(1);
    setRawScore('');
    setResultDate(new Date().toISOString().slice(0, 16));
    setNotes('');
  }

  function updateBulkRow(rowId: string, patch: Partial<BulkEntryRow>) {
    setBulkRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }

  function addBulkRow() {
    setBulkRows((current) => [...current, makeBulkRow(sports[0]?.id ?? '', teams[0]?.id ?? '')]);
  }

  function removeBulkRow(rowId: string) {
    setBulkRows((current) => current.filter((row) => row.id !== rowId));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const payload: ResultInput = {
      sportId,
      teamId,
      position,
      rawScore: rawScore ? Number(rawScore) : undefined,
      resultDate: new Date(resultDate).toISOString(),
      notes: notes || undefined,
    };

    try {
      if (editingId) {
        const updated = await adminUpdateResult(editingId, payload);
        setResults((current) =>
          current.map((result) => (result.id === editingId ? updated : result)),
        );
        setAuditLogs(await adminGetResultAuditLogs());
        setMessage('Resultado corrigido com sucesso.');
      } else {
        const created = await adminCreateResult(payload);
        setResults((current) => [created, ...current]);
        setMessage('Resultado lancado com sucesso.');
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao salvar resultado');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBulkSubmit() {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const items: ResultInput[] = bulkRows
      .filter((row) => row.sportId && row.teamId && row.position > 0)
      .map((row) => ({
        sportId: row.sportId,
        teamId: row.teamId,
        position: row.position,
        rawScore: row.rawScore ? Number(row.rawScore) : undefined,
        resultDate: new Date(bulkDate).toISOString(),
        notes: row.notes || undefined,
      }));

    if (items.length === 0) {
      setSubmitting(false);
      setError('Preencha pelo menos uma linha valida para o lote.');
      return;
    }

    try {
      await adminCreateResultsBulk({ items } as BulkResultInput);
      await loadData();
      setBulkRows([
        makeBulkRow(sports[0]?.id ?? '', teams[0]?.id ?? ''),
        makeBulkRow(sports[0]?.id ?? '', teams[0]?.id ?? ''),
        makeBulkRow(sports[0]?.id ?? '', teams[0]?.id ?? ''),
      ]);
      setMessage('Resultados em lote lancados com sucesso.');
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Falha ao salvar resultados em lote',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(result: ResultSummary) {
    setEditingId(result.id);
    setSportId(result.sport.id);
    setTeamId(result.team.id);
    setPosition(result.position);
    setRawScore(result.rawScore != null ? String(result.rawScore) : '');
    setResultDate(toDatetimeLocalInput(result.resultDate));
    setNotes(result.notes ?? '');
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Resultados operacionais</h1>
        </div>
        <div className="admin-topbar-actions">
           <a className="admin-quick-action" style={{ minHeight: '38px', padding: '0 14px' }} href="/admin/resultados/novo">
            Novo lancamento
          </a>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      {message ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', marginBottom: '22px' }}>
          <p className="success-text">{message}</p>
        </div>
      ) : null}

      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>{editingId ? 'Corrigir resultado' : 'Lancar resultado'}</h2>
          </div>
          <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Modalidade</span>
              <select style={{ minHeight: '40px', borderRadius: '10px' }} value={sportId} onChange={(event) => setSportId(event.target.value)}>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Equipe</span>
              <select style={{ minHeight: '40px', borderRadius: '10px' }} value={teamId} onChange={(event) => setTeamId(event.target.value)}>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Posicao</span>
              <input
                style={{ minHeight: '40px', borderRadius: '10px' }}
                min={1}
                type="number"
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
              />
            </label>

            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Score bruto (opcional)</span>
              <input
                style={{ minHeight: '40px', borderRadius: '10px' }}
                type="number"
                value={rawScore}
                onChange={(event) => setRawScore(event.target.value)}
              />
            </label>

            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data e hora</span>
              <input
                style={{ minHeight: '40px', borderRadius: '10px' }}
                type="datetime-local"
                value={resultDate}
                onChange={(event) => setResultDate(event.target.value)}
              />
            </label>

            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Observacoes</span>
              <input 
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={notes} 
                onChange={(event) => setNotes(event.target.value)} 
              />
            </label>

            <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
              <button
                className="admin-quick-action"
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="submit"
                disabled={submitting || !sportId || !teamId || position < 1}
              >
                {submitting ? 'Salvando...' : editingId ? 'Salvar correcao' : 'Lancar resultado'}
              </button>
              {editingId ? (
                <button 
                  className="admin-topbar-actions a" 
                  style={{ minHeight: '40px', padding: '0 20px' }}
                  type="button" 
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Filtros de lista</h2>
          </div>
          <div className="admin-status-stack">
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Por Modalidade</span>
              <select style={{ width: '100%', minHeight: '40px', borderRadius: '10px', marginTop: '4px' }} value={resultSportFilter} onChange={(event) => { setPage(1); setResultSportFilter(event.target.value); }}>
                <option value="">Todas</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
                ))}
              </select>
            </label>
            <label style={{ marginTop: '12px', display: 'block' }}>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Por Equipe</span>
              <select style={{ width: '100%', minHeight: '40px', borderRadius: '10px', marginTop: '4px' }} value={resultTeamFilter} onChange={(event) => { setPage(1); setResultTeamFilter(event.target.value); }}>
                <option value="">Todas</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </div>

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="admin-panel-header">
          <div>
            <h2>Historico de Resultados</h2>
            <p>Resultados lancados no sistema ordenados por data.</p>
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
          </div>
        ) : null}

        {!loading && results.length === 0 ? (
          <div className="admin-empty-state">
            <strong>Nenhum resultado encontrado.</strong>
          </div>
        ) : null}

        {!loading && results.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Modalidade</th>
                  <th>Equipe</th>
                  <th>Posicao</th>
                  <th>Pontos</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.sport.name}</td>
                    <td>{result.team.name}</td>
                    <td>{result.position}º</td>
                    <td>
                       <span className="admin-table-status" style={{ background: 'rgba(45, 106, 79, 0.1)', color: '#2d6a4f' }}>
                        {result.calculatedPoints} pts
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                      {new Date(result.resultDate).toLocaleString('pt-BR')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="admin-topbar-actions a" 
                        style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem' }}
                        type="button" 
                        onClick={() => startEdit(result)}
                      >
                        Corrigir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="admin-panel-header">
           <h2>Auditoria de correcoes</h2>
           <p>Registro imutavel de alteracoes em resultados.</p>
        </div>
        
        {auditLogs.length === 0 ? (
          <div className="admin-empty-state">
            <span>Nenhuma alteracao auditada.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Modalidade</th>
                  <th>Campo</th>
                  <th>Antes</th>
                  <th>Depois</th>
                  <th>Responsavel</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((audit) => (
                  <tr key={audit.id}>
                    <td>{audit.result.sport.name} <br/><small>{audit.result.team?.name}</small></td>
                    <td><span className="admin-table-status">{audit.fieldChanged}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{audit.oldValue || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{audit.newValue || '—'}</td>
                    <td>{audit.changer.name}</td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>{new Date(audit.changedAt).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel">
         <div className="admin-panel-header">
            <h2>Lancamento em lote</h2>
            <p>Registre varias colocacoes em uma unica operacao.</p>
         </div>

         <div className="form-grid" style={{ marginTop: 0, marginBottom: '22px' }}>
            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data e hora do lote</span>
              <input
                style={{ minHeight: '40px', borderRadius: '10px' }}
                type="datetime-local"
                value={bulkDate}
                onChange={(event) => setBulkDate(event.target.value)}
              />
            </label>
          </div>

          <div className="review-grid" style={{ marginTop: 0 }}>
            {bulkRows.map((row, index) => (
              <article key={row.id} className="admin-panel" style={{ padding: '16px', background: '#fcfcfc' }}>
                <div className="admin-panel-header" style={{ marginBottom: '12px' }}>
                   <h3 style={{ fontSize: '1rem', margin: 0 }}>Linha {index + 1}</h3>
                   <button
                    className="admin-topbar-actions a"
                    style={{ minHeight: '28px', padding: '0 8px', fontSize: '0.75rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                    type="button"
                    onClick={() => removeBulkRow(row.id)}
                    disabled={bulkRows.length <= 1}
                  >
                    Remover
                  </button>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 0 }}>
                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Modalidade</span>
                    <select
                      style={{ minHeight: '36px', borderRadius: '8px', fontSize: '0.85rem' }}
                      value={row.sportId}
                      onChange={(event) => updateBulkRow(row.id, { sportId: event.target.value })}
                    >
                      {sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Equipe</span>
                    <select
                      style={{ minHeight: '36px', borderRadius: '8px', fontSize: '0.85rem' }}
                      value={row.teamId}
                      onChange={(event) => updateBulkRow(row.id, { teamId: event.target.value })}
                    >
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Posicao</span>
                    <input
                      style={{ minHeight: '36px', borderRadius: '8px', fontSize: '0.85rem' }}
                      type="number"
                      min={1}
                      value={row.position}
                      onChange={(event) =>
                        updateBulkRow(row.id, { position: Number(event.target.value) })
                      }
                    />
                  </label>

                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Score</span>
                    <input
                      style={{ minHeight: '36px', borderRadius: '8px', fontSize: '0.85rem' }}
                      type="number"
                      value={row.rawScore}
                      onChange={(event) => updateBulkRow(row.id, { rawScore: event.target.value })}
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '22px' }}>
            <button className="admin-topbar-actions a" style={{ minHeight: '40px', padding: '0 20px' }} type="button" onClick={addBulkRow}>
              Adicionar linha
            </button>
            <button
              className="admin-quick-action"
              style={{ minHeight: '40px', padding: '0 20px' }}
              type="button"
              onClick={handleBulkSubmit}
              disabled={submitting}
            >
              {submitting ? 'Salvando lote...' : 'Lancar lote'}
            </button>
          </div>
      </section>
    </div>
  );
}
