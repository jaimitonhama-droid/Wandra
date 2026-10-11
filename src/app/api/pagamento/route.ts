import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telefone, valor, metodo, materialId, titulo, clienteNome, clienteEmail, usuarioId } = body;

    if (!telefone || !valor) {
      return NextResponse.json(
        { error: "Telefone e valor são obrigatórios." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NETSHOP_API_KEY;
    const apiUrl = process.env.NETSHOP_API_URL || "https://www.netshop.co.mz/api/v1";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da NetShop não configurada no servidor." },
        { status: 500 }
      );
    }

    // Normaliza número de telefone (remover espaços, adicionar código país se necessário)
    let formattedPhone = telefone.replace(/\D/g, "");
    if (formattedPhone.length === 9) {
      formattedPhone = "258" + formattedPhone;
    }

    // Requisição para a API da NetShop para disparar o STK Push (Pop-up do PIN)
    const response = await fetch(`${apiUrl}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        amount: Number(valor),
        currency: "MZN",
        payment_method: metodo === "e-Mola" ? "emola" : "mpesa",
        customer: {
          phone: formattedPhone,
          name: clienteNome || "Cliente",
          email: clienteEmail || "cliente@gmail.com",
        },
        metadata: {
          materialId,
          titulo,
          usuarioId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pela NetShop:", data);
      return NextResponse.json(
        { error: data.message || "Erro ao processar cobrança na NetShop." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      chargeId: data.id || data.charge_id,
      message: "Solicitação enviada para o telemóvel com sucesso.",
      data,
    });
  } catch (error: any) {
    console.error("Erro interno no checkout NetShop:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
