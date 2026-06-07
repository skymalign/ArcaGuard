import type { Cliente } from "./data/clientesData";


export interface AiFactor {
  factor: string;
  explicacion: string;
}

export interface AiEstrategia {
  titulo: string;
  descripcion: string;
  porque_funciona: string;
  prioridad: "alta" | "media" | "baja" | string;
  timeline_sugerido: "inmediato" | "1 semana" | "2-3 semanas" | "1 mes" | "3 meses" | string;
}

export interface AiRecommendation {
  diagnostico: string;
  score_interpretacion: string;
  factores_principales: AiFactor[];
  estrategias: AiEstrategia[];
  plan_accion: string[];
  mensaje_para_vendedor: string;
}

interface ApiResponse {
  source: string;
  customer_id?: string;
  recommendation: AiRecommendation;
  error?: string;
}

// Ensure all are smaller letters 
function normalizeRisk(riesgo: Cliente["riesgo"]) {
  if (riesgo === "Alto") return "alto";
  if (riesgo === "Medio") return "medio";
  return "bajo";
}

// Extracts just part of the date 
function parseMonths(inactividad: string) {
  const match = inactividad.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

export async function getAiRecommendation(
  cliente: Cliente,
  extra: { tamano: string; coolers: number }
): Promise<ApiResponse> {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  const payload = {
    customer_id: cliente.hash,
    churn_proba: cliente.score / 100,
    target: cliente.riesgo === "Alto" ? 1 : 0,
    nivel_riesgo: normalizeRisk(cliente.riesgo),

    // Datos aproximados disponibles desde tu interfaz actual
    recency: parseMonths(cliente.inactividad),
    tx_ratio_1_3: cliente.cambio < 0 ? 1 + cliente.cambio / 100 : undefined,
    tx_drop_3: cliente.cambio < 0 ? Math.abs(cliente.cambio) : undefined,

    num_coolers_last: extra.coolers,
    tiene_cooler: extra.coolers > 0 ? 1 : 0,

    territory_d: cliente.territorio,
    comercial_subchannel_d: cliente.segmento,
    rtm_customer_size_d: extra.tamano,

    // Campos útiles para Gemini aunque no estén en el modelo exacto
    frontend_context: {
        cliente_id_visible: cliente.id,
        nombre: cliente.nombre,
        segmento: cliente.segmento,
        subcanalMarca: cliente.subcanalMarca,
        revenue: cliente.revenue,
        inactividad: cliente.inactividad,
        inactividadFecha: cliente.inactividadFecha,
        cambio_volumen_pct: cliente.cambio,
    },
  };

  // Call endpoint
  const response = await fetch(`${apiUrl}/recommendation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo generar el plan IA");
  }

  return response.json();
}