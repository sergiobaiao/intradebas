'use client';

import { useEffect, useState } from 'react';
import {
  AthleteSummary,
  adminFetchJson,
  adminUpdateAthleteStatus,
} from '../../lib';

export default function AdminAthletesPage() {
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  useEffect(() => {
    void loadAthletes();
  }, []);

  async function loadAthletes() {
    setLoading(true);
    setError(null);

    try {
      const response = await adminFetchJson<AthleteSummary[]>('/athletes/admin/review');
      setAthletes(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar atletas');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(athleteId: string, status: 'active' | 'rejected') {
    setPendingActionId(athleteId);
    setError(null);

    try {
      const updated = await adminUpdateAthleteStatus(athleteId, status);
      setAthletes((current) =>
        current.map((athlete) => (athlete.id === athleteId ? updated : athlete)),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar atleta');
    } finally {
      setPendingActionId(null);
    }
  }

  const pendingAthletes = athletes.filter((athlete) => athlete.status === 'pending');

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Atletas</span>
        <h1>Revisao de inscricoes</h1>
        <p>Fluxo administrativo para aprovacao e rejeicao de atletas pendentes.</p>

        <div className="cta-row">
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        {loading ? <p>Carregando atletas...</p> : null}

        {!loading && pendingAthletes.length === 0 ? (
          <div className="card empty-state">
            <strong>Nenhum atleta pendente.</strong>
            <span>Todas as inscricoes pendentes ja foram revisadas.</span>
          </div>
        ) : null}

        {!loading ? (
          <div className="review-grid">
            {athletes.map((athlete) => (
              <article key={athlete.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{athlete.name}</h3>
                    <small>
                      {athlete.team?.name ?? 'Sem equipe'} · status {athlete.status}
                    </small>
                  </div>
                  <span className={`status-pill ${athlete.status}`}>{athlete.status}</span>
                </div>

                <p>CPF: {athlete.cpf}</p>
                <p>
                  Modalidades:{' '}
                  {athlete.sports.map((sport) => sport.name).join(', ') || 'Nenhuma'}
                </p>

                {athlete.status === 'pending' ? (
                  <div className="cta-row">
                    <button
                      className="button primary"
                      disabled={pendingActionId === athlete.id}
                      onClick={() => updateStatus(athlete.id, 'active')}
                      type="button"
                    >
                      Aprovar
                    </button>
                    <button
                      className="button secondary"
                      disabled={pendingActionId === athlete.id}
                      onClick={() => updateStatus(athlete.id, 'rejected')}
                      type="button"
                    >
                      Rejeitar
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}

