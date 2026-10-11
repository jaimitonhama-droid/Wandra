import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data
const ebookMock = {
  id: "e1",
  titulo: "Guia Completo de Investimentos em Moçambique",
  categoria: "Finanças",
  preco: "250 MT",
  paginas: 87,
  formato: "PDF",
  avaliacao: 4.9,
  downloads: 2341,
  descricao:
    "Aprenda a multiplicar o seu dinheiro investindo de forma inteligente no mercado moçambicano. Este guia prático cobre taxas de juro, imobiliário, pequenos negócios e tesouro direto local.",
  cor: "#0f2a1a",
  acento: "#34d399",
  topicos: [
    "Onde investir 1.000 MT, 10.000 MT e 100.000 MT",
    "Como funcionam as obrigações do tesouro",
    "Erros comuns de investidores iniciantes",
    "Diversificação de fontes de rendimento"
  ]
};

export default function EbookDetailPage() {
  return (
    <>
      <Header />
      <main style={{ background: "#0a0e0a", minHeight: "100vh", paddingTop: "80px" }}>
        {/* Banner */}
        <section
          style={{
            background: `linear-gradient(135deg, ${ebookMock.cor}, #0a0e0a)`,
            padding: "80px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decoração bg */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${ebookMock.acento}15 0%, transparent 70%)`,
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: `${ebookMock.acento}22`,
                color: ebookMock.acento,
                padding: "6px 14px",
                borderRadius: "50px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
            >
              {ebookMock.categoria}
            </div>
            
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                lineHeight: 1.15,
                marginBottom: "24px",
                maxWidth: "800px",
              }}
            >
              {ebookMock.titulo}
            </h1>
            
            <div style={{ display: "flex", gap: "24px", color: "#9baab8", fontSize: "0.95rem", marginBottom: "40px", justifyContent: "center" }}>
              <span>📱 E-book {ebookMock.formato}</span>
              <span>📄 {ebookMock.paginas} páginas</span>
              <span style={{ color: "#c9a84c" }}>⭐ {ebookMock.avaliacao}</span>
              <span>⬇ {ebookMock.downloads.toLocaleString()} downloads</span>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "500px",
                width: "100%",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: ebookMock.acento,
                  margin: "0 0 24px 0",
                }}
              >
                {ebookMock.preco}
              </h2>
              <button
                style={{
                  width: "100%",
                  padding: "18px",
                  background: ebookMock.acento,
                  color: "#0a0e0a",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 10px 30px ${ebookMock.acento}33`,
                }}
              >
                Download Imediato
              </button>
            </div>
          </div>
        </section>

        {/* Detalhes */}
        <section
          style={{
            padding: "80px 40px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#f0f4f8",
              marginBottom: "24px",
            }}
          >
            Sobre este E-book
          </h2>
          <p
            style={{
              color: "rgba(240,244,248,0.75)",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            {ebookMock.descricao}
          </p>

          <h3
            style={{
              color: "#f0f4f8",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            O que vai aprender:
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ebookMock.topicos.map((topico, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ color: ebookMock.acento, fontSize: "1.2rem" }}>✓</span>
                <span style={{ color: "#9baab8", fontSize: "1.05rem", lineHeight: 1.5 }}>
                  {topico}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
