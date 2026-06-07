// Datos REALES generados por el pipeline (src/features.py + src/model.py).
// Fuente: reports/charts.json y data/processed/* · validación temporal mes 202601.
// (Se corrigió el encoding roto del JSON: "PequeÃ±o" → "Pequeño", etc.)

export const KPIS = {
  clientesEvaluados: 199923,
  churnRatePct: 0.81,
  clientesRiesgoAlto: 10276,
  prAuc: 0.3273,
  rocAuc: 0.9549,
  recallTop10: 0.871,
  mxnPerdidosMes: 12000000,
  mxnDireccionableTop10: 10452000,
};

// Niveles de riesgo del scoring (scoring_clientes.csv). Total = 199,923.
export interface Nivel { name: string; value: number; pct: string; color: string }
export const NIVELES_RIESGO: Nivel[] = [
  { name: 'Alto Riesgo',  value: 10276,  pct: '5.1%',  color: '#C8102E' },
  { name: 'Medio Riesgo', value: 20361,  pct: '10.2%', color: '#F59E0B' },
  { name: 'Bajo Riesgo',  value: 169286, pct: '84.7%', color: '#E5E7EB' },
];

// Importancia de variables del HGB (feature_importance.csv) con etiqueta legible.
export const CATEGORIA_COLOR: Record<string, string> = {
  Ventas: '#C8102E', Actividad: '#6B8FA3', Cliente: '#C8A951', Coolers: '#3B82F6',
};
export interface Importancia { label: string; variable: string; importance: number; categoria: string }
export const IMPORTANCIA_VARIABLES: Importancia[] = [
  { label: 'Ventas mes anterior',  variable: 'tx_lag1',                importance: 0.1311, categoria: 'Ventas' },
  { label: 'Cajas mes anterior',   variable: 'bx_lag1',                importance: 0.0992, categoria: 'Ventas' },
  { label: 'Media ventas 12m',     variable: 'tx_mean_12',             importance: 0.0618, categoria: 'Ventas' },
  { label: 'Ratio ventas 1m/3m',   variable: 'tx_ratio_1_3',           importance: 0.0496, categoria: 'Ventas' },
  { label: 'Recencia de compra',   variable: 'recency',                importance: 0.0453, categoria: 'Actividad' },
  { label: 'Territorio',           variable: 'territory_d',            importance: 0.0317, categoria: 'Cliente' },
  { label: 'Coolers activos',      variable: 'num_coolers_last',       importance: 0.0215, categoria: 'Coolers' },
  { label: 'Media cajas 3m',       variable: 'bx_mean_3',              importance: 0.0187, categoria: 'Ventas' },
  { label: 'Tamaño del cliente',   variable: 'rtm_customer_size_d',    importance: 0.0170, categoria: 'Cliente' },
  { label: 'Antigüedad',           variable: 'tenure',                 importance: 0.0167, categoria: 'Actividad' },
  { label: 'Ventas hace 3m',       variable: 'tx_lag3',                importance: 0.0159, categoria: 'Ventas' },
  { label: 'Cajas hace 2m',        variable: 'bx_lag2',                importance: 0.0076, categoria: 'Ventas' },
  { label: 'Pendiente ventas 3m',  variable: 'tx_slope_3',             importance: 0.0075, categoria: 'Ventas' },
  { label: 'Subcanal',             variable: 'comercial_subchannel_d', importance: 0.0049, categoria: 'Cliente' },
  { label: 'Meses activos (6m)',   variable: 'meses_activos_6',        importance: 0.0039, categoria: 'Actividad' },
];

// Recall@Top-K (recall_topk.csv) — recall en %.
export interface RecallK { k: string; recall: number; lift: number; contactados: number; capturados: number }
export const RECALL_TOPK: RecallK[] = [
  { k: '1%',  recall: 41.7, lift: 41.73, contactados: 1975,  capturados: 720 },
  { k: '2%',  recall: 58.1, lift: 29.03, contactados: 3951,  capturados: 1002 },
  { k: '5%',  recall: 76.9, lift: 15.38, contactados: 9879,  capturados: 1327 },
  { k: '10%', recall: 87.1, lift: 8.71,  contactados: 19759, capturados: 1503 },
  { k: '20%', recall: 93.7, lift: 4.69,  contactados: 39518, capturados: 1618 },
];

// Churn por territorio real (25 territorios Arca), ordenado de mayor a menor.
export interface ChurnTerr { territorio: string; churnPct: number; registros: number }
export const CHURN_TERRITORIO: ChurnTerr[] = [
  { territorio: 'Monclova',         churnPct: 1.35, registros: 54010 },
  { territorio: 'Reynosa',          churnPct: 1.33, registros: 136345 },
  { territorio: 'Laredo',           churnPct: 1.13, registros: 39618 },
  { territorio: 'Matamoros',        churnPct: 1.10, registros: 96247 },
  { territorio: 'Saltillo',         churnPct: 1.04, registros: 135360 },
  { territorio: 'Comarca Lagunera', churnPct: 1.02, registros: 240225 },
  { territorio: 'Piedras Negras',   churnPct: 0.97, registros: 76215 },
  { territorio: 'Monterrey',        churnPct: 0.95, registros: 468284 },
  { territorio: 'Culiacán',         churnPct: 0.91, registros: 219340 },
  { territorio: 'San Luis Potosí',  churnPct: 0.88, registros: 284634 },
  { territorio: 'Hermosillo',       churnPct: 0.86, registros: 108606 },
  { territorio: 'La Paz',           churnPct: 0.85, registros: 89193 },
  { territorio: 'Juárez',           churnPct: 0.83, registros: 155728 },
  { territorio: 'Guadalajara',      churnPct: 0.81, registros: 555005 },
  { territorio: 'Nuevo León',       churnPct: 0.77, registros: 62102 },
  { territorio: 'Zacatecas',        churnPct: 0.75, registros: 276598 },
  { territorio: 'Aguascalientes',   churnPct: 0.74, registros: 291590 },
  { territorio: 'Obregón',          churnPct: 0.73, registros: 123839 },
  { territorio: 'Mexicali',         churnPct: 0.69, registros: 113827 },
  { territorio: 'Mazatlán',         churnPct: 0.57, registros: 127184 },
  { territorio: 'Mesa Central',     churnPct: 0.57, registros: 149617 },
  { territorio: 'Chihuahua',        churnPct: 0.56, registros: 72243 },
  { territorio: 'Jalisco',          churnPct: 0.54, registros: 409909 },
  { territorio: 'Delicias',         churnPct: 0.53, registros: 97467 },
  { territorio: 'Durango',          churnPct: 0.26, registros: 165177 },
];

export type ChurnNivel = 'Alto' | 'Medio' | 'Bajo';
export function churnNivel(pct: number): ChurnNivel {
  if (pct >= 1.0) return 'Alto';
  if (pct >= 0.7) return 'Medio';
  return 'Bajo';
}
export function churnColor(pct: number): string {
  if (pct >= 1.0) return '#C8102E';
  if (pct >= 0.7) return '#F59E0B';
  return '#22C55E';
}

// Churn real de un territorio por nombre (para enlazar la vista de clientes
// con la de territorios y garantizar consistencia).
const CHURN_BY_TERR: Record<string, number> = Object.fromEntries(
  CHURN_TERRITORIO.map((t) => [t.territorio, t.churnPct])
);
export function territorioChurn(name: string): number | undefined {
  return CHURN_BY_TERR[name];
}

// Churn por número de coolers (relación monótona ~20×).
export const CHURN_COOLERS = [
  { label: '0 coolers',   churnPct: 2.350 },
  { label: '1 cooler',    churnPct: 0.768 },
  { label: '2-3 coolers', churnPct: 0.313 },
  { label: '4+ coolers',  churnPct: 0.118 },
];

// Churn por tamaño de cliente.
export const CHURN_TAMANO = [
  { tamano: 'Mini',    churnPct: 3.268 },
  { tamano: 'Pequeño', churnPct: 0.609 },
  { tamano: 'Mediano', churnPct: 0.180 },
  { tamano: 'Grande',  churnPct: 0.045 },
  { tamano: 'Gigante', churnPct: 0.029 },
];

// Churn por subcanal comercial (encoding corregido), ordenado desc.
export const CHURN_SUBCANAL = [
  { subcanal: 'Hogares',              churnPct: 1.424 },
  { subcanal: 'Tienda orgánica',      churnPct: 0.908 },
  { subcanal: 'Verdulería',           churnPct: 0.870 },
  { subcanal: 'Farmacia',             churnPct: 0.858 },
  { subcanal: 'Tortillería',          churnPct: 0.825 },
  { subcanal: 'Panadería',            churnPct: 0.805 },
  { subcanal: 'Carne/pollo/pescado',  churnPct: 0.735 },
  { subcanal: 'Licorería',            churnPct: 0.644 },
  { subcanal: 'Abarrotes y bodegas',  churnPct: 0.557 },
  { subcanal: 'Kiosco',               churnPct: 0.541 },
  { subcanal: 'Mayorista',            churnPct: 0.406 },
  { subcanal: 'Proximidad',           churnPct: 0.359 },
  { subcanal: 'Minisuper',            churnPct: 0.330 },
];

// Tasa de churn mensual real (churn_por_mes), 202403 → 202601.
export interface ChurnMes { mes: string; churnPct: number }
export const CHURN_MES: ChurnMes[] = [
  { mes: 'Mar 24', churnPct: 0.695 },
  { mes: 'Abr 24', churnPct: 0.636 },
  { mes: 'May 24', churnPct: 0.773 },
  { mes: 'Jun 24', churnPct: 0.825 },
  { mes: 'Jul 24', churnPct: 0.810 },
  { mes: 'Ago 24', churnPct: 0.862 },
  { mes: 'Sep 24', churnPct: 0.871 },
  { mes: 'Oct 24', churnPct: 0.810 },
  { mes: 'Nov 24', churnPct: 0.939 },
  { mes: 'Dic 24', churnPct: 0.880 },
  { mes: 'Ene 25', churnPct: 0.984 },
  { mes: 'Feb 25', churnPct: 0.955 },
  { mes: 'Mar 25', churnPct: 0.748 },
  { mes: 'Abr 25', churnPct: 0.699 },
  { mes: 'May 25', churnPct: 0.626 },
  { mes: 'Jun 25', churnPct: 0.705 },
  { mes: 'Jul 25', churnPct: 0.705 },
  { mes: 'Ago 25', churnPct: 0.753 },
  { mes: 'Sep 25', churnPct: 0.728 },
  { mes: 'Oct 25', churnPct: 0.835 },
  { mes: 'Nov 25', churnPct: 0.964 },
  { mes: 'Dic 25', churnPct: 0.848 },
  { mes: 'Ene 26', churnPct: 0.874 },
];

// Comparación de modelos (metrics.json) — métricas ×100 para graficar.
export const MODELOS = [
  { modelo: 'Azar (baseline)',             prAuc: 0.87,  rocAuc: 50.00 },
  { modelo: 'Logistic Regression',         prAuc: 21.20, rocAuc: 94.76 },
  { modelo: 'Histogram Gradient Boosting', prAuc: 32.73, rocAuc: 95.49 },
];
