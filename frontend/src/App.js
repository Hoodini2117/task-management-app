import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Loader from './components/Loader';
import { getTasks, createTask, deleteTask } from './services/api';
import './styles/main.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setError('');
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  return (
    <>
      <Navbar />
      <main className="container">
        <TaskForm onTaskCreated={handleCreate} />

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <Loader />
        ) : (
          <TaskList tasks={tasks} onDelete={handleDelete} />
        )}
      </main>
    </>
  );
}

export default App;