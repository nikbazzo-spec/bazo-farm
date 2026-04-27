"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Header, Button, Badge } from "@/components/UI";
import { Plus, Sprout, Trash2, FlaskConical } from "lucide-react";
import { talhoesDb, propriedadesDb, produtoresDb, analisesDb, type Talhao } from "@/lib/storage";

export default function TalhoesPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TalhoesPage />
    </Suspense>
  );
}

function TalhoesPage() {
  const searchParams = useSearchParams();
  const filtroPropriedadeId = searchParams.get("propriedade");

  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Talhao | null>(null);

  useEffect(() => { reload(); }, [filtroPropriedadeId]);

  function reload() {
    const all = talhoesDb.list();
    setTalhoes(filtroPropriedadeId ? all.filter(t => t.propriedadeId === filtroPropriedadeId) : all);
  }

  function handleDelete(id: string, nome: string) {
    if (confirm(`Remover talhão ${nome} e todas suas análises?`)) {
      talhoesDb.remove(id);
      reload();
    }
  }

  if (showForm || editing) {
    return (
      <TalhaoForm
        talhao={editing}
        propriedadeId={filtroPropriedadeId || undefined}
        onSave={() => { setShowForm(false); setEditing(null); reload(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  const propriedade = filtroPropriedadeId ? propriedadesDb.get(filtroPropriedadeId) : null;
  const produtor = propriedade ? produtoresDb.get(propriedade.produtorId) : null;
  const propriedades = propriedadesDb.list();

  return (
    <div>
      <Header
        title="Talhões"
        subtitle={propriedade ? `${propriedade.nome}${produtor ? ` (${produtor.nome})` : ""}` : `${talhoes.length} cadastrado(s)`}
      />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        {filtroPropriedadeId && (
          <Link href={`/propriedades?produtor=${propriedade?.produtorId || ""}`} className="text-bazo-green text-sm font-semibold inline-block">
            ← Voltar para propriedades
          </Link>
        )}

        {propriedades.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 text-center py-4">
              Cadastre primeiro uma propriedade.
            </p>
            <Link href="/propriedades">
              <Button>Ir para Propriedades</Button>
            </Link>
          </Card>
        ) : (
          <>
            <Button onClick={() => setShowForm(true)}>
              <span className="flex items-center justify-center gap-2">
                <Plus size={18} /> Novo talhão
              </span>
            </Button>

            {talhoes.length === 0 ? (
              <Card>
                <div className="text-center py-6">
                  <Sprout className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-sm text-gray-500">Nenhum talhão cadastrado.</p>
                </div>
              </Card>
            ) : (
              talhoes.map(t => {
                const prop = propriedadesDb.get(t.propriedadeId);
                const prod = prop ? produtoresDb.get(prop.produtorId) : null;
                const analises = analisesDb.listByTalhao(t.id);
                return (
                  <Card key={t.id} className="space-y-2">
                    <div>
                      <div className="font-bold text-bazo-darkgreen">{t.nome}</div>
                      {prop && <div className="text-xs text-gray-500">{prop.nome}{prod ? ` · ${prod.nome}` : ""}</div>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge text={`${t.areaHa} ha`} color="green" />
                        {t.culturaAtual && <Badge text={t.culturaAtual} color="blue" />}
                        {t.variedade && <Badge text={t.variedade} color="gray" />}
                        <Badge text={`${analises.length} análise${analises.length !== 1 ? "s" : ""}`} color="yellow" />
                      </div>
                      {t.dataPlantio && (
                        <div className="text-xs text-gray-500 mt-1">
                          📅 Plantio: {new Date(t.dataPlantio).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link href={`/solo?talhao=${t.id}`} className="flex-1">
                        <button className="w-full py-2 bg-bazo-green text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                          <FlaskConical size={14} /> Análises
                        </button>
                      </Link>
                      <button onClick={() => setEditing(t)} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(t.id, t.nome)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TalhaoForm({ talhao, propriedadeId, onSave, onCancel }: any) {
  const propriedades = propriedadesDb.list();
  const [propId, setPropId] = useState(talhao?.propriedadeId || propriedadeId || propriedades[0]?.id || "");
  const [nome, setNome] = useState(talhao?.nome || "");
  const [areaHa, setAreaHa] = useState(talhao?.areaHa || 0);
  const [culturaAtual, setCulturaAtual] = useState(talhao?.culturaAtual || "");
  const [variedade, setVariedade] = useState(talhao?.variedade || "");
  const [dataPlantio, setDataPlantio] = useState(talhao?.dataPlantio || "");
  const [produtividadeEsperada, setProdutividadeEsperada] = useState(talhao?.produtividadeEsperada || 0);
  const [produtividadeUnidade, setProdutividadeUnidade] = useState(talhao?.produtividadeUnidade || "sc/ha");
  const [observacoes, setObservacoes] = useState(talhao?.observacoes || "");

  function save() {
    if (!nome.trim()) return alert("Nome do talhão é obrigatório");
    if (!propId) return alert("Selecione uma propriedade");
    if (!areaHa || areaHa <= 0) return alert("Informe a área");
    const data = {
      propriedadeId: propId,
      nome: nome.trim(),
      areaHa: Number(areaHa),
      culturaAtual,
      variedade,
      dataPlantio,
      produtividadeEsperada: Number(produtividadeEsperada) || undefined,
      produtividadeUnidade,
      observacoes,
    };
    if (talhao) {
      talhoesDb.update(talhao.id, data);
    } else {
      talhoesDb.create(data);
    }
    onSave();
  }

  return (
    <div>
      <Header title={talhao ? "Editar talhão" : "Novo talhão"} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Cancelar</button>

        <Card>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Propriedade *</label>
            <select value={propId} onChange={e => setPropId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Selecione...</option>
              {propriedades.map(p => {
                const prod = produtoresDb.get(p.produtorId);
                return <option key={p.id} value={p.id}>{p.nome}{prod ? ` — ${prod.nome}` : ""}</option>;
              })}
            </select>
          </div>

          <Field label="Nome do talhão *" value={nome} onChange={setNome} placeholder="Talhão Norte" />
          <NumField label="Área (ha) *" value={areaHa} onChange={setAreaHa} step={0.1} />

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Cultura atual</label>
            <select value={culturaAtual} onChange={e => setCulturaAtual(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Sem cultura no momento</option>
              <optgroup label="Grãos">
                <option>Soja</option>
                <option>Milho (grão)</option>
                <option>Milho (silagem)</option>
                <option>Trigo</option>
                <option>Aveia (grão)</option>
                <option>Aveia (pastagem)</option>
                <option>Feijão</option>
              </optgroup>
              <optgroup label="Frutas">
                <option>Maçã</option>
                <option>Uva (vinífera)</option>
                <option>Uva (americana)</option>
                <option>Uva (mesa)</option>
                <option>Kiwi</option>
              </optgroup>
              <optgroup label="Hortaliças">
                <option>Batata</option>
                <option>Morango</option>
                <option>Cebola</option>
                <option>Alho</option>
                <option>Brócolis</option>
              </optgroup>
              <optgroup label="Forragem">
                <option>Pastagem</option>
                <option>Azevém</option>
              </optgroup>
            </select>
          </div>

          <Field label="Variedade/Cultivar" value={variedade} onChange={setVariedade} placeholder="Ex: BMX Valente, Gala, Hayward..." />

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Data de plantio</label>
            <input type="date" value={dataPlantio} onChange={e => setDataPlantio(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Produtividade esperada</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={produtividadeEsperada}
                onChange={e => setProdutividadeEsperada(parseFloat(e.target.value) || 0)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                inputMode="decimal"
              />
              <select value={produtividadeUnidade} onChange={e => setProdutividadeUnidade(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm">
                <option>sc/ha</option>
                <option>t/ha</option>
                <option>t MV/ha</option>
                <option>t MS/ha</option>
              </select>
            </div>
          </div>

          <Field label="Observações" value={observacoes} onChange={setObservacoes} multiline />
        </Card>

        <Button onClick={save}>{talhao ? "Salvar alterações" : "Cadastrar talhão"}</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium block mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
      )}
    </div>
  );
}

function NumField({ label, value, onChange, step }: any) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
        inputMode="decimal"
      />
    </div>
  );
}
