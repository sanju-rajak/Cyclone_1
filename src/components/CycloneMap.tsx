import { useState } from 'react';
import {
  CYCLONES, INDIA_COASTLINE, SRI_LANKA, lonToX, latToY, MAP_W, MAP_H,
  type Cyclone,
} from '@/data/demoData';

// Graticule lines
const LON_LINES = [65, 70, 75, 80, 85, 90, 95];
const LAT_LINES = [5, 10, 15, 20, 25];

function categoryColor(cat: string): string {
  switch (cat) {
    case 'Depression': return '#6b7d9c';
    case 'Deep Depression': return '#60a5fa';
    case 'Cyclonic Storm': return '#22c55e';
    case 'Severe Cyclonic Storm': return '#fbbf24';
    case 'Very Severe Cyclonic Storm': return '#f59e0b';
    case 'Extremely Severe Cyclonic Storm': return '#ef4444';
    case 'Super Cyclonic Storm': return '#b91c1c';
    default: return '#6b7d9c';
  }
}

interface CycloneMapProps {
  selectedCyclone: Cyclone | null;
  onSelectCyclone: (c: Cyclone | null) => void;
  layers: { satellite: boolean; forecast: boolean; observations: boolean; windField: boolean };
}

export function CycloneMap({ selectedCyclone, onSelectCyclone, layers }: CycloneMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

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

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full" style={{ background: '#0a1120' }}>
        {/* Ocean background gradient */}
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#0d1626" />
            <stop offset="100%" stopColor="#070b14" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={MAP_W} height={MAP_H} fill="url(#oceanGrad)" />

        {/* Graticule */}
        {LON_LINES.map((lon) => (
          <line key={`lon-${lon}`} x1={lonToX(lon, MAP_W)} y1={0} x2={lonToX(lon, MAP_W)} y2={MAP_H} stroke="#142238" strokeWidth="0.5" strokeDasharray="2,4" />
        ))}
        {LAT_LINES.map((lat) => (
          <line key={`lat-${lat}`} x1={0} y1={latToY(lat, MAP_H)} x2={MAP_W} y2={latToY(lat, MAP_H)} stroke="#142238" strokeWidth="0.5" strokeDasharray="2,4" />
        ))}
        {/* Graticule labels */}
        {LON_LINES.map((lon) => (
          <text key={`lon-l-${lon}`} x={lonToX(lon, MAP_W) + 2} y={MAP_H - 4} fill="#334766" fontSize="8" fontFamily="monospace">{lon}°E</text>
        ))}
        {LAT_LINES.map((lat) => (
          <text key={`lat-l-${lat}`} x={2} y={latToY(lat, MAP_H) - 2} fill="#334766" fontSize="8" fontFamily="monospace">{lat}°N</text>
        ))}

        {/* Land masses */}
        <path d={coastlinePath} fill="#101c30" stroke="#243454" strokeWidth="1" />
        <path d={sriLankaPath} fill="#101c30" stroke="#243454" strokeWidth="1" />

        {/* Land labels */}
        <text x={lonToX(78, MAP_W)} y={latToY(22, MAP_H)} fill="#475a7a" fontSize="11" fontWeight="600" textAnchor="middle">INDIA</text>
        <text x={lonToX(80.5, MAP_W)} y={latToY(7, MAP_H)} fill="#475a7a" fontSize="8" fontWeight="500" textAnchor="middle">SRI LANKA</text>

        {/* Sea labels */}
        <text x={lonToX(85, MAP_W)} y={latToY(16, MAP_H)} fill="#1a2a44" fontSize="13" fontWeight="700" textAnchor="middle" opacity="0.6">Bay of Bengal</text>
        <text x={lonToX(70, MAP_W)} y={latToY(14, MAP_H)} fill="#1a2a44" fontSize="13" fontWeight="700" textAnchor="middle" opacity="0.6">Arabian Sea</text>

        {/* Satellite observation coverage (if layer enabled) */}
        {layers.satellite && CYCLONES.map((c) => (
          <circle
            key={`sat-${c.id}`}
            cx={lonToX(c.currentLon, MAP_W)}
            cy={latToY(c.currentLat, MAP_H)}
            r={60}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.5"
            strokeDasharray="3,3"
            opacity="0.25"
          />
        ))}

        {/* Cyclone tracks and markers */}
        {CYCLONES.map((c) => {
          const isSelected = selectedCyclone?.id === c.id;
          const isHovered = hovered === c.id;
          const color = categoryColor(c.category);

          // Historical track
          const trackPath = c.track.map((p, i) => {
            const x = lonToX(p.lon, MAP_W);
            const y = latToY(p.lat, MAP_H);
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          // Forecast track
          const forecastPath = c.forecastTrack.map((p, i) => {
            const x = lonToX(p.lon, MAP_W);
            const y = latToY(p.lat, MAP_H);
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          // Uncertainty corridor (simplified - offset polygon)
          const lastForecast = c.forecastTrack[c.forecastTrack.length - 1];
          const corridorPoints = [
            ...c.forecastTrack.map(p => {
              const x = lonToX(p.lon, MAP_W);
              const y = latToY(p.lat, MAP_H);
              return { x: x + 15, y };
            }),
            ...[...c.forecastTrack].reverse().map(p => {
              const x = lonToX(p.lon, MAP_W);
              const y = latToY(p.lat, MAP_H);
              return { x: x - 15, y };
            }),
          ];
          const corridorPath = corridorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

          // Wind field (if enabled)
          const windRadius = layers.windField ? (c.radius / 10) : 0;

          return (
            <g key={c.id}>
              {/* Wind field */}
              {layers.windField && (
                <>
                  <circle cx={lonToX(c.currentLon, MAP_W)} cy={latToY(c.currentLat, MAP_H)} r={windRadius} fill={color} fillOpacity="0.06" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
                  <circle cx={lonToX(c.currentLon, MAP_W)} cy={latToY(c.currentLat, MAP_H)} r={windRadius * 0.6} fill={color} fillOpacity="0.08" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
                </>
              )}

              {/* Uncertainty corridor */}
              {layers.forecast && (
                <path d={corridorPath} fill={color} fillOpacity="0.06" stroke="none" />
              )}

              {/* Historical track */}
              <path d={trackPath} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="0" />

              {/* Forecast track */}
              {layers.forecast && (
                <>
                  <path d={forecastPath} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4,3" />
                  {c.forecastTrack.map((p, i) => (
                    <circle key={`fc-${c.id}-${i}`} cx={lonToX(p.lon, MAP_W)} cy={latToY(p.lat, MAP_H)} r="2" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2,1" opacity="0.5" />
                  ))}
                </>
              )}

              {/* Observation points */}
              {layers.observations && c.track.map((p, i) => (
                <circle key={`obs-${c.id}-${i}`} cx={lonToX(p.lon, MAP_W)} cy={latToY(p.lat, MAP_H)} r="1.5" fill={color} opacity="0.6" />
              ))}

              {/* Current cyclone marker */}
              <g
                onClick={() => onSelectCyclone(isSelected ? null : c)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={lonToX(c.currentLon, MAP_W)}
                  cy={latToY(c.currentLat, MAP_H)}
                  r={isSelected || isHovered ? 10 : 8}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <circle
                  cx={lonToX(c.currentLon, MAP_W)}
                  cy={latToY(c.currentLat, MAP_H)}
                  r={isSelected ? 5 : 4}
                  fill={color}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />
                <text
                  x={lonToX(c.currentLon, MAP_W) + 12}
                  y={latToY(c.currentLat, MAP_H) - 6}
                  fill={isSelected ? '#fff' : '#c5cee0'}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {c.id}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 panel p-3 text-2xs space-y-1.5">
        <div className="font-semibold text-ink-200 uppercase tracking-wider-2 mb-1">Legend</div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-ink-300" /> Historical Track</div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 border-t border-dashed border-ink-300" /> Forecast Track</div>
        <div className="flex items-center gap-2"><span className="w-3 h-2 bg-cyan-400/10 border border-cyan-400/30 border-dashed" /> Satellite Coverage</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warn-400/20 border border-warn-400/50" /> Wind Field</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-warn-400" /> Active System</div>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button className="w-8 h-8 panel flex items-center justify-center text-ink-200 hover:text-white hover:bg-ink-800 text-lg">+</button>
        <button className="w-8 h-8 panel flex items-center justify-center text-ink-200 hover:text-white hover:bg-ink-800 text-lg">−</button>
      </div>
    </div>
  );
}
