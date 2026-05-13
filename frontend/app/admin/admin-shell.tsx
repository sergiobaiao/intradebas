'use client';

import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

import { ThemeSelect } from "@/components/theme-select"
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
  description?: string
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
    description: "Comercial, backdrop e acervo oficial",
    items: [
      { label: "Patrocinios", href: "/admin/patrocinio" },
      { label: "Backdrop", href: "/admin/backdrop" },
      { label: "Galeria de midia", href: "/admin/midia" },
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
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-foreground text-sm font-semibold text-background">
          IN
        </div>
        <div>
          <strong className="block text-base tracking-tight text-sidebar-foreground">INTRADEBAS</strong>
          <span className="text-sm text-muted-foreground">Studio Admin</span>
        </div>
      </div>

      <ThemeSelect />

      <a
        className="inline-flex min-h-11 items-center justify-center rounded-[12px] bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        href="/admin/atletas"
      >
        Revisar inscricoes
      </a>

      <ScrollArea className="flex-1">
        <nav className="grid gap-6 pr-4" aria-label="Navegacao administrativa">
          {navigationGroups.map((group) => (
            <section key={group.label} className="grid gap-2">
              <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {group.label}
              </span>
              {group.description ? (
                <p className="px-2 text-xs leading-5 text-muted-foreground">{group.description}</p>
              ) : null}
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[12px] px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActiveRoute(pathname, item.href) &&
                        "border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground",
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-80 rounded-[12px] border border-border/70 bg-sidebar p-6 text-sidebar-foreground lg:block">
          <AdminSidebarNav />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-20 mb-4 flex items-center justify-between rounded-[12px] border border-border/70 bg-card px-4 py-3 lg:hidden">
            <div>
              <strong className="block text-sm tracking-tight text-foreground">INTRADEBAS</strong>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSelect compact className="min-w-[10.5rem]" />
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
          </div>

          <section className="flex-1 rounded-[12px] border border-border/70 bg-card p-4 md:p-6 lg:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}
