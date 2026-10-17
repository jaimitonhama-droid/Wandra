"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { IconAlert, IconEye, IconEyeOff } from "@/components/Icons";

export default function CriarContaPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Por favor, digite seu nome completo.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: nome.trim(),
      });

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: nome.trim(),
        email: user.email,
        criadoEm: new Date().toISOString(),
        role: "cliente",
      }, { merge: true });

      router.push("/?cadastro=sucesso");
    } catch (err: unknown) {
      console.error("Erro detalhado no cadastro:", err);
      const error = err as { code?: string; message?: string };
      const code = error.code || "";
      if (code === "auth/email-already-in-use") {
        setErro("Este e-mail já existe na base de dados. Tente fazer login ou recupere a senha.");
      } else if (code === "auth/invalid-email") {
        setErro("Formato de e-mail inválido.");
      } else if (code === "auth/weak-password") {
        setErro("Senha muito fraca. Mínimo 6 caracteres.");
      } else if (code === "auth/network-request-failed") {
        setErro("Falha de rede. Verifique sua conexão com a internet.");
      } else if (code === "auth/operation-not-allowed") {
        setErro("O método de autenticação por E-mail/Senha não está ativado no Firebase Console.");
      } else {
        setErro(`[${code || "erro"}] ${error.message || "Erro ao criar conta."}`);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f0f4f8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luz ambiente sutil */}
      <div className="absolute w-[450px] h-[450px] bg-[#c9a84c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#121722]/95 backdrop-blur-xl py-6 px-6 shadow-2xl rounded-2xl border border-white/10">
          
          {/* Cabeçalho minimalista */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold tracking-tight text-white font-serif">
              Criar Conta
            </h2>
          </div>

          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <IconAlert size={16} className="text-red-400 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Albino Matusse"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-[#5a6a7a] text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1">
                E-mail (Gmail)
              </label>
              <input
                type="email"
                required
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-[#5a6a7a] text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8] mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-[#5a6a7a] text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5a6a7a] hover:text-white transition-colors"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                >
                  {mostrarSenha ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={carregando}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b8902a] text-[#0a0d14] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-[#c9a84c]/20 disabled:opacity-50"
              >
                {carregando ? (
                  <div className="w-4 h-4 border-2 border-[#0a0d14] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Criar Minha Conta</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-[#9baab8]">
            Já tem uma conta?{" "}
            <Link href="/entrar" className="text-[#c9a84c] hover:underline font-semibold">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
