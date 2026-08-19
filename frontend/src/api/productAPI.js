import api from './axiosConfig';

export const getProducts = (params) => api.get('/public/products', { params });
export const getProductsByCategory = (categoryId, params) => api.get(`/public/categories/${categoryId}/products`, { params });
export const getProductsByKeyword = (keyword, params) => api.get(`/public/products/keyword/${keyword}`, { params });
export const addProduct = (categoryId, data) => api.post(`/admin/categories/${categoryId}/product`, data);
export const updateProduct = (productId, data) => api.put(`/admin/products/${productId}`, data);
export const deleteProduct = (productId) => api.delete(`/admin/products/${productId}`);
export const updateProductImage = (productId, formData) =>
  api.put(`/admin/products/${productId}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getCategories = (params) => api.get('/public/categories', { params });
export const createCategory = (data) => api.post('/public/categories', data);
export const updateCategory = (categoryId, data) => api.put(`/public/categories/${categoryId}`, data);
export const deleteCategory = (categoryId) => api.delete(`/admin/categories/${categoryId}`);
