'use client';

import { useEffect, useState } from 'react';
import { RankingRow, ResultAuditLogSummary, adminFetchJson } from '../../lib';

export default function AdminRankingPage() {
  const [ranking, setRanking] = useState<RankingRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<ResultAuditLogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedRanking, loadedAudit] = await Promise.all([
        adminFetchJson<RankingRow[]>('/results/ranking'),
        adminFetchJson<ResultAuditLogSummary[]>('/results/audit'),
      ]);
      setRanking(loadedRanking);
      setAuditLogs(loadedAudit);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar ranking');
    } finally {
      setLoading(false);
    }
  }

  const maxScore = Math.max(...ranking.map(r => r.totalScore), 1);

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Placar consolidado</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="admin-panel-header">
             <div>
               <h2>Ranking das Equipes</h2>
               <p>Classificacao atualizada em tempo real conforme lancamentos.</p>
             </div>
          </div>
          
          {loading ? (
             <div className="admin-empty-state"><strong>Carregando...</strong></div>
          ) : (
            <div className="admin-team-performance">
              {ranking.map((team, index) => (
                <div key={team.id} className="admin-team-row">
                  <div>
                    <span style={{ background: team.color || '#ccc' }}></span>
                    <strong style={{ fontSize: '1rem' }}>#{index + 1} {team.name}</strong>
                  </div>
                  <div className="admin-score-track">
                    <span style={{ background: team.color || '#ccc', width: `${(team.totalScore / maxScore) * 100}%` }}></span>
                  </div>
                  <em>{team.totalScore} pts</em>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Status do Ranking</h2>
          </div>
          <div className="admin-status-stack">
             <div>
               <span>Total Lancado</span>
               <strong>{ranking.reduce((acc, t) => acc + t.totalScore, 0)}</strong>
             </div>
             <div>
               <span>Lider</span>
               <strong>{ranking[0]?.name || '—'}</strong>
             </div>
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
           <div>
             <h2>Ultimas alteracoes auditadas</h2>
             <p>Acoes administrativas que impactaram o placar.</p>
           </div>
        </div>

        {loading ? (
           <div className="admin-empty-state"><strong>Carregando logs...</strong></div>
        ) : auditLogs.length === 0 ? (
          <div className="admin-empty-state">
            <span>Nenhuma alteracao auditada recentemente.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Modalidade</th>
                  <th>Alteracao</th>
                  <th>Responsavel</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 8).map((audit) => (
                  <tr key={audit.id}>
                    <td><strong>{audit.result.sport.name}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>
                       {audit.fieldChanged}: {audit.oldValue ?? 'vazio'} → <strong>{audit.newValue ?? 'vazio'}</strong>
                    </td>
                    <td>{audit.changer.name}</td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                       {new Date(audit.changedAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
