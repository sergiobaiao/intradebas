import { AdminDataTable } from "@/components/admin/data-table"
import { AdminEmptyState } from "@/components/admin/empty-state"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminSurface } from "@/components/admin/surface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  AthleteSummary,
  getRanking,
  getResults,
  getSponsorshipQuotas,
  getSports,
  getTeams,
  ResultSummary,
  SportSummary,
} from "../../lib"
import { getAdminAthletes } from "../admin-data"

type DashboardMetric = {
  label: string
  value: string
  description: string
  tone: "neutral" | "attention" | "success" | "warning"
}

type OperationalRecord = {
  id: string
  title: string
  category: string
  status: string
  description: string
  href: string
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  confirmed: "Confirmado",
  disqualified: "Desclassificado",
  expired: "Expirado",
  inactive: "Inativo",
  pending: "Pendente",
  registered: "Registrado",
  rejected: "Rejeitado",
  used: "Usado",
}

function formatStatus(status: string) {
  return statusLabels[status] ?? status
}

function metricToneClass(tone: DashboardMetric["tone"]) {
  switch (tone) {
    case "attention":
      return "border-amber-200 bg-amber-50/70"
    case "success":
      return "border-emerald-200 bg-emerald-50/70"
    case "warning":
      return "border-rose-200 bg-rose-50/70"
    default:
      return "border-border/60 bg-white/90"
  }
}

function buildMetrics(input: {
  athletes: AthleteSummary[]
  teamsCount: number
  sportsCount: number
  resultsCount: number
  remainingSponsorSlots: number | null
}): DashboardMetric[] {
  const pendingAthletes = input.athletes.filter((athlete) => athlete.status === "pending").length
  const activeAthletes = input.athletes.filter((athlete) => athlete.status === "active").length

  return [
    {
      label: "Total de atletas",
      value: String(input.athletes.length),
      description:
        input.athletes.length > 0
          ? `${activeAthletes} atletas ativos e ${pendingAthletes} pendentes.`
          : "Nenhum atleta retornado pelo backend.",
      tone: "neutral",
    },
    {
      label: "Inscricoes pendentes",
      value: String(pendingAthletes),
      description:
        pendingAthletes > 0
          ? "Existem cadastros aguardando revisao da comissao."
          : "Nenhuma inscricao pendente no momento.",
      tone: pendingAthletes > 0 ? "attention" : "success",
    },
    {
      label: "Equipes ativas",
      value: String(input.teamsCount),
      description:
        input.teamsCount > 0
          ? `${input.teamsCount} equipes disponiveis para operacao.`
          : "Nenhuma equipe retornada pelo backend.",
      tone: input.teamsCount > 0 ? "success" : "warning",
    },
    {
      label: "Competicao",
      value: `${input.resultsCount}/${input.sportsCount}`,
      description:
        input.sportsCount > 0
          ? "Resultados lancados sobre modalidades cadastradas."
          : "Nenhuma modalidade retornada pelo backend.",
      tone: input.resultsCount > 0 ? "success" : "neutral",
    },
    {
      label: "Cotas restantes",
      value: input.remainingSponsorSlots === null ? "Indisponivel" : String(input.remainingSponsorSlots),
      description:
        input.remainingSponsorSlots === null
          ? "Patrocinio sem dados carregados."
          : "Soma das vagas restantes nas cotas de patrocinio.",
      tone: input.remainingSponsorSlots === null ? "warning" : "neutral",
    },
  ]
}

function buildOperationalRecords(input: {
  athletes: AthleteSummary[]
  results: ResultSummary[]
  sports: SportSummary[]
}): OperationalRecord[] {
  const athleteRecords = input.athletes.slice(0, 4).map((athlete) => ({
    id: `athlete-${athlete.id}`,
    title: athlete.name,
    category: "Atleta",
    status: formatStatus(athlete.status),
    description: `${athlete.team?.name ?? "Sem equipe"} · ${athlete.sports.length} modalidade(s)`,
    href: `/admin/atletas/${athlete.id}`,
  }))

  const resultRecords = input.results.slice(0, 3).map((result) => ({
    id: `result-${result.id}`,
    title: result.sport.name,
    category: "Resultado",
    status: `${result.position}o lugar`,
    description: `${result.team.name} · ${result.calculatedPoints ?? 0} ponto(s)`,
    href: "/admin/resultados",
  }))

  const sportRecords = input.sports.slice(0, 3).map((sport) => ({
    id: `sport-${sport.id}`,
    title: sport.name,
    category: "Modalidade",
    status: sport.isActive === false ? "Inativa" : "Ativa",
    description: sport.category,
    href: `/admin/modalidades/${sport.id}`,
  }))

  return [...athleteRecords, ...resultRecords, ...sportRecords].slice(0, 8)
}

export default async function AdminDashboardPage() {
  const [teams, athletes, ranking, sports, results, quotas] = await Promise.all([
    getTeams(),
    getAdminAthletes(),
    getRanking(),
    getSports(),
    getResults(),
    getSponsorshipQuotas(),
  ])

  const remainingSponsorSlots =
    quotas.length > 0
      ? quotas.reduce((total, quota) => total + Math.max(0, quota.remainingSlots), 0)
      : null
  const metrics = buildMetrics({
    athletes,
    teamsCount: teams.length,
    sportsCount: sports.length,
    resultsCount: results.length,
    remainingSponsorSlots,
  })
  const operationalRecords = buildOperationalRecords({ athletes, results, sports })
  const performanceRows = ranking.length > 0 ? ranking : teams
  const maxScore = Math.max(...performanceRows.map((team) => team.totalScore), 0)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Painel administrativo"
        title="Dashboard operacional"
        description="Leitura consolidada do evento com indicadores reais, desempenho das equipes e registros administrativos recentes."
        actions={
          <>
            <Button asChild variant="outline">
              <a href="/admin/resultados">Resultados</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/patrocinio">Patrocinio</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/lgpd">LGPD</a>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" aria-label="Indicadores reais do evento">
        {metrics.map((metric) => (
          <AdminSurface key={metric.label} className={metricToneClass(metric.tone)} contentClassName="space-y-3 p-6">
            <span className="text-sm font-medium text-slate-500">{metric.label}</span>
            <strong className="block text-4xl font-semibold tracking-tight text-slate-950">{metric.value}</strong>
            <p className="text-sm leading-6 text-slate-600">{metric.description}</p>
          </AdminSurface>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <AdminSurface
          title="Desempenho das equipes"
          description="Pontuacao carregada dos dados reais de ranking e equipes."
          actions={
            <Button asChild variant="outline" size="sm">
              <a href="/admin/ranking">Ver ranking</a>
            </Button>
          }
        >
          {performanceRows.length > 0 ? (
            <div className="space-y-4">
              {performanceRows.map((team) => {
                const width = maxScore > 0 ? Math.max(8, (team.totalScore / maxScore) * 100) : 8

                return (
                  <div key={team.id} className="grid gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full border border-slate-200"
                          style={{ backgroundColor: team.color ?? "#16213e" }}
                        />
                        <strong className="text-sm text-slate-950">{team.name}</strong>
                      </div>
                      <span className="text-sm font-medium text-slate-500">{team.totalScore} pts</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${width}%`,
                          backgroundColor: team.color ?? "#16213e",
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <AdminEmptyState
              title="Sem equipes para exibir"
              description="Cadastre equipes ou verifique a conexao com o backend."
            />
          )}
        </AdminSurface>

        <AdminSurface
          title="Status dos atletas"
          description="Distribuicao por situacao cadastral."
        >
          {athletes.length > 0 ? (
            <div className="grid gap-3">
              {["active", "pending", "rejected"].map((status) => {
                const count = athletes.filter((athlete) => athlete.status === status).length

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-slate-600">{formatStatus(status)}</span>
                      <p className="text-xs text-slate-500">Atletas nesta situacao</p>
                    </div>
                    <span className="text-2xl font-semibold text-slate-950">{count}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <AdminEmptyState
              title="Sem atletas carregados"
              description="O painel exibira a distribuicao assim que houver dados reais."
            />
          )}
        </AdminSurface>
      </section>

      <AdminSurface
        title="Registros operacionais"
        description="Atletas, resultados e modalidades vindos das APIs existentes."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href="/admin/auditoria">Abrir auditoria</a>
          </Button>
        }
      >
        {operationalRecords.length > 0 ? (
          <AdminDataTable
            columns={[
              {
                key: "registro",
                header: "Registro",
                cell: (record) => (
                  <div className="space-y-1">
                    <strong className="text-slate-950">{record.title}</strong>
                    <p className="text-xs text-slate-500">{record.description}</p>
                  </div>
                ),
              },
              {
                key: "categoria",
                header: "Categoria",
                cell: (record) => <span className="text-slate-600">{record.category}</span>,
              },
              {
                key: "status",
                header: "Status",
                cell: (record) => <Badge variant="outline">{record.status}</Badge>,
              },
              {
                key: "acao",
                header: "Acao",
                className: "text-right",
                cell: (record) => (
                  <div className="flex justify-end">
                    <Button asChild variant="ghost" size="sm">
                      <a href={record.href}>Abrir</a>
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={operationalRecords}
          />
        ) : (
          <AdminEmptyState
            title="Sem registros operacionais"
            description="Quando houver atletas, resultados ou modalidades, eles aparecerao aqui."
          />
        )}
      </AdminSurface>
    </div>
  )
}
