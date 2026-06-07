import { Download, FileText } from 'lucide-react';

// ── Datos ──────────────────────────────────────────────────────────────────────
const KPIS = [
  { label: 'Clientes Contactados', value: '24' },
  { label: 'Retenciones Exitosas', value: '19', sub: '79% conversión' },
  { label: 'Revenue Recuperado',   value: '$1.9M' },
  { label: 'Respuesta Positiva',   value: '68%' },
];

const LISTA_PRIORIZADA = [
  { rank: 1, cliente: 'Distribuidora López',      score: 94, revenue: '$456K', accion: 'Visita urgente programada' },
  { rank: 2, cliente: 'Super Abarrotes El Güero', score: 92, revenue: '$340K', accion: 'Llamada agendada para hoy' },
  { rank: 3, cliente: 'Abarrotes San Judas',      score: 89, revenue: '$289K', accion: 'Propuesta enviada' },
  { rank: 4, cliente: 'Tienda La Esperanza',      score: 87, revenue: '$125K', accion: 'Pendiente contacto' },
  { rank: 5, cliente: 'Taquería El Tizoncito',    score: 82, revenue: '$112K', accion: 'Seguimiento en 3 días' },
];

const REPORTES_SEMANALES = [
  { semana: 'Semana 23 (Jun 2026)', fecha: 'Generado 05 Jun 2026', estado: 'Generado' },
  { semana: 'Semana 22 (Jun 2026)', fecha: 'Generado 29 May 2026', estado: 'Generado' },
  { semana: 'Semana 21 (May 2026)', fecha: 'Generado 22 May 2026', estado: 'Generado' },
];

const IMPACTO = [
  { label: 'Clientes Retenidos',   value: '19',    highlight: true },
  { label: 'Revenue Protegido',    value: '$1.9M', highlight: false },
  { label: 'Tasa de Conversión',   value: '79%',   highlight: false },
  { label: 'Acciones Completadas', value: '24',    highlight: false },
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
                <th className="px-6 py-3 font-semibold">Revenue</th>
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
                      <span className="text-sm font-semibold text-gray-800">{c.cliente}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{c.score}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-brand-red">Alto</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{c.revenue}</td>
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
