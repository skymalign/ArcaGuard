import { useState } from 'react';
import { ChevronLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { CLIENTES } from '../data/clientesData';
import { COACH_PUBLIC_URL } from '../config/coachIa';
import CoachIA, { type Interaccion } from '../components/CoachIA';

interface CentroVozPageProps {
  clienteId?: string;
  onBack?: () => void;
}

const HISTORIAL = [
  {
    fecha: '2026-06-05 14:30',
    sentimiento: 'Neutral',
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

export default function CentroVozPage({ clienteId = 'CLI-001', onBack }: CentroVozPageProps) {
  const cliente = CLIENTES.find((c) => c.id === clienteId) ?? CLIENTES[0];
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);

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
        <p className="text-sm text-gray-500 mt-0.5">Practica la conversación de retención con el Coach IA</p>
      </div>

      {/* Content */}
      <div className="px-8 py-7 grid grid-cols-3 gap-6">
        {/* Left: Coach IA card */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-center px-8 py-16">
            <h3 className="text-xl font-bold text-gray-900">Coach IA de Retención</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Ensaya por voz la conversación con{' '}
              <span className="font-semibold text-gray-700">{cliente.nombre}</span>{' '}
              antes de contactarlo. El Coach IA responde en tiempo real.
            </p>

            {/* Coach IA por voz con el SDK de ElevenLabs (in-app, sin backend) */}
            <div className="mt-8">
              <CoachIA
                contexto={`Practicando retención con ${cliente.nombre}`}
                onInteraction={(i) => setInteracciones((prev) => [...prev, i])}
              />
            </div>

            {/* Alternativa: abrir el agente en una pestaña nueva */}
            <a
              href={COACH_PUBLIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 mt-8 text-sm text-gray-500 hover:text-brand-red transition-colors"
            >
              <ExternalLink size={14} />
              Abrir el Coach en una pestaña nueva
            </a>
          </div>
        </div>

        {/* Right: panels de contexto */}
        <div className="space-y-6">
          {/* Interacciones del Coach IA (en vivo, vía onMessage del SDK) */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">Última interacción</h3>
              {interacciones.length > 0 && (
                <button
                  onClick={() => setInteracciones([])}
                  className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            {interacciones.length === 0 ? (
              <>
                {HISTORIAL.map((h) => (
                  <div key={h.fecha}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{h.fecha}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SENT_BADGE[h.sentimiento]}`}>
                        {h.sentimiento}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{h.nota}</p>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-3">
                  Las interacciones con el Coach IA aparecerán aquí en vivo al iniciar la conversación.
                </p>
              </>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {interacciones.map((it, i) => (
                  <div key={`${it.ts}-${i}`} className={it.source === 'user' ? 'text-right' : 'text-left'}>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {it.source === 'user' ? 'Tú' : 'Coach IA'}
                    </span>
                    <p
                      className={`mt-0.5 inline-block px-3 py-1.5 rounded-lg text-sm ${
                        it.source === 'user' ? 'bg-brand-red/10 text-gray-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {it.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guía sugerida */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-gray-400" />
              <h3 className="text-base font-semibold text-gray-800">Guía sugerida</h3>
            </div>
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
