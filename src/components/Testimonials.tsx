"use client";

import FadeIn from "@/components/FadeIn";
import { IconStar } from "@/components/Icons";

const testimonials = [
  {
    id: 1,
    name: "Ana Machava",
    role: "Estudante Universitária",
    city: "Maputo",
    initials: "AM",
    rating: 5,
    text: "A plataforma mudou a minha forma de estudar. Tenho acesso a livros que nunca encontraria nas livrarias locais, e o pagamento via M-Pesa é super fácil!",
    category: "Livros Digitais",
  },
  {
    id: 2,
    name: "Carlos Nhambiu",
    role: "Empresário",
    city: "Beira",
    initials: "CN",
    rating: 5,
    text: "Os cursos em vídeo são de altíssima qualidade. Fiz o curso de gestão financeira e já aplico os conhecimentos no meu negócio. Vale cada centavo!",
    category: "Vídeo-Aulas",
  },
  {
    id: 3,
    name: "Fátima Mondlane",
    role: "Professora",
    city: "Nampula",
    initials: "FM",
    rating: 5,
    text: "Os e-books são práticos e directos ao assunto. Recomendo a todos os professores que querem actualizar os seus conhecimentos de forma rápida e acessível.",
    category: "E-books",
  },
];

const categoryColors: Record<string, string> = {
  "Livros Digitais": "#c9a84c",
  "Vídeo-Aulas": "#4a9eff",
  "E-books": "#34d399",
};

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="testimonials-section"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.02) 50%, transparent 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Cabeçalho — mais compacto */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p
              style={{
                color: "#c9a84c",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              — O que dizem os nossos utilizadores —
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.35rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "8px",
              }}
            >
              Histórias de Sucesso Reais
            </h2>
            <p
              style={{
                color: "#9baab8",
                fontSize: "0.88rem",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Milhares de moçambicanos já transformaram as suas vidas com o
              nosso conteúdo.
            </p>
          </div>
        </FadeIn>

        {/* Cards de Depoimentos — compactos */}
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 120} direction="up">
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "22px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Topo: Perfil + Estrelas */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: `${categoryColors[t.category]}20`,
                      border: `1.5px solid ${categoryColors[t.category]}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: categoryColors[t.category],
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: "#f0f4f8",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ color: "#5a6a7a", fontSize: "0.72rem" }}>
                      {t.role} · {t.city}
                    </p>
                  </div>
                  {/* Estrelas */}
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <IconStar key={idx} size={14} filled style={{ color: "#c9a84c" }} />
                    ))}
                  </div>
                </div>

                {/* Texto */}
                <p
                  style={{
                    color: "rgba(240,244,248,0.7)",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    flex: 1,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Badge de categoria */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: `${categoryColors[t.category]}12`,
                    border: `1px solid ${categoryColors[t.category]}33`,
                    borderRadius: "50px",
                    padding: "3px 10px",
                    fontSize: "0.68rem",
                    color: categoryColors[t.category],
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    width: "fit-content",
                  }}
                >
                  {t.category}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <style>{`
        .testimonials-section {
          padding: 60px 40px;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        @media (max-width: 768px) {
          .testimonials-section {
            padding: 40px 16px !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
