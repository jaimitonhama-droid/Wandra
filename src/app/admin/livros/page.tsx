"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

interface Livro {
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

export default function AdminLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "livro" | "ebook">("todos");

  const fetchLivros = async () => {
    try {
      const q = query(collection(db, "livros"), orderBy("criadoEm", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Livro[];
      setLivros(lista);
    } catch (err) {
      console.error("Erro ao carregar livros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleDelete = async (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja apagar o livro "${titulo}"?`)) {
      try {
        await deleteDoc(doc(db, "livros", id));
        setLivros((prev) => prev.filter((l) => l.id !== id));
      } catch (err) {
        alert("Erro ao excluir livro.");
      }
    }
  };

  const livrosFiltrados = filtroTipo === "todos"
    ? livros
    : livros.filter((l) => (l.tipo || "livro") === filtroTipo);

  const totalLivros = livros.filter((l) => (l.tipo || "livro") === "livro").length;
  const totalEbooks = livros.filter((l) => l.tipo === "ebook").length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Livros & E-books</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>Gerencie seu catálogo de leitura.</p>
        </div>
        <Link href="/admin/livros/novo" style={{
          background: "linear-gradient(135deg, #f5a623, #e8890a)",
          color: "#000",
          fontWeight: "700",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Adicionar Novo
        </Link>
      </div>

      {/* Abas de Separação: Todos | Livros | E-books */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        <button
          onClick={() => setFiltroTipo("todos")}
          style={{
            padding: "8px 18px",
            borderRadius: "50px",
            border: filtroTipo === "todos" ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
            background: filtroTipo === "todos" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
            color: filtroTipo === "todos" ? "#c9a84c" : "rgba(240,244,248,0.7)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✨ Todos ({livros.length})
        </button>
        <button
          onClick={() => setFiltroTipo("livro")}
          style={{
            padding: "8px 18px",
            borderRadius: "50px",
            border: filtroTipo === "livro" ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
            background: filtroTipo === "livro" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
            color: filtroTipo === "livro" ? "#c9a84c" : "rgba(240,244,248,0.7)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📖 Livros ({totalLivros})
        </button>
        <button
          onClick={() => setFiltroTipo("ebook")}
          style={{
            padding: "8px 18px",
            borderRadius: "50px",
            border: filtroTipo === "ebook" ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.1)",
            background: filtroTipo === "ebook" ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.03)",
            color: filtroTipo === "ebook" ? "#34d399" : "rgba(240,244,248,0.7)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📱 E-books ({totalEbooks})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#888" }}>
          Carregando catálogo...
        </div>
      ) : livrosFiltrados.length === 0 ? (
        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "48px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            {filtroTipo === "ebook" ? "📱" : "📚"}
          </div>
          <h3 style={{ color: "#fff", fontSize: "18px", margin: "0 0 8px" }}>
            Nenhum {filtroTipo === "ebook" ? "e-book" : filtroTipo === "livro" ? "livro" : "item"} cadastrado
          </h3>
          <p style={{ color: "#777", fontSize: "14px", maxWidth: "400px", margin: "0 auto 24px" }}>
            Comece adicionando novos títulos para seu catálogo.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {livrosFiltrados.map((livro) => {
            const isEbook = livro.tipo === "ebook";
            return (
              <div
                key={livro.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: isEbook ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "200px", background: "#1a1f2c", position: "relative" }}>
                  {livro.capaUrl ? (
                    <img
                      src={livro.capaUrl}
                      alt={livro.titulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                      {isEbook ? "📱" : "📖"}
                    </div>
                  )}
                  {/* Badge de Tipo */}
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: isEbook ? "rgba(52,211,153,0.9)" : "rgba(201,168,76,0.9)",
                      color: "#0a0d14",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {isEbook ? "📱 E-book" : "📖 Livro"}
                  </span>
                </div>
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "11px", color: isEbook ? "#34d399" : "#c9a84c", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    {livro.categoria || "Geral"}
                  </div>
                  <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>
                    {livro.titulo}
                  </h3>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 12px" }}>
                  {livro.autor}
                </p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#c9a84c", fontWeight: 700, fontSize: "16px" }}>
                    {livro.preco} MT
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {livro.pdfUrl && (
                      <a
                        href={livro.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          background: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontSize: "12px",
                          textDecoration: "none",
                        }}
                      >
                        Ver PDF
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(livro.id, livro.titulo)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
