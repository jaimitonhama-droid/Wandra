"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFiles } from "@/utils/uploadthing";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NovoLivro() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("Negócios");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState<"livro" | "ebook">("livro");
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with pdf.js
    import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const extractCover = async (file: File) => {
    if (!pdfjsLib) return;
    try {
      setUploadStatus("A extrair capa mágica...");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCoverBlob(blob);
          setCoverPreview(URL.createObjectURL(blob));
          setUploadStatus("");
        }
      }, "image/jpeg", 0.9);
      
    } catch (error) {
      console.error("Erro ao extrair capa:", error);
      setUploadStatus("Erro ao extrair capa. Pode continuar.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      extractCover(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !titulo || !preco || !coverBlob) {
      alert("Por favor, preencha tudo e aguarde a capa carregar.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      setUploadStatus("Enviando Capa para a nuvem...");
      // Remove acentos e caracteres especiais do nome do ficheiro para evitar erro de assinatura no UploadThing
      const safeTitulo = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
      const coverFile = new File([coverBlob], `${safeTitulo}_capa.jpg`, { type: "image/jpeg" });
      const coverRes = await uploadFiles("imageUploader", { files: [coverFile] });
      const coverUrl = coverRes[0]?.url || (coverRes[0] as any)?.ufsUrl;

      if (!coverUrl) {
        throw new Error("Não foi possível obter o link da capa após o envio.");
      }

      setUploadStatus("Enviando PDF do Livro...");
      const safePdfName = pdfFile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "_");
      const safePdfFile = new File([pdfFile], safePdfName, { type: pdfFile.type });
      const pdfRes = await uploadFiles("pdfUploader", { files: [safePdfFile] });
      const pdfUrl = pdfRes[0]?.url || (pdfRes[0] as any)?.ufsUrl;

      if (!pdfUrl) {
        throw new Error("Não foi possível obter o link do PDF após o envio.");
      }

      setUploadStatus("Salvando no Banco de Dados...");
      await addDoc(collection(db, "livros"), {
        titulo,
        autor,
        categoria,
        tipo,
        preco: parseFloat(preco),
        descricao,
        capaUrl: coverUrl,
        pdfUrl: pdfUrl,
        criadoEm: new Date().toISOString(),
      });
      
      setUploadStatus("Concluído!");
      setTimeout(() => router.push("/admin/livros"), 1000);
      
    } catch (error: any) {
      console.error("Erro no processo:", error);
      alert(`Erro ao enviar o livro: ${error?.message || "Erro desconhecido"}`);
      setIsUploading(false);
      setUploadStatus("");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>
          Adicionar Novo {tipo === "ebook" ? "E-book" : "Livro"}
        </h1>
        <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>O sistema extrairá a primeira página do PDF como capa automaticamente.</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "linear-gradient(135deg, #0d1320, #0a1028)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "32px",
      }}>

        {/* Tipo de Publicação */}
        <div style={{ marginBottom: "26px" }}>
          <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "10px", fontWeight: "600" }}>
            Tipo de Material (Marque se é Livro ou E-book)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <button
              type="button"
              onClick={() => setTipo("livro")}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: tipo === "livro" ? "2px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                background: tipo === "livro" ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.3)",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: tipo === "livro" ? "linear-gradient(135deg, #c9a84c, #e8890a)" : "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}>
                📖
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: tipo === "livro" ? "#c9a84c" : "#eee" }}>
                  Livro
                </div>
                <div style={{ fontSize: "12px", color: tipo === "livro" ? "rgba(255,255,255,0.7)" : "#777", marginTop: "2px" }}>
                  Obra completa / Livro digital
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTipo("ebook")}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: tipo === "ebook" ? "2px solid #34d399" : "1px solid rgba(255,255,255,0.1)",
                background: tipo === "ebook" ? "rgba(52,211,153,0.15)" : "rgba(0,0,0,0.3)",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: tipo === "ebook" ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}>
                📱
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: tipo === "ebook" ? "#34d399" : "#eee" }}>
                  E-book
                </div>
                <div style={{ fontSize: "12px", color: tipo === "ebook" ? "rgba(255,255,255,0.7)" : "#777", marginTop: "2px" }}>
                  Guia prático / Manual digital
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "8px", fontWeight: "500" }}>
              Título do {tipo === "ebook" ? "E-book" : "Livro"}
            </label>
            <input 
              required
              value={titulo} onChange={(e) => setTitulo(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
              placeholder="Ex: A Arte da Guerra"
            />
          </div>
          <div>
            <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "8px", fontWeight: "500" }}>Autor</label>
            <input 
              required
              value={autor} onChange={(e) => setAutor(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
              placeholder="Ex: Sun Tzu"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "8px", fontWeight: "500" }}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a1028", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
            >
              <option value="Negócios">💼 Negócios</option>
              <option value="Desenvolvimento Pessoal">🧠 Desenvolvimento Pessoal</option>
              <option value="Finanças & Riqueza">💰 Finanças & Riqueza</option>
              <option value="Marketing Digital">🌐 Marketing Digital</option>
              <option value="Vendas & Negociação">🎯 Vendas & Negociação</option>
              <option value="Filosofia & Estoicismo">🏛️ Filosofia & Estoicismo</option>
              <option value="Inteligência Emocional">🧘 Inteligência Emocional</option>
              <option value="Produtividade & Foco">⏱️ Produtividade & Foco</option>
              <option value="Liderança & Gestão">🚀 Liderança & Gestão</option>
              <option value="Comunicação & Oratória">🗣️ Comunicação & Oratória</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "8px", fontWeight: "500" }}>Preço (MT)</label>
            <input 
              required type="number"
              value={preco} onChange={(e) => setPreco(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
              placeholder="Ex: 450"
            />
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "#ccc", fontSize: "13px", marginBottom: "8px", fontWeight: "500" }}>Sinopse Curta</label>
          <textarea 
            required rows={3}
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", resize: "vertical" }}
            placeholder="Uma breve descrição sobre o conteúdo do livro..."
          />
        </div>

        <div style={{ padding: "24px", border: "2px dashed rgba(245,166,35,0.3)", borderRadius: "12px", marginBottom: "24px", textAlign: "center" }}>
          <label style={{ cursor: "pointer", display: "block" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{tipo === "ebook" ? "📱" : "📄"}</div>
            <div style={{ color: tipo === "ebook" ? "#34d399" : "#f5a623", fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>
              Clique para selecionar o PDF do {tipo === "ebook" ? "E-book" : "Livro"}
            </div>
            <div style={{ color: "#777", fontSize: "13px" }}>Máximo 32MB</div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
        </div>

        {pdfFile && (
          <div style={{ display: "flex", gap: "20px", alignItems: "center", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "24px" }}>
            <div style={{ width: "80px", height: "110px", background: "#111", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
              {coverPreview ? (
                <img src={coverPreview} alt="Capa gerada" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>⏳</div>
              )}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600" }}>{pdfFile.name}</div>
              <div style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</div>
              <div style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600", marginTop: "8px" }}>✓ Capa extraída com sucesso</div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isUploading || !coverBlob}
          style={{
            width: "100%",
            background: isUploading || !coverBlob ? "#444" : tipo === "ebook" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #f5a623, #e8890a)",
            color: isUploading || !coverBlob ? "#888" : tipo === "ebook" ? "#fff" : "#000",
            fontWeight: "700",
            fontSize: "16px",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: isUploading || !coverBlob ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {isUploading ? "Processando..." : `Salvar e Publicar ${tipo === "ebook" ? "E-book" : "Livro"}`}
        </button>

        {uploadStatus && (
          <div style={{ textAlign: "center", color: "#4a9eff", fontSize: "14px", marginTop: "16px", fontWeight: "500" }}>
            {uploadStatus}
          </div>
        )}
      </form>
    </div>
  );
}
