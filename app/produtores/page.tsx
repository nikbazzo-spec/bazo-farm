"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Header, Button, Badge } from "@/components/UI";
import { Plus, User, Phone, MapPin, ChevronRight, Trash2 } from "lucide-react";
import { produtoresDb, propriedadesDb, type Produtor } from "@/lib/storage";

export default function ProdutoresPage() {
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produtor | null>(null);

  useEffect(() => { reload(); }, []);

  function reload() {
    setProdutores(produtoresDb.list());
  }

  function handleDelete(id: string, nome: string) {
    if (confirm(`Remover ${nome} e todas suas propriedades/talhões/análises?`)) {
      produtoresDb.remove(id);
      reload();
    }
  }

  if (showForm || editing) {
    return (
      <ProdutorForm
        produtor={editing}
        onSave={() => { setShowForm(false); setEditing(null); reload(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <Header title="Produtores" subtitle={`${produtores.length} cadastrado(s)`} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <Button onClick={() => setShowForm(true)}>
          <span className="flex items-center justify-center gap-2">
            <Plus size={18} /> Novo produtor
          </span>
        </Button>

        {produtores.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <User className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-sm text-gray-500">Nenhum produtor cadastrado ainda.</p>
              <p className="text-xs text-gray-400 mt-1">Cadastre seus clientes para gerenciar propriedades e análises.</p>
            </div>
          </Card>
        ) : (
          produtores.map(p => {
            const props = propriedadesDb.listByProdutor(p.id);
            return (
              <Card key={p.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="bg-bazo-lightgreen rounded-full w-10 h-10 flex items-center justify-center text-bazo-darkgreen font-bold">
                    {p.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-bazo-darkgreen">{p.nome}</div>
                    {p.cidade && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {p.cidade} - {p.estado}
                      </div>
                    )}
                    {p.telefone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={10} /> {p.telefone}
                      </div>
                    )}
                    <div className="mt-1">
                      <Badge text={`${props.length} propriedade${props.length !== 1 ? "s" : ""}`} color="green" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link href={`/propriedades?produtor=${p.id}`} className="flex-1">
                    <button className="w-full py-2 bg-bazo-green text-white rounded-lg text-sm font-medium">
                      Propriedades
                    </button>
                  </Link>
                  <button onClick={() => setEditing(p)} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id, p.nome)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function ProdutorForm({ produtor, onSave, onCancel }: any) {
  const [nome, setNome] = useState(produtor?.nome || "");
  const [telefone, setTelefone] = useState(produtor?.telefone || "");
  const [email, setEmail] = useState(produtor?.email || "");
  const [cidade, setCidade] = useState(produtor?.cidade || "");
  const [estado, setEstado] = useState<"RS" | "SC" | "PR">(produtor?.estado || "RS");
  const [cpfCnpj, setCpfCnpj] = useState(produtor?.cpfCnpj || "");
  const [observacoes, setObservacoes] = useState(produtor?.observacoes || "");

  function save() {
    if (!nome.trim()) return alert("Nome é obrigatório");
    const data = { nome: nome.trim(), telefone, email, cidade, estado, cpfCnpj, observacoes };
    if (produtor) {
      produtoresDb.update(produtor.id, data);
    } else {
      produtoresDb.create(data);
    }
    onSave();
  }

  return (
    <div>
      <Header title={produtor ? "Editar produtor" : "Novo produtor"} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Cancelar</button>

        <Card>
          <Field label="Nome *" value={nome} onChange={setNome} placeholder="João da Silva" />
          <Field label="Telefone" value={telefone} onChange={setTelefone} placeholder="(54) 99999-9999" />
          <Field label="E-mail" value={email} onChange={setEmail} placeholder="joao@email.com" />
          <Field label="Cidade" value={cidade} onChange={setCidade} placeholder="Vacaria" />
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Estado</label>
            <select value={estado} onChange={e => setEstado(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              <option value="RS">Rio Grande do Sul</option>
              <option value="SC">Santa Catarina</option>
              <option value="PR">Paraná</option>
            </select>
          </div>
          <Field label="CPF/CNPJ" value={cpfCnpj} onChange={setCpfCnpj} placeholder="000.000.000-00" />
          <Field label="Observações" value={observacoes} onChange={setObservacoes} multiline />
        </Card>

        <Button onClick={save}>{produtor ? "Salvar alterações" : "Cadastrar produtor"}</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium block mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-bazo-green focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-bazo-green focus:outline-none"
        />
      )}
    </div>
  );
}
