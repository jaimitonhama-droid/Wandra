"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { IconBriefcase, IconBrain, IconBook, IconEbook, IconStar } from "@/components/Icons";

const categorias = [
  { icon: IconBriefcase, label: "Negócios" },
  { icon: IconBrain, label: "Desenvolvimento Pessoal" },
];

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  tipo?: string;
  descricao?: string;
  capaUrl?: string;
  pdfUrl?: string;
  categoria?: string;
  criadoEm?: string;
}

function EstrelaRating({ rating = 5 }: { rating?: number }) {
  return (
    <div style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <IconStar
          key={idx}
          size={13}
          filled={idx < Math.floor(rating)}
          style={{ color: "#c9a84c" }}
        />
      ))}
    </div>
  );
}

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "livro" | "ebook">("todos");

  useEffect(() => {
    async function carregarLivros() {
      try {
        const q = query(collection(db, "livros"), orderBy("criadoEm", "desc"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Livro[];
        setLivros(lista);
      } catch (err) {
        console.error("Erro ao buscar livros:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarLivros();
  }, []);
  return (
    <>
      <Header />
      <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
        {/* ===== HERO ===== */}
        <section
          className="livros-hero"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          <Image
            src="/hero_livros.jpg"
            alt="Livraria Digital"
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
                "linear-gradient(90deg, rgba(10,8,6,0.92) 40%, rgba(10,8,6,0.4) 100%)",
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
                color: "#c9a84c",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Livraria Digital
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#f0f4f8",
                lineHeight: 1.15,
                marginBottom: "16px",
              }}
            >
              Obras que transformam
              <br />
              <span style={{ color: "#c9a84c" }}>mentes e vidas.</span>
            </h1>
            <p
              style={{
                color: "rgba(240,244,248,0.7)",
                fontSize: "1rem",
                maxWidth: "480px",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Centenas de livros digitais em PDF. Download imediato, acesso
              vitalício, pagamento via carteira local.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="#colecao" className="btn-primary">
                Ver Colecção Completa
              </Link>
              <Link href="/" className="btn-outline" style={{ fontSize: "0.88rem" }}>
                ← Voltar ao Início
              </Link>
            </div>
          </div>
        </section>

        {/* ===== CATEGORIAS ===== */}
        <section className="livros-filtros" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "20px",
              }}
            >
              Navegar por Categoria
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                id="cat-livros-todos"
                onClick={() => setCategoriaSelecionada(null)}
                style={{
                  background: !categoriaSelecionada ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${!categoriaSelecionada ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "50px",
                  padding: "8px 18px",
                  color: !categoriaSelecionada ? "#c9a84c" : "rgba(240,244,248,0.75)",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: !categoriaSelecionada ? 700 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                Todos
              </button>
              {categorias.map((cat, i) => {
                const ativo = categoriaSelecionada === cat.label;
                return (
                  <button
                    key={cat.label}
                    id={`cat-livros-${i}`}
                    onClick={() => setCategoriaSelecionada(ativo ? null : cat.label)}
                    style={{
                      background: ativo ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${ativo ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "50px",
                      padding: "8px 18px",
                      color: ativo ? "#c9a84c" : "rgba(240,244,248,0.75)",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: ativo ? 700 : 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <cat.icon size={16} /> {cat.label}
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </section>

        {/* ===== DESTAQUES ===== */}
        <section
          id="colecao"
          className="livros-colecao-sec"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <FadeIn>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#f0f4f8",
                  margin: 0,
                }}
              >
                Catálogo de Obras
              </h2>
              
              {/* Abas de Tipo: Todos | Livros | E-books */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setTipoFiltro("todos")}
                  style={{
                    background: tipoFiltro === "todos" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${tipoFiltro === "todos" ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "50px",
                    padding: "6px 16px",
                    color: tipoFiltro === "todos" ? "#c9a84c" : "rgba(240,244,248,0.6)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: tipoFiltro === "todos" ? 700 : 500,
                  }}
                >
                  Todos
                </button>
                <button
                  onClick={() => setTipoFiltro("livro")}
                  style={{
                    background: tipoFiltro === "livro" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${tipoFiltro === "livro" ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "50px",
                    padding: "6px 16px",
                    color: tipoFiltro === "livro" ? "#c9a84c" : "rgba(240,244,248,0.6)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: tipoFiltro === "livro" ? 700 : 500,
                  }}
                >
                  Livros
                </button>
                <button
                  onClick={() => setTipoFiltro("ebook")}
                  style={{
                    background: tipoFiltro === "ebook" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${tipoFiltro === "ebook" ? "#34d399" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "50px",
                    padding: "6px 16px",
                    color: tipoFiltro === "ebook" ? "#34d399" : "rgba(240,244,248,0.6)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: tipoFiltro === "ebook" ? 700 : 500,
                  }}
                >
                  E-books
                </button>
              </div>
            </div>
          </FadeIn>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#c9a84c" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <IconBook size={32} />
              </div>
              <p style={{ fontSize: "1rem" }}>Carregando acervo de livros...</p>
            </div>
          ) : (() => {
            const livrosFiltrados = livros.filter((l) => {
              const matchCat = categoriaSelecionada
                ? l.categoria?.toLowerCase() === categoriaSelecionada.toLowerCase()
                : true;
              const matchTipo = tipoFiltro === "todos"
                ? true
                : (l.tipo || "livro") === tipoFiltro;
              return matchCat && matchTipo;
            });

            if (livrosFiltrados.length === 0) {
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px",
                    border: "1px dashed rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "rgba(201,168,76,0.5)" }}>
                    {tipoFiltro === "ebook" ? <IconEbook size={48} /> : <IconBook size={48} />}
                  </div>
                  <h3 style={{ color: "#f0f4f8", fontSize: "1.2rem", marginBottom: "8px" }}>
                    Nenhum {tipoFiltro === "ebook" ? "e-book" : "livro"} encontrado
                  </h3>
                  <p style={{ color: "rgba(240,244,248,0.5)", fontSize: "0.9rem" }}>
                    {categoriaSelecionada
                      ? `Não há títulos cadastrados nesta combinação de categoria e tipo.`
                      : "Novas obras serão adicionadas em breve."}
                  </p>
                </div>
              );
            }

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "24px",
                }}
              >
                {livrosFiltrados.map((livro, i) => {
                  const isEbook = livro.tipo === "ebook";
                  return (
                    <FadeIn key={livro.id} delay={i * 70} direction="up">
                      <Link
                        href={`/livros/${livro.id}`}
                        id={`livro-${livro.id}`}
                        style={{ textDecoration: "none", display: "block" }}
                      >
                        <div
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: isEbook ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "16px",
                            overflow: "hidden",
                            transition: "all 0.35s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.transform = "translateY(-6px)";
                            el.style.borderColor = isEbook ? "#34d399" : "rgba(201,168,76,0.5)";
                            el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.transform = "translateY(0)";
                            el.style.borderColor = isEbook ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.07)";
                            el.style.boxShadow = "none";
                          }}
                        >
                          {/* Capa do Livro Real */}
                          <div
                            style={{
                              height: "280px",
                              position: "relative",
                              background: isEbook ? "#0b1612" : "#161b26",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {livro.capaUrl ? (
                              <img
                                src={livro.capaUrl}
                                alt={livro.titulo}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div style={{ opacity: 0.35, color: isEbook ? "#34d399" : "#c9a84c" }}>
                                {isEbook ? <IconEbook size={54} /> : <IconBook size={54} />}
                              </div>
                            )}
                            <span
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                background: isEbook ? "rgba(52,211,153,0.9)" : "rgba(201,168,76,0.9)",
                                color: "#0a0d14",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                letterSpacing: "0.05em",
                                padding: "3px 10px",
                                borderRadius: "50px",
                              }}
                            >
                              {isEbook ? "E-book" : "Livro"}
                            </span>
                          </div>

                          {/* Info */}
                          <div style={{ padding: "18px" }}>
                            <p
                              style={{
                                color: isEbook ? "#34d399" : "#c9a84c",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                marginBottom: "6px",
                              }}
                            >
                              {livro.categoria || (isEbook ? "E-book" : "Livro")}
                            </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            color: "#f0f4f8",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            marginBottom: "4px",
                            lineHeight: 1.3,
                          }}
                        >
                          {livro.titulo}
                        </h3>
                        <p
                          style={{
                            color: "#9baab8",
                            fontSize: "0.85rem",
                            marginBottom: "12px",
                          }}
                        >
                          {livro.autor}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "14px",
                          }}
                        >
                          <EstrelaRating rating={5} />
                          <span style={{ color: "#5a6a7a", fontSize: "0.75rem" }}>
                            (Novo)
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-playfair), Georgia, serif",
                              color: isEbook ? "#34d399" : "#c9a84c",
                              fontSize: "1.2rem",
                              fontWeight: 700,
                            }}
                          >
                            {livro.preco} MT
                          </span>
                          <span style={{ color: "#5a6a7a", fontSize: "0.75rem" }}>
                            {isEbook ? "E-book Digital" : "Livro Digital"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
            </div>
          );
        })()}
      </section>

      <style>{`
        .livros-hero {
          height: 480px;
          padding: 0 40px 60px;
        }
        .livros-filtros {
          padding: 32px 40px 0;
        }
        .livros-colecao-sec {
          padding: 48px 40px 80px;
        }
        @media (max-width: 768px) {
          .livros-hero {
            height: auto !important;
            min-height: 320px !important;
            padding: 90px 16px 36px !important;
          }
          .livros-filtros {
            padding: 24px 16px 0 !important;
          }
          .livros-colecao-sec {
            padding: 32px 16px 50px !important;
          }
        }
      `}</style>
      </main>
      <Footer />
    </>
  );
}
