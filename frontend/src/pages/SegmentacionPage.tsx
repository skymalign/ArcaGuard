import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';
import {
  RECALL_TOPK, IMPORTANCIA_VARIABLES, CATEGORIA_COLOR, CHURN_TERRITORIO,
  CHURN_COOLERS, CHURN_TAMANO, CHURN_SUBCANAL, MODELOS,
} from '../data/modelData';

const VARIABLES = IMPORTANCIA_VARIABLES.slice(0, 8).map((v) => ({
  ...v,
  valor: +(v.importance * 100).toFixed(2),
}));
const TERR_TOP = CHURN_TERRITORIO.slice(0, 12);

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
              <AreaChart data={RECALL_TOPK} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
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
                <Area type="monotone" dataKey="recall" stroke="#C8102E" strokeWidth={2.5} fill="url(#recallGrad)" dot={{ r: 3, fill: '#C8102E', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#C8102E', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mx-6 mb-6 mt-2 bg-red-50 border-l-4 border-brand-red rounded-r-lg px-4 py-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Impacto de negocio:</span>{' '}
              En lugar de contactar 199,923 clientes, el modelo permite priorizar solo 19,759 (10%) y recuperar el 87% del churn potencial (lift 8.7×).
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Importancia de Variables</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">¿Qué predice mejor el churn? (Top 8)</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={VARIABLES} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 15]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, 'Importancia']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                  {VARIABLES.map((v, i) => <Cell key={i} fill={CATEGORIA_COLOR[v.categoria] ?? '#C8102E'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
              {Object.entries(CATEGORIA_COLOR).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: color }} />
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Churn Rate por Territorio</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">Top 12 · varía ~5.2× entre territorios</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={TERR_TOP} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 1.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="territorio" width={120} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="churnPct" radius={[0, 4, 4, 0]}>
                  {TERR_TOP.map((_, i) => <Cell key={i} fill={i === 0 ? '#C8102E' : '#FCA5A5'} />)}
                </Bar>
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
              <BarChart data={CHURN_COOLERS} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 2.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#9ca3af' } }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="churnPct" radius={[4, 4, 0, 0]} fill="#C8102E" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-red-50 border-l-4 border-brand-red rounded-r-lg px-4 py-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Insight clave:</span>{' '}
                Clientes sin coolers tienen ~20× más probabilidad de churn que clientes con 4+ coolers (2.35% vs 0.12%).
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Comparación de Modelos</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">Métricas ×100 · justificación de la elección técnica</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MODELOS} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="modelo" width={150} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="prAuc"  name="PR-AUC (×100)"  fill="#C8102E" radius={[0, 4, 4, 0]} />
                <Bar dataKey="rocAuc" name="ROC-AUC (×100)" fill="#C8A951" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-sm bg-brand-red inline-block" />
                PR-AUC (×100)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#C8A951' }} />
                ROC-AUC (×100)
              </div>
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Churn Rate por Tamaño de Cliente</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">
              Los clientes <span className="font-semibold text-brand-red">Mini</span> son los más volátiles
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHURN_TAMANO} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="tamano" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 3.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 11, fill: '#9ca3af' } }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="churnPct" radius={[4, 4, 0, 0]}>
                  {CHURN_TAMANO.map((_, i) => <Cell key={i} fill={i === 0 ? '#C8102E' : '#FCA5A5'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">Churn Rate por Subcanal</h3>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">Hogares es el subcanal de mayor riesgo</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CHURN_SUBCANAL} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="16%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 1.6]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="subcanal" width={140} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}%`, 'Churn']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="churnPct" radius={[0, 4, 4, 0]}>
                  {CHURN_SUBCANAL.map((_, i) => <Cell key={i} fill={i === 0 ? '#C8102E' : '#FCA5A5'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
