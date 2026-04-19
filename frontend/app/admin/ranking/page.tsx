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

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Ranking</span>
        <h1>Placar consolidado</h1>
        <p>Ranking das equipes combinado com os logs mais recentes que impactaram resultados.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando ranking...</p> : null}
        {!loading ? (
          <>
            <div className="ranking-list">
              {ranking.map((team, index) => (
                <div key={team.id} className="ranking-item">
                  <div>
                    <strong>#{index + 1} {team.name}</strong>
                    <div>{team.color ?? 'Sem cor definida'}</div>
                  </div>
                  <strong>{team.totalScore} pts</strong>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Ultimas alteracoes auditadas</h2>
              {auditLogs.length === 0 ? <p>Nenhuma alteracao auditada ainda.</p> : (
                <div className="review-grid">
                  {auditLogs.slice(0, 6).map((audit) => (
                    <article key={audit.id} className="card review-card">
                      <h3>{audit.result.sport.name}</h3>
                      <p>{audit.fieldChanged}: {audit.oldValue ?? 'vazio'} → {audit.newValue ?? 'vazio'}</p>
                      <p>{audit.changer.name}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
