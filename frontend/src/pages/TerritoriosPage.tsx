import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Download, AlertTriangle, X, Building2, BarChart3, Users } from 'lucide-react';
import { CHURN_TERRITORIO, churnNivel, churnColor, KPIS } from '../data/modelData';
import { CLIENTES } from '../data/clientesData';

const MEX_TOPO = '/mexico-states.json';

// Coordenadas aproximadas [lng, lat] de cada territorio Arca.
const COORDS: Record<string, [number, number]> = {
  'Monclova': [-101.42, 26.90], 'Reynosa': [-98.28, 26.05], 'Laredo': [-99.51, 27.48],
  'Matamoros': [-97.50, 25.87], 'Saltillo': [-101.00, 25.42], 'Comarca Lagunera': [-103.41, 25.54],
  'Piedras Negras': [-100.52, 28.70], 'Monterrey': [-100.32, 25.69], 'Culiacán': [-107.39, 24.79],
  'San Luis Potosí': [-100.98, 22.16], 'Hermosillo': [-110.96, 29.07], 'La Paz': [-110.31, 24.14],
  'Juárez': [-106.42, 31.69], 'Guadalajara': [-103.35, 20.67], 'Nuevo León': [-99.57, 24.85],
  'Zacatecas': [-102.58, 22.77], 'Aguascalientes': [-102.30, 21.88], 'Obregón': [-109.93, 27.49],
  'Mexicali': [-115.47, 32.65], 'Mazatlán': [-106.41, 23.25], 'Mesa Central': [-100.10, 20.40],
  'Chihuahua': [-106.08, 28.63], 'Jalisco': [-104.00, 20.00], 'Delicias': [-105.47, 28.19],
  'Durango': [-104.67, 24.03],
};

const TERRITORIOS = CHURN_TERRITORIO.map((t, i) => ({
  ...t,
  id: t.territorio,
  nombre: t.territorio,
  rank: i + 1,
  coords: COORDS[t.territorio] ?? [-102, 23] as [number, number],
  nivel: churnNivel(t.churnPct),
  color: churnColor(t.churnPct),
}));
type Terr = typeof TERRITORIOS[0];

const MAX_CHURN = TERRITORIOS[0].churnPct;
const PROMEDIO = KPIS.churnRatePct; // churn rate global real desde modelData.ts

const BADGE: Record<string, string> = {
  Alto:  'bg-red-100 text-brand-red',
  Medio: 'bg-amber-100 text-amber-700',
  Bajo:  'bg-green-100 text-green-700',
};

// ── Panel de detalle ───────────────────────────────────────────────────────────
function TerritoryDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const t = TERRITORIOS.find((x) => x.id === id);
  if (!t) return null;
  const clientesMatch = CLIENTES.filter((c) => c.territorio === t.nombre).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="w-72 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t.nombre}</h3>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${BADGE[t.nivel]}`}>
            {t.nivel} Riesgo
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
          <X size={18} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-5 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tasa de Churn</p>
          <p className="text-5xl font-black tracking-tight" style={{ color: t.color }}>{t.churnPct}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {t.churnPct >= PROMEDIO
              ? `${(t.churnPct / PROMEDIO).toFixed(1)}× el promedio global (0.81%)`
              : `por debajo del promedio global (0.81%)`}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><BarChart3 size={13} />Ranking</div>
            <p className="text-2xl font-bold text-gray-900">#{t.rank}<span className="text-sm text-gray-400 font-normal"> / 25</span></p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Building2 size={13} />Registros</div>
            <p className="text-2xl font-bold text-gray-900">{(t.registros / 1000).toFixed(0)}K</p>
          </div>
        </div>
        {/* Barra comparativa */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">vs. territorio de mayor churn</p>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full" style={{ width: `${(t.churnPct / MAX_CHURN) * 100}%`, backgroundColor: t.color }} />
          </div>
        </div>
      </div>

      {/* Clientes demo en este territorio (si hay) */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Users size={13} /> Clientes en seguimiento
        </p>
        {clientesMatch.length === 0 ? (
          <p className="text-sm text-gray-400">Sin clientes en seguimiento en este territorio.</p>
        ) : (
          <div className="space-y-3">
            {clientesMatch.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.nombre}</p>
                  <p className="text-xs text-gray-400">{c.segmento}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className="text-sm font-bold text-gray-800">{c.score}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[c.riesgo]}`}>{c.riesgo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tarjeta de territorio ──────────────────────────────────────────────────────
function TerritoryCard({ t, selected, onClick }: { t: Terr; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white border rounded-xl p-4 transition-all hover:shadow-md ${
        selected ? 'border-brand-red ring-2 ring-brand-red/20 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{t.nombre}</p>
          <p className="text-xs text-gray-400 mt-0.5">#{t.rank} · {(t.registros / 1000).toFixed(0)}K reg.</p>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-xl font-black" style={{ color: t.color }}>{t.churnPct}%</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[t.nivel]}`}>{t.nivel}</span>
        </div>
      </div>
    </button>
  );
}

// ── Página ──────────────────────────────────────────────────────────────────────
export default function TerritoriosPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const handlePin = (id: string) => setSelected((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mapa de Riesgo</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tasa de churn real por territorio Arca · validación 202601</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={15} />
          Exportar
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Map card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Tasa de Churn por Territorio (25)</h3>
              <div className="flex items-center gap-5 text-xs text-gray-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-red inline-block" />Alto (≥1.0%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />Medio (0.7–1.0%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" />Bajo (&lt;0.7%)</span>
              </div>
            </div>

            <div className="bg-slate-50" style={{ height: 440 }}>
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1400, center: [-102, 24] }} style={{ width: '100%', height: '100%' }}>
                <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
                  <Geographies geography={MEX_TOPO}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#E2E8F0"
                          stroke="#CBD5E1"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', fill: '#D1D9E6' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {TERRITORIOS.map((t) => {
                    const isSel = selected === t.id;
                    const r = 7 + t.churnPct * 6;
                    return (
                      <Marker key={t.id} coordinates={t.coords}>
                        {t.nivel === 'Alto' && <circle r={r + 6} fill={t.color} fillOpacity={0.15} />}
                        <circle
                          r={isSel ? r + 3 : r}
                          fill={t.color}
                          stroke="white"
                          strokeWidth={isSel ? 2.5 : 1.5}
                          style={{ cursor: 'pointer', transition: 'all 0.2s', filter: isSel ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
                          onClick={() => handlePin(t.id)}
                        />
                        <text textAnchor="middle" dominantBaseline="central" fill="white" fontSize={9} fontWeight="700"
                          style={{ cursor: 'pointer', pointerEvents: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                          {t.churnPct}
                        </text>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>

          {/* Grid de territorios */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Todos los Territorios (ordenados por churn)</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {TERRITORIOS.map((t) => (
                <TerritoryCard key={t.id} t={t} selected={selected === t.id} onClick={() => handlePin(t.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        {selected ? (
          <TerritoryDetail id={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="w-72 shrink-0 bg-white border-l border-gray-200 flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Selecciona un territorio</p>
            <p className="text-xs text-gray-400 mt-1">Haz clic en un punto del mapa o en una tarjeta para ver el detalle</p>
          </div>
        )}
      </div>
    </div>
  );
}
