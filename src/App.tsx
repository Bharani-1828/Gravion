import { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { CommandPage } from '@/pages/CommandPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { InspectionPage } from '@/pages/InspectionPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import type { ViewId } from '@/lib/nav';

function App() {
  const [activeView, setActiveView] = useState<ViewId>('command');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarManuallyToggled, setSidebarManuallyToggled] = useState(false);

  useEffect(() => {
    const updateCollapsed = () => {
      if (!sidebarManuallyToggled) {
        setSidebarCollapsed(window.innerWidth < 1024);
      }
    };
    updateCollapsed();
    window.addEventListener('resize', updateCollapsed);
    return () => window.removeEventListener('resize', updateCollapsed);
  }, [sidebarManuallyToggled]);

  function handleToggleSidebar() {
    setSidebarCollapsed((prev) => !prev);
    setSidebarManuallyToggled(true);
  }

  function renderView() {
    switch (activeView) {
      case 'command':
        return <CommandPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'inspection':
        return <InspectionPage />;
      default:
        return <PlaceholderPage pageId={activeView} />;
    }
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={setActiveView} collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onToggleSidebar={handleToggleSidebar} activeView={activeView} />
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
}

export default App;
