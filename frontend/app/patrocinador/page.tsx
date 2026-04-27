'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  SponsorPortalSession,
  getSponsorPortalSession,
  requestSponsorPortalAccess,
} from '../lib';

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function PatrocinadorPage() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<SponsorPortalSession | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get('token');

    if (!token) {
      return;
    }

    setLoadingSession(true);
    setError(null);
    setMessage(null);

    void getSponsorPortalSession(token)
      .then((data) => {
        setSession(data);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir portal');
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await requestSponsorPortalAccess({ email });
      setMessage('Se houver um patrocinador vinculado a este e-mail, enviamos um link de acesso.');
      setEmail('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao solicitar acesso ao portal do patrocinador',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Portal do patrocinador</span>
        <h1>Acompanhe sua cota e seus cupons</h1>
        <p>
          Solicite um link de acesso por e-mail para visualizar o status da sua cota, cortesias e
          cupons gerados.
        </p>

        <div className="card" style={{ marginTop: '24px' }}>
          <h2>Receber link de acesso</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field-span">
              <span>E-mail do patrocinador</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>

            {message ? <p className="success-text field-span">{message}</p> : null}
            {error ? <p className="error-text field-span">{error}</p> : null}

            <div className="field-span cta-row">
              <button className="button primary" type="submit" disabled={submitting || !email}>
                {submitting ? 'Enviando...' : 'Enviar link'}
              </button>
            </div>
          </form>
        </div>

        {loadingSession ? <p style={{ marginTop: '24px' }}>Carregando portal...</p> : null}

        {session ? (
          <>
            <div className="grid-3" style={{ marginTop: '24px' }}>
              <article className="card">
                <small>Patrocinador</small>
                <strong>{session.sponsor.companyName}</strong>
                <span>{session.sponsor.contactName}</span>
              </article>
              <article className="card">
                <small>Cota</small>
                <strong>{session.sponsor.quota.level.toUpperCase()}</strong>
                <span>{formatMoney(session.sponsor.quota.price)}</span>
              </article>
              <article className="card">
                <small>Cupons</small>
                <strong>{session.coupons.length}</strong>
                <span>Status: {session.sponsor.status}</span>
              </article>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Resumo da cota</h2>
              <p>E-mail: {session.sponsor.email}</p>
              <p>Telefone: {session.sponsor.phone || 'Nao informado'}</p>
              <p>Cortesias previstas: {session.sponsor.quota.courtesyCount}</p>
              <p>Beneficios: {session.sponsor.quota.benefits || 'A definir'}</p>
              <p>
                Pagamento:{' '}
                {session.sponsor.paymentDate
                  ? new Date(session.sponsor.paymentDate).toLocaleString('pt-BR')
                  : 'Ainda nao confirmado'}
              </p>
              <p>Observacoes: {session.sponsor.paymentNotes || 'Sem observacoes registradas'}</p>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Cupons gerados</h2>
              {session.coupons.length === 0 ? (
                <p>Nenhum cupom foi gerado para esta cota ainda.</p>
              ) : (
                <div className="review-grid">
                  {session.coupons.map((coupon) => (
                    <article key={coupon.id} className="card review-card">
                      <div className="review-header">
                        <div>
                          <h3>{coupon.code}</h3>
                          <small>{coupon.status}</small>
                        </div>
                      </div>
                      <p>Gerado em: {new Date(coupon.createdAt).toLocaleString('pt-BR')}</p>
                      <p>
                        Utilizado por:{' '}
                        {coupon.athlete
                          ? `${coupon.athlete.name} (${coupon.athlete.cpf})`
                          : 'Nao utilizado'}
                      </p>
                      <p>
                        Data de uso:{' '}
                        {coupon.redeemedAt
                          ? new Date(coupon.redeemedAt).toLocaleString('pt-BR')
                          : 'Ainda disponivel'}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
