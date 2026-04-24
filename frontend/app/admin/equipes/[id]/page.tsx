import { getTeam, getTeamAthletes } from '../../../lib';
import { TeamEditForm } from '../team-edit-form';

type AdminTeamDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamDetailPage({
  params,
}: AdminTeamDetailPageProps) {
  const { id } = await params;
  const [team, athletes] = await Promise.all([getTeam(id), getTeamAthletes(id)]);

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Equipe</span>
        <h1>Detalhes da equipe</h1>
        <div className="cta-row">
          <a className="button secondary" href="/admin/equipes">
            Voltar para equipes
          </a>
        </div>

        {!team ? (
          <div className="card empty-state">
            <strong>Equipe nao encontrada.</strong>
          </div>
        ) : (
          <>
            <div className="card">
              <h2>{team.name}</h2>
              <p>Cor: {team.color ?? 'Nao definida'}</p>
              <p>Placar atual: {team.totalScore}</p>
              <p>Atletas cadastrados: {team.athletesCount}</p>
            </div>
            <TeamEditForm team={team} athletes={athletes} />
            <div className="review-grid" style={{ marginTop: '24px' }}>
              {athletes.map((athlete) => (
                <article key={athlete.id} className="card review-card">
                  <h3>{athlete.name}</h3>
                  <p>Status: {athlete.status}</p>
                  <p>Tipo: {athlete.type}</p>
                  <p>
                    Modalidades:{' '}
                    {athlete.sports.map((sport) => sport.name).join(', ') || 'Nenhuma'}
                  </p>
                  <a className="button secondary" href={`/admin/atletas/${athlete.id}`}>
                    Ver atleta
                  </a>
                </article>
              ))}
              {athletes.length === 0 ? (
                <div className="card empty-state">
                  <strong>Nenhum atleta vinculado.</strong>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
