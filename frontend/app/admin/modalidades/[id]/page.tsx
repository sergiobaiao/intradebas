import { getSport } from '../../../lib';

type AdminSportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSportDetailPage({
  params,
}: AdminSportDetailPageProps) {
  const { id } = await params;
  const sport = await getSport(id);

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Modalidade</span>
        <h1>Detalhes da modalidade</h1>
        <div className="cta-row">
          <a className="button secondary" href="/admin/modalidades">
            Voltar para modalidades
          </a>
        </div>

        {!sport ? (
          <div className="card empty-state">
            <strong>Modalidade nao encontrada.</strong>
          </div>
        ) : (
          <>
            <div className="card">
              <h2>{sport.name}</h2>
              <p>Categoria: {sport.category}</p>
              <p>Status: {sport.isActive === false ? 'inativa' : 'ativa'}</p>
              <p>ALDEBARUN: {sport.isAldebarun ? 'sim' : 'nao'}</p>
              <p>Agenda: {sport.scheduleDate ? new Date(sport.scheduleDate).toLocaleString('pt-BR') : 'Nao definida'}</p>
            </div>
            <div className="review-grid" style={{ marginTop: '24px' }}>
              {sport.results.map((result) => (
                <article key={result.id} className="card review-card">
                  <h3>{result.team.name}</h3>
                  <p>Posicao: {result.position}</p>
                  <p>Pontos: {result.calculatedPoints ?? 0}</p>
                  <p>Data: {new Date(result.resultDate).toLocaleString('pt-BR')}</p>
                </article>
              ))}
              {sport.results.length === 0 ? (
                <div className="card empty-state">
                  <strong>Nenhum resultado lancado.</strong>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
