"use client";
import Link from "next/link";
import { Card, Header } from "@/components/UI";
import { Users, MapPin, Sprout, Layers, Sparkles, DollarSign, Camera, Settings, CreditCard, ChevronRight, Download, Upload } from "lucide-react";
import { useState } from "react";
import { exportAll, importAll } from "@/lib/storage";

const items = [
  { href: "/produtores", label: "Produtores", icon: Users, color: "text-blue-600", desc: "Cadastro de clientes" },
  { href: "/propriedades", label: "Propriedades", icon: MapPin, color: "text-green-600", desc: "Fazendas e sítios" },
  { href: "/talhoes", label: "Talhões", icon: Sprout, color: "text-bazo-green", desc: "Áreas de cultivo" },
  { href: "/solo", label: "Análise de Solo", icon: Layers, color: "text-amber-700", desc: "Calagem, gessagem, NPK" },
  { href: "/cotacoes", label: "Cotações regionais", icon: DollarSign, color: "text-emerald-600", desc: "Uva, maçã, preços locais" },
  { href: "/ia", label: "Agrônomo IA", icon: Sparkles, color: "text-purple-600", desc: "Chat com IA" },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign, color: "text-green-600", desc: "Receitas e despesas" },
  { href: "/ia/diagnostico", label: "Diagnóstico Foto", icon: Camera, color: "text-orange-600", desc: "IA por imagem" },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard, color: "text-blue-600", desc: "Planos do app" },
  { href: "/config", label: "Configurações", icon: Settings, color: "text-gray-600", desc: "Preferências" },
];

export default function MaisPage() {
  const [showBackup, setShowBackup] = useState(false);

  function fazerBackup() {
    const data = exportAll();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bazo-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function restaurarBackup(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (importAll(text)) {
        alert("Backup restaurado com sucesso!");
        location.reload();
      } else {
        alert("Erro ao restaurar backup. Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <Header title="Mais" subtitle="Recursos do Bazo Farm" />

      <div className="px-4 -mt-4 space-y-2 pb-4">
        <div className="text-xs font-bold text-gray-500 uppercase mt-3 mb-1">Gestão</div>
        {items.slice(0, 3).map(({ href, label, icon: Icon, color, desc }) => (
          <Link key={href} href={href}>
            <Card className="flex items-center gap-3">
              <Icon className={color} size={24} />
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Card>
          </Link>
        ))}

        <div className="text-xs font-bold text-gray-500 uppercase mt-3 mb-1">Ferramentas</div>
        {items.slice(3, 7).map(({ href, label, icon: Icon, color, desc }) => (
          <Link key={href} href={href}>
            <Card className="flex items-center gap-3">
              <Icon className={color} size={24} />
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Card>
          </Link>
        ))}

        <div className="text-xs font-bold text-gray-500 uppercase mt-3 mb-1">Backup</div>
        <Card>
          <div className="space-y-2">
            <button onClick={fazerBackup} className="w-full flex items-center gap-3 py-2">
              <Download className="text-bazo-green" size={20} />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Exportar dados</div>
                <div className="text-xs text-gray-500">Salva backup em JSON</div>
              </div>
            </button>
            <label className="w-full flex items-center gap-3 py-2 cursor-pointer">
              <Upload className="text-bazo-green" size={20} />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Importar dados</div>
                <div className="text-xs text-gray-500">Restaurar de backup</div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={e => e.target.files?.[0] && restaurarBackup(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </Card>

        <div className="text-xs font-bold text-gray-500 uppercase mt-3 mb-1">App</div>
        {items.slice(7).map(({ href, label, icon: Icon, color, desc }) => (
          <Link key={href} href={href}>
            <Card className="flex items-center gap-3">
              <Icon className={color} size={24} />
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
