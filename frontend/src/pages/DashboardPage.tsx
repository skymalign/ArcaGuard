import KpiCard from '../components/KpiCard';
import RiskDistributionChart from '../components/RiskDistributionChart';
import TerritoryChart from '../components/TerritoryChart';
import TrendChart from '../components/TrendChart';
import RiskFactors from '../components/RiskFactors';
import { KPIS } from '../data/modelData';

const KPI_DATA = [
  {
    title: 'Clientes Evaluados',
    value: KPIS.clientesEvaluados.toLocaleString('es-MX'),
    subtitle: '100% del universo',
    variant: 'default' as const,
  },
  {
    title: 'Clientes en Alto Riesgo',
    value: KPIS.clientesRiesgoAlto.toLocaleString('es-MX'),
    subtitle: `${((KPIS.clientesRiesgoAlto / KPIS.clientesEvaluados) * 100).toFixed(1)}% del total`,
    variant: 'warning' as const,
  },
  {
    title: 'Recall@10%',
    value: `${Math.round(KPIS.recallTop10 * 100)}%`,
    subtitle: 'Captura de churn potencial',
    variant: 'success' as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8 py-7 space-y-8">
        {/* Section title */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resumen General</h2>
          <p className="text-sm text-gray-500 mt-0.5">Panorama del mes de predicción</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-5">
          {KPI_DATA.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-5">
          <RiskDistributionChart />
          <TerritoryChart />
          <TrendChart />
        </div>

        {/* Risk factors */}
        <div className="grid grid-cols-1">
          <RiskFactors />
        </div>
      </div>
    </div>
  );
}
