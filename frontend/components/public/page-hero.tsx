import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { PublicSection, PublicSectionShell } from './section-shell';

export function PublicPageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <PublicSection className="pb-6 pt-8">
      <PublicSectionShell className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-amber-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,247,214,0.96),_rgba(255,255,255,0.92)_52%,_rgba(255,244,221,0.88)_100%)] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:p-12">
          <Badge
            variant="secondary"
            className="rounded-full px-4 py-1 text-[0.7rem] uppercase tracking-[0.18em]"
          >
            {eyebrow}
          </Badge>
          <div className="mt-6 space-y-5">
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <div className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
        {aside ? <div className="grid gap-4">{aside}</div> : null}
      </PublicSectionShell>
    </PublicSection>
  );
}
