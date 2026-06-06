import { RISK_FACTORS } from '../data/mockData';

export default function RiskFactors() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        Principales Factores de Riesgo
      </h3>
      <p className="text-xs text-gray-400 mb-5">Impacto en Predicción</p>

      <div className="space-y-4">
        {RISK_FACTORS.map((factor) => (
          <div key={factor.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-700">{factor.label}</span>
              <span
                className={`text-sm font-semibold ${
                  factor.direction === 'negative' ? 'text-brand-red' : 'text-green-600'
                }`}
              >
                {factor.direction === 'negative' ? '–' : '+'}
                {(factor.impact * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${factor.impact * 100 / 0.32 * 100}%`,
                  backgroundColor: factor.direction === 'negative' ? '#C8102E' : '#16a34a',
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
