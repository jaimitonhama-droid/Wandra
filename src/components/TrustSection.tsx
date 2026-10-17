"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { IconLock, IconZap, IconEbook, IconGraduation } from "@/components/Icons";

const trustItems = [
  {
    icon: IconLock,
    title: "Pagamento Seguro",
    desc: "Integrado com Netshop e carteiras locais de Moçambique",
    color: "#c9a84c",
  },
  {
    icon: IconZap,
    title: "Acesso Imediato",
    desc: "Receba o seu conteúdo instantaneamente após o pagamento",
    color: "#4a9eff",
  },
  {
    icon: IconEbook,
    title: "Qualquer Dispositivo",
    desc: "Leia e assista em smartphones, tablets e computadores",
    color: "#34d399",
  },
  {
    icon: IconGraduation,
    title: "Qualidade Garantida",
    desc: "Conteúdo curado e seleccionado por especialistas",
    color: "#f472b6",
  },
];

const stats = [
  { value: "10.000+", label: "Leitores Activos" },
  { value: "800+", label: "Títulos Disponíveis" },
  { value: "4.9 / 5", label: "Avaliação Média" },
  { value: "100%", label: "Satisfação Garantida" },
];

export default function TrustSection() {
  return (
    <>
      {/* Secção de Estatísticas — mais compacta */}
      <section
        id="estatisticas"
        className="stats-section"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          className="stats-grid"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80} direction="up">
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#c9a84c",
                    marginBottom: "4px",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ color: "#9baab8", fontSize: "0.82rem" }}>
                  {s.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Secção de Confiança — mais compacta */}
      {/* Secção de Confiança — mais compacta */}
      <section
        id="confianca"
        className="trust-section"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.35rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "10px",
              }}
            >
              Porque escolher a Sabedoria Digital?
            </h2>
            <p
              style={{
                color: "#9baab8",
                fontSize: "0.88rem",
                maxWidth: "440px",
                margin: "0 auto",
              }}
            >
              Construída a pensar em si, a nossa plataforma oferece uma
              experiência de aprendizagem segura, rápida e de qualidade.
            </p>
          </div>
        </FadeIn>

        <div className="trust-grid">
          {trustItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 100} direction="up">
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${item.color}18`,
                  borderRadius: "14px",
                  padding: "24px 20px",
                  transition: "all 0.35s ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = `${item.color}0a`;
                  el.style.borderColor = `${item.color}44`;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 12px 24px ${item.color}12`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.03)";
                  el.style.borderColor = `${item.color}18`;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Ícone */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${item.color}14`,
                    border: `1px solid ${item.color}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    marginBottom: "14px",
                  }}
                >
                  <item.icon size={22} />
                </div>
                <h3
                  style={{
                    color: "#f0f4f8",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#9baab8",
                    fontSize: "0.82rem",
                    lineHeight: 1.55,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA Final — mais compacto */}
      <section
        id="cta-final"
        className="cta-section"
        style={{
          textAlign: "center",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.04) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <FadeIn>
          <p
            style={{
              color: "#c9a84c",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            — Comece a sua jornada —
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
              fontWeight: 700,
              color: "#f0f4f8",
              marginBottom: "14px",
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
              fontSize: "0.9rem",
              maxWidth: "440px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            Junte-se a milhares de leitores e alunos que já transformaram as
            suas vidas através do conhecimento.
          </p>
          <div
            className="cta-buttons-mobile"
            style={{
              display: "flex",
              gap: "12px",
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
              }}
            >
              Criar Conta Gratuita
            </Link>
            <Link
              href="/livros"
              className="btn-outline"
              id="cta-explorar"
            >
              Explorar Conteúdo →
            </Link>
          </div>
        </FadeIn>
      </section>

      <style>{`
        .stats-section {
          padding: 36px 40px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .trust-section {
          padding: 60px 40px;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .cta-section {
          padding: 60px 40px 80px;
        }
        @media (max-width: 768px) {
          .stats-section {
            padding: 24px 16px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px 12px !important;
          }
          .trust-section {
            padding: 36px 16px !important;
          }
          .trust-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .cta-section {
            padding: 40px 16px 50px !important;
          }
          .cta-buttons-mobile {
            flex-direction: column !important;
            width: 100% !important;
          }
          .cta-buttons-mobile a {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </>
  );
}
