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
    <div className="admin-content-grid" style={{ gridTemplateColumns: '1fr 0.6fr', alignItems: 'start' }}>
      <section className="admin-panel">
        <div className="admin-panel-header">
           <h2>Configuracao da Equipe</h2>
           <p>Ajuste nome e identificacao visual no placar.</p>
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
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome da equipe</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Cor base</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <input 
                  type="color" 
                  style={{ width: '40px', height: '40px', padding: '2px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                  value={color} 
                  onChange={(event) => setColor(event.target.value)} 
                />
                <input 
                   style={{ flex: 1, minHeight: '40px', borderRadius: '10px' }}
                   value={color} 
                   onChange={(event) => setColor(event.target.value)} 
                />
            </div>
          </label>
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
              {deleting ? 'Removendo...' : 'Excluir equipe'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
           <h2>Resumo Operacional</h2>
        </div>
        <div className="admin-status-stack">
           <div>
             <span>Atletas Inscritos</span>
             <strong>{athletes.length}</strong>
           </div>
           <div>
             <span>Atletas Ativos</span>
             <strong>{activeCount}</strong>
           </div>
           <div>
             <span>Aguardando Revisao</span>
             <strong>{pendingCount}</strong>
           </div>
        </div>
        <div style={{ marginTop: '22px' }}>
           <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Modalidades Representadas</span>
           <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#4b5563' }}>
             {representedSports.join(', ') || 'Nenhuma modalidade vinculada.'}
           </p>
        </div>
      </section>
    </div>
  );
}
