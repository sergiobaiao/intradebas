'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/admin/dashboard');
  const [email, setEmail] = useState('admin@intradebas.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get('next') ?? '/admin/dashboard');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? 'Falha no login');
        return;
      }

      const body = (await response.json()) as { accessToken: string; refreshToken: string };
      document.cookie = `intradebas_admin_token=${body.accessToken}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
      document.cookie = `intradebas_admin_refresh_token=${body.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      router.push(nextPath);
      router.refresh();
    } catch {
      setError('Nao foi possivel conectar ao backend de autenticacao');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <div className="card auth-card">
          <span className="eyebrow">Acesso administrativo</span>
          <h1>Entrar no painel</h1>
          <p>Use a conta local seeded pelo backend para acessar as rotas protegidas do painel.</p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field-span">
              <span>E-mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>

            <label className="field-span">
              <span>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error ? <p className="error-text field-span">{error}</p> : null}

            <div className="field-span cta-row">
              <button className="button primary" type="submit" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
              <a className="button secondary" href="/recuperar-senha">
                Esqueci minha senha
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
