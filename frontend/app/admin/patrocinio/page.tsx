'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CouponAdminSummary,
  SponsorAdminSummary,
  adminGetCoupons,
  adminGetSponsorCoupons,
  adminGetSponsors,
} from '../../lib';

export default function AdminPatrocinioPage() {
  const [sponsors, setSponsors] = useState<SponsorAdminSummary[]>([]);
  const [allCoupons, setAllCoupons] = useState<CouponAdminSummary[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>('');
  const [selectedCoupons, setSelectedCoupons] = useState<CouponAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedSponsorId) {
      setSelectedCoupons([]);
      return;
    }

    void loadSponsorCoupons(selectedSponsorId);
  }, [selectedSponsorId]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [loadedSponsors, loadedCoupons] = await Promise.all([
        adminGetSponsors(),
        adminGetCoupons(),
      ]);
      setSponsors(loadedSponsors);
      setAllCoupons(loadedCoupons);
      setSelectedSponsorId((current) => current || loadedSponsors[0]?.id || '');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar patrocinio');
    } finally {
      setLoading(false);
    }
  }

  async function loadSponsorCoupons(sponsorId: string) {
    setCouponLoading(true);
    setError(null);

    try {
      const loaded = await adminGetSponsorCoupons(sponsorId);
      setSelectedCoupons(loaded);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar cupons');
    } finally {
      setCouponLoading(false);
    }
  }

  const selectedSponsor = useMemo(
    () => sponsors.find((sponsor) => sponsor.id === selectedSponsorId) ?? null,
    [selectedSponsorId, sponsors],
  );

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Patrocinio</span>
        <h1>Gestao comercial e cupons</h1>
        <p>Visualizacao operacional de patrocinadores, cotas contratadas e status dos cupons de cortesia.</p>

        <div className="cta-row">
          <a className="button secondary" href="/admin/dashboard">
            Voltar ao dashboard
          </a>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {loading ? <p>Carregando patrocinadores...</p> : null}

        {!loading ? (
          <>
            <div className="review-grid" style={{ marginTop: '24px' }}>
              {sponsors.map((sponsor) => (
                <article key={sponsor.id} className="card review-card">
                  <div className="review-header">
                    <div>
                      <h3>{sponsor.companyName}</h3>
                      <small>{sponsor.contactName}</small>
                    </div>
                    <span className={`status-pill ${sponsor.status}`}>{sponsor.status}</span>
                  </div>
                  <p>E-mail: {sponsor.email}</p>
                  <p>Cota: {sponsor.quota.level.toUpperCase()} · {sponsor.quota.courtesyCount} cortesias</p>
                  <p>Cupons gerados: {sponsor.couponCount}</p>
                  <div className="cta-row">
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setSelectedSponsorId(sponsor.id)}
                    >
                      Ver cupons
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Resumo geral de cupons</h2>
              <p>Total monitorado: {allCoupons.length}</p>
              <p>
                Ativos: {allCoupons.filter((coupon) => coupon.status === 'active').length} · Usados:{' '}
                {allCoupons.filter((coupon) => coupon.status === 'used').length}
              </p>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h2>
                {selectedSponsor
                  ? `Cupons de ${selectedSponsor.companyName}`
                  : 'Selecione um patrocinador para ver os cupons'}
              </h2>
              {couponLoading ? <p>Carregando cupons...</p> : null}
              {!couponLoading && selectedCoupons.length === 0 ? (
                <p>Nenhum cupom encontrado para este patrocinador.</p>
              ) : null}
              {!couponLoading && selectedCoupons.length > 0 ? (
                <div className="review-grid">
                  {selectedCoupons.map((coupon) => (
                    <article key={coupon.id} className="card review-card">
                      <div className="review-header">
                        <div>
                          <h3>{coupon.code}</h3>
                          <small>{coupon.sponsor.companyName}</small>
                        </div>
                        <span className={`status-pill ${coupon.status}`}>{coupon.status}</span>
                      </div>
                      <p>Gerado em: {new Date(coupon.createdAt).toLocaleString('pt-BR')}</p>
                      <p>
                        Resgatado por:{' '}
                        {coupon.athlete ? `${coupon.athlete.name} (${coupon.athlete.cpf})` : 'Nao utilizado'}
                      </p>
                      <p>
                        Data de uso:{' '}
                        {coupon.redeemedAt
                          ? new Date(coupon.redeemedAt).toLocaleString('pt-BR')
                          : 'Nao utilizada'}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
