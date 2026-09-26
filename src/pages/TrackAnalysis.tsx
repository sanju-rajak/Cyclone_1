import { useState } from 'react';
import { CYCLONES, lonToX, latToY, MAP_W, MAP_H, INDIA_COASTLINE, SRI_LANKA } from '@/data/demoData';
import { Route, Wind, Gauge, Navigation } from 'lucide-react';

export function TrackAnalysis() {
  const [selectedId, setSelectedId] = useState(CYCLONES[0].id);
  const cyclone = CYCLONES.find((c) => c.id === selectedId)!;
  const allPoints = [...cyclone.track, ...cyclone.forecastTrack];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Route size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Track Analysis</span>
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
        {/* Track map */}
        <div className="lg:col-span-2 panel">
          <div className="panel-header">
            <span className="text-xs font-semibold text-white">Historical + Forecast Track</span>
            <span className="text-2xs text-ink-300">Full lifecycle trajectory</span>
          </div>
          <div className="h-[400px]">
            <TrackMap cyclone={cyclone} />
          </div>
        </div>

        {/* Track statistics */}
        <div className="space-y-4">
          <div className="panel">
            <div className="panel-header">
              <span className="text-xs font-semibold text-white">Track Statistics</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Navigation size={10} /> Total Distance</div>
                <div className="text-sm text-white font-mono mt-1">{calculateDistance(allPoints)} km</div>
              </div>
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Wind size={10} /> Peak Intensity</div>
                <div className="text-sm text-white font-mono mt-1">{Math.max(...allPoints.map(p => p.intensity))} kt</div>
              </div>
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2 flex items-center gap-1"><Gauge size={10} /> Min Pressure</div>
                <div className="text-sm text-white font-mono mt-1">{Math.min(...allPoints.map(p => p.pressure))} hPa</div>
              </div>
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Duration</div>
                <div className="text-sm text-white font-mono mt-1">{cyclone.track[0].time.split('•')[0]} → {cyclone.forecastTrack[cyclone.forecastTrack.length - 1].time.split('•')[0]}</div>
              </div>
              <div className="p-2.5 bg-ink-850 rounded-md border border-ink-700">
                <div className="text-2xs text-ink-300 uppercase tracking-wider-2">Basin</div>
                <div className="text-sm text-white mt-1">{cyclone.basin}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track point table */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-semibold text-white">Track Points — Observed + Forecast</span>
          <span className="text-2xs text-ink-300">All positions with intensity data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Wind (kt)</th>
                <th>Pressure (hPa)</th>
                <th>Category</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {allPoints.map((p, i) => (
                <tr key={i}>
                  <td className="font-mono text-2xs text-ink-300">{String(i + 1).padStart(2, '0')}</td>
                  <td className="font-mono text-2xs text-ink-200">{p.time}</td>
                  <td className="font-mono text-ink-100">{p.lat.toFixed(2)}°N</td>
                  <td className="font-mono text-ink-100">{p.lon.toFixed(2)}°E</td>
                  <td className="font-mono text-white">{p.intensity}</td>
                  <td className="font-mono text-white">{p.pressure}</td>
                  <td className="text-ink-100">{p.category}</td>
                  <td>
                    {i < cyclone.track.length ? (
                      <span className="badge bg-cyan-500/10 text-cyan-300">Observed</span>
                    ) : (
                      <span className="badge bg-warn-500/10 text-warn-300">Forecast</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function calculateDistance(points: { lat: number; lon: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i].lon - points[i - 1].lon) * 111 * Math.cos((points[i].lat * Math.PI) / 180);
    const dy = (points[i].lat - points[i - 1].lat) * 111;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.round(total);
}

function TrackMap({ cyclone }: { cyclone: typeof CYCLONES[0] }) {
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

      {/* Track with intensity-colored segments */}
      {allPoints.map((p, i) => {
        if (i === 0) return null;
        const prev = allPoints[i - 1];
        const x1 = lonToX(prev.lon, MAP_W);
        const y1 = latToY(prev.lat, MAP_H);
        const x2 = lonToX(p.lon, MAP_W);
        const y2 = latToY(p.lat, MAP_H);
        const isForecast = i >= cyclone.track.length;
        const color = p.intensity > 90 ? '#ef4444' : p.intensity > 63 ? '#fbbf24' : p.intensity > 47 ? '#22c55e' : '#60a5fa';
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray={isForecast ? '4,3' : '0'} opacity={isForecast ? 0.5 : 0.7} />
        );
      })}

      {/* Points */}
      {allPoints.map((p, i) => {
        const x = lonToX(p.lon, MAP_W);
        const y = latToY(p.lat, MAP_H);
        const isForecast = i >= cyclone.track.length;
        const color = p.intensity > 90 ? '#ef4444' : p.intensity > 63 ? '#fbbf24' : p.intensity > 47 ? '#22c55e' : '#60a5fa';
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={isForecast ? 2.5 : 3.5} fill={isForecast ? 'none' : color} stroke={color} strokeWidth="1" />
            {i % 2 === 0 && (
              <text x={x + 6} y={y - 3} fill="#9aa8c0" fontSize="6" fontFamily="monospace" opacity="0.6">{p.intensity}kt</text>
            )}
          </g>
        );
      })}

      {/* Current position highlight */}
      <circle cx={lonToX(cyclone.currentLon, MAP_W)} cy={latToY(cyclone.currentLat, MAP_H)} r="8" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
