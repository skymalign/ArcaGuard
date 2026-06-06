import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TREND_DATA } from '../data/mockData';

export default function TrendChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Tendencia de Clientes en Alto Riesgo
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={TREND_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={46}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            formatter={(v: number) => [v.toLocaleString(), 'Clientes']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <ReferenceLine
            y={20034}
            stroke="#C8102E"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#C8102E"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#C8102E', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#C8102E' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
