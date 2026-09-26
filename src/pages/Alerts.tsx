import { ALERTS } from '@/data/demoData';
import { Bell, AlertTriangle, Eye, ShieldAlert, MapPin, Clock } from 'lucide-react';

const SEVERITY_CONFIG = {
  Warning: { color: '#ef4444', bg: 'bg-danger-500/10', border: 'border-danger-500/30', text: 'text-danger-400', icon: AlertTriangle },
  Watch: { color: '#fbbf24', bg: 'bg-warn-500/10', border: 'border-warn-500/30', text: 'text-warn-400', icon: Eye },
  Advisory: { color: '#22d3ee', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: ShieldAlert },
};

export function Alerts() {
  const warnings = ALERTS.filter((a) => a.severity === 'Warning');
  const watches = ALERTS.filter((a) => a.severity === 'Watch');
  const advisories = ALERTS.filter((a) => a.severity === 'Advisory');

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bell size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-white">Cyclone Alerts & Warnings</span>
        <span className="text-2xs text-ink-300 ml-2">Issued advisories for active systems</span>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Warnings', count: warnings.length, config: SEVERITY_CONFIG.Warning },
          { label: 'Watches', count: watches.length, config: SEVERITY_CONFIG.Watch },
          { label: 'Advisories', count: advisories.length, config: SEVERITY_CONFIG.Advisory },
        ].map((s) => {
          const Icon = s.config.icon;
          return (
            <div key={s.label} className={`stat-card ${s.config.bg} ${s.config.border} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300">{s.label}</div>
                  <div className={`text-2xl font-bold mt-1 ${s.config.text}`}>{String(s.count).padStart(2, '0')}</div>
                </div>
                <Icon size={20} className={s.config.text} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {ALERTS.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;
          return (
            <div key={alert.id} className={`panel border-l-4 ${config.border}`} style={{ borderLeftColor: config.color, borderLeftWidth: '3px' }}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={config.text} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${config.bg} ${config.text}`}>{alert.severity}</span>
                        <span className="text-xs font-mono text-ink-300">{alert.id}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1.5">{alert.system}</div>
                      <div className="text-xs text-ink-200 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-ink-300" /> {alert.region}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ink-100 mt-3 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-ink-700">
                  <div className="flex items-center gap-1.5 text-2xs text-ink-300">
                    <Clock size={11} /> Issued: <span className="text-ink-100 font-mono">{alert.issuedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-2xs text-ink-300">
                    <Clock size={11} /> Valid until: <span className="text-ink-100 font-mono">{alert.validUntil}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-ink-850 border border-ink-700 rounded-md text-center">
        <p className="text-2xs text-ink-300">All alerts are simulated for prototype demonstration. In a production system, these would be issued by IMD/MoES and distributed through official channels.</p>
      </div>
    </div>
  );
}
