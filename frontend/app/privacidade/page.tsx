'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { FileLock2, Scale, ShieldCheck } from 'lucide-react';
import { PublicPageHero } from '@/components/public/page-hero';
import { PublicSection, PublicSectionShell } from '@/components/public/section-shell';
import { PublicStatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createLgpdDeletionRequest } from '../lib';

export default function PrivacidadePage() {
  const [requesterName, setRequesterName] = useState('');
  const [athleteCpf, setAthleteCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createLgpdDeletionRequest({
        requesterName,
        athleteCpf,
        email,
        phone,
        reason,
      });
      setMessage('Solicitacao registrada com sucesso. A comissao organizadora fara a triagem.');
      setRequesterName('');
      setAthleteCpf('');
      setEmail('');
      setPhone('');
      setReason('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao registrar solicitacao LGPD');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pb-8">
      <PublicPageHero
        eyebrow="LGPD"
        title="Privacidade, consentimento e direitos do titular"
        description="Esta pagina resume como o portal INTRADEBAS 2026 trata dados pessoais de atletas, patrocinadores e usuarios administrativos no contexto operacional do evento."
        actions={
          <>
            <Button asChild className="rounded-full">
              <a
                href="https://wa.me/5586988265569?text=Ola%2C%20preciso%20de%20suporte%20sobre%20privacidade%20no%20portal%20INTRADEBAS%202026."
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Voltar para a home</Link>
            </Button>
          </>
        }
      />

      <PublicSection className="py-4">
        <PublicSectionShell className="grid gap-4 md:grid-cols-3">
          <PublicStatCard
            title="Consentimento"
            value="Registrado"
            detail="As inscricoes publicas exigem aceite LGPD e rastreamento de consentimento."
            icon={ShieldCheck}
          />
          <PublicStatCard
            title="Direitos"
            value="Acesso e exclusao"
            detail="Titulares podem acionar triagem para revisao ou exclusao de dados."
            icon={Scale}
          />
          <PublicStatCard
            title="Base operacional"
            value="Restrita"
            detail="Dados tratados em infraestrutura controlada da operacao do evento."
            icon={FileLock2}
          />
        </PublicSectionShell>
      </PublicSection>

      <PublicSection className="pt-2">
        <PublicSectionShell className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Politica de privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 text-sm leading-7 text-slate-600">
              <section>
                <h2 className="text-lg font-black text-slate-950">Dados coletados</h2>
                <p>
                  Coletamos informacoes cadastrais necessarias para inscricoes, operacao de equipes,
                  patrocinio, publicacao de resultados, contato operacional e registro de
                  consentimento LGPD.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-black text-slate-950">Finalidade do tratamento</h2>
                <p>
                  Os dados sao usados para validar inscricoes, vincular atletas e patrocinadores aos
                  modulos do evento, registrar resultados, manter auditoria administrativa e
                  permitir comunicacao institucional relacionada ao INTRADEBAS 2026.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-black text-slate-950">Compartilhamento e armazenamento</h2>
                <p>
                  O tratamento ocorre na infraestrutura operacional do projeto, com acesso restrito a
                  perfis autorizados da comissao organizadora. Arquivos de midia e dados
                  operacionais sao armazenados em servicos tecnicos vinculados ao ambiente do portal.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-black text-slate-950">Direitos do titular</h2>
                <p>
                  Solicitacoes relacionadas a acesso, correcao ou exclusao de dados pessoais podem
                  ser encaminhadas pelo formulario ao lado. A triagem e a execucao administrativa
                  continuam sob responsabilidade da comissao organizadora.
                </p>
              </section>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
                Solicitar exclusao de dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Nome do solicitante</span>
                  <Input value={requesterName} onChange={(event) => setRequesterName(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>CPF do titular dos dados</span>
                  <Input
                    value={athleteCpf}
                    onChange={(event) => setAthleteCpf(event.target.value)}
                    placeholder="000.000.000-00"
                  />
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
                  <span>Motivo</span>
                  <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={5} />
                </label>

                {message ? <p className="success-text md:col-span-2">{message}</p> : null}
                {error ? <p className="error-text md:col-span-2">{error}</p> : null}

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <Button type="submit" className="rounded-full" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Registrar solicitacao'}
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
