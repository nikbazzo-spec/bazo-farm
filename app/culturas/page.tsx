"use client";
import { useState } from "react";
import { Card, Header, Badge } from "@/components/UI";
import { ChevronRight } from "lucide-react";

type Cultivar = {
  name: string;
  cycle?: string;
  notes?: string;
};

type Training = {
  name: string;
  spacing: string;
  plantsPerHa: string;
  notes: string;
};

type Phase = {
  month: string;
  stage: string;
  activities: string[];
};

type Crop = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  cycle: string;
  idealPH: string;
  cultivars: Cultivar[];
  pests: string[];
  diseases: string[];
  defensives: string[];
  notes: string;
  training?: Training[];
  phenology?: Phase[];
  pollination?: string;
  rootstocks?: string[];
};

const crops: Crop[] = [
  // ===== GRÃOS =====
  {
    id: "soja",
    name: "Soja",
    emoji: "🌱",
    category: "Grão",
    cycle: "Verão (set-mar)",
    idealPH: "6,0-6,5",
    cultivars: [
      { name: "BRS 1075IPRO", cycle: "GM 5.8", notes: "Embrapa. Resistente a cancro e Phytophthora. Plantio antecipado." },
      { name: "BRS 1457IPRO", cycle: "GM 5.7", notes: "Embrapa. Precoce. Indicada pra toda região Sul." },
      { name: "BRS 5804RR", cycle: "Precoce", notes: "Embrapa Trigo. Alta produtividade, sanidade de raiz." },
      { name: "Brasmax Titanium I2X", cycle: "GM 5.4-5.9", notes: "Destaque no Sul. 65-75 sc/ha em áreas de altitude." },
      { name: "Brevant B5540E", cycle: "GM 5.4", notes: "Alta produtividade, ampla adaptação." },
      { name: "DM54IX57RSF I2X", cycle: "GM 5.7", notes: "DonMario. Recordista CESB 2024 no RS (123 sc/ha). Alto PMG." },
      { name: "DM59IX61RSF I2X", cycle: "GM 6.0", notes: "DonMario. STS (tolerante sulfoniluréias). M1 e PR." },
      { name: "DM60IX64RSF I2X", cycle: "GM 6.4", notes: "DonMario. Única com tolerância a nematoide de galha." },
      { name: "DM65IX67RSF I2X", cycle: "GM 6.5-6.6", notes: "DonMario. Tolerância ao calor e déficit hídrico." },
      { name: "BMX Valente RR", cycle: "Precoce", notes: "Tradicional no RS, boa sanidade." },
    ],
    pests: ["Percevejo-marrom", "Lagarta-da-soja", "Mosca-branca", "Helicoverpa", "Lagarta-falsa-medideira"],
    diseases: ["Ferrugem asiática", "Mofo-branco", "Antracnose", "Mancha-olho-de-rã", "Cancro da haste", "Podridão radicular de Phytophthora"],
    defensives: [
      "Fungicidas: protioconazol + trifloxistrobina, azoxistrobina + benzovindiflupir, mancozebe (multissítio)",
      "Inseticidas: acefato, lambda-cialotrina, clorantraniliprole, flubendiamida",
      "Herbicidas: glifosato (culturas RR), dicamba (Xtend), 2,4-D (Enlist), S-metolacloro (pré)",
      "⚠️ Sempre consultar AGROFIT/MAPA para registro atualizado e dose conforme bula."
    ],
    notes: "No RS, semeadura ideal outubro-novembro. Monitorar ferrugem asiática a partir de R1. Rotação com milho/trigo reduz doenças. Tecnologia Intacta2/Xtend (I2X) em destaque para safra 25/26.",
  },
  {
    id: "milho",
    name: "Milho",
    emoji: "🌽",
    category: "Grão",
    cycle: "Verão/safrinha",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "P3016", cycle: "Precoce", notes: "Pioneer. Alta sanidade, boa pra safra verão." },
      { name: "DKB 290 VT PRO3", cycle: "Precoce", notes: "Dekalb. Tecnologia PRO3 (3 proteínas Bt)." },
      { name: "AG 9045 VT PRO4", cycle: "Super precoce", notes: "Agroceres. Boa pra silagem e grão." },
      { name: "P4285 VYHR", cycle: "Precoce", notes: "Pioneer. Tolerância ao glifosato + lagartas." },
      { name: "K9606 VIP3", cycle: "Precoce", notes: "KWS. Tecnologia Viptera 3 contra lagartas." },
      { name: "30F53 VYHR", cycle: "Precoce", notes: "Pioneer. Tradicional no Sul." },
    ],
    pests: ["Lagarta-do-cartucho", "Cigarrinha-do-milho", "Percevejo-castanho", "Lagarta-elasmo"],
    diseases: ["Mancha branca", "Enfezamento pálido e vermelho", "Ferrugem polissora", "Ferrugem comum", "Helmintosporiose"],
    defensives: [
      "Fungicidas: azoxistrobina + ciproconazol, piraclostrobina + epoxiconazol",
      "Inseticidas: clorantraniliprole, espinetoram, metomil, tiametoxam (TSI)",
      "Herbicidas: atrazina + S-metolacloro, nicosulfuron (pós), tembotriona",
      "⚠️ Consultar AGROFIT para registro por cultivar/tecnologia."
    ],
    notes: "No Sul, evitar semeadura tardia (após dez). Adubação nitrogenada parcelada em V4 e V8. Produtividade alta (>10 t/ha) exige V% acima de 65%. Controle de cigarrinha no estabelecimento é crítico pra evitar enfezamento.",
  },
  {
    id: "trigo",
    name: "Trigo",
    emoji: "🌾",
    category: "Grão",
    cycle: "Inverno (mai-nov)",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "TBIO Toruk", cycle: "Precoce", notes: "Biotrigo. Alta produtividade, resistente a giberela." },
      { name: "TBIO Audaz", cycle: "Médio", notes: "Biotrigo. Destaque em panificação." },
      { name: "BRS Marcante", cycle: "Médio", notes: "Embrapa. Rusticidade e estabilidade." },
      { name: "BRS Reponte", cycle: "Precoce", notes: "Embrapa. Boa sanidade foliar." },
      { name: "ORS Feroz", cycle: "Médio", notes: "OR Sementes. Bom PMG e qualidade industrial." },
      { name: "ORS Madrepérola", cycle: "Precoce", notes: "OR Sementes. Aptidão panificação." },
      { name: "IPR Catuara TM", cycle: "Precoce", notes: "IDR-Paraná. Tolerância a mosaico." },
    ],
    pests: ["Pulgão-verde", "Pulgão-da-espiga", "Lagarta-do-trigo", "Percevejo-barriga-verde"],
    diseases: ["Brusone", "Giberela", "Oídio", "Ferrugem da folha", "Mancha amarela", "Mal do pé"],
    defensives: [
      "Fungicidas: protioconazol + trifloxistrobina, mancozebe (giberela), tebuconazol",
      "Inseticidas: imidacloprido (TSI), lambda-cialotrina, acefato",
      "Herbicidas: metsulfurom-metílico, iodosulfurom, 2,4-D",
      "⚠️ Giberela controla-se com pulverização no florescimento - janela crítica."
    ],
    notes: "RS é maior produtor nacional. Janela de plantio: junho-julho. Controle de giberela é crítico no florescimento. Rotação com soja essencial. Evitar semear após milho (risco de giberela e fusarium).",
  },
  {
    id: "aveia-grao",
    name: "Aveia (grão)",
    emoji: "🌾",
    category: "Inverno",
    cycle: "Outono/inverno",
    idealPH: "5,0-6,0",
    cultivars: [
      { name: "IPR 126", cycle: "Médio", notes: "IDR-Paraná. Grão branco, aptidão moagem." },
      { name: "URS Taura", cycle: "Precoce", notes: "UFRGS. Dupla aptidão grão/forragem." },
      { name: "URS Altiva", cycle: "Médio", notes: "UFRGS. Alta produtividade de grão." },
      { name: "URS Guará", cycle: "Médio", notes: "UFRGS. Resistente a ferrugem." },
      { name: "Brisasul", cycle: "Precoce", notes: "Boa pra cobertura de solo." },
    ],
    pests: ["Pulgão-da-aveia"],
    diseases: ["Ferrugem da folha", "Ferrugem da coroa", "Mancha das folhas"],
    defensives: [
      "Fungicidas: tebuconazol, azoxistrobina (ferrugem)",
      "Inseticidas: imidacloprido, tiametoxam",
      "⚠️ Pastagens exigem carência maior — consultar bula."
    ],
    notes: "Excelente pra cobertura de solo no SPD e palha de qualidade. Em dupla aptidão: plantar até abril pra pastejo + grão. Só grão: plantio em junho.",
  },
  {
    id: "aveia-pastagem",
    name: "Aveia (pastagem)",
    emoji: "🌾",
    category: "Pastagem",
    cycle: "Outono/inverno",
    idealPH: "5,0-6,0",
    cultivars: [
      { name: "URS Estampa", cycle: "Precoce", notes: "UFRGS. Forrageira de ciclo curto, alto perfilhamento." },
      { name: "URS Guapa", cycle: "Médio", notes: "UFRGS. Pastagem + cobertura." },
      { name: "IPR 126", cycle: "Médio", notes: "Dupla aptidão." },
      { name: "IAPAR 61 Ibiporã", cycle: "Médio", notes: "Tradicional pra pastagem." },
      { name: "Aveia-preta comum", cycle: "Rústica", notes: "Custo baixo, cobertura e pastejo." },
    ],
    pests: ["Pulgão"],
    diseases: ["Ferrugem da coroa"],
    defensives: [
      "Pastagens: preferir controle cultural/biológico",
      "Se necessário: consultar AGROFIT para carência adequada pra animais."
    ],
    notes: "Semear em março-abril pra pastejo a partir de 45-60 dias. Altura de entrada: 20-25 cm. Saída: 7-10 cm. Permite 3-5 pastejos. Aveia-preta + azevém é mistura clássica.",
  },
  {
    id: "feijao",
    name: "Feijão",
    emoji: "🫘",
    category: "Grão",
    cycle: "3 safras: águas, seca, inverno",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "IPR Sabiá (carioca)", cycle: "Normal", notes: "IDR-PR. Líder nacional em área de sementes carioca." },
      { name: "IPR Tuiuiú (preto)", cycle: "Normal", notes: "IDR-PR. Muito plantada no Sul." },
      { name: "IPR Urutau (preto)", cycle: "Normal", notes: "IDR-PR. Líder nacional em sementes de preto." },
      { name: "IPR Uirapuru (preto)", cycle: "Normal", notes: "IDR-PR. Rústica, bom desempenho em diferentes ambientes." },
      { name: "IPR Águia (carioca)", cycle: "88 dias", notes: "IDR-PR. Escurecimento lento (9 meses), potencial 4,8 t/ha." },
      { name: "IPR Cardeal (vermelho)", cycle: "78 dias", notes: "IDR-PR. Tipo Dark Red Kidney, exportação." },
      { name: "BRS FC402 Notável (carioca)", cycle: "Normal", notes: "Embrapa. Resistência a antracnose e murcha-de-Fusarium." },
      { name: "BRS ELO FC424 (carioca)", cycle: "Normal", notes: "Embrapa (lançamento 2026). Alto potencial produtivo." },
      { name: "BRS ELO FC429 (carioca)", cycle: "Normal", notes: "Embrapa (2026). Escurecimento lento dos grãos." },
      { name: "BRS FP426 (preto)", cycle: "Normal", notes: "Embrapa (2026). Estabilidade em áreas de risco sanitário." },
      { name: "BRS FP327 (preto)", cycle: "75-84 dias", notes: "Embrapa. Semiprecoce, alto rendimento." },
      { name: "SCS207 Querência (carioca)", cycle: "Normal", notes: "Epagri. Resistência moderada a antracnose." },
      { name: "SCS206 Potência (preto)", cycle: "Normal", notes: "Epagri. Alta resistência a antracnose." },
    ],
    pests: ["Mosca-branca", "Cigarrinha-verde", "Vaquinha", "Lagarta-das-vagens", "Tripes"],
    diseases: ["Antracnose", "Mancha-angular", "Ferrugem", "Mosaico-dourado", "Crestamento bacteriano", "Murcha de Fusarium", "Mofo-branco"],
    defensives: [
      "Fungicidas: azoxistrobina + ciproconazol, carbendazim, tiofanato-metílico",
      "Inseticidas: imidacloprido, tiametoxam, flupiradifurona (mosca-branca)",
      "Herbicidas: fomesafen, fluazifop, bentazona",
      "⚠️ Feijão tem carência curta — respeitar bula rigorosamente."
    ],
    notes: "3 épocas de plantio. 'Águas' (ago-out), 'seca' (jan-mar), 'inverno' (abr-jun, irrigado). Mosaico-dourado é crítico — transmitido por mosca-branca. Rotação com milho/soja ajuda no controle de doenças.",
  },

  // ===== FRUTAS PERENES =====
  {
    id: "maca",
    name: "Maçã",
    emoji: "🍎",
    category: "Fruta",
    cycle: "Perene (20+ anos)",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Gala (e clones: Royal, Baigent, Brookfield)", cycle: "Precoce (fev)", notes: "Exige 600-800h de frio. Colheita em fevereiro. Polinizada por Fuji." },
      { name: "Fuji (e clones: Suprema, Mishima)", cycle: "Tardia (abr-mai)", notes: "Exige 1000-1200h de frio. Colheita abril-maio. Polinizada por Gala." },
      { name: "Eva", cycle: "Precoce (dez-jan)", notes: "Baixa exigência em frio (350-450h). Adaptada a regiões com menos frio." },
      { name: "Condessa", cycle: "Precoce", notes: "Média exigência frio. Polinizadora de Eva." },
      { name: "Pink Lady (Cripps Pink)", cycle: "Muito tardia", notes: "Alto valor comercial. Exige 400-600h." },
      { name: "Castel Gala", cycle: "Precoce", notes: "Menor exigência de frio (400-500h). Alternativa em anos quentes." },
    ],
    pests: ["Mosca-das-frutas", "Grafolita (Grapholita molesta)", "Ácaros", "Cochonilha-de-são-josé"],
    diseases: ["Sarna (Venturia inaequalis)", "Podridão-branca (Botryosphaeria)", "Podridão-amarga", "Oídio", "Cancro europeu"],
    defensives: [
      "Fungicidas pós-brotação: captana, mancozebe, difenoconazol, trifloxistrobina",
      "Fungicidas dormência: calda sulfocálcica (orgânico), óleo mineral",
      "Inseticidas: tiametoxam, clorantraniliprole, espinosade (grafolita)",
      "Acaricidas: abamectina, fenpiroximato",
      "⚠️ Maçã tem carência alta e grade de defensivos muito específica — Manual Fruticultura EMBRAPA é referência."
    ],
    notes: "Principais regiões: Vacaria (RS), São Joaquim (SC), Fraiburgo (SC). Gala exige ~600-800h de frio, Fuji 1000-1200h. Raleio define qualidade — manual ou químico (ANA). Sistemas modernos em alta densidade com 3.000-5.000 plantas/ha.",
    training: [
      { name: "Líder Central", spacing: "5,0 x 3,0 m", plantsPerHa: "666", notes: "Sistema tradicional. Mais rústico, menor produtividade." },
      { name: "Fuso Esbelto", spacing: "4,0 x 1,5 m", plantsPerHa: "1.666", notes: "Média densidade, boa entrada em produção." },
      { name: "Alta Densidade (Solaxe)", spacing: "3,5 x 0,8-1,0 m", plantsPerHa: "2.857-3.571", notes: "Moderno. Alta produtividade precoce (3º ano). Exige porta-enxerto anão (M9)." },
      { name: "Bibaum (eixo duplo)", spacing: "4,0 x 1,2 m", plantsPerHa: "2.083", notes: "Duas líderes por planta. Equilíbrio vigor/produção." },
      { name: "V-invertido (Super Spindle)", spacing: "3,5 x 0,6 m", plantsPerHa: "4.761", notes: "Máxima densidade, exige M9 e muita mão de obra." },
    ],
    phenology: [
      { month: "Junho-Julho", stage: "Dormência", activities: ["Poda de inverno", "Aplicação de calda sulfocálcica/óleo", "Coleta de horas de frio (HF)", "Adubação de base"] },
      { month: "Agosto-Setembro", stage: "Brotação", activities: ["Quebra de dormência (cianamida hidrogenada + óleo)", "Monitorar saída uniforme", "Controle de pulgão e ácaro"] },
      { month: "Setembro-Outubro", stage: "Floração e polinização", activities: ["Colocar colmeias (1-2/ha)", "Controle de sarna (proteção contínua)", "Evitar pulverizações tóxicas durante florada"] },
      { month: "Novembro", stage: "Frutificação inicial", activities: ["Raleio químico (ANA) ou manual", "Adubação nitrogenada", "Início monitoramento grafolita"] },
      { month: "Dezembro-Janeiro", stage: "Crescimento do fruto", activities: ["Raleio complementar", "Irrigação (se disponível)", "Controle de sarna, oídio e grafolita", "Monitorar ácaros"] },
      { month: "Fevereiro-Março", stage: "Maturação (Gala/Eva)", activities: ["Colheita de Gala (fev) e Eva (jan)", "Teste de amido, Brix, firmeza", "Logística de embalagem e frigorificação"] },
      { month: "Abril-Maio", stage: "Maturação (Fuji/Pink Lady)", activities: ["Colheita de Fuji (abr-mai)", "Pink Lady em maio", "Pós-colheita: frigorificação ULO/CA"] },
      { month: "Maio-Junho", stage: "Queda de folhas", activities: ["Análise de solo pós-colheita", "Adubação de manutenção", "Preparo pra poda de inverno"] },
    ],
    pollination: "Maçã é autoincompatível. Exige polinizador compatível (Gala × Fuji é clássico). 1 polinizador pra cada 3-5 plantas principais. Uso de colmeias durante florada é obrigatório.",
    rootstocks: ["M9 (anão, alta densidade)", "M26 (semi-anão)", "Marubakaido (vigoroso, tradicional no Sul)", "M7 (semi-vigoroso)", "G202, G935 (Geneva, novos, resistentes)"],
  },
  {
    id: "uva-viniferas",
    name: "Uva Viníferas",
    emoji: "🍇",
    category: "Fruta",
    cycle: "Perene (25+ anos)",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Cabernet Sauvignon", cycle: "Tardia", notes: "Tinta. Vinho tinto fino. Vale dos Vinhedos." },
      { name: "Merlot", cycle: "Média", notes: "Tinta. Maturação mais cedo que Cabernet. Vinho tinto fino." },
      { name: "Chardonnay", cycle: "Precoce-média", notes: "Branca. Vinho branco fino e espumante." },
      { name: "Sauvignon Blanc", cycle: "Precoce", notes: "Branca. Vinhos frescos e aromáticos." },
      { name: "Tannat", cycle: "Tardia", notes: "Tinta. Destaque nos vinhos Campanha Gaúcha." },
      { name: "Pinot Noir", cycle: "Precoce", notes: "Tinta. Base de espumantes finos." },
      { name: "Moscato Giallo", cycle: "Média", notes: "Branca. Espumante Moscatel." },
      { name: "Syrah (Shiraz)", cycle: "Média-tardia", notes: "Tinta. Adaptação crescente no Sul." },
    ],
    pests: ["Mosca-das-frutas", "Pérola-da-terra (Eurhizococcus)", "Traça-dos-cachos", "Ácaro-da-enfezação"],
    diseases: ["Míldio (Plasmopara)", "Oídio (Uncinula)", "Podridão-cinzenta (Botrytis)", "Antracnose", "Fusariose"],
    defensives: [
      "Fungicidas: metalaxil (míldio), azoxistrobina, trifloxistrobina, enxofre (oídio)",
      "Inseticidas: tiametoxam, imidacloprido, acetamiprido",
      "Orgânico: calda bordalesa (míldio), enxofre (oídio)",
      "⚠️ Uva pra vinho tem protocolos específicos por vinícola — consultar enólogo."
    ],
    notes: "Regiões: Vale dos Vinhedos, Serra Gaúcha (RS), São Joaquim (SC), Campanha Gaúcha. Tannat é marca registrada do RS. Sistema de condução impacta qualidade e custo de produção. Pérola-da-terra é praga regional crítica.",
    training: [
      { name: "Espaldeira (VSP)", spacing: "3,0 x 1,0-1,5 m", plantsPerHa: "2.222-3.333", notes: "Padrão pra vinhos finos. Exposição ao sol, mecanização. Produtividade 8-15 t/ha." },
      { name: "Lira", spacing: "3,5 x 1,5 m", plantsPerHa: "1.904", notes: "Variação da espaldeira em V. Melhor microclima do dossel." },
      { name: "Latada (Pérgola)", spacing: "3,0 x 2,0 m", plantsPerHa: "1.666", notes: "Tradicional no Sul. Alta produção (20-30 t/ha). Menor qualidade pra vinho fino. Ideal pra uvas de mesa." },
      { name: "Cordão Horizontal", spacing: "2,5 x 1,0 m", plantsPerHa: "4.000", notes: "Alta densidade, mecanização total. Vinhos premium." },
    ],
    phenology: [
      { month: "Maio-Agosto", stage: "Dormência", activities: ["Poda de inverno (mista ou curta)", "Aplicação calda sulfocálcica", "Adubação de base", "Manutenção de espaldeira"] },
      { month: "Setembro", stage: "Brotação", activities: ["Monitorar saída de brotos", "Controle preventivo míldio", "Desbrota inicial"] },
      { month: "Outubro", stage: "Desenvolvimento vegetativo", activities: ["Desbrota e desnetamento", "Controle míldio e oídio", "Amarração de ramos"] },
      { month: "Novembro", stage: "Floração", activities: ["Proteção intensa contra míldio", "Monitorar polinização", "Evitar estresse hídrico"] },
      { month: "Dezembro", stage: "Formação do cacho", activities: ["Raleio de cachos (se necessário)", "Controle contínuo míldio/oídio", "Manejo de folhas"] },
      { month: "Janeiro", stage: "Véraison (mudança de cor)", activities: ["Desfolha seletiva (sol nos cachos)", "Controle de Botrytis", "Monitorar Brix semanalmente"] },
      { month: "Fevereiro-Março", stage: "Maturação e colheita", activities: ["Análise de maturação (Brix, pH, acidez)", "Colheita manual fracionada", "Logística vinícola"] },
      { month: "Abril", stage: "Pós-colheita", activities: ["Adubação potássica", "Análise de solo", "Preparo pra poda"] },
    ],
    rootstocks: ["Paulsen 1103 (vigoroso, tolerante a seca e filoxera)", "SO4 (médio vigor, muito usado)", "Kober 5BB (vigoroso)", "101-14 (pouco vigor, solos férteis)", "R110 (resistente filoxera, tolerante seca)"],
  },
  {
    id: "uva-americanas",
    name: "Uva Americanas (suco/vinho de mesa)",
    emoji: "🍇",
    category: "Fruta",
    cycle: "Perene",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Isabel", cycle: "Tardia", notes: "Tinta. Principal pra suco no Sul. Rústica, pouca exigência." },
      { name: "Bordô (Ives)", cycle: "Média-tardia", notes: "Tinta. Alto teor de antocianinas, ótima pra suco." },
      { name: "Concord", cycle: "Média", notes: "Tinta. Padrão de suco americano." },
      { name: "Niágara Branca", cycle: "Precoce-média", notes: "Branca. Mesa e suco." },
      { name: "Niágara Rosada", cycle: "Precoce-média", notes: "Tinta. Popular pra consumo in natura." },
      { name: "BRS Violeta", cycle: "Precoce", notes: "Embrapa. Tinta sem semente, pra suco." },
      { name: "BRS Carmem", cycle: "Precoce", notes: "Embrapa. Alta cor e açúcar, pra suco." },
      { name: "BRS Magna", cycle: "Precoce", notes: "Embrapa. Suco de cor intensa." },
    ],
    pests: ["Pérola-da-terra", "Traça-dos-cachos", "Cochonilhas"],
    diseases: ["Míldio", "Antracnose", "Oídio (menos frequente)", "Podridão-cinzenta"],
    defensives: [
      "Fungicidas: calda bordalesa (orgânico/convencional), metalaxil, azoxistrobina",
      "Inseticidas: quando necessário, tiametoxam, imidacloprido",
      "⚠️ Uvas americanas são mais rústicas — muitas vezes produção agroecológica viável."
    ],
    notes: "Base da produção de suco de uva brasileiro. Principais regiões: Serra Gaúcha (Bento Gonçalves, Flores da Cunha), São Joaquim. Sistema predominante: latada. Produtividade alta (20-35 t/ha). Integração com agroindústria familiar.",
    training: [
      { name: "Latada (Pérgola)", spacing: "3,0 x 2,0 m", plantsPerHa: "1.666", notes: "Sistema dominante pra Isabel, Bordô. Alta produtividade." },
      { name: "Espaldeira", spacing: "3,0 x 1,5 m", plantsPerHa: "2.222", notes: "Alternativa mecanizável." },
      { name: "Manjedoura (Y)", spacing: "3,5 x 1,5 m", plantsPerHa: "1.904", notes: "Variação da latada em Y. Melhor aeração." },
    ],
    phenology: [
      { month: "Junho-Agosto", stage: "Dormência", activities: ["Poda longa/mista", "Calda sulfocálcica", "Adubação base"] },
      { month: "Setembro", stage: "Brotação", activities: ["Monitoramento", "Primeiras pulverizações preventivas"] },
      { month: "Outubro-Novembro", stage: "Floração", activities: ["Controle rigoroso de míldio", "Proteção antracnose"] },
      { month: "Dezembro-Janeiro", stage: "Maturação", activities: ["Desbaste de cachos (se necessário)", "Controle de podridões", "Monitorar Brix"] },
      { month: "Fevereiro-Março", stage: "Colheita", activities: ["Colheita manual", "Entrega a vinícola/cantina"] },
    ],
  },
  {
    id: "uva-mesa",
    name: "Uva de Mesa",
    emoji: "🍇",
    category: "Fruta",
    cycle: "Perene",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Itália", cycle: "Tardia", notes: "Branca, baga grande. Tradicional, alto valor." },
      { name: "Rubi (mutação de Itália)", cycle: "Tardia", notes: "Rosada. Boa comercialização." },
      { name: "Benitaka", cycle: "Tardia", notes: "Vermelha. Mutação de Rubi/Itália." },
      { name: "BRS Vitoria (sem semente)", cycle: "Precoce", notes: "Embrapa. Preta sem semente. Sabor aframboesado." },
      { name: "BRS Núbia", cycle: "Média", notes: "Embrapa. Preta com semente, ampla adaptação." },
      { name: "BRS Ísis (sem semente)", cycle: "Média", notes: "Embrapa. Rosada sem semente." },
      { name: "Niágara Rosada", cycle: "Precoce", notes: "Muito consumida in natura." },
    ],
    pests: ["Mosca-das-frutas", "Traça-dos-cachos", "Cochonilhas", "Tripes"],
    diseases: ["Míldio", "Oídio", "Podridão-cinzenta (Botrytis)", "Antracnose"],
    defensives: [
      "Uva de mesa exige cuidado redobrado com resíduos — carência longa",
      "Fungicidas: trifloxistrobina, metalaxil, enxofre",
      "Inseticidas: espinosade, acetamiprido",
      "⚠️ Programa fitossanitário rigoroso — consumidor final exige baixo LMR."
    ],
    notes: "Produção intensiva em alta tecnologia (cobertura plástica, fertirrigação). BRS sem semente em expansão. Uvas finas precisam de cobertura plástica pra evitar rachaduras e doenças de cachos.",
    training: [
      { name: "Latada Coberta", spacing: "3,0 x 2,5 m", plantsPerHa: "1.333", notes: "Padrão pra uvas finas. Cobertura plástica." },
      { name: "Y", spacing: "3,5 x 2,0 m", plantsPerHa: "1.428", notes: "Boa aeração, menos doenças." },
    ],
  },
  {
    id: "kiwi",
    name: "Kiwi",
    emoji: "🥝",
    category: "Fruta",
    cycle: "Perene (30+ anos)",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Hayward (feminina)", cycle: "Tardia (mai-jun)", notes: "Padrão mundial. Polpa verde. 700-800h de frio." },
      { name: "Bruno (feminina)", cycle: "Média", notes: "Frutos menores, casca mais peluda." },
      { name: "Monty (feminina)", cycle: "Precoce", notes: "Alternativa pra Hayward." },
      { name: "Elmwood (feminina)", cycle: "Média", notes: "Boa produtividade." },
      { name: "Soreli (feminina, polpa amarela)", cycle: "Média", notes: "Italiana. Alto valor agregado. Polpa amarela intensa." },
      { name: "Matua (masculina)", cycle: "Polinizador", notes: "Polinizador universal pra cultivares verdes." },
      { name: "Tomuri (masculina)", cycle: "Polinizador", notes: "Polinizador, florescimento tardio." },
    ],
    pests: ["Cochonilhas", "Percevejos", "Ácaros"],
    diseases: ["PSA (Pseudomonas syringae pv. actinidiae)", "Podridão-de-raiz (Phytophthora)", "Botrytis em pós-colheita"],
    defensives: [
      "Fungicidas/Bactericidas: oxicloreto de cobre (PSA), calda bordalesa",
      "Inseticidas: óleo mineral (cochonilhas), acetamiprido",
      "⚠️ PSA é doença devastadora — exclusão e manejo sanitário são críticos. Verificar mudas certificadas."
    ],
    notes: "Regiões: Farroupilha, Antônio Prado, Flores da Cunha (RS), São Joaquim (SC). Exige 600-800h de frio. PRECISA DE MACHO POLINIZADOR — 1 macho pra cada 6-8 fêmeas. Manejo de copa intensivo. Colheita em maio-junho, maturação em câmara.",
    training: [
      { name: "T-bar (T)", spacing: "5,0 x 3,0 m", plantsPerHa: "666", notes: "Sistema mais comum no Sul. Estrutura em T, condução em cordão." },
      { name: "Pérgola", spacing: "5,0 x 3,0 m", plantsPerHa: "666", notes: "Cobertura total. Mais proteção, mais custo." },
      { name: "Y (GDC - Geneva Double Curtain)", spacing: "4,0 x 2,5 m", plantsPerHa: "1.000", notes: "Moderno, mais luz, boa produção." },
    ],
    phenology: [
      { month: "Junho-Agosto", stage: "Dormência", activities: ["Poda de inverno (crítica - 70% do ciclo)", "Amarração", "Adubação base", "Calda sulfocálcica"] },
      { month: "Setembro", stage: "Brotação", activities: ["Quebra de dormência se necessário", "Monitorar brotação uniforme", "Controle PSA"] },
      { month: "Outubro-Novembro", stage: "Floração", activities: ["Colmeias (8-10/ha)", "Polinização complementar (se necessário)", "Evitar pulverizações tóxicas"] },
      { month: "Dezembro-Fevereiro", stage: "Crescimento do fruto", activities: ["Raleio de frutos (padrão 5-7 frutos/ramo)", "Irrigação", "Controle fitossanitário"] },
      { month: "Março-Abril", stage: "Pré-maturação", activities: ["Monitorar Brix (meta 6,2% mínimo)", "Aplicações finais", "Preparo colheita"] },
      { month: "Maio-Junho", stage: "Colheita", activities: ["Colheita manual", "Resfriamento imediato", "Maturação em câmara com etileno"] },
    ],
    pollination: "OBRIGATÓRIA. Kiwi é dioico (plantas masculinas e femininas separadas). 1 macho pra cada 6-8 fêmeas. Matua poliniza maioria das fêmeas. Uso de colmeias (Apis mellifera + abelhas solitárias) é essencial — 8-10 colmeias/ha.",
    rootstocks: ["Bounty 71", "Hayward-seedling", "Geralmente auto-enraizado por estaquia"],
  },

  // ===== HORTALIÇAS =====
  {
    id: "batata",
    name: "Batata Inglesa",
    emoji: "🥔",
    category: "Hortaliça",
    cycle: "Anual (100-120 dias)",
    idealPH: "5,5-6,0",
    cultivars: [
      { name: "Ágata", cycle: "Precoce (90-100 d)", notes: "Holandesa. Mais plantada no Brasil. Polpa amarela, ideal pra cozinhar." },
      { name: "Asterix", cycle: "Tardia (110-120 d)", notes: "Holandesa. Pele vermelha, alto teor de matéria seca. Fritura e nhoque." },
      { name: "Atlantic", cycle: "Média (105 d)", notes: "Indústria de chips. Alto MS." },
      { name: "Monalisa", cycle: "Média", notes: "Holandesa. Mesa, polpa amarela." },
      { name: "Cupido", cycle: "Precoce", notes: "Parecida com Ágata, polpa úmida." },
      { name: "Orchestra", cycle: "Precoce", notes: "Holandesa. Similar à Ágata." },
      { name: "Markies", cycle: "Média", notes: "Alta MS, fritura palito." },
      { name: "BRS Ana", cycle: "Tardia (110-120 d)", notes: "Embrapa. Pele vermelha, duplo propósito mesa/fritura. Nacional." },
      { name: "BRS Clara", cycle: "Tardia", notes: "Embrapa. Nacional, alta produtividade." },
      { name: "BRS Eliza", cycle: "Média (100 d)", notes: "Embrapa. Média resistência à requeima." },
      { name: "Catucha (EPAGRI 361)", cycle: "Média (100 d)", notes: "Epagri. Resistente à requeima. Apta cultivo orgânico." },
      { name: "SCS365 Cota", cycle: "Média", notes: "Epagri. Primeira cultivar SC pra cultivo orgânico." },
      { name: "Baronesa", cycle: "Média (100-110 d)", notes: "Tradicional RS. Pele rosa. Em nichos." },
    ],
    pests: ["Vaquinha (Diabrotica)", "Larva-alfinete", "Pulgão", "Traça-da-batata", "Mosca-minadora"],
    diseases: ["Requeima (Phytophthora infestans)", "Pinta-preta (Alternaria)", "Murcha-bacteriana (Ralstonia)", "Sarna-comum", "Vírus Y (PVY)", "Vírus do enrolamento (PLRV)"],
    defensives: [
      "Fungicidas: mancozebe, metalaxil + mancozebe (requeima), difenoconazol",
      "Inseticidas: imidacloprido (pulverização/solo), tiametoxam (tratamento semente)",
      "Herbicidas: metribuzim (pré-emergência), clomazona",
      "⚠️ Batata é MUITO sensível à requeima — programa preventivo rigoroso."
    ],
    notes: "3 safras: águas (ago-out plantio), secas (dez plantio), inverno (abr-jun, só com irrigação). Preferir solos bem drenados, evitar rotação com solanáceas (fumo, tomate). Rotação de 2 anos ideal. Amontoa 30-40 DAP. Regiões: Canoinhas (SC), Guarapuava/Ponta Grossa (PR), Sul de MG.",
  },
  {
    id: "morango",
    name: "Morango",
    emoji: "🍓",
    category: "Hortaliça",
    cycle: "Anual/bianual",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "Camarosa", cycle: "Dia curto", notes: "Californiana. Tradicional, frutos grandes e firmes. Bom pra in natura." },
      { name: "Camino Real", cycle: "Dia curto", notes: "Californiana. Alta produtividade, polpa firme." },
      { name: "San Andreas", cycle: "Dia neutro", notes: "Californiana. Produção estendida, alta qualidade." },
      { name: "Albion", cycle: "Dia neutro", notes: "Californiana. Bons atributos de sabor (°Brix alto)." },
      { name: "Monterey", cycle: "Dia neutro", notes: "Californiana. Alta produtividade, ampla adaptação." },
      { name: "Aromas", cycle: "Dia neutro", notes: "Californiana. Tradicional, frutos saborosos." },
      { name: "Festival", cycle: "Dia curto", notes: "Flórida. Sabor marcante, firmeza média." },
      { name: "Oso Grande", cycle: "Dia curto", notes: "Californiana. Produtividade alta em safra." },
      { name: "Dover", cycle: "Dia curto", notes: "Adaptada ao RS. Boa pra processamento." },
    ],
    pests: ["Ácaro-rajado (Tetranychus)", "Ácaro-branco (Polyphagotarsonemus)", "Tripes", "Pulgão", "Mosca-das-frutas (pontos de maturação)"],
    diseases: ["Antracnose", "Oídio", "Mancha-de-micosferela", "Podridão-cinzenta (Botrytis)", "Fusarium (solo)", "Verticilose"],
    defensives: [
      "Fungicidas: azoxistrobina, tebuconazol, ciprodinil + fludioxonil",
      "Inseticidas/Acaricidas: abamectina, fenpiroximato, acetamiprido, espinosade",
      "⚠️ Morango é consumido in natura — carência rigorosa, MRL baixíssimo. Usar só defensivos registrados e preferir biológicos (Bacillus, Trichoderma)."
    ],
    notes: "Cultivares de 'dia curto' produzem no inverno (plantio em abr-mai). 'Dia neutro' produz o ano todo. Sistema semi-hidropônico em slabs ou substrato crescente. Regiões: Pelotas/Caxias do Sul (RS), Rancho Queimado/Bom Retiro (SC), São Bento do Sul (SC).",
    training: [
      { name: "Campo aberto convencional (canteiro)", spacing: "0,30 x 0,30 m", plantsPerHa: "60.000", notes: "Tradicional. Risco alto de doenças. Mulching plástico obrigatório." },
      { name: "Túnel baixo", spacing: "0,30 x 0,30 m", plantsPerHa: "60.000", notes: "Proteção contra chuva e doenças. Adoção crescente." },
      { name: "Semi-hidropônico (slab suspenso)", spacing: "0,25 x 0,15 m na bancada", plantsPerHa: "70.000-80.000 equivalentes", notes: "Sistema moderno em estufa. Alta produtividade, menos doenças. Colheita em pé." },
    ],
  },

  // ===== OUTRAS =====
  {
    id: "azevem",
    name: "Azevém",
    emoji: "🌿",
    category: "Pastagem",
    cycle: "Anual hibernal",
    idealPH: "5,5-6,5",
    cultivars: [
      { name: "INIA Titan", cycle: "Diploide", notes: "Tradicional, alto perfilhamento." },
      { name: "BRS Ponteio", cycle: "Tetraploide", notes: "Embrapa. Maior produção de matéria verde." },
      { name: "Barjumbo", cycle: "Tetraploide", notes: "Importado. Alta qualidade." },
      { name: "Azevém comum RS", cycle: "Diploide", notes: "Ressemeadura natural, baixo custo." },
    ],
    pests: [],
    diseases: ["Ferrugem da coroa"],
    defensives: [
      "Pastagens: preferir manejo cultural. Consultar AGROFIT quando necessário."
    ],
    notes: "Principal forrageira hibernal do Sul. Permite 4-6 pastejos. Ideal pra integração lavoura-pecuária (ILP). Consorciado com trevo branco, cornichão, aveia preta.",
  },
  {
    id: "cebola",
    name: "Cebola",
    emoji: "🧅",
    category: "Hortaliça",
    cycle: "Outono-primavera",
    idealPH: "5,8-6,5",
    cultivars: [
      { name: "Crioula Alto Vale", cycle: "Média", notes: "Epagri. Tradicional em SC." },
      { name: "Bola Precoce", cycle: "Precoce", notes: "Rápida, mas menor conservação." },
      { name: "Perfecta", cycle: "Média", notes: "Bulbo globular uniforme." },
      { name: "Empasc 352 Bola Precoce", cycle: "Precoce", notes: "Epagri." },
      { name: "Epagri 362 Crioula Alto Vale", cycle: "Média", notes: "Boa conservação pós-colheita." },
    ],
    pests: ["Tripes", "Mosca-da-cebola"],
    diseases: ["Míldio", "Raiz-rosada", "Mancha-púrpura"],
    defensives: [
      "Fungicidas: mancozebe, metalaxil, tebuconazol",
      "Inseticidas: espinosade, lambda-cialotrina (tripes)"
    ],
    notes: "SC é o maior produtor. Região Ituporanga e Alfredo Wagner. Bulbificação depende de fotoperíodo e cultivar.",
  },
  {
    id: "alho",
    name: "Alho",
    emoji: "🧄",
    category: "Hortaliça",
    cycle: "Inverno",
    idealPH: "6,0-6,5",
    cultivars: [
      { name: "Chonan", cycle: "Roxo", notes: "Alto valor comercial, exige frio." },
      { name: "Ito", cycle: "Roxo", notes: "Popular no Sul." },
      { name: "Jonas", cycle: "Roxo", notes: "Boa produtividade." },
      { name: "Quitéria", cycle: "Branco", notes: "Ciclo mais curto." },
    ],
    pests: ["Ácaro-do-alho", "Tripes"],
    diseases: ["Ferrugem", "Mancha-púrpura"],
    defensives: ["Fungicidas: mancozebe, tebuconazol", "Acaricidas: abamectina"],
    notes: "Vernalização é essencial antes do plantio. Curitibanos (SC) é referência.",
  },
  {
    id: "brocolis",
    name: "Brócolis",
    emoji: "🥦",
    category: "Hortaliça",
    cycle: "Outono-inverno",
    idealPH: "6,0-6,8",
    cultivars: [
      { name: "Avenger", cycle: "Tipo único", notes: "Híbrido. Cabeça compacta." },
      { name: "Legacy", cycle: "Tipo único", notes: "Uniforme, boa pra mercado." },
      { name: "Ramoso Santana", cycle: "Ramoso", notes: "Tradicional, colheita escalonada." },
    ],
    pests: ["Pulgão", "Lagarta-da-couve", "Traça-das-crucíferas"],
    diseases: ["Hérnia (Plasmodiophora)", "Míldio", "Podridão-mole"],
    defensives: ["Fungicidas: mancozebe, azoxistrobina", "Inseticidas: Bacillus thuringiensis (biológico), espinosade"],
    notes: "Cinturão verde Caxias do Sul e região metropolitana de PoA. Plantio escalonado garante oferta contínua.",
  },
];

// ============ UI ============

export default function CulturasPage() {
  const [filter, setFilter] = useState<string>("Todas");
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("info");

  const categories = ["Todas", "Grão", "Fruta", "Hortaliça", "Pastagem", "Inverno"];
  const filtered = filter === "Todas" ? crops : crops.filter(c => c.category === filter);
  const selectedCrop = selected ? crops.find(c => c.id === selected) : null;

  if (selectedCrop) {
    const tabs = [
      { id: "info", label: "Info" },
      { id: "cultivares", label: "Cultivares" },
      ...(selectedCrop.training ? [{ id: "conducao", label: "Condução" }] : []),
      ...(selectedCrop.phenology ? [{ id: "calendario", label: "Calendário" }] : []),
      { id: "pragas", label: "Pragas/Doenças" },
      { id: "defensivos", label: "Defensivos" },
    ];

    return (
      <div>
        <Header title={`${selectedCrop.emoji} ${selectedCrop.name}`} subtitle={selectedCrop.category} />
        <div className="px-4 -mt-4 space-y-3">
          <button onClick={() => { setSelected(null); setTab("info"); }} className="text-bazo-green text-sm">
            ← Voltar
          </button>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  tab === t.id ? "bg-bazo-green text-white" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "info" && (
            <>
              <Card>
                <h3 className="font-bold mb-2">Informações gerais</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-500">Ciclo:</span> {selectedCrop.cycle}</div>
                  <div><span className="text-gray-500">pH ideal:</span> {selectedCrop.idealPH}</div>
                  {selectedCrop.pollination && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                      <strong>🐝 Polinização:</strong> {selectedCrop.pollination}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-green-50 border-bazo-green">
                <h3 className="font-bold mb-2">💡 Notas regionais</h3>
                <p className="text-sm">{selectedCrop.notes}</p>
              </Card>

              {selectedCrop.rootstocks && (
                <Card>
                  <h3 className="font-bold mb-2">🌳 Porta-enxertos</h3>
                  <ul className="text-sm space-y-1">
                    {selectedCrop.rootstocks.map(r => <li key={r}>• {r}</li>)}
                  </ul>
                </Card>
              )}
            </>
          )}

          {tab === "cultivares" && (
            <Card>
              <h3 className="font-bold mb-3">Cultivares ({selectedCrop.cultivars.length})</h3>
              <div className="space-y-3">
                {selectedCrop.cultivars.map(cv => (
                  <div key={cv.name} className="border-l-2 border-bazo-green pl-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{cv.name}</span>
                      {cv.cycle && <Badge text={cv.cycle} color="green" />}
                    </div>
                    {cv.notes && <div className="text-xs text-gray-600 mt-1">{cv.notes}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "conducao" && selectedCrop.training && (
            <Card>
              <h3 className="font-bold mb-3">🏗️ Sistemas de condução</h3>
              <div className="space-y-3">
                {selectedCrop.training.map(t => (
                  <div key={t.name} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-sm text-bazo-darkgreen">{t.name}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div><span className="text-gray-500">Espaçamento:</span><br/><strong>{t.spacing}</strong></div>
                      <div><span className="text-gray-500">Plantas/ha:</span><br/><strong>{t.plantsPerHa}</strong></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{t.notes}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "calendario" && selectedCrop.phenology && (
            <Card>
              <h3 className="font-bold mb-3">📅 Calendário fenológico e tratos</h3>
              <div className="space-y-3">
                {selectedCrop.phenology.map((p, i) => (
                  <div key={i} className="border-l-4 border-bazo-green pl-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge text={p.month} color="green" />
                      <span className="font-semibold text-sm">{p.stage}</span>
                    </div>
                    <ul className="text-xs space-y-1 mt-2 text-gray-700">
                      {p.activities.map((a, j) => <li key={j}>• {a}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "pragas" && (
            <>
              {selectedCrop.pests.length > 0 && (
                <Card>
                  <h3 className="font-bold mb-2">🐛 Principais pragas</h3>
                  <ul className="text-sm space-y-1">
                    {selectedCrop.pests.map(p => <li key={p}>• {p}</li>)}
                  </ul>
                </Card>
              )}
              {selectedCrop.diseases.length > 0 && (
                <Card>
                  <h3 className="font-bold mb-2">🦠 Principais doenças</h3>
                  <ul className="text-sm space-y-1">
                    {selectedCrop.diseases.map(d => <li key={d}>• {d}</li>)}
                  </ul>
                </Card>
              )}
            </>
          )}

          {tab === "defensivos" && (
            <>
              <Card className="bg-yellow-50 border-yellow-400">
                <h3 className="font-bold mb-1">⚠️ AVISO IMPORTANTE</h3>
                <p className="text-xs text-yellow-900">
                  Esta lista é apenas referencial. Sempre consulte o <strong>AGROFIT (MAPA)</strong> para
                  verificar registro atualizado, dose, carência e culturas autorizadas. Siga sempre a
                  bula do produto e consulte um agrônomo.
                </p>
              </Card>
              <Card>
                <h3 className="font-bold mb-2">💊 Defensivos sugeridos</h3>
                <ul className="text-xs space-y-2">
                  {selectedCrop.defensives.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Culturas" subtitle={`${crops.length} culturas do Sul`} />

      <div className="px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === cat ? "bg-bazo-green text-white" : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(crop => (
            <button key={crop.id} onClick={() => setSelected(crop.id)} className="w-full">
              <Card className="flex items-center gap-3 hover:border-bazo-green">
                <div className="text-3xl">{crop.emoji}</div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-bazo-darkgreen">{crop.name}</div>
                  <div className="text-xs text-gray-500">{crop.cycle}</div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
