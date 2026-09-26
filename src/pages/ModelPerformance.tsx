import { MODEL_METRICS } from '@/data/demoData';
import { Gauge, TrendingUp, TrendingDown, Cpu, Target } from 'lucide-react';

export function ModelPerformance() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Gauge size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Model Performance & Evaluation</span>
        <span className="text-2xs text-ink-300 ml-2">Validation metrics on test set</span>
      </div>

      {/* Model architecture summary */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-white">Model Architecture</span>
          </div>
          <span className="text-2xs text-ink-300">Multi-branch CNN-LSTM Ensemble</span>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Architecture', value: 'CNN-LSTM', sub: 'Multi-branch ensemble' },
            { label: 'Input Sources', value: '5', sub: 'INSAT, NOAA, Himawari, Sentinel, MODIS' },
            { label: 'Training Data', value: '12,400', sub: 'labeled cyclone scenes' },
            { label: 'Parameters', value: '8.2M', sub: 'optimized weights' },
          ].map((m) => (
            <div key={m.label} className="p-3 bg-ink-850 rounded-md border border-ink-700">
              <div className="text-2xs text-ink-300 uppercase tracking-wider-2">{m.label}</div>
              <div className="text-sm text-white font-mono mt-1">{m.value}</div>
              <div className="text-2xs text-ink-300 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODEL_METRICS.map((m) => {
          const meetsTarget = m.metric.includes('Error') || m.metric.includes('False') || m.metric.includes('Time')
            ? m.value <= m.target
            : m.value >= m.target;
          const Icon = meetsTarget ? TrendingUp : TrendingDown;
          return (
            <div key={m.metric} className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300">{m.metric}</div>
                  <div className="text-2xl font-bold mt-1 text-white">
                    {m.value}{m.unit && <span className="text-sm text-ink-300 ml-1">{m.unit}</span>}
                  </div>
                  <div className="text-2xs text-ink-300 mt-1">{m.description}</div>
                </div>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${meetsTarget ? 'bg-success-500/10' : 'bg-warn-500/10'}`}>
                  <Icon size={14} className={meetsTarget ? 'text-success-400' : 'text-warn-400'} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-ink-700">
                <span className="text-2xs text-ink-300">Target:</span>
                <span className="text-2xs font-mono text-ink-200">{m.target}{m.unit}</span>
                <span className={`text-2xs font-medium ml-auto ${meetsTarget ? 'text-success-400' : 'text-warn-400'}`}>
                  {meetsTarget ? 'Meets' : 'Below target'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confusion matrix */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-white">Classification Confusion Matrix</span>
          </div>
          <span className="text-2xs text-ink-300">7-class intensity classification (normalized)</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <ConfusionMatrix />
        </div>
      </div>

      {/* Training history */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-semibold text-white">Training History — Loss & Accuracy</span>
          <span className="text-2xs text-ink-300">50 epochs • Simulated training curves</span>
        </div>
        <div className="p-4">
          <TrainingChart />
        </div>
      </div>
    </div>
  );
}

function ConfusionMatrix() {
  const labels = ['Dep', 'DD', 'CS', 'SCS', 'VSCS', 'ESCS', 'SCS'];
  // Simulated normalized confusion matrix (rows = true, cols = predicted)
  const matrix = [
    [0.92, 0.06, 0.02, 0.00, 0.00, 0.00, 0.00],
    [0.05, 0.88, 0.05, 0.02, 0.00, 0.00, 0.00],
    [0.02, 0.05, 0.85, 0.06, 0.02, 0.00, 0.00],
    [0.00, 0.02, 0.07, 0.82, 0.07, 0.02, 0.00],
    [0.00, 0.00, 0.02, 0.06, 0.80, 0.10, 0.02],
    [0.00, 0.00, 0.00, 0.02, 0.08, 0.82, 0.08],
    [0.00, 0.00, 0.00, 0.00, 0.02, 0.08, 0.90],
  ];

  function cellColor(v: number): string {
    if (v >= 0.85) return 'bg-success-500/30 text-white';
    if (v >= 0.05) return 'bg-warn-500/20 text-warn-300';
    if (v > 0) return 'bg-danger-500/15 text-danger-400';
    return 'bg-ink-850 text-ink-300';
  }

  return (
    <div className="inline-block">
      <table className="text-2xs">
        <thead>
          <tr>
            <th className="p-1"></th>
            {labels.map((l) => (
              <th key={l} className="p-1 text-center font-mono text-ink-300">{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="p-1 text-right font-mono text-ink-300 pr-2">{labels[i]}</td>
              {row.map((v, j) => (
                <td key={j} className="p-0.5">
                  <div className={`w-12 h-10 flex items-center justify-center rounded text-2xs font-mono ${cellColor(v)}`}>
                    {(v * 100).toFixed(0)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-3 text-2xs text-ink-300">
        <span>Rows: True class</span>
        <span>Columns: Predicted class</span>
        <span>Values: % (normalized)</span>
      </div>
    </div>
  );
}

function TrainingChart() {
  const epochs = 50;
  const chartW = 800;
  const chartH = 200;
  const padding = { top: 15, right: 60, bottom: 25, left: 35 };
  const plotW = chartW - padding.left - padding.right;
  const plotH = chartH - padding.top - padding.bottom;

  // Simulated loss curve (exponential decay)
  const lossData = Array.from({ length: epochs }, (_, i) => {
    const base = 2.5 * Math.exp(-i / 12) + 0.15;
    return base + (Math.random() - 0.5) * 0.05;
  });
  // Simulated accuracy curve (logarithmic growth)
  const accData = Array.from({ length: epochs }, (_, i) => {
    const base = 0.95 - 0.6 * Math.exp(-i / 10);
    return Math.min(0.95, base + (Math.random() - 0.5) * 0.02);
  });

  const xScale = (i: number) => padding.left + (i / (epochs - 1)) * plotW;
  const lossY = (v: number) => padding.top + plotH - (v / 2.7) * plotH;
  const accY = (v: number) => padding.top + plotH - (v / 1.0) * plotH;

  const lossPath = lossData.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${lossY(v).toFixed(1)}`).join(' ');
  const accPath = accData.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${accY(v).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
      {/* Grid */}
      {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((v) => (
        <g key={`loss-${v}`}>
          <line x1={padding.left} y1={lossY(v)} x2={chartW - padding.right} y2={lossY(v)} stroke="#142238" strokeWidth="0.5" />
          <text x={padding.left - 5} y={lossY(v) + 3} fill="#334766" fontSize="7" textAnchor="end" fontFamily="monospace">{v.toFixed(1)}</text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
        <text key={`acc-${v}`} x={chartW - padding.right + 5} y={accY(v) + 3} fill="#334766" fontSize="7" fontFamily="monospace">{(v * 100).toFixed(0)}%</text>
      ))}

      {/* Epoch markers */}
      {[0, 10, 20, 30, 40, 49].map((e) => (
        <text key={e} x={xScale(e)} y={chartH - 8} fill="#334766" fontSize="7" textAnchor="middle" fontFamily="monospace">{e + 1}</text>
      ))}

      {/* Loss curve */}
      <path d={lossPath} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
      {/* Accuracy curve */}
      <path d={accPath} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />

      {/* Legend */}
      <g transform={`translate(${padding.left + 10}, ${padding.top + 5})`}>
        <line x1="0" y1="0" x2="15" y2="0" stroke="#ef4444" strokeWidth="1.5" />
        <text x="20" y="3" fill="#9aa8c0" fontSize="8" fontFamily="monospace">Training Loss</text>
        <line x1="0" y1="12" x2="15" y2="12" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="20" y="15" fill="#9aa8c0" fontSize="8" fontFamily="monospace">Validation Accuracy</text>
      </g>
    </svg>
  );
}
