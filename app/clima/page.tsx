"use client";
import { useEffect, useState } from "react";
import { Card, Header, Badge } from "@/components/UI";
import { Snowflake, Thermometer, Droplets, Wind } from "lucide-react";

type Forecast = {
  current: { temp: number; humidity: number; wind: number; code: number };
  daily: Array<{ date: string; max: number; min: number; code: number; rain: number }>;
};

export default function ClimaPage() {
  const [data, setData] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Padrão: Porto Alegre. Se o usuário permitir, usa localização real
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Sao_Paulo&forecast_days=7`)
        .then(r => r.json())
        .then(d => {
          setData({
            current: {
              temp: Math.round(d.current.temperature_2m),
              humidity: d.current.relative_humidity_2m,
              wind: Math.round(d.current.wind_speed_10m),
              code: d.current.weather_code,
            },
            daily: d.daily.time.map((date: string, i: number) => ({
              date,
              max: Math.round(d.daily.temperature_2m_max[i]),
              min: Math.round(d.daily.temperature_2m_min[i]),
              code: d.daily.weather_code[i],
              rain: d.daily.precipitation_sum[i] || 0,
            })),
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-30.0346, -51.2177),
        { timeout: 5000 }
      );
    } else {
      fetchWeather(-30.0346, -51.2177);
    }
  }, []);

  const frostRisk = data?.daily.find(d => d.min <= 2);

  return (
    <div>
      <Header title="Clima" subtitle="Previsão da sua região" />

      <div className="px-4 -mt-4 space-y-4">
        {loading ? (
          <Card><p className="text-center text-gray-500">Carregando previsão...</p></Card>
        ) : !data ? (
          <Card><p className="text-center text-gray-500">Não foi possível carregar o clima. Verifique sua conexão.</p></Card>
        ) : (
          <>
            {/* Atual */}
            <Card className="bg-gradient-to-br from-bazo-green to-bazo-darkgreen text-white border-0">
              <div className="text-sm opacity-80">Agora</div>
              <div className="text-5xl font-bold mt-1">{data.current.temp}°C</div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1"><Droplets size={14} /> {data.current.humidity}%</div>
                <div className="flex items-center gap-1"><Wind size={14} /> {data.current.wind} km/h</div>
              </div>
            </Card>

            {/* Alerta geada */}
            {frostRisk && (
              <Card className="border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="text-blue-500" size={20} />
                  <h2 className="font-bold text-blue-800">Risco de geada</h2>
                  <Badge text="Atenção" color="blue" />
                </div>
                <p className="text-sm text-gray-700">
                  Mínima prevista de {frostRisk.min}°C em {formatDate(frostRisk.date)}.
                  Proteja culturas sensíveis.
                </p>
              </Card>
            )}

            {/* Próximos 7 dias */}
            <Card>
              <h2 className="font-bold text-bazo-darkgreen mb-3 flex items-center gap-2">
                <Thermometer size={18} /> Próximos 7 dias
              </h2>
              <div className="space-y-2">
                {data.daily.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                    <div className="flex-1 text-sm font-medium">
                      {i === 0 ? "Hoje" : formatDate(d.date)}
                    </div>
                    <div className="text-xs text-gray-500 w-20">{describeWeather(d.code)}</div>
                    {d.rain > 0 && (
                      <div className="text-xs text-blue-600 w-12 text-right">{d.rain}mm</div>
                    )}
                    <div className="text-sm font-semibold text-bazo-darkgreen w-20 text-right">
                      {d.min}° / {d.max}°
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function describeWeather(code: number): string {
  if (code === 0) return "Limpo";
  if (code <= 3) return "Nublado";
  if (code <= 48) return "Encoberto";
  if (code <= 67) return "Chuvoso";
  if (code <= 77) return "Neve";
  if (code <= 82) return "Pancadas";
  return "Tempestade";
}
