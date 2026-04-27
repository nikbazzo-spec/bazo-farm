"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Header, Badge } from "@/components/UI";
import { CloudRain, Users, MapPin, Sprout, FlaskConical, Calculator, AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, DollarSign, Plus } from "lucide-react";
import { produtoresDb, propriedadesDb, talhoesDb, analisesDb, cotacoesManuaisDb, type CotacaoManual } from "@/lib/storage";

type Cotacao = {
  id: string;
  label: string;
  value: number;
  formatted: string;
  change?: number;
  unit: string;
  category: string;
  source?: string;
  isReference?: boolean;
};

export default function HomePage() {
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [stats, setStats] = useState({ produtores: 0, propriedades: 0, talhoes: 0, analises: 0, areaTotal: 0 });
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [cotacoesUpdatedAt, setCotacoesUpdatedAt] = useState<string>("");
  const [loadingCotacoes, setLoadingCotacoes] = useState(true);
  const [cotacoesManuais, setCotacoesManuais] = useState<CotacaoManual[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");

    fetch("https://api.open-meteo.com/v1/forecast?latitude=-30.0346&longitude=-51.2177&current=temperature_2m,weather_code&timezone=America/Sao_Paulo")
      .then(r => r.json())
      .then(data => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          description: describeWeather(data.current.weather_code),
        });
      })
      .catch(() => setWeather(null));

    setStats({
      produtores: produtoresDb.list().length,
      propriedades: propriedadesDb.list().length,
      talhoes: talhoesDb.list().length,
      analises: analisesDb.list().length,
      areaTotal: talhoesDb.list().reduce((s, t) => s + t.areaHa, 0),
    });

    loadCotacoes();
    setCotacoesManuais(cotacoesManuaisDb.list());
  }, []);

  function loadCotacoes() {
    setLoadingCotacoes(true);
    fetch("/api/cotacoes")
      .then(r => r.json())
      .then(data => {
        setCotacoes(data.cotacoes || []);
        setCotacoesUpdatedAt(data.updatedAt || "");
        setLoadingCotacoes(false);
      })
      .catch(() => setLoadingCotacoes(false));
  }

  return (
    <div>
      <Header title={`${greeting}, agrônomo!`} subtitle="Tudo pronto na sua rotina hoje?" />

      <div className="px-4 -mt-4 space-y-4 pb-4">
        {/* Clima */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Clima agora</div>
              <div className="text-3xl font-bold text-bazo-darkgreen">
                {weather ? `${weather.temp}°C` : "--"}
              </div>
              <div className="text-sm text-gray-600">{weather?.description || "Carregando..."}</div>
            </div>
            <CloudRain className="text-bazo-green" size={48} />
          </div>
        </Card>

        {/* COTAÇÕES */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-bazo-darkgreen flex items-center gap-2">
                <DollarSign size={18} /> Cotações de hoje
              </h2>
              {cotacoesUpdatedAt && (
                <div className="text-xs text-gray-500">
                  {formatTime(cotacoesUpdatedAt)}
                </div>
              )}
            </div>
            <button onClick={loadCotacoes} className="p-2 text-bazo-green active:scale-95">
              <RefreshCw size={16} className={loadingCotacoes ? "animate-spin" : ""} />
            </button>
          </div>

          {loadingCotacoes && cotacoes.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">Carregando cotações...</div>
          ) : (
            <div className="space-y-3">
              {/* Moedas */}
              {cotacoes.filter(c => c.category === "moeda").length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Moedas</div>
                  <div className="space-y-1">
                    {cotacoes.filter(c => c.category === "moeda").map(c => (
                      <CotacaoRow key={c.id} cotacao={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* Grãos */}
              {cotacoes.filter(c => c.category === "grao").length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Grãos</div>
                  <div className="space-y-1">
                    {cotacoes.filter(c => c.category === "grao").map(c => (
                      <CotacaoRow key={c.id} cotacao={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pecuária */}
              {cotacoes.filter(c => c.category === "pecuaria").length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Pecuária</div>
                  <div className="space-y-1">
                    {cotacoes.filter(c => c.category === "pecuaria").map(c => (
                      <CotacaoRow key={c.id} cotacao={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-[10px] text-gray-500 leading-relaxed">
              ⚠️ Commodities baseadas em referência CEPEA/ESALQ. Para preços oficiais em tempo real, consulte <strong>cepea.esalq.usp.br</strong>. Dólar/Euro em tempo real via AwesomeAPI.
            </div>
          </div>
        </Card>

        {/* COTAÇÕES MANUAIS (uva, maçã, preços locais) */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-bazo-darkgreen">Cotações regionais</h2>
            <Link href="/cotacoes" className="text-bazo-green text-xs font-semibold flex items-center gap-1">
              <Plus size={14} /> Adicionar
            </Link>
          </div>

          {cotacoesManuais.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 mb-2">Sem cotações regionais cadastradas</p>
              <p className="text-[10px] text-gray-400">
                Registre preços de uva, maçã ou cooperativa local
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {cotacoesManuais.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium">{c.produto}</div>
                    <div className="text-[10px] text-gray-500">
                      {c.fonte || "Manual"} · {new Date(c.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-bazo-darkgreen">
                      R$ {c.preco.toFixed(2).replace(".", ",")}
                    </div>
                    <div className="text-[10px] text-gray-500">/{c.unidade}</div>
                  </div>
                </div>
              ))}
              {cotacoesManuais.length > 5 && (
                <Link href="/cotacoes" className="text-xs text-bazo-green font-medium block text-center pt-2">
                  Ver todas ({cotacoesManuais.length})
                </Link>
              )}
            </div>
          )}
        </Card>

        {/* Resumo dos cadastros */}
        <Card>
          <h2 className="font-bold text-bazo-darkgreen mb-3">Sua operação</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/produtores">
              <div className="bg-blue-50 rounded-xl p-3 active:scale-95 transition">
                <Users className="text-blue-600 mb-1" size={20} />
                <div className="text-2xl font-bold text-bazo-darkgreen">{stats.produtores}</div>
                <div className="text-xs text-gray-600">Produtores</div>
              </div>
            </Link>
            <Link href="/propriedades">
              <div className="bg-green-50 rounded-xl p-3 active:scale-95 transition">
                <MapPin className="text-green-600 mb-1" size={20} />
                <div className="text-2xl font-bold text-bazo-darkgreen">{stats.propriedades}</div>
                <div className="text-xs text-gray-600">Propriedades</div>
              </div>
            </Link>
            <Link href="/talhoes">
              <div className="bg-yellow-50 rounded-xl p-3 active:scale-95 transition">
                <Sprout className="text-yellow-700 mb-1" size={20} />
                <div className="text-2xl font-bold text-bazo-darkgreen">{stats.talhoes}</div>
                <div className="text-xs text-gray-600">Talhões ({stats.areaTotal.toFixed(1)} ha)</div>
              </div>
            </Link>
            <Link href="/solo">
              <div className="bg-orange-50 rounded-xl p-3 active:scale-95 transition">
                <FlaskConical className="text-orange-600 mb-1" size={20} />
                <div className="text-2xl font-bold text-bazo-darkgreen">{stats.analises}</div>
                <div className="text-xs text-gray-600">Análises</div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Atalhos */}
        <Card>
          <h2 className="font-bold text-bazo-darkgreen mb-3">Atalhos</h2>
          <div className="space-y-2">
            <Link href="/produtores" className="flex items-center gap-3 p-3 bg-bazo-green text-white rounded-xl">
              <Users size={20} />
              <div className="flex-1 font-medium text-sm">Cadastrar novo produtor</div>
            </Link>
            <Link href="/calculadoras" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calculator size={20} className="text-bazo-green" />
              <div className="flex-1 font-medium text-sm">Calculadoras de plantio</div>
            </Link>
            <Link href="/culturas" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Sprout size={20} className="text-bazo-green" />
              <div className="flex-1 font-medium text-sm">Catálogo de culturas</div>
            </Link>
          </div>
        </Card>

        {stats.produtores > 0 && (
          <Card className="bg-yellow-50 border-yellow-300">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-xs">
                <strong>Faça backup periodicamente!</strong> Vá em <strong>Mais → Exportar dados</strong>.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function CotacaoRow({ cotacao }: { cotacao: Cotacao }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex-1">
        <div className="text-sm font-medium">{cotacao.label}</div>
        <div className="text-[10px] text-gray-500">
          {cotacao.unit}
          {cotacao.source && ` · ${cotacao.source}`}
          {cotacao.isReference && " · ref."}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-bazo-darkgreen">{cotacao.formatted}</div>
        {cotacao.change !== undefined && cotacao.change !== null && (
          <div className={`text-[10px] flex items-center justify-end gap-0.5 ${
            cotacao.change > 0 ? "text-green-600" : cotacao.change < 0 ? "text-red-600" : "text-gray-500"
          }`}>
            {cotacao.change > 0 ? <TrendingUp size={10} /> : cotacao.change < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
            {Math.abs(cotacao.change).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}

function describeWeather(code: number): string {
  if (code === 0) return "Céu limpo";
  if (code <= 3) return "Parcialmente nublado";
  if (code <= 48) return "Nublado";
  if (code <= 67) return "Chuvoso";
  if (code <= 77) return "Neve";
  if (code <= 82) return "Pancadas de chuva";
  return "Tempestade";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `Atualizado às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
