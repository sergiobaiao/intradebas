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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Sessao de Seguranca</span>
          <h1>Usuarios do sistema</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Novo usuario administrativo</h2>
          </div>
          <div className="form-grid" style={{ marginTop: 0 }}>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome Completo</span>
              <input style={{ minHeight: '38px', borderRadius: '10px' }} value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>E-mail de acesso</span>
              <input style={{ minHeight: '38px', borderRadius: '10px' }} value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Papel</span>
              <select style={{ minHeight: '38px', borderRadius: '10px' }} value={role} onChange={(event) => setRole(event.target.value as 'admin' | 'superadmin')}>
                <option value="admin">Admin Operacional</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Senha Inicial</span>
              <input style={{ minHeight: '38px', borderRadius: '10px' }} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <div className="admin-topbar-actions field-span" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
              <button className="admin-quick-action" style={{ minHeight: '40px', padding: '0 20px' }} type="button" onClick={() => void createUser()} disabled={creating}>
                {creating ? 'Criando...' : 'Criar usuario'}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Resumo de acessos</h2>
          </div>
          <div className="admin-status-stack">
             <div>
               <span>Total de Contas</span>
               <strong>{users.length}</strong>
             </div>
             <div>
               <span>Ativas</span>
               <strong>{users.filter(u => u.isActive).length}</strong>
             </div>
             <div>
               <span>Superadmins</span>
               <strong>{users.filter(u => u.role === 'superadmin').length}</strong>
             </div>
          </div>
        </section>
      </div>

      {loading ? (
        <div className="admin-empty-state">
          <strong>Carregando...</strong>
        </div>
      ) : null}

      {!loading && users.length > 0 ? (
        <div className="review-grid">
          {users.map((user) => {
            const draft = drafts[user.id];

            return (
              <article key={user.id} className="admin-panel" style={{ padding: '18px', background: '#fcfcfc' }}>
                <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </h3>
                    <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className={`admin-table-status ${draft?.isActive ? 'success' : 'rejected'}`} style={{ background: draft?.isActive ? 'rgba(45, 106, 79, 0.1)' : 'rgba(230, 57, 70, 0.1)', color: draft?.isActive ? '#2d6a4f' : '#e63946' }}>
                    {draft?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="form-grid" style={{ marginTop: 0, marginBottom: '16px', gap: '10px' }}>
                  <label className="field-span">
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Nome</span>
                    <input
                      style={{ minHeight: '34px', borderRadius: '8px', fontSize: '0.85rem' }}
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
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Papel</span>
                    <select
                      style={{ minHeight: '34px', borderRadius: '8px', fontSize: '0.85rem' }}
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
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Status</span>
                    <select
                      style={{ minHeight: '34px', borderRadius: '8px', fontSize: '0.85rem' }}
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
                  <label className="field-span">
                    <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Redefinir senha (deixe vazio para manter)</span>
                    <input
                      style={{ minHeight: '34px', borderRadius: '8px', fontSize: '0.85rem' }}
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
                </div>

                <div style={{ marginBottom: '16px' }}>
                   <span className="admin-kicker" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                    Ultimo acesso: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('pt-BR') : 'nunca'}
                  </span>
                </div>

                <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                  <button
                    className="admin-topbar-actions a"
                    style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.85rem', background: '#111827', color: '#fff' }}
                    type="button"
                    onClick={() => void saveUser(user.id)}
                    disabled={savingId === user.id}
                  >
                    {savingId === user.id ? '...' : 'Salvar alteracoes'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
