import { useState } from 'react';
import { SATELLITE_OBSERVATIONS, FUSION_STAGES } from '@/data/demoData';
import { Satellite, ChevronRight, X, Layers, ArrowDown } from 'lucide-react';

const SOURCE_TABS = ['INSAT', 'NOAA', 'Himawari', 'Sentinel', 'MODIS'] as const;
type SourceTab = typeof SOURCE_TABS[number];

const STATUS_COLORS: Record<string, string> = {
  Processed: 'text-success-400 bg-success-500/10',
  Processing: 'text-cyan-400 bg-cyan-500/10',
  Acquired: 'text-warn-400 bg-warn-500/10',
  Scheduled: 'text-ink-300 bg-ink-700',
};

export function SatelliteData() {
  const [activeTab, setActiveTab] = useState<SourceTab | 'All'>('All');
  const [selectedStage, setSelectedStage] = useState<typeof FUSION_STAGES[0] | null>(null);

  const filtered = activeTab === 'All'
    ? SATELLITE_OBSERVATIONS
    : SATELLITE_OBSERVATIONS.filter((o) => o.sourceFamily === activeTab);

  return (
    <div className="p-5 space-y-5">
      {/* Source tabs */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Satellite size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Satellite Observations</h2>
          </div>
          <span className="text-2xs text-ink-300">Multi-source data ingestion • Simulated</span>
        </div>
        <div className="px-4 py-3 border-b border-ink-700">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('All')}
              className={`tab-btn ${activeTab === 'All' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              All Sources ({SATELLITE_OBSERVATIONS.length})
            </button>
            {SOURCE_TABS.map((tab) => {
              const count = SATELLITE_OBSERVATIONS.filter((o) => o.sourceFamily === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Observation table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Timestamp</th>
                <th>Region</th>
                <th>Sensor / Product</th>
                <th>Resolution</th>
                <th>Cloud Cover</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-ink-100">{o.source}</td>
                  <td className="font-mono text-2xs text-ink-200">{o.timestamp}</td>
                  <td className="text-ink-100">{o.region}</td>
                  <td>
                    <div className="text-ink-100">{o.sensor}</div>
                    <div className="text-2xs text-ink-300">{o.product}</div>
                  </td>
                  <td className="font-mono text-ink-200">{o.resolution}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-ink-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${o.cloudCover > 50 ? 'bg-warn-500' : 'bg-cyan-500'}`}
                          style={{ width: `${o.cloudCover}%` }}
                        />
                      </div>
                      <span className="text-2xs font-mono text-ink-200">{o.cloudCover}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison mode */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Comparison Mode — Raw vs Processed</h2>
          </div>
          <span className="text-2xs text-ink-300">Demonstrates pre-processing pipeline output</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
          {[
            { label: 'Before (Raw IR)', desc: 'Unprocessed INSAT-3DR brightness temperature', filter: 'brightness(1.1) contrast(1.3) hue-rotate(180deg)' },
            { label: 'Current (Calibrated)', desc: 'Radiometric calibration + georeferencing', filter: 'brightness(0.9) contrast(1.5) hue-rotate(200deg) saturate(1.2)' },
            { label: 'Processed (Feature Map)', desc: 'Cloud mask + feature extraction output', filter: 'brightness(0.8) contrast(2) hue-rotate(220deg) saturate(1.5) invert(0.3)' },
          ].map((img, i) => (
            <div key={i} className="border border-ink-700 rounded-md overflow-hidden">
              <div
                className="h-40 bg-ink-850 flex items-center justify-center relative"
                style={{
                  background: `radial-gradient(ellipse at 60% 40%, ${i === 0 ? '#1a2a44' : i === 1 ? '#0d1626' : '#142238'} 0%, #070b14 70%)`,
                }}
              >
                {/* Simulated cyclone cloud pattern */}
                <svg viewBox="0 0 200 160" className="w-full h-full" style={{ filter: img.filter }}>
                  <defs>
                    <radialGradient id={`cloud-${i}`} cx="50%" cy="45%" r="50%">
                      <stop offset="0%" stopColor="#c5cee0" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#6b7d9c" stopOpacity="0.6" />
                      <stop offset="80%" stopColor="#243454" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="100" cy="75" rx="70" ry="55" fill={`url(#cloud-${i})`} />
                  {/* Spiral bands */}
                  {[0, 1, 2, 3].map((b) => (
                    <path
                      key={b}
                      d={`M ${100 + b * 5} ${75} Q ${130 + b * 5} ${50} ${150 - b * 3} ${90 + b * 3}`}
                      fill="none"
                      stroke="#9aa8c0"
                      strokeWidth="2"
                      opacity={0.3 - b * 0.05}
                    />
                  ))}
                  {i === 2 && (
                    <>
                      <circle cx="100" cy="75" r="5" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                      <circle cx="100" cy="75" r="12" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="3,2" />
                      <text x="105" y="70" fill="#22d3ee" fontSize="7" fontFamily="monospace">CENTER DETECTED</text>
                    </>
                  )}
                </svg>
                <div className="absolute top-2 left-2 badge bg-ink-900/80 text-ink-200">{img.label}</div>
              </div>
              <div className="p-3">
                <div className="text-xs font-medium text-ink-100">{img.label}</div>
                <div className="text-2xs text-ink-300 mt-0.5">{img.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Fusion Pipeline */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Multi-Source Data Fusion Pipeline</h2>
          </div>
          <span className="text-2xs text-ink-300">Click any stage for details</span>
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row items-stretch gap-1 overflow-x-auto scrollbar-thin">
            {FUSION_STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-1 flex-1 min-w-0">
                <button
                  onClick={() => setSelectedStage(stage)}
                  className={`flex-1 min-w-[100px] px-3 py-3 rounded-md border text-center transition-colors ${
                    selectedStage?.id === stage.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-ink-850 border-ink-700 text-ink-200 hover:bg-ink-800 hover:border-ink-600'
                  }`}
                >
                  <div className="text-2xs font-mono text-ink-300 mb-1">{String(i + 1).padStart(2, '0')}</div>
                  <div className="text-xs font-medium leading-tight">{stage.label}</div>
                </button>
                {i < FUSION_STAGES.length - 1 && (
                  <ChevronRight size={14} className="text-ink-400 hidden lg:block flex-shrink-0" />
                )}
                {i < FUSION_STAGES.length - 1 && (
                  <ArrowDown size={14} className="text-ink-400 lg:hidden flex-shrink-0 mx-auto" />
                )}
              </div>
            ))}
          </div>

          {/* Stage detail */}
          {selectedStage ? (
            <div className="mt-4 p-4 bg-ink-850 border border-cyan-500/20 rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider-2">{selectedStage.label}</div>
                  <p className="text-sm text-ink-100 mt-2 leading-relaxed">{selectedStage.detail}</p>
                </div>
                <button onClick={() => setSelectedStage(null)} className="text-ink-300 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-ink-850 border border-ink-700 rounded-md text-center">
              <p className="text-xs text-ink-300">Select a pipeline stage above to view its technical description.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
