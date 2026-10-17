"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { IconHome, IconLogOut, IconSettings, IconClose, IconBook, IconEbook, IconVideo, IconCheck } from "@/components/Icons";

interface MaterialItem {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  tipo?: "livro" | "ebook";
  categoria?: string;
  capaUrl?: string;
  pdfUrl?: string;
}

interface CursoItem {
  id: string;
  titulo: string;
  youtubeId: string;
}

type MenuAluno = "painel" | "livros" | "ebooks" | "cursos" | "perfil";

export default function MinhaContaPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [menuAtivo, setMenuAtivo] = useState<MenuAluno>("painel");
  const [sidebarAberto, setSidebarAberto] = useState(false);

  // Dados do usuário
  const [userData, setUserData] = useState<any>(null);
  const [livrosEbooks, setLivrosEbooks] = useState<MaterialItem[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);

  // Cursos da plataforma
  const cursosDisponiveis: CursoItem[] = [
    {
      id: "PLuAV1DdzdhUZuNioOkcUsCy_vP1PQaRfH",
      titulo: "Curso de FOREX 2026 - Do Zero para Iniciantes",
      youtubeId: "d3f6dgIAInI",
    },
    {
      id: "PLnZYFysZKTEw3rpytHVDTo5ph-DbfjjBS",
      titulo: "Curso de Dropshipping Nacional em Moçambique",
      youtubeId: "o05s1jny60A",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/entrar");
        return;
      }

      setUser(currentUser);
      setLoadingUser(false);

      try {
        setLoadingDados(true);
        const userDocRef = doc(db, "usuarios", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const comprasQuery = query(
          collection(db, "compras"),
          where("usuarioId", "==", currentUser.uid)
        );
        const comprasSnap = await getDocs(comprasQuery);
        const idsComprados = comprasSnap.docs.map((d) => d.data().materialId);

        if (idsComprados.length > 0) {
          const materiaisSnap = await getDocs(collection(db, "livros"));
          const lista = materiaisSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as MaterialItem))
            .filter((item) => idsComprados.includes(item.id));
          setLivrosEbooks(lista);
        } else {
          setLivrosEbooks([]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do aluno:", err);
      } finally {
        setLoadingDados(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#9baab8]">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  const livrosFiltrados = livrosEbooks.filter((item) => item.tipo !== "ebook");
  const ebooksFiltrados = livrosEbooks.filter((item) => item.tipo === "ebook");

  const NAV_ITEMS = [
    {
      id: "painel" as MenuAluno,
      label: "Visão Geral",
      badge: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "livros" as MenuAluno,
      label: "Livros Digitais",
      badge: livrosFiltrados.length,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: "ebooks" as MenuAluno,
      label: "Meus E-books",
      badge: ebooksFiltrados.length,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
    },
    {
      id: "cursos" as MenuAluno,
      label: "Vídeo-Aulas & Cursos",
      badge: cursosDisponiveis.length,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      id: "perfil" as MenuAluno,
      label: "Meus Dados & Perfil",
      badge: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#080c14] text-[#f0f4f8] font-sans">
      
      {/* SIDEBAR DE MENUS (Idêntico ao padrão do Admin) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0d1320] to-[#0a1028] border-r border-white/[0.07] flex flex-col transition-transform duration-300 ${
          sidebarAberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Topo do Sidebar: Logo */}
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#917228] flex items-center justify-center font-bold text-black text-sm shadow-md">
              S
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight font-serif">
                Sabedoria<span className="text-[#c9a84c]">Digital</span>
              </span>
              <span className="text-[10px] text-[#5a6a7a] tracking-wider uppercase font-semibold">
                Área do Aluno
              </span>
            </div>
          </Link>

          {/* Fechar no mobile */}
          <button
            onClick={() => setSidebarAberto(false)}
            className="md:hidden text-[#9baab8] hover:text-white p-1"
            aria-label="Fechar menu"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Informações do Usuário no Sidebar */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#917228] p-[1.5px] shrink-0">
            <div className="w-full h-full bg-[#0a1028] rounded-xl flex items-center justify-center font-bold text-[#c9a84c] text-sm">
              {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {user?.displayName || "Aluno"}
            </h4>
            <span className="text-[10px] text-[#c9a84c] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
            </span>
          </div>
        </div>

        {/* Lista de Menus */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const ativo = menuAtivo === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMenuAtivo(item.id);
                  setSidebarAberto(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  ativo
                    ? "bg-[#c9a84c] text-[#0a0d14] shadow-md shadow-[#c9a84c]/20"
                    : "text-[#9baab8] hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={ativo ? "text-[#0a0d14]" : "text-[#c9a84c]"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      ativo
                        ? "bg-black/20 text-[#0a0d14]"
                        : "bg-white/10 text-[#9baab8]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* ITEM EXCLUSIVO PARA O ADMINISTRADOR (jaimitonhama@gmail.com) */}
          {user?.email?.toLowerCase() === "jaimitonhama@gmail.com" && (
            <div className="pt-2 mt-2 border-t border-white/5">
              <Link
                href="/admin"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-[#f0d080] hover:bg-amber-500/20 transition-all text-decoration-none group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 group-hover:rotate-45 transition-transform duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </span>
                  <span>Painel Admin</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-black">
                  Admin
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* Rodapé do Sidebar */}
        <div className="p-3 border-t border-white/[0.07] space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#9baab8] hover:text-white hover:bg-white/[0.05] transition-all text-decoration-none"
          >
            <span>🏠</span>
            <span>Voltar à Loja</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <span>🚪</span>
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Overlay Mobile (removido — replaced by bottom nav) */}

      {/* ÁREA PRINCIPAL DE CONTEÚDO (CONFORME O MENU SELECIONADO) */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen" style={{ paddingBottom: 0 }}>
        
        {/* Barra Superior */}
        <header className="h-16 border-b border-white/[0.07] bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mobile — só aparece quando sidebar está oculta */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#917228] flex items-center justify-center font-bold text-black text-xs">S</div>
              <span className="text-xs font-bold text-[#c9a84c]">Área do Aluno</span>
            </div>
            <h2 className="hidden md:block text-base sm:text-lg font-bold text-white font-serif">
              {NAV_ITEMS.find((n) => n.id === menuAtivo)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {user?.email?.toLowerCase() === "jaimitonhama@gmail.com" && (
              <Link
                href="/admin"
                className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all text-decoration-none flex items-center gap-1"
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Painel Admin</span>
              </Link>
            )}
            <Link
              href="/livros"
              className="text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 transition-all text-decoration-none"
            >
              + Catálogo
            </Link>
          </div>
        </header>

        {/* CORPO DINÂMICO CONFORME O MENU CLICADO */}
        <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full" style={{ paddingBottom: '96px' }}>
          
          {/* ===================== MENU 1: VISÃO GERAL (PAINEL) ===================== */}
          {menuAtivo === "painel" && (
            <div className="space-y-6">
              {/* Banner de Boas-Vindas */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d1320] to-[#121c33] border border-white/10 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#c9a84c]/10 rounded-full blur-[90px] pointer-events-none" />
                <span className="text-[11px] font-bold text-[#c9a84c] uppercase tracking-wider block mb-1">
                  Ambiente de Aprendizado
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2">
                  Olá, {user?.displayName || "Aluno"}! Seja bem-vindo à sua área.
                </h1>
                <p className="text-xs sm:text-sm text-[#9baab8] max-w-xl">
                  Aqui você tem acesso permanente a todas as suas vídeo-aulas, leitura online dos seus livros e download direto em PDF.
                </p>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setMenuAtivo("livros")}
                  className="p-5 rounded-xl bg-[#0d1320] border border-white/5 hover:border-[#c9a84c]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">📖</span>
                    <span className="text-xs font-bold text-[#c9a84c] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-0.5">{livrosFiltrados.length}</h3>
                  <p className="text-xs text-[#9baab8]">Livros Digitais na Estante</p>
                </div>

                <div
                  onClick={() => setMenuAtivo("ebooks")}
                  className="p-5 rounded-xl bg-[#0d1320] border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">📱</span>
                    <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-0.5">{ebooksFiltrados.length}</h3>
                  <p className="text-xs text-[#9baab8]">E-books Práticos</p>
                </div>

                <div
                  onClick={() => setMenuAtivo("cursos")}
                  className="p-5 rounded-xl bg-[#0d1320] border border-white/5 hover:border-[#4a9eff]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🎬</span>
                    <span className="text-xs font-bold text-[#4a9eff] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-0.5">{cursosDisponiveis.length}</h3>
                  <p className="text-xs text-[#9baab8]">Cursos e Playlists Ativas</p>
                </div>
              </div>

              {/* Acesso rápido às aulas */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                    Continuar Estudando
                  </h3>
                  <button
                    onClick={() => setMenuAtivo("cursos")}
                    className="text-xs text-[#c9a84c] hover:underline cursor-pointer"
                  >
                    Ver todos os cursos →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cursosDisponiveis.map((curso) => (
                    <div
                      key={curso.id}
                      className="p-4 rounded-xl bg-[#0d1320] border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-black relative shrink-0 overflow-hidden">
                          <Image
                            src={`https://img.youtube.com/vi/${curso.youtubeId}/mqdefault.jpg`}
                            alt={curso.titulo}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{curso.titulo}</h4>
                          <span className="text-[10px] text-emerald-400">✓ Acesso Liberado</span>
                        </div>
                      </div>
                      <Link
                        href={`/cursos/${curso.id}/aula/${curso.youtubeId}`}
                        className="px-3 py-1.5 rounded-lg bg-[#c9a84c] text-black text-xs font-bold hover:brightness-110 shrink-0 text-decoration-none"
                      >
                        Assistir
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== MENU 2: LIVROS DIGITAIS ===================== */}
          {menuAtivo === "livros" && (
            <div>
              <div className="mb-6">
                <p className="text-xs text-[#9baab8]">
                  Obras completas em PDF para leitura no navegador ou download no seu dispositivo.
                </p>
              </div>

              {livrosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {livrosFiltrados.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#0d1320] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-4 flex gap-3">
                        <div className="w-16 h-24 rounded bg-black/40 relative shrink-0 overflow-hidden">
                          {item.capaUrl ? (
                            <Image src={item.capaUrl} alt={item.titulo} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#c9a84c] uppercase">Livro</span>
                          <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{item.titulo}</h4>
                          <p className="text-[11px] text-[#9baab8] mt-0.5">{item.autor}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-black/30 border-t border-white/5 flex gap-2">
                        {item.pdfUrl && (
                          <>
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 text-center bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10"
                            >
                              Ler
                            </a>
                            <a
                              href={item.pdfUrl}
                              download
                              className="flex-1 py-1.5 text-center bg-[#c9a84c] text-black text-xs font-bold rounded-lg hover:brightness-110"
                            >
                              Baixar
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-[#0d1320] border border-white/5 text-center">
                  <span className="text-3xl block mb-2">📖</span>
                  <h3 className="text-sm font-bold text-white mb-1">Nenhum livro digital adquirido</h3>
                  <p className="text-xs text-[#9baab8] max-w-sm mx-auto mb-4">
                    Explore os livros de Negócios e Desenvolvimento Pessoal na nossa livraria.
                  </p>
                  <Link
                    href="/livros"
                    className="inline-block px-4 py-2 rounded-xl bg-[#c9a84c] text-black text-xs font-bold hover:brightness-110 text-decoration-none"
                  >
                    Ir ao Catálogo de Livros
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ===================== MENU 3: MEUS E-BOOKS ===================== */}
          {menuAtivo === "ebooks" && (
            <div>
              <div className="mb-6">
                <p className="text-xs text-[#9baab8]">
                  Guias práticos e manuais compactos para aplicação rápida no seu dia a dia.
                </p>
              </div>

              {ebooksFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {ebooksFiltrados.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#0d1320] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-4 flex gap-3">
                        <div className="w-16 h-24 rounded bg-black/40 relative shrink-0 overflow-hidden">
                          {item.capaUrl ? (
                            <Image src={item.capaUrl} alt={item.titulo} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📱</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">E-book</span>
                          <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{item.titulo}</h4>
                          <p className="text-[11px] text-[#9baab8] mt-0.5">{item.autor}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-black/30 border-t border-white/5 flex gap-2">
                        {item.pdfUrl && (
                          <>
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 text-center bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10"
                            >
                              Ler
                            </a>
                            <a
                              href={item.pdfUrl}
                              download
                              className="flex-1 py-1.5 text-center bg-emerald-500 text-black text-xs font-bold rounded-lg hover:brightness-110"
                            >
                              Baixar
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-[#0d1320] border border-white/5 text-center">
                  <span className="text-3xl block mb-2">📱</span>
                  <h3 className="text-sm font-bold text-white mb-1">Nenhum e-book disponível no momento</h3>
                  <p className="text-xs text-[#9baab8] max-w-sm mx-auto mb-4">
                    Conheça nossa seleção de manuais práticos e e-books digitais.
                  </p>
                  <Link
                    href="/ebooks"
                    className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:brightness-110 text-decoration-none"
                  >
                    Ver Vitrine de E-books
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ===================== MENU 4: VÍDEO-AULAS & CURSOS ===================== */}
          {menuAtivo === "cursos" && (
            <div>
              <div className="mb-6">
                <p className="text-xs text-[#9baab8]">
                  Playlists organizadas com reprodutor de vídeo privativo sem anúncios ou distrações.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cursosDisponiveis.map((curso) => (
                  <div
                    key={curso.id}
                    className="p-5 rounded-2xl bg-[#0d1320] border border-white/10 hover:border-[#c9a84c]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-40 rounded-xl bg-black relative overflow-hidden mb-4">
                        <Image
                          src={`https://img.youtube.com/vi/${curso.youtubeId}/hqdefault.jpg`}
                          alt={curso.titulo}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="w-10 h-10 rounded-full bg-[#c9a84c] text-black flex items-center justify-center font-bold text-sm shadow-lg">
                            ▶
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider">
                        Vídeo-Aulas Liberadas
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 mb-1">
                        {curso.titulo}
                      </h3>
                      <p className="text-xs text-[#9baab8]">
                        Conteúdo prático estruturado em módulos sequenciais.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-emerald-400 font-semibold">
                        ✓ Inscrição Ativa
                      </span>
                      <Link
                        href={`/cursos/${curso.id}/aula/${curso.youtubeId}`}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b8902a] text-black text-xs font-bold hover:brightness-110 shadow-sm text-decoration-none"
                      >
                        Abrir Sala de Aula →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== MENU 5: DADOS & PERFIL ===================== */}
          {menuAtivo === "perfil" && (
            <div className="max-w-xl">
              <div className="p-6 rounded-2xl bg-[#0d1320] border border-white/10 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#917228] p-[2px]">
                    <div className="w-full h-full bg-[#080c14] rounded-2xl flex items-center justify-center text-xl font-bold text-[#c9a84c]">
                      {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{user?.displayName || "Aluno"}</h3>
                    <p className="text-xs text-[#9baab8]">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full border border-[#c9a84c]/20">
                      Conta Pessoal
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#9baab8] uppercase block mb-1">
                      Nome Registrado
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white">
                      {user?.displayName || "Não informado"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#9baab8] uppercase block mb-1">
                      E-mail de Acesso
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#9baab8] uppercase block mb-1">
                      Identificador (UID)
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#5a6a7a] font-mono">
                      {user?.uid}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-[#9baab8]">Deseja desconectar sua conta deste aparelho?</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-semibold border border-red-500/20 cursor-pointer"
                  >
                    Encerrar Sessão
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="aluno-bottom-nav">
        {NAV_ITEMS.map((item) => {
          const ativo = menuAtivo === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMenuAtivo(item.id)}
              className={`aluno-bottom-nav-item ${ativo ? "aluno-bottom-nav-active" : ""}`}
            >
              <span className="aluno-bottom-nav-icon">{item.icon}</span>
              <span className="aluno-bottom-nav-label">{item.label.split(" ")[0]}</span>
              {ativo && <span className="aluno-bottom-nav-dot" />}
            </button>
          );
        })}
      </nav>

      <style>{`
        /* Desktop: sidebar visível, bottom nav oculta */
        .aluno-bottom-nav { display: none; }

        @media (max-width: 768px) {
          /* Bottom Nav */
          .aluno-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: linear-gradient(180deg, rgba(10,14,26,0.97) 0%, rgba(8,12,20,1) 100%);
            border-top: 1px solid rgba(201,168,76,0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 6px 0 env(safe-area-inset-bottom, 6px);
            justify-content: space-around;
            align-items: flex-end;
          }

          .aluno-bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 8px 8px 4px;
            background: none;
            border: none;
            color: #4a5568;
            font-size: 9.5px;
            font-weight: 600;
            letter-spacing: 0.02em;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.25s ease;
            position: relative;
            min-width: 52px;
          }

          .aluno-bottom-nav-active {
            color: #c9a84c !important;
          }

          .aluno-bottom-nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 32px;
            border-radius: 10px;
            background: transparent;
            transition: all 0.25s ease;
          }

          .aluno-bottom-nav-active .aluno-bottom-nav-icon {
            background: rgba(201,168,76,0.15);
            box-shadow: 0 2px 12px rgba(201,168,76,0.2);
          }

          .aluno-bottom-nav-label {
            font-size: 9px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            max-width: 52px;
            text-overflow: ellipsis;
          }

          .aluno-bottom-nav-dot {
            position: absolute;
            top: 5px;
            right: 8px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #c9a84c;
            box-shadow: 0 0 6px rgba(201,168,76,0.6);
          }
        }
      `}</style>

    </div>
  );
}
