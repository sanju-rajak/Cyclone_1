import { LayoutDashboard, Satellite, ScanSearch, Layers3, TrendingUp, Route, History, Bell, Gauge, type LucideIcon } from 'lucide-react';

export type PageId = 'overview' | 'satellite' | 'detection' | 'classification' | 'prediction' | 'track' | 'historical' | 'alerts' | 'model';

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'satellite', label: 'Satellite Data', icon: Satellite },
  { id: 'detection', label: 'Cyclone Detection', icon: ScanSearch },
  { id: 'classification', label: 'Classification', icon: Layers3 },
  { id: 'prediction', label: 'Prediction', icon: TrendingUp },
  { id: 'track', label: 'Track Analysis', icon: Route },
  { id: 'historical', label: 'Historical Events', icon: History },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'model', label: 'Model Performance', icon: Gauge },
];

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
  alertCount: number;
}

export function Sidebar({ active, onNavigate, alertCount }: SidebarProps) {
  return (
    <aside className="w-56 bg-ink-900 border-r border-ink-700 flex flex-col flex-shrink-0">
      <div className="px-4 py-4 border-b border-ink-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C12 2 8 6 8 10C8 13 10 14 12 14C14 14 16 13 16 10C16 6 12 2 12 2Z" />
              <path d="M12 14C12 14 6 16 6 20C6 22 8 22 12 22C16 22 18 22 18 20C18 16 12 14 12 14Z" opacity="0.5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide leading-tight">CYCLONE</div>
            <div className="text-sm font-bold text-cyan-400 tracking-wide leading-tight">INTELLIGENCE</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-thin">
        <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300 px-2 mb-2">Monitoring</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400'
                  : 'text-ink-200 hover:text-ink-100 hover:bg-ink-800 border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-ink-300'} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'alerts' && alertCount > 0 && (
                <span className="ml-auto badge bg-warn-500/20 text-warn-300">{alertCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-ink-700 space-y-2">
        <div className="text-2xs font-semibold uppercase tracking-wider-2 text-ink-300 px-1">System Status</div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-300">Data Sources</span>
          <span className="text-ink-100 font-mono">5</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-300">Last Observation</span>
          <span className="text-warn-400 font-mono">Demo</span>
        </div>
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
          <span className="text-ink-200">Prototype • Simulated Data</span>
        </div>
      </div>
    </aside>
  );
}
