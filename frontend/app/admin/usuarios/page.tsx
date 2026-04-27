'use client';

import { useEffect, useState } from 'react';
import {
  AdminUserSummary,
  adminCreateAdminUser,
  adminGetAdminUsers,
  adminUpdateAdminUser,
} from '../../lib';

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [password, setPassword] = useState('');

  const [drafts, setDrafts] = useState<Record<string, {
    name: string;
    role: 'admin' | 'superadmin';
    isActive: boolean;
    password: string;
  }>>({});

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const data = await adminGetAdminUsers();
      setUsers(data);
      setDrafts(
        Object.fromEntries(
          data.map((user) => [
            user.id,
            {
              name: user.name,
              role: user.role,
              isActive: user.isActive,
              password: '',
            },
          ]),
        ),
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar usuarios administrativos');
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    setCreating(true);
    setError(null);

    try {
      const created = await adminCreateAdminUser({
        name,
        email,
        role,
        password,
      });
      const updatedUsers = [...users, created];
      setUsers(updatedUsers);
      setDrafts((current) => ({
        ...current,
        [created.id]: {
          name: created.name,
          role: created.role,
          isActive: created.isActive,
          password: '',
        },
      }));
      setName('');
      setEmail('');
      setRole('admin');
      setPassword('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Falha ao criar usuario administrativo');
    } finally {
      setCreating(false);
    }
  }

  async function saveUser(userId: string) {
    const draft = drafts[userId];

    if (!draft) {
      return;
    }

    setSavingId(userId);
    setError(null);

    try {
      const updated = await adminUpdateAdminUser(userId, {
        name: draft.name,
        role: draft.role,
        isActive: draft.isActive,
        password: draft.password || undefined,
      });
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)));
      setDrafts((current) => ({
        ...current,
        [userId]: {
          name: updated.name,
          role: updated.role,
          isActive: updated.isActive,
          password: '',
        },
      }));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Falha ao atualizar usuario administrativo');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Usuarios admin</span>
        <h1>Gestao de acessos administrativos</h1>
        <p>Fluxo de superadmin para criar, ajustar papel e ativar ou desativar contas da comissao.</p>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h2>Novo usuario administrativo</h2>
          <div className="form-grid">
            <label>
              <span>Nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span>E-mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              <span>Papel</span>
              <select value={role} onChange={(event) => setRole(event.target.value as 'admin' | 'superadmin')}>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </label>
            <label>
              <span>Senha inicial</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <div className="cta-row field-span">
              <button className="button primary" type="button" onClick={() => void createUser()} disabled={creating}>
                {creating ? 'Criando...' : 'Criar usuario'}
              </button>
            </div>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando usuarios...</p> : null}

        {!loading ? (
          <div className="review-grid">
            {users.map((user) => {
              const draft = drafts[user.id];

              return (
                <article key={user.id} className="card review-card">
                  <div className="review-header">
                    <div>
                      <h3>{user.email}</h3>
                      <small>Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}</small>
                    </div>
                    <span className={`status-pill ${draft?.isActive ? 'active' : 'rejected'}`}>
                      {draft?.isActive ? 'ativo' : 'inativo'}
                    </span>
                  </div>
                  <label>
                    <span>Nome</span>
                    <input
                      value={draft?.name ?? ''}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...(current[user.id] ?? {
                              name: user.name,
                              role: user.role,
                              isActive: user.isActive,
                              password: '',
                            }),
                            name: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Papel</span>
                    <select
                      value={draft?.role ?? user.role}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...(current[user.id] ?? {
                              name: user.name,
                              role: user.role,
                              isActive: user.isActive,
                              password: '',
                            }),
                            role: event.target.value as 'admin' | 'superadmin',
                          },
                        }))
                      }
                    >
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </label>
                  <label>
                    <span>Novo status</span>
                    <select
                      value={(draft?.isActive ?? user.isActive) ? 'ativo' : 'inativo'}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...(current[user.id] ?? {
                              name: user.name,
                              role: user.role,
                              isActive: user.isActive,
                              password: '',
                            }),
                            isActive: event.target.value === 'ativo',
                          },
                        }))
                      }
                    >
                      <option value="ativo">ativo</option>
                      <option value="inativo">inativo</option>
                    </select>
                  </label>
                  <label>
                    <span>Redefinir senha</span>
                    <input
                      type="password"
                      value={draft?.password ?? ''}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...(current[user.id] ?? {
                              name: user.name,
                              role: user.role,
                              isActive: user.isActive,
                              password: '',
                            }),
                            password: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <p>Ultimo login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('pt-BR') : 'ainda nao acessou'}</p>
                  <div className="cta-row">
                    <button
                      className="button primary"
                      type="button"
                      onClick={() => void saveUser(user.id)}
                      disabled={savingId === user.id}
                    >
                      {savingId === user.id ? 'Salvando...' : 'Salvar alteracoes'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
