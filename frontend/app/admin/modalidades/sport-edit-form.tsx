'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SportDetailSummary,
  adminDeleteSport,
  adminUpdateSport,
} from '../../lib';

type SportEditFormProps = {
  sport: SportDetailSummary;
};

export function SportEditForm({ sport }: SportEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(sport.name);
  const [description, setDescription] = useState(sport.description ?? '');
  const [scheduleDate, setScheduleDate] = useState(
    sport.scheduleDate ? new Date(sport.scheduleDate).toISOString().slice(0, 16) : '',
  );
  const [scheduleNotes, setScheduleNotes] = useState(sport.scheduleNotes ?? '');
  const [isActive, setIsActive] = useState(sport.isActive !== false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await adminUpdateSport(sport.id, {
        name,
        description: description || undefined,
        isActive,
        scheduleDate: scheduleDate ? new Date(scheduleDate).toISOString() : undefined,
        scheduleNotes: scheduleNotes || undefined,
      });
      setMessage('Modalidade atualizada com sucesso.');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao atualizar modalidade',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    setMessage(null);

    try {
      await adminDeleteSport(sport.id);
      router.push('/admin/modalidades');
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Falha ao excluir modalidade',
      );
      setDeleting(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h2>Editar modalidade</h2>
      {error ? <p className="error-text">{error}</p> : null}
      {message ? <p className="success-text">{message}</p> : null}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Nome</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field-span">
          <span>Descricao</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          <span>Data/hora</span>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(event) => setScheduleDate(event.target.value)}
          />
        </label>
        <label className="field-span">
          <span>Notas</span>
          <input
            value={scheduleNotes}
            onChange={(event) => setScheduleNotes(event.target.value)}
          />
        </label>
        <label className="checkbox-row field-span">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          <span>Modalidade ativa</span>
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
            {deleting ? 'Removendo...' : 'Excluir modalidade'}
          </button>
        </div>
      </form>
    </div>
  );
}
