"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  descricao?: string;
  capaUrl?: string;
  pdfUrl?: string;
  categoria?: string;
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
        console.error("Erro ao carregar livro:", err);
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
        <main style={{ background: "#0a0d14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a84c" }}>
          <p>Carregando detalhes do livro...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!livro) {
    return (
      <>
        <Header />
        <main style={{ background: "#0a0d14", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", gap: "16px" }}>
          <h2>Livro não encontrado</h2>
          <Link href="/livros" style={{ color: "#c9a84c" }}>← Voltar à lista de livros</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ background: "#0a0d14", minHeight: "100vh", paddingTop: "80px" }}>
        {/* Banner do Livro */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(20,15,10,0.9), #0a0d14)",
            padding: "80px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              gap: "60px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Capa Real */}
            <div
              style={{
                flex: "0 0 300px",
                height: "450px",
                background: "#161b26",
                borderRadius: "12px",
                boxShadow: "20px 20px 40px rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {livro.capaUrl ? (
                <img
                  src={livro.capaUrl}
                  alt={livro.titulo}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "5rem", opacity: 0.3 }}>📖</span>
              )}
            </div>

            {/* Info Principal */}
            <div style={{ flex: "1 1 400px", paddingTop: "20px" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(201,168,76,0.15)",
                  color: "#c9a84c",
                  padding: "6px 14px",
                  borderRadius: "50px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}
              >
                {livro.categoria || "E-book"}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700,
                  color: "#f0f4f8",
                  lineHeight: 1.1,
                  marginBottom: "10px",
                }}
              >
                {livro.titulo}
              </h1>
              <p style={{ color: "#9baab8", fontSize: "1.2rem", marginBottom: "30px", fontStyle: "italic" }}>
                por <span style={{ color: "#f0f4f8" }}>{livro.autor}</span>
              </p>
              
              <div style={{ display: "flex", gap: "24px", color: "#5a6a7a", fontSize: "0.95rem", marginBottom: "40px" }}>
                <span>💾 Formato PDF Digital</span>
                <span style={{ color: "#c9a84c" }}>⭐ 5.0 (Novo lançamento)</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  background: "rgba(255,255,255,0.03)",
                  padding: "24px 32px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    color: "#c9a84c",
                    margin: 0,
                  }}
                >
                  {livro.preco} MT
                </h2>
                {livro.pdfUrl ? (
                  <Link
                    href={`/checkout?livroId=${livro.id}`}
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      padding: "16px",
                      background: "linear-gradient(135deg, #c9a84c, #e0c068)",
                      color: "#0a0d14",
                      fontWeight: 800,
                      fontSize: "1rem",
                      borderRadius: "12px",
                      textDecoration: "none",
                      textAlign: "center",
                      boxShadow: "0 10px 30px rgba(201, 168, 76, 0.2)",
                    }}
                  >
                    📖 Comprar Agora ({livro.preco || 350} MT)
                  </Link>
                ) : (
                  <button
                    disabled
                    style={{
                      flex: 1,
                      padding: "18px",
                      background: "#333",
                      color: "#888",
                      borderRadius: "12px",
                      border: "none",
                    }}
                  >
                    Arquivo Indisponível
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sinopse */}
        <section
          style={{
            padding: "80px 40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#f0f4f8",
                marginBottom: "24px",
              }}
            >
              Sinopse
            </h2>
            <p
              style={{
                color: "rgba(240,244,248,0.75)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {livro.descricao || "Nenhuma descrição fornecida para este livro."}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
