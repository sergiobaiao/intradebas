'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CouponAdminSummary,
  adminCreateSponsorCoupon,
  adminExpireCoupon,
  SponsorAdminSummary,
  adminActivateSponsor,
  adminGetCoupons,
  adminGetSponsorCoupons,
  adminGetSponsors,
  adminUpdateSponsor,
  getSponsorshipQuotas,
  SponsorshipQuotaSummary,
} from '../../lib';

export default function AdminPatrocinioPage() {
  const [sponsors, setSponsors] = useState<SponsorAdminSummary[]>([]);
  const [quotas, setQuotas] = useState<SponsorshipQuotaSummary[]>([]);
  const [allCoupons, setAllCoupons] = useState<CouponAdminSummary[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>('');
  const [selectedCoupons, setSelectedCoupons] = useState<CouponAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [activatingSponsorId, setActivatingSponsorId] = useState<string | null>(null);
  const [savingSponsor, setSavingSponsor] = useState(false);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [expiringCouponId, setExpiringCouponId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [quotaId, setQuotaId] = useState('');
  const [status, setStatus] = useState<SponsorAdminSummary['status']>('pending');

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
      const loadedQuotas = await getSponsorshipQuotas();
      setSponsors(loadedSponsors);
      setQuotas(loadedQuotas);
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

  async function activateSponsor(sponsorId: string) {
    setActivatingSponsorId(sponsorId);
    setError(null);

    try {
      await adminActivateSponsor(sponsorId);
      await loadData();

      if (selectedSponsorId === sponsorId) {
        await loadSponsorCoupons(sponsorId);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Falha ao ativar patrocinador',
      );
    } finally {
      setActivatingSponsorId(null);
    }
  }

  const selectedSponsor = useMemo(
    () => sponsors.find((sponsor) => sponsor.id === selectedSponsorId) ?? null,
    [selectedSponsorId, sponsors],
  );

  useEffect(() => {
    if (!selectedSponsor) {
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setLogoUrl('');
      setQuotaId('');
      setStatus('pending');
      return;
    }

    setCompanyName(selectedSponsor.companyName);
    setContactName(selectedSponsor.contactName);
    setEmail(selectedSponsor.email);
    setPhone(selectedSponsor.phone ?? '');
    setLogoUrl(selectedSponsor.logoUrl ?? '');
    setQuotaId(selectedSponsor.quota.id);
    setStatus(selectedSponsor.status);
  }, [selectedSponsor]);

  async function handleSponsorSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSponsor) {
      return;
    }

    setSavingSponsor(true);
    setError(null);

    try {
      await adminUpdateSponsor(selectedSponsor.id, {
        companyName,
        contactName,
        email,
        phone: phone || undefined,
        logoUrl: logoUrl || undefined,
        quotaId,
        status,
      });
      await loadData();
      await loadSponsorCoupons(selectedSponsor.id);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Falha ao atualizar patrocinador',
      );
    } finally {
      setSavingSponsor(false);
    }
  }

  async function createCoupon() {
    if (!selectedSponsor) {
      return;
    }

    setCreatingCoupon(true);
    setError(null);

    try {
      await adminCreateSponsorCoupon(selectedSponsor.id);
      await loadData();
      await loadSponsorCoupons(selectedSponsor.id);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao gerar cupom');
    } finally {
      setCreatingCoupon(false);
    }
  }

  async function expireCoupon(couponId: string) {
    setExpiringCouponId(couponId);
    setError(null);

    try {
      await adminExpireCoupon(couponId);
      if (selectedSponsorId) {
        await loadSponsorCoupons(selectedSponsorId);
      }
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao expirar cupom');
    } finally {
      setExpiringCouponId(null);
    }
  }

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
                    {sponsor.status === 'pending' ? (
                      <button
                        className="button"
                        type="button"
                        onClick={() => void activateSponsor(sponsor.id)}
                        disabled={activatingSponsorId === sponsor.id}
                      >
                        {activatingSponsorId === sponsor.id ? 'Ativando...' : 'Ativar'}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h2>Edicao do patrocinador selecionado</h2>
              {!selectedSponsor ? <p>Selecione um patrocinador para editar.</p> : null}
              {selectedSponsor ? (
                <form className="form-grid" onSubmit={handleSponsorSave}>
                  <label>
                    Empresa
                    <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
                  </label>
                  <label>
                    Contato
                    <input value={contactName} onChange={(event) => setContactName(event.target.value)} />
                  </label>
                  <label>
                    E-mail
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
                  </label>
                  <label>
                    Telefone
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} />
                  </label>
                  <label className="field-span">
                    Logo URL
                    <input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} />
                  </label>
                  <label>
                    Cota
                    <select value={quotaId} onChange={(event) => setQuotaId(event.target.value)}>
                      {quotas.map((quota) => (
                        <option key={quota.id} value={quota.id}>
                          {quota.level.toUpperCase()} · {quota.courtesyCount} cortesias
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as SponsorAdminSummary['status'])}
                    >
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </label>
                  <div className="cta-row field-span">
                    <button className="button" type="submit" disabled={savingSponsor || !quotaId}>
                      {savingSponsor ? 'Salvando...' : 'Salvar patrocinador'}
                    </button>
                  </div>
                </form>
              ) : null}
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
              {selectedSponsor ? (
                <div className="cta-row" style={{ marginBottom: '16px' }}>
                  <button
                    className="button"
                    type="button"
                    onClick={() => createCoupon()}
                    disabled={creatingCoupon}
                  >
                    {creatingCoupon ? 'Gerando...' : 'Gerar cupom extra'}
                  </button>
                </div>
              ) : null}
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
                      {coupon.status === 'active' ? (
                        <div className="cta-row">
                          <button
                            className="button secondary"
                            type="button"
                            onClick={() => expireCoupon(coupon.id)}
                            disabled={expiringCouponId === coupon.id}
                          >
                            {expiringCouponId === coupon.id ? 'Expirando...' : 'Expirar'}
                          </button>
                        </div>
                      ) : null}
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
