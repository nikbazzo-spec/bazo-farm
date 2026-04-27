"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Header, Badge, Button } from "@/components/UI";
import { FlaskConical, Plus, Trash2, ChevronRight } from "lucide-react";
import { analisesDb, talhoesDb, propriedadesDb, produtoresDb, type AnaliseSolo } from "@/lib/storage";

// ==================== DADOS AGRONÔMICOS ====================

type CropKey = "soja" | "milho-grao" | "milho-silagem" | "trigo" | "feijao" | "maca" | "uva" | "pastagem" | "batata" | "morango";

const CROPS: Record<CropKey, any> = {
  soja: { name: "Soja", unit: "sc/ha", unitWeightKg: 60, nPerTon: 80, p2o5PerTon: 16, k2oPerTon: 38, defaultYield: 60, fbn: true },
  "milho-grao": { name: "Milho (grão)", unit: "sc/ha", unitWeightKg: 60, nPerTon: 22, p2o5PerTon: 9, k2oPerTon: 6, defaultYield: 150 },
  "milho-silagem": { name: "Milho (silagem)", unit: "t MV/ha", unitWeightKg: 1000, nPerTon: 11, p2o5PerTon: 4, k2oPerTon: 12, defaultYield: 50 },
  trigo: { name: "Trigo", unit: "sc/ha", unitWeightKg: 60, nPerTon: 25, p2o5PerTon: 11, k2oPerTon: 6, defaultYield: 60 },
  feijao: { name: "Feijão", unit: "sc/ha", unitWeightKg: 60, nPerTon: 35, p2o5PerTon: 8, k2oPerTon: 25, defaultYield: 35, fbn: true },
  batata: { name: "Batata", unit: "t/ha", unitWeightKg: 1000, nPerTon: 4, p2o5PerTon: 1.5, k2oPerTon: 6, defaultYield: 30 },
  morango: { name: "Morango", unit: "t/ha", unitWeightKg: 1000, nPerTon: 3, p2o5PerTon: 1.0, k2oPerTon: 5, defaultYield: 40 },
  maca: { name: "Maçã", unit: "t/ha", unitWeightKg: 1000, nPerTon: 1.0, p2o5PerTon: 0.3, k2oPerTon: 1.5, defaultYield: 50 },
  uva: { name: "Uva", unit: "t/ha", unitWeightKg: 1000, nPerTon: 2.5, p2o5PerTon: 0.6, k2oPerTon: 4.5, defaultYield: 20 },
  pastagem: { name: "Pastagem", unit: "t MS/ha", unitWeightKg: 1000, nPerTon: 25, p2o5PerTon: 5, k2oPerTon: 20, defaultYield: 8 },
};

export default function SoloPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SoloPage />
    </Suspense>
  );
}

function SoloPage() {
  const searchParams = useSearchParams();
  const talhaoIdParam = searchParams.get("talhao");
  const [view, setView] = useState<"list" | "new" | "result">("list");
  const [analiseAtual, setAnaliseAtual] = useState<AnaliseSolo | null>(null);

  if (view === "new") {
    return (
      <NovaAnalise
        talhaoIdInicial={talhaoIdParam || undefined}
        onSave={(analise) => { setAnaliseAtual(analise); setView("result"); }}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "result" && analiseAtual) {
    return <ResultadoAnalise analise={analiseAtual} onBack={() => setView("list")} />;
  }

  return <ListaAnalises talhaoIdFiltro={talhaoIdParam || undefined} onNova={() => setView("new")} onVer={(a) => { setAnaliseAtual(a); setView("result"); }} />;
}

// ==================== LISTA DE ANÁLISES ====================

function ListaAnalises({ talhaoIdFiltro, onNova, onVer }: any) {
  const [analises, setAnalises] = useState<AnaliseSolo[]>([]);
  useEffect(() => {
    setAnalises(talhaoIdFiltro ? analisesDb.listByTalhao(talhaoIdFiltro) : analisesDb.list());
  }, [talhaoIdFiltro]);

  function handleDelete(id: string) {
    if (confirm("Remover esta análise?")) {
      analisesDb.remove(id);
      setAnalises(talhaoIdFiltro ? analisesDb.listByTalhao(talhaoIdFiltro) : analisesDb.list());
    }
  }

  const talhao = talhaoIdFiltro ? talhoesDb.get(talhaoIdFiltro) : null;
  const propriedade = talhao ? propriedadesDb.get(talhao.propriedadeId) : null;
  const produtor = propriedade ? produtoresDb.get(propriedade.produtorId) : null;

  return (
    <div>
      <Header
        title="Análises de Solo"
        subtitle={talhao ? `${talhao.nome} · ${propriedade?.nome}` : `${analises.length} análise(s)`}
      />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        {talhaoIdFiltro && (
          <Link href={`/talhoes?propriedade=${propriedade?.id || ""}`} className="text-bazo-green text-sm font-semibold inline-block">
            ← Voltar para talhões
          </Link>
        )}

        <Button onClick={onNova}>
          <span className="flex items-center justify-center gap-2"><Plus size={18} /> Nova análise</span>
        </Button>

        {analises.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <FlaskConical className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-sm text-gray-500">Nenhuma análise cadastrada.</p>
              <p className="text-xs text-gray-400 mt-1">Cadastre análises para gerar recomendações de calagem, gessagem e adubação.</p>
            </div>
          </Card>
        ) : (
          analises.map(a => {
            const t = talhoesDb.get(a.talhaoId);
            const p = t ? propriedadesDb.get(t.propriedadeId) : null;
            return (
              <Card key={a.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-bazo-darkgreen">
                      {new Date(a.data).toLocaleDateString("pt-BR")}
                    </div>
                    {t && <div className="text-xs text-gray-500">{t.nome}{p ? ` · ${p.nome}` : ""}</div>}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge text={`pH ${a.ph.toFixed(1)}`} color={a.ph < 5.5 ? "red" : a.ph > 6.5 ? "blue" : "green"} />
                      <Badge text={`V ${a.v.toFixed(0)}%`} color={a.v < 50 ? "red" : a.v < 65 ? "yellow" : "green"} />
                      <Badge text={a.cultura} color="gray" />
                    </div>
                  </div>
                  <button onClick={() => handleDelete(a.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <button onClick={() => onVer(a)} className="mt-2 w-full py-2 bg-bazo-green text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                  Ver recomendações <ChevronRight size={14} />
                </button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==================== NOVA ANÁLISE ====================

function NovaAnalise({ talhaoIdInicial, onSave, onCancel }: any) {
  const talhoes = talhoesDb.list();
  const [talhaoId, setTalhaoId] = useState(talhaoIdInicial || talhoes[0]?.id || "");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [laboratorio, setLaboratorio] = useState("");

  const [ph, setPh] = useState(5.5);
  const [ca, setCa] = useState(4.0);
  const [mg, setMg] = useState(1.5);
  const [k, setK] = useState(0.3);
  const [al, setAl] = useState(0.5);
  const [hal, setHal] = useState(5.0);
  const [p, setP] = useState(10);
  const [om, setOm] = useState(3.0);
  const [argila, setArgila] = useState(40);
  const [cultura, setCultura] = useState<CropKey>("soja");
  const [yieldExpected, setYieldExpected] = useState(60);
  const [observacoes, setObservacoes] = useState("");

  // Quando muda talhão, pré-preenche cultura e produtividade
  useEffect(() => {
    if (talhaoId) {
      const t = talhoesDb.get(talhaoId);
      if (t?.culturaAtual) {
        const map: Record<string, CropKey> = {
          "Soja": "soja", "Milho (grão)": "milho-grao", "Milho (silagem)": "milho-silagem",
          "Trigo": "trigo", "Feijão": "feijao", "Batata": "batata", "Morango": "morango",
          "Maçã": "maca", "Uva (vinífera)": "uva", "Uva (americana)": "uva", "Uva (mesa)": "uva",
          "Pastagem": "pastagem",
        };
        if (map[t.culturaAtual]) {
          setCultura(map[t.culturaAtual]);
          if (t.produtividadeEsperada) setYieldExpected(t.produtividadeEsperada);
        }
      }
    }
  }, [talhaoId]);

  function calcular() {
    if (!talhaoId) return alert("Selecione um talhão");

    const sb = ca + mg + k;
    const ctc = sb + hal;
    const v = ctc > 0 ? (sb / ctc) * 100 : 0;
    const m = sb + al > 0 ? (al / (sb + al)) * 100 : 0;
    const caMgRatio = mg > 0 ? ca / mg : 0;
    const caRel = ctc > 0 ? (ca / ctc) * 100 : 0;

    const targetV: Record<CropKey, number> = {
      soja: 65, "milho-grao": 65, "milho-silagem": 70, trigo: 60, feijao: 65,
      batata: 70, morango: 70, maca: 70, uva: 70, pastagem: 60,
    };
    const meta = targetV[cultura];
    const limingNeed = v < meta ? Math.max(0, ((meta - v) * ctc) / 100 * (100 / 75)) : 0;

    let limeType = "Dolomítico";
    if (mg < 0.5) limeType = "Dolomítico (alto MgO)";
    else if (caMgRatio > 5) limeType = "Dolomítico";
    else if (caMgRatio >= 3 && caMgRatio <= 5) limeType = "Magnesiano";
    else if (caMgRatio < 3 && mg >= 1.0) limeType = "Calcítico";

    let gypsumNeed = 0;
    if (m > 20 || caRel < 35) gypsumNeed = Math.round((50 * argila) / 10) * 10;

    const cropData = CROPS[cultura];
    const yieldTons = (yieldExpected * cropData.unitWeightKg) / 1000;
    let nNeed = cropData.nPerTon * yieldTons;
    if (cropData.fbn && cultura === "soja") nNeed = 20;
    else if (cropData.fbn && cultura === "feijao") nNeed = Math.min(nNeed * 0.4, 70);
    const p2o5Need = cropData.p2o5PerTon * yieldTons;
    const k2oNeed = cropData.k2oPerTon * yieldTons;

    const novaAnalise = analisesDb.create({
      talhaoId, data, laboratorio,
      ph, ca, mg, k, al, hAl: hal, p, mo: om, argila,
      v, m,
      cultura: cropData.name,
      produtividadeEsperada: yieldExpected,
      recomendacaoCalagem: limingNeed,
      tipoCalcario: limeType,
      recomendacaoGesso: gypsumNeed,
      recomendacaoN: Math.round(nNeed),
      recomendacaoP2O5: Math.round(p2o5Need),
      recomendacaoK2O: Math.round(k2oNeed),
      observacoes,
    });

    onSave(novaAnalise);
  }

  if (talhoes.length === 0) {
    return (
      <div>
        <Header title="Nova análise" />
        <div className="px-4 -mt-4 space-y-3">
          <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Voltar</button>
          <Card>
            <p className="text-sm text-gray-600 mb-3">
              Você precisa cadastrar primeiro um produtor → propriedade → talhão antes de criar análises.
            </p>
            <Link href="/produtores"><Button>Ir para Produtores</Button></Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Nova análise" subtitle="Conforme Manual RS/SC" />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Cancelar</button>

        <Card>
          <h3 className="font-bold mb-3">Identificação</h3>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Talhão *</label>
            <select value={talhaoId} onChange={e => setTalhaoId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Selecione...</option>
              {talhoes.map(t => {
                const p = propriedadesDb.get(t.propriedadeId);
                const prod = p ? produtoresDb.get(p.produtorId) : null;
                return <option key={t.id} value={t.id}>{t.nome} — {p?.nome}{prod ? ` (${prod.nome})` : ""}</option>;
              })}
            </select>
          </div>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Data da análise</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Laboratório</label>
            <input type="text" value={laboratorio} onChange={e => setLaboratorio(e.target.value)} placeholder="Ex: Laborsolo, UPF, etc." className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Resultados da análise</h3>
          <NumInput label="pH (H₂O)" value={ph} setValue={setPh} step={0.1} />
          <NumInput label="Cálcio (cmolc/dm³)" value={ca} setValue={setCa} step={0.1} />
          <NumInput label="Magnésio (cmolc/dm³)" value={mg} setValue={setMg} step={0.1} />
          <NumInput label="Potássio (cmolc/dm³)" value={k} setValue={setK} step={0.05} />
          <NumInput label="Alumínio (cmolc/dm³)" value={al} setValue={setAl} step={0.1} />
          <NumInput label="H+Al (cmolc/dm³)" value={hal} setValue={setHal} step={0.5} />
          <NumInput label="Fósforo (mg/dm³, Mehlich)" value={p} setValue={setP} step={1} />
          <NumInput label="Matéria orgânica (%)" value={om} setValue={setOm} step={0.1} />
          <NumInput label="Argila (%)" value={argila} setValue={setArgila} step={5} />
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Cultura e produtividade</h3>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Cultura alvo</label>
            <select value={cultura} onChange={e => setCultura(e.target.value as CropKey)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <optgroup label="Grãos">
                <option value="soja">Soja</option>
                <option value="milho-grao">Milho (grão)</option>
                <option value="milho-silagem">Milho (silagem)</option>
                <option value="trigo">Trigo</option>
                <option value="feijao">Feijão</option>
              </optgroup>
              <optgroup label="Frutas">
                <option value="maca">Maçã</option>
                <option value="uva">Uva</option>
                <option value="morango">Morango</option>
              </optgroup>
              <optgroup label="Hortaliças">
                <option value="batata">Batata</option>
              </optgroup>
              <optgroup label="Forragem">
                <option value="pastagem">Pastagem</option>
              </optgroup>
            </select>
          </div>
          <NumInput label={`Produtividade esperada (${CROPS[cultura].unit})`} value={yieldExpected} setValue={setYieldExpected} step={1} />
        </Card>

        <Card>
          <label className="text-sm font-medium block mb-1">Observações</label>
          <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </Card>

        <Button onClick={calcular}>Calcular e Salvar</Button>
      </div>
    </div>
  );
}

// ==================== RESULTADO ====================

function ResultadoAnalise({ analise, onBack }: { analise: AnaliseSolo; onBack: () => void }) {
  const t = talhoesDb.get(analise.talhaoId);
  const p = t ? propriedadesDb.get(t.propriedadeId) : null;
  const prod = p ? produtoresDb.get(p.produtorId) : null;

  const phClass = analise.ph < 5.0 ? "Muito ácido" : analise.ph < 5.5 ? "Ácido" : analise.ph < 6.5 ? "Adequado" : "Alcalino";
  const phColor: any = analise.ph < 5.0 ? "red" : analise.ph < 5.5 ? "yellow" : analise.ph < 6.5 ? "green" : "blue";
  const sb = analise.ca + analise.mg + analise.k;
  const ctc = sb + analise.hAl;
  const caMgRatio = analise.mg > 0 ? analise.ca / analise.mg : 0;
  const caRel = ctc > 0 ? (analise.ca / ctc) * 100 : 0;
  const mgRel = ctc > 0 ? (analise.mg / ctc) * 100 : 0;
  const kRel = ctc > 0 ? (analise.k / ctc) * 100 : 0;

  return (
    <div>
      <Header title="Recomendações" subtitle={`${new Date(analise.data).toLocaleDateString("pt-BR")} · ${analise.cultura}`} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onBack} className="text-bazo-green text-sm font-semibold">← Voltar</button>

        {t && (
          <Card className="bg-blue-50">
            <div className="text-xs text-gray-600">Talhão</div>
            <div className="font-bold text-bazo-darkgreen">{t.nome} · {analise.produtividadeEsperada} {CROPS[Object.keys(CROPS).find(k => CROPS[k].name === analise.cultura) as CropKey || "soja"]?.unit}</div>
            {p && <div className="text-xs text-gray-600">{p.nome}{prod ? ` · ${prod.nome}` : ""}</div>}
          </Card>
        )}

        <Card>
          <h3 className="font-bold mb-3">📊 Indicadores</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Indicator label="SB" value={sb.toFixed(2)} unit="cmolc/dm³" />
            <Indicator label="CTC" value={ctc.toFixed(2)} unit="cmolc/dm³" />
            <Indicator label="V%" value={`${analise.v.toFixed(1)}%`} />
            <Indicator label="m%" value={`${analise.m.toFixed(1)}%`} highlight={analise.m > 20} />
            <Indicator label="Ca/CTC" value={`${caRel.toFixed(0)}%`} />
            <Indicator label="Mg/CTC" value={`${mgRel.toFixed(0)}%`} />
            <Indicator label="K/CTC" value={`${kRel.toFixed(0)}%`} />
            <Indicator label="Ca:Mg" value={`${caMgRatio.toFixed(1)}:1`} />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-2">🔬 Diagnóstico</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Badge text={phClass} color={phColor} /><span>pH {analise.ph}</span></div>
            {analise.m > 20 && <div className="text-red-700 text-xs bg-red-50 p-2 rounded">⚠️ Saturação de Al alta — toxidez provável</div>}
          </div>
        </Card>

        {analise.recomendacaoCalagem && analise.recomendacaoCalagem > 0 && (
          <Card className="bg-yellow-50 border-yellow-400">
            <h3 className="font-bold mb-2">⛰️ Calagem</h3>
            <div className="text-3xl font-bold text-bazo-darkgreen">{analise.recomendacaoCalagem.toFixed(1)} <span className="text-base">t/ha</span></div>
            <div className="mt-2 p-2 bg-white rounded text-sm">
              <strong>Tipo: {analise.tipoCalcario}</strong>
            </div>
            <p className="text-xs text-gray-700 mt-2">PRNT 75%. Aplicar 60-90 dias antes do plantio.</p>
          </Card>
        )}

        {analise.recomendacaoGesso && analise.recomendacaoGesso > 0 && (
          <Card className="bg-orange-50 border-orange-400">
            <h3 className="font-bold mb-2">🪨 Gessagem</h3>
            <div className="text-3xl font-bold text-bazo-darkgreen">{analise.recomendacaoGesso} <span className="text-base">kg/ha</span></div>
            <p className="text-xs text-gray-700 mt-2">Gesso agrícola. Aplicar a lanço, sem incorporação.</p>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-400">
          <h3 className="font-bold mb-2">💧 Adubação NPK</h3>
          <div className="grid grid-cols-3 gap-2">
            <NutrientBox label="N" value={analise.recomendacaoN || 0} color="bg-blue-600" />
            <NutrientBox label="P₂O₅" value={analise.recomendacaoP2O5 || 0} color="bg-orange-600" />
            <NutrientBox label="K₂O" value={analise.recomendacaoK2O || 0} color="bg-purple-600" />
          </div>
          <p className="text-xs text-gray-600 mt-3">Para colher {analise.produtividadeEsperada} unid/ha.</p>
        </Card>

        {analise.observacoes && (
          <Card>
            <h3 className="font-bold mb-2 text-sm">📝 Observações</h3>
            <p className="text-sm text-gray-700">{analise.observacoes}</p>
          </Card>
        )}

        <Card className="bg-gray-50">
          <p className="text-xs text-gray-600">
            ℹ️ Cálculos baseados no Manual de Adubação e Calagem RS/SC (CQFS) e dados EMBRAPA/IPNI.
          </p>
        </Card>
      </div>
    </div>
  );
}

// ==================== HELPERS ====================

function NumInput({ label, value, setValue, step }: any) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value) || 0)} step={step} className="w-full p-2 border border-gray-300 rounded-lg text-sm" inputMode="decimal" />
    </div>
  );
}

function Indicator({ label, value, unit, highlight }: any) {
  return (
    <div className={`p-2 rounded ${highlight ? "bg-red-50" : "bg-gray-50"}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`font-bold ${highlight ? "text-red-700" : "text-bazo-darkgreen"}`}>
        {value} {unit && <span className="text-xs font-normal">{unit}</span>}
      </div>
    </div>
  );
}

function NutrientBox({ label, value, color }: any) {
  return (
    <div className="text-center bg-white rounded-lg p-2">
      <div className={`${color} text-white text-xs font-bold rounded px-2 py-0.5 inline-block`}>{label}</div>
      <div className="text-2xl font-bold text-bazo-darkgreen mt-1">{value}</div>
      <div className="text-[10px] text-gray-500">kg/ha</div>
    </div>
  );
}
