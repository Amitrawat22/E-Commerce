import api from './axiosConfig';

export const login = (credentials) => api.post('/auth/signin', credentials);
export const register = (data) => api.post('/auth/signup', data);
export const signout = () => api.post('/auth/signout');
export const getCurrentUser = () => api.get('/auth/user');
