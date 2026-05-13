import Link from 'next/link';
import { Crown, ImageIcon, Layers3 } from 'lucide-react';
import { PublicEmptyPanel } from '@/components/public/empty-panel';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBackdropSponsors } from '../lib';

export default async function BackdropPage() {
  const sponsors = await getBackdropSponsors();
  const goldSponsors = sponsors.filter((sponsor) => sponsor.level === 'ouro').length;

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="Backdrop digital"
        title="Marcas confirmadas no ecossistema visual do evento"
        description="Exposicao publica das marcas confirmadas no evento, priorizando as cotas de maior destaque."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/patrocinio">Ver cotas de patrocinio</Link>
          </Button>
        }
      />

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-3">
          <PublicStatCard
            title="Patrocinadores ativos"
            value={sponsors.length}
            detail="Marcas publicadas no backdrop digital."
            icon={ImageIcon}
          />
          <PublicStatCard
            title="Cotas ouro"
            value={goldSponsors}
            detail="Entradas com prioridade de destaque superior."
            icon={Crown}
          />
          <PublicStatCard
            title="Fila visual"
            value={sponsors.length > 0 ? 'Ativa' : 'Vazia'}
            detail="Sequencia de marcas baseada nas prioridades cadastrais."
            icon={Layers3}
          />
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell>
          {sponsors.length === 0 ? (
            <PublicEmptyPanel
              title="Nenhum patrocinador ativo"
              description="Nenhum patrocinador ativo foi publicado no backdrop ainda."
            />
          ) : (
            <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                  Grade de exposicao
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sponsors.map((sponsor) => (
                  <article
                    key={sponsor.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {sponsor.level.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{sponsor.companyName}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Prioridade de exposicao: {sponsor.backdropPriority}
                    </p>
                    <div className="mt-4">
                      {sponsor.logoUrl ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <a href={sponsor.logoUrl} target="_blank" rel="noreferrer">
                            Ver logo
                          </a>
                        </Button>
                      ) : (
                        <p className="text-sm font-medium text-slate-500">Logo ainda nao enviada.</p>
                      )}
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          )}
        </PublicSectionShell>
      </PublicSection>
    </main>
  );
}
