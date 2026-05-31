import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1/tasks`,
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
