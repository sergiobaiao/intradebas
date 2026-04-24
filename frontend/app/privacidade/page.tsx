'use client';

import { FormEvent, useState } from 'react';
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
    <main className="section">
      <div className="shell">
        <div className="card privacy-card">
          <span className="eyebrow">LGPD</span>
          <h1>Politica de privacidade</h1>
          <p>
            Esta pagina resume como o portal INTRADEBAS 2026 trata dados pessoais de atletas,
            patrocinadores e usuarios administrativos no contexto operacional do evento.
          </p>

          <section className="privacy-section">
            <h2>Dados coletados</h2>
            <p>
              Coletamos informacoes cadastrais necessarias para inscricoes, operacao de equipes,
              patrocinio, publicacao de resultados, contato operacional e registro de consentimento
              LGPD.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Finalidade do tratamento</h2>
            <p>
              Os dados sao usados para validar inscricoes, vincular atletas e patrocinadores aos
              modulos do evento, registrar resultados, manter auditoria administrativa e permitir
              comunicacao institucional relacionada ao INTRADEBAS 2026.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Compartilhamento e armazenamento</h2>
            <p>
              O tratamento ocorre na infraestrutura operacional do projeto, com acesso restrito a
              perfis autorizados da comissao organizadora. Arquivos de midia e dados operacionais
              sao armazenados em servicos tecnicos vinculados ao ambiente do portal.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Direitos do titular</h2>
            <p>
              Solicitacoes relacionadas a acesso, correcao ou exclusao de dados pessoais podem ser
              encaminhadas pelo formulario abaixo. A triagem e a execucao administrativa continuam
              sob responsabilidade da comissao organizadora.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Solicitar exclusao de dados</h2>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                <span>Nome do solicitante</span>
                <input value={requesterName} onChange={(event) => setRequesterName(event.target.value)} />
              </label>
              <label>
                <span>CPF do titular dos dados</span>
                <input
                  value={athleteCpf}
                  onChange={(event) => setAthleteCpf(event.target.value)}
                  placeholder="000.000.000-00"
                />
              </label>
              <label>
                <span>E-mail</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                <span>Telefone</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label className="field-span">
                <span>Motivo</span>
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={5} />
              </label>

              {message ? <p className="success-text field-span">{message}</p> : null}
              {error ? <p className="error-text field-span">{error}</p> : null}

              <div className="cta-row field-span">
                <button className="button primary" type="submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Registrar solicitacao'}
                </button>
              </div>
            </form>
          </section>

          <section className="privacy-section">
            <h2>Contato</h2>
            <p>
              Responsavel organizacional: Manoel Neto. Para suporte e solicitacoes relacionadas a
              privacidade, utilize o canal oficial:
            </p>
            <div className="cta-row">
              <a
                className="button primary"
                href="https://wa.me/5586988265569?text=Ola%2C%20preciso%20de%20suporte%20sobre%20privacidade%20no%20portal%20INTRADEBAS%202026."
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
              <a className="button secondary" href="/">
                Voltar para a home
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
