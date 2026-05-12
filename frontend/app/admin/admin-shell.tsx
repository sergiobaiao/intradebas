'use client';

import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavigationGroup = {
  label: string
  items: { label: string; href: string }[]
}

const navigationGroups: NavigationGroup[] = [
  {
    label: "Operacao",
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Gerenciar resultados", href: "/admin/resultados" },
      { label: "Ranking", href: "/admin/ranking" },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { label: "Atletas", href: "/admin/atletas" },
      { label: "Equipes", href: "/admin/equipes" },
      { label: "Modalidades", href: "/admin/modalidades" },
    ],
  },
  {
    label: "Patrocinio e midia",
    items: [
      { label: "Gerenciar patrocinio", href: "/admin/patrocinio" },
      { label: "Backdrop", href: "/admin/backdrop" },
      { label: "Midia", href: "/admin/midia" },
      { label: "Nova midia", href: "/admin/midia/nova" },
    ],
  },
  {
    label: "Governanca",
    items: [
      { label: "LGPD", href: "/admin/lgpd" },
      { label: "Auditoria", href: "/admin/auditoria" },
      { label: "Usuarios admin", href: "/admin/usuarios" },
      { label: "Configuracoes", href: "/admin/configuracoes" },
    ],
  },
]

function isActiveRoute(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === href || pathname === "/admin"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
          IN
        </div>
        <div>
          <strong className="block text-base tracking-tight text-slate-950">INTRADEBAS</strong>
          <span className="text-sm text-slate-500">Studio Admin</span>
        </div>
      </div>

      <a
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        href="/admin/atletas"
      >
        Revisar inscricoes
      </a>

      <ScrollArea className="flex-1">
        <nav className="grid gap-6 pr-4" aria-label="Navegacao administrativa">
          {navigationGroups.map((group) => (
            <section key={group.label} className="grid gap-2">
              <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {group.label}
              </span>
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-amber-50 hover:text-slate-950",
                      isActiveRoute(pathname, item.href) &&
                        "bg-slate-100 text-slate-950 shadow-sm",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff8e2_0%,_#f7f1e3_48%,_#efe5d0_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-80 rounded-[28px] border border-border/70 bg-white/90 p-6 shadow-admin lg:block">
          <AdminSidebarNav />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-20 mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
            <div>
              <strong className="block text-sm tracking-tight text-slate-950">INTRADEBAS</strong>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menu administrativo">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Menu administrativo</SheetTitle>
                  <SheetDescription>Navegue entre as areas operacionais do sistema.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 h-[calc(100%-4rem)]">
                  <AdminSidebarNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <section className="flex-1 rounded-[28px] border border-border/70 bg-white/65 p-4 shadow-admin backdrop-blur md:p-6 lg:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}
