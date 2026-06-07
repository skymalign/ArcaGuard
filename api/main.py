import os
import json
import logging
import time
from collections import defaultdict, deque
from threading import Lock
from typing import Optional, Any, Dict, Deque, DefaultDict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from google import genai

# Run w uvicorn api.main:app --reload --port 8000
load_dotenv(".env") # At project root

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
FRONTEND_ORIGINS = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
API_SHARED_KEY = os.getenv("API_SHARED_KEY")
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
MAX_REQUEST_BYTES = int(os.getenv("MAX_REQUEST_BYTES", "50000"))


def parse_origins(origins: str) -> list[str]:
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

app = FastAPI(title="Churn Hunter AI API")
allowed_origins = parse_origins(FRONTEND_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials="*" not in allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

request_history: DefaultDict[str, Deque[float]] = defaultdict(deque)
request_history_lock = Lock()


def get_request_identifier(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def validate_api_key(request: Request) -> None:
    if not API_SHARED_KEY:
        return
    if request.headers.get("x-api-key") != API_SHARED_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key.",
        )


@app.middleware("http")
async def protect_api(request: Request, call_next):
    if request.url.path == "/recommendation":
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_REQUEST_BYTES:
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={"source": "service_protection", "error": "Request body too large."},
                    )
            except ValueError:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"source": "service_protection", "error": "Invalid Content-Length header."},
                )

        requester = get_request_identifier(request)
        now = time.time()
        with request_history_lock:
            window = request_history[requester]
            while window and now - window[0] > 60:
                window.popleft()
            if len(window) >= RATE_LIMIT_PER_MINUTE:
                return JSONResponse(status_code=status.HTTP_429_TOO_MANY_REQUESTS, content={
                    "source": "service_protection",
                    "error": "Too many requests. Please retry shortly.",
                })
            window.append(now)

    return await call_next(request)


# What the python will look like 
class CustomerRiskRequest(BaseModel):
    customer_id: str
    churn_proba: Optional[float] = None
    target: Optional[int] = None
    nivel_riesgo: Optional[str] = None

    recency: Optional[float] = None
    tenure: Optional[float] = None

    tx_lag1: Optional[float] = None
    tx_lag2: Optional[float] = None
    tx_lag3: Optional[float] = None
    bx_lag1: Optional[float] = None
    bx_lag2: Optional[float] = None

    tx_mean_3: Optional[float] = None
    tx_mean_6: Optional[float] = None
    tx_mean_12: Optional[float] = None
    bx_mean_3: Optional[float] = None
    bx_mean_6: Optional[float] = None

    tx_ratio_1_3: Optional[float] = None
    bx_ratio_1_3: Optional[float] = None
    tx_drop_3: Optional[float] = None
    tx_slope_3: Optional[float] = None

    meses_activos_3: Optional[float] = None
    meses_activos_6: Optional[float] = None
    pct_ceros_3: Optional[float] = None
    pct_ceros_6: Optional[float] = None

    num_coolers_last: Optional[float] = None
    num_doors_last: Optional[float] = None
    coolers_drop_3: Optional[float] = None
    tiene_cooler: Optional[float] = None

    territory_d: Optional[str] = None
    comercial_subchannel_d: Optional[str] = None
    rtm_customer_size_d: Optional[str] = None


def build_prompt(customer: CustomerRiskRequest) -> str:
    data = customer.model_dump() # Client data raw 
    # Key actions, modify depending on arca actions 
    acciones_permitidas = """
    Acciones comerciales permitidas:
    - Llamada de seguimiento
    - Revisión de inventario
    - Promoción de recuperación
    - Evaluación de instalación de cooler
    - Revisión de desempeño del cooler
    - Paquete de recompra basado en historial
    - Escalamiento a supervisor de territorio
    """

    return f"""Eres un asistente de IA para el equipo de retención comercial de Arca Continental donde un integrfante del equipo de retención ya seleccionó un cliente de un panel de riesgo de abandono (ya sea alto, mediano o bajo).

    Contexto del negocio:
        - Churn significa que el cliente pasa un mes sin comprar.
        - El modelo predice la probabilidad de churn del siguiente mes.
        - La recomendación debe ayudar a prevenir el abandono antes de que ocurra.
        - Los datos disponibles pueden incluir comportamiento reciente de compra, tendencia de transacciones, cajas vendidas, coolers, territorio, subcanal y tamaño del cliente.

    Datos del cliente:
    {data}

    Instrucciones:
    1. Genera recomendaciones personalizadas para este cliente usando SOLO los datos proporcionados.
    2. No inventes productos, descuentos, ROI, inversión, fechas, visitas pasadas ni causas externas si no están en los datos. 
    3. Si un dato no está disponible, no lo menciones.
    4. Explica el riesgo en términos simples para un gerente comercial.
    5. Identifica las principales señales de riesgo observables.
    6. Sugiere acciones concretas, realistas y accionables para reducir churn. 
    7. Las acciones deben estar relacionadas con señales como:
    - caída de transacciones
    - caída de cajas vendidas
    - baja actividad reciente
    - ausencia o pérdida de coolers
    - reducción en puertas de coolers
    - territorio de alto riesgo
    - tamaño de cliente
    - subcanal con mayor volatilidad
    Usa preferentemente estas acciones comerciales:
    {acciones_permitidas}
    8. Responde en español.
    9. Devuelve únicamente un JSON válido, sin markdown.

    Formato exacto de respuesta, con un máximo de tres estrategias sugeridas: 
    {{
    "diagnostico": "Resumen breve del nivel de riesgo del cliente.",
    "score_interpretacion": "Explicación breve de lo que significa el score de churn.",
    "factores_principales": [
        {{
        "factor": "Nombre del factor",
        "explicacion": "Por qué aumenta el riesgo según los datos."
        }}
    ],
    "estrategias": [
        {{
        "titulo": "Nombre corto de la estrategia",
        "descripcion": "Acción comercial concreta.",
        "porque_funciona": "Relación entre la acción y el factor de riesgo.",
        "prioridad": "alta | media | baja",
        "timeline_sugerido": "inmediato | 1 semana | 2-3 semanas | 1 mes | 3 meses"
        }}
    ],
    "plan_accion": [
        "Paso 1 concreto",
        "Paso 2 concreto",
        "Paso 3 concreto"
    ],
    "mensaje_para_vendedor": "Mensaje breve que el ejecutivo comercial podría usar al contactar al cliente."
    }}
    """


def fallback_recommendation(customer: CustomerRiskRequest) -> Dict[str, Any]:
    drivers = []
    actions = []

    if customer.nivel_riesgo == "alto":
        drivers.append("El cliente está clasificado como alto riesgo por el modelo.")
        actions.append("Priorizar contacto comercial directo en la próxima campaña de retención.")

    if customer.tx_ratio_1_3 is not None and customer.tx_ratio_1_3 < 0.5:
        drivers.append("Las transacciones recientes están por debajo de su promedio reciente.")
        actions.append("Revisar caída de pedidos y ofrecer reposición o paquete promocional.")

    if customer.tx_drop_3 is not None and customer.tx_drop_3 > 0:
        drivers.append("Existe una caída de transacciones frente a la media de los últimos meses.")

    if customer.recency is not None and customer.recency >= 1:
        drivers.append("El cliente muestra señales de baja actividad reciente.")
        actions.append("Agendar llamada o visita para validar inventario, competencia y necesidades.")

    if customer.tiene_cooler is not None and customer.tiene_cooler == 0:
        drivers.append("El cliente no tiene cooler registrado.")
        actions.append("Evaluar instalación de cooler si el punto de venta tiene potencial.")

    if customer.rtm_customer_size_d in ["Mini", "Pequeño"]:
        drivers.append("El cliente pertenece a un segmento pequeño, que suele ser más volátil.")
        actions.append("Aplicar campaña de seguimiento preventivo para clientes pequeños.")

    if not drivers:
        drivers.append("No hay suficientes variables explicativas específicas en la fila enviada.")

    if not actions:
        actions = [
            "Monitorear evolución de compras el próximo mes.",
            "Mantener frecuencia normal de visita.",
            "Revisar si existen cambios en inventario o surtido.",
        ]

    return {
        "source": "fallback_rules",
        "recommendation": {
            "diagnostico": f"Cliente {customer.customer_id} con riesgo {customer.nivel_riesgo or 'no especificado'}.",
            "senales_riesgo": drivers[:5],
            "acciones_recomendadas": actions[:3],
            "prioridad": customer.nivel_riesgo or "sin clasificar",
        },
    }


# Yeets it to the server 
async def call_llm(customer: CustomerRiskRequest) -> Dict[str, Any]:
    # No es gemini, truena todo 
    if not GEMINI_API_KEY or client is None:
        raise RuntimeError("Missing GEMINI_API_KEY in .env")

    prompt = build_prompt(customer)  

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    raw_text = response.text.strip()

    # Removes los ```json ... ``` de markdown
    if raw_text.startswith("```json"):
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
    elif raw_text.startswith("```"):
        raw_text = raw_text.replace("```", "").strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "diagnostico": "No se pudo convertir la respuesta del modelo a JSON estructurado.",
            "score_interpretacion": "La respuesta del modelo se recibió como texto libre.",
            "factores_principales": [],
            "estrategias": [],
            "plan_accion": [],
            "mensaje_para_vendedor": raw_text,
        }

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Churn Hunter AI API is running",
    }

@app.post("/recommendation")
async def recommendation(customer: CustomerRiskRequest, request: Request):
    validate_api_key(request)

    try:
        recommendation_json = await call_llm(customer)
        return {
            "source": "gemini",
            "customer_id": customer.customer_id,
            "recommendation": recommendation_json,
        }
    except Exception as exc:
        logger.exception("AI recommendation failed: %s", exc)
        fallback = fallback_recommendation(customer)
        fallback["error"] = "AI service unavailable. Returned fallback recommendation."
        return fallback