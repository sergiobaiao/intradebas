'use client';

import { useEffect, useState } from 'react';
import { MediaAdminSummary, adminGetMedia } from '../../lib';

export default function AdminMidiaPage() {
  const [items, setItems] = useState<MediaAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
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
                <p>Ordem: {item.sortOrder}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
