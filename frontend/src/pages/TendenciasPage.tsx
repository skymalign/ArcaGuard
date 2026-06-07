import { CLIENTES } from '../data/clientesData';
import { KPIS, RECALL_TOPK, territorioChurn, churnColor } from '../data/modelData';

// ── Datos ──────────────────────────────────────────────────────────────────────
const top10Lift = RECALL_TOPK.find((row) => row.k === '10%')?.lift ?? 8.7;

const KPI_CARDS = [
  { label: 'Clientes en Alto Riesgo', value: KPIS.clientesRiesgoAlto.toLocaleString('es-MX'), sub: `${((KPIS.clientesRiesgoAlto / KPIS.clientesEvaluados) * 100).toFixed(1)}% del total` },
  { label: 'Recall @ Top 10%', value: `${Math.round(KPIS.recallTop10 * 100)}%`, sub: `lift ${top10Lift}×` },
  { label: 'Revenue en Riesgo / mes', value: `$${(KPIS.mxnPerdidosMes / 1_000_000).toFixed(1)}M` },
  { label: 'Direccionable (Top 10%)', value: `$${(KPIS.mxnDireccionableTop10 / 1_000_000).toFixed(1)}M` },
];

// Lista priorizada derivada de los clientes en seguimiento (top por score).
const ACCIONES = ['Visita urgente programada', 'Llamada agendada para hoy', 'Propuesta enviada', 'Pendiente contacto', 'Seguimiento en 3 días'];
const LISTA_PRIORIZADA = [...CLIENTES]
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map((c, i) => ({ rank: i + 1, cliente: c.nombre, hash: c.hash, score: c.score, territorio: c.territorio, accion: ACCIONES[i] ?? 'Seguimiento programado' }));

const recall10 = RECALL_TOPK.find((row) => row.k === '10%') ?? RECALL_TOPK[0];
const compareK = RECALL_TOPK.filter((row) => ['1%', '2%', '5%', '10%', '20%'].includes(row.k));

// ── Página ──────────────────────────────────────────────────────────────────────
export default function TendenciasPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8 py-7 space-y-6">

        {/* Header */}
        
          
        

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-5">
          {KPI_CARDS.map((k) => (
            <div key={k.label} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">{k.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{k.value}</p>
              {k.sub && <p className="text-xs font-medium text-green-600 mt-1">{k.sub}</p>}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-fit">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Lista Priorizada · Esta Semana</h3>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Score</th>
                  <th className="px-6 py-3 font-semibold">Territorio</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Comparativa de K</h3>
                <p className="text-sm text-gray-500">Recalls y lift para K=1%, 2%, 5%, 10%, 20%.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-brand-red/10 px-3 py-1 text-sm font-semibold text-brand-red">
                {recall10.k}
              </span>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 mb-4">
              <p className="text-sm text-gray-500">Top 10% seleccionado</p>
              <p className="text-3xl font-bold text-gray-900">{recall10.recall}%</p>
              <p className="text-sm text-gray-500 mt-1">Lift {recall10.lift.toFixed(2)}× · {recall10.contactados.toLocaleString('es-MX')} contactados</p>
            </div>

            <div className="grid gap-3">
              {compareK.map((row) => (
                <div key={row.k} className={`rounded-xl p-4 ${row.k === '10%' ? 'bg-brand-red/10 border border-brand-red' : 'bg-white border border-gray-200'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{row.k}</p>
                      <p className="text-xs text-gray-500">Recall / Lift</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{row.recall}%</p>
                      <p className="text-sm text-gray-500">{row.lift.toFixed(2)}×</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
