'use client';

import { useEffect, useState } from 'react';
import { MediaAdminSummary, adminGetMedia, adminUpdateMedia } from '../../lib';

export default function AdminMidiaPage() {
  const [items, setItems] = useState<MediaAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState('0');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminGetMedia());
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

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Midia</span>
        <h1>Gestao de fotos e videos</h1>
        <p>Visao administrativa do acervo de midia do evento.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando midia...</p> : null}
        {!loading && items.length === 0 ? <div className="card empty-state"><strong>Nenhum item de midia cadastrado.</strong></div> : null}
        {!loading ? (
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
                          setIsFeatured(item.isFeatured);
                          setSortOrder(String(item.sortOrder));
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
