# 📊 Insights de negocio — Churn Hunter

Respuestas a las 3 preguntas clave del reto, con evidencia en datos y recomendaciones
accionables para el equipo comercial de Arca Continental.

**Contexto:** 241,805 clientes del canal tradicional, 25 meses de historia. Churn rate global
**0.86%** mensual (desbalance extremo). El reto: detectar a quién va a abandonar **antes** de que pase.

---

## 🎯 La recomendación principal (cómo usar esto)

El modelo entrega una **lista priorizada de riesgo**. La métrica que importa al negocio:

| Si el equipo contacta a... | ...captura este % de churners | Lift |
|---|---|---|
| Top 1% más riesgoso | 42% | 41.7× |
| Top 5% | 77% | 15.4× |
| **Top 10%** | **87%** | **8.7×** |
| Top 20% | 94% | 4.7× |

> **Acción:** en vez de revisar 200,000 clientes a ciegas, el equipo contacta al **10% más
> riesgoso (~20,000) y alcanza al 87% de quienes iban a abandonar.** Eso convierte un problema
> reactivo en una campaña de retención focalizada.

De los $12 MM MXN/mes en riesgo, ese 87% representa **~$10.4 MM MXN/mes direccionables**
con intervención temprana.

---

## P1 · ¿Qué variables influyen más en que un cliente deje de comprar?

**Hallazgo:** el churn se anticipa sobre todo por el **nivel y la tendencia de compra reciente**,
no por datos demográficos.

Top variables (permutation importance del modelo):

1. **`tx_lag1`** — transacciones del mes anterior
2. **`bx_lag1`** — cajas vendidas el mes anterior
3. **`tx_mean_12`** — promedio de transacciones del último año
4. **`tx_ratio_1_3`** — caída del último mes vs. su tendencia (señal de **declive**)
5. **`recency`** — meses desde su última compra
6. `territory_d` (territorio) · 7. `num_coolers_last` (coolers) · 8. tamaño de cliente

**Interpretación:** un cliente sano compra de forma estable; el que va a churnear muestra una
**caída progresiva** en transacciones y volumen antes de irse. La señal de oro es la
*desaceleración* (`tx_ratio_1_3`, `tx_drop_3`), no un solo mes malo.

**Recomendación:** crear una **alerta temprana** que se dispare cuando un cliente cae por debajo
de su propio promedio histórico (ej. compra < 50% de su media de 3 meses) — el modelo ya lo hace
automáticamente y lo combina con territorio y coolers.

---

## P2 · ¿El territorio influye en la pérdida de clientes?

**Hallazgo:** sí. El churn varía **~5× entre territorios.**

| Mayor riesgo | Churn | | Menor riesgo | Churn |
|---|---|---|---|---|
| Monclova | 1.35% | | Durango | 0.26% |
| Reynosa | 1.33% | | Delicias | 0.53% |
| Laredo | 1.13% | | Jalisco | 0.54% |
| Matamoros | 1.10% | | | |

**Interpretación:** los territorios del norte (Monclova, Reynosa, Laredo, Matamoros) concentran
el mayor abandono — posible competencia local, logística o perfil de cliente distinto. Durango y
Jalisco son los más leales.

**Recomendación:** asignar más recursos de retención y revisar la operación comercial en los
territorios del norte; replicar buenas prácticas de Durango/Jalisco.

---

## P3 · ¿La cantidad de coolers afecta el riesgo de churn?

**Hallazgo:** sí, y es de los insights más fuertes — relación **monótona y de ~20×.**

| Coolers del cliente | Churn |
|---|---|
| 0 (sin nevera) | **2.35%** |
| 1 | 0.77% |
| 2–3 | 0.31% |
| 4+ | **0.12%** |

**Interpretación:** el cooler es un fuerte **factor de permanencia**. Un cliente sin nevera tiene
~20× más probabilidad de abandonar que uno con 4+. Refleja inversión en el punto de venta y mayor
dependencia del producto.

**Recomendación:** **colocar coolers a clientes en riesgo que aún no tienen** es una palanca
directa de retención. Priorizar la instalación en clientes "alto riesgo + 0 coolers".

---

## 🔎 Insight extra · Tamaño del cliente

El churn cae drásticamente con el tamaño: **Mini 3.27% → Pequeño 0.61% → Mediano 0.18% →
Grande 0.045% → Gigante 0.029%.** Los clientes pequeños ("Mini") son los más volátiles y
concentran la mayor parte del churn absoluto → foco natural de las campañas de retención.

---

## Cómo se traduce a operación

El modelo clasifica a cada cliente del mes objetivo en **niveles de riesgo**:

| Nivel | Clientes (202602) | Acción sugerida |
|---|---|---|
| 🔴 Alto | 10,276 | Contacto comercial directo + oferta/cooler |
| 🟡 Medio | 20,361 | Seguimiento / campaña automatizada |
| 🟢 Bajo | 169,286 | Operación normal |

Archivo: `data/processed/scoring_clientes.csv` (cliente · probabilidad · nivel).
