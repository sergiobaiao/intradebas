'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [minParticipants, setMinParticipants] = useState('1');
  const [maxParticipants, setMaxParticipants] = useState('');
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
        minParticipants: minParticipants ? Number(minParticipants) : undefined,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
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
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Competicao"
        title="Nova modalidade"
        description="Cadastre novas provas e mantenha a agenda do evento atualizada."
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface title="Configuracao da prova">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Nome da modalidade">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex: Futebol Society"
                />
              </AdminField>

              <AdminField label="Categoria">
                <Select value={category} onValueChange={(value) => setCategory(value as CreateSportInput['category'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminField>
            </div>

            <AdminField label="Descricao (opcional)">
              <Input value={description} onChange={(event) => setDescription(event.target.value)} />
            </AdminField>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Minimo de participantes">
                <Input
                  type="number"
                  min="1"
                  value={minParticipants}
                  onChange={(event) => setMinParticipants(event.target.value)}
                />
              </AdminField>
              <AdminField label="Maximo de participantes">
                <Input
                  type="number"
                  min="1"
                  value={maxParticipants}
                  onChange={(event) => setMaxParticipants(event.target.value)}
                  placeholder="Sem limite"
                />
              </AdminField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Data/hora prevista">
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(event) => setScheduleDate(event.target.value)}
                />
              </AdminField>
              <AdminField label="Notas de agenda">
                <Input
                  value={scheduleNotes}
                  onChange={(event) => setScheduleNotes(event.target.value)}
                  placeholder="Ex: Quadra 2"
                />
              </AdminField>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" checked={isAldebarun} onChange={(event) => setIsAldebarun(event.target.checked)} />
              Esta modalidade pertence ao <strong>ALDEBARUN</strong>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
              Modalidade <strong>ativa</strong> para inscricao e operacao
            </label>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={submitting || name.trim().length < 2}>
                {submitting ? 'Salvando...' : 'Criar modalidade'}
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/modalidades">Cancelar</a>
              </Button>
            </div>
          </form>
        </AdminSurface>

        <AdminSurface title="Contexto">
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Modalidades sao o nucleo da competicao. Cada modalidade deve pertencer a uma categoria para o calculo correto do ranking.
            </p>
            <p>
              O flag <strong>ALDEBARUN</strong> indica que a prova faz parte do modulo especial de integracao.
            </p>
            <p>
              Limites minimo e maximo controlam a capacidade operacional das inscricoes em cada modalidade.
            </p>
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}
