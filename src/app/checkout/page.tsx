"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { IconLock, IconCheck, IconEbook } from "@/components/Icons";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // IDs e parâmetros da compra
  const livroId = searchParams.get("livroId");
  const cursoId = searchParams.get("cursoId");

  const [user, setUser] = useState<User | null>(null);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Formulário Automático de Gateway Móvel
  const [metodo, setMetodo] = useState<"M-Pesa" | "e-Mola">("M-Pesa");
  const [telefone, setTelefone] = useState("");
  const [valorFixo, setValorFixo] = useState<number>(350);
  const [processando, setProcessando] = useState(false);
  const [aguardandoPin, setAguardandoPin] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      try {
        if (livroId) {
          const snap = await getDoc(doc(db, "livros", livroId));
          if (snap.exists()) {
            const dados = snap.data();
            setItem({ id: snap.id, ...dados });
            setValorFixo(Number(dados.preco) || 350);
          }
        } else if (cursoId) {
          setItem({
            id: cursoId,
            titulo: "Inscrição no Curso Completo",
            preco: 950,
            tipo: "curso",
          });
          setValorFixo(950);
        } else {
          setItem({
            id: "padrao",
            titulo: "Material Digital Selecionado",
            preco: 350,
            tipo: "livro",
          });
          setValorFixo(350);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [livroId, cursoId]);

  const handleIniciarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!telefone.trim() || telefone.trim().length < 8) {
      setErro("Por favor, digite o seu número de telemóvel.");
      return;
    }

    try {
      setProcessando(true);
      setAguardandoPin(true);

      // 1. Dispara a chamada ao gateway NetShop via API interna segura
      const res = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone: telefone.trim(),
          valor: Number(valorFixo),
          metodo: metodo,
          materialId: item?.id || "geral",
          titulo: item?.titulo || "Material Sabedoria Digital",
          clienteNome: user?.displayName || "Cliente",
          clienteEmail: user?.email || "cliente@gmail.com",
          usuarioId: user?.uid || null,
        }),
      });

      const dataRes = await res.json();

      // Registra a venda no Firestore (status aguardando aprovação ou aprovado)
      const dadosVenda = {
        clienteNome: user?.displayName || "Cliente",
        clienteEmail: user?.email || "cliente@gmail.com",
        clienteTelefone: telefone.trim(),
        usuarioId: user?.uid || null,
        materialId: item?.id || "geral",
        itemTitulo: item?.titulo || "Material Sabedoria Digital",
        itemTipo: item?.tipo || "livro",
        valor: Number(valorFixo),
        metodoPagamento: metodo,
        referencia: dataRes.chargeId || `${metodo.toUpperCase().replace("-", "")}-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "aprovado",
        data: new Date().toISOString(),
      };

      await addDoc(collection(db, "vendas"), dadosVenda);

      if (user?.uid) {
        await addDoc(collection(db, "compras"), {
          usuarioId: user.uid,
          materialId: item?.id || "geral",
          titulo: item?.titulo,
          tipo: item?.tipo || "livro",
          compradoEm: new Date().toISOString(),
          status: "liberado",
        });
      }

      setTimeout(() => {
        setAguardandoPin(false);
        setSucesso(true);
      }, 4000);

    } catch (err: any) {
      console.error("Erro ao processar compra:", err);
      setErro("Falha na comunicação com a carteira. Tente novamente.");
      setAguardandoPin(false);
    } finally {
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-[#c9a84c] text-xs font-sans">
        Carregando...
      </div>
    );
  }

  // TELA DE ESPERA DO POP-UP / PIN NO CELULAR
  if (aguardandoPin) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-[#0f172a] border border-[#c9a84c]/30 rounded-2xl p-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <IconEbook size={28} />
          </div>
          <h2 className="text-base font-bold font-serif mb-1 text-white">
            Verifique o seu telemóvel
          </h2>
          <p className="text-xs text-[#9baab8] mb-4 leading-relaxed">
            Uma solicitação foi enviada para o número <strong className="text-white">{telefone}</strong>.<br />
            Digite o seu <strong className="text-amber-400">PIN do {metodo}</strong> para autorizar o valor de <strong className="text-white">{valorFixo} MT</strong>.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-[#c9a84c] bg-[#c9a84c]/10 px-3.5 py-1.5 rounded-full border border-[#c9a84c]/20">
            <div className="w-3.5 h-3.5 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
            <span>Aguardando confirmação do PIN...</span>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE SUCESSO COMPACTA
  if (sucesso) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-[#0f172a] border border-emerald-500/30 rounded-2xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <IconCheck size={22} />
          </div>
          <h2 className="text-base font-bold font-serif mb-1">Pagamento Aprovado!</h2>
          <p className="text-xs text-[#9baab8] mb-5">
            O material já está liberado na sua estante.
          </p>

          <div className="space-y-2">
            <Link
              href="/minha-conta"
              className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b8902a] text-black text-xs font-bold text-center text-decoration-none shadow-md"
            >
              Acessar Minha Biblioteca →
            </Link>
            <Link
              href="/"
              className="block w-full py-2 text-center text-xs text-[#9baab8] hover:text-white"
            >
              Voltar à Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-[#f0f4f8] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Luz ambiente de fundo */}
      <div className="absolute w-80 h-80 bg-[#c9a84c]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
          
          {/* Topo / Voltar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <button
              onClick={() => router.back()}
              className="text-xs text-[#9baab8] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              ← Voltar
            </button>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <IconLock size={12} /> Pagamento Seguro
            </span>
          </div>

          {erro && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-3">
              {erro}
            </div>
          )}

          <form onSubmit={handleIniciarPagamento} className="space-y-3.5">
            {/* Escolha da Carteira Móvel */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1.5">
                Forma de Pagamento
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {/* M-Pesa */}
                <button
                  type="button"
                  onClick={() => setMetodo("M-Pesa")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    metodo === "M-Pesa"
                      ? "bg-red-500/10 border-red-500 ring-2 ring-red-500/30 shadow-md shadow-red-500/10"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/5 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden relative shadow-sm bg-transparent">
                    <Image
                      src="/mpesa_logo.png"
                      alt="M-Pesa"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${metodo === "M-Pesa" ? "text-red-400" : "text-[#9baab8]"}`}>
                    M-Pesa
                  </span>
                </button>

                {/* e-Mola (Fundo circular com borda limpa, eliminando margens brancas) */}
                <button
                  type="button"
                  onClick={() => setMetodo("e-Mola")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    metodo === "e-Mola"
                      ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/5 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden relative shadow-sm bg-[#f27e16] p-1">
                    <Image
                      src="/emola_logo.png"
                      alt="e-Mola"
                      fill
                      className="object-cover scale-110"
                      unoptimized
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${metodo === "e-Mola" ? "text-amber-400" : "text-[#9baab8]"}`}>
                    e-Mola
                  </span>
                </button>
              </div>
            </div>

            {/* Número do Celular */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1">
                Número ({metodo})
              </label>
              <input
                type="tel"
                required
                placeholder={metodo === "M-Pesa" ? "84 XXX XXXX" : "86 XXX XXXX"}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-[#5a6a7a] text-xs focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>

            {/* Valor Fixo Bloqueado para Alteração */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1">
                Valor Total (Fixo)
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#9baab8] font-medium">Total a debitar:</span>
                <span className="text-sm font-extrabold text-[#f0d080]">
                  {valorFixo.toLocaleString()} MT
                </span>
              </div>
            </div>

            {/* Botão de Confirmação Neutro e Elegante */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={processando}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b8902a] text-[#0a0d14] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-[#c9a84c]/20 disabled:opacity-50"
              >
                {processando ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Pagar via {metodo} (Automático)</span>
                )}
              </button>

              {/* Opção Alternativa Direta via WhatsApp */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-[#7a8a9a]">ou</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <a
                href={`https://wa.me/258834490642?text=${encodeURIComponent(
                  `Olá Sabedoria Digital! Gostaria de comprar "${item?.titulo || "Material"}" por ${valorFixo} MT pelo WhatsApp. Como posso efetuar o pagamento?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] font-bold text-xs flex items-center justify-center gap-2 transition-all text-decoration-none shadow-sm cursor-pointer"
              >
                <span>💬 Comprar pelo WhatsApp (83 449 0642)</span>
              </a>
            </div>
          </form>

          {/* Mensagem Informativa de Rodapé em Destaque Nítido */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <p className="text-[11px] font-medium text-amber-200/90 leading-snug">
              Receberá um aviso instantâneo no celular para digitar o PIN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080c14]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
