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
import { CHURN_MES } from '../data/modelData';

export default function TrendChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        Tendencia de Tasa de Churn
      </h3>
      <p className="text-xs text-gray-400 mb-3">Mensual · histórico observado</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={CHURN_MES} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            domain={[0.4, 1.1]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={42}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Churn']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <ReferenceLine
            y={0.81}
            stroke="#C8102E"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            label={{ value: 'Prom 0.81%', position: 'insideTopRight', fontSize: 10, fill: '#C8102E' }}
          />
          <Line
            type="monotone"
            dataKey="churnPct"
            stroke="#C8102E"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#C8102E', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#C8102E' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
