import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TERRITORY_RISK } from '../data/mockData';

export default function TerritoryChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Clientes en Alto Riesgo por Territorio
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={TERRITORY_RISK} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="territory"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(v: number) => [v.toLocaleString(), 'Alto Riesgo']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            cursor={{ fill: '#f9fafb' }}
          />
          <Bar dataKey="highRisk" radius={[4, 4, 0, 0]}>
            {TERRITORY_RISK.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#C8102E' : '#FCA5A5'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
