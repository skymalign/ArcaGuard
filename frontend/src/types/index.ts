export type RiskLevel = 'alto' | 'medio' | 'bajo';

export interface KpiCard {
  title: string;
  value: string;
  subtitle: string;
  variant: 'default' | 'warning' | 'success';
}

export interface RiskDistribution {
  name: string;
  value: number;
  pct: string;
  color: string;
}

export interface TerritoryRisk {
  territory: string;
  highRisk: number;
}

export interface TrendPoint {
  month: string;
  value: number;
}

export interface RiskFactor {
  label: string;
  impact: number;
  direction: 'positive' | 'negative';
}

export interface NavItem {
  label: string;
  icon: string;
  section?: 'main' | 'ia' | 'export';
}
