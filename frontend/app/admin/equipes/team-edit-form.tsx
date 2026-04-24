'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AthleteSummary,
  TeamDetailSummary,
  adminDeleteTeam,
  adminUpdateTeam,
} from '../../lib';

type TeamEditFormProps = {
  team: TeamDetailSummary;
  athletes: AthleteSummary[];
};

export function TeamEditForm({ team, athletes }: TeamEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(team.name);
  const [color, setColor] = useState(team.color ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeCount = useMemo(
    () => athletes.filter((athlete) => athlete.status === 'active').length,
    [athletes],
  );
  const pendingCount = useMemo(
    () => athletes.filter((athlete) => athlete.status === 'pending').length,
    [athletes],
  );
  const representedSports = useMemo(
    () =>
      Array.from(
        new Set(athletes.flatMap((athlete) => athlete.sports.map((sport) => sport.name))),
      ),
    [athletes],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await adminUpdateTeam(team.id, {
        name: name || undefined,
        color: color || undefined,
      });
      setMessage('Equipe atualizada com sucesso.');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao atualizar equipe');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    setMessage(null);

    try {
      await adminDeleteTeam(team.id);
      router.push('/admin/equipes');
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao excluir equipe');
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="card" style={{ marginTop: '24px' }}>
        <h2>Resumo operacional</h2>
        <p>Total de atletas: {athletes.length}</p>
        <p>Ativos: {activeCount}</p>
        <p>Pendentes: {pendingCount}</p>
        <p>Modalidades: {representedSports.join(', ') || 'Nenhuma'}</p>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2>Editar equipe</h2>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>Cor</span>
            <input value={color} onChange={(event) => setColor(event.target.value)} />
          </label>
          <div className="field-span cta-row">
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={handleDelete}
              disabled={deleting || submitting}
            >
              {deleting ? 'Removendo...' : 'Excluir equipe'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
