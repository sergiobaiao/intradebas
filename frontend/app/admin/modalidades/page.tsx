'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ResultSummary,
  SportSummary,
  adminDeleteSport,
  adminFetchJson,
  adminUpdateSport,
} from '../../lib';

export default function AdminModalidadesPage() {
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sportName, setSportName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

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

  async function saveSport(sportId: string) {
    setError(null);
    try {
      const updated = await adminUpdateSport(sportId, {
        name: sportName || undefined,
        description: description || undefined,
        isActive,
        scheduleDate: scheduleDate ? new Date(scheduleDate).toISOString() : undefined,
        scheduleNotes: scheduleNotes || undefined,
      });
      setSports((current) =>
        current.map((sport) => (sport.id === sportId ? { ...sport, ...updated } : sport)),
      );
      setEditingId(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar modalidade');
    }
  }

  async function deleteSport(sportId: string) {
    if (!confirm('Tem certeza que deseja excluir esta modalidade?')) return;
    setDeletingId(sportId);
    setError(null);

    try {
      await adminDeleteSport(sportId);
      setSports((current) => current.filter((sport) => sport.id !== sportId));
      setResults((current) => current.filter((result) => result.sport.id !== sportId));
      if (editingId === sportId) {
        setEditingId(null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Falha ao excluir modalidade',
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Modalidades</h1>
        </div>
        <div className="admin-topbar-actions">
          <a className="admin-quick-action" style={{ minHeight: '38px', padding: '0 14px' }} href="/admin/modalidades/nova">
            Nova modalidade
          </a>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <p className="admin-kicker" style={{ textTransform: 'none' }}>
          Resumo operacional das modalidades, categorias e quantidade de resultados ja lancados no sistema.
        </p>
      </section>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
          <span>Buscando registros de modalidades no sistema.</span>
        </div>
      ) : null}

      {!loading && summaries.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Nenhuma modalidade cadastrada.</strong>
          <span>Clique em "Nova modalidade" para comecar.</span>
        </div>
      ) : null}

      {!loading && summaries.length > 0 ? (
        <div className="review-grid">
          {summaries.map((sport) => (
            <article key={sport.id} className="admin-panel" style={{ padding: '18px' }}>
              <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem' }}>{sport.name}</h2>
                  <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>{sport.category}</span>
                </div>
                <span className={`admin-table-status ${sport.isActive === false ? 'rejected' : 'active'}`} style={{ background: sport.isActive === false ? 'rgba(230, 57, 70, 0.1)' : 'rgba(45, 106, 79, 0.1)', color: sport.isActive === false ? '#e63946' : '#2d6a4f' }}>
                  {sport.isActive === false ? 'Inativa' : 'Ativa'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                  <strong>Resultados:</strong> {sport.resultCount} lancados
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                  <strong>ALDEBARUN:</strong> {sport.isAldebarun ? 'Sim' : 'Nao'}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <strong>Agenda:</strong> {sport.scheduleDate ? new Date(sport.scheduleDate).toLocaleString('pt-BR') : 'Nao definida'}
                </p>
              </div>

              {editingId === sport.id ? (
                <div className="form-grid" style={{ marginTop: 0, marginBottom: '16px', gap: '10px' }}>
                  <label className="field-span">
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome</span>
                    <input style={{ minHeight: '36px', borderRadius: '8px' }} value={sportName} onChange={(event) => setSportName(event.target.value)} />
                  </label>
                  <label className="field-span">
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Descricao</span>
                    <input style={{ minHeight: '36px', borderRadius: '8px' }} value={description} onChange={(event) => setDescription(event.target.value)} />
                  </label>
                  <label>
                    <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data/hora</span>
                    <input type="datetime-local" style={{ minHeight: '36px', borderRadius: '8px' }} value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
                  </label>
                  <label className="checkbox-row" style={{ alignSelf: 'center' }}>
                    <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
                    <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Ativa</span>
                  </label>
                </div>
              ) : null}

              <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                <a className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }} href={`/admin/modalidades/${sport.id}`}>
                  Ver detalhes
                </a>
                {editingId === sport.id ? (
                  <>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', background: '#111827', color: '#fff' }} type="button" onClick={() => saveSport(sport.id)}>
                      Salvar
                    </button>
                    <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }} type="button" onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-topbar-actions a"
                      style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                      type="button"
                      onClick={() => {
                        setEditingId(sport.id);
                        setSportName(sport.name);
                        setDescription(sport.description ?? '');
                        setScheduleDate(
                          sport.scheduleDate
                            ? new Date(sport.scheduleDate).toISOString().slice(0, 16)
                            : '',
                        );
                        setScheduleNotes(sport.scheduleNotes ?? '');
                        setIsActive(sport.isActive !== false);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-topbar-actions a"
                      style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                      type="button"
                      onClick={() => deleteSport(sport.id)}
                      disabled={deletingId === sport.id}
                    >
                      {deletingId === sport.id ? '...' : 'Excluir'}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
