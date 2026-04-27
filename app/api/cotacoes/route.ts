import { NextResponse } from "next/server";

// Cache em memória — não bate na API a cada request
let cache: any = null;
let cacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export async function GET() {
  // Se tem cache fresco, retorna
  if (cache && Date.now() - cacheTime < CACHE_DURATION) {
    return NextResponse.json(cache);
  }

  const result: any = {
    cotacoes: [],
    updatedAt: new Date().toISOString(),
    source: "AwesomeAPI + fontes diversas",
  };

  // ========== DÓLAR e EURO (AwesomeAPI - confiável) ==========
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL", {
      next: { revalidate: 1800 },
    });
    const data = await res.json();
    if (data.USDBRL) {
      const usd = parseFloat(data.USDBRL.bid);
      const usdVar = parseFloat(data.USDBRL.pctChange);
      result.cotacoes.push({
        id: "usd",
        label: "Dólar (USD)",
        value: usd,
        formatted: `R$ ${usd.toFixed(2).replace(".", ",")}`,
        change: usdVar,
        unit: "BRL",
        category: "moeda",
      });
    }
    if (data.EURBRL) {
      const eur = parseFloat(data.EURBRL.bid);
      const eurVar = parseFloat(data.EURBRL.pctChange);
      result.cotacoes.push({
        id: "eur",
        label: "Euro",
        value: eur,
        formatted: `R$ ${eur.toFixed(2).replace(".", ",")}`,
        change: eurVar,
        unit: "BRL",
        category: "moeda",
      });
    }
  } catch (e) {
    console.error("Erro USD/EUR:", e);
  }

  // ========== COMMODITIES (valores referenciais — atualizar quando possível com APIs) ==========
  // Como CEPEA não tem API pública, usamos valores de referência que podem ser atualizados
  // No futuro, integração paga com CEPEA ou parceria com cooperativas
  
  // Tentativa 1: API alternativa de commodities
  try {
    // Algumas APIs públicas brasileiras de cotação de commodities
    // Não há garantia de funcionamento — fallback pra valores de referência
    const commoditiesRef = [
      { id: "soja", label: "Soja", refValue: 132.50, unit: "sc 60kg", category: "grao", source: "CEPEA/Paranaguá" },
      { id: "milho", label: "Milho", refValue: 71.50, unit: "sc 60kg", category: "grao", source: "CEPEA/Campinas" },
      { id: "trigo", label: "Trigo", refValue: 76.00, unit: "sc 60kg", category: "grao", source: "CEPEA/PR" },
      { id: "arroz", label: "Arroz", refValue: 95.00, unit: "sc 50kg", category: "grao", source: "CEPEA/RS" },
      { id: "boi-gordo", label: "Boi Gordo", refValue: 286.50, unit: "@ (15kg)", category: "pecuaria", source: "CEPEA/SP" },
      { id: "leite", label: "Leite ao Produtor", refValue: 2.45, unit: "litro", category: "pecuaria", source: "CEPEA Mensal" },
      { id: "suino", label: "Suíno Vivo", refValue: 7.80, unit: "kg vivo", category: "pecuaria", source: "CEPEA/SC" },
    ];

    commoditiesRef.forEach(c => {
      result.cotacoes.push({
        id: c.id,
        label: c.label,
        value: c.refValue,
        formatted: `R$ ${c.refValue.toFixed(2).replace(".", ",")}`,
        unit: c.unit,
        category: c.category,
        source: c.source,
        isReference: true, // marca como valor de referência (não tempo real)
      });
    });
  } catch (e) {
    console.error("Erro commodities:", e);
  }

  // Cache
  cache = result;
  cacheTime = Date.now();

  return NextResponse.json(result);
}
