import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import api from './services/api';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LoadingSkeleton from './components/LoadingSkeleton';
import TaskInspectorModal from './components/TaskInspectorModal';

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
  const {
    isLoading,
    loadingStatus,
    loadedCount,
    totalFiles,
    activeTab,
    inspectedTaskId,
    setInspectedTaskId,
    backendError,
    apiConnected,
    fetchBackendData
  } = useData();

  if (isLoading) {
    return (
      <LoadingSkeleton
        status={loadingStatus}
        loadedCount={loadedCount}
        totalFiles={totalFiles}
      />
    );
  }

  if (backendError && !apiConnected) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex flex-col items-center justify-center p-6 text-[#F3ECD9]">
        <div className="w-full max-w-xl bg-[#0B1320] border-4 border-[#7A1F2B] shadow-[0_0_40px_rgba(122,31,43,0.8)] p-8 rounded relative text-center font-mono">
          <div className="w-16 h-16 bg-[#7A1F2B] text-[#D4AF37] rounded-full mx-auto flex items-center justify-center border-2 border-[#D4AF37] shadow mb-4">
            <span className="text-2xl font-bold">⚠️</span>
          </div>

          <h2 className="font-display text-2xl uppercase tracking-wider text-[#FF2E4C] mb-2">
            FASTAPI BACKEND UNAVAILABLE
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-4">
            UNABLE TO LOAD LIVE DATA FROM {api.baseUrl}
          </p>

          <div className="bg-black/60 p-4 rounded border border-white/20 text-left text-xs space-y-2 mb-6 text-white/80">
            <p className="text-[#FFB800] font-bold">Error Notice:</p>
            <p className="text-[11px] font-sans text-white/70">{backendError}</p>
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] text-[#D4AF37] block mb-1">To start the FastAPI backend server, run:</span>
              <code className="bg-[#070F1A] text-[#00FF66] px-2 py-1 rounded block text-xs border border-[#00FF66]/30">
                python -m uvicorn backend.app.main:app --reload
              </code>
            </div>
          </div>

          <button
            onClick={() => fetchBackendData()}
            className="bg-[#7A1F2B] text-[#F3ECD9] px-6 py-2.5 rounded font-bold uppercase tracking-wider border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#070F1A] transition-all shadow"
          >
            🔄 RETRY CONNECTION
          </button>
        </div>
      </div>
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
    <div className="min-h-screen flex flex-col bg-[#070F1A] text-[#F3ECD9]">
      <Header />
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {renderActiveModule()}
      </main>

      {/* Task Inspector & Recommendation Dossier Modal */}
      {inspectedTaskId && (
        <TaskInspectorModal
          taskId={inspectedTaskId}
          onClose={() => setInspectedTaskId(null)}
        />
      )}

      <footer className="bg-[#070F1A] text-[#F3ECD9] text-center p-4 border-t-4 border-[#7A1F2B] font-mono text-xs shadow-inner">
        <p className="uppercase tracking-widest text-[#D4AF37] font-bold">
          MINISTRY OF RAILWAYS • SIH26027 AUTOMATIC BLOCK PLANNING PROTOTYPE
        </p>
        <p className="text-white/50 text-[10px] mt-1">
          RailWise Backend API Connected • AI CP-SAT Engine Active • Authoritative Data Outputs Connected
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
