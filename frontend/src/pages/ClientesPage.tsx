import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CLIENTES, type Cliente, type RiskLevel } from '../data/clientesData';
import { territorioChurn, churnColor, NIVELES_RIESGO } from '../data/modelData';

const TOTAL_REAL = NIVELES_RIESGO.reduce(
  (acc, item) => {
    const key = item.name.split(' ')[0].toLowerCase() as 'alto' | 'medio' | 'bajo';
    acc[key] = item.value;
    acc.total += item.value;
    return acc;
  },
  { alto: 0, medio: 0, bajo: 0, total: 0 },
);

function ChurnTerritorioCell({ territorio }: { territorio: string }) {
  const pct = territorioChurn(territorio);
  if (pct == null) return <span className="text-gray-400">—</span>;
  return <span className="font-semibold" style={{ color: churnColor(pct) }}>{pct}%</span>;
}

const RISK_BADGE: Record<RiskLevel, string> = {
  Alto:  'bg-red-100 text-brand-red border border-red-200',
  Medio: 'bg-amber-100 text-amber-700 border border-amber-200',
  Bajo:  'bg-green-100 text-green-700 border border-green-200',
};

const TERRITORIOS = ['Todos los territorios', ...Array.from(new Set(CLIENTES.map(c => c.territorio))).sort()];
const RIESGOS     = ['Todos los riesgos', 'Alto', 'Medio', 'Bajo'];
const SUBCANALES  = ['Todos los subcanales', 'Coca-Cola', 'Monster Energy', 'Powerade', 'Jugos Del Valle', 'Agua Ciel', 'Café del Pacífico'];

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-colors"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Riesgo de Churn tab ───────────────────────────────────────────────────────

function TabRiesgo({ clientes, onPlanIA }: { clientes: Cliente[]; onPlanIA?: (clienteId: string) => void }) {
  const [buscar, setBuscar]   = useState('');
  const [riesgo, setRiesgo]   = useState('Todos los riesgos');
  const [territorio, setTerr] = useState('Todos los territorios');
  const [subcanal, setSub]    = useState('Todos los subcanales');

  const filtered = useMemo(() => clientes.filter(c => {
    const matchBuscar     = c.nombre.toLowerCase().includes(buscar.toLowerCase()) || c.id.toLowerCase().includes(buscar.toLowerCase());
    const matchRiesgo     = riesgo === 'Todos los riesgos' || c.riesgo === riesgo;
    const matchTerritorio = territorio === 'Todos los territorios' || c.territorio === territorio;
    const matchSubcanal   = subcanal === 'Todos los subcanales' || c.subcanalMarca === subcanal;
    return matchBuscar && matchRiesgo && matchTerritorio && matchSubcanal;
  }), [clientes, buscar, riesgo, territorio, subcanal]);

  return (
    <div className="space-y-4">
      {/* Summary pills */}
      <div className="flex items-center gap-4 text-sm flex-wrap">
        <span className="text-gray-500 text-lg">Alto Riesgo: <span className="font-semibold text-brand-red">{TOTAL_REAL.alto.toLocaleString()}</span></span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-lg">Medio Riesgo: <span className="font-semibold text-amber-600">{TOTAL_REAL.medio.toLocaleString()}</span></span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-lg">Bajo Riesgo: <span className="font-semibold text-green-600">{TOTAL_REAL.bajo.toLocaleString()}</span></span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-lg">Total: <span className="font-semibold text-gray-800">{TOTAL_REAL.total.toLocaleString()}</span></span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40 transition-colors"
          />
        </div>
        <Select value={riesgo}     onChange={setRiesgo} options={RIESGOS} />
        <Select value={territorio} onChange={setTerr}   options={TERRITORIOS} />
        <Select value={subcanal}   onChange={setSub}    options={SUBCANALES} />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Inactividad</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Cambio</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Territorio</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Churn Territorio</th>
              <th className="text-right  px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-base text-gray-400">Sin resultados</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-5">
                  <div className="group/cli relative inline-block">
                    <div className="font-semibold text-base text-gray-900">{c.nombre}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{c.id}</div>
                    <div className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden group-hover/cli:block whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 shadow-lg">
                      <span className="text-[10px] text-white/50">customer_id (hash): </span>
                      <span className="text-[11px] font-mono text-white">{c.hash}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{c.score}</span>
                    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${RISK_BADGE[c.riesgo]}`}>{c.riesgo}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-base text-gray-700">{c.inactividad}</div>
                  <div className="text-sm text-gray-400">{c.inactividadFecha}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`font-semibold text-base ${c.cambio < 0 ? 'text-brand-red' : 'text-green-600'}`}>
                    {c.cambio > 0 ? '+' : ''}{c.cambio}%
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="text-base text-gray-700">{c.territorio}</div>
                  <div className="text-sm text-gray-400">{c.subcanalMarca}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center text-base">
                    <ChurnTerritorioCell territorio={c.territorio} />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onPlanIA?.(c.id)}
                      className="px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
                    >
                      Plan IA
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Todos los Clientes tab ────────────────────────────────────────────────────

function TabTodos({ clientes, onPlanIA }: { clientes: Cliente[]; onPlanIA?: (clienteId: string) => void }) {
  const [buscar, setBuscar]   = useState('');
  const [territorio, setTerr] = useState('Todos los territorios');

  const filtered = useMemo(() => clientes.filter(c => {
    const matchBuscar     = c.nombre.toLowerCase().includes(buscar.toLowerCase()) || c.id.toLowerCase().includes(buscar.toLowerCase());
    const matchTerritorio = territorio === 'Todos los territorios' || c.territorio === territorio;
    return matchBuscar && matchTerritorio;
  }), [clientes, buscar, territorio]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40 transition-colors"
          />
        </div>
        <Select value={territorio} onChange={setTerr} options={TERRITORIOS} />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Territorio</th>
              <th className="text-left   px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Segmento</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Churn Territorio</th>
              <th className="text-right  px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-base text-gray-400">Sin resultados</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-5">
                  <div className="group/cli relative inline-block">
                    <div className="font-semibold text-base text-gray-900">{c.nombre}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{c.id}</div>
                    <div className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden group-hover/cli:block whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 shadow-lg">
                      <span className="text-[10px] text-white/50">customer_id (hash): </span>
                      <span className="text-[11px] font-mono text-white">{c.hash}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-base text-gray-700">{c.territorio}</td>
                <td className="px-6 py-5 text-base text-gray-700">{c.segmento}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center text-base">
                    <ChurnTerritorioCell territorio={c.territorio} />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onPlanIA?.(c.id)}
                      className="px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
                    >
                      Plan IA
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = 'riesgo' | 'todos';

interface ClientesPageProps {
  onPlanIA?: (clienteId: string) => void;
}

export default function ClientesPage({ onPlanIA }: ClientesPageProps) {
  const [tab, setTab] = useState<Tab>('riesgo');
  const clientesChurn = CLIENTES.filter(c => c.riesgo !== 'Bajo');

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8 py-7">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {([['riesgo', 'Riesgo de Churn'], ['todos', 'Todos los Clientes']] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-3 text-lg font-medium border-b-2 -mb-px transition-colors ${
                tab === id
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'riesgo'
          ? <TabRiesgo clientes={clientesChurn} onPlanIA={onPlanIA} />
          : <TabTodos  clientes={CLIENTES}      onPlanIA={onPlanIA} />
        }
      </div>
    </div>
  );
}