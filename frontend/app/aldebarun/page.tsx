import Link from 'next/link';
import { Flag, Timer, Trophy } from 'lucide-react';
import { PublicEmptyPanel } from '@/components/public/empty-panel';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAldebarunResults, getAldebarunSports } from '../lib';

function formatSchedule(value?: string | null) {
  if (!value) {
    return 'Agenda a confirmar';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Fortaleza',
  }).format(new Date(value));
}

function formatRawScore(value?: number | null) {
  if (value == null) {
    return 'Tempo nao informado';
  }

  const totalSeconds = Math.max(Math.round(value), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default async function AldebarunPage() {
  const [sports, results] = await Promise.all([getAldebarunSports(), getAldebarunResults()]);

  const groupedResults = sports.map((sport) => ({
    sport,
    results: results.filter((result) => result.sport.id === sport.id),
  }));

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="ALDEBARUN II"
        title="Corrida da familia com agenda e tempos oficiais"
        description="Pagina dedicada da corrida com modalidades reais, agenda operacional e ranking por tempo a partir dos resultados gravados no backend."
        actions={
          <>
            <Button asChild className="rounded-full">
              <Link href="/inscricao">Fazer inscricao</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/resultados">Ver placar geral</Link>
            </Button>
          </>
        }
      />

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-3">
          <PublicStatCard
            title="Modalidades"
            value={sports.length}
            detail="Corridas marcadas como ALDEBARUN no cadastro de modalidades."
            icon={Flag}
          />
          <PublicStatCard
            title="Resultados"
            value={results.length}
            detail="Tempos e colocacoes publicadas pela comissao organizadora."
            icon={Timer}
          />
          <PublicStatCard
            title="Status"
            value="Dados reais"
            detail="Sem fallback mockado no portal publico."
            icon={Trophy}
          />
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell className="grid gap-6">
          {groupedResults.map(({ sport, results: sportResults }) => (
            <Card
              key={sport.id}
              className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
            >
              <CardHeader className="space-y-3">
                <Badge
                  variant="secondary"
                  className="w-fit rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]"
                >
                  {sport.category}
                </Badge>
                <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                  {sport.name}
                </CardTitle>
                <div className="space-y-1 text-sm leading-7 text-slate-600">
                  <p>{sport.description || 'Modalidade dedicada da corrida ALDEBARUN.'}</p>
                  <p>
                    <strong>Agenda:</strong> {formatSchedule(sport.scheduleDate)}
                  </p>
                  {sport.scheduleNotes ? (
                    <p>
                      <strong>Observacoes:</strong> {sport.scheduleNotes}
                    </p>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {sportResults.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-600">
                    Ainda nao ha tempos publicados para esta prova.
                  </div>
                ) : (
                  sportResults.map((result) => (
                    <article
                      key={result.id}
                      className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 px-5 py-4"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          {result.position}o lugar
                        </p>
                        <h3 className="mt-1 text-xl font-black text-slate-950">
                          {result.team?.name ?? 'Equipe nao informada'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {result.notes ?? 'Resultado oficial da corrida'}
                        </p>
                      </div>
                      <strong className="text-2xl font-black text-slate-950">
                        {formatRawScore(result.rawScore)}
                      </strong>
                    </article>
                  ))
                )}
              </CardContent>
            </Card>
          ))}

          {sports.length === 0 ? (
            <PublicEmptyPanel
              title="Nenhuma prova ALDEBARUN cadastrada"
              description="Cadastre modalidades com a flag ALDEBARUN no painel administrativo para publicar a agenda e os rankings da corrida."
            />
          ) : null}
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell>
          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-950">
                Observacao de regulamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-slate-600">
                O documento tecnico aponta que as faixas etarias e categorias por sexo ainda
                dependem de regulamento oficial da organizacao. Ate essa definicao, a publicacao
                fica por prova cadastrada e por tempo/colocacao oficial.
              </p>
            </CardContent>
          </Card>
        </PublicSectionShell>
      </PublicSection>
    </main>
  );
}
