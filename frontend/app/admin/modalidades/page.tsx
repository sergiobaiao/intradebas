'use client';

import { useEffect, useMemo, useState } from 'react';
import { ResultSummary, SportSummary, adminFetchJson } from '../../lib';

export default function AdminModalidadesPage() {
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedSports, loadedResults] = await Promise.all([
        adminFetchJson<SportSummary[]>('/sports'),
        adminFetchJson<ResultSummary[]>('/results'),
      ]);
      setSports(loadedSports);
      setResults(loadedResults);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  }

  const summaries = useMemo(
    () =>
      sports.map((sport) => ({
        ...sport,
        resultCount: results.filter((result) => result.sport.id === sport.id).length,
      })),
    [results, sports],
  );

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Modalidades</span>
        <h1>Gestao de modalidades</h1>
        <p>Resumo operacional das modalidades e da quantidade de resultados ja lancados.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando modalidades...</p> : null}
        {!loading ? (
          <div className="review-grid">
            {summaries.map((sport) => (
              <article key={sport.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{sport.name}</h3>
                    <small>{sport.category}</small>
                  </div>
                  <span className={`status-pill ${sport.isActive === false ? 'rejected' : 'active'}`}>
                    {sport.isActive === false ? 'inativa' : 'ativa'}
                  </span>
                </div>
                <p>Resultados lancados: {sport.resultCount}</p>
                <p>ALDEBARUN: {sport.isAldebarun ? 'sim' : 'nao'}</p>
                <p>Agenda: {sport.scheduleDate ? new Date(sport.scheduleDate).toLocaleString('pt-BR') : 'Nao definida'}</p>
                <div className="cta-row">
                  <a className="button secondary" href={`/admin/modalidades/${sport.id}`}>
                    Ver detalhes
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
