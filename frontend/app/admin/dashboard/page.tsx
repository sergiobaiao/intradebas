import { getAthletes, getTeams } from '../../lib';

export default async function AdminDashboardPage() {
  const [teams, athletes] = await Promise.all([getTeams(), getAthletes()]);
  const pendingCount = athletes.filter((athlete) => athlete.status === 'pending').length;

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Painel administrativo</span>
        <h1>Dashboard operacional</h1>
        <div className="grid-3">
          <article className="card">
            <small>Total de atletas</small>
            <strong>{athletes.length}</strong>
            <span>Base inicial carregada do contrato `/api/v1/athletes`.</span>
          </article>
          <article className="card">
            <small>Inscricoes pendentes</small>
            <strong>{pendingCount}</strong>
            <span>Convidados aguardando aprovacao manual da comissao.</span>
          </article>
          <article className="card">
            <small>Equipes ativas</small>
            <strong>{teams.length}</strong>
            <span>Mucura, Jacare e Capivara prontas para score ao vivo.</span>
          </article>
        </div>
        <div className="cta-row" style={{ marginTop: '24px' }}>
          <a className="button secondary" href="/admin/atletas">
            Revisar atletas
          </a>
          <a className="button secondary" href="/admin/patrocinio">
            Gerenciar patrocinio
          </a>
          <a className="button secondary" href="/admin/resultados">
            Gerenciar resultados
          </a>
        </div>
      </div>
    </main>
  );
}
