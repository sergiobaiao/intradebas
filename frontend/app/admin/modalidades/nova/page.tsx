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
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Modalidades</span>
        <h1>Nova modalidade</h1>
        <p>Cadastre novas provas e mantenha a agenda do evento atualizada sem editar o banco manualmente.</p>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span>Categoria</span>
              <select value={category} onChange={(event) => setCategory(event.target.value as CreateSportInput['category'])}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span">
              <span>Descricao</span>
              <input value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <label>
              <span>Data/hora</span>
              <input type="datetime-local" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
            </label>
            <label>
              <span>Notas de agenda</span>
              <input value={scheduleNotes} onChange={(event) => setScheduleNotes(event.target.value)} />
            </label>
            <label className="checkbox-row field-span">
              <input type="checkbox" checked={isAldebarun} onChange={(event) => setIsAldebarun(event.target.checked)} />
              <span>Esta modalidade pertence ao ALDEBARUN</span>
            </label>
            <label className="checkbox-row field-span">
              <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
              <span>Modalidade ativa para inscricao/operacao</span>
            </label>
            <div className="field-span cta-row">
              <a className="button secondary" href="/admin/modalidades">
                Cancelar
              </a>
              <button className="button primary" type="submit" disabled={submitting || name.trim().length < 2}>
                {submitting ? 'Salvando...' : 'Criar modalidade'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
