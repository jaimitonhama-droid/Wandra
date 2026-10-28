"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  IconBook,
  IconEbook,
  IconFileText,
  IconStar,
  IconUser,
  IconCheck,
  IconZap,
  IconLock,
} from "@/components/Icons";

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

export default function LivroDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLivro() {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, "livros", id));
        if (snap.exists()) {
          setLivro({ id: snap.id, ...snap.data() } as Livro);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do livro:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLivro();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main
          style={{
            background: "#0a0d14",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#c9a84c",
            padding: "40px 20px",
          }}
        >
          <div style={{ marginBottom: "16px", animation: "pulse 1.5s infinite" }}>
            <IconBook size={48} />
          </div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Carregando detalhes da obra...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!livro) {
    return (
      <>
        <Header />
        <main
          style={{
            background: "#0a0d14",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            gap: "16px",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "rgba(201,168,76,0.5)", marginBottom: "8px" }}>
            <IconBook size={56} />
          </div>
          <h2 style={{ fontSize: "1.8rem", color: "#f0f4f8" }}>Livro não encontrado</h2>
          <p style={{ color: "#888", maxWidth: "420px" }}>
            O livro ou e-book solicitado não foi encontrado no nosso catálogo.
          </p>
          <Link
            href="/livros"
            style={{
              marginTop: "8px",
              padding: "12px 24px",
              background: "#c9a84c",
              color: "#0a0d14",
              borderRadius: "50px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Voltar à lista de livros
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const isEbook = livro.tipo === "ebook";
  const accentColor = isEbook ? "#34d399" : "#c9a84c";

  return (
    <>
      <Header />
      <main
        style={{
          background: "linear-gradient(180deg, #0d121c 0%, #0a0d14 100%)",
          minHeight: "100vh",
          paddingTop: "90px",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {/* Navegação e Voltar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <Link
              href={isEbook ? "/ebooks" : "/livros"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#9baab8",
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "50px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
                e.currentTarget.style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9baab8";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              ← Voltar ao Catálogo
            </Link>

            {/* Breadcrumb sutil */}
            <div style={{ fontSize: "0.85rem", color: "#5a6a7a" }}>
              <span>Catálogo</span>
              <span style={{ margin: "0 8px" }}>/</span>
              <span style={{ color: accentColor }}>{livro.categoria || (isEbook ? "E-book" : "Livro")}</span>
            </div>
          </div>

          {/* Grid Principal: Capa e Compra à Esquerda | Informações e Descrição à Direita */}
          <div
            className="livro-detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              gap: "48px",
              alignItems: "flex-start",
            }}
          >
            {/* ===== COLUNA ESQUERDA: Capa + Bloco de Preço & Compra ===== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Capa */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4.2",
                  maxHeight: "500px",
                  background: isEbook ? "#0b1612" : "#131824",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                  <div style={{ opacity: 0.35, color: accentColor }}>
                    {isEbook ? <IconEbook size={80} /> : <IconBook size={80} />}
                  </div>
                )}

                {/* Badge no canto superior da capa */}
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: isEbook ? "rgba(52,211,153,0.92)" : "rgba(201,168,76,0.92)",
                    color: "#0a0d14",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  {isEbook ? "📱 E-book Digital" : "📖 Livro Digital"}
                </span>
              </div>

              {/* Bloco de Compra Rápida */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${isEbook ? "rgba(52,211,153,0.2)" : "rgba(201,168,76,0.2)"}`,
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <span style={{ color: "#7a8a9a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Valor da Obra
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      color: accentColor,
                      lineHeight: 1.1,
                      marginTop: "4px",
                    }}
                  >
                    {livro.preco} MT
                  </div>
                </div>

                {livro.pdfUrl ? (
                  <Link
                    href={`/checkout?livroId=${livro.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "16px 20px",
                      background: isEbook
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #c9a84c, #e0c068)",
                      color: isEbook ? "#ffffff" : "#0a0d14",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      borderRadius: "12px",
                      textDecoration: "none",
                      textAlign: "center",
                      boxShadow: isEbook
                        ? "0 10px 25px rgba(16, 185, 129, 0.25)"
                        : "0 10px 25px rgba(201, 168, 76, 0.25)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <IconZap size={20} /> Comprar Agora ({livro.preco} MT)
                  </Link>
                ) : (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "rgba(255,255,255,0.06)",
                      color: "#666",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "not-allowed",
                      fontWeight: 600,
                    }}
                  >
                    Arquivo Indisponível
                  </button>
                )}

                {/* Vantagens com ícones */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#a5b4c4" }}>
                    <IconCheck size={16} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span>Download imediato em PDF</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#a5b4c4" }}>
                    <IconCheck size={16} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span>Acesso vitalício no celular, tablet e PC</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#a5b4c4" }}>
                    <IconLock size={16} style={{ color: accentColor, flexShrink: 0 }} />
                    <span>Pagamento móvel seguro via M-Pesa / e-Mola</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== COLUNA DIREITA: Título, Autor e DESCRIÇÃO DETALHADA ===== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Categoria + Metadados */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: isEbook ? "rgba(52,211,153,0.15)" : "rgba(201,168,76,0.15)",
                      color: accentColor,
                      border: `1px solid ${isEbook ? "rgba(52,211,153,0.3)" : "rgba(201,168,76,0.3)"}`,
                      padding: "5px 14px",
                      borderRadius: "50px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {livro.categoria || (isEbook ? "E-book" : "Livro")}
                  </span>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#c9a84c",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: "rgba(201,168,76,0.1)",
                      padding: "5px 12px",
                      borderRadius: "50px",
                    }}
                  >
                    <IconStar size={14} filled /> 5.0 (Recomendado)
                  </span>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#9baab8",
                      fontSize: "0.85rem",
                    }}
                  >
                    <IconFileText size={15} /> Formato PDF Digital
                  </span>
                </div>

                {/* Título da Obra */}
                <h1
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    fontWeight: 700,
                    color: "#f0f4f8",
                    lineHeight: 1.2,
                    marginBottom: "16px",
                  }}
                >
                  {livro.titulo}
                </h1>

                {/* NOME DO AUTOR EM DESTAQUE */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "10px 18px",
                    borderRadius: "12px",
                    maxWidth: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isEbook ? "rgba(52,211,153,0.15)" : "rgba(201,168,76,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: accentColor,
                      flexShrink: 0,
                    }}
                  >
                    <IconUser size={18} />
                  </div>
                  <div>
                    <span style={{ display: "block", color: "#7a8a9a", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                      Autor da Obra
                    </span>
                    <strong style={{ color: "#f0f4f8", fontSize: "1.1rem", fontWeight: 700 }}>
                      {livro.autor || "Autor não informado"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ===== CARTÃO DE DESCRIÇÃO DA OBRA (EM GRANDE EVIDÊNCIA) ===== */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "32px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: isEbook ? "rgba(52,211,153,0.15)" : "rgba(201,168,76,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: accentColor,
                    }}
                  >
                    <IconFileText size={20} />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "1.45rem",
                        fontWeight: 700,
                        color: "#f0f4f8",
                        margin: 0,
                      }}
                    >
                      Descrição da Obra
                    </h2>
                    <span style={{ color: "#7a8a9a", fontSize: "0.82rem" }}>
                      Conheça os detalhes e conteúdo deste material
                    </span>
                  </div>
                </div>

                {/* Texto da Descrição */}
                <div
                  style={{
                    color: "rgba(240,244,248,0.9)",
                    fontSize: "1.08rem",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  }}
                >
                  {livro.descricao && livro.descricao.trim().length > 0 ? (
                    livro.descricao
                  ) : (
                    <span style={{ color: "#7a8a9a", fontStyle: "italic" }}>
                      Nenhuma descrição detalhada foi informada para este livro no momento.
                    </span>
                  )}
                </div>
              </div>

              {/* Informações Técnicas e Especificações */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                  }}
                >
                  <span style={{ display: "block", color: "#6a7a8a", fontSize: "0.78rem", textTransform: "uppercase", marginBottom: "4px" }}>
                    Formato do Ficheiro
                  </span>
                  <strong style={{ color: "#f0f4f8", fontSize: "0.95rem" }}>
                    PDF (Portable Document Format)
                  </strong>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                  }}
                >
                  <span style={{ display: "block", color: "#6a7a8a", fontSize: "0.78rem", textTransform: "uppercase", marginBottom: "4px" }}>
                    Disponibilidade
                  </span>
                  <strong style={{ color: "#34d399", fontSize: "0.95rem" }}>
                    Download Imediato após confirmação
                  </strong>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                  }}
                >
                  <span style={{ display: "block", color: "#6a7a8a", fontSize: "0.78rem", textTransform: "uppercase", marginBottom: "4px" }}>
                    Compatibilidade
                  </span>
                  <strong style={{ color: "#f0f4f8", fontSize: "0.95rem" }}>
                    Android, iOS, Windows, Mac, Kindle
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @media (max-width: 860px) {
          .livro-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
