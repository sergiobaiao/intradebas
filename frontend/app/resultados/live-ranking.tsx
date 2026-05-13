'use client';

import { useEffect, useState } from 'react';
import { Activity, Radio, Trophy } from 'lucide-react';
import { PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublicApiBaseUrl } from '../api-base';
import { RankingRow } from '../lib';

type Props = {
  initialRanking: RankingRow[];
};

function getSseUrl() {
  const apiBase = getPublicApiBaseUrl();
  return `${apiBase}/results/ranking/live`;
}

export function LiveRanking({ initialRanking }: Props) {
  const [ranking, setRanking] = useState(initialRanking);
  const [connectionState, setConnectionState] = useState<'connecting' | 'live' | 'offline'>(
    'connecting',
  );

  useEffect(() => {
    const source = new EventSource(getSseUrl());

    source.onopen = () => {
      setConnectionState('live');
    };

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as RankingRow[];
        setRanking(payload);
        setConnectionState('live');
      } catch {
        setConnectionState('offline');
      }
    };

    source.onerror = () => {
      setConnectionState('offline');
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <PublicSectionShell className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <PublicStatCard
          title="Equipes no ranking"
          value={ranking.length}
          detail="Classificacao geral consolidada pelas APIs do evento."
          icon={Trophy}
        />
        <PublicStatCard
          title="Atualizacao"
          value={connectionState === 'live' ? 'Ao vivo' : connectionState === 'connecting' ? 'Conectando' : 'Offline'}
          detail="Sincronizacao do placar via SSE com fallback visual explicito."
          icon={Radio}
        />
        <PublicStatCard
          title="Melhor colocacao"
          value={ranking[0]?.name ?? 'Aguardando'}
          detail={
            ranking[0]
              ? `${ranking[0].totalScore} pontos acumulados.`
              : 'O placar aparecera quando houver resultados consolidados.'
          }
          icon={Activity}
        />
      </div>

      <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-3">
          <Badge
            variant="secondary"
            className="w-fit rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]"
          >
            Live score
          </Badge>
          <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
            Central de resultados
          </CardTitle>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Ranking consolidado por equipe com atualizacao automatica via SSE.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {ranking.map((team, index) => (
            <article
              key={team.id}
              className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 px-5 py-4"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {index + 1}o lugar
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{team.name}</h3>
              </div>
              <strong className="text-2xl font-black text-slate-950">{team.totalScore} pts</strong>
            </article>
          ))}
        </CardContent>
      </Card>
    </PublicSectionShell>
  );
}
