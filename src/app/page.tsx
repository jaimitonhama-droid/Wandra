// Hero uses CSS gradient background — no image import needed
import Link from "next/link";
import Header from "@/components/Header";
import CategoryCards from "@/components/CategoryCards";
import TrustSection from "@/components/TrustSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { IconBook, IconGraduation, IconStar } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          id="hero"
          className="hero-section"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            overflow: "hidden",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Fundo: Gradiente profissional azul-escuro */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: -1,
              background: "linear-gradient(145deg, #0a0d14 0%, #0d1b2a 30%, #1b2d45 60%, #162032 80%, #0a0d14 100%)",
            }}
          >
            {/* Glow sutil superior-direito */}
            <div
              style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(74,158,255,0.08) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            {/* Glow sutil inferior-esquerdo */}
            <div
              style={{
                position: "absolute",
                bottom: "-15%",
                left: "-10%",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            {/* Linha horizontal decorativa sutil */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent 100%)",
              }}
            />
          </div>

          {/* Conteúdo Hero */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", width: "100%" }}>
            {/* Badge de Boas-Vindas */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "50px",
                padding: "6px 16px",
                marginBottom: "20px",
                fontSize: "0.78rem",
                color: "rgba(240,244,248,0.85)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                backdropFilter: "blur(8px)",
                maxWidth: "100%",
              }}
            >
              Plataforma de Moçambique
            </div>

            {/* Título Principal */}
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.75rem, 5.5vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "16px",
                color: "#f0f4f8",
              }}
            >
              O Seu Portal de
              <br />
              <span className="gold-shimmer">Conhecimento Digital</span>
            </h1>

            {/* Subtítulo */}
            <p
              style={{
                color: "rgba(240,244,248,0.6)",
                fontSize: "clamp(0.88rem, 2vw, 1.05rem)",
                lineHeight: 1.65,
                marginBottom: "28px",
                maxWidth: "480px",
              }}
            >
              Explore centenas de livros digitais, vídeo-aulas e e-books.
              Aprenda ao seu ritmo, em qualquer lugar, com pagamentos seguros
              via carteiras locais.
            </p>

            {/* Botões de Acção */}
            <div
              className="hero-buttons-mobile"
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "32px",
              }}
            >
              <Link href="#categorias" className="btn-primary" id="hero-cta-explorar">
                Explorar Categorias ↓
              </Link>
              <Link href="/criar-conta" className="btn-outline" id="hero-cta-conta">
                Criar Conta Gratuita
              </Link>
            </div>

            {/* Mini Stats */}
            <div
              style={{
                display: "flex",
                gap: "10px 18px",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: IconBook, text: "800+ Títulos" },
                { icon: IconGraduation, text: "10K+ Leitores" },
                { icon: IconStar, text: "4.9 Avaliação" },
              ].map((s) => (
                <div
                  key={s.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(240,244,248,0.6)",
                    fontSize: "0.8rem",
                    background: "rgba(255,255,255,0.03)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <s.icon size={14} style={{ color: "#c9a84c" }} />
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>{`
          .hero-section {
            min-height: 80vh;
            padding: 110px 40px 70px;
          }
          @media (max-width: 768px) {
            .hero-section {
              min-height: auto !important;
              padding: 85px 16px 36px !important;
            }
          }
        `}</style>

        {/* ===== CARTÕES DE CATEGORIA ===== */}
        <CategoryCards />

        {/* ===== DEPOIMENTOS ===== */}
        <Testimonials />

        {/* ===== SECÇÃO DE CONFIANÇA ===== */}
        <TrustSection />
      </main>

      <Footer />
    </>
  );
}
