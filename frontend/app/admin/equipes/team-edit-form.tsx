'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

import { AdminField } from '@/components/admin/field';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <AdminSurface
        title="Configuracao da equipe"
        description="Ajuste nome e identificacao visual no placar."
      >
        {error ? <p className="mb-4 text-sm font-medium text-rose-700">{error}</p> : null}
        {message ? <p className="mb-4 text-sm font-medium text-emerald-700">{message}</p> : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <AdminField label="Nome da equipe">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </AdminField>

          <AdminField label="Cor base">
            <div className="flex gap-3">
              <input
                type="color"
                className="h-10 w-14 rounded-md border border-input bg-background p-1"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
              <Input value={color} onChange={(event) => setColor(event.target.value)} />
            </div>
          </AdminField>

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
              {deleting ? 'Removendo...' : 'Excluir equipe'}
            </Button>
          </div>
        </form>
      </AdminSurface>

      <AdminSurface title="Resumo operacional">
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Atletas inscritos</span>
            <Badge variant="outline">{athletes.length}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Atletas ativos</span>
            <Badge variant="success">{activeCount}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-600">Aguardando revisao</span>
            <Badge variant="warning">{pendingCount}</Badge>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Modalidades representadas
          </span>
          <p className="text-sm leading-6 text-slate-600">
            {representedSports.join(', ') || 'Nenhuma modalidade vinculada.'}
          </p>
        </div>
      </AdminSurface>
    </div>
  );
}
