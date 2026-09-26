import { useState } from 'react';
import { Sidebar, type PageId } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Overview } from '@/pages/Overview';
import { SatelliteData } from '@/pages/SatelliteData';
import { CycloneDetection } from '@/pages/CycloneDetection';
import { Classification } from '@/pages/Classification';
import { Prediction } from '@/pages/Prediction';
import { TrackAnalysis } from '@/pages/TrackAnalysis';
import { HistoricalEvents } from '@/pages/HistoricalEvents';
import { Alerts } from '@/pages/Alerts';
import { ModelPerformance } from '@/pages/ModelPerformance';
import { ALERTS } from '@/data/demoData';

const PAGE_META: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: 'Tropical Cyclone Monitoring', subtitle: 'AI-assisted analysis of multi-source satellite observations' },
  satellite: { title: 'Satellite Observations', subtitle: 'Multi-source data ingestion & fusion pipeline' },
  detection: { title: 'Cyclone Detection Analysis', subtitle: 'AI-based cyclone identification from satellite imagery' },
  classification: { title: 'Intensity Classification', subtitle: 'IMD scale-based cyclone category assignment' },
  prediction: { title: 'Track & Intensity Prediction', subtitle: 'Forecast model output with uncertainty estimation' },
  track: { title: 'Track Analysis', subtitle: 'Historical and forecast trajectory analysis' },
  historical: { title: 'Historical Events', subtitle: 'Past cyclone events in the North Indian Ocean basin' },
  alerts: { title: 'Alerts & Warnings', subtitle: 'Issued advisories for active cyclone systems' },
  model: { title: 'Model Performance', subtitle: 'Evaluation metrics and training diagnostics' },
};

function App() {
  const [page, setPage] = useState<PageId>('overview');
  const meta = PAGE_META[page];

  return (
    <div className="h-screen flex bg-ink-950 overflow-hidden">
      <Sidebar active={page} onNavigate={setPage} alertCount={ALERTS.length} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {page === 'overview' && <Overview onNavigate={(p) => setPage(p as PageId)} />}
          {page === 'satellite' && <SatelliteData />}
          {page === 'detection' && <CycloneDetection />}
          {page === 'classification' && <Classification />}
          {page === 'prediction' && <Prediction />}
          {page === 'track' && <TrackAnalysis />}
          {page === 'historical' && <HistoricalEvents />}
          {page === 'alerts' && <Alerts />}
          {page === 'model' && <ModelPerformance />}
        </main>
      </div>
    </div>
  );
}

export default App;
