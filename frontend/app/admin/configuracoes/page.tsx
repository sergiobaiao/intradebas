'use client';

import { useEffect, useState } from 'react';
import { ScoringConfigSummary, adminGetScoringConfig, adminUpdateScoringConfig } from '../../lib';

export default function AdminConfiguracoesPage() {
  const [rows, setRows] = useState<ScoringConfigSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [points, setPoints] = useState('');

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

  async function saveRow(rowId: string) {
    setError(null);
    try {
      const updated = await adminUpdateScoringConfig(rowId, Number(points));
      setRows((current) => current.map((row) => (row.id === rowId ? updated : row)));
      setEditingId(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar configuracao');
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
                {editingId === row.id ? (
                  <div className="cta-row">
                    <input value={points} onChange={(event) => setPoints(event.target.value)} type="number" min={0} />
                    <button className="button primary" type="button" onClick={() => saveRow(row.id)}>
                      Salvar
                    </button>
                    <button className="button secondary" type="button" onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="cta-row">
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => {
                        setEditingId(row.id);
                        setPoints(String(row.points));
                      }}
                    >
                      Editar pontuacao
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
