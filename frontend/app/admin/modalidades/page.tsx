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
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Modalidades</span>
        <h1>Gestao de modalidades</h1>
        <p>Resumo operacional das modalidades e da quantidade de resultados ja lancados.</p>
        <div className="cta-row">
          <a className="button primary" href="/admin/modalidades/nova">
            Nova modalidade
          </a>
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>
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
                {editingId === sport.id ? (
                  <div className="form-grid">
                    <label>
                      <span>Nome</span>
                      <input value={sportName} onChange={(event) => setSportName(event.target.value)} />
                    </label>
                    <label className="field-span">
                      <span>Descricao</span>
                      <input value={description} onChange={(event) => setDescription(event.target.value)} />
                    </label>
                    <label>
                      <span>Data/hora</span>
                      <input type="datetime-local" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
                    </label>
                    <label className="field-span">
                      <span>Notas</span>
                      <input value={scheduleNotes} onChange={(event) => setScheduleNotes(event.target.value)} />
                    </label>
                    <label className="checkbox-row field-span">
                      <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
                      <span>Modalidade ativa</span>
                    </label>
                  </div>
                ) : null}
                <div className="cta-row">
                  <a className="button secondary" href={`/admin/modalidades/${sport.id}`}>
                    Ver detalhes
                  </a>
                  {editingId === sport.id ? (
                    <>
                      <button className="button primary" type="button" onClick={() => saveSport(sport.id)}>
                        Salvar
                      </button>
                      <button className="button secondary" type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="button secondary"
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
                        className="button secondary"
                        type="button"
                        onClick={() => deleteSport(sport.id)}
                        disabled={deletingId === sport.id}
                      >
                        {deletingId === sport.id ? 'Removendo...' : 'Excluir'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
