import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telefone, valor, metodo, materialId, titulo, clienteNome, clienteEmail, usuarioId } = body;

    if (!telefone || !valor) {
      return NextResponse.json(
        { error: "Número de telemóvel e valor são obrigatórios." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ZUMBOPAY_API_KEY || "zk_live_b415f9ff054c56011f58685bc22fcc61155672ce4b8d51f7";
    const merchantId = process.env.ZUMBOPAY_MERCHANT_ID || "MCH_5303E8B8B7";
    const apiUrl = process.env.ZUMBOPAY_API_URL || "https://zumbopay.com/api/public/v1";
    let walletId = process.env.ZUMBOPAY_WALLET_MPESA || "71ce5cbe-1131-4a8f-916a-34e8cc363de7";

    // Normaliza número de telefone (apenas dígitos)
    let formattedPhone = telefone.replace(/\D/g, "");
    if (formattedPhone.length === 9) {
      formattedPhone = "258" + formattedPhone;
    }

    // Se não tivermos o walletId definido, busca dinamicamente das carteiras ativas
    if (!walletId) {
      try {
        const walletsRes = await fetch(`${apiUrl}/wallets`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "X-Merchant-Id": merchantId,
          },
        });
        if (walletsRes.ok) {
          const wData = await walletsRes.json();
          const targetMethod = metodo === "e-Mola" ? "emola" : "mpesa";
          const found = (wData.data || []).find((w: any) => w.method === targetMethod && w.is_active);
          if (found) walletId = found.id;
        }
      } catch (err) {
        console.warn("Falha ao buscar wallets dinamicamente:", err);
      }
    }

    const sourceId = `ZUMBO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[ZumboPay] Disparando STK Push para ${formattedPhone} no valor de ${valor} MT (Wallet: ${walletId})`);

    const response = await fetch(`${apiUrl}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Merchant-Id": merchantId,
        "Idempotency-Key": sourceId,
      },
      body: JSON.stringify({
        wallet_id: walletId,
        amount: Number(valor),
        msisdn: formattedPhone,
        customer_name: clienteNome || "Cliente Sabedoria Digital",
        source_id: sourceId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[ZumboPay Error]:", response.status, data);
      const errMsg = data?.error?.message || data?.message || "Erro ao processar cobrança via ZumboPay.";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    console.log("[ZumboPay Success/Pending]:", data);

    return NextResponse.json({
      success: true,
      chargeId: data?.data?.reference || sourceId,
      status: data?.data?.status || "pending",
      message: "Solicitação de PIN enviada com sucesso para o telemóvel.",
      data,
    });
  } catch (error: any) {
    console.error("[ZumboPay Internal Error]:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor ao conectar à gateway." },
      { status: 500 }
    );
  }
}
