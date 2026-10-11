import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("🔔 Webhook NetShop recebido:", payload);

    const event = payload.event; // Ex: "charge.paid", "charge.failed"
    const data = payload.data || payload;

    if (event === "charge.paid" || data.status === "paid" || data.status === "successful") {
      const chargeId = data.id || data.charge_id;
      const metadata = data.metadata || {};
      const amount = data.amount || 0;
      const customer = data.customer || {};

      // 1. Registrar ou atualizar venda no Firestore
      await addDoc(collection(db, "vendas"), {
        clienteNome: customer.name || "Cliente",
        clienteEmail: customer.email || "cliente@gmail.com",
        clienteTelefone: customer.phone || "",
        usuarioId: metadata.usuarioId || null,
        materialId: metadata.materialId || "geral",
        itemTitulo: metadata.titulo || "Material Sabedoria Digital",
        itemTipo: "livro",
        valor: Number(amount),
        metodoPagamento: data.payment_method?.includes("emola") ? "e-Mola" : "M-Pesa",
        referencia: chargeId || `NETSHOP-${Date.now()}`,
        status: "aprovado",
        data: new Date().toISOString(),
      });

      // 2. Liberar na biblioteca do usuário se tiver usuarioId
      if (metadata.usuarioId) {
        await addDoc(collection(db, "compras"), {
          usuarioId: metadata.usuarioId,
          materialId: metadata.materialId || "geral",
          titulo: metadata.titulo || "Material Adquirido",
          compradoEm: new Date().toISOString(),
          status: "liberado",
        });
      }

      return NextResponse.json({ received: true, status: "liberado" });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Erro ao processar webhook NetShop:", err);
    return NextResponse.json({ error: "Erro no webhook" }, { status: 500 });
  }
}
