"use client";
import { useState } from "react";
import { Card, Header, Badge } from "@/components/UI";
import { Calculator, Sprout, Ruler, TreeDeciduous } from "lucide-react";

type CalcType = "menu" | "populacao" | "sementes-ha" | "sementes-m" | "mudas";

export default function CalculadorasPage() {
  const [active, setActive] = useState<CalcType>("menu");

  if (active === "menu") {
    return (
      <div>
        <Header title="Calculadoras" subtitle="Ferramentas pro campo" />
        <div className="px-4 -mt-4 space-y-2">
          <CalcCard
            icon={<Sprout className="text-bazo-green" size={28} />}
            title="População de plantas"
            description="A partir do espaçamento, calcula plantas por hectare"
            onClick={() => setActive("populacao")}
          />
          <CalcCard
            icon={<Calculator className="text-orange-600" size={28} />}
            title="Sementes por hectare"
            description="Calcula kg de sementes/ha (PMS, germinação, pureza)"
            onClick={() => setActive("sementes-ha")}
          />
          <CalcCard
            icon={<Ruler className="text-blue-600" size={28} />}
            title="Sementes por metro linear"
            description="Para regulagem da semeadora"
            onClick={() => setActive("sementes-m")}
          />
          <CalcCard
            icon={<TreeDeciduous className="text-green-700" size={28} />}
            title="Mudas para perenes"
            description="Frutas e fruteiras: calcula nº mudas pela área e sistema"
            onClick={() => setActive("mudas")}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Calculadoras" subtitle="Ferramentas pro campo" />
      <div className="px-4 -mt-4 space-y-3">
        <button onClick={() => setActive("menu")} className="text-bazo-green text-sm">
          ← Voltar
        </button>
        {active === "populacao" && <PopulacaoCalc />}
        {active === "sementes-ha" && <SementesHaCalc />}
        {active === "sementes-m" && <SementesMCalc />}
        {active === "mudas" && <MudasCalc />}
      </div>
    </div>
  );
}

function CalcCard({ icon, title, description, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full">
      <Card className="flex items-start gap-3 hover:border-bazo-green text-left">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="font-bold text-bazo-darkgreen">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
      </Card>
    </button>
  );
}

// ============= 1. POPULAÇÃO =============

function PopulacaoCalc() {
  const [linhas, setLinhas] = useState(50); // cm entre linhas
  const [plantas, setPlantas] = useState(20); // cm entre plantas
  const plantasPorHa = Math.round((10000 / (linhas / 100)) / (plantas / 100));

  const presets = [
    { label: "Soja", linhas: 45, plantas: 5 },
    { label: "Milho", linhas: 50, plantas: 18 },
    { label: "Trigo", linhas: 17, plantas: 1 },
    { label: "Feijão", linhas: 45, plantas: 7 },
  ];

  return (
    <>
      <Card>
        <h3 className="font-bold mb-3">População de plantas</h3>
        <p className="text-xs text-gray-600 mb-3">
          Informe os espaçamentos pra calcular quantas plantas/ha você terá.
        </p>

        <div className="flex gap-2 flex-wrap mb-4">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => { setLinhas(p.linhas); setPlantas(p.plantas); }}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        <SliderInput label="Espaçamento entre linhas (cm)" value={linhas} setValue={setLinhas} min={5} max={300} step={1} />
        <SliderInput label="Espaçamento entre plantas (cm)" value={plantas} setValue={setPlantas} min={1} max={200} step={1} />
      </Card>

      <Card className="bg-green-50 border-bazo-green">
        <div className="text-xs text-gray-600">População final</div>
        <div className="text-3xl font-bold text-bazo-darkgreen">
          {plantasPorHa.toLocaleString("pt-BR")} <span className="text-base">plantas/ha</span>
        </div>
        <div className="mt-2 text-xs text-gray-700">
          {(plantasPorHa / 1000).toFixed(0)} mil plantas por hectare
        </div>
      </Card>

      <Card>
        <h4 className="font-bold mb-2 text-sm">Fórmula</h4>
        <code className="text-xs bg-gray-100 p-2 block rounded">
          Plantas/ha = 10.000 m² ÷ (linhas em m × plantas em m)
        </code>
        <div className="text-xs text-gray-600 mt-2">
          {linhas} cm × {plantas} cm = {(linhas / 100).toFixed(2)} m × {(plantas / 100).toFixed(2)} m
        </div>
      </Card>
    </>
  );
}

// ============= 2. SEMENTES POR HECTARE =============

function SementesHaCalc() {
  const [populacao, setPopulacao] = useState(300000); // plantas/ha desejadas
  const [pms, setPms] = useState(180); // peso de mil sementes (g)
  const [germinacao, setGerminacao] = useState(85); // %
  const [pureza, setPureza] = useState(98); // %

  // Fórmula clássica: kg/ha = (pop desejada × PMS) / (germ% × pureza% × 1000)
  const fatorCorrecao = (germinacao / 100) * (pureza / 100);
  const sementesNecessarias = populacao / fatorCorrecao;
  const kgPorHa = (sementesNecessarias * pms) / 1_000_000;

  const presets = [
    { label: "Soja 300mil", pop: 300000, pms: 180, germ: 85, pur: 98 },
    { label: "Milho 70mil", pop: 70000, pms: 320, germ: 95, pur: 99 },
    { label: "Trigo 350pl/m²", pop: 3500000, pms: 38, germ: 90, pur: 98 },
    { label: "Feijão 250mil", pop: 250000, pms: 250, germ: 90, pur: 98 },
  ];

  return (
    <>
      <Card>
        <h3 className="font-bold mb-3">Sementes por hectare</h3>
        <p className="text-xs text-gray-600 mb-3">
          Calcula quantos kg de sementes você vai precisar comprar/usar por hectare.
        </p>

        <div className="flex gap-2 flex-wrap mb-4">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => { setPopulacao(p.pop); setPms(p.pms); setGerminacao(p.germ); setPureza(p.pur); }}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        <SliderInput label="População desejada (plantas/ha)" value={populacao} setValue={setPopulacao} min={50000} max={5000000} step={10000} />
        <SliderInput label="PMS — Peso de Mil Sementes (g)" value={pms} setValue={setPms} min={5} max={500} step={1} />
        <SliderInput label="Germinação (%)" value={germinacao} setValue={setGerminacao} min={50} max={100} step={1} />
        <SliderInput label="Pureza (%)" value={pureza} setValue={setPureza} min={80} max={100} step={1} />
      </Card>

      <Card className="bg-green-50 border-bazo-green">
        <div className="text-xs text-gray-600">Quantidade necessária</div>
        <div className="text-3xl font-bold text-bazo-darkgreen">
          {kgPorHa.toFixed(1)} <span className="text-base">kg/ha</span>
        </div>
        <div className="mt-2 text-xs text-gray-700">
          ≈ {Math.round(sementesNecessarias).toLocaleString("pt-BR")} sementes/ha
        </div>
        <div className="text-xs text-gray-700">
          (com correção de germinação e pureza)
        </div>
      </Card>

      <Card>
        <h4 className="font-bold mb-2 text-sm">Fórmula</h4>
        <code className="text-xs bg-gray-100 p-2 block rounded">
          kg/ha = (pop × PMS) ÷ (germ% × pureza% × 1.000.000)
        </code>
        <div className="text-xs text-gray-600 mt-2">
          Fator de correção: {(fatorCorrecao * 100).toFixed(1)}%
        </div>
      </Card>
    </>
  );
}

// ============= 3. SEMENTES POR METRO LINEAR =============

function SementesMCalc() {
  const [populacao, setPopulacao] = useState(300000);
  const [linhas, setLinhas] = useState(45); // cm

  // Sementes/m = pop/ha × espaçamento(m) ÷ 10.000
  const sementesPorMetro = (populacao * (linhas / 100)) / 10000;

  const presets = [
    { label: "Soja 45cm", pop: 300000, lin: 45 },
    { label: "Milho 50cm", pop: 70000, lin: 50 },
    { label: "Milho 70cm", pop: 70000, lin: 70 },
    { label: "Feijão 45cm", pop: 250000, lin: 45 },
  ];

  return (
    <>
      <Card>
        <h3 className="font-bold mb-3">Sementes por metro linear</h3>
        <p className="text-xs text-gray-600 mb-3">
          Para regular a semeadora — quantas sementes por metro vão cair em cada linha.
        </p>

        <div className="flex gap-2 flex-wrap mb-4">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => { setPopulacao(p.pop); setLinhas(p.lin); }}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        <SliderInput label="População desejada (plantas/ha)" value={populacao} setValue={setPopulacao} min={50000} max={500000} step={5000} />
        <SliderInput label="Espaçamento entre linhas (cm)" value={linhas} setValue={setLinhas} min={17} max={100} step={1} />
      </Card>

      <Card className="bg-green-50 border-bazo-green">
        <div className="text-xs text-gray-600">Sementes por metro linear</div>
        <div className="text-3xl font-bold text-bazo-darkgreen">
          {sementesPorMetro.toFixed(1)} <span className="text-base">sem/m</span>
        </div>
        <div className="mt-2 text-xs text-gray-700">
          Dica: ajuste a regulagem da semeadora pra dar essa densidade
        </div>
      </Card>

      <Card>
        <h4 className="font-bold mb-2 text-sm">Fórmula</h4>
        <code className="text-xs bg-gray-100 p-2 block rounded">
          Sem/m = pop/ha × espaçamento(m) ÷ 10.000
        </code>
      </Card>
    </>
  );
}

// ============= 4. MUDAS PARA PERENES =============

function MudasCalc() {
  const [area, setArea] = useState(1); // hectares
  const [linhas, setLinhas] = useState(4); // m entre linhas
  const [plantas, setPlantas] = useState(1.5); // m entre plantas

  const plantasPorHa = Math.round(10000 / (linhas * plantas));
  const totalMudas = Math.round(plantasPorHa * area);
  const totalComReposicao = Math.round(totalMudas * 1.05); // 5% reposição

  const presets = [
    { label: "Maçã líder central", lin: 5, plt: 3, info: "666 pl/ha — tradicional" },
    { label: "Maçã fuso esbelto", lin: 4, plt: 1.5, info: "1.666 pl/ha — média densidade" },
    { label: "Maçã alta densidade", lin: 3.5, plt: 1, info: "2.857 pl/ha — moderno (M9)" },
    { label: "Uva espaldeira", lin: 3, plt: 1.5, info: "2.222 pl/ha — vinhos finos" },
    { label: "Uva latada", lin: 3, plt: 2, info: "1.666 pl/ha — Isabel/Bordô/mesa" },
    { label: "Kiwi T-bar", lin: 5, plt: 3, info: "666 pl/ha — sistema clássico" },
    { label: "Pera fuso", lin: 4, plt: 1.5, info: "1.666 pl/ha" },
    { label: "Citros adensado", lin: 6, plt: 3, info: "555 pl/ha" },
  ];

  return (
    <>
      <Card>
        <h3 className="font-bold mb-3">Mudas para fruteiras perenes</h3>
        <p className="text-xs text-gray-600 mb-3">
          Calcula o número de mudas necessárias para implantação de pomar/vinhedo.
        </p>

        <div className="text-xs text-gray-500 mb-2">Sistemas pré-configurados:</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => { setLinhas(p.lin); setPlantas(p.plt); }}
              className="text-left p-2 bg-gray-50 rounded text-xs hover:bg-gray-100"
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-gray-500 text-[10px]">{p.info}</div>
            </button>
          ))}
        </div>

        <SliderInput label="Área de plantio (ha)" value={area} setValue={setArea} min={0.1} max={50} step={0.1} />
        <SliderInput label="Espaçamento entre linhas (m)" value={linhas} setValue={setLinhas} min={2} max={8} step={0.1} />
        <SliderInput label="Espaçamento entre plantas (m)" value={plantas} setValue={setPlantas} min={0.5} max={6} step={0.1} />
      </Card>

      <Card className="bg-green-50 border-bazo-green">
        <div className="text-xs text-gray-600">Mudas necessárias</div>
        <div className="text-3xl font-bold text-bazo-darkgreen">
          {totalMudas.toLocaleString("pt-BR")} <span className="text-base">mudas</span>
        </div>
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          <div>Densidade: <strong>{plantasPorHa.toLocaleString("pt-BR")} pl/ha</strong></div>
          <div>Com 5% reposição: <strong>{totalComReposicao.toLocaleString("pt-BR")} mudas</strong></div>
        </div>
      </Card>

      <Card className="bg-yellow-50 border-yellow-400">
        <div className="text-xs text-yellow-900">
          💡 <strong>Dica do agrônomo:</strong> sempre encomende 5-10% a mais de mudas para reposição
          de falhas. Verifique a procedência (mudas certificadas) e prefira porta-enxertos adaptados
          à sua região.
        </div>
      </Card>
    </>
  );
}

// ============= COMPONENTE COMPARTILHADO =============

function SliderInput({ label, value, setValue, min, max, step }: any) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <label className="font-medium">{label}</label>
        <input
          type="number"
          value={value}
          onChange={e => setValue(Number(e.target.value) || 0)}
          className="text-bazo-green font-bold w-20 text-right border border-gray-200 rounded px-1"
          step={step}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full accent-bazo-green"
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
