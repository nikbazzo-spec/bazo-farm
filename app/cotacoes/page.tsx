"use client";
import { useState, useEffect } from "react";
import { Card, Header, Button, Badge } from "@/components/UI";
import { Plus, Trash2, DollarSign, Calendar } from "lucide-react";
import { cotacoesManuaisDb, type CotacaoManual } from "@/lib/storage";

export default function CotacoesPage() {
  const [cotacoes, setCotacoes] = useState<CotacaoManual[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CotacaoManual | null>(null);

  useEffect(() => { reload(); }, []);

  function reload() {
    setCotacoes(cotacoesManuaisDb.list());
  }

  function handleDelete(id: string) {
    if (confirm("Remover esta cotação?")) {
      cotacoesManuaisDb.remove(id);
      reload();
    }
  }

  if (showForm || editing) {
    return (
      <CotacaoForm
        cotacao={editing}
        onSave={() => { setShowForm(false); setEditing(null); reload(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <Header title="Cotações regionais" subtitle={`${cotacoes.length} cadastrada(s)`} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <Card className="bg-blue-50">
          <div className="text-xs text-gray-700 leading-relaxed">
            💡 Cadastre aqui cotações que <strong>não saem em APIs públicas</strong>: uvas para vinícolas, maçã para empacotadoras, preços de cooperativa local, leite por cooperativa, etc.
          </div>
        </Card>

        <Button onClick={() => setShowForm(true)}>
          <span className="flex items-center justify-center gap-2">
            <Plus size={18} /> Nova cotação
          </span>
        </Button>

        {cotacoes.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <DollarSign className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-sm text-gray-500">Nenhuma cotação cadastrada.</p>
              <p className="text-xs text-gray-400 mt-1">Comece registrando preços que você acompanha.</p>
            </div>
          </Card>
        ) : (
          cotacoes.map(c => (
            <Card key={c.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-bazo-darkgreen">{c.produto}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {c.fonte && `Fonte: ${c.fonte} · `}
                    <Calendar size={10} className="inline" /> {new Date(c.data).toLocaleDateString("pt-BR")}
                  </div>
                  {c.observacoes && (
                    <div className="text-xs text-gray-600 mt-1 italic">{c.observacoes}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-bazo-darkgreen">
                    R$ {c.preco.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="text-xs text-gray-500">/{c.unidade}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 mt-2 border-t border-gray-100">
                <button onClick={() => setEditing(c)} className="flex-1 py-1.5 bg-gray-100 rounded text-xs font-medium">
                  Editar
                </button>
                <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CotacaoForm({ cotacao, onSave, onCancel }: any) {
  const [produto, setProduto] = useState(cotacao?.produto || "");
  const [preco, setPreco] = useState(cotacao?.preco || 0);
  const [unidade, setUnidade] = useState(cotacao?.unidade || "kg");
  const [fonte, setFonte] = useState(cotacao?.fonte || "");
  const [data, setData] = useState(cotacao?.data || new Date().toISOString().split("T")[0]);
  const [observacoes, setObservacoes] = useState(cotacao?.observacoes || "");

  const sugestoesProduto = [
    "Uva Cabernet (vinícola)",
    "Uva Isabel (suco)",
    "Uva Niágara (mesa)",
    "Maçã Gala (empacotadora)",
    "Maçã Fuji (empacotadora)",
    "Soja (cooperativa local)",
    "Milho (cooperativa local)",
    "Leite (laticínio)",
    "Boi gordo (frigorífico local)",
    "Suíno vivo (cooperativa)",
  ];

  const unidades = ["kg", "@ (15kg)", "sc 60kg", "sc 50kg", "litro", "tonelada", "caixa", "dúzia", "milheiro", "unidade"];

  function save() {
    if (!produto.trim()) return alert("Produto é obrigatório");
    if (!preco || preco <= 0) return alert("Informe um preço válido");
    const dataObj = {
      produto: produto.trim(),
      preco: Number(preco),
      unidade,
      fonte: fonte.trim() || undefined,
      data,
      observacoes: observacoes.trim() || undefined,
    };
    if (cotacao) {
      cotacoesManuaisDb.update(cotacao.id, dataObj);
    } else {
      cotacoesManuaisDb.create(dataObj);
    }
    onSave();
  }

  return (
    <div>
      <Header title={cotacao ? "Editar cotação" : "Nova cotação"} />
      <div className="px-4 -mt-4 space-y-3 pb-4">
        <button onClick={onCancel} className="text-bazo-green text-sm font-semibold">← Cancelar</button>

        <Card>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Produto *</label>
            <input
              type="text"
              value={produto}
              onChange={e => setProduto(e.target.value)}
              placeholder="Ex: Uva Cabernet, Maçã Gala..."
              list="sugestoes-produto"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
            <datalist id="sugestoes-produto">
              {sugestoesProduto.map(s => <option key={s} value={s} />)}
            </datalist>
            <div className="mt-2 flex flex-wrap gap-1">
              {sugestoesProduto.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => setProduto(s)}
                  className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Preço (R$) *</label>
            <input
              type="number"
              value={preco}
              onChange={e => setPreco(parseFloat(e.target.value) || 0)}
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              inputMode="decimal"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Unidade *</label>
            <select value={unidade} onChange={e => setUnidade(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
              {unidades.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Fonte (opcional)</label>
            <input
              type="text"
              value={fonte}
              onChange={e => setFonte(e.target.value)}
              placeholder="Ex: Cotrijal, Vinícola Aurora, CEAGESP..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Observações</label>
            <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </Card>

        <Button onClick={save}>{cotacao ? "Salvar alterações" : "Cadastrar cotação"}</Button>
      </div>
    </div>
  );
}
