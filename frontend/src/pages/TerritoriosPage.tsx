import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Download, ChevronDown, Users, AlertTriangle, TrendingUp, X } from 'lucide-react';
import { CLIENTES } from '../data/clientesData';

// ── Geo JSON for Mexico (estados) ─────────────────────────────────────────────
const MEX_TOPO = '/mexico-states.json';

// ── Territory data ────────────────────────────────────────────────────────────
const TERRITORIOS = [
  { id: 'cdmx',        nombre: 'CDMX',           lat: 19.4326,  lng: -99.1332,  score: 74, clientes: 5, altoRiesgo: 2 },
  { id: 'monterrey',   nombre: 'Monterrey',       lat: 25.6866,  lng: -100.3161, score: 68, clientes: 2, altoRiesgo: 1 },
  { id: 'guadalajara', nombre: 'Guadalajara',      lat: 20.6597,  lng: -103.3496, score: 66, clientes: 2, altoRiesgo: 1 },
  { id: 'puebla',      nombre: 'Puebla',           lat: 19.0414,  lng: -98.2063,  score: 49, clientes: 2, altoRiesgo: 0 },
  { id: 'tijuana',     nombre: 'Tijuana',          lat: 32.5027,  lng: -117.0039, score: 75, clientes: 1, altoRiesgo: 1 },
  { id: 'queretaro',   nombre: 'Querétaro',        lat: 20.5888,  lng: -100.3899, score: 48, clientes: 1, altoRiesgo: 0 },
  { id: 'veracruz',    nombre: 'Veracruz',         lat: 19.1738,  lng: -96.1342,  score: 44, clientes: 1, altoRiesgo: 0 },
];

const SUBCANALES = ['Todos los subcanales', 'Coca-Cola', 'Monster Energy', 'Powerade', 'Jugos Del Valle'];

// Cada estado de México (properties.name del GeoJSON) → id del territorio al que
// pertenece. Se usa para pintar el choropleth con el score de ese territorio.
const STATE_TO_TERR: Record<string, string> = {
  // Tijuana (noroeste)
  'Baja California': 'tijuana', 'Baja California Sur': 'tijuana', 'Sonora': 'tijuana',
  'Sinaloa': 'tijuana', 'Chihuahua': 'tijuana', 'Durango': 'tijuana',
  // Monterrey (noreste)
  'Nuevo León': 'monterrey', 'Coahuila': 'monterrey', 'Tamaulipas': 'monterrey',
  'Zacatecas': 'monterrey', 'San Luis Potosí': 'monterrey',
  // Guadalajara (occidente)
  'Jalisco': 'guadalajara', 'Nayarit': 'guadalajara', 'Colima': 'guadalajara',
  'Aguascalientes': 'guadalajara', 'Michoacán': 'guadalajara', 'Guanajuato': 'guadalajara',
  // Querétaro (bajío)
  'Querétaro': 'queretaro', 'Hidalgo': 'queretaro',
  // CDMX (centro)
  'Ciudad de México': 'cdmx', 'México': 'cdmx', 'Morelos': 'cdmx', 'Tlaxcala': 'cdmx',
  // Puebla
  'Puebla': 'puebla', 'Oaxaca': 'puebla', 'Guerrero': 'puebla',
  // Veracruz (sureste)
  'Veracruz': 'veracruz', 'Tabasco': 'veracruz', 'Chiapas': 'veracruz',
  'Campeche': 'veracruz', 'Yucatán': 'veracruz', 'Quintana Roo': 'veracruz',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 75) return '#C8102E';
  if (score >= 50) return '#F59E0B';
  return '#22C55E';
}

function scoreLabel(score: number): 'Alto' | 'Medio' | 'Bajo' {
  if (score >= 75) return 'Alto';
  if (score >= 50) return 'Medio';
  return 'Bajo';
}

const BADGE: Record<string, string> = {
  Alto:  'bg-red-100 text-brand-red',
  Medio: 'bg-amber-100 text-amber-700',
  Bajo:  'bg-green-100 text-green-700',
};

// ── Sidebar detail panel ──────────────────────────────────────────────────────
function TerritoryDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const t = TERRITORIOS.find(t => t.id === id);
  if (!t) return null;
  const topClientes = CLIENTES
    .filter(c => c.territorio === t.nombre)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="w-72 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t.nombre}</h3>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${BADGE[scoreLabel(t.score)]}`}>
            {scoreLabel(t.score)} Riesgo
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
          <X size={18} />
        </button>
      </div>

      {/* KPIs */}
      <div className="px-6 py-5 space-y-5 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Score Promedio</p>
          <p className="text-5xl font-black tracking-tight" style={{ color: scoreColor(t.score) }}>{t.score}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1"><Users size={13} />Total</div>
            <p className="text-2xl font-bold text-gray-900">{t.clientes}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-brand-red text-xs mb-1"><AlertTriangle size={13} />Alto Riesgo</div>
            <p className="text-2xl font-bold text-brand-red">{t.altoRiesgo}</p>
          </div>
        </div>
      </div>

      {/* Top clients */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Clientes</p>
        {topClientes.length === 0 ? (
          <p className="text-sm text-gray-400">Sin clientes registrados</p>
        ) : (
          <div className="space-y-3">
            {topClientes.map(c => (
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

      {/* Revenue trend placeholder */}
      <div className="px-6 pb-6 mt-auto">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><TrendingUp size={13} />Revenue del territorio</div>
          <p className="text-xl font-bold text-gray-900">
            {CLIENTES.filter(c => c.territorio === t.nombre)
              .reduce((sum, c) => sum + parseInt(c.revenue.replace(/[$K]/g, '')) * 1000, 0)
              .toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Territory card (grid below map) ──────────────────────────────────────────
function TerritoryCard({ t, selected, onClick }: { t: typeof TERRITORIOS[0]; selected: boolean; onClick: () => void }) {
  const label = scoreLabel(t.score);
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white border rounded-xl p-5 transition-all hover:shadow-md ${
        selected ? 'border-brand-red ring-2 ring-brand-red/20 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{t.nombre}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t.clientes} clientes</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: scoreColor(t.score) }}>{t.score}</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[label]}`}>{label}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
        <span>Alto Riesgo</span>
        <span className="font-semibold text-gray-800">{t.altoRiesgo}</span>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TerritoriosPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [subcanal, setSubcanal] = useState('Todos los subcanales');

  const handlePin = (id: string) => setSelected(prev => prev === id ? null : id);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mapa de Riesgo</h2>
          <p className="text-sm text-gray-500 mt-0.5">Distribución territorial del riesgo de churn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={subcanal}
              onChange={e => setSubcanal(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              {SUBCANALES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={15} />
            Exportar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: map + grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Map card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Legend */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Mapa de Riesgo por Territorio</h3>
              <div className="flex items-center gap-5 text-xs text-gray-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-red inline-block" />Alto (75-100)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />Medio (50-74)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" />Bajo (0-49)</span>
              </div>
            </div>

            {/* Map */}
            <div className="bg-slate-50" style={{ height: 420 }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 1400, center: [-102, 24] }}
                style={{ width: '100%', height: '100%' }}
              >
                <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
                  <Geographies geography={MEX_TOPO}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const terrId = STATE_TO_TERR[geo.properties.name];
                        const terr = TERRITORIOS.find(t => t.id === terrId);
                        const base = terr ? scoreColor(terr.score) : '#E2E8F0';
                        const isSel = !!terr && selected === terr.id;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={base}
                            fillOpacity={isSel ? 0.6 : 0.3}
                            stroke="#FFFFFF"
                            strokeWidth={0.6}
                            onClick={() => terrId && handlePin(terrId)}
                            style={{
                              default: { outline: 'none' },
                              hover:   { outline: 'none', fillOpacity: terr ? 0.5 : 0.3, cursor: terr ? 'pointer' : 'default' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {TERRITORIOS.map(t => {
                    const color  = scoreColor(t.score);
                    const isSelected = selected === t.id;
                    return (
                      <Marker key={t.id} coordinates={[t.lng, t.lat]}>
                        {/* Pulse ring for high risk */}
                        {t.score >= 75 && (
                          <circle r={22} fill={color} fillOpacity={0.15} />
                        )}
                        {/* Pin circle */}
                        <circle
                          r={isSelected ? 20 : 17}
                          fill={color}
                          stroke="white"
                          strokeWidth={isSelected ? 3 : 2}
                          style={{ cursor: 'pointer', transition: 'all 0.2s', filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                          onClick={() => handlePin(t.id)}
                        />
                        {/* Score label */}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize={isSelected ? 11 : 10}
                          fontWeight="700"
                          style={{ cursor: 'pointer', pointerEvents: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}
                        >
                          {t.score}
                        </text>
                        {/* City label */}
                        <text
                          textAnchor="middle"
                          y={isSelected ? 28 : 25}
                          fill="#374151"
                          fontSize={9}
                          fontWeight="600"
                          style={{ pointerEvents: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}
                        >
                          {t.nombre}
                        </text>
                        <text
                          textAnchor="middle"
                          y={isSelected ? 38 : 35}
                          fill="#6B7280"
                          fontSize={8}
                          style={{ pointerEvents: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}
                        >
                          {t.clientes} clientes
                        </text>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>

          {/* Territory grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Todos los Territorios</h3>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {TERRITORIOS
                .slice()
                .sort((a, b) => b.score - a.score)
                .map(t => (
                  <TerritoryCard
                    key={t.id}
                    t={t}
                    selected={selected === t.id}
                    onClick={() => handlePin(t.id)}
                  />
                ))
              }
            </div>
          </div>
        </div>

        {/* Right: detail panel */}
        {selected ? (
          <TerritoryDetail id={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="w-72 shrink-0 bg-white border-l border-gray-200 flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Selecciona un territorio</p>
            <p className="text-xs text-gray-400 mt-1">Haz clic en un pin del mapa o en una tarjeta para ver los detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
