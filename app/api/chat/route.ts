import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: "A chave da Anthropic não está configurada. Adicione ANTHROPIC_API_KEY nas variáveis de ambiente do Vercel ou Replit para ativar o agrônomo IA.",
    });
  }

  const { messages } = await req.json();

  const systemPrompt = `Você é um agrônomo especialista em culturas do Sul do Brasil (Rio Grande do Sul, Santa Catarina e Paraná).

Você domina:
- Culturas: soja, milho, trigo, aveia, azevém, maçã, cebola, alho, brócolis, pastagens
- Manejo conforme Manual de Adubação e Calagem RS/SC (CQFS-RS/SC)
- Clima subtropical: geadas, horas de frio, janelas de plantio
- Pragas e doenças regionais
- Sistema Plantio Direto (SPD)
- Integração lavoura-pecuária
- Fruticultura de clima temperado

Responda de forma prática, curta e objetiva. Use linguagem do produtor rural (respeitosa e técnica).
Sempre contextualize recomendações para o Sul do Brasil.
Se a pergunta for fora do agronegócio, redirecione educadamente.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Desculpe, não consegui gerar resposta.";
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ reply: "Erro ao consultar a IA. Tente novamente." });
  }
}
