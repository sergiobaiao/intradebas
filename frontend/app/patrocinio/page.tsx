'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Gift, Layers3 } from 'lucide-react';
import { PublicEmptyPanel } from '@/components/public/empty-panel';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  SponsorshipQuotaSummary,
  createSponsorInterest,
  getSponsorshipQuotas,
} from '../lib';

export default function PatrocinioPage() {
  const [quotas, setQuotas] = useState<SponsorshipQuotaSummary[]>([]);
  const [selectedQuotaId, setSelectedQuotaId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getSponsorshipQuotas().then((data) => {
      setQuotas(data);
      if (data[0] && !selectedQuotaId) {
        setSelectedQuotaId(data[0].id);
      }
    });
  }, [selectedQuotaId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await createSponsorInterest({
        companyName,
        contactName,
        email,
        phone,
        quotaId: selectedQuotaId,
      });
      setMessage('Interesse registrado com sucesso. A comissao entrara em contato.');
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao registrar interesse');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="Patrocinio"
        title="Cotas comerciais com disponibilidade real"
        description="Veja a disponibilidade das cotas e registre seu interesse de patrocinio a partir dos dados reais do backend."
        actions={
          <>
            <Button asChild className="rounded-full">
              <Link href="/patrocinador">Ja sou patrocinador</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/backdrop">Ver backdrop</Link>
            </Button>
          </>
        }
      />

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-3">
          <PublicStatCard
            title="Cotas publicadas"
            value={quotas.length}
            detail="Niveis comerciais ativos no portal."
            icon={Briefcase}
          />
          <PublicStatCard
            title="Vagas restantes"
            value={quotas.reduce((sum, quota) => sum + quota.remainingSlots, 0)}
            detail="Capacidade ainda aberta para patrocinio."
            icon={Layers3}
          />
          <PublicStatCard
            title="Cortesias previstas"
            value={quotas.reduce((sum, quota) => sum + quota.courtesyCount, 0)}
            detail="Potencial total de cupons/cortesias das cotas publicadas."
            icon={Gift}
          />
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Niveis de patrocinio
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {quotas.length === 0 ? (
                <PublicEmptyPanel
                  title="Nenhuma cota publicada"
                  description="As cotas aparecerao aqui assim que forem configuradas no painel administrativo."
                />
              ) : (
                quotas.map((quota) => (
                  <article
                    key={quota.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-950">
                          {quota.level.toUpperCase()}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {quota.benefits ?? 'Beneficios a definir'}
                        </p>
                      </div>
                      <strong className="text-xl font-black text-slate-950">
                        R$ {quota.price.toFixed(2)}
                      </strong>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      {quota.remainingSlots} vagas restantes de {quota.maxSlots}
                    </p>
                  </article>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Tenho interesse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Empresa</span>
                  <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Contato</span>
                  <Input value={contactName} onChange={(event) => setContactName(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>E-mail</span>
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Telefone</span>
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Cota</span>
                  <Select value={selectedQuotaId} onValueChange={setSelectedQuotaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cota" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotas.map((quota) => (
                        <SelectItem
                          key={quota.id}
                          value={quota.id}
                          disabled={quota.remainingSlots <= 0}
                        >
                          {quota.level.toUpperCase()} - {quota.remainingSlots} vagas restantes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                {message ? <p className="success-text md:col-span-2">{message}</p> : null}
                {error ? <p className="error-text md:col-span-2">{error}</p> : null}

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <Button type="submit" className="rounded-full" disabled={submitting || !selectedQuotaId}>
                    {submitting ? 'Enviando...' : 'Registrar interesse'}
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/patrocinador">Entrar no portal do patrocinador</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </PublicSectionShell>
      </PublicSection>
    </main>
  );
}
