'use client';

import { useEffect, useState } from 'react';
import { AuditLogSummary, adminGetAuditLogs } from '../../lib';

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<AuditLogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityType, setEntityType] = useState('');

  useEffect(() => {
    void loadData();
  }, [entityType]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      setLogs(await adminGetAuditLogs(entityType || undefined));
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
        <p>Historico recente de alteracoes em resultados e dados administrativos criticos.</p>
        <div className="card" style={{ marginTop: '24px' }}>
          <label>
            <span>Filtrar por entidade</span>
            <select value={entityType} onChange={(event) => setEntityType(event.target.value)}>
              <option value="">Todas</option>
              <option value="result">Resultados</option>
              <option value="athlete">Atletas</option>
              <option value="team">Equipes</option>
              <option value="sport">Modalidades</option>
              <option value="sponsor">Patrocinadores</option>
            </select>
          </label>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando auditoria...</p> : null}
        {!loading && logs.length === 0 ? <div className="card empty-state"><strong>Nenhum log encontrado.</strong></div> : null}
        {!loading ? (
          <div className="review-grid">
            {logs.map((audit) => (
              <article key={audit.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{audit.entityLabel ?? audit.entityId}</h3>
                    <small>{audit.entityType}</small>
                  </div>
                  <span className="status-pill active">{audit.action}</span>
                </div>
                <p>Campo: {audit.fieldChanged ?? 'n/a'}</p>
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
