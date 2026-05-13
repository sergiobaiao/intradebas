'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { AdminDataTable } from '@/components/admin/data-table';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CouponAdminSummary,
  SponsorAdminSummary,
  SponsorshipQuotaSummary,
  adminActivateSponsor,
  adminCreateSponsorCoupon,
  adminExpireCoupon,
  adminGetCouponsPage,
  adminGetSponsorCoupons,
  adminGetSponsorsPage,
  adminUpdateSponsor,
  getSponsorshipQuotas,
} from '../../lib';

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function statusBadgeVariant(status: string): 'outline' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'active':
    case 'used':
      return 'success';
    case 'pending':
      return 'warning';
    case 'inactive':
    case 'expired':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function AdminPatrocinioPage() {
  const [sponsors, setSponsors] = useState<SponsorAdminSummary[]>([]);
  const [quotas, setQuotas] = useState<SponsorshipQuotaSummary[]>([]);
  const [allCoupons, setAllCoupons] = useState<CouponAdminSummary[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState('');
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
      setError(loadError instanceof Error ? loadError.message : 'Falha ao ativar patrocinador');
    } finally {
      setActivatingSponsorId(null);
    }
  }

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
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar patrocinador');
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

  const activeCoupons = allCoupons.filter((coupon) => coupon.status === 'active').length;
  const usedCoupons = allCoupons.filter((coupon) => coupon.status === 'used').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Comercial"
        title="Patrocinios"
        description="Nesta tela voce acompanha patrocinadores, ativa cotas, ajusta dados comerciais e controla os cupons de cortesia associados a cada empresa."
        highlights={[
          'Use a lista principal para revisar status, cota contratada e ativacao de cada patrocinador.',
          'Selecione uma empresa para editar os dados comerciais e administrar os cupons gerados para inscricoes.',
        ]}
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <AdminSurface title="Patrocinadores monitorados" description="Empresas retornadas pela pagina atual do backend.">
          <strong className="block text-4xl font-medium text-[#201515]">{sponsors.length}</strong>
        </AdminSurface>
        <AdminSurface title="Cupons ativos" description="Cortesias prontas para resgate.">
          <strong className="block text-4xl font-medium text-[#201515]">{activeCoupons}</strong>
        </AdminSurface>
        <AdminSurface title="Cupons utilizados" description="Inscricoes ja realizadas por cortesia.">
          <strong className="block text-4xl font-medium text-[#201515]">{usedCoupons}</strong>
        </AdminSurface>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface
          title="Lista de patrocinadores"
          description="Gerencie empresas, cotas e status comercial sem sair desta tela."
          actions={
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#605d52]">
              <span>Pagina {sponsorPage} de {sponsorTotalPages}</span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={sponsorPage <= 1 || loading}
                onClick={() => setSponsorPage((current) => Math.max(current - 1, 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={sponsorPage >= sponsorTotalPages || loading}
                onClick={() => setSponsorPage((current) => current + 1)}
              >
                Proxima
              </Button>
            </div>
          }
        >
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Status comercial">
                <select
                  className={selectClassName}
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
              </AdminField>
              <AdminField label="Patrocinador selecionado" hint="Escolha uma empresa abaixo para editar.">
                <Input value={selectedSponsor?.companyName ?? 'Nenhum selecionado'} disabled />
              </AdminField>
            </div>

            {loading ? (
              <AdminEmptyState title="Carregando..." description="Buscando patrocinadores e cotas configuradas." />
            ) : sponsors.length === 0 ? (
              <AdminEmptyState
                title="Nenhum patrocinador encontrado."
                description="Ajuste o filtro de status ou registre novos interesses pelo fluxo publico."
              />
            ) : (
              <AdminDataTable
                columns={[
                  {
                    key: 'empresa',
                    header: 'Empresa',
                    cell: (sponsor) => (
                      <button
                        className="grid gap-1 text-left"
                        type="button"
                        onClick={() => setSelectedSponsorId(sponsor.id)}
                      >
                        <strong className="text-sm text-[#201515]">{sponsor.companyName}</strong>
                        <span className="text-xs text-[#605d52]">{sponsor.contactName}</span>
                      </button>
                    ),
                  },
                  {
                    key: 'cota',
                    header: 'Cota',
                    cell: (sponsor) => (
                      <span className="text-sm text-[#605d52]">{sponsor.quota.level.toUpperCase()}</span>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    cell: (sponsor) => (
                      <Badge variant={statusBadgeVariant(sponsor.status)}>{sponsor.status}</Badge>
                    ),
                  },
                  {
                    key: 'acoes',
                    header: 'Acoes',
                    className: 'text-right',
                    cell: (sponsor) => (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setSelectedSponsorId(sponsor.id)}>
                          Ver
                        </Button>
                        {sponsor.status === 'pending' ? (
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => void activateSponsor(sponsor.id)}
                            disabled={activatingSponsorId === sponsor.id}
                          >
                            {activatingSponsorId === sponsor.id ? 'Ativando...' : 'Ativar'}
                          </Button>
                        ) : null}
                      </div>
                    ),
                  },
                ]}
                rows={sponsors}
              />
            )}
          </div>
        </AdminSurface>

        <AdminSurface
          title="Edicao do patrocinador"
          description="Atualize dados comerciais, contato principal e a cota vinculada."
        >
          {!selectedSponsor ? (
            <AdminEmptyState
              title="Nenhum patrocinador selecionado."
              description="Escolha uma empresa na tabela ao lado para editar os dados comerciais."
            />
          ) : (
            <form className="grid gap-4" onSubmit={handleSponsorSave}>
              <AdminField label="Empresa" className="md:col-span-2">
                <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </AdminField>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Contato">
                  <Input value={contactName} onChange={(event) => setContactName(event.target.value)} />
                </AdminField>
                <AdminField label="E-mail">
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </AdminField>
                <AdminField label="Telefone">
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
                </AdminField>
                <AdminField label="Status">
                  <select
                    className={selectClassName}
                    value={status}
                    onChange={(event) => setStatus(event.target.value as SponsorAdminSummary['status'])}
                  >
                    <option value="pending">Pendente</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </AdminField>
              </div>
              <AdminField label="Logo publicada (URL)" hint="Opcional para uso no backdrop e na galeria.">
                <Input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} />
              </AdminField>
              <AdminField label="Cota vinculada">
                <select className={selectClassName} value={quotaId} onChange={(event) => setQuotaId(event.target.value)}>
                  {quotas.map((quota) => (
                    <option key={quota.id} value={quota.id}>
                      {quota.level.toUpperCase()} · {quota.courtesyCount} cortesias
                    </option>
                  ))}
                </select>
              </AdminField>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={savingSponsor || !quotaId}>
                  {savingSponsor ? 'Salvando...' : 'Salvar alteracoes'}
                </Button>
              </div>
            </form>
          )}
        </AdminSurface>
      </section>

      <AdminSurface
        title="Cupons de cortesia"
        description={
          selectedSponsor
            ? `Cupons gerados para ${selectedSponsor.companyName}.`
            : 'Selecione um patrocinador para visualizar os cupons associados.'
        }
        actions={
          selectedSponsor ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#605d52]">Pagina {couponPage} de {couponTotalPages}</span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={couponPage <= 1 || loading}
                onClick={() => setCouponPage((current) => Math.max(current - 1, 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={couponPage >= couponTotalPages || loading}
                onClick={() => setCouponPage((current) => current + 1)}
              >
                Proxima
              </Button>
              <Button type="button" size="sm" onClick={() => createCoupon()} disabled={creatingCoupon}>
                {creatingCoupon ? 'Gerando...' : 'Gerar cupom extra'}
              </Button>
            </div>
          ) : null
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Filtrar cupons por status">
              <select
                className={selectClassName}
                value={couponStatusFilter}
                onChange={(event) => {
                  setCouponPage(1);
                  setCouponStatusFilter(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="active">Ativos</option>
                <option value="used">Usados</option>
                <option value="expired">Expirados</option>
              </select>
            </AdminField>
          </div>

          {couponLoading ? (
            <AdminEmptyState title="Carregando cupons..." description="Buscando cortesias vinculadas ao patrocinador selecionado." />
          ) : !selectedSponsor ? (
            <AdminEmptyState
              title="Selecione um patrocinador."
              description="A listagem de cupons depende da empresa escolhida na tabela principal."
            />
          ) : selectedCoupons.length === 0 ? (
            <AdminEmptyState
              title="Nenhum cupom gerado."
              description="Ative a cota ou gere um cupom extra para disponibilizar inscricoes por cortesia."
            />
          ) : (
            <AdminDataTable
              columns={[
                {
                  key: 'codigo',
                  header: 'Codigo',
                  cell: (coupon) => <strong className="text-sm text-[#201515]">{coupon.code}</strong>,
                },
                {
                  key: 'status',
                  header: 'Status',
                  cell: (coupon) => <Badge variant={statusBadgeVariant(coupon.status)}>{coupon.status}</Badge>,
                },
                {
                  key: 'resgate',
                  header: 'Resgatado por',
                  cell: (coupon) =>
                    coupon.athlete ? (
                      <a className="text-sm text-[#201515] underline underline-offset-4" href={`/admin/atletas/${coupon.athlete.id}`}>
                        {coupon.athlete.name}
                      </a>
                    ) : (
                      <span className="text-sm text-[#605d52]">Nao utilizado</span>
                    ),
                },
                {
                  key: 'data',
                  header: 'Data de uso',
                  cell: (coupon) => (
                    <span className="text-sm text-[#605d52]">
                      {coupon.redeemedAt ? new Date(coupon.redeemedAt).toLocaleString('pt-BR') : '—'}
                    </span>
                  ),
                },
                {
                  key: 'acoes',
                  header: 'Acoes',
                  className: 'text-right',
                  cell: (coupon) =>
                    coupon.status === 'active' ? (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => expireCoupon(coupon.id)}
                          disabled={expiringCouponId === coupon.id}
                        >
                          {expiringCouponId === coupon.id ? 'Expirando...' : 'Expirar'}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-[#605d52]">—</span>
                    ),
                },
              ]}
              rows={selectedCoupons}
            />
          )}
        </div>
      </AdminSurface>
    </div>
  );
}
