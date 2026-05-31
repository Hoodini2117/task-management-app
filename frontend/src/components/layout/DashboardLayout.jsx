import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function DashboardLayout({ tasks, activeView, onViewChange, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={onViewChange}
      />
      <div className="main-content">
        <Header
          tasks={tasks}
          activeView={activeView}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
