import { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  kicker?: string
  title: string
  description?: string
  highlights?: string[]
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  kicker,
  title,
  description,
  highlights,
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
          <span className="inline-flex rounded-full bg-[#f8f4f0] px-3 py-1 text-[14px] font-medium uppercase tracking-[0.08em] text-[#201515]">
            {kicker}
          </span>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-4xl font-medium tracking-tight text-[#201515] md:text-5xl">
            {title}
          </h1>
          {description ? <p className="max-w-3xl text-sm text-[#605d52] md:text-base">{description}</p> : null}
        </div>
        {highlights?.length ? (
          <div className="grid gap-2 pt-1 md:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3 text-sm leading-6 text-[#605d52]"
              >
                {highlight}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}
