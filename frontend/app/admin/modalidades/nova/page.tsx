'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateSportInput, adminCreateSport } from '../../../lib';

const categories: CreateSportInput['category'][] = [
  'coletiva',
  'individual',
  'dupla',
  'fitness',
];

export default function AdminNovaModalidadePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CreateSportInput['category']>('coletiva');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [isAldebarun, setIsAldebarun] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await adminCreateSport({
        name,
        category,
        description: description || undefined,
        isAldebarun,
        isActive,
        scheduleDate: scheduleDate ? new Date(scheduleDate).toISOString() : undefined,
        scheduleNotes: scheduleNotes || undefined,
      });
      router.push('/admin/modalidades');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Falha ao criar modalidade',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Competicao</span>
          <h1>Nova modalidade</h1>
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
             <h2>Configuracao da Prova</h2>
             <p>Cadastre novas provas e mantenha a agenda do evento atualizada.</p>
          </div>
          <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome da modalidade</span>
              <input 
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="Ex: Futebol Society"
              />
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Categoria</span>
              <select 
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={category} 
                onChange={(event) => setCategory(event.target.value as CreateSportInput['category'])}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Descricao (opcional)</span>
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
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Notas de agenda</span>
              <input 
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={scheduleNotes} 
                onChange={(event) => setScheduleNotes(event.target.value)} 
                placeholder="Ex: Quadra 2"
              />
            </label>
            
            <div className="field-span admin-status-stack" style={{ marginTop: '10px' }}>
              <label className="checkbox-row" style={{ background: 'rgba(17,24,39,0.03)', padding: '12px', borderRadius: '10px' }}>
                <input type="checkbox" checked={isAldebarun} onChange={(event) => setIsAldebarun(event.target.checked)} />
                <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Esta modalidade pertence ao <strong>ALDEBARUN</strong></span>
              </label>
              <label className="checkbox-row" style={{ background: 'rgba(17,24,39,0.03)', padding: '12px', borderRadius: '10px', marginTop: '8px' }}>
                <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
                <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Modalidade <strong>ativa</strong> para inscricao e operacao</span>
              </label>
            </div>

            <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
              <button 
                className="admin-quick-action" 
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="submit" 
                disabled={submitting || name.trim().length < 2}
              >
                {submitting ? 'Salvando...' : 'Criar modalidade'}
              </button>
              <a className="admin-topbar-actions a" style={{ minHeight: '40px', padding: '0 20px' }} href="/admin/modalidades">
                Cancelar
              </a>
            </div>
          </form>
        </section>

        <section className="admin-panel">
           <div className="admin-panel-header">
             <h2>Contexto</h2>
           </div>
           <p className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem', color: '#4b5563' }}>
             Modalidades sao o nucleo da competicao. Cada modalidade deve pertencer a uma categoria (coletiva, individual, etc) para o calculo correto do ranking.
           </p>
           <p className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem', color: '#4b5563', marginTop: '12px' }}>
             O flag <strong>ALDEBARUN</strong> indica que a prova faz parte do modulo especial de integracao.
           </p>
        </section>
      </div>
    </div>
  );
}
