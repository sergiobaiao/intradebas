'use client';

import { useEffect, useState } from 'react';
import {
  MediaAdminSummary,
  adminDeleteMedia,
  adminGetMediaPage,
  adminUpdateMedia,
} from '../../lib';

export default function AdminMidiaPage() {
  const [items, setItems] = useState<MediaAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState('0');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [providerFilter, setProviderFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  useEffect(() => {
    void loadData();
  }, [page, providerFilter, featuredFilter]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const loaded = await adminGetMediaPage({
        page,
        pageSize: 12,
        provider: providerFilter,
        featured: featuredFilter,
      });
      setItems(loaded.items);
      setTotalPages(loaded.totalPages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar midia');
    } finally {
      setLoading(false);
    }
  }

  async function saveItem(mediaId: string) {
    setError(null);

    try {
      const updated = await adminUpdateMedia(mediaId, {
        title: title || undefined,
        isFeatured,
        sortOrder: Number(sortOrder),
      });

      setItems((current) =>
        [...current]
          .map((item) => (item.id === mediaId ? updated : item))
          .sort((left, right) => {
            if (left.isFeatured !== right.isFeatured) {
              return Number(right.isFeatured) - Number(left.isFeatured);
            }

            if (left.sortOrder !== right.sortOrder) {
              return left.sortOrder - right.sortOrder;
            }

            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
          }),
      );
      setEditingId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar midia');
    }
  }

  async function deleteItem(mediaId: string) {
    if (!confirm('Tem certeza que deseja remover esta midia?')) return;
    setDeletingId(mediaId);
    setError(null);

    try {
      await adminDeleteMedia(mediaId);
      setItems((current) => current.filter((item) => item.id !== mediaId));
      if (editingId === mediaId) {
        setEditingId(null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao remover midia');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Conteudo</span>
          <h1>Galeria de midia</h1>
        </div>
        <div className="admin-topbar-actions">
          <a className="admin-quick-action" style={{ minHeight: '38px', padding: '0 14px' }} href="/admin/midia/nova">
            Novo item
          </a>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="form-grid" style={{ marginTop: 0 }}>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Provedor</span>
            <select
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={providerFilter}
              onChange={(event) => {
                setPage(1);
                setProviderFilter(event.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="local">Local (Upload)</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Destaque</span>
            <select
              style={{ minHeight: '40px', borderRadius: '10px' }}
              value={featuredFilter}
              onChange={(event) => {
                setPage(1);
                setFeaturedFilter(event.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="true">Apenas em destaque</option>
              <option value="false">Normais</option>
            </select>
          </label>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Arquivos e Links</h2>
            <p>Gerenciamento de acervo visual e audiovisual.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span className="admin-kicker">Pagina {page} de {totalPages}</span>
             <div className="admin-topbar-actions" style={{ marginTop: 0 }}>
                <button
                  className="admin-topbar-actions a"
                  style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  Anterior
                </button>
                <button
                  className="admin-topbar-actions a"
                  style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Proxima
                </button>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <strong>Carregando...</strong>
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="admin-empty-state">
            <strong>Nenhum item de midia encontrado.</strong>
            <span>Ajuste os filtros ou adicione um novo item.</span>
          </div>
        ) : null}

        {!loading && items.length > 0 ? (
          <div className="review-grid">
            {items.map((item) => (
              <article key={item.id} className="admin-panel" style={{ padding: '16px', background: '#fcfcfc' }}>
                <div className="admin-panel-header" style={{ marginBottom: '16px' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title ?? item.type}
                    </h3>
                    <span className="admin-kicker" style={{ fontSize: '0.75rem' }}>{item.provider} · {item.type}</span>
                  </div>
                  <span className={`admin-table-status ${item.isFeatured ? 'success' : ''}`} style={{ background: item.isFeatured ? 'rgba(45, 106, 79, 0.1)' : 'rgba(17, 24, 39, 0.05)', color: item.isFeatured ? '#2d6a4f' : '#6b7280' }}>
                    {item.isFeatured ? 'Destaque' : 'Normal'}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong>URL:</strong> {item.url}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    <strong>Enviado por:</strong> {item.uploader.name} · <strong>Ordem:</strong> {item.sortOrder}
                  </p>
                </div>

                {editingId === item.id ? (
                  <div className="form-grid" style={{ marginTop: 0, marginBottom: '16px', gap: '10px' }}>
                    <label className="field-span">
                      <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Titulo</span>
                      <input style={{ minHeight: '36px', borderRadius: '8px' }} value={title} onChange={(event) => setTitle(event.target.value)} />
                    </label>
                    <label>
                      <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Ordem</span>
                      <input type="number" style={{ minHeight: '36px', borderRadius: '8px' }} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
                    </label>
                    <label className="checkbox-row" style={{ alignSelf: 'center' }}>
                      <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
                      <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Destaque</span>
                    </label>
                  </div>
                ) : null}

                <div className="admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                  {editingId === item.id ? (
                    <>
                      <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', background: '#111827', color: '#fff' }} type="button" onClick={() => void saveItem(item.id)}>
                        Salvar
                      </button>
                      <button className="admin-topbar-actions a" style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }} type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="admin-topbar-actions a"
                        style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setTitle(item.title ?? '');
                          setIsFeatured(item.isFeatured);
                          setSortOrder(String(item.sortOrder));
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-topbar-actions a"
                        style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                        type="button"
                        onClick={() => void deleteItem(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? '...' : 'Remover'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
