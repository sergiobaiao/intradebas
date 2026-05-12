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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Sessao de Seguranca</span>
          <h1>Logs de auditoria</h1>
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
             <h2>Historico de alteracoes</h2>
             <p>Registro de modificacoes em resultados, atletas e dados administrativos criticos.</p>
           </div>
        </div>
        <div className="form-grid" style={{ marginTop: 0 }}>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Filtrar por entidade</span>
            <select style={{ minHeight: '40px', borderRadius: '10px' }} value={entityType} onChange={(event) => setEntityType(event.target.value)}>
              <option value="">Todas as entidades</option>
              <option value="result">Resultados</option>
              <option value="athlete">Atletas</option>
              <option value="team">Equipes</option>
              <option value="sport">Modalidades</option>
              <option value="sponsor">Patrocinadores</option>
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
        </div>
      ) : null}

      {!loading && logs.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Nenhum log encontrado.</strong>
          <span>Altere o filtro de entidade para ampliar a busca.</span>
        </div>
      ) : null}

      {!loading && logs.length > 0 ? (
        <div className="review-grid">
          {logs.map((audit) => (
            <article key={audit.id} className="admin-panel" style={{ padding: '18px', background: '#fcfcfc' }}>
              <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{audit.entityLabel ?? audit.entityId}</h3>
                  <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>{audit.entityType}</span>
                </div>
                <span className="admin-table-status" style={{ textTransform: 'uppercase' }}>
                  {audit.action}
                </span>
              </div>
              
              <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                <p style={{ margin: 0 }}><strong>Campo:</strong> <span className="admin-table-status" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{audit.fieldChanged ?? 'n/a'}</span></p>
                <div style={{ marginTop: '12px', display: 'grid', gap: '4px' }}>
                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="admin-kicker" style={{ fontSize: '0.65rem', minWidth: '40px' }}>De:</span>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{audit.oldValue ?? 'vazio'}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="admin-kicker" style={{ fontSize: '0.65rem', minWidth: '40px' }}>Para:</span>
                      <span style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 600 }}>{audit.newValue ?? 'vazio'}</span>
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(17, 24, 39, 0.05)' }}>
                 <span className="admin-kicker" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                  Alterado por <strong>{audit.changer.name}</strong> em {new Date(audit.changedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
