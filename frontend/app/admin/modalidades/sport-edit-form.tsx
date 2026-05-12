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
    <div className="admin-content-grid" style={{ gridTemplateColumns: '1fr 0.6fr', alignItems: 'start' }}>
      <section className="admin-panel">
        <div className="admin-panel-header">
           <h2>Configuracao da Prova</h2>
           <p>Ajuste os dados operacionais e de agenda da modalidade.</p>
        </div>

        {error ? (
          <div style={{ marginBottom: '20px' }}>
            <p className="error-text">{error}</p>
          </div>
        ) : null}
        {message ? (
          <div style={{ marginBottom: '20px' }}>
            <p className="success-text">{message}</p>
          </div>
        ) : null}

        <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
          <label className="field-span">
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field-span">
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Descricao</span>
            <input
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data/hora prevista</span>
            <input
              style={{ minHeight: '40px', borderRadius: '10px' }}
              type="datetime-local"
              value={scheduleDate}
              onChange={(event) => setScheduleDate(event.target.value)}
            />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Local / Notas</span>
            <input
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={scheduleNotes}
              onChange={(event) => setScheduleNotes(event.target.value)}
            />
          </label>
          
          <div className="field-span admin-status-stack" style={{ marginTop: '10px' }}>
            <label className="checkbox-row" style={{ background: 'rgba(17,24,39,0.03)', padding: '12px', borderRadius: '10px' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Modalidade <strong>ativa</strong> para inscricao e operacao</span>
            </label>
          </div>

          <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
            <button className="admin-quick-action" style={{ minHeight: '40px', padding: '0 30px' }} type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
            <button
              className="admin-topbar-actions a"
              style={{ minHeight: '40px', padding: '0 20px', borderColor: 'rgba(230, 57, 70, 0.2)' }}
              type="button"
              onClick={handleDelete}
              disabled={deleting || submitting}
            >
              {deleting ? 'Removendo...' : 'Excluir modalidade'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel">
         <div className="admin-panel-header">
           <h2>Status Operacional</h2>
         </div>
         <div className="admin-status-stack">
            <div>
              <span>Resultados Lancados</span>
              <strong>{sport.results.length}</strong>
            </div>
         </div>
         <div style={{ marginTop: '22px' }}>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Categoria</span>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#4b5563', textTransform: 'capitalize' }}>
              {sport.category}
            </p>
         </div>
      </section>
    </div>
  );
}
