import api from './axiosConfig';

export const addToCart = (productId, quantity) => api.post(`/carts/products/${productId}/quantity/${quantity}`);
export const getMyCart = () => api.get('/carts/users/cart');
export const updateCartQty = (productId, operation) => api.put(`/carts/products/${productId}/quantity/${operation}`);
export const removeFromCart = (cartId, productId) => api.delete(`/carts/${cartId}/product/${productId}`);
