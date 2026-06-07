import { useState } from 'react';
import { ChevronLeft, RefreshCw, Check } from 'lucide-react';
import { CLIENTES } from '../data/clientesData';

interface AccionesIaPageProps {
  clienteId?: string;
  onBack?: () => void;
}

// Datos no presentes en CLIENTES (tamaño / coolers), por cliente.
const EXTRA: Record<string, { tamano: string; coolers: number }> = {
  'CLI-001': { tamano: 'Mediano', coolers: 2 },
};

// Estrategias recomendadas por IA (mock).
const ESTRATEGIAS = [
  {
    titulo: 'Reactivación con promoción exclusiva',
    desc: 'Oferta especial de Coca-Cola con descuento del 15% en la primera compra de retorno más cooler adicional sin costo.',
    roi: '185%', inversion: '$8.5K', timeline: '2-3 semanas',
  },
  {
    titulo: 'Programa de lealtad acelerado',
    desc: 'Inscripción inmediata en programa Premium con puntos 2x durante 3 meses y beneficios exclusivos.',
    roi: '142%', inversion: '$12.0K', timeline: '1 mes',
  },
  {
    titulo: 'Mix de productos estratégico',
    desc: 'Diversificación de portafolio añadiendo Monster Energy y Powerade con margen preferencial.',
    roi: '167%', inversion: '$9.8K', timeline: '3-4 semanas',
  },
];

const RIESGO_BADGE: Record<string, string> = {
  Alto:  'bg-red-100 text-brand-red',
  Medio: 'bg-amber-100 text-amber-700',
  Bajo:  'bg-green-100 text-green-700',
};

function scoreColor(riesgo: string) {
  if (riesgo === 'Alto') return '#C8102E';
  if (riesgo === 'Medio') return '#F59E0B';
  return '#22C55E';
}

export default function AccionesIaPage({ clienteId = 'CLI-001', onBack }: AccionesIaPageProps) {
  const cliente = CLIENTES.find((c) => c.id === clienteId) ?? CLIENTES[0];
  const [selected, setSelected] = useState(0);

  const extra = EXTRA[cliente.id] ?? { tamano: 'Mediano', coolers: 2 };
  const mesesInactivo = cliente.inactividad.replace(/ mes(es)?/, '');
  const factores = [
    `${mesesInactivo}+ meses inactivo`,
    `Caída de ${Math.abs(cliente.cambio)}% en volumen`,
    'Disminución de engagement',
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 pt-5 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
        >
          <ChevronLeft size={16} />
          Volver a clientes
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{cliente.nombre}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${RIESGO_BADGE[cliente.riesgo]}`}>
                {cliente.riesgo} Riesgo
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {cliente.id} · {cliente.territorio} · Score {cliente.score}/100
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Probabilidad de churn</p>
            <p className="text-3xl font-bold text-brand-red mt-0.5">{cliente.score}%</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-7 grid grid-cols-3 gap-6">
        {/* Left: estrategias */}
        <div className="col-span-2 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Estrategias Recomendadas</h3>
              <p className="text-sm text-gray-500 mt-0.5">Generadas por IA basadas en el perfil del cliente</p>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} />
              Regenerar
            </button>
          </div>

          {ESTRATEGIAS.map((s, i) => {
            const sel = selected === i;
            return (
              <button
                key={s.titulo}
                onClick={() => setSelected(i)}
                className={`w-full text-left bg-white border rounded-xl p-5 transition-all ${
                  sel ? 'border-brand-red ring-1 ring-brand-red/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-gray-900">{s.titulo}</h4>
                  {sel && <Check size={18} className="text-brand-red shrink-0 mt-0.5" />}
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <span className="text-gray-400">ROI <span className="font-semibold text-green-600">{s.roi}</span></span>
                  <span className="text-gray-400">Inversión <span className="font-semibold text-gray-800">{s.inversion}</span></span>
                  <span className="text-gray-400">Timeline <span className="font-semibold text-gray-800">{s.timeline}</span></span>
                </div>
              </button>
            );
          })}

          <button className="w-full py-3.5 bg-brand-red hover:bg-brand-dark text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
            Generar Plan de Acción
          </button>
        </div>

        {/* Right: info + riesgo */}
        <div className="space-y-6">
          {/* Información del Cliente */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Información del Cliente</h3>
            <div className="space-y-3.5">
              <Field label="Segmento" value={cliente.segmento} />
              <Field label="Producto principal" value={cliente.subcanalMarca} />
              <Field label="Tamaño" value={extra.tamano} />
              <Field label="Coolers activos" value={String(extra.coolers)} />
              <div>
                <p className="text-xs text-gray-400">Última compra</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{cliente.inactividadFecha}</p>
                <p className="text-xs text-brand-red mt-0.5">{cliente.inactividad} sin actividad</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Cambio de volumen</p>
                <p className="text-sm font-semibold text-brand-red mt-0.5">{cliente.cambio}%</p>
              </div>
            </div>
          </div>

          {/* Análisis de Riesgo */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Análisis de Riesgo</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Score de churn</span>
              <span className="font-bold text-gray-900">{cliente.score}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full"
                style={{ width: `${cliente.score}%`, backgroundColor: scoreColor(cliente.riesgo) }}
              />
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2">
              Factores principales
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {factores.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gray-300">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
