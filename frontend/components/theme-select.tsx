'use client';

import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

type ThemeSelectProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeSelect({ className, compact = false }: ThemeSelectProps) {
  const { theme, themes, setTheme } = useTheme();

  return (
    <div className={cn('grid gap-1.5', className)}>
      {!compact ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Tema visual
        </span>
      ) : null}
      <Select
        value={theme.id}
        onValueChange={(nextTheme) => {
          setTheme(nextTheme);
        }}
      >
        <SelectTrigger
          aria-label="Selecionar tema visual"
          className={cn(
            'min-w-[12rem] gap-2 border-border bg-background text-foreground',
            compact ? 'h-10 rounded-lg px-3' : 'h-11 rounded-lg px-4',
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Palette className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Selecionar tema" />
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="grid gap-0.5">
                <span className="font-medium">{theme.label}</span>
                <span className="text-xs text-muted-foreground">{theme.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
