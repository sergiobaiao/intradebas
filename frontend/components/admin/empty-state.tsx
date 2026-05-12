type AdminEmptyStateProps = {
  title: string
  description: string
}

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-6 text-sm">
      <strong className="block text-base text-slate-950">{title}</strong>
      <span className="mt-1 block text-slate-600">{description}</span>
    </div>
  )
}
