'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Competicao"
        title="Nova equipe"
        description="Crie uma equipe administrativa com nome e cor base para o placar."
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface title="Informacoes da equipe">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <AdminField label="Nome da equipe">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Equipe Alfa"
              />
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
              <Button type="submit" disabled={submitting || name.trim().length < 2}>
                {submitting ? 'Salvando...' : 'Criar equipe'}
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/equipes">Cancelar</a>
              </Button>
            </div>
          </form>
        </AdminSurface>

        <AdminSurface title="Visualizacao">
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50/70 p-8 text-center">
            <div
              className="mb-4 h-16 w-16 rounded-full border-4 border-white shadow-md"
              style={{ background: color }}
            />
            <strong className="text-xl text-slate-950">{name || 'Nome da Equipe'}</strong>
            <span className="mt-2 text-sm text-slate-500">Exemplo de exibicao</span>
          </div>
        </AdminSurface>
      </div>
    </div>
  );
}
