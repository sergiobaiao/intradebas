'use client';

import { FormEvent, useEffect, useState } from 'react';
import { submitPasswordReset } from '../lib';

export default function RedefinirSenhaPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') ?? '');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError('Token de redefinicao ausente');
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas informadas nao coincidem');
      setSubmitting(false);
      return;
    }

    try {
      await submitPasswordReset({ token, password });
      setMessage('Senha redefinida com sucesso. Agora voce pode entrar no painel.');
      setPassword('');
      setConfirmPassword('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao redefinir senha');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <div className="card auth-card">
          <span className="eyebrow">Redefinir senha</span>
          <h1>Cadastrar nova senha</h1>
          <p>Use o token recebido por e-mail para concluir a recuperacao da conta administrativa.</p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field-span">
              <span>Token</span>
              <input value={token} onChange={(event) => setToken(event.target.value)} />
            </label>
            <label className="field-span">
              <span>Nova senha</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label className="field-span">
              <span>Confirmar nova senha</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>

            {message ? <p className="success-text field-span">{message}</p> : null}
            {error ? <p className="error-text field-span">{error}</p> : null}

            <div className="field-span cta-row">
              <button className="button primary" type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Redefinir senha'}
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
