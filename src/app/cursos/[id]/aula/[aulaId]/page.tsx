"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";

import { getPlaylistVideos } from "@/services/youtube";

// Base de dados das Playlists reais
const cursosDB: Record<string, any> = {
  "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH": {
    id: "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH",
    titulo: "Curso de FOREX 2026 - Do Zero para Iniciantes",
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
  // Desembrulhar params no Next.js 15
  const resolvedParams = use(params);
  const { id, aulaId } = resolvedParams;

  const [cursoAtual, setCursoAtual] = useState<any>(cursosDB[id] || Object.values(cursosDB)[0]);
  const [sidebarAberto, setSidebarAberto] = useState(true);

  useEffect(() => {
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
  }, [id]);

  // Encontrar os dados da aula atual
  let aulaAtual = cursoAtual.modulos[0].aulas[0]; // fallback
  let moduloAtualTitulo = cursoAtual.modulos[0].titulo;
  
  cursoAtual.modulos.forEach((modulo: any) => {
    modulo.aulas.forEach((aula: any) => {
      if (aula.id === aulaId) {
        aulaAtual = aula;
        moduloAtualTitulo = modulo.titulo;
      }
    });
  });

  return (
    <>
      <Header />
      <div style={{ display: "flex", height: "100vh", paddingTop: "72px", background: "#060910" }}>
        
        {/* Main Content Area (Vídeo) */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1000px" }}>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h1 style={{ color: "#f0f4f8", fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
                {aulaAtual.titulo}
              </h1>
              {/* Botão toggle mobile/desktop para a sidebar */}
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
                  fontSize: "0.85rem"
                }}
              >
                {sidebarAberto ? "Ocultar Módulos" : "Ver Módulos"}
              </button>
            </div>
            
            <p style={{ color: "#4a9eff", fontSize: "0.9rem", marginBottom: "24px", fontWeight: 600 }}>
              {moduloAtualTitulo}
            </p>

            {/* Componente do Player com o ID do YouTube */}
            <VideoPlayer youtubeId={aulaAtual.youtubeId} title={aulaAtual.titulo} />
            
            <div
              style={{
                marginTop: "32px",
                padding: "24px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <h3 style={{ color: "#f0f4f8", marginBottom: "12px", fontSize: "1.1rem" }}>Materiais da Aula</h3>
              <p style={{ color: "#9baab8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Os recursos adicionais, PDFs e apontamentos desta aula encontram-se disponíveis para download na sua área de estudante. 
                Utilize a secção de comentários abaixo se tiver dúvidas.
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar com Módulos e Aulas */}
        {sidebarAberto && (
          <aside
            style={{
              width: "350px",
              background: "#0a0d14",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <Link href={`/cursos`} style={{ color: "#9baab8", fontSize: "0.85rem", textDecoration: "none", display: "inline-block", marginBottom: "12px" }}>
                ← Voltar à Visão Geral
              </Link>
              <h2 style={{ color: "#f0f4f8", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                {cursoAtual.titulo}
              </h2>
            </div>

            <div style={{ flex: 1 }}>
              {cursoAtual.modulos.map((modulo: any) => (
                <div key={modulo.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.02)" }}>
                    <h3 style={{ color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
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
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px 24px",
                            textDecoration: "none",
                            background: isActive ? "rgba(74,158,255,0.1)" : "transparent",
                            borderLeft: isActive ? "3px solid #4a9eff" : "3px solid transparent",
                            transition: "background 0.2s"
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "100px",
                              height: "60px",
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
                              <div style={{ position: "absolute", inset: 0, background: "rgba(74,158,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ color: "#fff", fontSize: "1.2rem", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>▶</span>
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ 
                                color: isActive ? "#4a9eff" : "#f0f4f8", 
                                fontSize: "0.85rem", 
                                margin: "0 0 4px 0", 
                                fontWeight: isActive ? 600 : 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                              {aula.titulo}
                            </p>
                            <p style={{ color: "#9baab8", fontSize: "0.75rem", margin: "0 0 4px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              Aula completa detalhando o tema passo a passo.
                            </p>
                            <p style={{ color: "#5a6a7a", fontSize: "0.7rem", margin: 0, fontWeight: 600 }}>
                              ⏱ {aula.duracao === "Vídeo" ? "12:45 min" : aula.duracao}
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
    </>
  );
}
