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
    <main className="section">
      <div className="shell">
        <span className="eyebrow">LGPD</span>
        <h1>Solicitacoes de exclusao</h1>
        <p>Fluxo administrativo para triagem e resposta das demandas de exclusao de dados.</p>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="cta-row">
            <label>
              <span>Filtrar por status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">todos</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando solicitacoes...</p> : null}
        {!loading && rows.length === 0 ? (
          <div className="card empty-state">
            <strong>Nenhuma solicitacao LGPD encontrada.</strong>
          </div>
        ) : null}

        {!loading ? (
          <div className="review-grid">
            {rows.map((row) => (
              <article key={row.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{row.requesterName}</h3>
                    <small>{row.athleteCpf}</small>
                  </div>
                  <span className={`status-pill ${row.status}`}>{row.status}</span>
                </div>
                <p>
                  Contato: {row.email ?? 'sem e-mail'} {row.phone ? `· ${row.phone}` : ''}
                </p>
                <p>Solicitado em: {new Date(row.requestedAt).toLocaleString('pt-BR')}</p>
                <p>Motivo: {row.reason ?? 'Nao informado'}</p>
                <p>
                  Atleta vinculado: {row.athlete ? `${row.athlete.name} · ${row.athlete.team?.name ?? 'sem equipe'}` : 'CPF sem atleta vinculado no momento'}
                </p>
                <label className="field-span">
                  <span>Notas administrativas</span>
                  <textarea
                    value={notesDraft[row.id] ?? ''}
                    onChange={(event) =>
                      setNotesDraft((current) => ({
                        ...current,
                        [row.id]: event.target.value,
                      }))
                    }
                    rows={4}
                  />
                </label>
                <div className="cta-row">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      className="button secondary"
                      type="button"
                      disabled={savingId === row.id}
                      onClick={() => void saveRow(row, status)}
                    >
                      {savingId === row.id && row.status !== status ? 'Salvando...' : status}
                    </button>
                  ))}
                </div>
                {row.reviewer ? (
                  <small>
                    Ultima revisao: {row.reviewer.name}
                    {row.reviewedAt ? ` em ${new Date(row.reviewedAt).toLocaleString('pt-BR')}` : ''}
                  </small>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
