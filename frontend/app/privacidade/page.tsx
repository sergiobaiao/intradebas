export default function PrivacidadePage() {
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
              encaminhadas pelo canal oficial de suporte informado abaixo. O fluxo completo de
              exclusao ainda esta em evolucao no produto, mas o canal de atendimento ja esta
              disponivel para registro manual das demandas.
            </p>
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
