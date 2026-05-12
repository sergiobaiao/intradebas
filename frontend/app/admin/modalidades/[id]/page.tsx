import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSport } from '../../../lib';
import { SportEditForm } from '../sport-edit-form';

type AdminSportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSportDetailPage({
  params,
}: AdminSportDetailPageProps) {
  const { id } = await params;
  const sport = await getSport(id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Modalidade"
        title="Detalhes da modalidade"
        actions={
          <Button asChild variant="outline">
            <a href="/admin/modalidades">Voltar para modalidades</a>
          </Button>
        }
      />

      {!sport ? (
        <AdminEmptyState title="Modalidade nao encontrada." description="Verifique o registro e tente novamente." />
      ) : (
        <>
          <AdminSurface
            title={sport.name}
            description={sport.description ?? 'Sem descricao complementar.'}
            actions={<Badge variant={sport.isActive === false ? 'destructive' : 'success'}>{sport.isActive === false ? 'Inativa' : 'Ativa'}</Badge>}
          >
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <p className="m-0">Categoria: {sport.category}</p>
              <p className="m-0">ALDEBARUN: {sport.isAldebarun ? 'sim' : 'nao'}</p>
              <p className="m-0">
                Agenda: {sport.scheduleDate ? new Date(sport.scheduleDate).toLocaleString('pt-BR') : 'Nao definida'}
              </p>
              <p className="m-0">Resultados: {sport.results.length}</p>
            </div>
          </AdminSurface>
          <SportEditForm sport={sport} />
          <section className="grid gap-4 xl:grid-cols-2">
            {sport.results.map((result) => (
              <AdminSurface
                key={result.id}
                title={result.team.name}
                description={new Date(result.resultDate).toLocaleString('pt-BR')}
                actions={<Badge variant="outline">{result.position}o lugar</Badge>}
              >
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="m-0">Pontos: {result.calculatedPoints ?? 0}</p>
                </div>
              </AdminSurface>
            ))}
            {sport.results.length === 0 ? (
              <AdminEmptyState title="Nenhum resultado lancado." description="Esta modalidade ainda nao possui resultados associados." />
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
