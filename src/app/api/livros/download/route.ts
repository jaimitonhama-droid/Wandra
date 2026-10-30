import { NextResponse } from "next/server";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carla-v5";

// Consulta Firestore via REST API (sem firebase-admin, sem chave de serviço)
async function firestoreQuery(
  collection: string,
  filters: { field: string; value: string }[]
): Promise<any[]> {
  const structuredQuery: any = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: filters.map((f) => ({
            fieldFilter: {
              field: { fieldPath: f.field },
              op: "EQUAL",
              value: { stringValue: f.value },
            },
          })),
        },
      },
      limit: 1,
    },
  };

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(structuredQuery),
  });

  if (!res.ok) return [];
  const data = await res.json();
  // Retorna os documentos encontrados (ignora respostas sem "document")
  return data.filter((d: any) => d.document);
}

// Busca um documento por ID na Firestore REST API
async function firestoreGet(collection: string, docId: string): Promise<any | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

// Converte valor Firestore REST para valor JS
function parseFirestoreValue(val: any): any {
  if (!val) return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("booleanValue" in val) return val.booleanValue;
  if ("nullValue" in val) return null;
  if ("mapValue" in val) {
    const obj: any = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const livroId = searchParams.get("id");
    const userId = searchParams.get("uid");

    if (!livroId || !userId) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    // 1. Verificar compra na coleção "compras"
    const comprasResult = await firestoreQuery("compras", [
      { field: "usuarioId", value: userId },
      { field: "materialId", value: livroId },
    ]);

    let autorizado = comprasResult.length > 0;

    // 2. Fallback: verificar em "vendas" com status aprovado
    if (!autorizado) {
      const vendasResult = await firestoreQuery("vendas", [
        { field: "usuarioId", value: userId },
        { field: "materialId", value: livroId },
        { field: "status", value: "aprovado" },
      ]);
      autorizado = vendasResult.length > 0;
    }

    if (!autorizado) {
      return new Response(
        `<!DOCTYPE html>
        <html lang="pt">
        <head><meta charset="UTF-8"><title>Acesso Negado</title>
        <style>body{font-family:sans-serif;background:#060910;color:#f0f4f8;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}
        .box{max-width:400px;padding:40px;background:#0a0d14;border:1px solid rgba(201,168,76,0.3);border-radius:16px;}
        h2{color:#c9a84c;margin-bottom:12px;}p{color:#9baab8;margin-bottom:24px;}
        a{display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#c9a84c,#b8902a);color:#0a0d14;font-weight:700;border-radius:10px;text-decoration:none;}
        </style></head>
        <body><div class="box">
        <div style="font-size:2.5rem;margin-bottom:16px">🔒</div>
        <h2>Acesso Restrito</h2>
        <p>Este material não está na sua biblioteca. Adquira-o para ter acesso ao download.</p>
        <a href="/livros">Ver Catálogo</a>
        </div></body></html>`,
        { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // 3. Buscar os dados do livro (pdfUrl e título)
    const livroDoc = await firestoreGet("livros", livroId);
    if (!livroDoc || !livroDoc.fields) {
      return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
    }

    const titulo = parseFirestoreValue(livroDoc.fields.titulo) || "livro";
    const pdfUrl = parseFirestoreValue(livroDoc.fields.pdfUrl);

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "Arquivo PDF não disponível para este material." },
        { status: 404 }
      );
    }

    // 4. Proxy do PDF com header de download (funciona para URLs UploadThing e locais)
    const nomeArquivo = `${titulo.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()}.pdf`;

    if (pdfUrl.startsWith("http")) {
      const pdfRes = await fetch(pdfUrl, { headers: { "User-Agent": "Sabedoria-Digital/1.0" } });
      if (!pdfRes.ok) {
        return NextResponse.json({ error: "Erro ao obter o arquivo. Tente novamente." }, { status: 502 });
      }

      const headers = new Headers();
      headers.set("Content-Type", "application/pdf");
      headers.set("Content-Disposition", `attachment; filename="${nomeArquivo}"`);
      headers.set("Cache-Control", "no-store, no-cache");
      headers.set("X-Content-Type-Options", "nosniff");

      return new Response(pdfRes.body, { status: 200, headers });
    }

    // Fallback para URL relativa (public/)
    return NextResponse.redirect(new URL(pdfUrl, req.url));
  } catch (error: any) {
    console.error("[Download API Error]:", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
