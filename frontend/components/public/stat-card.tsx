import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PublicStatCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="rounded-[1.5rem] border-white/80 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <CardContent className="flex items-start gap-4 p-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Icon className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="text-sm leading-6 text-slate-600">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
