'use client';

import { useEffect, useState } from 'react';
import {
  LgpdDeletionRequestSummary,
  adminGetLgpdDeletionRequests,
  adminUpdateLgpdDeletionRequest,
} from '../../lib';

const statusOptions = ['pending', 'in_review', 'resolved', 'rejected'] as const;

export default function AdminLgpdPage() {
  const [rows, setRows] = useState<LgpdDeletionRequestSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    void loadRows(statusFilter);
  }, [statusFilter]);

  async function loadRows(status?: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await adminGetLgpdDeletionRequests(status);
      setRows(data);
      setNotesDraft(
        Object.fromEntries(data.map((row) => [row.id, row.adminNotes ?? ''])),
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar solicitacoes LGPD');
    } finally {
      setLoading(false);
    }
  }

  async function saveRow(row: LgpdDeletionRequestSummary, status: (typeof statusOptions)[number]) {
    setSavingId(row.id);
    setError(null);

    try {
      const updated = await adminUpdateLgpdDeletionRequest(row.id, {
        status,
        adminNotes: notesDraft[row.id] ?? '',
      });

      setRows((current) => current.map((entry) => (entry.id === row.id ? updated : entry)));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Falha ao atualizar solicitacao LGPD');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Governanca</span>
          <h1>LGPD</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="admin-panel-header">
           <div>
             <h2>Solicitacoes de exclusao</h2>
             <p>Fluxo administrativo para triagem e resposta das demandas de exclusao de dados pessoais.</p>
           </div>
        </div>
        <div className="form-grid" style={{ marginTop: 0 }}>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Filtrar por status</span>
            <select style={{ minHeight: '40px', borderRadius: '10px' }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Todos os status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Nenhuma solicitacao encontrada.</strong>
          <span>Ajuste o filtro para ver outras demandas.</span>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <div className="review-grid">
          {rows.map((row) => (
            <article key={row.id} className="admin-panel" style={{ padding: '18px', background: '#fcfcfc' }}>
              <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{row.requesterName}</h3>
                  <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>CPF: {row.athleteCpf}</span>
                </div>
                <span className={`admin-table-status status-pill ${row.status}`}>
                  {row.status}
                </span>
              </div>
              
              <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#4b5563' }}>
                <p style={{ margin: 0 }}><strong>Contato:</strong> {row.email ?? '—'} {row.phone ? `· ${row.phone}` : ''}</p>
                <p style={{ margin: '4px 0 0' }}><strong>Data:</strong> {new Date(row.requestedAt).toLocaleString('pt-BR')}</p>
                <p style={{ margin: '4px 0 0' }}><strong>Motivo:</strong> {row.reason ?? 'Nao informado'}</p>
                <p style={{ margin: '4px 0 0' }}>
                  <strong>Vinculo:</strong> {row.athlete ? `${row.athlete.name} (${row.athlete.team?.name ?? 'sem equipe'})` : 'CPF sem atleta vinculado'}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Notas administrativas</span>
                <textarea
                  style={{ width: '100%', minHeight: '80px', borderRadius: '10px', border: '1px solid rgba(17, 24, 39, 0.1)', padding: '10px', marginTop: '4px', fontSize: '0.85rem' }}
                  value={notesDraft[row.id] ?? ''}
                  onChange={(event) =>
                    setNotesDraft((current) => ({
                      ...current,
                      [row.id]: event.target.value,
                    }))
                  }
                  placeholder="Registre o andamento da solicitacao..."
                />
              </div>

              <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0, gap: '6px' }}>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className="admin-topbar-actions a"
                    style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.75rem', ...(row.status === status ? { background: '#111827', color: '#fff', border: 'none' } : {}) }}
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => void saveRow(row, status)}
                  >
                    {savingId === row.id && row.status !== status ? '...' : status}
                  </button>
                ))}
              </div>

              {row.reviewer ? (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(17, 24, 39, 0.05)' }}>
                   <span className="admin-kicker" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                    Revisado por <strong>{row.reviewer.name}</strong> 
                    {row.reviewedAt ? ` em ${new Date(row.reviewedAt).toLocaleString('pt-BR')}` : ''}
                  </span>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
