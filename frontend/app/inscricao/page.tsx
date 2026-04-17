import { getTeams } from '../lib';

const shirtSizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];
const sports = [
  'Futsal',
  'ALDEBARUN 5K',
  'Futevolei',
  'Beach Tennis',
];

export default async function InscricaoPage() {
  const teams = await getTeams();

  return (
    <main className="section">
      <div className="shell">
        <div className="card">
          <span className="eyebrow">Inscricoes</span>
          <h1>Cadastro de atleta</h1>
          <p>
            Estrutura inicial do formulario publico conforme a especificacao.
            O submit final ainda sera conectado ao fluxo persistente com Prisma.
          </p>

          <form className="form-grid">
            <label>
              <span>Nome completo</span>
              <input placeholder="Ex.: Joao Silva Santos" />
            </label>

            <label>
              <span>CPF</span>
              <input placeholder="000.000.000-00" />
            </label>

            <label>
              <span>Telefone</span>
              <input placeholder="(86) 99999-0000" />
            </label>

            <label>
              <span>Data de nascimento</span>
              <input type="date" />
            </label>

            <label>
              <span>Equipe</span>
              <select defaultValue="">
                <option value="" disabled>
                  Selecione uma equipe
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Tamanho da camiseta</span>
              <select defaultValue="">
                <option value="" disabled>
                  Selecione o tamanho
                </option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="field-span">
              <legend>Modalidades</legend>
              <div className="checkbox-grid">
                {sports.map((sport) => (
                  <label key={sport} className="checkbox-row">
                    <input type="checkbox" />
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="checkbox-row field-span">
              <input type="checkbox" />
              <span>
                Autorizo o tratamento dos meus dados pessoais conforme a politica
                de privacidade e regras LGPD do evento.
              </span>
            </label>

            <div className="field-span cta-row">
              <button type="submit" className="button primary">
                Enviar inscricao
              </button>
              <a className="button secondary" href="/privacidade">
                Ver politica LGPD
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

