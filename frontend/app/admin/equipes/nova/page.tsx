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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Nova equipe</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <div className="admin-content-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Informacoes da Equipe</h2>
             <p>Crie uma equipe administrativa com nome e cor base para o placar.</p>
          </div>
          <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome da equipe</span>
              <input 
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="Ex: Equipe Alfa"
              />
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
            <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
              <button 
                className="admin-quick-action" 
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="submit" 
                disabled={submitting || name.trim().length < 2}
              >
                {submitting ? 'Salvando...' : 'Criar equipe'}
              </button>
              <a className="admin-topbar-actions a" style={{ minHeight: '40px', padding: '0 20px' }} href="/admin/equipes">
                Cancelar
              </a>
            </div>
          </form>
        </section>

        <section className="admin-panel">
           <div className="admin-panel-header">
             <h2>Visualizacao</h2>
           </div>
           <div style={{ padding: '20px', borderRadius: '12px', border: '2px dashed rgba(17, 24, 39, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: color, marginBottom: '12px', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}></div>
              <strong style={{ fontSize: '1.2rem', color: '#111827' }}>{name || 'Nome da Equipe'}</strong>
              <span className="admin-kicker" style={{ marginTop: '4px' }}>Exemplo de exibicao</span>
           </div>
        </section>
      </div>
    </div>
  );
}
