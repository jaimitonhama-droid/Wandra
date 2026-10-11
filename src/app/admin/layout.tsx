"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/admin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    label: "Dashboard",
    exact: true,
  },
  {
    href: "/admin/livros",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    label: "Livros & E-books",
  },
  {
    href: "/admin/cursos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    label: "Cursos",
  },
  {
    href: "/admin/alunos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Alunos",
  },
  {
    href: "/admin/vendas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    label: "Vendas",
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080c14", fontFamily: "var(--font-inter, sans-serif)" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? "72px" : "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0d1320 0%, #0a1028 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
      }}>

        {/* Logo Area */}
        <div style={{
          padding: collapsed ? "24px 16px" : "24px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "12px",
          minHeight: "72px",
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #f5a623, #e8890a)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "800", color: "#000", fontSize: "16px", flexShrink: 0,
              }}>S</div>
              <div>
                <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px", lineHeight: 1.2 }}>Sabedoria</div>
                <div style={{ color: "#f5a623", fontWeight: "700", fontSize: "14px", lineHeight: 1.2 }}>Digital Admin</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #f5a623, #e8890a)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "800", color: "#000", fontSize: "16px",
            }}>S</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888",
              cursor: "pointer",
              borderRadius: "8px",
              width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {collapsed
                ? <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>

        {/* Nav Label */}
        {!collapsed && (
          <div style={{ padding: "20px 24px 8px", color: "#444", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Menu Principal
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsed ? "16px 12px" : "8px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: collapsed ? "12px" : "11px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: isActive ? "#fff" : "#6b7280",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(245,166,35,0.18), rgba(232,137,10,0.08))"
                      : "transparent",
                    border: isActive ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
                    transition: "all 0.2s",
                    justifyContent: collapsed ? "center" : "flex-start",
                    position: "relative",
                  }}
                >
                  <span style={{ color: isActive ? "#f5a623" : "inherit", flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && (
                    <span style={{ fontSize: "14px", fontWeight: isActive ? "600" : "400" }}>{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <span style={{
                      marginLeft: "auto",
                      width: "6px", height: "6px",
                      background: "#f5a623",
                      borderRadius: "50%",
                    }} />
                  )}
                </Link>

                {/* 4 Sub-menus de Vendas */}
                {item.href === "/admin/vendas" && pathname.startsWith("/admin/vendas") && !collapsed && (
                  <div style={{
                    marginLeft: "24px",
                    marginTop: "4px",
                    marginBottom: "4px",
                    paddingLeft: "12px",
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}>
                    <a
                      href="#metricas"
                      style={{
                        padding: "6px 8px",
                        fontSize: "12px",
                        color: "#9baab8",
                        textDecoration: "none",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      className="hover:text-white hover:bg-white/5"
                    >
                      <span>📊</span>
                      <span>1. Receita & Métricas</span>
                    </a>
                    <a
                      href="#transacoes"
                      style={{
                        padding: "6px 8px",
                        fontSize: "12px",
                        color: "#9baab8",
                        textDecoration: "none",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      className="hover:text-white hover:bg-white/5"
                    >
                      <span>💳</span>
                      <span>2. Transações (M-Pesa)</span>
                    </a>
                    <a
                      href="#pendentes"
                      style={{
                        padding: "6px 8px",
                        fontSize: "12px",
                        color: "#9baab8",
                        textDecoration: "none",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      className="hover:text-white hover:bg-white/5"
                    >
                      <span>⏳</span>
                      <span>3. Aprovações Pendentes</span>
                    </a>
                    <a
                      href="#nova-venda"
                      style={{
                        padding: "6px 8px",
                        fontSize: "12px",
                        color: "#f5a623",
                        textDecoration: "none",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "600",
                      }}
                      className="hover:brightness-110 hover:bg-white/5"
                    >
                      <span>➕</span>
                      <span>4. Registrar Venda</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom User Info */}
        <div style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #4a9eff, #2563eb)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "700", fontSize: "14px", flexShrink: 0,
          }}>A</div>
          {!collapsed && (
            <div>
              <div style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>Administrador</div>
              <div style={{ color: "#555", fontSize: "11px" }}>Super Admin</div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        marginLeft: collapsed ? "72px" : "260px",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Top Bar */}
        <header style={{
          height: "64px",
          background: "rgba(8, 12, 20, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#444", fontSize: "13px" }}>Painel de</span>
            <span style={{ color: "#f5a623", fontSize: "13px", fontWeight: "600" }}>Administração</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" target="_blank" style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#888",
              fontSize: "12px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Ver Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
