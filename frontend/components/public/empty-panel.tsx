import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PublicEmptyPanel({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <Card className="rounded-[2rem] border-dashed border-slate-300 bg-slate-50/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-950">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{description}</p>
        {actions}
      </CardContent>
    </Card>
  );
}
