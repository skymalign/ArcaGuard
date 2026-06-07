import { useState } from 'react';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { Mic, PhoneOff, Loader2 } from 'lucide-react';
import { COACH_AGENT_ID } from '../config/coachIa';

// Una interacción de la conversación (un turno tuyo o del Coach).
export interface Interaccion {
  source: 'user' | 'ai';
  message: string;
  ts: number;
}

interface CoachIAProps {
  /** ID del agente público de ElevenLabs. Por defecto, el del config. */
  agentId?: string;
  /** Texto contextual opcional (p. ej. el cliente con el que se practica). */
  contexto?: string;
  /** Se llama por cada turno (tuyo o del Coach) durante la conversación. */
  onInteraction?: (interaccion: Interaccion) => void;
}

/**
 * Coach IA por voz usando el SDK @elevenlabs/react.
 * Es un componente autocontenido: incluye su propio <ConversationProvider>,
 * así que se puede soltar en cualquier parte de la app.
 * Para agentes PÚBLICOS no necesita backend ni API key.
 */
export default function CoachIA({ agentId = COACH_AGENT_ID, contexto, onInteraction }: CoachIAProps) {
  return (
    <ConversationProvider agentId={agentId} connectionType="webrtc">
      <CoachIAControls contexto={contexto} onInteraction={onInteraction} />
    </ConversationProvider>
  );
}

// Estado de conexión → etiqueta + colores
const STATUS_UI: Record<string, { label: string; dot: string; text: string }> = {
  disconnected: { label: 'Desconectado',       dot: 'bg-gray-400',                text: 'text-gray-500' },
  connecting:   { label: 'Conectando…',         dot: 'bg-amber-500 animate-pulse', text: 'text-amber-600' },
  connected:    { label: 'Conectado',           dot: 'bg-green-500',               text: 'text-green-600' },
  error:        { label: 'Error de conexión',   dot: 'bg-brand-red',               text: 'text-brand-red' },
};

function CoachIAControls({
  contexto,
  onInteraction,
}: {
  contexto?: string;
  onInteraction?: (i: Interaccion) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const { status, isSpeaking, startSession, endSession } = useConversation({
    onConnect: () => setError(null),
    onMessage: ({ source, message }) => onInteraction?.({ source, message, ts: Date.now() }),
    onError: (message) => {
      console.error('[CoachIA]', message);
      setError('Ocurrió un error en la conversación. Inténtalo de nuevo.');
    },
  });

  const activa = status === 'connected' || status === 'connecting';
  const ui = STATUS_UI[status] ?? STATUS_UI.disconnected;

  const iniciar = async () => {
    setError(null);
    try {
      // Pedimos el micrófono primero para dar un error claro si se deniega.
      await navigator.mediaDevices.getUserMedia({ audio: true });
      startSession();
    } catch {
      setError('No se pudo acceder al micrófono. Revisa los permisos del navegador.');
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Estado de la conexión */}
      <div className={`flex items-center gap-2 text-sm font-medium ${ui.text}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${ui.dot}`} />
        {ui.label}
        {status === 'connected' && (
          <span className="text-gray-400 font-normal">
            · {isSpeaking ? 'Coach hablando…' : 'Escuchando…'}
          </span>
        )}
      </div>

      {/* Botón único iniciar / terminar */}
      <button
        onClick={activa ? endSession : iniciar}
        aria-label={activa ? 'Terminar conversación' : 'Iniciar conversación'}
        className={`mt-6 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
          activa ? 'bg-gray-800 hover:bg-gray-900' : 'bg-brand-red hover:bg-brand-dark'
        } ${status === 'connected' && isSpeaking ? 'ring-4 ring-brand-red/25' : ''}`}
      >
        {status === 'connecting' ? (
          <Loader2 size={28} className="animate-spin" />
        ) : activa ? (
          <PhoneOff size={26} />
        ) : (
          <Mic size={28} />
        )}
      </button>

      <p className="mt-4 text-sm font-semibold text-gray-800">
        {activa ? 'Terminar conversación' : 'Iniciar conversación'}
      </p>
      {contexto && !activa && <p className="text-xs text-gray-400 mt-1">{contexto}</p>}

      {error && <p className="mt-4 text-xs text-brand-red max-w-xs">{error}</p>}
    </div>
  );
}
