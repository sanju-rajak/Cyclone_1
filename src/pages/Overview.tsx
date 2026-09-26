import { useState } from 'react';
import { CycloneMap } from '@/components/CycloneMap';
import { CYCLONES, type Cyclone } from '@/data/demoData';
import { Activity, Globe, Eye, Cpu, MapPin, Wind, Gauge, ArrowRight } from 'lucide-react';

interface OverviewProps {
  onNavigate: (page: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const [selectedCyclone, setSelectedCyclone] = useState<Cyclone | null>(null);
  const [layers, setLayers] = useState({
    satellite: true,
    forecast: true,
    observations: true,
    windField: false,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = [
    { label: 'Active Systems', value: '02', sub: 'Bay of Bengal, Arabian Sea', icon: Activity, accent: 'text-warn-400' },
    { label: 'Monitored Regions', value: '14', sub: 'North Indian Ocean basin', icon: Globe, accent: 'text-cyan-400' },
    { label: 'Latest Observations', value: '128', sub: 'Last 24-hour window', icon: Eye, accent: 'text-blue-400' },
    { label: 'Model Status', value: 'Ready', sub: 'Awaiting next cycle', icon: Cpu, accent: 'text-success-500' },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Summary indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300">{s.label}</div>
                  <div className={`text-2xl font-bold mt-1 ${s.accent}`}>{s.value}</div>
                  <div className="text-2xs text-ink-300 mt-1">{s.sub}</div>
                </div>
                <div className="w-9 h-9 rounded-md bg-ink-800 border border-ink-700 flex items-center justify-center">
                  <Icon size={18} className={s.accent} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 panel">
          <div className="panel-header">
            <div>
              <h2 className="text-sm font-semibold text-white">Tropical Cyclone Monitoring Map</h2>
              <p className="text-2xs text-ink-300">North Indian Ocean Basin • Simulated observation data</p>
            </div>
            <div className="flex items-center gap-1.5">
              {([
                { key: 'satellite', label: 'Satellite' },
                { key: 'forecast', label: 'Forecast Track' },
                { key: 'observations', label: 'Observations' },
                { key: 'windField', label: 'Wind Field' },
              ] as const).map((l) => (
                <button
                  key={l.key}
                  onClick={() => toggleLayer(l.key)}
                  className={`tab-btn ${layers[l.key] ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[480px]">
            <CycloneMap
              selectedCyclone={selectedCyclone}
              onSelectCyclone={setSelectedCyclone}
              layers={layers}
            />
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {selectedCyclone ? (
            <CycloneInfoPanel cyclone={selectedCyclone} onNavigate={onNavigate} />
          ) : (
            <div className="panel p-4">
              <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300 mb-2">Cyclone Systems</div>
              <p className="text-xs text-ink-300 mb-3">Select a cyclone marker on the map to view detailed analysis.</p>
              {CYCLONES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCyclone(c)}
                  className="w-full text-left p-3 rounded-md hover:bg-ink-800 border border-ink-700 mb-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-warn-400" />
                      <span className="text-sm font-semibold text-white">{c.id}</span>
                    </div>
                    <span className="badge bg-warn-500/20 text-warn-300">{c.status}</span>
                  </div>
                  <div className="text-xs text-ink-200 mt-1">{c.name} • {c.category}</div>
                  <div className="text-2xs text-ink-300 mt-0.5 font-mono">
                    {c.currentLat.toFixed(1)}°N, {c.currentLon.toFixed(1)}°E
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent observations summary */}
          <div className="panel p-4">
            <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300 mb-3">Recent Satellite Passes</div>
            <div className="space-y-2">
              {[
                { src: 'INSAT-3DR', time: '17:30 UTC', region: 'Bay of Bengal' },
                { src: 'Himawari-9', time: '18:00 UTC', region: 'Full Disk' },
                { src: 'NOAA-20', time: '16:45 UTC', region: 'N. Indian Ocean' },
                { src: 'MODIS-Aqua', time: '15:30 UTC', region: 'Bay of Bengal N.' },
              ].map((o, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                    <span className="text-ink-100 font-medium">{o.src}</span>
                  </div>
                  <span className="text-ink-300 font-mono text-2xs">{o.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CycloneInfoPanel({ cyclone, onNavigate }: { cyclone: Cyclone; onNavigate: (p: string) => void }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warn-500 animate-pulse" />
          <span className="text-xs font-semibold text-white">CYCLONE SYSTEM</span>
        </div>
        <span className="badge bg-warn-500/20 text-warn-300">{cyclone.status}</span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="text-2xs text-ink-300 uppercase tracking-wider-2">System ID</div>
          <div className="text-sm font-mono text-white">{cyclone.id}</div>
        </div>
        <div>
          <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Name</div>
          <div className="text-sm text-white">{cyclone.name} • {cyclone.basin}</div>
        </div>
        <div>
          <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Current Classification</div>
          <div className="text-sm text-warn-400 font-medium">{cyclone.category}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Wind size={10} /> Max Sustained Wind</div>
            <div className="text-sm text-white font-mono">{cyclone.maxWind} kt</div>
          </div>
          <div>
            <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Gauge size={10} /> Central Pressure</div>
            <div className="text-sm text-white font-mono">{cyclone.centralPressure} hPa</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Position</div>
            <div className="text-xs text-white font-mono">{cyclone.currentLat.toFixed(1)}°N, {cyclone.currentLon.toFixed(1)}°E</div>
          </div>
          <div>
            <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Movement</div>
            <div className="text-xs text-white font-mono">{cyclone.movementDir} at {cyclone.movementSpeed} km/h</div>
          </div>
        </div>
        <div>
          <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Observation</div>
          <div className="text-xs text-ink-100 font-mono">{cyclone.observedAt}</div>
        </div>
        <div>
          <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Model Confidence</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${cyclone.confidence}%` }} />
            </div>
            <span className="text-xs text-cyan-400 font-mono">{cyclone.confidence}%</span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onNavigate('detection')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md hover:bg-cyan-500/20 transition-colors"
          >
            View Analysis <ArrowRight size={12} />
          </button>
          <button
            onClick={() => onNavigate('prediction')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-ink-800 text-ink-100 border border-ink-700 rounded-md hover:bg-ink-750 transition-colors"
          >
            View Forecast <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
