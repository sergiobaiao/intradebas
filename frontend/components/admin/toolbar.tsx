import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function AdminToolbar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-white/80 p-4 md:flex-row md:flex-wrap md:items-end",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminToolbarGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("grid gap-2", className)}>{children}</div>
}
