import { Download, FileText } from 'lucide-react';
import { CLIENTES } from '../data/clientesData';
import { territorioChurn, churnColor } from '../data/modelData';

// ── Datos ──────────────────────────────────────────────────────────────────────
// KPIs reales del modelo / negocio (reports/charts.json).
const KPIS = [
  { label: 'Clientes en Alto Riesgo',   value: '10,276' },
  { label: 'Recall @ Top 10%',          value: '87%',    sub: 'lift 8.7×' },
  { label: 'Revenue en Riesgo / mes',   value: '$12.0M' },
  { label: 'Direccionable (Top 10%)',   value: '$10.5M' },
];

// Lista priorizada derivada de los clientes en seguimiento (top por score).
const ACCIONES = ['Visita urgente programada', 'Llamada agendada para hoy', 'Propuesta enviada', 'Pendiente contacto', 'Seguimiento en 3 días'];
const LISTA_PRIORIZADA = [...CLIENTES]
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map((c, i) => ({ rank: i + 1, cliente: c.nombre, hash: c.hash, score: c.score, territorio: c.territorio, accion: ACCIONES[i] ?? 'Seguimiento programado' }));

const REPORTES_SEMANALES = [
  { semana: 'Semana 23 (Jun 2026)', fecha: 'Generado 05 Jun 2026', estado: 'Generado' },
  { semana: 'Semana 22 (Jun 2026)', fecha: 'Generado 29 May 2026', estado: 'Generado' },
  { semana: 'Semana 21 (May 2026)', fecha: 'Generado 22 May 2026', estado: 'Generado' },
];

const IMPACTO = [
  { label: 'Clientes en alto riesgo', value: '10,276', highlight: false },
  { label: 'Revenue direccionable',   value: '$10.5M', highlight: true },
  { label: 'Recall @ Top 10%',        value: '87%',    highlight: true },
  { label: 'Lift vs. azar',           value: '8.7×',   highlight: false },
];

// ── Página ──────────────────────────────────────────────────────────────────────
export default function TendenciasPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8 py-7 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
            <p className="text-sm text-gray-500 mt-0.5">Seguimiento de acciones y resultados</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-brand-dark text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
            <Download size={16} />
            Generar Reporte
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-5">
          {KPIS.map((k) => (
            <div key={k.label} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">{k.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{k.value}</p>
              {k.sub && <p className="text-xs font-medium text-green-600 mt-1">{k.sub}</p>}
            </div>
          ))}
        </div>

        {/* Lista Priorizada */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Lista Priorizada · Esta Semana</h3>
            <button className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={14} />
              Exportar
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Cliente</th>
                <th className="px-6 py-3 font-semibold">Score</th>
                <th className="px-6 py-3 font-semibold">Territorio</th>
                <th className="px-6 py-3 font-semibold">Acción</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {LISTA_PRIORIZADA.map((c) => (
                <tr key={c.rank} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 w-3">{c.rank}</span>
                      <span className="group/cli relative">
                        <span className="text-sm font-semibold text-gray-800">{c.cliente}</span>
                        <span className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden group-hover/cli:block whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 shadow-lg">
                          <span className="text-[10px] text-white/50">customer_id (hash): </span>
                          <span className="text-[11px] font-mono text-white">{c.hash}</span>
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{c.score}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-brand-red">Alto</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {c.territorio}
                    {territorioChurn(c.territorio) != null && (
                      <span className="ml-2 text-xs font-semibold" style={{ color: churnColor(territorioChurn(c.territorio)!) }}>
                        {territorioChurn(c.territorio)}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.accion}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-1.5 bg-brand-red hover:bg-brand-dark text-white rounded-md text-sm font-semibold transition-colors">
                      Ver Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Reportes Semanales */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-base font-semibold text-gray-800">Reportes Semanales</h3>
            </div>
            <div>
              {REPORTES_SEMANALES.map((r) => (
                <div key={r.semana} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.semana}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.fecha}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {r.estado}
                    </span>
                    <button className="text-gray-400 hover:text-brand-red transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impacto de Acciones */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Impacto de Acciones</h3>
            <div>
              {IMPACTO.map((m) => (
                <div key={m.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{m.label}</span>
                  <span className={`text-xl font-bold ${m.highlight ? 'text-green-600' : 'text-gray-900'}`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
