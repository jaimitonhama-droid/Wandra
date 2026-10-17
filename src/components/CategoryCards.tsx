"use client";

import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { IconBook, IconVideo, IconEbook } from "@/components/Icons";

const categories = [
  {
    id: "livros",
    href: "/livros",
    icon: IconBook,
    title: "Livros Digitais",
    subtitle: "Obras Completas",
    description:
      "Centenas de livros digitais em PDF para ler a qualquer hora, em qualquer dispositivo.",
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
    icon: IconVideo,
    title: "Vídeo-Aulas",
    subtitle: "Cursos Completos",
    description:
      "Aprenda com especialistas através de aulas em vídeo de alta qualidade.",
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
    icon: IconEbook,
    title: "E-books",
    subtitle: "Guias Práticos",
    description:
      "Conteúdo directo e prático para aplicar imediatamente. Guias e manuais diversos.",
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
      className="category-section"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Título da Secção */}
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
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
          — Explore o nosso universo —
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 700,
            color: "#f0f4f8",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Como deseja aprender hoje?
        </h2>
        <p
          style={{
            color: "#9baab8",
            fontSize: "0.95rem",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Escolha a sua categoria e aceda a conteúdo de qualidade profissional,
          criado para impulsionar o seu crescimento.
        </p>
      </div>
      </FadeIn>

      {/* Grid de Cartões */}
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            id={`card-${cat.id}`}
            style={{
              textDecoration: "none",
              display: "block",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              animationDelay: cat.delay,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-6px) scale(1.01)";
              el.style.borderColor = cat.accentColor + "55";
              el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.35), 0 0 0 1px ${cat.accentColor}22`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Imagem — compacta */}
            <div className="category-card-img" style={{ position: "relative" }}>
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 380px"
              />
              {/* Overlay Gradiente */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, rgba(10,13,20,1) 0%, rgba(10,13,20,0.3) 60%, transparent 100%)`,
                }}
              />
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: cat.badgeColor,
                  color: "#0a0d14",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: "50px",
                }}
              >
                {cat.badge}
              </div>
              {/* Icon */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-18px",
                  left: "20px",
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(10,13,20,0.9)",
                  border: `2px solid ${cat.accentColor}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cat.accentColor,
                  backdropFilter: "blur(10px)",
                }}
              >
                <cat.icon size={20} />
              </div>
            </div>

            {/* Conteúdo do Cartão — compacto */}
            <div className="category-card-body">
              <p
                style={{
                  color: cat.accentColor,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {cat.subtitle}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#f0f4f8",
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {cat.title}
              </h3>
              <p
                style={{
                  color: "#9baab8",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                }}
              >
                {cat.description}
              </p>

              {/* Stats + CTA em linha */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  {cat.stats.map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: 800,
                          color: cat.accentColor,
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#5a6a7a",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <span
                  style={{
                    color: cat.accentColor,
                    fontWeight: 600,
                    fontSize: "0.82rem",
                  }}
                >
                  Explorar →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .category-section {
          padding: 60px 40px 80px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .category-card-img {
          height: 160px;
        }
        .category-card-body {
          background: rgba(15, 20, 30, 0.95);
          padding: 26px 20px 20px;
        }
        @media (max-width: 768px) {
          .category-section {
            padding: 40px 16px 50px !important;
          }
          .category-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .category-card-img {
            height: 135px !important;
          }
          .category-card-body {
            padding: 22px 16px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
