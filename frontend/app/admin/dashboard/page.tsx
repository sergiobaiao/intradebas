import {
  AthleteSummary,
  getRanking,
  getResults,
  getSponsorshipQuotas,
  getSports,
  getTeams,
  ResultSummary,
  SportSummary,
} from '../../lib';
import { getAdminAthletes } from '../admin-data';

type DashboardMetric = {
  label: string;
  value: string;
  description: string;
  tone: 'neutral' | 'attention' | 'success' | 'warning';
};

type OperationalRecord = {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  href: string;
};

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  confirmed: 'Confirmado',
  disqualified: 'Desclassificado',
  expired: 'Expirado',
  inactive: 'Inativo',
  pending: 'Pendente',
  registered: 'Registrado',
  rejected: 'Rejeitado',
  used: 'Usado',
};

function formatStatus(status: string) {
  return statusLabels[status] ?? status;
}

function buildMetrics(input: {
  athletes: AthleteSummary[];
  teamsCount: number;
  sportsCount: number;
  resultsCount: number;
  remainingSponsorSlots: number | null;
}): DashboardMetric[] {
  const pendingAthletes = input.athletes.filter((athlete) => athlete.status === 'pending').length;
  const activeAthletes = input.athletes.filter((athlete) => athlete.status === 'active').length;

  return [
    {
      label: 'Total de atletas',
      value: String(input.athletes.length),
      description:
        input.athletes.length > 0
          ? `${activeAthletes} atletas ativos e ${pendingAthletes} pendentes.`
          : 'Nenhum atleta retornado pelo backend.',
      tone: 'neutral',
    },
    {
      label: 'Inscricoes pendentes',
      value: String(pendingAthletes),
      description:
        pendingAthletes > 0
          ? 'Existem cadastros aguardando revisao da comissao.'
          : 'Nenhuma inscricao pendente no momento.',
      tone: pendingAthletes > 0 ? 'attention' : 'success',
    },
    {
      label: 'Equipes ativas',
      value: String(input.teamsCount),
      description:
        input.teamsCount > 0
          ? `${input.teamsCount} equipes disponiveis para operacao.`
          : 'Nenhuma equipe retornada pelo backend.',
      tone: input.teamsCount > 0 ? 'success' : 'warning',
    },
    {
      label: 'Competicao',
      value: `${input.resultsCount}/${input.sportsCount}`,
      description:
        input.sportsCount > 0
          ? 'Resultados lancados sobre modalidades cadastradas.'
          : 'Nenhuma modalidade retornada pelo backend.',
      tone: input.resultsCount > 0 ? 'success' : 'neutral',
    },
    {
      label: 'Cotas restantes',
      value: input.remainingSponsorSlots === null ? 'Indisponivel' : String(input.remainingSponsorSlots),
      description:
        input.remainingSponsorSlots === null
          ? 'Patrocinio sem dados carregados.'
          : 'Soma das vagas restantes nas cotas de patrocinio.',
      tone: input.remainingSponsorSlots === null ? 'warning' : 'neutral',
    },
  ];
}

function buildOperationalRecords(input: {
  athletes: AthleteSummary[];
  results: ResultSummary[];
  sports: SportSummary[];
}): OperationalRecord[] {
  const athleteRecords = input.athletes.slice(0, 4).map((athlete) => ({
    id: `athlete-${athlete.id}`,
    title: athlete.name,
    category: 'Atleta',
    status: formatStatus(athlete.status),
    description: `${athlete.team?.name ?? 'Sem equipe'} · ${athlete.sports.length} modalidade(s)`,
    href: `/admin/atletas/${athlete.id}`,
  }));

  const resultRecords = input.results.slice(0, 3).map((result) => ({
    id: `result-${result.id}`,
    title: result.sport.name,
    category: 'Resultado',
    status: `${result.position}o lugar`,
    description: `${result.team.name} · ${result.calculatedPoints ?? 0} ponto(s)`,
    href: '/admin/resultados',
  }));

  const sportRecords = input.sports.slice(0, 3).map((sport) => ({
    id: `sport-${sport.id}`,
    title: sport.name,
    category: 'Modalidade',
    status: sport.isActive === false ? 'Inativa' : 'Ativa',
    description: sport.category,
    href: `/admin/modalidades/${sport.id}`,
  }));

  return [...athleteRecords, ...resultRecords, ...sportRecords].slice(0, 8);
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="admin-empty-state">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [teams, athletes, ranking, sports, results, quotas] = await Promise.all([
    getTeams(),
    getAdminAthletes(),
    getRanking(),
    getSports(),
    getResults(),
    getSponsorshipQuotas(),
  ]);

  const remainingSponsorSlots =
    quotas.length > 0
      ? quotas.reduce((total, quota) => total + Math.max(0, quota.remainingSlots), 0)
      : null;
  const metrics = buildMetrics({
    athletes,
    teamsCount: teams.length,
    sportsCount: sports.length,
    resultsCount: results.length,
    remainingSponsorSlots,
  });
  const operationalRecords = buildOperationalRecords({ athletes, results, sports });
  const performanceRows = ranking.length > 0 ? ranking : teams;
  const maxScore = Math.max(...performanceRows.map((team) => team.totalScore), 0);

  return (
    <>
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Painel administrativo</span>
            <h1>Dashboard operacional</h1>
          </div>
          <div className="admin-topbar-actions" aria-label="Atalhos administrativos">
            <a href="/admin/resultados">Resultados</a>
            <a href="/admin/patrocinio">Patrocinio</a>
            <a href="/admin/lgpd">LGPD</a>
          </div>
        </header>

        <section className="admin-metric-grid" aria-label="Indicadores reais do evento">
          {metrics.map((metric) => (
            <article key={metric.label} className={`admin-metric-card ${metric.tone}`}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.description}</p>
            </article>
          ))}
        </section>

        <section className="admin-content-grid">
          <article className="admin-panel admin-panel-wide">
            <div className="admin-panel-header">
              <div>
                <h2>Desempenho das equipes</h2>
                <p>Pontuacao carregada dos dados reais de ranking/equipes.</p>
              </div>
              <a href="/admin/ranking">Ver ranking</a>
            </div>

            {performanceRows.length > 0 ? (
              <div className="admin-team-performance">
                {performanceRows.map((team) => {
                  const width = maxScore > 0 ? Math.max(8, (team.totalScore / maxScore) * 100) : 8;

                  return (
                    <div key={team.id} className="admin-team-row">
                      <div>
                        <span style={{ backgroundColor: team.color ?? '#16213e' }} />
                        <strong>{team.name}</strong>
                      </div>
                      <div className="admin-score-track" aria-label={`${team.name}: ${team.totalScore} pontos`}>
                        <span style={{ width: `${width}%`, backgroundColor: team.color ?? '#16213e' }} />
                      </div>
                      <em>{team.totalScore} pts</em>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Sem equipes para exibir"
                message="Cadastre equipes ou verifique a conexao com o backend."
              />
            )}
          </article>

          <article className="admin-panel">
            <div className="admin-panel-header compact">
              <div>
                <h2>Status dos atletas</h2>
                <p>Distribuicao por situacao cadastral.</p>
              </div>
            </div>

            {athletes.length > 0 ? (
              <div className="admin-status-stack">
                {['active', 'pending', 'rejected'].map((status) => {
                  const count = athletes.filter((athlete) => athlete.status === status).length;

                  return (
                    <div key={status}>
                      <span>{formatStatus(status)}</span>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Sem atletas carregados"
                message="O painel exibira a distribuicao assim que houver dados reais."
              />
            )}
          </article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Registros operacionais</h2>
              <p>Atletas, resultados e modalidades vindos das APIs existentes.</p>
            </div>
            <a href="/admin/auditoria">Abrir auditoria</a>
          </div>

          {operationalRecords.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Registro</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Detalhe</th>
                    <th>Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {operationalRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <strong>{record.title}</strong>
                      </td>
                      <td>{record.category}</td>
                      <td>
                        <span className="admin-table-status">{record.status}</span>
                      </td>
                      <td>{record.description}</td>
                      <td>
                        <a href={record.href}>Abrir</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Sem registros operacionais"
              message="Quando houver atletas, resultados ou modalidades, eles aparecerao aqui."
            />
          )}
        </section>
    </>
  );
}
