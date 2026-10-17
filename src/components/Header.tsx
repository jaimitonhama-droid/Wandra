"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/services/firebase";
import { IconBook, IconSearch, IconUser, IconClose, IconMenu } from "@/components/Icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      unsubscribe();
    };
  }, []);

  return (
    <header
      id="main-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(10, 13, 20, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
        padding: scrolled ? "12px 40px" : "18px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0d14",
              }}
            >
              <IconBook size={18} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#f0f4f8",
              }}
            >
              Sabedoria<span style={{ color: "#c9a84c" }}>Digital</span>
            </span>
          </div>
        </Link>

        {/* Nav Desktop */}
        <nav
          id="desktop-nav"
          className="hidden-mobile"
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          {[
            { label: "Início", href: "/" },
            { label: "Livros", href: "/livros" },
            { label: "Cursos", href: "/cursos" },
            { label: "E-books", href: "/ebooks" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: "rgba(240,244,248,0.75)",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "50px",
                fontSize: "0.88rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#c9a84c";
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(240,244,248,0.75)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Search + Auth */}
        <div
          className="hidden-mobile"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* Barra de pesquisa expansível */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {searchOpen && (
              <input
                id="header-search-input"
                autoFocus
                type="text"
                placeholder="Pesquisar livros, cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: "50px",
                  padding: "8px 18px",
                  color: "#f0f4f8",
                  fontSize: "0.85rem",
                  outline: "none",
                  width: "220px",
                  marginRight: "8px",
                  transition: "all 0.3s ease",
                }}
              />
            )}
            <button
              id="header-search-btn"
              aria-label="Pesquisar"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) setSearchQuery("");
              }}
              style={{
                background: searchOpen ? "rgba(201,168,76,0.15)" : "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: searchOpen ? "#c9a84c" : "rgba(240,244,248,0.7)",
                fontSize: "1rem",
                transition: "all 0.2s ease",
              }}
            >
              <IconSearch size={16} />
            </button>
          </div>

          <div
            style={{
              width: "1px",
              height: "22px",
              background: "rgba(255,255,255,0.12)",
            }}
          />
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                href="/minha-conta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "50px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                className="hover:border-[#c9a84c]/50 hover:bg-white/10"
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0a0d14",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#f0f4f8",
                    maxWidth: "110px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="btn-outline"
                style={{
                  padding: "7px 16px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/entrar"
                className="btn-outline"
                style={{ padding: "8px 20px", fontSize: "0.85rem" }}
              >
                Entrar
              </Link>
              <Link
                href="/criar-conta"
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: "0.85rem" }}
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Search + Burger */}
        <div className="show-mobile" style={{ display: "none", alignItems: "center", gap: "8px" }}>
          <button
            aria-label="Pesquisar"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#f0f4f8",
              fontSize: "1.2rem",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconSearch size={18} />
          </button>
          <button
            id="mobile-menu-btn"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#f0f4f8",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div style={{ padding: "10px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <input
            autoFocus
            type="text"
            placeholder="Pesquisar livros, cursos, e-books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(201,168,76,0.4)",
              borderRadius: "50px",
              padding: "10px 20px",
              color: "#f0f4f8",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(10,13,20,0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px 24px",
          }}
        >
          {[
            { label: "Início", href: "/" },
            { label: "Livros Digitais", href: "/livros" },
            { label: "Vídeo-Aulas", href: "/cursos" },
            { label: "E-books", href: "/ebooks" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                color: "rgba(240,244,248,0.8)",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontSize: "1rem",
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            {user ? (
              <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "0.9rem", color: "#f0f4f8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <IconUser size={16} style={{ color: "#c9a84c" }} /> {user.displayName || user.email}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="btn-outline"
                  style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                >
                  Entrar
                </Link>
                <Link
                  href="/criar-conta"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          #main-header { padding: 12px 16px !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
