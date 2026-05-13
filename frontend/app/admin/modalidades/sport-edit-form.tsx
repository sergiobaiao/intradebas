'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { AdminField } from '@/components/admin/field';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [minParticipants, setMinParticipants] = useState(String(sport.minParticipants ?? 1));
  const [maxParticipants, setMaxParticipants] = useState(
    sport.maxParticipants != null ? String(sport.maxParticipants) : '',
  );
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
        minParticipants: minParticipants ? Number(minParticipants) : undefined,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
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
    <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <AdminSurface
        title="Configuracao da prova"
        description="Ajuste os dados operacionais e de agenda da modalidade."
      >
        {error ? <p className="mb-4 text-sm font-medium text-rose-700">{error}</p> : null}
        {message ? <p className="mb-4 text-sm font-medium text-emerald-700">{message}</p> : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <AdminField label="Nome">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </AdminField>
          <AdminField label="Descricao">
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
            <AdminField label="Local / Notas">
              <Input
                value={scheduleNotes}
                onChange={(event) => setScheduleNotes(event.target.value)}
              />
            </AdminField>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
            Modalidade <strong>ativa</strong> para inscricao e operacao
          </label>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleDelete}
              disabled={deleting || submitting}
            >
              {deleting ? 'Removendo...' : 'Excluir modalidade'}
            </Button>
          </div>
        </form>
      </AdminSurface>

      <AdminSurface title="Status operacional">
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Resultados lancados</span>
            <Badge variant="outline">{sport.results.length}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Categoria</span>
            <Badge variant="outline" className="capitalize">
              {sport.category}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Capacidade</span>
            <Badge variant="outline">
              {sport.minParticipants ?? 1} / {sport.maxParticipants ?? 'livre'}
            </Badge>
          </div>
        </div>
      </AdminSurface>
    </div>
  );
}
