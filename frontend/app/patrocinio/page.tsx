'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  SponsorshipQuotaSummary,
  createSponsorInterest,
  getSponsorshipQuotas,
} from '../lib';

export default function PatrocinioPage() {
  const [quotas, setQuotas] = useState<SponsorshipQuotaSummary[]>([]);
  const [selectedQuotaId, setSelectedQuotaId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getSponsorshipQuotas().then((data) => {
      setQuotas(data);
      if (data[0] && !selectedQuotaId) {
        setSelectedQuotaId(data[0].id);
      }
    });
  }, [selectedQuotaId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await createSponsorInterest({
        companyName,
        contactName,
        email,
        phone,
        quotaId: selectedQuotaId,
      });
      setMessage('Interesse registrado com sucesso. A comissao entrara em contato.');
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao registrar interesse');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Patrocinio</span>
        <h1>Cotas de patrocinio</h1>
        <p>Veja a disponibilidade das cotas e registre seu interesse de patrocinio.</p>

        <div className="grid-3 sponsorship-grid">
          {quotas.map((quota) => (
            <article key={quota.id} className="card sponsorship-card">
              <h3>{quota.level.toUpperCase()}</h3>
              <strong>R$ {quota.price.toFixed(2)}</strong>
              <p>{quota.benefits ?? 'Beneficios a definir'}</p>
              <small>
                {quota.remainingSlots} vagas restantes de {quota.maxSlots}
              </small>
            </article>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <h2>Tenho interesse</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Empresa</span>
              <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </label>
            <label>
              <span>Contato</span>
              <input value={contactName} onChange={(event) => setContactName(event.target.value)} />
            </label>
            <label>
              <span>E-mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              <span>Telefone</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label className="field-span">
              <span>Cota</span>
              <select value={selectedQuotaId} onChange={(event) => setSelectedQuotaId(event.target.value)}>
                {quotas.map((quota) => (
                  <option key={quota.id} value={quota.id} disabled={quota.remainingSlots <= 0}>
                    {quota.level.toUpperCase()} - {quota.remainingSlots} vagas restantes
                  </option>
                ))}
              </select>
            </label>

            {message ? <p className="success-text field-span">{message}</p> : null}
            {error ? <p className="error-text field-span">{error}</p> : null}

            <div className="field-span cta-row">
              <button className="button primary" type="submit" disabled={submitting || !selectedQuotaId}>
                {submitting ? 'Enviando...' : 'Registrar interesse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

