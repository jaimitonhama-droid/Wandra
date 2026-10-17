"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { IconAlert, IconCheck, IconEye, IconEyeOff } from "@/components/Icons";

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMsgSucesso(null);

    try {
      setCarregando(true);
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/");
    } catch (err: unknown) {
      console.error("Erro no login:", err);
      const error = err as { code?: string; message?: string };
      if (
        error.code === "auth/invalid-credential" || 
        error.code === "auth/user-not-found" || 
        error.code === "auth/wrong-password"
      ) {
        setErro("E-mail ou senha incorretos.");
      } else if (error.code === "auth/invalid-email") {
        setErro("Formato de e-mail inválido.");
      } else {
        setErro("Não foi possível entrar. Verifique seus dados.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!email) {
      setErro("Digite o seu e-mail para receber o link de recuperação.");
      return;
    }
    try {
      setCarregando(true);
      setErro(null);
      await sendPasswordResetEmail(auth, email);
      setMsgSucesso("Link de recuperação enviado para o e-mail.");
    } catch {
      setErro("Erro ao enviar recuperação de senha.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f0f4f8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[450px] h-[450px] bg-[#c9a84c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#121722]/95 backdrop-blur-xl py-6 px-6 shadow-2xl rounded-2xl border border-white/10">
          
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold tracking-tight text-white font-serif">
              Entrar na Conta
            </h2>
          </div>

          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <IconAlert size={16} className="text-red-400 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {msgSucesso && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <IconCheck size={16} className="text-emerald-400 shrink-0" />
              <span>{msgSucesso}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9baab8]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleEsqueciSenha}
                  className="text-[11px] text-[#c9a84c] hover:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="Sua senha"
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
                  <span>Entrar</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-[#9baab8]">
            Não tem uma conta?{" "}
            <Link href="/criar-conta" className="text-[#c9a84c] hover:underline font-semibold">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
