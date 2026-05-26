import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/tasks',
});

export const getTasks = () => api.get('/');

export const createTask = (data) => api.post('/', data);

export const deleteTask = (id) => api.delete(`/${id}`);

export default api;
