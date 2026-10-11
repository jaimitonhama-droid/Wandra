"use client";

import Link from "next/link";

const STATS = [
  {
    label: "Total de Vendas",
    value: "47.250 MT",
    change: "+12.5%",
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
  },
  {
    label: "Alunos Ativos",
    value: "1.248",
    change: "+8.2%",
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#4a9eff",
    bg: "rgba(74,158,255,0.1)",
  },
  {
    label: "Livros & E-books",
    value: "34",
    change: "+3 este mês",
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    color: "#f5a623",
    bg: "rgba(245,166,35,0.1)",
  },
  {
    label: "Cursos Ativos",
    value: "12",
    change: "+1 novo",
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
  },
];

const RECENT_SALES = [
  { name: "Carlos Machava", product: "Pai Rico, Pai Pobre", amount: "420 MT", time: "Há 2 min", type: "ebook" },
  { name: "Ana Sithole", product: "Curso de FOREX 2026", amount: "2.500 MT", time: "Há 15 min", type: "curso" },
  { name: "João Tembe", product: "A Arte da Guerra", amount: "350 MT", time: "Há 1 hora", type: "ebook" },
  { name: "Maria Cossa", product: "O Poder do Hábito", amount: "390 MT", time: "Há 3 horas", type: "ebook" },
  { name: "Pedro Nhantumbo", product: "Curso Dropshipping", amount: "1.800 MT", time: "Ontem", type: "curso" },
];

const QUICK_ACTIONS = [
  { href: "/admin/livros/novo", label: "Adicionar Livro", icon: "📚", color: "#f5a623" },
  { href: "/admin/cursos/novo", label: "Adicionar Curso", icon: "🎥", color: "#4a9eff" },
  { href: "/admin/alunos", label: "Ver Alunos", icon: "👥", color: "#22c55e" },
  { href: "/admin/vendas", label: "Relatório de Vendas", icon: "📊", color: "#a855f7" },
];

export default function AdminDashboard() {
  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0, lineHeight: 1.2 }}>
          Bom dia, Administrador 👋
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: "8px 0 0" }}>
          Aqui está um resumo da sua plataforma hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "linear-gradient(135deg, #0d1320, #0a1028)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: stat.bg, borderRadius: "0 16px 0 80px", opacity: 0.5 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ background: stat.bg, color: stat.color, padding: "10px", borderRadius: "12px", display: "flex" }}>
                {stat.icon}
              </div>
              <span style={{
                background: stat.positive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                color: stat.positive ? "#22c55e" : "#ef4444",
                fontSize: "11px", fontWeight: "600", padding: "4px 8px", borderRadius: "20px",
              }}>
                {stat.change}
              </span>
            </div>
            <div style={{ color: "#fff", fontSize: "26px", fontWeight: "800", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ color: "#555", fontSize: "12px", marginTop: "6px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>

        {/* Recent Sales */}
        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 }}>Vendas Recentes</h2>
              <p style={{ color: "#555", fontSize: "12px", margin: "4px 0 0" }}>As últimas 5 transações</p>
            </div>
            <Link href="/admin/vendas" style={{ color: "#f5a623", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
              Ver todas →
            </Link>
          </div>
          <div>
            {RECENT_SALES.map((sale, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 28px",
                  borderBottom: i < RECENT_SALES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div style={{
                  width: "40px", height: "40px",
                  background: sale.type === "curso" ? "rgba(74,158,255,0.15)" : "rgba(245,166,35,0.15)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0,
                }}>
                  {sale.type === "curso" ? "🎥" : "📚"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {sale.name}
                  </div>
                  <div style={{ color: "#555", fontSize: "12px", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {sale.product}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: "#22c55e", fontSize: "14px", fontWeight: "700" }}>{sale.amount}</div>
                  <div style={{ color: "#444", fontSize: "11px", marginTop: "2px" }}>{sale.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Quick Actions */}
          <div style={{
            background: "linear-gradient(135deg, #0d1320, #0a1028)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: "0 0 16px" }}>Ações Rápidas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "16px 8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    textAlign: "center",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{action.icon}</span>
                  <span style={{ color: "#aaa", fontSize: "11px", fontWeight: "500", lineHeight: 1.3 }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div style={{
            background: "linear-gradient(135deg, #0d1320, #0a1028)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: "0 0 20px" }}>Estado da Plataforma</h2>
            {[
              { label: "Base de Dados", status: "Online", ok: true },
              { label: "Armazenamento", status: "Online", ok: true },
              { label: "API YouTube", status: "Ativa", ok: true },
              { label: "UploadThing", status: "Ativo", ok: true },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ color: "#777", fontSize: "13px" }}>{item.label}</span>
                <span style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  color: item.ok ? "#22c55e" : "#ef4444",
                  fontSize: "12px", fontWeight: "600",
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: item.ok ? "#22c55e" : "#ef4444", display: "inline-block" }} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
