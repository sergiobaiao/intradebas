'use client';

import { useEffect, useState } from 'react';
import { RankingRow } from '../lib';

type Props = {
  initialRanking: RankingRow[];
};

function getSseUrl() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
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
    <div className="card">
      <span className="eyebrow">Live score</span>
      <h1>Central de resultados</h1>
      <p>Ranking consolidado por equipe com atualizacao automatica via SSE.</p>
      <p>
        <strong>Status:</strong>{' '}
        {connectionState === 'live'
          ? 'ao vivo'
          : connectionState === 'connecting'
            ? 'conectando'
            : 'reconectando'}
      </p>
      <div className="ranking-list">
        {ranking.map((team, index) => (
          <article key={team.id} className="ranking-item">
            <div>
              <small>{index + 1}o lugar</small>
              <h3>{team.name}</h3>
            </div>
            <strong>{team.totalScore} pts</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
