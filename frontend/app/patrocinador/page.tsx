'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, Mail, Ticket } from 'lucide-react';
import { PublicEmptyPanel } from '@/components/public/empty-panel';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  SponsorPortalSession,
  getSponsorPortalSession,
  requestSponsorPortalAccess,
} from '../lib';

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function PatrocinadorPage() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<SponsorPortalSession | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get('token');

    if (!token) {
      return;
    }

    setLoadingSession(true);
    setError(null);
    setMessage(null);

    void getSponsorPortalSession(token)
      .then((data) => {
        setSession(data);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir portal');
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await requestSponsorPortalAccess({ email });
      setMessage('Se houver um patrocinador vinculado a este e-mail, enviamos um link de acesso.');
      setEmail('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao solicitar acesso ao portal do patrocinador',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="Portal do patrocinador"
        title="Acompanhe sua cota e seus cupons"
        description="Solicite um link de acesso por e-mail para visualizar o status da sua cota, cortesias e cupons gerados."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/patrocinio">Voltar para cotas</Link>
          </Button>
        }
      />

      <PublicSection className="pt-2">
        <PublicSectionShell className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Receber link de acesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>E-mail do patrocinador</span>
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>

                {message ? <p className="success-text">{message}</p> : null}
                {error ? <p className="error-text">{error}</p> : null}

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="rounded-full" disabled={submitting || !email}>
                    {submitting ? 'Enviando...' : 'Enviar link'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <PublicStatCard
              title="Acesso"
              value={loadingSession ? 'Carregando' : session ? 'Ativo' : 'Email'}
              detail="O portal abre com link assinado enviado ao patrocinador."
              icon={Mail}
            />
            <PublicStatCard
              title="Cupons"
              value={session?.coupons.length ?? 0}
              detail="Quantidade total de cortesias emitidas para a cota carregada."
              icon={Ticket}
            />
            <PublicStatCard
              title="Pagamento"
              value={session?.sponsor.paymentDate ? 'Confirmado' : 'Pendente'}
              detail="Status financeiro conforme registro administrativo atual."
              icon={CreditCard}
            />
          </div>
        </PublicSectionShell>
      </PublicSection>

      {session ? (
        <>
          <PublicSection className="py-4">
            <PublicSectionShell className="grid gap-4 md:grid-cols-3">
              <PublicStatCard
                title="Patrocinador"
                value={session.sponsor.companyName}
                detail={session.sponsor.contactName}
                icon={Mail}
              />
              <PublicStatCard
                title="Cota"
                value={session.sponsor.quota.level.toUpperCase()}
                detail={formatMoney(session.sponsor.quota.price)}
                icon={CreditCard}
              />
              <PublicStatCard
                title="Cupons"
                value={session.coupons.length}
                detail={`Status: ${session.sponsor.status}`}
                icon={Ticket}
              />
            </PublicSectionShell>
          </PublicSection>

          <PublicSection className="pt-2">
            <PublicSectionShell className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                    Resumo da cota
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm leading-7 text-slate-600">
                  <p>E-mail: {session.sponsor.email}</p>
                  <p>Telefone: {session.sponsor.phone || 'Nao informado'}</p>
                  <p>Cortesias previstas: {session.sponsor.quota.courtesyCount}</p>
                  <p>Beneficios: {session.sponsor.quota.benefits || 'A definir'}</p>
                  <p>
                    Pagamento:{' '}
                    {session.sponsor.paymentDate
                      ? new Date(session.sponsor.paymentDate).toLocaleString('pt-BR')
                      : 'Ainda nao confirmado'}
                  </p>
                  <p>Observacoes: {session.sponsor.paymentNotes || 'Sem observacoes registradas'}</p>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                    Cupons gerados
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {session.coupons.length === 0 ? (
                    <PublicEmptyPanel
                      title="Nenhum cupom gerado"
                      description="Nenhum cupom foi gerado para esta cota ainda."
                    />
                  ) : (
                    session.coupons.map((coupon) => (
                      <article
                        key={coupon.id}
                        className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-black text-slate-950">{coupon.code}</h3>
                            <p className="text-sm font-semibold text-slate-500">{coupon.status}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-1 text-sm leading-7 text-slate-600">
                          <p>Gerado em: {new Date(coupon.createdAt).toLocaleString('pt-BR')}</p>
                          <p>
                            Utilizado por:{' '}
                            {coupon.athlete
                              ? `${coupon.athlete.name} (${coupon.athlete.cpf})`
                              : 'Nao utilizado'}
                          </p>
                          <p>
                            Data de uso:{' '}
                            {coupon.redeemedAt
                              ? new Date(coupon.redeemedAt).toLocaleString('pt-BR')
                              : 'Ainda disponivel'}
                          </p>
                        </div>
                      </article>
                    ))
                  )}
                </CardContent>
              </Card>
            </PublicSectionShell>
          </PublicSection>
        </>
      ) : null}
    </main>
  );
}
