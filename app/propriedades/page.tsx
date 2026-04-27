"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Header, Button, Badge } from "@/components/UI";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { propriedadesDb, produtoresDb, talhoesDb, type Propriedade, type Produtor } from "@/lib/storage";

export default function PropriedadesPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PropriedadesPage />
    </Suspense>
  );
}

function PropriedadesPage() {
  const searchParams = useSearchParams();
  const filtroProdutorId = searchParams.get("produtor");

  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Propriedade | null>(null);

  useEffect(() => { reload(); }, [filtroProdutorId]);

  function reload() {
    const all = propriedadesDb.list();
    setPropriedades(filtroProdutorId ? all.filter(p => p.produtorId === filtroProdutorId) : all);
    setProdutores(produtoresDb.list());
  }

  function handleDelete(id: string, nome: string) {
    if (confirm(`Remover ${nome} e todos seus talhões/análises?`)) {
      propriedadesDb.remove(id);
      reload();
    }
  }

  if (showForm || editing) {
    return (
      <PropriedadeForm
        propriedade={editing}
        produtorPreSelecionado={filtroProdutorId || undefined}
        produtores={produtores}
        onSave={() => { setShowForm(false); setEditing(null); reload(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  const produtorFiltro = filtroProdutorId ? produtores.find(p => p.id === filtroProdutorId) : null;

  return (
    <div>
      <Header
        title="Propriedades"
        subtitle={produtorFiltro ? `${produtorFiltro.nome}` : `${propriedades.length} cadastrada(s)`}
      />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        {filtroProdutorId && (
          <Link href="/produtores" className="text-bazo-green text-sm font-semibold inline-block">
            ← Voltar para produtores
          </Link>
        )}

        {produtores.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 text-center py-4">
              Cadastre primeiro um produtor antes de adicionar propriedades.
            </p>
            <Link href="/produtores">
              <Button>Ir para Produtores</Button>
            </Link>
          </Card>
        ) : (
          <>
            <Button onClick={() => setShowForm(true)}>
              <span className="flex items-center justify-center gap-2">
                <Plus size={18} /> Nova propriedade
              </span>
            </Button>

            {propriedades.length === 0 ? (
              <Card>
                <div className="text-center py-6">
                  <MapPin className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-sm text-gray-500">Nenhuma propriedade cadastrada.</p>
                </div>
              </Card>
            ) : (
              propriedades.map(prop => {
                const produtor = produtores.find(p => p.id === prop.produtorId);
                const talhoes = talhoesDb.listByPropriedade(prop.id);
                const areaTalhoes = talhoes.reduce((s, t) => s + t.areaHa, 0);
                return (
                  <Card key={prop.id} className="space-y-2">
                    <div>
                      <div className="font-bold text-bazo-darkgreen">{prop.nome}</div>
                      {produtor && <div className="text-xs text-gray-500">Produtor: {produtor.nome}</div>}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {prop.cidade} - {prop.estado}
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge text={`${prop.areaTotalHa} ha total`} color="green" />
                        <Badge text={`${talhoes.length} talhão(ões)`} color="blue" />
                        {areaTalhoes > 0 && <Badge text={`${areaTalhoes.toFixed(1)} ha em talhões`} color="gray" />}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link href={`/talhoes?propriedade=${prop.id}`} className="flex-1">
                        <button className="w-full py-2 bg-bazo-green text-white rounded-lg text-sm font-medium">
                          Talhões
                        </button>
                      </Link>
                      <button onClick={() => setEditing(prop)} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(prop.id, prop.nome)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">
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

function PropriedadeForm({ propriedade, produtores, produtorPreSelecionado, onSave, onCancel }: any) {
  const [produtorId, setProdutorId] = useState(propriedade?.produtorId || produtorPreSelecionado || produtores[0]?.id || "");
  const [nome, setNome] = useState(propriedade?.nome || "");
  const [cidade, setCidade] = useState(propriedade?.cidade || "");
  const [estado, setEstado] = useState<"RS" | "SC" | "PR">(propriedade?.estado || "RS");
  const [areaTotalHa, setAreaTotalHa] = useState(propriedade?.areaTotalHa || 0);
  const [latitude, setLatitude] = useState(propriedade?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(propriedade?.longitude?.toString() || "");
  const [observacoes, setObservacoes] = useState(propriedade?.observacoes || "");

  function save() {
    if (!nome.trim()) return alert("Nome da propriedade é obrigatório");
    if (!produtorId) return alert("Selecione um produtor");
    if (!areaTotalHa || areaTotalHa <= 0) return alert("Informe a área total");
    const data = {
      produtorId,
      nome: nome.trim(),
      cidade,
      estado,
      areaTotalHa: Number(areaTotalHa),
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      observacoes,
    };
    if (propriedade) {
      propriedadesDb.update(propriedade.id, data);
    } else {
      propriedadesDb.create(data);
    }
    onSave();
  }

  function pegarLocalizacao() {
    if (!navigator.geolocation) return alert("Localização não suportada");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      () => alert("Erro ao obter localização"),
    );
  }

  return (
    <div>
      <Header title={propriedade ? "Editar propriedade" : "Nova propriedade"} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Cancelar</button>

        <Card>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Produtor *</label>
            <select value={produtorId} onChange={e => setProdutorId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Selecione...</option>
              {produtores.map((p: Produtor) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <Field label="Nome da propriedade *" value={nome} onChange={setNome} placeholder="Sítio Boa Vista" />
          <Field label="Cidade *" value={cidade} onChange={setCidade} placeholder="Vacaria" />

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Estado *</label>
            <select value={estado} onChange={e => setEstado(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="RS">Rio Grande do Sul</option>
              <option value="SC">Santa Catarina</option>
              <option value="PR">Paraná</option>
            </select>
          </div>

          <NumField label="Área total (ha) *" value={areaTotalHa} onChange={setAreaTotalHa} step={0.1} />

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Coordenadas (opcional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                placeholder="Latitude"
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                placeholder="Longitude"
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={pegarLocalizacao}
              className="mt-2 w-full py-2 bg-bazo-lightgreen text-bazo-darkgreen rounded-lg text-sm font-medium"
            >
              📍 Usar localização atual
            </button>
          </div>

          <Field label="Observações" value={observacoes} onChange={setObservacoes} multiline />
        </Card>

        <Button onClick={save}>{propriedade ? "Salvar alterações" : "Cadastrar propriedade"}</Button>
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
