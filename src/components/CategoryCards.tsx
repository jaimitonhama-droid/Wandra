"use client";

import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

const categories = [
  {
    id: "livros",
    href: "/livros",
    emoji: "📖",
    title: "Livros Digitais",
    subtitle: "Obras Completas",
    description:
      "Mergulhe em histórias, conhecimentos e descobertas. Centenas de livros digitais em PDF para ler a qualquer hora, em qualquer dispositivo.",
    image: "/card_livros.jpg",
    badge: "Mais Populares",
    badgeColor: "#c9a84c",
    stats: [
      { value: "500+", label: "Títulos" },
      { value: "30+", label: "Categorias" },
    ],
    accentColor: "#c9a84c",
    delay: "0ms",
  },
  {
    id: "cursos",
    href: "/cursos",
    emoji: "🎬",
    title: "Vídeo-Aulas",
    subtitle: "Cursos Completos",
    description:
      "Aprenda com especialistas através de aulas em vídeo de alta qualidade. Estude ao seu ritmo e evolua profissionalmente.",
    image: "/card_cursos.jpg",
    badge: "Em Destaque",
    badgeColor: "#4a9eff",
    stats: [
      { value: "120+", label: "Cursos" },
      { value: "50+", label: "Instrutores" },
    ],
    accentColor: "#4a9eff",
    delay: "120ms",
  },
  {
    id: "ebooks",
    href: "/ebooks",
    emoji: "📱",
    title: "E-books",
    subtitle: "Guias Práticos",
    description:
      "Conteúdo directo e prático para aplicar imediatamente. Guias, manuais e resumos sobre os mais variados temas.",
    image: "/card_ebooks.jpg",
    badge: "Novo",
    badgeColor: "#34d399",
    stats: [
      { value: "200+", label: "E-books" },
      { value: "Acesso", label: "Imediato" },
    ],
    accentColor: "#34d399",
    delay: "240ms",
  },
];

export default function CategoryCards() {
  return (
    <section
      id="categorias"
      style={{
        padding: "80px 40px 120px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Título da Secção */}
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
          — Explore o nosso universo —
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "#f0f4f8",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          Como deseja aprender hoje?
        </h2>
        <p
          style={{
            color: "#9baab8",
            fontSize: "1.05rem",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Escolha a sua categoria e aceda a conteúdo de qualidade profissional,
          criado para impulsionar o seu crescimento.
        </p>
      </div>
      </FadeIn>

      {/* Grid de Cartões */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            id={`card-${cat.id}`}
            style={{
              textDecoration: "none",
              display: "block",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              animationDelay: cat.delay,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-8px)";
              el.style.borderColor = cat.accentColor + "66";
              el.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px ${cat.accentColor}33`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Imagem */}
            <div style={{ position: "relative", height: "220px" }}>
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* Overlay Gradiente */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, rgba(10,13,20,1) 0%, rgba(10,13,20,0.4) 60%, transparent 100%)`,
                }}
              />
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: cat.badgeColor,
                  color: "#0a0d14",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "50px",
                }}
              >
                {cat.badge}
              </div>
              {/* Emoji grande */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "24px",
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(10,13,20,0.9)",
                  border: `2px solid ${cat.accentColor}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {cat.emoji}
              </div>
            </div>

            {/* Conteúdo do Cartão */}
            <div
              style={{
                background: "rgba(15, 20, 30, 0.95)",
                padding: "36px 24px 28px",
              }}
            >
              <p
                style={{
                  color: cat.accentColor,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {cat.subtitle}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#f0f4f8",
                  marginBottom: "12px",
                  lineHeight: 1.2,
                }}
              >
                {cat.title}
              </h3>
              <p
                style={{
                  color: "#9baab8",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                {cat.description}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  padding: "16px 0",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: "20px",
                }}
              >
                {cat.stats.map((s) => (
                  <div key={s.label}>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: cat.accentColor,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "#5a6a7a",
                        marginTop: "3px",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: cat.accentColor,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Explorar agora
                <span style={{ fontSize: "1.1rem", transition: "transform 0.2s" }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
