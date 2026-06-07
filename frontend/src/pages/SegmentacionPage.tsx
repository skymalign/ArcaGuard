import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';

const RECALL_CURVE = [
  { k: '5%',  recall: 76 },
  { k: '10%', recall: 87 },
  { k: '15%', recall: 91 },
  { k: '20%', recall: 94 },
  { k: '30%', recall: 97 },
  { k: '40%', recall: 99 },
  { k: '50%', recall: 100 },
];

const VARIABLES = [
  { label: 'Caída en ventas últimos 3 meses', value: 40, color: '#C8102E' },
  { label: 'Meses consecutivos en cero',      value: 25, color: '#C8102E' },
  { label: 'Número de coolers activos',        value: 21, color: '#C8A951' },
  { label: 'Días desde última compra',         value: 13, color: '#6B8FA3' },
  { label: 'Subcanal del cliente',             value: 6,  color: '#9CA3AF' },
  { label: 'Territorio',                       value: 3,  color: '#9CA3AF' },
  { label: 'Tamaño del cliente',               value: 2,  color: '#9CA3AF' },
];

const CHURN_TERRITORIO = [
  { territorio: 'Norte',           rate: 13.1 },
  { territorio: 'Centro',          rate: 11.8 },
  { territorio: 'Occidente',       rate: 9.2  },
  { territorio: 'Sureste',         rate: 8.4  },
  { territorio: 'Valle de México', rate: 6.1  },
  { territorio: 'Sur',             rate: 4.3  },
];

const COOLERS_DATA = [
  { label: '0 coolers',   rate: 45.0 },
  { label: '1 cooler',    rate: 13.5 },
  { label: '2-3 coolers', rate: 5.2  },
  { label: '4+ coolers',  rate: 0.9  },
];

const MODELOS_DATA = [
  { modelo: 'Azar (baseline)',             prauc: 1,  recall: 10 },
  { modelo: 'Logistic Regression',         prauc: 3,  recall: 52 },
  { modelo: 'Histogram Gradient Boosting', prauc: 58, recall: 87 },
];

const RecallTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
        <p className="text-gray-500">Top-K: <span className="font-semibold text-gray-800">{label}</span></p>
        <p className="text-brand-red font-semibold">Recall: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SegmentacionPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8 py-7 space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Segmentación</h2>
          <p className="text-sm text-gray-500 mt-0.5">Análisis detallado del modelo predictivo</p>
        </div>

        {/* Recall@Top-K */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 pt-7 pb-2">
            <h3 className="text-lg font-semibold text-gray-900">Recall@Top-K</h3>
            <p className="text-sm text-gray-500 mt-1">
              Contactando solo el{' '}
              <span className="font-semibold text-brand-red">10% de clientes</span>{' '}
              capturamos el{' '}
              <span className="font-semibold text-brand-red">87% de los que se irán</span>
            </p>
          </div>
          <div className="px-4 pb-2 pt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RECALL_CURVE} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="recallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C8102E" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#C8102E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="k" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  label={{ value: 'Recall (%)', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#9ca3af' } }} />
                <Tooltip content={<RecallTooltip />} />
                <ReferenceLine x="10%" stroke="#C8102E" strokeDasharray="5 3" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="recall" stroke="#C8102E" strokeWidth={2.5} fill="url(#recallGrad)" dot={false} activeDot={{ r: 5, fill: '#C8102E', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mx-6 mb-6 mt-2 bg-red-50 border-l-4 border-brand-red rounded-r-lg px-4 py-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Impacto de negocio:</span>{' '}
              En lugar de contactar 199,923 clientes, el modelo permite priorizar solo 19,992 (10%) y recuperar el 87% del churn potencial.
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Importancia de Variables</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">¿Qué predice mejor el churn? (Top 7)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={VARIABLES} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 45]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" width={185} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, 'Importancia']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {VARIABLES.map((v, i) => <Cell key={i} fill={v.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Churn Rate por Territorio</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">Ordenado de mayor a menor riesgo</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CHURN_TERRITORIO} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="territorio" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#9ca3af' } }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="#C8102E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Churn Rate por Número de Coolers</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">
              Dato clave: <span className="font-semibold text-brand-red">0 coolers vs 4+ coolers</span>
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={COOLERS_DATA} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 60]} ticks={[0, 15, 30, 45, 60]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#9ca3af' } }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="#C8102E" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-red-50 border-l-4 border-brand-red rounded-r-lg px-4 py-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight clave:</span>{' '}
                Clientes sin coolers tienen 50x más probabilidad de hacer churn que clientes con 4+ coolers (45% vs 0.9%)
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Comparación de Modelos</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">Justificación de la elección técnica</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MODELOS_DATA} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="modelo" width={185} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="prauc"  name="PR-AUC (×100)" fill="#C8102E" radius={[0, 4, 4, 0]} />
                <Bar dataKey="recall" name="Recall@10%"     fill="#C8A951" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-sm bg-brand-red inline-block" />
                PR-AUC (×100)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#C8A951' }} />
                Recall@10%
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}