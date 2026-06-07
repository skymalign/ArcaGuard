# 🥤 Churn Hunter — Arca Continental (Hack 4 Her)

Sistema de **scoring de riesgo de churn** para clientes del canal tradicional (tienditas) de
Arca Continental. Identifica qué clientes están por **dejar de comprar antes de que ocurra**,
para que el equipo comercial actúe de forma proactiva.

> **El problema:** ~$12 MM MXN/mes se pierden en clientes que abandonan. Hoy se detecta tarde.
> **Churn:** un cliente se considera churneado cuando lleva **1 mes sin realizar ninguna compra**.

---

## Demo en vivo

🔗 **Dashboard desplegado:** http://207.148.13.198/

## 🎯 Resultados clave

| Métrica | Valor |
|---|---|
| Modelo | `HistGradientBoostingClassifier` (scikit-learn) |
| PR-AUC (validación temporal) | **0.327** vs 0.212 baseline · 0.009 azar |
| ROC-AUC | **0.955** |
| **Recall contactando al top 10% más riesgoso** | **87%** de los churners (lift 8.7×) |
| Clientes en riesgo alto (mes objetivo) | 10,276 |

**Mensaje de negocio:** con una lista priorizada, contactando solo al **10% de clientes**
el equipo comercial alcanza al **87% de quienes van a abandonar**.

---

## 🧠 Enfoque (lo que lo hace correcto)

Los datos son un **panel temporal** (una fila por cliente × mes), no una tabla estática.
Dos decisiones clave:

1. **Sin data leakage.** El `target=1` cae en el mes donde el cliente ya tiene ventas ≈ 0.
   Por eso **todas las features se calculan solo con el historial hasta el mes anterior**
   (`shift(1)` + `rolling`). Nunca se usan las ventas del mes a predecir.
2. **Validación temporal**, no aleatoria: se entrena con meses ≤ 202512 y se valida en 202601,
   imitando la predicción real de 202602.

Se eligió un modelo de árboles (gradient boosting) sobre un baseline de regresión logística
porque maneja no-linealidad, el desbalance extremo (0.86% churn) y los faltantes de forma nativa,
y da importancia de variables para responder las preguntas de negocio.

---

## 📁 Estructura

```
data/raw/          # CSVs originales (ventas, clientes, coolers, submission)
data/processed/    # parquet de features + predicciones (generados, en .gitignore)
src/
  features.py      # feature engineering temporal (sin leakage)
  model.py         # modelado scikit-learn + scoring + submission
  data_quality.py  # auditoría de calidad de datos
  export_charts.py # exporta datos de gráficas a reports/charts.json (para React)
notebooks/
  lectura.py       # EDA inicial
reports/
  data_quality.md  # reporte de calidad de datos
  insights.md      # respuestas a las 3 preguntas de negocio
  charts.json      # datos de gráficas para el frontend
models/            # modelo entrenado (.joblib, en .gitignore)
```

---

## ▶️ Cómo reproducir

Desde la **raíz del proyecto**, en una terminal:

```bash
# 1. instalar dependencias
python -m pip install pandas numpy pyarrow scikit-learn joblib

# 2. ejecutar el pipeline en orden
python src/data_quality.py    # auditoría de datos      -> reports/data_quality.md
python src/features.py        # feature engineering      -> data/processed/*.parquet
python src/model.py           # modelo + submission      -> data/processed/preds_submission.csv
python src/export_charts.py   # datos para gráficas      -> reports/charts.json
```

> ⚠️ Correr desde la terminal en la raíz (no con el botón ▶️ del IDE): los scripts usan rutas
> relativas a la raíz del proyecto.

---

## 📦 Entregables generados

- `data/processed/preds_submission.csv` — predicción de churn por cliente (formato del reto).
- `data/processed/scoring_clientes.csv` — probabilidad + nivel de riesgo (alto/medio/bajo).
- `reports/insights.md` — respuestas de negocio a las 3 preguntas clave.
- `reports/charts.json` — datos listos para visualización web.

---

## 🌐 Integración con React

`reports/charts.json` contiene todos los datos de gráficas como arrays de objetos
(listos para Recharts / Chart.js / nivo). Copia el archivo a tu app y consúmelo:

Secciones disponibles en `charts.json`:

| Clave | Contenido | Gráfica sugerida |
|---|---|---|
| `kpis` | métricas resumen + MXN direccionable | tarjetas |
| `mensaje_principal` | frase clave del proyecto | banner |
| `recall_topk` | recall por top-K% contactado | barras / línea |
| `importancia_variables` | top 15 + `categoria` (color) | barras horizontales |
| `churn_por_territorio` | churn % por territorio | barras / mapa |
| `churn_por_coolers` | churn % por # de coolers | barras |
| `churn_por_tamano` / `churn_por_subcanal` | churn % por segmento | barras |
| `churn_por_mes` | tendencia mensual | línea |
| `modelos` | PR-AUC/ROC por modelo | barras |
| `pr_curve` | curva precision-recall | línea |
| `niveles_riesgo` | alto/medio/bajo | dona / pie |
| `preguntas` | las 3 respuestas de negocio (texto+dato) | tarjetas |

```jsx
import charts from "./charts.json";

<BarChart data={charts.churn_por_coolers}>
  <XAxis dataKey="coolers" /> <YAxis /> <Bar dataKey="churn_pct" />
</BarChart>
```

Para regenerarlo tras cambios en el modelo: `python src/export_charts.py`.

Para instalar dependencias de la API: 
pip install -r api/requirements.txt 

Ejemplos de valores del env se encuentran en .env.example 
