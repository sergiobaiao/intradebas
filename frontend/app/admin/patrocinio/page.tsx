'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CouponAdminSummary,
  adminCreateSponsorCoupon,
  adminExpireCoupon,
  SponsorAdminSummary,
  adminActivateSponsor,
  adminGetCouponsPage,
  adminGetSponsorCoupons,
  adminGetSponsorsPage,
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
  const [sponsorPage, setSponsorPage] = useState(1);
  const [sponsorTotalPages, setSponsorTotalPages] = useState(1);
  const [couponPage, setCouponPage] = useState(1);
  const [couponTotalPages, setCouponTotalPages] = useState(1);
  const [sponsorStatusFilter, setSponsorStatusFilter] = useState('');
  const [couponStatusFilter, setCouponStatusFilter] = useState('');

  useEffect(() => {
    void loadData();
  }, [sponsorPage, couponPage, sponsorStatusFilter, couponStatusFilter]);

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
        adminGetSponsorsPage({
          page: sponsorPage,
          pageSize: 8,
          status: sponsorStatusFilter,
        }),
        adminGetCouponsPage({
          page: couponPage,
          pageSize: 8,
          status: couponStatusFilter,
          sponsorId: selectedSponsorId || undefined,
        }),
      ]);
      const loadedQuotas = await getSponsorshipQuotas();
      setSponsors(loadedSponsors.items);
      setSponsorTotalPages(loadedSponsors.totalPages);
      setQuotas(loadedQuotas);
      setAllCoupons(loadedCoupons.items);
      setCouponTotalPages(loadedCoupons.totalPages);
      setSelectedSponsorId((current) => current || loadedSponsors.items[0]?.id || '');
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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Comercial</span>
          <h1>Patrocinio</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <div className="admin-metric-grid">
         <article className="admin-metric-card">
           <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Total Patrocinadores</span>
           <strong>{sponsors.length}</strong>
           <p>Empresas cadastradas no sistema.</p>
         </article>
         <article className="admin-metric-card success">
           <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Cupons Ativos</span>
           <strong>{allCoupons.filter(c => c.status === 'active').length}</strong>
           <p>Disponiveis para resgate.</p>
         </article>
         <article className="admin-metric-card attention">
           <span className="admin-kicker" style={{ fontSize: '0.65rem' }}>Cupons Usados</span>
           <strong>{allCoupons.filter(c => c.status === 'used').length}</strong>
           <p>Inscricoes realizadas via cortesia.</p>
         </article>
      </div>

      <div className="admin-content-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Lista de Patrocinadores</h2>
              <p>Gerencie empresas e ativacao de cotas.</p>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
             <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Filtrar por Status</span>
              <select
                style={{ width: '100%', minHeight: '36px', borderRadius: '10px', marginTop: '4px' }}
                value={sponsorStatusFilter}
                onChange={(event) => {
                  setSponsorPage(1);
                  setSponsorStatusFilter(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </label>
          </div>

          {loading ? (
             <div className="admin-empty-state"><strong>Carregando...</strong></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Cota</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id} style={{ background: selectedSponsorId === sponsor.id ? '#f7f7f5' : 'transparent' }}>
                      <td>
                        <button 
                          style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                          onClick={() => setSelectedSponsorId(sponsor.id)}
                        >
                          <strong>{sponsor.companyName}</strong><br/>
                          <small style={{ color: '#6b7280' }}>{sponsor.contactName}</small>
                        </button>
                      </td>
                      <td>{sponsor.quota.level.toUpperCase()}</td>
                      <td>
                        <span className={`admin-table-status status-pill ${sponsor.status}`}>
                          {sponsor.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            className="admin-topbar-actions a" 
                            style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem' }}
                            onClick={() => setSelectedSponsorId(sponsor.id)}
                          >
                            Ver
                          </button>
                          {sponsor.status === 'pending' ? (
                            <button
                              className="admin-topbar-actions a"
                              style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem', background: '#111827', color: '#fff' }}
                              type="button"
                              onClick={() => void activateSponsor(sponsor.id)}
                              disabled={activatingSponsorId === sponsor.id}
                            >
                              {activatingSponsorId === sponsor.id ? '...' : 'Ativar'}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="admin-topbar-actions" style={{ marginTop: '16px', justifyContent: 'center' }}>
            <button
              className="admin-topbar-actions a"
              style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
              type="button"
              disabled={sponsorPage <= 1 || loading}
              onClick={() => setSponsorPage((current) => Math.max(current - 1, 1))}
            >
              Anterior
            </button>
            <span className="admin-kicker">Pagina {sponsorPage} de {sponsorTotalPages}</span>
            <button
              className="admin-topbar-actions a"
              style={{ minHeight: '32px', padding: '0 10px', fontSize: '0.85rem' }}
              type="button"
              disabled={sponsorPage >= sponsorTotalPages || loading}
              onClick={() => setSponsorPage((current) => current + 1)}
            >
              Proxima
            </button>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Edicao do Patrocinador</h2>
          </div>
          {!selectedSponsor ? (
            <div className="admin-empty-state">
               <span>Selecione um patrocinador na lista ao lado para editar.</span>
            </div>
          ) : (
            <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSponsorSave}>
              <label className="field-span">
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Empresa</span>
                <input style={{ minHeight: '38px', borderRadius: '10px' }} value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Contato</span>
                <input style={{ minHeight: '38px', borderRadius: '10px' }} value={contactName} onChange={(event) => setContactName(event.target.value)} />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>E-mail</span>
                <input style={{ minHeight: '38px', borderRadius: '10px' }} value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Telefone</span>
                <input style={{ minHeight: '38px', borderRadius: '10px' }} value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Status</span>
                <select
                  style={{ minHeight: '38px', borderRadius: '10px' }}
                  value={status}
                  onChange={(event) => setStatus(event.target.value as SponsorAdminSummary['status'])}
                >
                  <option value="pending">Pendente</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </label>
              <label className="field-span">
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Cota</span>
                <select style={{ minHeight: '38px', borderRadius: '10px' }} value={quotaId} onChange={(event) => setQuotaId(event.target.value)}>
                  {quotas.map((quota) => (
                    <option key={quota.id} value={quota.id}>
                      {quota.level.toUpperCase()} · {quota.courtesyCount} cortesias
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-topbar-actions field-span" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
                <button className="admin-quick-action" style={{ minHeight: '40px', padding: '0 20px' }} type="submit" disabled={savingSponsor || !quotaId}>
                  {savingSponsor ? 'Salvando...' : 'Salvar alteracoes'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Cupons de Cortesia</h2>
            <p>{selectedSponsor ? `Cupons gerados para ${selectedSponsor.companyName}` : 'Selecione um patrocinador para ver os cupons.'}</p>
          </div>
          {selectedSponsor ? (
            <div className="admin-topbar-actions" style={{ marginTop: 0 }}>
              <button
                className="admin-quick-action"
                style={{ minHeight: '34px', padding: '0 14px', fontSize: '0.85rem' }}
                type="button"
                onClick={() => createCoupon()}
                disabled={creatingCoupon}
              >
                {creatingCoupon ? '...' : 'Gerar cupom extra'}
              </button>
            </div>
          ) : null}
        </div>

        {couponLoading ? (
           <div className="admin-empty-state"><strong>Carregando cupons...</strong></div>
        ) : null}

        {!couponLoading && selectedCoupons.length === 0 && selectedSponsor ? (
          <div className="admin-empty-state">
            <span>Nenhum cupom gerado para este patrocinador.</span>
          </div>
        ) : null}

        {!couponLoading && selectedCoupons.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Status</th>
                  <th>Resgatado por</th>
                  <th>Data de Uso</th>
                  <th style={{ textAlign: 'right' }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {selectedCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td><strong>{coupon.code}</strong></td>
                    <td>
                      <span className={`admin-table-status status-pill ${coupon.status}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {coupon.athlete ? (
                        <a href={`/admin/atletas/${coupon.athlete.id}`}>{coupon.athlete.name}</a>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                      {coupon.redeemedAt ? new Date(coupon.redeemedAt).toLocaleString('pt-BR') : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {coupon.status === 'active' ? (
                        <button
                          className="admin-topbar-actions a"
                          style={{ minHeight: '30px', padding: '0 8px', fontSize: '0.8rem', borderColor: 'rgba(230, 57, 70, 0.2)' }}
                          type="button"
                          onClick={() => expireCoupon(coupon.id)}
                          disabled={expiringCouponId === coupon.id}
                        >
                          {expiringCouponId === coupon.id ? '...' : 'Expirar'}
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
