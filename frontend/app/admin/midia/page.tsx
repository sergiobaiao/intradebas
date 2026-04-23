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
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Midia</span>
        <h1>Gestao de fotos e videos</h1>
        <p>Visao administrativa do acervo de midia do evento.</p>
        <div className="cta-row">
          <a className="button primary" href="/admin/midia/nova">
            Novo item
          </a>
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando midia...</p> : null}
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="form-grid">
            <label>
              <span>Filtrar por provider</span>
              <select
                value={providerFilter}
                onChange={(event) => {
                  setPage(1);
                  setProviderFilter(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="local">local</option>
                <option value="youtube">youtube</option>
                <option value="vimeo">vimeo</option>
              </select>
            </label>
            <label>
              <span>Filtrar por destaque</span>
              <select
                value={featuredFilter}
                onChange={(event) => {
                  setPage(1);
                  setFeaturedFilter(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="true">destaque</option>
                <option value="false">normal</option>
              </select>
            </label>
          </div>
        </div>
        {!loading && items.length === 0 ? <div className="card empty-state"><strong>Nenhum item de midia cadastrado.</strong></div> : null}
        {!loading ? (
          <>
          <div className="review-grid">
            {items.map((item) => (
              <article key={item.id} className="card review-card">
                <div className="review-header">
                  <div>
                    <h3>{item.title ?? item.type}</h3>
                    <small>{item.provider}</small>
                  </div>
                  <span className={`status-pill ${item.isFeatured ? 'active' : 'pending'}`}>{item.isFeatured ? 'destaque' : 'normal'}</span>
                </div>
                <p>URL: {item.url}</p>
                <p>Uploader: {item.uploader.name}</p>
                {editingId === item.id ? (
                  <>
                    <label className="field">
                      <span>Titulo</span>
                      <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Destaque</span>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(event) => setIsFeatured(event.target.checked)}
                      />
                    </label>
                    <label className="field">
                      <span>Ordem</span>
                      <input
                        type="number"
                        min="0"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                      />
                    </label>
                    <div className="cta-row">
                      <button className="button" type="button" onClick={() => void saveItem(item.id)}>
                        Salvar
                      </button>
                      <button className="button secondary" type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Ordem: {item.sortOrder}</p>
                    <div className="cta-row">
                    <button
                      className="button secondary"
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
                        className="button secondary"
                        type="button"
                        onClick={() => void deleteItem(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? 'Removendo...' : 'Remover'}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: '24px' }}>
            <button
              className="button secondary"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Pagina anterior
            </button>
            <span>Pagina {page} de {totalPages}</span>
            <button
              className="button secondary"
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Proxima pagina
            </button>
          </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
