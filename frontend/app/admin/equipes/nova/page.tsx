'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminCreateTeam } from '../../../lib';

export default function AdminNovaEquipePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1f6feb');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await adminCreateTeam({
        name,
        color: color || undefined,
      });
      router.push('/admin/equipes');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao criar equipe');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Equipes</span>
        <h1>Nova equipe</h1>
        <p>Crie uma equipe administrativa com nome e cor base para o placar.</p>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Nome da equipe</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span>Cor base</span>
              <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
            </label>
            <div className="field-span cta-row">
              <a className="button secondary" href="/admin/equipes">
                Cancelar
              </a>
              <button className="button primary" type="submit" disabled={submitting || name.trim().length < 2}>
                {submitting ? 'Salvando...' : 'Criar equipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
