import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/tasks',
});

export const getTasks = (status, priority) => {
  const params = {};
  if (status) params.status = status;
  if (priority) params.priority = priority;
  return api.get('/', { params });
};

export const getHistory = (skip = 0, limit = 200) =>
  api.get('/history', { params: { skip, limit } });

export const getStats = () => api.get('/stats');

export const createTask = (data) => api.post('/', data);

export const updateTask = (id, data) => api.put(`/${id}`, data);

export const deleteTask = (id) => api.delete(`/${id}`);

export default api;
