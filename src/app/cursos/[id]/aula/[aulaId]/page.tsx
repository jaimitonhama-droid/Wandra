"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

import { getPlaylistVideos } from "@/services/youtube";

// Base de dados das Playlists reais
const cursosDB: Record<string, any> = {
  "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH": {
    id: "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH",
    titulo: "Curso de FOREX 2026 - Do Zero para Iniciantes",
    preco: 950,
    modulos: [
      {
        id: "m1",
        titulo: "Lista de Reprodução",
        aulas: [
          { id: "d3f6dgIAInI", titulo: "Forex para Iniciantes: A Estratégia que Funciona de Verdade", duracao: "Vídeo", youtubeId: "d3f6dgIAInI" },
          { id: "0atYMBvHQA4", titulo: "CHOCH e BOS Explicados: Nunca Mais Entre Contra a Tendência", duracao: "Vídeo", youtubeId: "0atYMBvHQA4" },
        ],
      }
    ],
  },
  "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS": {
    id: "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS",
    titulo: "Curso de Dropshipping Nacional em Moçambique",
    preco: 950,
    modulos: [
      {
        id: "m1",
        titulo: "Lista de Reprodução",
        aulas: [
          { id: "o05s1jny60A", titulo: "COMO GANHAR DINHEIRO NA INTERNET EM MOÇAMBIQUE", duracao: "Vídeo", youtubeId: "o05s1jny60A" },
          { id: "2hqGZt7wjLw", titulo: "2 - Plataforma de Dropshipping", duracao: "Vídeo", youtubeId: "2hqGZt7wjLw" },
        ],
      }
    ],
  }
};

export default function AulaPage({ params }: { params: Promise<{ id: string; aulaId: string }> }) {
  const resolvedParams = use(params);
  const { id, aulaId } = resolvedParams;

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [temAcesso, setTemAcesso] = useState(false);
  const [cursoAtual, setCursoAtual] = useState<any>(cursosDB[id] || Object.values(cursosDB)[0]);
  const [sidebarAberto, setSidebarAberto] = useState(true);

  // 1. Verificar autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setLoadingAuth(false);
        setTemAcesso(false);
        return;
      }

      try {
        // 2. Verificar se o usuário comprou este curso
        const comprasQuery = query(
          collection(db, "compras"),
          where("usuarioId", "==", currentUser.uid),
          where("materialId", "==", id)
        );
        const comprasSnap = await getDocs(comprasQuery);

        if (!comprasSnap.empty) {
          setTemAcesso(true);
        } else {
          // Verificar também na coleção vendas
          const vendasQuery = query(
            collection(db, "vendas"),
            where("usuarioId", "==", currentUser.uid),
            where("materialId", "==", id),
            where("status", "==", "aprovado")
          );
          const vendasSnap = await getDocs(vendasQuery);
          setTemAcesso(!vendasSnap.empty);
        }
      } catch (err) {
        console.error("Erro ao verificar acesso:", err);
        setTemAcesso(false);
      } finally {
        setLoadingAuth(false);
      }
    });
    return () => unsub();
  }, [id]);

  // 3. Carregar lista de vídeos da playlist (só se tiver acesso)
  useEffect(() => {
    if (!temAcesso) return;
    let isMounted = true;
    getPlaylistVideos(id).then(videos => {
      if (isMounted && videos.length > 0) {
        setCursoAtual((prev: any) => ({
          ...prev,
          modulos: [
            {
              id: "m1",
              titulo: "Lista de Reprodução",
              aulas: videos,
            }
          ]
        }));
      }
    });
    return () => { isMounted = false; };
  }, [id, temAcesso]);

  // Encontrar os dados da aula atual
  let aulaAtual = cursoAtual.modulos[0].aulas[0];
  let moduloAtualTitulo = cursoAtual.modulos[0].titulo;

  cursoAtual.modulos.forEach((modulo: any) => {
    modulo.aulas.forEach((aula: any) => {
      if (aula.id === aulaId) {
        aulaAtual = aula;
        moduloAtualTitulo = modulo.titulo;
      }
    });
  });

  // ====== ESTADO: Carregando verificação de acesso ======
  if (loadingAuth) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "100vh", background: "#060910", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "72px" }}>
          <div style={{ textAlign: "center", color: "#9baab8" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid #4a9eff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "0.9rem" }}>A verificar o seu acesso...</p>
          </div>
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  // ====== ESTADO: Não tem acesso (não logado ou não comprou) ======
  if (!temAcesso) {
    const cursoInfo = cursosDB[id] || { titulo: "Curso Completo", preco: 950 };
    return (
      <>
        <Header />
        <div style={{ minHeight: "100vh", background: "#060910", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", marginTop: "72px" }}>
          <div style={{
            maxWidth: "480px",
            width: "100%",
            background: "#0a0d14",
            border: "1px solid rgba(74,158,255,0.2)",
            borderRadius: "20px",
            padding: "40px 32px",
            textAlign: "center",
          }}>
            {/* Ícone de cadeado */}
            <div style={{
              width: "72px", height: "72px",
              background: "rgba(74,158,255,0.1)",
              border: "1px solid rgba(74,158,255,0.3)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "2rem"
            }}>
              🔒
            </div>

            <h2 style={{ color: "#f0f4f8", fontSize: "1.35rem", fontWeight: 700, marginBottom: "10px" }}>
              Conteúdo Exclusivo para Alunos
            </h2>
            <p style={{ color: "#9baab8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "28px" }}>
              Para assistir a esta vídeo-aula e ter acesso ao curso completo{" "}
              <strong style={{ color: "#f0f4f8" }}>"{cursoInfo.titulo}"</strong>,
              você precisa adquirir o acesso.
            </p>

            {/* Botão principal de compra */}
            <Link
              href={`/checkout?cursoId=${id}`}
              style={{
                display: "block",
                width: "100%",
                padding: "14px 20px",
                background: "linear-gradient(135deg, #c9a84c, #e0c068)",
                color: "#0a0d14",
                fontWeight: 800,
                fontSize: "1rem",
                borderRadius: "12px",
                textDecoration: "none",
                textAlign: "center",
                marginBottom: "12px",
                boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
              }}
            >
              🎓 Desbloquear Curso Completo ({cursoInfo.preco} MT)
            </Link>

            {/* Botão secundário de login */}
            {!user && (
              <Link
                href={`/entrar?redirect=/cursos/${id}/aula/${aulaId}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9baab8",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                Já tenho conta — Entrar
              </Link>
            )}

            <Link
              href="/cursos"
              style={{ fontSize: "0.82rem", color: "#5a6a7a", textDecoration: "none" }}
            >
              ← Ver todos os cursos
            </Link>

            {/* Benefícios */}
            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              {[
                "✅ Acesso imediato a todas as vídeo-aulas",
                "✅ Conteúdo atualizado regularmente",
                "✅ Acesso vitalício na sua área de estudante",
                "✅ Pagamento seguro via M-Pesa",
              ].map((b) => (
                <p key={b} style={{ color: "#9baab8", fontSize: "0.83rem", margin: 0 }}>{b}</p>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ====== ESTADO: Tem acesso — exibir o player normalmente ======
  return (
    <>
      <Header />
      <div className="aula-layout-wrapper">
        
        {/* Main Content Area (Vídeo) */}
        <main className="aula-main-content">
          <div style={{ width: "100%", maxWidth: "1000px" }}>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <h1 className="aula-title" style={{ color: "#f0f4f8", fontSize: "1.6rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                {aulaAtual.titulo}
              </h1>
              <button
                onClick={() => setSidebarAberto(!sidebarAberto)}
                style={{
                  background: "rgba(74,158,255,0.15)",
                  border: "1px solid rgba(74,158,255,0.3)",
                  color: "#4a9eff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{sidebarAberto ? "📋 Ocultar Aulas" : "📋 Ver Todas as Aulas"}</span>
              </button>
            </div>
            
            <p style={{ color: "#4a9eff", fontSize: "0.9rem", marginBottom: "20px", fontWeight: 600 }}>
              {moduloAtualTitulo}
            </p>

            {/* Player de Vídeo */}
            <div id="video-player-section" style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
              <VideoPlayer youtubeId={aulaAtual.youtubeId} title={aulaAtual.titulo} />
            </div>
            
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <h3 style={{ color: "#f0f4f8", marginBottom: "8px", fontSize: "1.05rem" }}>Materiais e Detalhes da Aula</h3>
              <p style={{ color: "#9baab8", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                Os recursos adicionais, PDFs e apontamentos desta aula encontram-se disponíveis na sua área de estudante.
                Aproveite o conteúdo e avance para a próxima aula na lista abaixo.
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar com lista de aulas */}
        {sidebarAberto && (
          <aside className="aula-sidebar-content">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Link href="/cursos" style={{ color: "#9baab8", fontSize: "0.82rem", textDecoration: "none", display: "inline-block", marginBottom: "6px" }}>
                  ← Voltar a Cursos
                </Link>
                <h2 style={{ color: "#f0f4f8", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                  {cursoAtual.titulo}
                </h2>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {cursoAtual.modulos.map((modulo: any) => (
                <div key={modulo.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.02)" }}>
                    <h3 style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
                      {modulo.titulo}
                    </h3>
                  </div>
                  <div>
                    {modulo.aulas.map((aula: any) => {
                      const isActive = aula.id === aulaId;
                      return (
                        <Link
                          key={aula.id}
                          href={`/cursos/${id}/aula/${aula.id}`}
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "14px 20px",
                            textDecoration: "none",
                            background: isActive ? "rgba(74,158,255,0.12)" : "transparent",
                            borderLeft: isActive ? "3px solid #4a9eff" : "3px solid transparent",
                            transition: "background 0.2s"
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "90px",
                              height: "55px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              flexShrink: 0,
                              border: isActive ? "2px solid #4a9eff" : "1px solid rgba(255,255,255,0.1)"
                            }}
                          >
                            <Image
                              src={`https://img.youtube.com/vi/${aula.youtubeId}/hqdefault.jpg`}
                              alt={aula.titulo}
                              fill
                              unoptimized
                              style={{ objectFit: "cover" }}
                            />
                            {isActive && (
                              <div style={{ position: "absolute", inset: 0, background: "rgba(74,158,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ color: "#fff", fontSize: "1.1rem", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>▶</span>
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ 
                                color: isActive ? "#4a9eff" : "#f0f4f8", 
                                fontSize: "0.85rem", 
                                margin: "0 0 4px 0", 
                                fontWeight: isActive ? 700 : 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                              {aula.titulo}
                            </p>
                            <p style={{ color: "#9baab8", fontSize: "0.75rem", margin: "0 0 4px 0", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              Aula completa detalhando o tema passo a passo.
                            </p>
                            <p style={{ color: "#5a6a7a", fontSize: "0.7rem", margin: 0, fontWeight: 600 }}>
                              ⏱ {aula.duracao === "Vídeo" ? "Vídeo Aula" : aula.duracao}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <style jsx>{`
        .aula-layout-wrapper {
          display: flex;
          height: calc(100vh - 72px);
          margin-top: 72px;
          background: #060910;
        }
        .aula-main-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .aula-sidebar-content {
          width: 360px;
          flex-shrink: 0;
          background: #0a0d14;
          border-left: 1px solid rgba(255,255,255,0.08);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 900px) {
          .aula-layout-wrapper {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh;
            margin-top: 60px !important;
          }
          .aula-main-content {
            width: 100% !important;
            padding: 16px 12px 24px !important;
            overflow-y: visible !important;
          }
          .aula-sidebar-content {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
            overflow-y: visible !important;
          }
        }
      `}</style>
    </>
  );
}
