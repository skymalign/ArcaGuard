import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, RefreshCw, Check, AlertCircle } from "lucide-react";
import { CLIENTES } from "../data/clientesData";
import { getAiRecommendation, type AiRecommendation, type AiEstrategia } from "../ai";

interface AccionesIaPageProps {
  clienteId?: string;
  onBack?: () => void;
}

// Datos no presentes en CLIENTES todavía.
const EXTRA: Record<string, { tamano: string; coolers: number }> = {
  "CLI-001": { tamano: "Mediano", coolers: 2 },
};

const RIESGO_BADGE: Record<string, string> = {
  Alto: "bg-red-100 text-brand-red",
  Medio: "bg-amber-100 text-amber-700",
  Bajo: "bg-green-100 text-green-700",
};

function scoreColor(riesgo: string) {
  if (riesgo === "Alto") return "#C8102E";
  if (riesgo === "Medio") return "#F59E0B";
  return "#22C55E";
}

function priorityStyles(priority: string) {
  const p = priority.toLowerCase();

  if (p.includes("alta")) {
    return "bg-red-50 text-brand-red border-red-100";
  }

  if (p.includes("media")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-green-50 text-green-700 border-green-100";
}

function defaultRecommendation(clienteNombre: string): AiRecommendation {
  return {
    diagnostico: `Generando diagnóstico para ${clienteNombre}.`,
    score_interpretacion: "El score representa una probabilidad estimada de churn, no una certeza.",
    factores_principales: [],
    estrategias: [],
    plan_accion: [],
    mensaje_para_vendedor: "",
  };
}

export default function AccionesIaPage({ clienteId = "CLI-001", onBack }: AccionesIaPageProps) {
  const cliente = CLIENTES.find((c) => c.id === clienteId) ?? CLIENTES[0];

  const extra = EXTRA[cliente.id] ?? { tamano: "No disponible", coolers: 0 };

  const [selected, setSelected] = useState(0);
  const [aiData, setAiData] = useState<AiRecommendation>(() =>
    defaultRecommendation(cliente.nombre)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackFactores = useMemo(() => {
    return [
      `${cliente.inactividad} sin actividad`,
      `Cambio de volumen: ${cliente.cambio}%`,
      `Riesgo ${cliente.riesgo.toLowerCase()} según score del modelo`,
    ];
  }, [cliente]);

  async function loadRecommendation() {
    setLoading(true);
    setError(null);

    try {
      const result = await getAiRecommendation(cliente, extra);
      setAiData(result.recommendation);
      setSelected(0);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo generar la recomendación con IA. Intenta de nuevo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente.id]);

  const estrategias = aiData.estrategias ?? [];
  const factores = aiData.factores_principales?.length
    ? aiData.factores_principales.map((f) => `${f.factor}: ${f.explicacion}`)
    : fallbackFactores;

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
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  RIESGO_BADGE[cliente.riesgo]
                }`}
              >
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
              <p className="text-sm text-gray-500 mt-0.5">
                Generadas por IA basadas en el perfil del cliente
              </p>
            </div>

            <button
              onClick={loadRecommendation}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Generando..." : "Regenerar"}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-brand-red rounded-xl p-4 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900">Diagnóstico IA</h4>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{aiData.diagnostico}</p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {aiData.score_interpretacion}
            </p>
          </div>

          {loading && estrategias.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
              La IA está generando estrategias para el cliente...
            </div>
          )}

          {!loading && estrategias.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
              No hay estrategias disponibles todavía. Presiona “Regenerar”.
            </div>
          )}

          {estrategias.map((s, i) => {
            const sel = selected === i;

            return (
              <StrategyCard
                key={`${s.titulo}-${i}`}
                strategy={s}
                selected={sel}
                onClick={() => setSelected(i)}
              />
            );
          })}

          {aiData.plan_accion?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900">Plan de Acción</h4>
              <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                {aiData.plan_accion.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {aiData.mensaje_para_vendedor && (
            <div className="bg-brand-red text-white rounded-xl p-5 shadow-sm">
              <h4 className="font-semibold">Mensaje sugerido para vendedor</h4>
              <p className="text-sm mt-2 leading-relaxed text-white/90">
                “{aiData.mensaje_para_vendedor}”
              </p>
            </div>
          )}
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
              <Field label="Territorio" value={cliente.territorio} />
              <Field label="Revenue estimado" value={cliente.revenue} />

              <div>
                <p className="text-xs text-gray-400">Última compra</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {cliente.inactividadFecha}
                </p>
                <p className="text-xs text-brand-red mt-0.5">
                  {cliente.inactividad} sin actividad
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Cambio de volumen</p>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    cliente.cambio < 0 ? "text-brand-red" : "text-green-600"
                  }`}
                >
                  {cliente.cambio}%
                </p>
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
                style={{
                  width: `${cliente.score}%`,
                  backgroundColor: scoreColor(cliente.riesgo),
                }}
              />
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2">
              Factores principales
            </p>

            <ul className="space-y-1.5 text-sm text-gray-600">
              {factores.map((f, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-gray-300">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategyCard({
  strategy,
  selected,
  onClick,
}: {
  strategy: AiEstrategia;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-5 transition-all ${
        selected
          ? "border-brand-red ring-1 ring-brand-red/20 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-gray-900">{strategy.titulo}</h4>
        {selected && <Check size={18} className="text-brand-red shrink-0 mt-0.5" />}
      </div>

      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{strategy.descripcion}</p>

      <p className="text-sm text-gray-500 mt-3 leading-relaxed">
        <span className="font-medium text-gray-700">Por qué funciona:</span>{" "}
        {strategy.porque_funciona}
      </p>

      <div className="flex items-center gap-3 mt-4 text-xs">
        <span
          className={`px-2.5 py-1 rounded-full border font-semibold ${priorityStyles(
            strategy.prioridad
          )}`}
        >
          Prioridad {strategy.prioridad}
        </span>

        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
          Timeline {strategy.timeline_sugerido}
        </span>
      </div>
    </button>
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