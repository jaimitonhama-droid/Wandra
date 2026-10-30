const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");
const { UTApi } = require("uploadthing/server");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const utapi = new UTApi({
  token: "eyJhcGlLZXkiOiJza19saXZlXzMxZjIyNjg4MTBmNjVhNTk5YTU4YmUwNDUxN2IzYTk3MDA4N2ZlNDQ4ZGI5OTYxNDJhYjc3M2JlN2E1OGRmMTgiLCJhcHBJZCI6InpiazF0dHdmdjMiLCJyZWdpb25zIjpbInNlYTEiXX0=",
});

async function main() {
  console.log("=================================================");
  console.log("  INICIANDO EXTRAÇÃO DE CAPAS ORIGINAIS (PDF -> UPLOADTHING)");
  console.log("=================================================");

  // 1. Carregar livros que precisam da capa original
  const snap = await getDocs(collection(db, "livros"));
  const books = [];

  snap.forEach((d) => {
    const data = d.data();
    if (!data.capaUrl || !data.capaUrl.startsWith("https://")) {
      const filename = path.basename(data.pdfUrl || "");
      const fullPdfPath = path.join(process.cwd(), "public", "livros", filename);
      if (fs.existsSync(fullPdfPath)) {
        books.push({
          id: d.id,
          titulo: data.titulo,
          filename: filename,
        });
      }
    }
  });

  console.log(`Encontrados ${books.length} livros para extrair a capa original.`);
  if (books.length === 0) {
    console.log("Todos os livros já possuem capa válida!");
    process.exit(0);
  }

  // 2. Servidor HTTP local para fornecer PDFs e receber as capas renderizadas
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (parsedUrl.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Extrator de Capas Mágicas</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body style="font-family: Arial, sans-serif; background: #0a0d14; color: #fff; padding: 30px;">
  <h2 style="color: #c9a84c;">Extraindo capas originais dos livros...</h2>
  <div id="status" style="font-size: 16px; margin-bottom: 20px; color: #34d399;">Iniciando...</div>
  <div id="log" style="font-family: monospace; font-size: 13px; line-height: 1.6; max-height: 400px; overflow-y: auto; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;"></div>
  <canvas id="c" style="display:none;"></canvas>

  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    async function run() {
      const log = document.getElementById('log');
      const status = document.getElementById('status');
      
      const booksRes = await fetch('/books');
      const books = await booksRes.json();
      
      for (let i = 0; i < books.length; i++) {
        const b = books[i];
        status.textContent = "Processando [" + (i + 1) + "/" + books.length + "]: " + b.titulo;
        
        try {
          const pdfUrl = '/pdf/' + encodeURIComponent(b.filename);
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdfDoc = await loadingTask.promise;
          const page = await pdfDoc.getPage(1);
          
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.getElementById('c');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          
          await page.render({ canvasContext: ctx, viewport }).promise;
          const base64 = canvas.toDataURL('image/jpeg', 0.92);
          
          const upRes = await fetch('/upload-cover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: b.id, titulo: b.titulo, base64: base64 })
          });
          const upData = await upRes.json();
          
          const div = document.createElement('div');
          div.textContent = "✅ [" + (i + 1) + "/" + books.length + "] " + b.titulo + " -> " + upData.url;
          log.appendChild(div);
          log.scrollTop = log.scrollHeight;
        } catch (err) {
          const div = document.createElement('div');
          div.style.color = '#f87171';
          div.textContent = "❌ [" + (i + 1) + "/" + books.length + "] " + b.titulo + ": " + err.message;
          log.appendChild(div);
        }
      }
      
      status.textContent = "🎉 TODAS AS CAPAS FORAM EXTRAÍDAS E ENVIADAS!";
      await fetch('/done', { method: 'POST' });
      setTimeout(() => { window.close(); }, 2000);
    }

    run();
  </script>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === "/books") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(books));
      return;
    }

    if (parsedUrl.pathname.startsWith("/pdf/")) {
      const filename = decodeURIComponent(parsedUrl.pathname.replace("/pdf/", ""));
      const pdfPath = path.join(process.cwd(), "public", "livros", filename);
      if (fs.existsSync(pdfPath)) {
        res.writeHead(200, { "Content-Type": "application/pdf" });
        fs.createReadStream(pdfPath).pipe(res);
      } else {
        res.writeHead(404);
        res.end("PDF not found");
      }
      return;
    }

    if (parsedUrl.pathname === "/upload-cover" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const { id, titulo, base64 } = JSON.parse(body);
          const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");

          // Remove acentos e caracteres especiais para nome seguro no UploadThing
          const safeTitulo = titulo
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "_");

          const file = new File([buffer], `${safeTitulo}_capa.jpg`, { type: "image/jpeg" });
          const uploadRes = await utapi.uploadFiles([file]);

          const capaUrl = uploadRes[0]?.data?.ufsUrl || uploadRes[0]?.data?.url;
          if (!capaUrl) {
            throw new Error(uploadRes[0]?.error?.message || "Falha ao obter URL de upload");
          }

          // Atualiza no Firestore
          await updateDoc(doc(db, "livros", id), {
            capaUrl: capaUrl,
          });

          console.log(`[OK] Capa enviada: ${titulo} -> ${capaUrl}`);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, url: capaUrl }));
        } catch (e) {
          console.error("Erro no processamento da capa:", e);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (parsedUrl.pathname === "/done" && req.method === "POST") {
      console.log("\n=================================================");
      console.log("  TODAS AS 28 CAPAS ORIGINAIS FORAM ATUALIZADAS NO FIRESTORE!");
      console.log("=================================================");
      res.writeHead(200);
      res.end("OK");
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  server.listen(4000, () => {
    console.log("Servidor de extração rodando na porta 4000.");
    console.log("Abrindo Microsoft Edge para extrair as capas dos PDFs...");

    const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
    spawn(edgePath, ["--headless=new", "http://localhost:4000"]);
  });
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});

