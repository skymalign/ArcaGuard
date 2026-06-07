import { useState } from 'react';
import { ChevronLeft, Phone, PhoneOff } from 'lucide-react';
import { CLIENTES } from '../data/clientesData';

interface CentroVozPageProps {
  clienteId?: string;
  onBack?: () => void;
}

const TELEFONOS: Record<string, string> = {
  'CLI-001': '+52 55 1234 5678',
};

const HISTORIAL = [
  {
    fecha: '2026-06-05 14:30',
    sentimiento: 'Neutral',
    duracion: '4:32',
    nota: 'Cliente cambió a competencia por precio. Abierto a retomar si mejoramos condiciones.',
  },
];

const SCRIPT = [
  'Saludo personalizado',
  'Mencionar inactividad',
  'Preguntar por competencia',
  'Ofrecer promoción exclusiva',
  'Agendar visita ejecutivo',
];

const SENT_BADGE: Record<string, string> = {
  Positivo: 'bg-green-100 text-green-700',
  Neutral:  'bg-gray-100 text-gray-600',
  Negativo: 'bg-red-100 text-brand-red',
};

const RIESGO_BADGE: Record<string, string> = {
  Alto:  'bg-red-100 text-brand-red',
  Medio: 'bg-amber-100 text-amber-700',
  Bajo:  'bg-green-100 text-green-700',
};

export default function CentroVozPage({ clienteId = 'CLI-001', onBack }: CentroVozPageProps) {
  const cliente = CLIENTES.find((c) => c.id === clienteId) ?? CLIENTES[0];
  const [enLlamada, setEnLlamada] = useState(false);
  const telefono = TELEFONOS[cliente.id] ?? '+52 55 0000 0000';

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
        <h2 className="text-2xl font-bold text-gray-900">Centro de Voz IA</h2>
        <p className="text-sm text-gray-500 mt-0.5">Llamadas con análisis en tiempo real</p>
      </div>

      {/* Content */}
      <div className="px-8 py-7 grid grid-cols-3 gap-6">
        {/* Left: call card */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-center px-8 py-16">
            <div className="relative">
              {enLlamada && (
                <span className="absolute inset-0 rounded-2xl bg-brand-red/20 animate-ping" />
              )}
              <div
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center ${
                  enLlamada ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Phone size={30} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6">{cliente.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1">{telefono}</p>
            <p className={`text-sm mt-1 ${enLlamada ? 'text-brand-red font-medium' : 'text-gray-400'}`}>
              {enLlamada ? 'En llamada…' : 'Listo para llamar'}
            </p>

            <button
              onClick={() => setEnLlamada((v) => !v)}
              className={`flex items-center gap-2 mt-8 px-6 py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors ${
                enLlamada
                  ? 'bg-gray-800 hover:bg-gray-900 text-white'
                  : 'bg-brand-red hover:bg-brand-dark text-white'
              }`}
            >
              {enLlamada ? <PhoneOff size={16} /> : <Phone size={16} />}
              {enLlamada ? 'Finalizar Llamada' : 'Iniciar Llamada'}
            </button>
          </div>
        </div>

        {/* Right: panels */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Cliente</h3>
            <div className="space-y-3.5">
              <div>
                <p className="text-xs text-gray-400">ID</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{cliente.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Territorio</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{cliente.territorio}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Score de riesgo</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-gray-900">{cliente.score}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${RIESGO_BADGE[cliente.riesgo]}`}>
                    {cliente.riesgo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de Llamadas */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Historial de Llamadas</h3>
            {HISTORIAL.map((h) => (
              <div key={h.fecha}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{h.fecha}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SENT_BADGE[h.sentimiento]}`}>
                    {h.sentimiento}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{h.duracion}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{h.nota}</p>
              </div>
            ))}
          </div>

          {/* Script Sugerido */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Script Sugerido</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              {SCRIPT.map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="text-gray-400">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
