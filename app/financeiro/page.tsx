"use client";
import { useState, useEffect } from "react";
import { Card, Header, Button, Badge } from "@/components/UI";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";

type Entry = {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string;
};

export default function FinanceiroPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Entry>>({ type: "expense", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    const saved = localStorage.getItem("bazo-finance");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bazo-finance", JSON.stringify(entries));
  }, [entries]);

  const income = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const balance = income - expense;

  const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const save = () => {
    if (!form.description || !form.amount || !form.category) return;
    const newEntry: Entry = {
      id: Date.now().toString(),
      type: form.type || "expense",
      description: form.description,
      amount: form.amount,
      category: form.category,
      date: form.date || new Date().toISOString().split("T")[0],
    };
    setEntries([newEntry, ...entries]);
    setForm({ type: "expense", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const del = (id: string) => setEntries(entries.filter(e => e.id !== id));

  return (
    <div>
      <Header title="Financeiro" subtitle="Gestão de receitas e despesas" />

      <div className="px-4 -mt-4 space-y-4">
        {/* Resumo */}
        <Card>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-1 text-green-700 text-xs">
                <TrendingUp size={12} /> Receitas
              </div>
              <div className="text-lg font-bold text-green-700">{formatBRL(income)}</div>
            </div>
            <div className="flex-1 p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-1 text-red-700 text-xs">
                <TrendingDown size={12} /> Despesas
              </div>
              <div className="text-lg font-bold text-red-700">{formatBRL(expense)}</div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold">Saldo</span>
            <span className={`text-2xl font-bold ${balance >= 0 ? "text-green-700" : "text-red-700"}`}>
              {formatBRL(balance)}
            </span>
          </div>
        </Card>

        {!showForm ? (
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center justify-center gap-2">
              <Plus size={18} /> Novo lançamento
            </span>
          </Button>
        ) : (
          <Card>
            <h3 className="font-bold mb-3">Novo lançamento</h3>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setForm({ ...form, type: "income" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${form.type === "income" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              >Receita</button>
              <button
                onClick={() => setForm({ ...form, type: "expense" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${form.type === "expense" ? "bg-red-600 text-white" : "bg-gray-100"}`}
              >Despesa</button>
            </div>

            <input
              type="text"
              placeholder="Descrição"
              value={form.description || ""}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
            />
            <input
              type="number"
              placeholder="Valor (R$)"
              value={form.amount || ""}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
            />
            <select
              value={form.category || ""}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
            >
              <option value="">Selecione a categoria</option>
              {(form.type === "income"
                ? ["Venda de grãos", "Venda de animais", "Leite", "Outros"]
                : ["Insumos", "Sementes", "Fertilizantes", "Defensivos", "Combustível", "Mão de obra", "Manutenção", "Outros"]
              ).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg mb-3 text-sm"
            />

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                Cancelar
              </button>
              <button onClick={save} className="flex-1 py-2 bg-bazo-green text-white rounded-lg text-sm font-medium">
                Salvar
              </button>
            </div>
          </Card>
        )}

        {/* Lista */}
        {entries.length > 0 && (
          <Card>
            <h3 className="font-bold mb-3">Histórico</h3>
            <div className="space-y-2">
              {entries.map(e => (
                <div key={e.id} className="flex items-center gap-2 p-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{e.description}</div>
                    <div className="text-xs text-gray-500">
                      {e.category} · {new Date(e.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${e.type === "income" ? "text-green-700" : "text-red-700"}`}>
                    {e.type === "income" ? "+" : "-"}{formatBRL(e.amount)}
                  </div>
                  <button onClick={() => del(e.id)} className="text-gray-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
