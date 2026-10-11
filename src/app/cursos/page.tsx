"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";

const nivelCores: Record<string, string> = {
  Iniciante: "#34d399",
  Intermédio: "#4a9eff",
  Avançado: "#f472b6",
};

interface MaterialItem {
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

const cursos = [
  {
    id: "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH",
    youtubeId: "d3f6dgIAInI",
    titulo: "Curso de FOREX 2026",
  },
  {
    id: "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS",
    youtubeId: "o05s1jny60A",
    titulo: "Curso de Dropshipping Nacional",
  }
];

export default function CursosPage() {
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMateriais() {
      try {
        const q = query(collection(db, "livros"), orderBy("criadoEm", "desc"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MaterialItem[];
        setMateriais(lista);
      } catch (err) {
        console.error("Erro ao carregar livros e e-books:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarMateriais();
  }, []);

  const ebooks = materiais.filter((m) => m.tipo === "ebook");
  const livros = materiais.filter((m) => (m.tipo || "livro") === "livro");
  return (
    <>
      <Header />
      <main style={{ background: "#060910", minHeight: "100vh" }}>
        {/* ===== HERO ===== */}
        <section
          style={{
            position: "relative",
            height: "500px",
            display: "flex",
            alignItems: "flex-end",
            padding: "0 40px 60px",
            overflow: "hidden",
          }}
        >
          <Image
            src="/hero_cursos.jpg"
            alt="Plataforma de Cursos"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center right" }}
            sizes="100vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(6,9,16,0.95) 45%, rgba(6,9,16,0.3) 100%)",
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
                color: "#4a9eff",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              🎬 Vídeo-Aulas
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
              Aprenda com os melhores.
              <br />
              <span style={{ color: "#4a9eff" }}>Cresça sem limites.</span>
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
              Cursos em vídeo com instrutores especializados. Certificado de
              conclusão. Estude ao seu próprio ritmo.
            </p>

            {/* Mini stats */}
            <div style={{ display: "flex", gap: "28px", marginBottom: "28px", flexWrap: "wrap" }}>
              {[
                { v: "120+", l: "Cursos" },
                { v: "50+", l: "Instrutores" },
                { v: "5.000+", l: "Alunos" },
              ].map((s) => (
                <div key={s.l}>
                  <p style={{ color: "#4a9eff", fontWeight: 800, fontSize: "1.2rem" }}>
                    {s.v}
                  </p>
                  <p style={{ color: "#9baab8", fontSize: "0.8rem" }}>{s.l}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="#cursos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #2563eb, #4a9eff)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                }}
              >
                🎬 Vídeo-Aulas
              </Link>
              <Link
                href="#ebooks"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "rgba(52,211,153,0.15)",
                  border: "1px solid rgba(52,211,153,0.4)",
                  color: "#34d399",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                }}
              >
                📱 E-books
              </Link>
              <Link
                href="#livros"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#c9a84c",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                }}
              >
                📖 Livros
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FILTROS DE NÍVEL ===== */}
        <section style={{ padding: "40px 40px 0", maxWidth: "1200px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Todos", "Iniciante", "Intermédio", "Avançado", "Negócios", "Tecnologia", "Marketing"].map(
                (f, i) => (
                  <button
                    key={f}
                    id={`filtro-curso-${i}`}
                    style={{
                      background: i === 0 ? "rgba(74,158,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${i === 0 ? "rgba(74,158,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "50px",
                      padding: "8px 18px",
                      color: i === 0 ? "#4a9eff" : "rgba(240,244,248,0.6)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "rgba(74,158,255,0.12)";
                      el.style.borderColor = "rgba(74,158,255,0.35)";
                      el.style.color = "#4a9eff";
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
                    {f}
                  </button>
                )
              )}
            </div>
          </FadeIn>
        </section>

        {/* ===== GRELHA DE CURSOS ===== */}
        <section
          id="cursos"
          style={{ padding: "36px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "22px",
            }}
          >
            {cursos.map((curso, i) => (
              <FadeIn key={curso.id} delay={i * 80} direction="up">
                <Link
                  href={`/cursos/${curso.id}`}
                  id={`curso-${curso.id}`}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      transition: "all 0.35s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-6px)";
                      el.style.borderColor = "rgba(74,158,255,0.3)";
                      el.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        height: "160px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image 
                        src={`https://img.youtube.com/vi/${curso.youtubeId}/hqdefault.jpg`} 
                        alt={curso.titulo}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                      
                      {/* Play button overlay */}
                      <div
                        style={{
                          position: "absolute",
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "rgba(74, 158, 255, 0.8)",
                          backdropFilter: "blur(8px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 15px rgba(74, 158, 255, 0.4)",
                        }}
                      >
                        <div
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            borderLeft: "14px solid white",
                            marginLeft: "4px",
                          }}
                        />
                      </div>
                      {/* Tags removidas */}
                    </div>

                    {/* Sem titulo ou textos */}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ===== SECÇÃO DEDICADA DE E-BOOKS PUBLICADOS ===== */}
        <section
          id="ebooks"
          style={{
            padding: "60px 40px",
            maxWidth: "1200px",
            margin: "0 auto",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ color: "#34d399", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                  📱 Biblioteca Prática
                </p>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#f0f4f8", margin: 0 }}>
                  E-books Publicados
                </h2>
                <p style={{ color: "rgba(240,244,248,0.6)", fontSize: "0.95rem", margin: "6px 0 0" }}>
                  Guias rápidos e manuais práticos em formato digital.
                </p>
              </div>
              <Link
                href="/ebooks"
                style={{
                  color: "#34d399",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
              >
                Ver todos os E-books →
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#34d399" }}>Carregando e-books...</div>
          ) : ebooks.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(52,211,153,0.2)",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📱</div>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "6px" }}>Nenhum e-book publicado ainda</h3>
              <p style={{ color: "rgba(240,244,248,0.5)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto" }}>
                Novos guias e e-books serão disponibilizados aqui em breve.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}>
              {ebooks.map((ebook, i) => (
                <FadeIn key={ebook.id} delay={i * 70} direction="up">
                  <Link href={`/livros/${ebook.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(52,211,153,0.25)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-6px)";
                        el.style.borderColor = "#34d399";
                        el.style.boxShadow = "0 16px 36px rgba(0,0,0,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.borderColor = "rgba(52,211,153,0.25)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ height: "240px", position: "relative", background: "#0b1612" }}>
                        {ebook.capaUrl ? (
                          <img src={ebook.capaUrl} alt={ebook.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>📱</div>
                        )}
                        <span style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          background: "#34d399",
                          color: "#060910",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "3px 10px",
                          borderRadius: "50px",
                        }}>
                          📱 E-book
                        </span>
                      </div>
                      <div style={{ padding: "18px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          {ebook.categoria || "E-book"}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#f0f4f8", fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>
                          {ebook.titulo}
                        </h3>
                        <p style={{ color: "#9baab8", fontSize: "0.85rem", margin: "0 0 14px" }}>
                          {ebook.autor}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <span style={{ color: "#34d399", fontWeight: 700, fontSize: "1.15rem" }}>
                            {ebook.preco} MT
                          </span>
                          <span style={{ color: "#34d399", fontSize: "0.78rem", fontWeight: 600 }}>
                            Acessar →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </section>

        {/* ===== SECÇÃO DEDICADA DE LIVROS PUBLICADOS ===== */}
        <section
          id="livros"
          style={{
            padding: "60px 40px 100px",
            maxWidth: "1200px",
            margin: "0 auto",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ color: "#c9a84c", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                  📖 Acervo Literário
                </p>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#f0f4f8", margin: 0 }}>
                  Livros Publicados
                </h2>
                <p style={{ color: "rgba(240,244,248,0.6)", fontSize: "0.95rem", margin: "6px 0 0" }}>
                  Obras completas e livros fundamentais para o seu crescimento.
                </p>
              </div>
              <Link
                href="/livros"
                style={{
                  color: "#c9a84c",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
              >
                Ver todos os Livros →
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#c9a84c" }}>Carregando livros...</div>
          ) : livros.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(201,168,76,0.2)",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📖</div>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "6px" }}>Nenhum livro publicado ainda</h3>
              <p style={{ color: "rgba(240,244,248,0.5)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto" }}>
                Novos livros serão disponibilizados aqui em breve.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}>
              {livros.map((livro, i) => (
                <FadeIn key={livro.id} delay={i * 70} direction="up">
                  <Link href={`/livros/${livro.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-6px)";
                        el.style.borderColor = "#c9a84c";
                        el.style.boxShadow = "0 16px 36px rgba(0,0,0,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.borderColor = "rgba(201,168,76,0.25)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ height: "240px", position: "relative", background: "#161b26" }}>
                        {livro.capaUrl ? (
                          <img src={livro.capaUrl} alt={livro.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>📖</div>
                        )}
                        <span style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          background: "#c9a84c",
                          color: "#060910",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "3px 10px",
                          borderRadius: "50px",
                        }}>
                          📖 Livro
                        </span>
                      </div>
                      <div style={{ padding: "18px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          {livro.categoria || "Livro"}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#f0f4f8", fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>
                          {livro.titulo}
                        </h3>
                        <p style={{ color: "#9baab8", fontSize: "0.85rem", margin: "0 0 14px" }}>
                          {livro.autor}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "1.15rem" }}>
                            {livro.preco} MT
                          </span>
                          <span style={{ color: "#c9a84c", fontSize: "0.78rem", fontWeight: 600 }}>
                            Acessar →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
