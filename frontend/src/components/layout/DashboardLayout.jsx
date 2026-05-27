import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function DashboardLayout({ tasks, activeFilter, onFilterChange, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      <div className="main-content">
        <Header
          tasks={tasks}
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
