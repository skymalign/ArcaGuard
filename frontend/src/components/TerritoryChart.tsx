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
import { CHURN_TERRITORIO } from '../data/modelData';

const TOP = CHURN_TERRITORIO.slice(0, 8);

export default function TerritoryChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        Tasa de Churn por Territorio
      </h3>
      <p className="text-xs text-gray-400 mb-3">Top 8 de 25 territorios</p>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={TOP} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1.5]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="territorio"
            width={108}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Churn']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            cursor={{ fill: '#f9fafb' }}
          />
          <Bar dataKey="churnPct" radius={[0, 4, 4, 0]}>
            {TOP.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#C8102E' : '#FCA5A5'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
