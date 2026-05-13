import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicPageHero } from '@/components/public/page-hero';
import { getRanking } from '../lib';
import { LiveRanking } from './live-ranking';

export default async function ResultadosPage() {
  const ranking = await getRanking();

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="Resultados"
        title="Placar consolidado das equipes"
        description="Acompanhe o ranking geral do evento com atualizacao ao vivo a partir dos resultados oficiais publicados pela comissao."
        actions={
          <>
            <Button asChild className="rounded-full">
              <Link href="/inscricao">Entrar na competicao</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/aldebarun">Ver modulo ALDEBARUN</Link>
            </Button>
          </>
        }
        aside={
          <Card className="rounded-[1.75rem] border-slate-200/80 bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <CardHeader>
              <CardTitle className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-300">
                Resumo da rodada
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span>Equipes ranqueadas</span>
                <strong className="text-lg">{ranking.length}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Lider atual</span>
                <strong className="text-lg">{ranking[0]?.name ?? 'Aguardando'}</strong>
              </div>
            </CardContent>
          </Card>
        }
      />
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <LiveRanking initialRanking={ranking} />
      </section>
    </main>
  );
}
