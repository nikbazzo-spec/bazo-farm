"use client";
import { useState } from "react";
import { Card, Header, Button } from "@/components/UI";
import { Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function IAPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Qual o melhor momento para semear soja no RS?",
    "Como controlar ferrugem asiática na soja?",
    "Quantas horas de frio a maçã Gala precisa?",
    "Recomendação de NPK para milho com 10 t/ha?",
  ];

  const send = async (text: string) => {
    if (!text.trim()) return;
    const newMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Desculpe, não consegui responder." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erro de conexão. Configure sua chave da Anthropic em Configurações." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <Header title="Agrônomo IA" subtitle="Especialista no Sul do Brasil" />

      <div className="flex-1 overflow-y-auto px-4 -mt-4 space-y-3 pb-4">
        {messages.length === 0 ? (
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-purple-600" size={20} />
              <h3 className="font-bold">Olá, produtor!</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Sou seu agrônomo IA especializado em culturas do Sul do Brasil. Me pergunte sobre
              manejo, pragas, doenças, adubação ou tire suas dúvidas.
            </p>
            <div className="space-y-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-bazo-green text-white rounded-br-sm"
                  : "bg-white border border-gray-200 rounded-bl-sm"
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl text-sm">
              <span className="animate-pulse">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex gap-2 bg-bazo-bg">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Pergunte ao agrônomo IA..."
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 text-sm"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="bg-bazo-green text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
