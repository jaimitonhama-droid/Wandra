"use client";

import Link from "next/link";
import { IconBook } from "@/components/Icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="main-footer"
      style={{
        background: "rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "48px 40px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "40px",
          }}
          className="footer-grid"
        >
          {/* Marca */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0c1524",
                }}
              >
                <IconBook size={18} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#f0f4f8",
                }}
              >
                Sabedoria<span style={{ color: "#c9a84c" }}>Digital</span>
              </span>
            </div>
            <p style={{ color: "#5a6a7a", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: "260px" }}>
              A sua plataforma de conhecimento em Moçambique. Aprenda com qualidade e confie nos melhores conteúdos digitais.
            </p>
          </div>

          {/* Links Plataforma */}
          <div>
            <h4 style={{ color: "#f0f4f8", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px", letterSpacing: "0.05em" }}>
              Plataforma
            </h4>
            {[
              { label: "Livros", href: "/livros" },
              { label: "Cursos", href: "/cursos" },
              { label: "E-books", href: "/ebooks" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: "block", color: "#5a6a7a", textDecoration: "none", fontSize: "0.88rem", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5a6a7a"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Links Conta */}
          <div>
            <h4 style={{ color: "#f0f4f8", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px", letterSpacing: "0.05em" }}>
              Conta
            </h4>
            {[
              { label: "Criar Conta", href: "/criar-conta" },
              { label: "Entrar", href: "/entrar" },
              { label: "Minha Biblioteca", href: "/biblioteca" },
              { label: "Meus Cursos", href: "/meus-cursos" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: "block", color: "#5a6a7a", textDecoration: "none", fontSize: "0.88rem", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5a6a7a"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Suporte */}
          <div>
            <h4 style={{ color: "#f0f4f8", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px", letterSpacing: "0.05em" }}>
              Suporte
            </h4>
            {[
              { label: "Sobre Nós", href: "/sobre" },
              { label: "Contacto", href: "/contacto" },
              { label: "Termos de Uso", href: "/termos" },
              { label: "Política de Privacidade", href: "/privacidade" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: "block", color: "#5a6a7a", textDecoration: "none", fontSize: "0.88rem", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5a6a7a"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider e Copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "#5a6a7a", fontSize: "0.82rem" }}>
            © {year} SabedoriaDigital. Todos os direitos reservados. Moçambique
          </p>
          <p style={{ color: "#5a6a7a", fontSize: "0.82rem" }}>
            Pagamentos seguros via{" "}
            <span style={{ color: "#c9a84c", fontWeight: 600 }}>Netshop</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #main-footer {
            padding: 36px 16px 24px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
