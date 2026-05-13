'use client';

import { useEffect, useState } from 'react';
import { BackdropSponsorSummary } from '@/app/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RotatingBackdrop({
  sponsors,
}: {
  sponsors: BackdropSponsorSummary[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (sponsors.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % sponsors.length);
    }, 3500);

    return () => window.clearInterval(id);
  }, [sponsors.length]);

  if (sponsors.length === 0) {
    return null;
  }

  const active = sponsors[index];

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <CardHeader>
        <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
          Rotacao em destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {active.level.toUpperCase()} • prioridade {active.backdropPriority}
          </p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">{active.companyName}</h3>
          {active.logoUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.logoUrl}
                alt={`Logo de ${active.companyName}`}
                className="h-40 w-full object-contain"
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Logo ainda nao enviada; exibicao nominal mantida.</p>
          )}
        </div>

        {sponsors.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {sponsors.map((sponsor, sponsorIndex) => (
              <Button
                key={sponsor.id}
                type="button"
                variant={sponsorIndex === index ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setIndex(sponsorIndex)}
              >
                {sponsor.companyName}
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
