export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="shell public-footer-grid">
        <div>
          <strong>INTRADEBAS 2026 + ALDEBARUN</strong>
          <p>
            Portal oficial dos Jogos Internos do Aldebaran Ville com inscricoes, patrocinio,
            resultados, backdrop e operacao administrativa centralizada.
          </p>
        </div>

        <div className="public-footer-links">
          <a href="/privacidade">Politica de privacidade</a>
          <a
            href="https://wa.me/5586988265569?text=Ola%2C%20preciso%20de%20suporte%20no%20portal%20INTRADEBAS%202026."
            target="_blank"
            rel="noreferrer"
          >
            Suporte via WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
