'use client';

import { useEffect, useState } from 'react';
import { ScoringConfigSummary, adminGetScoringConfig } from '../../lib';

export default function AdminConfiguracoesPage() {
  const [rows, setRows] = useState<ScoringConfigSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminGetScoringConfig());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar configuracoes');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Configuracoes</span>
        <h1>Pontuacao e regras</h1>
        <p>Visualizacao da tabela de pontuacao atualmente aplicada pelo motor de resultados.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando configuracoes...</p> : null}
        {!loading && rows.length === 0 ? <div className="card empty-state"><strong>Nenhuma configuracao cadastrada.</strong></div> : null}
        {!loading ? (
          <div className="review-grid">
            {rows.map((row) => (
              <article key={row.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{row.category}</h3>
                    <small>Posicao {row.position}</small>
                  </div>
                  <span className="status-pill active">{row.points} pts</span>
                </div>
                <p>Atualizado por: {row.updatedByUser.name}</p>
                <p>{row.updatedByUser.email}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
