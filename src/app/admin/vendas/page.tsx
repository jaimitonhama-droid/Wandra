"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from "firebase/firestore";
import { db } from "@/services/firebase";

export interface TransacaoVenda {
  id: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  itemTitulo: string;
  itemTipo: "livro" | "ebook" | "curso";
  valor: number; // Em Meticais (MT)
  metodoPagamento: "M-Pesa" | "e-Mola" | "Transferência" | "Cartão";
  referencia: string; // Ex: Código de transação M-Pesa
  status: "aprovado" | "pendente" | "rejeitado";
  data: string; // ISO String
}

export default function AdminVendas() {
  const [vendas, setVendas] = useState<TransacaoVenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "aprovado" | "pendente" | "rejeitado">("todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Modal para registrar venda manual ou teste
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoItem, setNovoItem] = useState("");
  const [novoTipo, setNovoTipo] = useState<"livro" | "ebook" | "curso">("livro");
  const [novoValor, setNovoValor] = useState<number>(350);
  const [novoMetodo, setNovoMetodo] = useState<"M-Pesa" | "e-Mola" | "Transferência">("M-Pesa");
  const [novaReferencia, setNovaReferencia] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Buscar vendas reais do Firestore
  const carregarVendas = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "vendas"), orderBy("data", "desc"));
      const snap = await getDocs(q);
      const lista = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as TransacaoVenda[];

      setVendas(lista);
    } catch (err) {
      console.error("Erro ao carregar vendas do Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  // Alterar Status (Ex: Aprovar pagamento pendente)
  const handleAlterarStatus = async (id: string, novoStatus: "aprovado" | "pendente" | "rejeitado") => {
    try {
      await updateDoc(doc(db, "vendas", id), { status: novoStatus });
      setVendas((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: novoStatus } : v))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao alterar status da transação.");
    }
  };

  // Excluir registro
  const handleExcluir = async (id: string, cliente: string) => {
    if (confirm(`Deseja apagar a transação de "${cliente}"?`)) {
      try {
        await deleteDoc(doc(db, "vendas", id));
        setVendas((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao remover registro.");
      }
    }
  };

  // Registrar venda manual no Firestore
  const handleSalvarVendaManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente || !novoEmail || !novoItem) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);
      const novaVenda: Omit<TransacaoVenda, "id"> = {
        clienteNome: novoCliente.trim(),
        clienteEmail: novoEmail.trim(),
        clienteTelefone: novoTelefone.trim() || "+258 84 000 0000",
        itemTitulo: novoItem.trim(),
        itemTipo: novoTipo,
        valor: Number(novoValor) || 0,
        metodoPagamento: novoMetodo,
        referencia: novaReferencia.trim() || `MPESA-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "aprovado",
        data: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "vendas"), novaVenda);
      setVendas((prev) => [{ id: docRef.id, ...novaVenda }, ...prev]);
      setModalAberto(false);

      // Limpar campos
      setNovoCliente("");
      setNovoEmail("");
      setNovoTelefone("");
      setNovoItem("");
      setNovaReferencia("");
    } catch (err) {
      console.error("Erro ao salvar venda:", err);
      alert("Erro ao registrar venda.");
    } finally {
      setSalvando(false);
    }
  };

  // Cálculos financeiros
  const vendasAprovadas = vendas.filter((v) => v.status === "aprovado");
  const totalReceita = vendasAprovadas.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalPendentes = vendas.filter((v) => v.status === "pendente").length;
  const totalTransacoes = vendas.length;

  // Filtros aplicados
  const vendasFiltradas = vendas.filter((v) => {
    const matchStatus = filtroStatus === "todos" || v.status === filtroStatus;
    const matchBusca =
      v.clienteNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      v.clienteEmail.toLowerCase().includes(termoBusca.toLowerCase()) ||
      v.itemTitulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      v.referencia.toLowerCase().includes(termoBusca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* Topo / Cabeçalho */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0, fontFamily: "var(--font-serif, serif)" }}>
            Painel de Vendas & Faturamento
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: "6px 0 0" }}>
            Acompanhe em tempo real transações móveis via M-Pesa, e-Mola e receita total em Meticais (MT).
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #c9a84c 0%, #b8902a 100%)",
            color: "#0a0d14",
            fontWeight: "700",
            fontSize: "0.85rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(201, 168, 76, 0.3)",
          }}
        >
          <span>➕</span>
          <span>Registrar Venda</span>
        </button>
      </div>

      {/* 4 Cards de Métricas Financeiras */}
      <div id="metricas" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Receita Total Aprovada
          </span>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "8px 0 4px" }}>
            {totalReceita.toLocaleString()} <span style={{ fontSize: "14px", color: "#c9a84c" }}>MT</span>
          </div>
          <span style={{ fontSize: "11px", color: "#5a6a7a" }}>Transações concluídas</span>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Vendas Concluídas
          </span>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "8px 0 4px" }}>
            {vendasAprovadas.length}
          </div>
          <span style={{ fontSize: "11px", color: "#5a6a7a" }}>Pagamentos confirmados</span>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Aguardando Confirmação
          </span>
          <div style={{ fontSize: "26px", fontWeight: "800", color: totalPendentes > 0 ? "#f59e0b" : "#fff", margin: "8px 0 4px" }}>
            {totalPendentes}
          </div>
          <span style={{ fontSize: "11px", color: "#5a6a7a" }}>Comprovativos pendentes</span>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0d1320, #0a1028)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#4a9eff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total de Pedidos
          </span>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "8px 0 4px" }}>
            {totalTransacoes}
          </div>
          <span style={{ fontSize: "11px", color: "#5a6a7a" }}>Volume histórico</span>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "14px 18px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        {/* Abas de Status */}
        <div style={{ display: "flex", gap: "6px" }}>
          {(["todos", "aprovado", "pendente", "rejeitado"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                background: filtroStatus === st ? "#c9a84c" : "rgba(255,255,255,0.06)",
                color: filtroStatus === st ? "#0a0d14" : "#9baab8",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {st === "todos" ? `Todos (${totalTransacoes})` : st}
            </button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Buscar por cliente, título ou código..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 12px 7px 32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "12px",
              outline: "none",
            }}
          />
          <span style={{ position: "absolute", left: "10px", top: "7px", fontSize: "12px", color: "#5a6a7a" }}>
            🔍
          </span>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div id="transacoes" style={{
        background: "linear-gradient(135deg, #0d1320, #0a1028)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#888" }}>
            Carregando transações do banco de dados...
          </div>
        ) : vendasFiltradas.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#888", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "14px 18px" }}>Cliente</th>
                  <th style={{ padding: "14px 18px" }}>Material Adquirido</th>
                  <th style={{ padding: "14px 18px" }}>Valor (MT)</th>
                  <th style={{ padding: "14px 18px" }}>Método / Ref</th>
                  <th style={{ padding: "14px 18px" }}>Data</th>
                  <th style={{ padding: "14px 18px" }}>Status</th>
                  <th style={{ padding: "14px 18px", textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Cliente */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: "600", color: "#fff" }}>{item.clienteNome}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{item.clienteEmail}</div>
                      {item.clienteTelefone && (
                        <div style={{ fontSize: "10px", color: "#5a6a7a" }}>{item.clienteTelefone}</div>
                      )}
                    </td>

                    {/* Material */}
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: item.itemTipo === "ebook" ? "rgba(52, 211, 153, 0.15)" : item.itemTipo === "curso" ? "rgba(74, 158, 255, 0.15)" : "rgba(201, 168, 76, 0.15)",
                        color: item.itemTipo === "ebook" ? "#34d399" : item.itemTipo === "curso" ? "#4a9eff" : "#c9a84c",
                        marginRight: "6px",
                      }}>
                        {item.itemTipo}
                      </span>
                      <span style={{ color: "#e2e8f0", fontWeight: "500" }}>{item.itemTitulo}</span>
                    </td>

                    {/* Valor */}
                    <td style={{ padding: "14px 18px", fontWeight: "700", color: "#fff" }}>
                      {item.valor.toLocaleString()} MT
                    </td>

                    {/* Método e Referência */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ color: "#e2e8f0", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span>{item.metodoPagamento === "M-Pesa" ? "🔴" : item.metodoPagamento === "e-Mola" ? "🟡" : "💳"}</span>
                        <span>{item.metodoPagamento}</span>
                      </div>
                      <div style={{ fontSize: "10px", color: "#888", fontFamily: "monospace", marginTop: "2px" }}>
                        Ref: {item.referencia}
                      </div>
                    </td>

                    {/* Data */}
                    <td style={{ padding: "14px 18px", color: "#888", fontSize: "12px" }}>
                      {new Date(item.data).toLocaleDateString("pt-MZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background:
                          item.status === "aprovado"
                            ? "rgba(16, 185, 129, 0.15)"
                            : item.status === "pendente"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          item.status === "aprovado"
                            ? "#34d399"
                            : item.status === "pendente"
                            ? "#fbbf24"
                            : "#f87171",
                        border: `1px solid ${
                          item.status === "aprovado"
                            ? "rgba(16, 185, 129, 0.3)"
                            : item.status === "pendente"
                            ? "rgba(245, 158, 11, 0.3)"
                            : "rgba(239, 68, 68, 0.3)"
                        }`,
                      }}>
                        {item.status === "aprovado" ? "✓ Aprovado" : item.status === "pendente" ? "⏳ Pendente" : "✕ Rejeitado"}
                      </span>
                    </td>

                    {/* Ações */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {item.status === "pendente" && (
                          <button
                            onClick={() => handleAlterarStatus(item.id, "aprovado")}
                            title="Aprovar e Liberar Material"
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: "rgba(16, 185, 129, 0.2)",
                              border: "1px solid rgba(16, 185, 129, 0.4)",
                              color: "#34d399",
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            ✓ Aprovar
                          </button>
                        )}
                        <button
                          onClick={() => handleExcluir(item.id, item.clienteNome)}
                          title="Excluir Registro"
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#f87171",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Estado Vazio */
          <div style={{ padding: "56px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💳</div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", margin: "0 0 6px" }}>
              Nenhuma transação encontrada
            </h3>
            <p style={{ color: "#777", fontSize: "13px", maxWidth: "420px", margin: "0 auto 20px" }}>
              Quando os clientes comprarem via M-Pesa, e-Mola ou quando registrar uma venda manual, elas aparecerão listadas aqui com atualização instantânea.
            </p>
            <button
              onClick={() => setModalAberto(true)}
              style={{
                padding: "8px 18px",
                background: "rgba(201, 168, 76, 0.15)",
                color: "#c9a84c",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Simular / Inserir Primeira Venda
            </button>
          </div>
        )}
      </div>

      {/* MODAL PARA REGISTRAR VENDA MANUAL */}
      {modalAberto && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}>
          <div style={{
            background: "#0f1626",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "480px",
            padding: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "17px", fontWeight: "700" }}>
                Registrar Venda / Pagamento
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                style={{ background: "transparent", border: "none", color: "#888", fontSize: "16px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarVendaManual} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Albino Matusse"
                  value={novoCliente}
                  onChange={(e) => setNovoCliente(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    E-mail do Cliente
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@gmail.com"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Telefone (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="+258 84..."
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Material Adquirido
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Segredos da Riqueza / Curso de Forex"
                  value={novoItem}
                  onChange={(e) => setNovoItem(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Tipo de Material
                  </label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "#121b2d",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="livro">📖 Livro Digital</option>
                    <option value="ebook">📱 E-book</option>
                    <option value="curso">🎬 Curso / Vídeos</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Valor Pago (MT)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={novoValor}
                    onChange={(e) => setNovoValor(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Método de Pagamento
                  </label>
                  <select
                    value={novoMetodo}
                    onChange={(e) => setNovoMetodo(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "#121b2d",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="M-Pesa">🔴 M-Pesa</option>
                    <option value="e-Mola">🟡 e-Mola</option>
                    <option value="Transferência">🏦 Transferência</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#9baab8", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Referência / Código
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: MP92837482"
                    value={novaReferencia}
                    onChange={(e) => setNovaReferencia(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#aaa",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #c9a84c 0%, #b8902a 100%)",
                    border: "none",
                    color: "#0a0d14",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {salvando ? "Registrando..." : "Confirmar Venda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
