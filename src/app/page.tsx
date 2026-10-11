import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import CategoryCards from "@/components/CategoryCards";
import TrustSection from "@/components/TrustSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          id="hero"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "120px 24px 80px",
            overflow: "hidden",
          }}
        >
          {/* Fundo: Imagem + Overlay Escuro */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src="/hero_background.jpg"
              alt="Portal de conhecimento"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(10,13,20,0.6) 0%, rgba(10,13,20,0.75) 50%, rgba(10,13,20,1) 100%)",
              }}
            />
          </div>

          {/* Partículas decorativas */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "20%",
              left: "8%",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#c9a84c",
              opacity: 0.6,
              animation: "float 5s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "35%",
              right: "12%",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#4a9eff",
              opacity: 0.5,
              animation: "float 7s ease-in-out infinite 1s",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "30%",
              left: "15%",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#34d399",
              opacity: 0.35,
              animation: "float 6s ease-in-out infinite 0.5s",
            }}
          />

          {/* Conteúdo Hero */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: "760px" }}>
            {/* Badge de Boas-Vindas */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "50px",
                padding: "7px 20px",
                marginBottom: "32px",
                fontSize: "0.82rem",
                color: "#c9a84c",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              <span style={{ fontSize: "1rem" }}>🌟</span>
              A Plataforma de Conhecimento de Moçambique
            </div>

            {/* Título Principal */}
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "24px",
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
                color: "rgba(240,244,248,0.75)",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                lineHeight: 1.8,
                marginBottom: "40px",
                maxWidth: "580px",
                margin: "0 auto 40px",
              }}
            >
              Explore centenas de livros digitais, vídeo-aulas e e-books.
              Aprenda ao seu ritmo, em qualquer lugar, com pagamentos seguros
              via carteiras locais.
            </p>

            {/* Botões de Acção */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "56px",
              }}
            >
              <Link href="#categorias" className="btn-primary" id="hero-cta-explorar">
                Explorar Categorias ↓
              </Link>
              <Link href="/criar-conta" className="btn-outline" id="hero-cta-conta">
                Criar Conta Gratuita
              </Link>
            </div>

            {/* Mini Stats abaixo dos botões */}
            <div
              style={{
                display: "flex",
                gap: "32px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { emoji: "📚", text: "800+ Títulos" },
                { emoji: "🎓", text: "10K+ Leitores" },
                { emoji: "⭐", text: "4.9 Avaliação" },
              ].map((s) => (
                <div
                  key={s.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "rgba(240,244,248,0.6)",
                    fontSize: "0.88rem",
                  }}
                >
                  <span>{s.emoji}</span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seta de Scroll */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "float 2.5s ease-in-out infinite",
              color: "rgba(240,244,248,0.3)",
              fontSize: "1.4rem",
            }}
          >
            ↓
          </div>
        </section>

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
