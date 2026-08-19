import api from './axiosConfig';

export const placeOrder = (paymentMethod, params) => api.post(`/order/users/payments/${paymentMethod}`, null, { params });
export const getMyOrders = () => api.get('/order/users/myorders');
export const getAllOrders = () => api.get('/admin/orders');
export const updateOrderStatus = (orderId, status) => api.put(`/admin/orders/${orderId}/orderStatus/${status}`);

export const getMyAddresses = () => api.get('/users/addresses');
export const addAddress = (data) => api.post('/addresses', data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/users/addresses/${id}`);
