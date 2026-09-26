import { useState } from 'react';
import { HISTORICAL_EVENTS } from '@/data/demoData';
import { History, Search } from 'lucide-react';

export function HistoricalEvents() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'wind' | 'pressure'>('year');

  const filtered = HISTORICAL_EVENTS
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.basin.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'wind') return b.maxWind - a.maxWind;
      return a.minPressure - b.minPressure;
    });

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <History size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Historical Cyclone Events</span>
        <span className="text-2xs text-ink-300 ml-2">North Indian Ocean basin records</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or basin..."
            className="w-full bg-ink-850 border border-ink-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-ink-100 placeholder-ink-300 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs text-ink-300">Sort by:</span>
          {([
            { key: 'year', label: 'Year' },
            { key: 'wind', label: 'Max Wind' },
            { key: 'pressure', label: 'Min Pressure' },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`tab-btn ${sortBy === s.key ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-semibold text-white">{filtered.length} Events</span>
          <span className="text-2xs text-ink-300">IMD historical records (simulated dataset)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Basin</th>
                <th>Category</th>
                <th>Max Wind</th>
                <th>Min Pressure</th>
                <th>Landfall</th>
                <th>Location</th>
                <th>Casualties</th>
                <th>Damage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="font-medium text-white">{e.name}</td>
                  <td className="font-mono text-ink-200">{e.year}</td>
                  <td className="text-ink-100">{e.basin}</td>
                  <td>
                    <span className="badge" style={{
                      background: e.maxWind > 120 ? 'rgba(185,28,28,0.15)' : e.maxWind > 90 ? 'rgba(239,68,68,0.15)' : e.maxWind > 63 ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)',
                      color: e.maxWind > 120 ? '#b91c1c' : e.maxWind > 90 ? '#ef4444' : e.maxWind > 63 ? '#fbbf24' : '#22c55e',
                    }}>
                      {e.category}
                    </span>
                  </td>
                  <td className="font-mono text-white">{e.maxWind} kt</td>
                  <td className="font-mono text-white">{e.minPressure} hPa</td>
                  <td className="font-mono text-2xs text-ink-200">{e.landfall}</td>
                  <td className="text-ink-100 text-xs">{e.landfallLocation}</td>
                  <td className="font-mono text-ink-200">{e.casualties}</td>
                  <td className="font-mono text-ink-200">{e.damage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: HISTORICAL_EVENTS.length, sub: 'in dataset' },
          { label: 'Avg Max Wind', value: `${Math.round(HISTORICAL_EVENTS.reduce((a, e) => a + e.maxWind, 0) / HISTORICAL_EVENTS.length)} kt`, sub: 'across all events' },
          { label: 'Severe+ Events', value: HISTORICAL_EVENTS.filter(e => e.maxWind >= 64).length, sub: 'Very Severe or above' },
          { label: 'Total Casualties', value: HISTORICAL_EVENTS.reduce((a, e) => a + parseInt(e.casualties), 0), sub: 'reported' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300">{s.label}</div>
            <div className="text-xl font-bold text-white mt-1">{s.value}</div>
            <div className="text-2xs text-ink-300 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
