import { useState } from 'react';
import { CYCLONES, lonToX, latToY, MAP_W, MAP_H, INDIA_COASTLINE, SRI_LANKA } from '@/data/demoData';
import { TrendingUp, Wind, Gauge, MapPin, Clock, AlertTriangle } from 'lucide-react';

export function Prediction() {
  const [selectedId, setSelectedId] = useState(CYCLONES[0].id);
  const cyclone = CYCLONES.find((c) => c.id === selectedId)!;

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Cyclone Track & Intensity Prediction</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Track forecast map */}
        <div className="lg:col-span-2 panel">
          <div className="panel-header">
            <span className="text-xs font-semibold text-white">Forecast Track — {cyclone.name}</span>
            <span className="text-2xs text-ink-300">72-hour lead time • Uncertainty corridor shown</span>
          </div>
          <div className="h-[400px]">
            <ForecastMap cyclone={cyclone} />
          </div>
        </div>

        {/* Forecast summary */}
        <div className="space-y-4">
          <div className="panel">
            <div className="panel-header">
              <span className="text-xs font-semibold text-white">Forecast Summary</span>
              <span className="text-2xs text-ink-300 font-mono">{cyclone.id}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { lead: '24h', wind: cyclone.forecastTrack[0]?.intensity, pressure: cyclone.forecastTrack[0]?.pressure, lat: cyclone.forecastTrack[0]?.lat, lon: cyclone.forecastTrack[0]?.lon },
                  { lead: '48h', wind: cyclone.forecastTrack[2]?.intensity, pressure: cyclone.forecastTrack[2]?.pressure, lat: cyclone.forecastTrack[2]?.lat, lon: cyclone.forecastTrack[2]?.lon },
                  { lead: '72h', wind: cyclone.forecastTrack[4]?.intensity, pressure: cyclone.forecastTrack[4]?.pressure, lat: cyclone.forecastTrack[4]?.lat, lon: cyclone.forecastTrack[4]?.lon },
                ].map((f) => (
                  <div key={f.lead} className="p-2.5 bg-ink-850 rounded-md border border-ink-700 text-center">
                    <div className="text-2xs text-cyan-400 font-mono font-semibold">{f.lead}</div>
                    <div className="text-xs text-white font-mono mt-1">{f.wind ?? '—'} kt</div>
                    <div className="text-2xs text-ink-300 font-mono">{f.pressure ?? '—'} hPa</div>
                    <div className="text-2xs text-ink-300 font-mono mt-1">{f.lat?.toFixed(1)}°N</div>
                    <div className="text-2xs text-ink-300 font-mono">{f.lon?.toFixed(1)}°E</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-warn-500/10 border border-warn-500/30 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} className="text-warn-400" />
                  <span className="text-2xs font-semibold text-warn-300 uppercase tracking-wider-2">Landfall Risk</span>
                </div>
                <p className="text-xs text-ink-100">
                  {cyclone.id === 'TC-DEMO-01'
                    ? 'Forecast track indicates landfall near Andhra Pradesh coast within 48-72 hours. Sustained winds 70-85 kt at landfall.'
                    : 'System tracking northward along Arabian Sea coast. No immediate landfall risk, but rough seas expected.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-300 flex items-center gap-1"><Wind size={12} /> Peak Intensity</span>
                  <span className="text-white font-mono">{Math.max(...cyclone.forecastTrack.map(p => p.intensity))} kt</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-300 flex items-center gap-1"><Gauge size={12} /> Min Pressure</span>
                  <span className="text-white font-mono">{Math.min(...cyclone.forecastTrack.map(p => p.pressure))} hPa</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-300 flex items-center gap-1"><MapPin size={12} /> Movement</span>
                  <span className="text-white font-mono">{cyclone.movementDir} {cyclone.movementSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-300 flex items-center gap-1"><Clock size={12} /> Model Confidence</span>
                  <span className="text-cyan-400 font-mono">{cyclone.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ensemble forecast table */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-semibold text-white">Forecast Track Points</span>
          <span className="text-2xs text-ink-300">Simulated model output</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead Time</th>
                <th>Position</th>
                <th>Intensity</th>
                <th>Pressure</th>
                <th>Category</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {cyclone.forecastTrack.map((p, i) => (
                <tr key={i}>
                  <td className="font-mono text-2xs text-ink-200">{p.time}</td>
                  <td className="font-mono text-ink-100">{p.lat.toFixed(1)}°N, {p.lon.toFixed(1)}°E</td>
                  <td className="font-mono text-white">{p.intensity} kt</td>
                  <td className="font-mono text-white">{p.pressure} hPa</td>
                  <td className="text-ink-100">{p.category}</td>
                  <td><span className="badge bg-cyan-500/10 text-cyan-300">Forecast +{(i + 1) * 12}h</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ForecastMap({ cyclone }: { cyclone: typeof CYCLONES[0] }) {
  const coastlinePath = INDIA_COASTLINE.map(([lon, lat], i) => {
    const x = lonToX(lon, MAP_W);
    const y = latToY(lat, MAP_H);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const sriLankaPath = SRI_LANKA.map(([lon, lat], i) => {
    const x = lonToX(lon, MAP_W);
    const y = latToY(lat, MAP_H);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const allPoints = [...cyclone.track, ...cyclone.forecastTrack];
  const trackPath = allPoints.map((p, i) => {
    const x = lonToX(p.lon, MAP_W);
    const y = latToY(p.lat, MAP_H);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Uncertainty corridor
  const corridorUpper = allPoints.map((p, i) => {
    const x = lonToX(p.lon, MAP_W) + 12 + i * 1.5;
    const y = latToY(p.lat, MAP_H);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const corridorLower = [...allPoints].reverse().map((p, i) => {
    const x = lonToX(p.lon, MAP_W) - 12 - (allPoints.length - 1 - i) * 1.5;
    const y = latToY(p.lat, MAP_H);
    return `L${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full" style={{ background: '#0a1120' }}>
      <rect width={MAP_W} height={MAP_H} fill="#070b14" />
      {[65, 70, 75, 80, 85, 90, 95].map((lon) => (
        <line key={lon} x1={lonToX(lon, MAP_W)} y1={0} x2={lonToX(lon, MAP_W)} y2={MAP_H} stroke="#142238" strokeWidth="0.5" strokeDasharray="2,4" />
      ))}
      {[5, 10, 15, 20, 25].map((lat) => (
        <line key={lat} x1={0} y1={latToY(lat, MAP_H)} x2={MAP_W} y2={latToY(lat, MAP_H)} stroke="#142238" strokeWidth="0.5" strokeDasharray="2,4" />
      ))}

      <path d={coastlinePath} fill="#101c30" stroke="#243454" strokeWidth="1" />
      <path d={sriLankaPath} fill="#101c30" stroke="#243454" strokeWidth="1" />
      <text x={lonToX(78, MAP_W)} y={latToY(22, MAP_H)} fill="#475a7a" fontSize="11" fontWeight="600" textAnchor="middle">INDIA</text>
      <text x={lonToX(85, MAP_W)} y={latToY(16, MAP_H)} fill="#1a2a44" fontSize="13" fontWeight="700" textAnchor="middle" opacity="0.5">Bay of Bengal</text>
      <text x={lonToX(70, MAP_W)} y={latToY(14, MAP_H)} fill="#1a2a44" fontSize="13" fontWeight="700" textAnchor="middle" opacity="0.5">Arabian Sea</text>

      {/* Uncertainty corridor */}
      <path d={`${corridorUpper} ${corridorLower} Z`} fill="#22d3ee" fillOpacity="0.06" stroke="none" />

      {/* Track */}
      <path d={trackPath} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Observed points */}
      {cyclone.track.map((p, i) => {
        const x = lonToX(p.lon, MAP_W);
        const y = latToY(p.lat, MAP_H);
        return <circle key={`o-${i}`} cx={x} cy={y} r="3" fill="#22d3ee" />;
      })}

      {/* Forecast points */}
      {cyclone.forecastTrack.map((p, i) => {
        const x = lonToX(p.lon, MAP_W);
        const y = latToY(p.lat, MAP_H);
        return (
          <g key={`f-${i}`}>
            <circle cx={x} cy={y} r="3" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,1" />
            <text x={x + 6} y={y - 4} fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">+{(i + 1) * 12}h</text>
          </g>
        );
      })}

      {/* Current position */}
      <circle cx={lonToX(cyclone.currentLon, MAP_W)} cy={latToY(cyclone.currentLat, MAP_H)} r="6" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx={lonToX(cyclone.currentLon, MAP_W)} cy={latToY(cyclone.currentLat, MAP_H)} r="3" fill="#fbbf24" />
      <text x={lonToX(cyclone.currentLon, MAP_W) + 10} y={latToY(cyclone.currentLat, MAP_H) - 6} fill="#fff" fontSize="9" fontWeight="600" fontFamily="monospace">{cyclone.id}</text>
    </svg>
  );
}
