import { useState } from 'react';
import { CYCLONES } from '@/data/demoData';
import { Layers3, TrendingUp } from 'lucide-react';

const IMD_SCALE = [
  { category: 'Depression', windRange: '17-27 kt', pressureRange: '> 1000 hPa', color: '#6b7d9c' },
  { category: 'Deep Depression', windRange: '28-33 kt', pressureRange: '996-1000 hPa', color: '#60a5fa' },
  { category: 'Cyclonic Storm', windRange: '34-47 kt', pressureRange: '988-995 hPa', color: '#22c55e' },
  { category: 'Severe Cyclonic Storm', windRange: '48-63 kt', pressureRange: '976-987 hPa', color: '#fbbf24' },
  { category: 'Very Severe Cyclonic Storm', windRange: '64-89 kt', pressureRange: '958-975 hPa', color: '#f59e0b' },
  { category: 'Extremely Severe Cyclonic Storm', windRange: '90-119 kt', pressureRange: '932-957 hPa', color: '#ef4444' },
  { category: 'Super Cyclonic Storm', windRange: '> 120 kt', pressureRange: '< 932 hPa', color: '#b91c1c' },
];

export function Classification() {
  const [selectedId, setSelectedId] = useState(CYCLONES[0].id);
  const cyclone = CYCLONES.find((c) => c.id === selectedId)!;

  const currentScaleIndex = IMD_SCALE.findIndex((s) => s.category === cyclone.category);

  // Classification probability distribution (simulated)
  const classProbs = IMD_SCALE.map((s, i) => {
    const distance = Math.abs(i - currentScaleIndex);
    const base = Math.max(0, 70 - distance * 20);
    const noise = (i === currentScaleIndex) ? 0 : (distance === 1 ? 8 : 2);
    return { category: s.category, prob: base + noise, color: s.color };
  });

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Layers3 size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Cyclone Intensity Classification</span>
        <div className="ml-4 flex items-center gap-2">
          {CYCLONES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`tab-btn ${selectedId === c.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* IMD Intensity Scale */}
        <div className="panel lg:col-span-2">
          <div className="panel-header">
            <span className="text-xs font-semibold text-white">IMD Tropical Cyclone Intensity Scale</span>
            <span className="text-2xs text-ink-300">India Meteorological Department classification</span>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              {IMD_SCALE.map((s, i) => {
                const isCurrent = i === currentScaleIndex;
                const isPast = i < currentScaleIndex;
                return (
                  <div
                    key={s.category}
                    className={`flex items-center gap-3 p-2.5 rounded-md border transition-colors ${
                      isCurrent ? 'bg-cyan-500/10 border-cyan-500/30' : isPast ? 'bg-ink-850 border-ink-700 opacity-60' : 'border-ink-700'
                    }`}
                  >
                    <div className="w-1 h-8 rounded-full" style={{ background: s.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{s.category}</div>
                      <div className="text-2xs text-ink-300 font-mono">{s.windRange} • {s.pressureRange}</div>
                    </div>
                    {isCurrent && (
                      <span className="badge bg-cyan-500/20 text-cyan-300">Current</span>
                    )}
                    {isPast && (
                      <span className="badge bg-ink-700 text-ink-300">Escalated</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current classification result */}
        <div className="space-y-4">
          <div className="panel">
            <div className="panel-header">
              <span className="text-xs font-semibold text-white">Classification Result</span>
              <span className="text-2xs text-ink-300 font-mono">{cyclone.id}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center py-3">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 mb-1">Assigned Category</div>
                <div className="text-lg font-bold" style={{ color: IMD_SCALE[currentScaleIndex].color }}>
                  {cyclone.category}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                  <div className="text-2xs text-ink-300 uppercase">Max Wind</div>
                  <div className="text-sm text-white font-mono">{cyclone.maxWind} kt</div>
                </div>
                <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                  <div className="text-2xs text-ink-300 uppercase">Pressure</div>
                  <div className="text-sm text-white font-mono">{cyclone.centralPressure} hPa</div>
                </div>
              </div>
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase">Classification Method</div>
                <div className="text-xs text-ink-100 mt-1">Dvorak Technique + CNN Ensemble</div>
              </div>
            </div>
          </div>

          {/* Probability distribution */}
          <div className="panel">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-white">Model Probability Distribution</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {classProbs.map((p) => (
                <div key={p.category}>
                  <div className="flex items-center justify-between text-2xs mb-0.5">
                    <span className="text-ink-200">{p.category}</span>
                    <span className="font-mono" style={{ color: p.color }}>{p.prob}%</span>
                  </div>
                  <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.prob}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intensity progression chart */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-semibold text-white">Intensity Progression — {cyclone.name}</span>
          <span className="text-2xs text-ink-300">Wind speed (kt) over observation period</span>
        </div>
        <div className="p-4">
          <IntensityChart cyclone={cyclone} />
        </div>
      </div>
    </div>
  );
}

function IntensityChart({ cyclone }: { cyclone: typeof CYCLONES[0] }) {
  const allPoints = [...cyclone.track, ...cyclone.forecastTrack];
  const maxWind = Math.max(...allPoints.map((p) => p.intensity));
  const chartW = 800;
  const chartH = 200;
  const padding = { top: 20, right: 40, bottom: 30, left: 40 };
  const plotW = chartW - padding.left - padding.right;
  const plotH = chartH - padding.top - padding.bottom;

  const xStep = plotW / (allPoints.length - 1);
  const yScale = (v: number) => padding.top + plotH - (v / maxWind) * plotH;

  const observedPath = cyclone.track.map((p, i) => {
    const x = padding.left + i * xStep;
    const y = yScale(p.intensity);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const forecastStart = cyclone.track.length - 1;
  const forecastPath = cyclone.forecastTrack.map((p, i) => {
    const x = padding.left + (forecastStart + i) * xStep;
    const y = yScale(p.intensity);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = yScale(v);
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={chartW - padding.right} y2={y} stroke="#142238" strokeWidth="0.5" />
            <text x={padding.left - 5} y={y + 3} fill="#334766" fontSize="8" textAnchor="end" fontFamily="monospace">{v}</text>
          </g>
        );
      })}

      {/* Category thresholds */}
      {IMD_SCALE.slice(2).map((s) => {
        const windMin = parseInt(s.windRange);
        if (windMin > maxWind) return null;
        const y = yScale(windMin);
        return (
          <g key={s.category}>
            <line x1={padding.left} y1={y} x2={chartW - padding.right} y2={y} stroke={s.color} strokeWidth="0.3" strokeDasharray="3,3" opacity="0.3" />
            <text x={chartW - padding.right + 3} y={y + 3} fill={s.color} fontSize="6" fontFamily="monospace" opacity="0.5">{s.category.slice(0, 4)}</text>
          </g>
        );
      })}

      {/* Observed line */}
      <path d={observedPath} fill="none" stroke="#22d3ee" strokeWidth="2" />

      {/* Forecast line */}
      <path d={forecastPath} fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4,3" opacity="0.6" />

      {/* Data points */}
      {allPoints.map((p, i) => {
        const x = padding.left + i * xStep;
        const y = yScale(p.intensity);
        const isForecast = i >= cyclone.track.length;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={isForecast ? 2.5 : 3} fill={isForecast ? 'none' : '#22d3ee'} stroke="#22d3ee" strokeWidth="1" />
            <text x={x} y={y - 6} fill="#9aa8c0" fontSize="7" textAnchor="middle" fontFamily="monospace">{p.intensity}</text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {allPoints.map((p, i) => {
        if (i % 2 !== 0) return null;
        const x = padding.left + i * xStep;
        return (
          <text key={`x-${i}`} x={x} y={chartH - 8} fill="#334766" fontSize="7" textAnchor="middle" fontFamily="monospace">{p.time.split('•')[0]}</text>
        );
      })}

      {/* Divider between observed and forecast */}
      <line
        x1={padding.left + forecastStart * xStep}
        y1={padding.top}
        x2={padding.left + forecastStart * xStep}
        y2={chartH - padding.bottom}
        stroke="#fbbf24"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        opacity="0.5"
      />
      <text x={padding.left + forecastStart * xStep + 3} y={padding.top + 8} fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.6">FORECAST →</text>

      {/* Y-axis label */}
      <text x={10} y={chartH / 2} fill="#475a7a" fontSize="8" fontFamily="monospace" transform={`rotate(-90, 10, ${chartH / 2})`} textAnchor="middle">Wind (kt)</text>
    </svg>
  );
}
