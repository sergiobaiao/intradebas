import { getSports, getTeams } from '../lib';
import { InscricaoForm } from './inscricao-form';

export default async function InscricaoPage() {
  const [teams, sports] = await Promise.all([getTeams(), getSports()]);

  return (
    <main className="section">
      <div className="shell">
        <div className="card">
          <span className="eyebrow">Inscricoes</span>
          <h1>Cadastro de atleta</h1>
          <p>
            Preencha os dados do atleta, selecione as modalidades e informe um cupom de cortesia se a
            inscricao vier de patrocinio.
          </p>

          <InscricaoForm teams={teams} sports={sports} />
        </div>
      </div>
    </main>
  );
}
