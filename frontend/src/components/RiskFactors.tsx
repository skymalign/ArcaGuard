import { IMPORTANCIA_VARIABLES, CATEGORIA_COLOR } from '../data/modelData';

const TOP = IMPORTANCIA_VARIABLES.slice(0, 6);
const MAX = TOP[0].importance;
const TOTAL = TOP.reduce((s, f) => s + f.importance, 0);

export default function RiskFactors() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        Principales Factores de Riesgo
      </h3>
      <p className="text-xs text-gray-400 mb-5">Importancia en el modelo (HGB)</p>

      <div className="space-y-4">
        {TOP.map((factor) => (
          <div key={factor.variable}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-700">{factor.label}</span>
              <span className="text-sm font-semibold text-gray-800">
                {((factor.importance / TOTAL) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(factor.importance / MAX) * 100}%`,
                  backgroundColor: CATEGORIA_COLOR[factor.categoria] ?? '#C8102E',
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda de categorías */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-4 border-t border-gray-100">
        {Object.entries(CATEGORIA_COLOR).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: color }} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
