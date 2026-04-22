import { getAthlete, getSports, getTeams } from '../../../lib';
import { AthleteEditForm } from '../athlete-edit-form';

type AdminAthleteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAthleteDetailPage({
  params,
}: AdminAthleteDetailPageProps) {
  const { id } = await params;
  const [athlete, teams, sports] = await Promise.all([
    getAthlete(id),
    getTeams(),
    getSports(),
  ]);

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Atleta</span>
        <h1>Perfil do atleta</h1>
        <div className="cta-row">
          <a className="button secondary" href="/admin/atletas">
            Voltar para atletas
          </a>
        </div>

        {!athlete ? (
          <div className="card empty-state">
            <strong>Atleta nao encontrado.</strong>
          </div>
        ) : (
          <>
            <div className="card">
              <h2>{athlete.name}</h2>
              <p>CPF: {athlete.cpf}</p>
              <p>Status: {athlete.status}</p>
              <p>Tipo: {athlete.type}</p>
              <p>Equipe: {athlete.team?.name ?? 'Sem equipe'}</p>
              <p>Tamanho da camiseta: {athlete.shirtSize}</p>
              <p>
                Modalidades:{' '}
                {athlete.sports.map((sport) => sport.name).join(', ') || 'Nenhuma'}
              </p>
            </div>
            <AthleteEditForm athlete={athlete} teams={teams} sports={sports} />
          </>
        )}
      </div>
    </main>
  );
}
