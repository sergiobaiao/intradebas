'use client';

import { useEffect, useState } from 'react';
import { BackdropSponsorSummary, SponsorAdminSummary, adminFetchJson } from '../../lib';

export default function AdminBackdropPage() {
  const [backdrop, setBackdrop] = useState<BackdropSponsorSummary[]>([]);
  const [sponsors, setSponsors] = useState<SponsorAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedBackdrop, loadedSponsors] = await Promise.all([
        adminFetchJson<BackdropSponsorSummary[]>('/backdrop'),
        adminFetchJson<SponsorAdminSummary[]>('/sponsors'),
      ]);
      setBackdrop(loadedBackdrop);
      setSponsors(loadedSponsors);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar backdrop');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Backdrop</span>
        <h1>Gestao do backdrop digital</h1>
        <p>Ordem de exibicao e publicacao visual dos patrocinadores ativos.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando backdrop...</p> : null}
        {!loading ? (
          <>
            <div className="review-grid">
              {backdrop.map((item) => (
                <article key={item.id} className="card review-card">
                  <h3>{item.companyName}</h3>
                  <p>Nivel: {item.level.toUpperCase()}</p>
                  <p>Prioridade: {item.backdropPriority}</p>
                  <p>Logo: {item.logoUrl ? 'publicada' : 'nao enviada'}</p>
                </article>
              ))}
            </div>
            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Patrocinadores ainda fora do backdrop ativo</h2>
              <p>{sponsors.filter((sponsor) => sponsor.status !== 'active').length} patrocinadores pendentes/inativos.</p>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
