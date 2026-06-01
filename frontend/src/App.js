import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardView from './components/views/DashboardView';
import AllTasksView from './components/views/AllTasksView';
import StatusTasksView from './components/views/StatusTasksView';
import HistoryView from './components/views/HistoryView';
import Loader from './components/ui/Loader';
import { ThemeProvider } from './components/ui/ThemeProvider';
import TaskModal from './components/tasks/TaskModal';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import './styles/globals.css';
import './styles/layout.css';
import './styles/tasks.css';

const statusViews = ['pending', 'in-progress', 'completed'];

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [viewTasks, setViewTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const fetchAllTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setAllTasks(res.data);
    } catch (err) {
      // silent — allTasks is for stats
    }
  }, []);

  const fetchViewTasks = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const isStatus = statusViews.includes(activeView);
      const res = await getTasks(isStatus ? activeView : null);
      setViewTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [activeView]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  useEffect(() => {
    fetchViewTasks();
  }, [fetchViewTasks]);

  const refreshAll = () => {
    fetchAllTasks();
    fetchViewTasks();
  };

  const handleCreate = async (taskData) => {
    await createTask(taskData);
    refreshAll();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      refreshAll();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setAllTasks(allTasks.filter((t) => t.id !== id));
      setViewTasks(viewTasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const renderView = () => {
    if (loading && activeView !== 'history') return <Loader />;

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={allTasks}
            onTaskCreated={handleCreate}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onNavigate={setActiveView}
          />
        );
      case 'all':
        return (
          <AllTasksView
            tasks={viewTasks}
            onTaskCreated={handleCreate}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        );
      case 'pending':
      case 'in-progress':
      case 'completed':
        return (
          <StatusTasksView
            status={activeView}
            tasks={viewTasks}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        );
      case 'history':
        return <HistoryView />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <DashboardLayout
        tasks={allTasks}
        activeView={activeView}
        onViewChange={setActiveView}
        onNewTask={() => setShowModal(true)}
      >
        {error && <div className="error-banner">{error}</div>}
        {renderView()}
      </DashboardLayout>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={async (data) => {
            await handleCreate(data);
            setShowModal(false);
          }}
        />
      )}
    </ThemeProvider>
  );
}

export default App;