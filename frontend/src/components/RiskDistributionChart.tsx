import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NIVELES_RIESGO as RISK_DISTRIBUTION } from '../data/modelData';

export default function RiskDistributionChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">Distribución de Riesgo de Churn</h3>

      <div className="flex items-center justify-between">
        {/* Donut chart */}
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={RISK_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {RISK_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [Number(value).toLocaleString(), '']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-gray-900">199,923</span>
            <span className="text-xs text-gray-400">Clientes</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 pl-4 space-y-3">
          {RISK_DISTRIBUTION.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">
                  {item.pct} ({item.value.toLocaleString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
