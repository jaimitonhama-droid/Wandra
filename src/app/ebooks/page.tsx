"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { IconEbook, IconZap, IconStar } from "@/components/Icons";

interface RealEbook {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  tipo?: string;
  categoria?: string;
  descricao?: string;
  capaUrl?: string;
  pdfUrl?: string;
  criadoEm?: string;
}

const ebooks = [
  {
    id: "e1",
    titulo: "Guia Completo de Investimentos em Moçambique",
    categoria: "Finanças",
    preco: "250 MT",
    paginas: 87,
    formato: "PDF",
    avaliacao: 4.9,
    downloads: 2341,
    cor: "#0f2a1a",
    acento: "#34d399",
    tag: "Mais Baixado",
    destaque: true,
  },
  {
    id: "e2",
    titulo: "Produtividade Máxima: 30 Dias de Transformação",
    categoria: "Produtividade",
    preco: "180 MT",
    paginas: 64,
    formato: "PDF",
    avaliacao: 4.7,
    downloads: 1876,
    cor: "#0a1a2a",
    acento: "#4a9eff",
    tag: "Novo",
    destaque: false,
  },
  {
    id: "e3",
    titulo: "Como Criar o Seu Negócio Online em Moçambique",
    categoria: "Empreendedorismo",
    preco: "220 MT",
    paginas: 112,
    formato: "PDF",
    avaliacao: 4.8,
    downloads: 1234,
    cor: "#1a0a2a",
    acento: "#c9a84c",
    tag: "Destaque",
    destaque: true,
  },
  {
    id: "e4",
    titulo: "Nutrição e Saúde: Guia Prático para Africanos",
    categoria: "Saúde",
    preco: "150 MT",
    paginas: 48,
    formato: "PDF",
    avaliacao: 4.6,
    downloads: 987,
    cor: "#1a0a0a",
    acento: "#f472b6",
    tag: null,
    destaque: false,
  },
  {
    id: "e5",
    titulo: "Inglês Básico para Negócios: 500 Frases Essenciais",
    categoria: "Idiomas",
    preco: "200 MT",
    paginas: 72,
    formato: "PDF",
    avaliacao: 4.5,
    downloads: 756,
    cor: "#0a1a1a",
    acento: "#34d399",
    tag: null,
    destaque: false,
  },
  {
    id: "e6",
    titulo: "Design Gráfico para Iniciantes com Canva",
    categoria: "Design",
    preco: "190 MT",
    paginas: 56,
    formato: "PDF",
    avaliacao: 4.7,
    downloads: 543,
    cor: "#1a1a0a",
    acento: "#fbbf24",
    tag: null,
    destaque: false,
  },
];

const categoriasEbook = ["Todos", "Finanças", "Produtividade", "Empreendedorismo", "Saúde", "Idiomas", "Design"];

export default function EbooksPage() {
  const [realEbooks, setRealEbooks] = useState<RealEbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEbooks() {
      try {
        const q = query(collection(db, "livros"), orderBy("criadoEm", "desc"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RealEbook[];
        setRealEbooks(lista.filter((l) => l.tipo === "ebook"));
      } catch (err) {
        console.error("Erro ao carregar ebooks:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarEbooks();
  }, []);

  return (
    <>
      <Header />
      <main style={{ background: "#0a0e0a", minHeight: "100vh" }}>
        {/* ===== HERO ===== */}
        <section
          className="ebooks-page-hero"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          <Image
            src="/hero_ebooks.jpg"
            alt="Loja de E-books"
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,14,10,0.3) 0%, rgba(10,14,10,0.85) 60%, rgba(10,14,10,1) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            <p
              style={{
                color: "#34d399",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Loja de E-books
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#0f2a1a",
                lineHeight: 1.15,
                marginBottom: "16px",
                textShadow: "0 2px 20px rgba(255,255,255,0.5)",
              }}
            >
              Conhecimento prático.
              <br />
              <span style={{ color: "#16a34a" }}>Resultados imediatos.</span>
            </h1>
            <p
              style={{
                color: "rgba(15,42,26,0.8)",
                fontSize: "1rem",
                maxWidth: "480px",
                lineHeight: 1.7,
                marginBottom: "28px",
                textShadow: "0 1px 8px rgba(255,255,255,0.4)",
              }}
            >
              Guias práticos escritos por especialistas. Conteúdo directo,
              aplicável e acessível. Download imediato após a compra.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="#ebooks"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #16a34a, #34d399)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                }}
              >
                Explorar E-books
              </Link>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "13px 28px",
                  background: "rgba(0,0,0,0.25)",
                  color: "#0f2a1a",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}
              >
                ← Voltar ao Início
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FILTROS ===== */}
        <section className="ebooks-page-filtros" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {categoriasEbook.map((cat, i) => (
                <button
                  key={cat}
                  id={`cat-ebook-${i}`}
                  style={{
                    background: i === 0 ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${i === 0 ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "50px",
                    padding: "8px 18px",
                    color: i === 0 ? "#34d399" : "rgba(240,244,248,0.6)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(52,211,153,0.1)";
                    el.style.borderColor = "rgba(52,211,153,0.35)";
                    el.style.color = "#34d399";
                  }}
                  onMouseLeave={(e) => {
                    if (i !== 0) {
                      const el = e.currentTarget;
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                      el.style.color = "rgba(240,244,248,0.6)";
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ===== GRELHA DE EBOOKS ===== */}
        <section
          id="ebooks"
          className="ebooks-page-grid-sec"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          {/* E-books Publicados via Admin */}
          {realEbooks.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <IconZap size={20} className="text-emerald-400" />
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#34d399", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                  E-books Publicados na Plataforma
                </h2>
              </div>
              <div
                className="ebooks-grid-2cols"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                  marginBottom: "40px",
                }}
              >
                {realEbooks.map((reb) => (
                  <FadeIn key={reb.id}>
                    <Link href={`/livros/${reb.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(52,211,153,0.3)",
                          borderRadius: "18px",
                          overflow: "hidden",
                          transition: "all 0.35s ease",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <div style={{ height: "200px", position: "relative", background: "#0b1612" }}>
                          {reb.capaUrl ? (
                            <img src={reb.capaUrl} alt={reb.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", opacity: 0.4 }}>
                              <IconEbook size={44} />
                            </div>
                          )}
                          <span style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "#34d399",
                            color: "#060910",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "50px",
                          }}>
                            E-book
                          </span>
                        </div>
                        <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#34d399", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                            {reb.categoria || "E-book"}
                          </span>
                          <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#f0f4f8", fontSize: "1.05rem", fontWeight: 700, margin: "0 0 8px" }}>
                            {reb.titulo}
                          </h3>
                          <p style={{ color: "#9baab8", fontSize: "0.85rem", margin: "0 0 16px" }}>
                            {reb.autor}
                          </p>
                          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ color: "#34d399", fontWeight: 700, fontSize: "1.15rem" }}>
                              {reb.preco} MT
                            </span>
                            <span style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600 }}>
                              Acessar →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          <div
            className="ebooks-grid-2cols"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {ebooks.map((eb, i) => (
              <FadeIn key={eb.id} delay={i * 70} direction="up">
                <Link
                  href={`/ebooks/${eb.id}`}
                  id={`ebook-${eb.id}`}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${eb.acento}22`,
                      borderRadius: "18px",
                      overflow: "hidden",
                      transition: "all 0.35s ease",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-6px)";
                      el.style.borderColor = `${eb.acento}55`;
                      el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${eb.acento}22`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.borderColor = `${eb.acento}22`;
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Banner do e-book */}
                    <div
                      style={{
                        height: "120px",
                        background: `linear-gradient(135deg, ${eb.cor}, ${eb.acento}33)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <IconEbook size={44} style={{ color: eb.acento, opacity: 0.6 }} />
                      {eb.tag && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: eb.acento,
                            color: "#0a0d14",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "50px",
                          }}
                        >
                          {eb.tag}
                        </span>
                      )}
                      {/* Badge PDF */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "12px",
                          background: "rgba(0,0,0,0.5)",
                          color: eb.acento,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "50px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {eb.formato} · {eb.paginas} pág.
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <p
                        style={{
                          color: eb.acento,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        {eb.categoria}
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                          color: "#f0f4f8",
                          fontSize: "0.98rem",
                          fontWeight: 700,
                          lineHeight: 1.35,
                          marginBottom: "12px",
                          flex: 1,
                        }}
                      >
                        {eb.titulo}
                      </h3>

                      {/* Rating + Downloads */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "14px",
                          fontSize: "0.78rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ display: "inline-flex", gap: "1px" }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <IconStar
                                key={idx}
                                size={12}
                                filled={idx < Math.floor(eb.avaliacao)}
                                style={{ color: "#c9a84c" }}
                              />
                            ))}
                          </div>
                          <span style={{ color: "#9baab8" }}>{eb.avaliacao}</span>
                        </div>
                        <span style={{ color: "#5a6a7a" }}>
                          {eb.downloads.toLocaleString()} downloads
                        </span>
                      </div>

                      {/* Preço + CTA */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "12px",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            color: eb.acento,
                            fontSize: "1.15rem",
                            fontWeight: 700,
                          }}
                        >
                          {eb.preco}
                        </span>
                        <span
                          style={{
                            background: `${eb.acento}18`,
                            border: `1px solid ${eb.acento}44`,
                            color: eb.acento,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "5px 14px",
                            borderRadius: "50px",
                          }}
                        >
                          Download Já ↓
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <style>{`
          .ebooks-page-hero {
            height: 440px;
            padding: 0 40px 60px;
          }
          .ebooks-page-filtros {
            padding: 36px 40px 0;
          }
          .ebooks-page-grid-sec {
            padding: 32px 40px 80px;
          }
          @media (max-width: 768px) {
            .ebooks-page-hero {
              height: auto !important;
              min-height: 320px !important;
              padding: 90px 16px 36px !important;
            }
            .ebooks-page-filtros {
              padding: 24px 16px 0 !important;
            }
            .ebooks-page-grid-sec {
              padding: 24px 12px 50px !important;
            }
            .ebooks-grid-2cols {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
