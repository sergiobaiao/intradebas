import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminTeam, getAdminTeamAthletes } from '../../admin-data';
import { TeamEditForm } from '../team-edit-form';

type AdminTeamDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamDetailPage({
  params,
}: AdminTeamDetailPageProps) {
  const { id } = await params;
  const [team, athletes] = await Promise.all([getAdminTeam(id), getAdminTeamAthletes(id)]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Equipe"
        title="Detalhes da equipe"
        actions={
          <Button asChild variant="outline">
            <a href="/admin/equipes">Voltar para equipes</a>
          </Button>
        }
      />

      {!team ? (
        <AdminEmptyState title="Equipe nao encontrada." description="Verifique o registro e tente novamente." />
      ) : (
        <>
          <AdminSurface title={team.name} description={`Placar atual: ${team.totalScore}`}>
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <p className="m-0">Cor: {team.color ?? 'Nao definida'}</p>
              <p className="m-0">Placar atual: {team.totalScore}</p>
              <p className="m-0">Atletas cadastrados: {team.athletesCount}</p>
            </div>
          </AdminSurface>
          <TeamEditForm team={team} athletes={athletes} />
          <section className="grid gap-4 xl:grid-cols-2">
            {athletes.map((athlete) => (
              <AdminSurface
                key={athlete.id}
                title={athlete.name}
                description={athlete.sports.map((sport) => sport.name).join(', ') || 'Nenhuma'}
                actions={<Badge variant="outline">{athlete.status}</Badge>}
              >
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="m-0">Tipo: {athlete.type}</p>
                  <div>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/admin/atletas/${athlete.id}`}>Ver atleta</a>
                    </Button>
                  </div>
                </div>
              </AdminSurface>
            ))}
            {athletes.length === 0 ? (
              <AdminEmptyState title="Nenhum atleta vinculado." description="Esta equipe ainda nao possui atletas associados." />
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
