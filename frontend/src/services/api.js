import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (username, password) => api.post('token/', { username, password });
export const register = (username, password, email) => api.post('register/', { username, password, email });

export const getTasks = () => api.get('tasks/');
export const createTask = (task) => api.post('tasks/', task);
export const updateTask = (id, task) => api.put(`tasks/${id}/`, task);
export const deleteTask = (id) => api.delete(`tasks/${id}/`);

export default api;
