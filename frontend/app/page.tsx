import Link from 'next/link';
import { ArrowRight, ImageIcon, Medal, ShieldCheck, Trophy, Users } from 'lucide-react';
import { CountdownCard } from '@/components/public/countdown-card';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAthletes,
  getBackdropSponsors,
  getRanking,
  getSports,
  getSponsorshipQuotas,
  getTeams,
  getPublicMediaPage,
} from './lib';

const teamDescriptions: Record<string, string> = {
  Mucura: 'Equipe de ataque, presença forte e leitura agressiva das modalidades coletivas.',
  Jacare: 'Equipe tradicional, consistente e orientada por disciplina competitiva.',
  Capivara: 'Equipe de participação ampla, energia familiar e resistência de longo curso.',
};

export default async function HomePage() {
  const [teams, athletes, ranking, sports, quotas, sponsors, media] = await Promise.all([
    getTeams(),
    getAthletes(),
    getRanking(),
    getSports(),
    getSponsorshipQuotas(),
    getBackdropSponsors(),
    getPublicMediaPage({ page: 1, pageSize: 6, featured: 'true' }),
  ]);

  const activeTeams = teams.length;
  const totalAthletes = athletes.length;
  const totalSports = sports.length;
  const openQuotaSlots = quotas.reduce((sum, quota) => sum + quota.remainingSlots, 0);
  const leadTeam = ranking[0];
  const nextScheduledSport = [...sports]
    .filter((sport) => sport.scheduleDate)
    .filter((sport) => new Date(sport.scheduleDate as string).getTime() > Date.now())
    .sort(
      (left, right) =>
        new Date(left.scheduleDate as string).getTime() -
        new Date(right.scheduleDate as string).getTime(),
    )[0];

  const highlights = [
    {
      title: 'Atletas cadastrados',
      value: totalAthletes,
      detail:
        totalAthletes > 0
          ? 'Base publica ativa para inscricoes e acompanhamento do evento.'
          : 'Nenhum atleta carregado no momento.',
      icon: Users,
    },
    {
      title: 'Modalidades ativas',
      value: totalSports,
      detail:
        totalSports > 0
          ? 'Programacao esportiva publicada pelas APIs do sistema.'
          : 'Programacao ainda nao publicada.',
      icon: Trophy,
    },
    {
      title: 'Cotas disponiveis',
      value: openQuotaSlots,
      detail:
        quotas.length > 0
          ? 'Disponibilidade real para patrocinio no portal.'
          : 'Tabela de patrocinio ainda nao carregada.',
      icon: ShieldCheck,
    },
    {
      title: 'Midias em destaque',
      value: media.items.length,
      detail:
        media.items.length > 0
          ? 'Fotos e videos publicados para cobertura publica do evento.'
          : 'Galeria publica ainda nao publicada.',
      icon: ImageIcon,
    },
  ];

  return (
    <main className="pb-8">
      <PublicSection className="pb-8 pt-8">
        <PublicSectionShell className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-amber-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,247,214,0.96),_rgba(255,255,255,0.92)_52%,_rgba(255,244,221,0.88)_100%)] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:p-12">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]">
              Portal oficial do evento
            </Badge>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  Dashboard publico para inscricoes, ranking ao vivo e patrocinio do
                  INTRADEBAS 2026.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  O portal centraliza os Jogos Internos do Aldebaran Ville com acesso
                  rapido para atletas, comissao, patrocinadores e para a cobertura da
                  ALDEBARUN.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/inscricao">
                    Fazer inscricao
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/resultados">Ver resultados</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/patrocinio">Quero patrocinar</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/midia">Ver galeria</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="rounded-[1.75rem] border-amber-200/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-500">
                  Lideranca atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black text-slate-950">
                      {leadTeam?.name ?? 'Aguardando'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {leadTeam
                        ? `${leadTeam.totalScore} pontos acumulados no ranking geral.`
                        : 'O placar aparecera assim que houver resultados consolidados.'}
                    </p>
                  </div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Medal className="h-6 w-6" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-slate-200/80 bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-300">
                  Operacao ativa
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span>Equipes ativas</span>
                  <strong className="text-lg">{activeTeams}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Patrocinadores no backdrop</span>
                  <strong className="text-lg">{sponsors.length}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Portal do atleta</span>
                  <strong className="text-lg">Email validado</strong>
                </div>
              </CardContent>
            </Card>

            <CountdownCard
              title={nextScheduledSport?.name ?? 'Agenda a confirmar'}
              targetIso={nextScheduledSport?.scheduleDate ?? null}
            />
          </div>
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="rounded-[1.5rem] border-white/80 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <CardContent className="flex items-start gap-4 p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-500">{item.title}</p>
                    <p className="text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
                    <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </PublicSectionShell>
      </PublicSection>

      <PublicSection>
        <PublicSectionShell className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]">
                Equipes
              </Badge>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                As tres frentes que movem o INTRADEBAS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5"
                  >
                    <p className="text-lg font-extrabold text-slate-950">{team.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {teamDescriptions[team.name] ?? 'Equipe oficial cadastrada para a competicao.'}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      Pontuacao atual: {team.totalScore}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-600 md:col-span-3">
                  Nenhuma equipe retornada pelo backend no momento.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/80 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]">
                Fluxos principais
              </Badge>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Entradas mais usadas do portal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                {
                  href: '/inscricao',
                  title: 'Inscricao de atletas',
                  text: 'Cadastro inicial sem senha com confirmacao por e-mail e LGPD.',
                },
                {
                  href: '/resultados',
                  title: 'Resultados e ranking',
                  text: 'Consulta publica do placar consolidado e da classificacao das equipes.',
                },
                {
                  href: '/patrocinio',
                  title: 'Patrocinio e cotas',
                  text: 'Consulta de disponibilidade real e envio de interesse comercial.',
                },
                {
                  href: '/midia',
                  title: 'Galeria publica',
                  text: 'Fotos e videos publicados pela organizacao para cobertura aberta do evento.',
                },
                {
                  href: '/aldebarun',
                  title: 'Modulo ALDEBARUN',
                  text: 'Pagina dedicada para a corrida com resultados e programacao ja publicada.',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-extrabold text-slate-950">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </PublicSectionShell>
      </PublicSection>
    </main>
  );
}
