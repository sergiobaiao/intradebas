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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Marketing</span>
          <h1>Backdrop digital</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <section className="admin-panel" style={{ marginBottom: '22px' }}>
        <div className="admin-panel-header">
           <div>
             <h2>Gestao de exibicao</h2>
             <p>Ordem de prioridade e publicacao visual dos patrocinadores ativos no telao do evento.</p>
           </div>
        </div>
      </section>

      <div className="admin-content-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Patrocinadores em Exibicao</h2>
          </div>

          {loading ? (
             <div className="admin-empty-state"><strong>Carregando...</strong></div>
          ) : backdrop.length === 0 ? (
            <div className="admin-empty-state">
              <span>Nenhum patrocinador ativo para exibicao.</span>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Prioridade</th>
                    <th>Empresa</th>
                    <th>Nivel</th>
                    <th>Logo</th>
                  </tr>
                </thead>
                <tbody>
                  {backdrop.map((item) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center' }}>
                         <span className="admin-table-status" style={{ background: '#111827', color: '#fff', padding: '4px 10px' }}>
                          {item.backdropPriority}
                        </span>
                      </td>
                      <td><strong>{item.companyName}</strong></td>
                      <td>{item.level.toUpperCase()}</td>
                      <td>
                        <span className={`admin-table-status ${item.logoUrl ? 'success' : 'attention'}`}>
                          {item.logoUrl ? 'Publicada' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
           <div className="admin-panel-header">
             <h2>Status do Acervo</h2>
           </div>
           <div className="admin-status-stack">
              <div>
                <span>Ativos no Backdrop</span>
                <strong>{backdrop.length}</strong>
              </div>
              <div>
                <span>Fora do Backdrop</span>
                <strong>{sponsors.filter(s => s.status !== 'active').length}</strong>
              </div>
           </div>
           <p className="admin-kicker" style={{ marginTop: '22px', fontSize: '0.65rem' }}>
             Apenas patrocinadores com status <strong>active</strong> sao elegiveis para exibicao automatica no carrossel do backdrop.
           </p>
        </section>
      </div>
    </div>
  );
}
