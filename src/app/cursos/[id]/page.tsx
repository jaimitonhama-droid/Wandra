import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { use } from "react";

import { getPlaylistVideos } from "@/services/youtube";

// Base de dados das Playlists reais (copiado de aula/[aulaId]/page.tsx)
const cursosDB: Record<string, any> = {
  "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH": {
    id: "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH",
    titulo: "Curso de FOREX 2026 - Do Zero para Iniciantes",
    youtubeId: "d3f6dgIAInI",
    instrutor: "Prof. António Mahumane",
    categoria: "Negócios",
    preco: "1.200 MT",
    duracao: "8h 30min",
    aulas: 42,
    alunos: 1234,
    avaliacao: 4.9,
    nivel: "Iniciante",
    descricao:
      "Aprenda a investir em Forex de forma profissional. Este curso cobre desde conceitos básicos até análise técnica e fundamentalista.",
    modulos: [
      { titulo: "Lista de Reprodução", aulas: 0 },
    ],
    cor: "#0f2940",
  },
  "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS": {
    id: "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS",
    titulo: "Curso de Dropshipping Nacional em Moçambique",
    youtubeId: "o05s1jny60A",
    instrutor: "Prof. António Mahumane",
    categoria: "Negócios",
    preco: "1.200 MT",
    duracao: "6h 00min",
    aulas: 15,
    alunos: 850,
    avaliacao: 4.8,
    nivel: "Intermédio",
    descricao:
      "Aprenda a criar sua loja virtual e vender sem estoque usando estratégias de dropshipping adaptadas para o mercado nacional.",
    modulos: [
      { titulo: "Lista de Reprodução", aulas: 0 },
    ],
    cor: "#1f1430",
  }
};

const cursoMockFallback = {
  id: "c1",
  titulo: "Gestão Financeira para Empreendedores",
  youtubeId: "d3f6dgIAInI",
  instrutor: "Prof. António Mahumane",
  categoria: "Negócios",
  preco: "1.200 MT",
  duracao: "8h 30min",
  aulas: 42,
  alunos: 1234,
  avaliacao: 4.9,
  nivel: "Intermédio",
  descricao:
    "Aprenda a gerir as finanças da sua empresa de forma profissional. Este curso cobre desde conceitos básicos de contabilidade até análise de viabilidade de projetos e planeamento financeiro estratégico.",
  modulos: [
    { titulo: "Módulo 1: Fundamentos da Gestão Financeira", aulas: 5 },
    { titulo: "Módulo 2: Fluxo de Caixa e Capital de Giro", aulas: 8 },
    { titulo: "Módulo 3: Análise de Custos e Precificação", aulas: 12 },
    { titulo: "Módulo 4: Planeamento Estratégico", aulas: 17 },
  ],
  cor: "#0f2940",
};

export default async function CursoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const cursoMock = cursosDB[id] ? { ...cursosDB[id] } : cursoMockFallback;
  
  if (cursosDB[id]) {
    const videos = await getPlaylistVideos(id);
    if (videos.length > 0) {
      cursoMock.modulos = [{ titulo: "Lista de Reprodução", aulas: videos.length }];
      cursoMock.aulas = videos.length;
      cursoMock.youtubeId = videos[0].id;
    }
  }

  return (
    <>
      <Header />
      <main style={{ background: "#060910", minHeight: "100vh", paddingTop: "80px" }}>
        {/* Banner do Curso */}
        <section
          style={{
            background: `linear-gradient(135deg, ${cursoMock.cor}, #060910)`,
            padding: "60px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              gap: "60px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Info Principal */}
            <div style={{ flex: "1 1 500px" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(74,158,255,0.15)",
                  color: "#4a9eff",
                  padding: "6px 14px",
                  borderRadius: "50px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                {cursoMock.categoria} · {cursoMock.nivel}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: "#f0f4f8",
                  lineHeight: 1.2,
                  marginBottom: "20px",
                }}
              >
                {cursoMock.titulo}
              </h1>
              <p
                style={{
                  color: "rgba(240,244,248,0.7)",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  marginBottom: "30px",
                }}
              >
                {cursoMock.descricao}
              </p>
              
              <div style={{ display: "flex", gap: "24px", color: "#9baab8", fontSize: "0.9rem" }}>
                <span>⏱ {cursoMock.duracao}</span>
                <span>📚 {cursoMock.aulas} aulas</span>
                <span style={{ color: "#c9a84c" }}>⭐ {cursoMock.avaliacao} ({cursoMock.alunos} alunos)</span>
              </div>
            </div>

            {/* Cartão de Compra (Sidebar-like) */}
            <div
              style={{
                flex: "1 1 340px",
                maxWidth: "400px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "32px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  height: "200px",
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.05)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Image
                  src={`https://img.youtube.com/vi/${cursoMock.youtubeId}/hqdefault.jpg`}
                  alt="Video Cover"
                  fill
                  unoptimized
                  style={{ objectFit: "cover", opacity: 0.7 }}
                />
                <div style={{ position: "absolute", zIndex: 1, width: "60px", height: "60px", background: "rgba(74, 158, 255, 0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <span style={{ fontSize: "2rem", color: "#fff", marginLeft: "6px" }}>▶</span>
                </div>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: "#4a9eff",
                  marginBottom: "20px",
                }}
              >
                {cursoMock.preco}
              </h2>
              <button
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg, #2563eb, #4a9eff)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "16px",
                  boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)",
                }}
              >
                Comprar Agora
              </button>
              
              <Link 
                href={`/cursos/${cursoMock.id}/aula/${cursoMock.id === 'PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH' ? 'd3f6dgIAInI' : cursoMock.id === 'PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS' ? 'o05s1jny60A' : 'a1'}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  padding: "14px",
                  background: "rgba(255,255,255,0.05)",
                  color: "#4a9eff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(74,158,255,0.3)",
                  textDecoration: "none",
                  marginBottom: "16px",
                }}
              >
                ▶ Assistir Aula de Demonstração
              </Link>
              <p style={{ textAlign: "center", color: "#5a6a7a", fontSize: "0.8rem" }}>
                Pagamento seguro via Netshop / M-Pesa / E-Mola.
                Acesso imediato e vitalício.
              </p>
            </div>
          </div>
        </section>

        {/* Módulos do Curso */}
        <section style={{ padding: "80px 40px", maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#f0f4f8",
              marginBottom: "32px",
            }}
          >
            Conteúdo do Curso
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cursoMock.modulos.map((mod: any, i: number) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ color: "#f0f4f8", fontSize: "1.05rem", fontWeight: 600 }}>
                  {mod.titulo}
                </h3>
                <span style={{ color: "#5a6a7a", fontSize: "0.85rem" }}>
                  {mod.aulas} aulas
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
