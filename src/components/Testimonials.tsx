"use client";

import FadeIn from "@/components/FadeIn";

const testimonials = [
  {
    id: 1,
    name: "Ana Machava",
    role: "Estudante Universitária",
    city: "Maputo",
    avatar: "👩🏾‍🎓",
    rating: 5,
    text: "A plataforma mudou a minha forma de estudar. Tenho acesso a livros que nunca encontraria nas livrarias locais, e o pagamento via M-Pesa é super fácil!",
    category: "Livros Digitais",
  },
  {
    id: 2,
    name: "Carlos Nhambiu",
    role: "Empresário",
    city: "Beira",
    avatar: "👨🏾‍💼",
    rating: 5,
    text: "Os cursos em vídeo são de altíssima qualidade. Fiz o curso de gestão financeira e já aplico os conhecimentos no meu negócio. Vale cada centavo!",
    category: "Vídeo-Aulas",
  },
  {
    id: 3,
    name: "Fátima Mondlane",
    role: "Professora",
    city: "Nampula",
    avatar: "👩🏾‍🏫",
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
      style={{
        padding: "80px 40px",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.03) 50%, transparent 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Cabeçalho */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                color: "#c9a84c",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              — O que dizem os nossos utilizadores —
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "12px",
              }}
            >
              Histórias de Sucesso Reais
            </h2>
            <p
              style={{
                color: "#9baab8",
                fontSize: "1rem",
                maxWidth: "440px",
                margin: "0 auto",
              }}
            >
              Milhares de moçambicanos já transformaram as suas vidas com o
              nosso conteúdo.
            </p>
          </div>
        </FadeIn>

        {/* Cards de Depoimentos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 120} direction="up">
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Estrelas */}
                <div style={{ display: "flex", gap: "3px" }}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx} style={{ color: "#c9a84c", fontSize: "1rem" }}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Texto */}
                <p
                  style={{
                    color: "rgba(240,244,248,0.8)",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
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
                    background: `${categoryColors[t.category]}18`,
                    border: `1px solid ${categoryColors[t.category]}44`,
                    borderRadius: "50px",
                    padding: "4px 12px",
                    fontSize: "0.72rem",
                    color: categoryColors[t.category],
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    width: "fit-content",
                  }}
                >
                  {t.category}
                </div>

                {/* Perfil */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.12)",
                      border: "2px solid rgba(201,168,76,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#f0f4f8",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ color: "#5a6a7a", fontSize: "0.78rem" }}>
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
