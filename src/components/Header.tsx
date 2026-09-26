import { Search, Bell, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 bg-ink-900 border-b border-ink-700 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-ink-300 leading-tight">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            placeholder="Search systems, regions..."
            className="w-56 bg-ink-850 border border-ink-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-ink-100 placeholder-ink-300 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-200 border-l border-ink-700 pl-4">
          <Clock size={14} className="text-ink-300" />
          <span className="font-mono">26 Sep 2026 • 18:00 UTC</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-1.5 rounded-md hover:bg-ink-800 text-ink-200"
          >
            <Bell size={16} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-warn-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 panel shadow-xl z-50">
              <div className="panel-header">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="badge bg-warn-500/20 text-warn-300">4 Active</span>
              </div>
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
                <div className="px-2 py-2 hover:bg-ink-800 rounded">
                  <div className="text-xs font-medium text-white">Warning: TC-DEMO-01</div>
                  <div className="text-2xs text-ink-300">Landfall expected within 48h • Andhra Pradesh</div>
                </div>
                <div className="px-2 py-2 hover:bg-ink-800 rounded">
                  <div className="text-xs font-medium text-white">Watch: TC-DEMO-01</div>
                  <div className="text-2xs text-ink-300">Track approaching Odisha coast</div>
                </div>
                <div className="px-2 py-2 hover:bg-ink-800 rounded">
                  <div className="text-xs font-medium text-white">Advisory: TC-DEMO-02</div>
                  <div className="text-2xs text-ink-300">Rough sea conditions • Maharashtra</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-ink-700 pl-4">
          <div className="w-7 h-7 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-xs font-semibold text-cyan-300">
            RS
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-medium text-white leading-tight">Dr. R. Sharma</div>
            <div className="text-2xs text-ink-300 leading-tight">MoES Analyst</div>
          </div>
          <ChevronDown size={14} className="text-ink-300" />
        </div>
      </div>
    </header>
  );
}
