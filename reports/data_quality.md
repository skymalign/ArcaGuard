# Reporte de calidad de datos - Churn Hunter
_Generado automaticamente con `src/data_quality.py`._

## 1. Ventas (sales_churn_train / test)
- **train**: 5,030,534 filas x 5 cols | vacios: **0**
- **test**: 199,923 filas x 4 cols | vacios: **0**
- cajas (`uni_boxes_sold_m`) negativas en train: **79** -> se recortan a 0 en features
- `num_transacciones` rango: [0, 1842]
- target: 43,402 churns / 5,030,534 -> churn rate **0.86%** (desbalance extremo)

## 2. Clientes (estatico)
- 371,727 filas | duplicados de customer_id: 0
- vacios en `rtm_customer_size_d`: **15,438** | de esos, en el universo modelado: **0**

## 3. Coolers (mensual)
- 4,636,676 filas | vacios: 0
- duplicados (cliente+mes): **1,573** -> se deduplican tomando el maximo
- cobertura de clientes modelados: **83.5%** -> el resto = sin nevera, se rellena con 0

## 4. Estructura del panel (train)
- clientes unicos: 241,805 | meses: 25 (202401 -> 202601)
- panel **denso (sin huecos cliente-mes): 100.0%** | duplicados cliente+mes: 0

## 5. Tabla de features (lo que entra al modelo)
- train: 4,548,363 filas | predict(202602): 199,923 filas
- vacios en categoricas (train/predict): `territory_d`=0/0, `comercial_subchannel_d`=0/0, `rtm_customer_size_d`=0/0
- NaN restantes (solo por falta de historial; HGB los maneja nativo):
  - `tx_lag3`: 5.11%
  - `tx_slope_3`: 5.11%

## Veredicto
- El dato principal (ventas) viene **sin vacios**.
- Vacios de `rtm_customer_size_d` corresponden a clientes **fuera del universo modelado** (no afectan).
- Ausencia de coolers se trata como **0** (sin nevera), no como dato faltante.
- NaN en features = **falta de historial**; el modelo de arboles (HGB) los aprovecha sin imputar.