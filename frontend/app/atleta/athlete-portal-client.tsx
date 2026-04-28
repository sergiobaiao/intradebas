'use client';

import { useEffect, useState } from 'react';
import { AthletePortalSession, confirmAthleteEmail, getAthletePortalSession } from '../lib';

type AthletePortalClientProps = {
  token?: string;
};

export function AthletePortalClient({ token }: AthletePortalClientProps) {
  const [session, setSession] = useState<AthletePortalSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);
    confirmAthleteEmail(token)
      .catch(() => getAthletePortalSession(token))
      .then(setSession)
      .catch((sessionError) => {
        setError(
          sessionError instanceof Error
            ? sessionError.message
            : 'Nao foi possivel abrir a area do atleta',
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="card">
        <span className="eyebrow">Area do atleta</span>
        <h1>Acesse pelo link enviado ao seu e-mail</h1>
        <p>
          A inscricao inicial e feita sem senha. Depois do envio, confirme o e-mail para liberar
          sua area pessoal com cadastro, modalidades, resultados e informacoes LGPD.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/inscricao">
            Fazer inscricao
          </a>
          <a className="button secondary" href="/privacidade">
            Politica de privacidade
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <span className="eyebrow">Area do atleta</span>
        <h1>Confirmando cadastro</h1>
        <p>Estamos validando seu link de acesso.</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="card">
        <span className="eyebrow">Area do atleta</span>
        <h1>Link invalido ou expirado</h1>
        <p className="error-text">{error ?? 'Solicite uma nova inscricao ou fale com a comissao.'}</p>
        <a className="button primary" href="/inscricao">
          Voltar para inscricao
        </a>
      </div>
    );
  }

  const { athlete } = session;

  return (
    <div className="grid-2">
      <section className="card">
        <span className="eyebrow">Cadastro confirmado</span>
        <h1>{athlete.name}</h1>
        <p>
          Status: <strong>{athlete.status}</strong>
        </p>
        <p>
          Equipe: <strong>{athlete.team?.name ?? 'Nao vinculada'}</strong>
        </p>
        <p>
          Camiseta: <strong>{athlete.shirtSize}</strong>
        </p>
        <p>
          E-mail confirmado:{' '}
          <strong>
            {session.emailVerifiedAt
              ? new Date(session.emailVerifiedAt).toLocaleString('pt-BR')
              : 'pendente'}
          </strong>
        </p>
      </section>

      <section className="card">
        <span className="eyebrow">LGPD</span>
        <h2>Dados e consentimento</h2>
        <p>
          Consentimento:{' '}
          <strong>{session.lgpd.consent ? 'registrado' : 'nao registrado'}</strong>
        </p>
        <p>
          Data do aceite:{' '}
          <strong>
            {session.lgpd.consentAt
              ? new Date(session.lgpd.consentAt).toLocaleString('pt-BR')
              : 'nao informada'}
          </strong>
        </p>
        <p>Versao da politica: {session.lgpd.policyVersion}</p>
        <a className="button secondary" href="/privacidade">
          Ver politica
        </a>
      </section>

      <section className="card">
        <span className="eyebrow">Modalidades</span>
        <h2>Inscricoes esportivas</h2>
        <div className="ranking-list">
          {athlete.sports.map((sport) => (
            <article key={sport.id} className="ranking-item">
              <div>
                <h3>{sport.name}</h3>
                <small>{sport.category}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <span className="eyebrow">Resultados</span>
        <h2>Participacoes registradas</h2>
        <div className="ranking-list">
          {session.results.length > 0 ? (
            session.results.map((result) => (
              <article key={result.id} className="ranking-item">
                <div>
                  <small>{new Date(result.resultDate).toLocaleDateString('pt-BR')}</small>
                  <h3>{result.sport.name}</h3>
                </div>
                <strong>{result.calculatedPoints ?? 0} pts</strong>
              </article>
            ))
          ) : (
            <p>Nenhum resultado individual registrado ate o momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}
