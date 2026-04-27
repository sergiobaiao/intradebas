'use client';

import { FormEvent, useState } from 'react';
import { requestPasswordReset } from '../lib';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await requestPasswordReset({ email });
      setMessage('Se houver uma conta ativa para este e-mail, a instrucao de redefinicao foi enviada.');
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao solicitar recuperacao');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <div className="card auth-card">
          <span className="eyebrow">Recuperacao de senha</span>
          <h1>Solicitar redefinicao</h1>
          <p>Informe o e-mail administrativo para receber um link de redefinicao de senha.</p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field-span">
              <span>E-mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>

            {message ? <p className="success-text field-span">{message}</p> : null}
            {error ? <p className="error-text field-span">{error}</p> : null}

            <div className="field-span cta-row">
              <button className="button primary" type="submit" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar link'}
              </button>
              <a className="button secondary" href="/login">
                Voltar ao login
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
