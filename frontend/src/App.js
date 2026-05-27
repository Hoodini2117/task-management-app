import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import StatsCards from './components/stats/StatsCards';
import TaskForm from './components/tasks/TaskForm';
import TaskFilters from './components/tasks/TaskFilters';
import TaskList from './components/tasks/TaskList';
import Loader from './components/ui/Loader';
import { getTasks, createTask, deleteTask } from './services/api';
import './styles/globals.css';
import './styles/layout.css';
import './styles/tasks.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await getTasks(activeFilter);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (taskData) => {
    await createTask(taskData);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      tasks={tasks}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      <StatsCards tasks={tasks} />
      <TaskForm onTaskCreated={handleCreate} />
      <TaskFilters search={search} onSearchChange={setSearch} />

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <TaskList tasks={filteredTasks} onDelete={handleDelete} />
      )}
    </DashboardLayout>
  );
}

export default App;