import Link from 'next/link';
import { Clapperboard, ImageIcon, Star } from 'lucide-react';
import { PublicEmptyPanel } from '@/components/public/empty-panel';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublicMediaPage } from '../lib';

function getEmbedUrl(url: string, provider: 'youtube' | 'vimeo') {
  if (provider === 'youtube') {
    const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
}

export default async function MidiaPage() {
  const media = await getPublicMediaPage({ page: 1, pageSize: 18 });
  const featured = media.items.filter((item) => item.isFeatured).length;
  const photos = media.items.filter((item) => item.type === 'photo').length;
  const videos = media.items.filter((item) => item.type === 'video').length;

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="Midia"
        title="Cobertura visual publica do evento"
        description="Fotos e videos publicados pela organizacao para acompanhar bastidores, provas e patrocinadores em uma galeria aberta."
        actions={
          <>
            <Button asChild className="rounded-full">
              <Link href="/resultados">Ver resultados</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/backdrop">Ver backdrop</Link>
            </Button>
          </>
        }
      />

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-3">
          <PublicStatCard title="Midias publicadas" value={media.total} detail="Itens retornados pela API publica de midia." icon={Clapperboard} />
          <PublicStatCard title="Destaques" value={featured} detail="Itens marcados como featured pela operacao." icon={Star} />
          <PublicStatCard title="Fotos e videos" value={`${photos}/${videos}`} detail="Distribuicao atual entre fotos e videos publicados." icon={ImageIcon} />
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell>
          {media.items.length === 0 ? (
            <PublicEmptyPanel
              title="Nenhuma midia publicada"
              description="A galeria publica sera exibida assim que a comissao publicar fotos e videos no painel administrativo."
            />
          ) : (
            <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                  Galeria publica
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {media.items.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-50">
                    <div className="border-b border-slate-200/80 bg-white px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-black text-slate-950">
                          {item.title || (item.type === 'photo' ? 'Foto do evento' : 'Video do evento')}
                        </h3>
                        {item.isFeatured ? (
                          <Badge variant="secondary" className="rounded-full">
                            Destaque
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-4">
                      {item.type === 'photo' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.title || 'Midia do evento'}
                          className="h-64 w-full rounded-2xl object-cover"
                        />
                      ) : item.provider === 'youtube' || item.provider === 'vimeo' ? (
                        <iframe
                          src={getEmbedUrl(item.url, item.provider)}
                          title={item.title || 'Video do evento'}
                          className="h-64 w-full rounded-2xl border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          src={item.url}
                          className="h-64 w-full rounded-2xl object-cover"
                        />
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
