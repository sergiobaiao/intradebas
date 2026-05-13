'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getRemaining(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const delta = Math.max(target - now, 0);
  const totalMinutes = Math.floor(delta / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, expired: delta <= 0 };
}

export function CountdownCard({
  title,
  targetIso,
}: {
  title: string;
  targetIso?: string | null;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!targetIso) {
      return;
    }
    const id = window.setInterval(() => setTick((value) => value + 1), 60000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  const remaining = useMemo(
    () => (targetIso ? getRemaining(targetIso) : null),
    [targetIso, tick],
  );

  return (
    <Card className="rounded-[1.75rem] border-slate-200/80 bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-300">
          <CalendarClock className="h-4 w-4" />
          Proximo evento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-black text-white">{title}</p>
        {remaining ? (
          remaining.expired ? (
            <p className="text-sm text-slate-300">Horario alcancado. A programacao sera atualizada conforme novas rodadas.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <strong className="block text-2xl font-black">{remaining.days}</strong>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-300">dias</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <strong className="block text-2xl font-black">{remaining.hours}</strong>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-300">horas</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <strong className="block text-2xl font-black">{remaining.minutes}</strong>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-300">min</span>
              </div>
            </div>
          )
        ) : (
          <p className="text-sm text-slate-300">Ainda nao ha modalidade com data agendada no sistema.</p>
        )}
      </CardContent>
    </Card>
  );
}
