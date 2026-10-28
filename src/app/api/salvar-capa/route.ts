import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { nome, dataUrl } = await req.json();

    if (!nome || !dataUrl) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    // Remove prefixo "data:image/jpeg;base64,"
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const capasDir = path.join(process.cwd(), "public", "capas");
    if (!fs.existsSync(capasDir)) {
      fs.mkdirSync(capasDir, { recursive: true });
    }

    const filePath = path.join(capasDir, nome);
    fs.writeFileSync(filePath, buffer);

    console.log(`[CAPA ORIGINAL SALVA] -> ${nome} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return NextResponse.json({ success: true, path: `/capas/${nome}` });
  } catch (error: any) {
    console.error("Erro ao salvar capa:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
