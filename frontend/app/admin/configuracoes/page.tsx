'use client';

import { useEffect, useState } from 'react';
import {
  CreateScoringConfigInput,
  RankingSettingsSummary,
  ScoringConfigSummary,
  adminCreateScoringConfig,
  adminDeleteScoringConfig,
  adminGetRankingSettings,
  adminGetScoringConfig,
  adminUpdateRankingSettings,
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
  const [rankingSettings, setRankingSettings] = useState<RankingSettingsSummary | null>(null);
  const [tieBreakRule, setTieBreakRule] = useState<RankingSettingsSummary['tieBreakRule']>('most_wins');
  const [savingTieBreak, setSavingTieBreak] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedRows, loadedRankingSettings] = await Promise.all([
        adminGetScoringConfig(),
        adminGetRankingSettings(),
      ]);
      setRows(loadedRows);
      setRankingSettings(loadedRankingSettings);
      setTieBreakRule(loadedRankingSettings.tieBreakRule);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar configuracoes');
    } finally {
      setLoading(false);
    }
  }

  async function saveTieBreakRule() {
    setSavingTieBreak(true);
    setError(null);

    try {
      const updated = await adminUpdateRankingSettings({ tieBreakRule });
      setRankingSettings(updated);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar regra de desempate');
    } finally {
      setSavingTieBreak(false);
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
    if (!confirm('Tem certeza que deseja remover esta regra?')) return;
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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Configuracoes do Sistema</span>
          <h1>Pontuacao e regras</h1>
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
             <h2>Regra de desempate do ranking</h2>
          </div>
          <div className="form-grid" style={{ marginTop: 0 }}>
            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Criterio principal em caso de empate por pontos</span>
              <select
                style={{ minHeight: '38px', borderRadius: '10px' }}
                value={tieBreakRule}
                onChange={(event) =>
                  setTieBreakRule(event.target.value as RankingSettingsSummary['tieBreakRule'])
                }
              >
                <option value="most_wins">Maior numero de vitorias</option>
                <option value="most_podiums">Maior numero de podios</option>
                <option value="alphabetical">Ordem alfabetica</option>
              </select>
            </label>
            <div className="field-span" style={{ color: '#4b5563', fontSize: '0.9rem' }}>
              {rankingSettings?.updatedByUser ? (
                <span>
                  Ultima definicao por <strong>{rankingSettings.updatedByUser.name}</strong> em{' '}
                  {new Date(rankingSettings.updatedAt).toLocaleString('pt-BR')}
                </span>
              ) : (
                <span>Sem definicao persistida; o sistema usa maior numero de vitorias como padrao.</span>
              )}
            </div>
            <div className="admin-topbar-actions field-span" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
              <button
                className="admin-quick-action"
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="button"
                onClick={() => void saveTieBreakRule()}
                disabled={savingTieBreak}
              >
                {savingTieBreak ? 'Salvando...' : 'Salvar regra de desempate'}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Nova regra de pontuacao</h2>
          </div>
          <div className="form-grid" style={{ marginTop: 0 }}>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Categoria</span>
              <select
                style={{ minHeight: '38px', borderRadius: '10px' }}
                value={newCategory}
                onChange={(event) =>
                  setNewCategory(event.target.value as CreateScoringConfigInput['category'])
                }
              >
                <option value="coletiva">Coletiva</option>
                <option value="individual">Individual</option>
                <option value="dupla">Dupla</option>
                <option value="fitness">Fitness</option>
              </select>
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Posicao</span>
              <input
                style={{ minHeight: '38px', borderRadius: '10px' }}
                value={newPosition}
                onChange={(event) => setNewPosition(event.target.value)}
                type="number"
                min={1}
              />
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Pontos</span>
              <input
                style={{ minHeight: '38px', borderRadius: '10px' }}
                value={newPoints}
                onChange={(event) => setNewPoints(event.target.value)}
                type="number"
                min={0}
              />
            </label>
            <div className="admin-topbar-actions field-span" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
              <button
                className="admin-quick-action"
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="button"
                onClick={() => void createRow()}
                disabled={creating}
              >
                {creating ? 'Criando...' : 'Criar regra'}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Regras Ativas</h2>
          </div>
          <div className="admin-status-stack">
             <div>
               <span>Total de Regras</span>
               <strong>{rows.length}</strong>
             </div>
             <div>
               <span>Categorias</span>
               <strong>{new Set(rows.map(r => r.category)).size}</strong>
             </div>
             <div>
               <span>Desempate ativo</span>
               <strong>
                 {tieBreakRule === 'most_wins'
                   ? 'Vitorias'
                   : tieBreakRule === 'most_podiums'
                     ? 'Podios'
                     : 'Alfabetico'}
               </strong>
             </div>
          </div>
        </section>
      </div>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Nenhuma regra cadastrada.</strong>
          <span>Defina a pontuacao para as categorias acima.</span>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <div className="review-grid">
          {rows.map((row) => (
            <article key={row.id} className="admin-panel" style={{ padding: '18px', background: '#fcfcfc' }}>
              <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, textTransform: 'capitalize' }}>{row.category}</h3>
                  <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>Posicao {row.position}º</span>
                </div>
                <span className="admin-table-status success" style={{ background: 'rgba(45, 106, 79, 0.1)', color: '#2d6a4f', fontSize: '1.1rem', fontWeight: 800 }}>
                  {row.points} pts
                </span>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                 <span className="admin-kicker" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                  Ultima atualizacao por <strong>{row.updatedByUser.name}</strong>
                </span>
              </div>

              {editingId === row.id ? (
                <div className="form-grid" style={{ marginTop: 0, marginBottom: '16px', gap: '10px' }}>
                  <label className="field-span">
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nova pontuacao</span>
                    <input 
                      style={{ minHeight: '34px', borderRadius: '8px', fontSize: '0.85rem' }} 
                      value={points} 
                      onChange={(event) => setPoints(event.target.value)} 
                      type="number" 
                      min={0} 
                    />
                  </label>
                  <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.85rem', background: '#111827', color: '#fff' }} type="button" onClick={() => saveRow(row.id)}>
                      Salvar
                    </button>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.85rem' }} type="button" onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                  <button
                    className="admin-topbar-actions a"
                    style={{ minHeight: '30px', padding: '0 10px', fontSize: '0.8rem' }}
                    type="button"
                    onClick={() => {
                      setEditingId(row.id);
                      setPoints(String(row.points));
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="admin-topbar-actions a"
                    style={{ minHeight: '30px', padding: '0 10px', fontSize: '0.8rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                    type="button"
                    onClick={() => deleteRow(row.id)}
                    disabled={deletingId === row.id}
                  >
                    {deletingId === row.id ? '...' : 'Remover'}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
