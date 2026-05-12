import { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  kicker?: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  kicker,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {kicker ? (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
            {kicker}
          </span>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {title}
          </h1>
          {description ? <p className="max-w-3xl text-sm text-slate-600 md:text-base">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}
