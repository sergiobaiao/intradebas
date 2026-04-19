'use client';

import { useEffect, useState } from 'react';
import { ResultAuditLogSummary, adminGetResultAuditLogs } from '../../lib';

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<ResultAuditLogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      setLogs(await adminGetResultAuditLogs());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar auditoria');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Auditoria</span>
        <h1>Logs de auditoria</h1>
        <p>Historico recente de alteracoes em resultados e seus respectivos autores.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando auditoria...</p> : null}
        {!loading && logs.length === 0 ? <div className="card empty-state"><strong>Nenhum log encontrado.</strong></div> : null}
        {!loading ? (
          <div className="review-grid">
            {logs.map((audit) => (
              <article key={audit.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{audit.result.sport.name}</h3>
                    <small>{audit.result.team?.name ?? 'Sem equipe'}</small>
                  </div>
                  <span className="status-pill active">{audit.fieldChanged}</span>
                </div>
                <p>{audit.oldValue ?? 'vazio'} → {audit.newValue ?? 'vazio'}</p>
                <p>{audit.changer.name} · {new Date(audit.changedAt).toLocaleString('pt-BR')}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
