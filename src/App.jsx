import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LoadingSkeleton from './components/LoadingSkeleton';

// Pages
import OverviewPage from './pages/OverviewPage';
import CorridorHealthPage from './pages/CorridorHealthPage';
import MaintenanceQueuePage from './pages/MaintenanceQueuePage';
import BlockBoardPage from './pages/BlockBoardPage';
import AiVsManualPage from './pages/AiVsManualPage';
import CoaCalendarPage from './pages/CoaCalendarPage';
import GoodsForecastPage from './pages/GoodsForecastPage';
import AssetOverviewPage from './pages/AssetOverviewPage';
import ConflictDetectorPage from './pages/ConflictDetectorPage';
import ScheduleStripPage from './pages/ScheduleStripPage';

const DashboardContent = () => {
  const { isLoading, loadingStatus, loadedCount, totalFiles, activeTab } = useData();

  if (isLoading) {
    return (
      <LoadingSkeleton
        status={loadingStatus}
        loadedCount={loadedCount}
        totalFiles={totalFiles}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'corridors':
        return <CorridorHealthPage />;
      case 'maintenance':
        return <MaintenanceQueuePage />;
      case 'board':
        return <BlockBoardPage />;
      case 'ai-vs-manual':
        return <AiVsManualPage />;
      case 'coa-calendar':
        return <CoaCalendarPage />;
      case 'goods-forecast':
        return <GoodsForecastPage />;
      case 'asset-overview':
        return <AssetOverviewPage />;
      case 'conflicts':
        return <ConflictDetectorPage />;
      case 'schedules':
        return <ScheduleStripPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3ECD9]">
      <Header />
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {renderActiveModule()}
      </main>
      <footer className="bg-[#0B1F3A] text-[#F3ECD9] text-center p-4 border-t-4 border-[#7A1F2B] font-mono text-xs">
        <p className="uppercase tracking-widest text-[#D4AF37]">
          MINISTRY OF RAILWAYS • SIH26027 AUTOMATIC BLOCK PLANNING PROTOTYPE
        </p>
        <p className="text-white/60 text-[10px] mt-1">
          block_requests, coa_block_availability, goods_train_forecast, and historical_block_plans are locally-generated synthetic prototype data, not real Indian Railways operational records.
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}

export default App;
