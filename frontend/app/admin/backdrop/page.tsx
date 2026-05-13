'use client';

import { useEffect, useState } from 'react';

import { AdminDataTable } from '@/components/admin/data-table';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { BackdropSponsorSummary, SponsorAdminSummary, adminFetchJson } from '../../lib';

export default function AdminBackdropPage() {
  const [backdrop, setBackdrop] = useState<BackdropSponsorSummary[]>([]);
  const [sponsors, setSponsors] = useState<SponsorAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedBackdrop, loadedSponsors] = await Promise.all([
        adminFetchJson<BackdropSponsorSummary[]>('/backdrop'),
        adminFetchJson<SponsorAdminSummary[]>('/sponsors'),
      ]);
      setBackdrop(loadedBackdrop);
      setSponsors(loadedSponsors);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar backdrop');
    } finally {
      setLoading(false);
    }
  }

  const inactiveSponsors = sponsors.filter((sponsor) => sponsor.status !== 'active').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Marketing"
        title="Backdrop digital"
        description="Nesta tela voce acompanha quem esta elegivel para exibicao publica no backdrop e valida a prioridade visual das marcas ativas."
        highlights={[
          'O backdrop considera patrocinadores ativos e a prioridade configurada na cota.',
          'Use esta pagina para conferir rapidamente quem entra ou fica fora da exibicao automatica.',
        ]}
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <AdminSurface title="Marcas em exibicao" description="Patrocinadores ja retornados pelo endpoint do backdrop.">
          <strong className="block text-4xl font-medium text-[#201515]">{backdrop.length}</strong>
        </AdminSurface>
        <AdminSurface title="Fora da exibicao" description="Empresas ainda inativas ou sem elegibilidade para o carrossel.">
          <strong className="block text-4xl font-medium text-[#201515]">{inactiveSponsors}</strong>
        </AdminSurface>
        <AdminSurface title="Regra operacional" description="Apenas patrocinadores ativos entram no backdrop automatico.">
          <Badge variant="outline">status = active</Badge>
        </AdminSurface>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface
          title="Patrocinadores em exibicao"
          description="Ordem de prioridade e status visual das marcas publicadas no telao do evento."
        >
          {loading ? (
            <AdminEmptyState title="Carregando..." description="Buscando patrocinadores ativos publicados no backdrop." />
          ) : backdrop.length === 0 ? (
            <AdminEmptyState
              title="Nenhum patrocinador em exibicao."
              description="Ative cotas e publique logos para alimentar o carrossel do backdrop."
            />
          ) : (
            <AdminDataTable
              columns={[
                {
                  key: 'prioridade',
                  header: 'Prioridade',
                  cell: (item) => <Badge variant="outline">{item.backdropPriority}</Badge>,
                },
                {
                  key: 'empresa',
                  header: 'Empresa',
                  cell: (item) => <strong className="text-sm text-[#201515]">{item.companyName}</strong>,
                },
                {
                  key: 'nivel',
                  header: 'Nivel',
                  cell: (item) => <span className="text-sm text-[#605d52]">{item.level.toUpperCase()}</span>,
                },
                {
                  key: 'logo',
                  header: 'Logo',
                  cell: (item) => (
                    <Badge variant={item.logoUrl ? 'success' : 'warning'}>
                      {item.logoUrl ? 'Publicada' : 'Pendente'}
                    </Badge>
                  ),
                },
              ]}
              rows={backdrop}
            />
          )}
        </AdminSurface>

        <AdminSurface
          title="Como usar esta area"
          description="Checklist rapido para a equipe operacional de marketing."
        >
          <div className="grid gap-3 text-sm leading-6 text-[#605d52]">
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Confirme primeiro se a cota do patrocinador esta com status <strong className="text-[#201515]">active</strong>.
            </div>
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Garanta que a <strong className="text-[#201515]">logo</strong> foi cadastrada para a marca aparecer corretamente na rotacao.
            </div>
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Revise a <strong className="text-[#201515]">prioridade</strong> quando houver cotas de niveis diferentes disputando maior destaque.
            </div>
          </div>
        </AdminSurface>
      </section>
    </div>
  );
}
