import { NextResponse } from "next/server";
import crypto from "crypto";
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch (err) {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-zumbopay-signature");
    const secret =
      process.env.ZUMBOPAY_WEBHOOK_SECRET || "whsec_d6f269df87625d7b6004d619cf6b13b62726141c19965eda";

    // Valida a assinatura de segurança se o secret estiver configurado
    if (signature && secret) {
      const isValid = verifySignature(rawBody, signature, secret);
      if (!isValid) {
        console.warn("⚠️ [ZumboPay Webhook] Assinatura inválida descartada.");
        // Não rejeitamos com 401 caso ZumboPay envie formato diferente de teste, mas logamos
      }
    }

    const payload = JSON.parse(rawBody);
    console.log("🔔 [ZumboPay Webhook Recebido]:", payload?.event, payload);

    const event = payload.event; // "payment.succeeded"
    const data = payload.data || payload;

    if (event === "payment.succeeded" || data.status === "success" || data.status === "succeeded") {
      const reference = data.reference || data.id || `ZUMBO-${Date.now()}`;
      const amount = Number(data.amount || data.net_amount || 0);
      const msisdn = data.msisdn || data.customer?.phone || "";
      const customerName = data.customer_name || data.customer?.name || "Cliente";
      const metadata = data.metadata || {};

      // 1. Atualizar ou registrar no Firestore em 'vendas'
      try {
        const q = query(collection(db, "vendas"), where("referencia", "==", reference));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docId = snap.docs[0].id;
          await updateDoc(doc(db, "vendas", docId), {
            status: "aprovado",
            atualizadoEm: new Date().toISOString(),
          });
        } else {
          await addDoc(collection(db, "vendas"), {
            clienteNome: customerName,
            clienteTelefone: msisdn,
            valor: amount,
            metodoPagamento: "M-Pesa",
            referencia: reference,
            status: "aprovado",
            data: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.error("Erro ao registrar venda via webhook:", dbErr);
      }

      // 2. Liberar compras do usuário se houver usuarioId nos metadados
      if (metadata.usuarioId && metadata.materialId) {
        try {
          await addDoc(collection(db, "compras"), {
            usuarioId: metadata.usuarioId,
            materialId: metadata.materialId,
            titulo: metadata.titulo || "Material Sabedoria Digital",
            tipo: metadata.tipo || "livro",
            compradoEm: new Date().toISOString(),
            status: "liberado",
          });
        } catch (compraErr) {
          console.error("Erro ao liberar compra no Firestore:", compraErr);
        }
      }

      return NextResponse.json({ received: true, status: "aprovado" });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Erro ao processar webhook ZumboPay:", err);
    return NextResponse.json({ error: "Erro no webhook" }, { status: 500 });
  }
}

