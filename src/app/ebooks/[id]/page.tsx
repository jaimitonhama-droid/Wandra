"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  IconEbook,
  IconBook,
  IconFileText,
  IconStar,
  IconUser,
  IconCheck,
  IconZap,
  IconLock,
} from "@/components/Icons";

interface EbookData {
  id: string;
  titulo: string;
  autor: string;
  preco: number | string;
  tipo?: string;
  descricao?: string;
  capaUrl?: string;
  pdfUrl?: string;
  categoria?: string;
}

// Dados de fallback para IDs antigos de teste (e1, e2, etc.)
const mockEbooks: Record<string, any> = {
  e1: {
    id: "e1",
    titulo: "Guia Completo de Investimentos em Moçambique",
    autor: "Especialistas em Finanças Locais",
    categoria: "Finanças",
    preco: 250,
    descricao:
      "Aprenda a multiplicar o seu dinheiro investindo de forma inteligente no mercado moçambicano. Este guia prático cobre taxas de juro, imobiliário, pequenos negócios e tesouro direto local.",
  },
  e2: {
    id: "e2",
    titulo: "Produtividade Máxima: 30 Dias de Transformação",
    autor: "Instituto de Liderança e Eficácia",
    categoria: "Produtividade",
    preco: 180,
    descricao:
      "Técnicas comprovadas de gestão de tempo e foco para você produzir mais trabalhando com menos estresse no dia a dia.",
  },
  e3: {
    id: "e3",
    titulo: "Como Criar o Seu Negócio Online em Moçambique",
    autor: "Empreendedores Digitais de Moçambique",
    categoria: "Empreendedorismo",
    preco: 220,
    descricao:
      "Passo a passo prático para criar sua loja ou prestação de serviços na internet moçambicana, aceitando pagamentos por M-Pesa e e-Mola.",
  },
};

export default function EbookDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [ebook, setEbook] = useState<EbookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        // Tentar buscar no Firestore
        const snap = await getDoc(doc(db, "livros", id));
        if (snap.exists()) {
          setEbook({ id: snap.id, ...snap.data() } as EbookData);
        } else if (mockEbooks[id]) {
          setEbook(mockEbooks[id]);
        }
      } catch (err) {
        console.error("Erro ao carregar e-book:", err);
        if (mockEbooks[id]) {
          setEbook(mockEbooks[id]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main
          style={{
            background: "#0a0e0a",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#34d399",
            padding: "40px 20px",
          }}
        >
          <div style={{ marginBottom: "16px", animation: "pulse 1.5s infinite" }}>
            <IconEbook size={48} />
          </div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Carregando e-book...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!ebook) {
    return (
      <>
        <Header />
        <main
          style={{
            background: "#0a0e0a",
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
          <div style={{ color: "rgba(52,211,153,0.5)", marginBottom: "8px" }}>
            <IconEbook size={56} />
          </div>
          <h2 style={{ fontSize: "1.8rem", color: "#f0f4f8" }}>E-book não encontrado</h2>
          <p style={{ color: "#888", maxWidth: "420px" }}>
            O material digital solicitado não está disponível no catálogo.
          </p>
          <Link
            href="/ebooks"
            style={{
              marginTop: "8px",
              padding: "12px 24px",
              background: "#34d399",
              color: "#0a0e0a",
              borderRadius: "50px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Voltar aos E-books
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const precoFormatado = typeof ebook.preco === "number" ? `${ebook.preco} MT` : ebook.preco;

  return (
    <>
      <Header />
      <main
        style={{
          background: "linear-gradient(180deg, #091410 0%, #0a0d14 100%)",
          minHeight: "100vh",
          paddingTop: "90px",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {/* Navegação */}
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
              href="/ebooks"
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
                e.currentTarget.style.color = "#34d399";
                e.currentTarget.style.borderColor = "#34d399";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9baab8";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              ← Voltar aos E-books
            </Link>

            <div style={{ fontSize: "0.85rem", color: "#5a6a7a" }}>
              <span>E-books</span>
              <span style={{ margin: "0 8px" }}>/</span>
              <span style={{ color: "#34d399" }}>{ebook.categoria || "Geral"}</span>
            </div>
          </div>

          {/* Grid Principal */}
          <div
            className="ebook-detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              gap: "48px",
              alignItems: "flex-start",
            }}
          >
            {/* Coluna Esquerda */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4.2",
                  maxHeight: "500px",
                  background: "#0b1612",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ebook.capaUrl ? (
                  <img
                    src={ebook.capaUrl}
                    alt={ebook.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ opacity: 0.35, color: "#34d399" }}>
                    <IconEbook size={80} />
                  </div>
                )}

                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: "rgba(52,211,153,0.92)",
                    color: "#0a0d14",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  📱 E-book Digital
                </span>
              </div>

              {/* Bloco de Compra */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div>
                  <span style={{ color: "#7a8a9a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Preço de Acesso
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      color: "#34d399",
                      lineHeight: 1.1,
                      marginTop: "4px",
                    }}
                  >
                    {precoFormatado}
                  </div>
                </div>

                <Link
                  href={`/checkout?livroId=${ebook.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    textAlign: "center",
                    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.25)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <IconZap size={20} /> Comprar Agora ({precoFormatado})
                </Link>

                {/* Botão de WhatsApp */}
                <a
                  href={`https://wa.me/258834490642?text=${encodeURIComponent(
                    `Olá Sabedoria Digital! Gostaria de comprar o e-book "${ebook.titulo}" (${precoFormatado}) pelo WhatsApp. Como posso efetuar o pagamento?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "14px 18px",
                    background: "rgba(37, 211, 102, 0.12)",
                    border: "1px solid rgba(37, 211, 102, 0.35)",
                    color: "#25d366",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(37, 211, 102, 0.22)";
                    e.currentTarget.style.borderColor = "#25d366";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(37, 211, 102, 0.12)";
                    e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.35)";
                  }}
                >
                  <span>💬 Comprar pelo WhatsApp (83 449 0642)</span>
                </a>

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
                    <IconLock size={16} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span>Pagamento seguro via M-Pesa / e-Mola</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Título, Autor e DESCRIÇÃO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(52,211,153,0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.3)",
                      padding: "5px 14px",
                      borderRadius: "50px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {ebook.categoria || "E-book"}
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
                  {ebook.titulo}
                </h1>

                {/* AUTOR EM DESTAQUE */}
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
                      background: "rgba(52,211,153,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#34d399",
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
                      {ebook.autor || "Autor Especialista"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* CARTÃO DE DESCRIÇÃO DA OBRA */}
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
                      background: "rgba(52,211,153,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#34d399",
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
                      Descrição do E-book
                    </h2>
                    <span style={{ color: "#7a8a9a", fontSize: "0.82rem" }}>
                      Conteúdo e objetivo deste material prático
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    color: "rgba(240,244,248,0.9)",
                    fontSize: "1.08rem",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  }}
                >
                  {ebook.descricao && ebook.descricao.trim().length > 0 ? (
                    ebook.descricao
                  ) : (
                    <span style={{ color: "#7a8a9a", fontStyle: "italic" }}>
                      Nenhuma descrição detalhada foi informada para este e-book no momento.
                    </span>
                  )}
                </div>
              </div>

              {/* Informações Técnicas */}
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
                    PDF Digital (Leitura Imediata)
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
                    Entrega
                  </span>
                  <strong style={{ color: "#34d399", fontSize: "0.95rem" }}>
                    Download Imediato após pagamento
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
                    Celular, Computador, Tablet & Kindle
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
          .ebook-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
