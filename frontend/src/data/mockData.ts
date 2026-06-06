import type { RiskDistribution, TerritoryRisk, TrendPoint, RiskFactor } from '../types';

export const RISK_DISTRIBUTION: RiskDistribution[] = [
  { name: 'Alto Riesgo',  value: 20034,  pct: '10%', color: '#C8102E' },
  { name: 'Medio Riesgo', value: 59977,  pct: '30%', color: '#F59E0B' },
  { name: 'Bajo Riesgo',  value: 119912, pct: '60%', color: '#E5E7EB' },
];

export const TERRITORY_RISK: TerritoryRisk[] = [
  { territory: 'Norte',          highRisk: 5100 },
  { territory: 'Centro',         highRisk: 4400 },
  { territory: 'Occidente',      highRisk: 3800 },
  { territory: 'Sureste',        highRisk: 3200 },
  { territory: 'Valle de México',highRisk: 2300 },
  { territory: 'Sur',            highRisk: 1234 },
];

export const TREND_DATA: TrendPoint[] = [
  { month: 'Sep 25', value: 19800 },
  { month: 'Oct 25', value: 20500 },
  { month: 'Nov 25', value: 21200 },
  { month: 'Dic 25', value: 20900 },
  { month: 'Feb 26', value: 20034 },
];

export const RISK_FACTORS: RiskFactor[] = [
  { label: 'Frecuencia de compra baja',       impact: 0.32, direction: 'negative' },
  { label: 'Días sin pedido reciente',         impact: 0.28, direction: 'negative' },
  { label: 'Reducción en volumen',             impact: 0.21, direction: 'negative' },
  { label: 'Historial de pagos tardíos',       impact: 0.18, direction: 'negative' },
  { label: 'Diversificación de proveedores',   impact: 0.15, direction: 'negative' },
  { label: 'Canal digital activo',             impact: 0.12, direction: 'positive' },
];
