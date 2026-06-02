import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/tasks',
});

export const getTasks = (status, priority, search) => {
  const params = {};
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (search) params.search = search;
  return api.get('/', { params });
};

export const getHistory = (skip = 0, limit = 200) =>
  api.get('/history', { params: { skip, limit } });

export const getStats = () => api.get('/stats');

export const createTask = (data) => api.post('/', data);

export const updateTask = (id, data) => api.put(`/${id}`, data);

export const deleteTask = (id) => api.delete(`/${id}`);

// --- Comments ---

export const getComments = (taskId) => api.get(`/${taskId}/comments`);

export const createComment = (taskId, data) => api.post(`/${taskId}/comments`, data);

export const deleteComment = (taskId, commentId) =>
  api.delete(`/${taskId}/comments/${commentId}`);

// --- Activities ---

export const getActivities = (taskId) => api.get(`/${taskId}/activities`);

export default api;
