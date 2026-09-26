import { useState } from 'react';
import { CYCLONES } from '@/data/demoData';
import { ScanSearch, Crosshair, Circle, Waves, Cloud, Clock, Target, Activity } from 'lucide-react';

export function CycloneDetection() {
  const [selectedId, setSelectedId] = useState(CYCLONES[0].id);
  const cyclone = CYCLONES.find((c) => c.id === selectedId)!;

  return (
    <div className="p-5 space-y-4">
      {/* System selector */}
      <div className="flex items-center gap-2">
        <ScanSearch size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Cyclone Detection Analysis</span>
        <div className="ml-4 flex items-center gap-2">
          {CYCLONES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`tab-btn ${selectedId === c.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              {c.id} — {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Satellite observation image */}
        <div className="panel">
          <div className="panel-header">
            <span className="text-xs font-semibold text-white">Satellite Observation — IR Brightness Temperature</span>
            <span className="text-2xs text-ink-300 font-mono">INSAT-3DR • {cyclone.observedAt}</span>
          </div>
          <div className="p-4">
            <div className="relative h-80 rounded-md overflow-hidden bg-ink-950">
              <svg viewBox="0 0 400 320" className="w-full h-full">
                <defs>
                  <radialGradient id="cycloneCloud" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#1a2a44" stopOpacity="0.9" />
                    <stop offset="20%" stopColor="#243454" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#475a7a" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#6b7d9c" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background grid */}
                {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
                  <line key={`v${x}`} x1={x} y1={0} x2={x} y2={320} stroke="#0d1626" strokeWidth="0.5" />
                ))}
                {[0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320].map((y) => (
                  <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="#0d1626" strokeWidth="0.5" />
                ))}

                {/* Cyclone cloud pattern */}
                <ellipse cx="200" cy="145" rx="140" ry="110" fill="url(#cycloneCloud)" />

                {/* Spiral bands */}
                {[0, 1, 2, 3, 4].map((b) => (
                  <path
                    key={b}
                    d={`M 200 145 Q ${250 + b * 8} ${100 - b * 5} ${300 - b * 5} ${170 + b * 8} Q ${230} ${200 + b * 3} ${180 - b * 3} ${190 + b * 3}`}
                    fill="none"
                    stroke="#9aa8c0"
                    strokeWidth={3 - b * 0.4}
                    opacity={0.4 - b * 0.06}
                  />
                ))}

                {/* Eye region */}
                <circle cx="200" cy="145" r="12" fill="#0d1626" stroke="#475a7a" strokeWidth="1" opacity="0.6" />

                {/* AI detection overlay */}
                <circle cx="200" cy="145" r="55" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                <circle cx="200" cy="145" r="3" fill="#22d3ee" />

                {/* Detection crosshair */}
                <line x1="200" y1="125" x2="200" y2="165" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
                <line x1="180" y1="145" x2="220" y2="145" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />

                {/* Bounding box label */}
                <rect x="145" y="90" width="110" height="110" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                <text x="148" y="86" fill="#22d3ee" fontSize="7" fontFamily="monospace">DETECTED REGION</text>

                {/* Coordinate labels */}
                <text x="200" y="170" fill="#22d3ee" fontSize="6" fontFamily="monospace" textAnchor="middle">
                  {cyclone.currentLat.toFixed(1)}°N {cyclone.currentLon.toFixed(1)}°E
                </text>
              </svg>

              {/* Color scale */}
              <div className="absolute bottom-2 right-2 panel p-2">
                <div className="text-2xs text-ink-300 mb-1">Brightness Temp (K)</div>
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 rounded-sm" style={{ background: 'linear-gradient(to right, #0d1626, #243454, #475a7a, #9aa8c0, #c5cee0)' }} />
                </div>
                <div className="flex justify-between text-3xs text-ink-300 mt-0.5 font-mono">
                  <span>180</span><span>260</span>
                </div>
              </div>

              {/* DEMO label */}
              <div className="absolute top-2 left-2 badge bg-warn-500/20 text-warn-300">DEMO IMAGERY</div>
            </div>
          </div>
        </div>

        {/* AI Analysis panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-white">AI Detection Analysis</span>
            </div>
            <span className="badge bg-success-500/10 text-success-400">Cyclone Detected</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-ink-850 rounded-md border border-ink-700">
              <div>
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Detection Result</div>
                <div className="text-sm text-success-400 font-semibold mt-0.5">Cyclone Detected</div>
              </div>
              <div className="text-right">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Confidence</div>
                <div className="text-sm text-cyan-400 font-mono mt-0.5">{cyclone.confidence}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Crosshair size={10} /> Detected Center</div>
                <div className="text-sm text-white font-mono mt-1">{cyclone.currentLat.toFixed(2)}°N</div>
                <div className="text-sm text-white font-mono">{cyclone.currentLon.toFixed(2)}°E</div>
              </div>
              <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Circle size={10} /> Estimated Radius</div>
                <div className="text-sm text-white font-mono mt-1">{cyclone.radius} km</div>
                <div className="text-2xs text-ink-300">Core radius (R34)</div>
              </div>
            </div>

            <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
              <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1 mb-2"><Cloud size={10} /> Cloud Pattern Analysis</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-200">Spiral Structure</span>
                  <span className="text-xs text-cyan-400 font-medium">Well-defined</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-200">Eye Feature</span>
                  <span className="text-xs text-cyan-400 font-medium">Partially visible</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-200">Central Dense Overcast</span>
                  <span className="text-xs text-ink-100 font-medium">Present</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-200">Band Organization</span>
                  <span className="text-xs text-ink-100 font-medium">3 bands detected</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Waves size={10} /> Wind Estimate</div>
                <div className="text-sm text-white font-mono mt-1">{cyclone.maxWind} kt</div>
                <div className="text-2xs text-ink-300">From Dvorak + ML</div>
              </div>
              <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Clock size={10} /> Observation Time</div>
                <div className="text-xs text-white font-mono mt-1">{cyclone.observedAt}</div>
              </div>
            </div>

            {/* Model confidence breakdown */}
            <div className="p-3 bg-ink-850 rounded-md border border-ink-700">
              <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1 mb-2"><Target size={10} /> Model Confidence Breakdown</div>
              <div className="space-y-2">
                {[
                  { label: 'Detection (binary)', value: 96 },
                  { label: 'Center localization', value: 89 },
                  { label: 'Intensity estimation', value: 82 },
                  { label: 'Structure classification', value: 87 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-2xs mb-0.5">
                      <span className="text-ink-200">{m.label}</span>
                      <span className="text-cyan-400 font-mono">{m.value}%</span>
                    </div>
                    <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
