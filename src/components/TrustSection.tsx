"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const trustItems = [
  {
    icon: "🔒",
    title: "Pagamento Seguro",
    desc: "Integrado com Netshop e carteiras locais de Moçambique",
    color: "#c9a84c",
  },
  {
    icon: "⚡",
    title: "Acesso Imediato",
    desc: "Receba o seu conteúdo instantaneamente após o pagamento",
    color: "#4a9eff",
  },
  {
    icon: "📱",
    title: "Qualquer Dispositivo",
    desc: "Leia e assista em smartphones, tablets e computadores",
    color: "#34d399",
  },
  {
    icon: "🎓",
    title: "Qualidade Garantida",
    desc: "Conteúdo curado e seleccionado por especialistas",
    color: "#f472b6",
  },
];

const stats = [
  { value: "10.000+", label: "Leitores Activos" },
  { value: "800+", label: "Títulos Disponíveis" },
  { value: "4.9★", label: "Avaliação Média" },
  { value: "100%", label: "Satisfação Garantida" },
];

export default function TrustSection() {
  return (
    <>
      {/* Secção de Estatísticas */}
      <section
        id="estatisticas"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          padding: "52px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80} direction="up">
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "#c9a84c",
                    marginBottom: "6px",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ color: "#9baab8", fontSize: "0.88rem" }}>
                  {s.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Secção de Confiança */}
      <section
        id="confianca"
        style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "12px",
              }}
            >
              Porque escolher a Sabedoria Digital?
            </h2>
            <p
              style={{
                color: "#9baab8",
                fontSize: "1rem",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Construída a pensar em si, a nossa plataforma oferece uma
              experiência de aprendizagem segura, rápida e de qualidade.
            </p>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {trustItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 100} direction="up">
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${item.color}22`,
                  borderRadius: "20px",
                  padding: "32px 24px",
                  transition: "all 0.35s ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = `${item.color}0d`;
                  el.style.borderColor = `${item.color}55`;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = `0 20px 40px ${item.color}1a`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = `${item.color}22`;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Ícone com fundo colorido */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    marginBottom: "20px",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    color: "#f0f4f8",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#9baab8",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section
        id="cta-final"
        style={{
          padding: "80px 40px 100px",
          textAlign: "center",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.05) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <FadeIn>
          <p
            style={{
              color: "#c9a84c",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            — Comece a sua jornada —
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#f0f4f8",
              marginBottom: "20px",
              lineHeight: 1.2,
            }}
          >
            O conhecimento é o melhor investimento
            <br />
            <span className="gold-shimmer">que pode fazer.</span>
          </h2>
          <p
            style={{
              color: "#9baab8",
              fontSize: "1.05rem",
              maxWidth: "480px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Junte-se a milhares de leitores e alunos que já transformaram as
            suas vidas através do conhecimento.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/criar-conta"
              className="btn-primary"
              id="cta-criar-conta"
              style={{
                animation: "pulse-glow 2.5s ease-in-out infinite",
                fontSize: "1.05rem",
                padding: "16px 40px",
              }}
            >
              Criar Conta Gratuita ✨
            </Link>
            <Link
              href="/livros"
              className="btn-outline"
              id="cta-explorar"
              style={{ fontSize: "1.05rem", padding: "16px 36px" }}
            >
              Explorar Conteúdo →
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
