'use client';

import { useEffect, useState } from 'react';
import {
  CreateScoringConfigInput,
  ScoringConfigSummary,
  adminCreateScoringConfig,
  adminDeleteScoringConfig,
  adminGetScoringConfig,
  adminUpdateScoringConfig,
} from '../../lib';

export default function AdminConfiguracoesPage() {
  const [rows, setRows] = useState<ScoringConfigSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [points, setPoints] = useState('');
  const [newCategory, setNewCategory] = useState<CreateScoringConfigInput['category']>('coletiva');
  const [newPosition, setNewPosition] = useState('1');
  const [newPoints, setNewPoints] = useState('0');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function createRow() {
    setCreating(true);
    setError(null);

    try {
      const created = await adminCreateScoringConfig({
        category: newCategory,
        position: Number(newPosition),
        points: Number(newPoints),
      });
      setRows((current) =>
        [...current, created].sort((left, right) => {
          if (left.category === right.category) {
            return left.position - right.position;
          }

          return left.category.localeCompare(right.category);
        }),
      );
      setNewPosition('1');
      setNewPoints('0');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Falha ao criar configuracao');
    } finally {
      setCreating(false);
    }
  }

  async function deleteRow(rowId: string) {
    setDeletingId(rowId);
    setError(null);

    try {
      await adminDeleteScoringConfig(rowId);
      setRows((current) => current.filter((row) => row.id !== rowId));
      if (editingId === rowId) {
        setEditingId(null);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao remover configuracao');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Configuracoes</span>
        <h1>Pontuacao e regras</h1>
        <p>Visualizacao da tabela de pontuacao atualmente aplicada pelo motor de resultados.</p>
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2>Nova regra de pontuacao</h2>
          <div className="form-grid">
            <label>
              Categoria
              <select
                value={newCategory}
                onChange={(event) =>
                  setNewCategory(event.target.value as CreateScoringConfigInput['category'])
                }
              >
                <option value="coletiva">coletiva</option>
                <option value="individual">individual</option>
                <option value="dupla">dupla</option>
                <option value="fitness">fitness</option>
              </select>
            </label>
            <label>
              Posicao
              <input
                value={newPosition}
                onChange={(event) => setNewPosition(event.target.value)}
                type="number"
                min={1}
              />
            </label>
            <label>
              Pontos
              <input
                value={newPoints}
                onChange={(event) => setNewPoints(event.target.value)}
                type="number"
                min={0}
              />
            </label>
            <div className="cta-row">
              <button
                className="button primary"
                type="button"
                onClick={() => createRow()}
                disabled={creating}
              >
                {creating ? 'Criando...' : 'Criar regra'}
              </button>
            </div>
          </div>
        </div>
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
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => deleteRow(row.id)}
                      disabled={deletingId === row.id}
                    >
                      {deletingId === row.id ? 'Removendo...' : 'Remover'}
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
