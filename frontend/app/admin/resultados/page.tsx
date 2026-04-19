'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ResultInput,
  ResultSummary,
  SportSummary,
  TeamSummary,
  adminCreateResult,
  adminFetchJson,
  adminUpdateResult,
} from '../../lib';

function toDatetimeLocalInput(value: string) {
  return value.slice(0, 16);
}

export default function AdminResultadosPage() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [sportId, setSportId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [position, setPosition] = useState(1);
  const [rawScore, setRawScore] = useState('');
  const [resultDate, setResultDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [loadedResults, loadedTeams, loadedSports] = await Promise.all([
        adminFetchJson<ResultSummary[]>('/results'),
        adminFetchJson<TeamSummary[]>('/teams'),
        adminFetchJson<SportSummary[]>('/sports'),
      ]);

      setResults(loadedResults);
      setTeams(loadedTeams);
      setSports(loadedSports);
      setSportId((current) => current || loadedSports[0]?.id || '');
      setTeamId((current) => current || loadedTeams[0]?.id || '');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar resultados');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setSportId(sports[0]?.id ?? '');
    setTeamId(teams[0]?.id ?? '');
    setPosition(1);
    setRawScore('');
    setResultDate(new Date().toISOString().slice(0, 16));
    setNotes('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const payload: ResultInput = {
      sportId,
      teamId,
      position,
      rawScore: rawScore ? Number(rawScore) : undefined,
      resultDate: new Date(resultDate).toISOString(),
      notes: notes || undefined,
    };

    try {
      if (editingId) {
        const updated = await adminUpdateResult(editingId, payload);
        setResults((current) =>
          current.map((result) => (result.id === editingId ? updated : result)),
        );
        setMessage('Resultado corrigido com sucesso.');
      } else {
        const created = await adminCreateResult(payload);
        setResults((current) => [created, ...current]);
        setMessage('Resultado lancado com sucesso.');
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao salvar resultado');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(result: ResultSummary) {
    setEditingId(result.id);
    setSportId(result.sport.id);
    setTeamId(result.team.id);
    setPosition(result.position);
    setRawScore(result.rawScore != null ? String(result.rawScore) : '');
    setResultDate(toDatetimeLocalInput(result.resultDate));
    setNotes(result.notes ?? '');
    setMessage(null);
    setError(null);
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Resultados</span>
        <h1>Lancamento e correcao de resultados</h1>
        <p>Use este painel para registrar resultados e corrigir operacoes antes do fechamento do placar.</p>

        <div className="cta-row">
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}

        <div className="card" style={{ marginTop: '24px' }}>
          <h2>{editingId ? 'Corrigir resultado' : 'Novo resultado'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Modalidade</span>
              <select value={sportId} onChange={(event) => setSportId(event.target.value)}>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Equipe</span>
              <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Posicao</span>
              <input
                min={1}
                type="number"
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
              />
            </label>

            <label>
              <span>Pontuacao bruta</span>
              <input
                type="number"
                value={rawScore}
                onChange={(event) => setRawScore(event.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label>
              <span>Data e hora</span>
              <input
                type="datetime-local"
                value={resultDate}
                onChange={(event) => setResultDate(event.target.value)}
              />
            </label>

            <label className="field-span">
              <span>Observacoes</span>
              <input value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>

            <div className="field-span cta-row">
              <button
                className="button primary"
                type="submit"
                disabled={submitting || !sportId || !teamId || position < 1}
              >
                {submitting ? 'Salvando...' : editingId ? 'Salvar correcao' : 'Lancar resultado'}
              </button>
              {editingId ? (
                <button className="button secondary" type="button" onClick={resetForm}>
                  Cancelar edicao
                </button>
              ) : null}
            </div>
          </form>
        </div>

        {loading ? <p>Carregando resultados...</p> : null}

        {!loading ? (
          <div className="review-grid" style={{ marginTop: '24px' }}>
            {results.map((result) => (
              <article key={result.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{result.sport.name}</h3>
                    <small>{result.team.name}</small>
                  </div>
                  <span className="status-pill active">{result.calculatedPoints ?? 0} pts</span>
                </div>

                <p>Posicao: {result.position}</p>
                <p>Data: {new Date(result.resultDate).toLocaleString('pt-BR')}</p>
                <p>Score bruto: {result.rawScore ?? 'Nao informado'}</p>
                <p>Observacoes: {result.notes ?? 'Sem observacoes'}</p>

                <div className="cta-row">
                  <button className="button secondary" type="button" onClick={() => startEdit(result)}>
                    Corrigir
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
