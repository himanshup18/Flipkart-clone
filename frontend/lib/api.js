import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { product_id: productId, quantity });
  return response.data;
};

export const updateCartItem = async (cartId, quantity) => {
  const response = await api.put(`/cart/${cartId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (cartId) => {
  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

// Orders API
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (shippingAddress) => {
  const response = await api.post('/orders', { shipping_address: shippingAddress });
  return response.data;
};

export default api;
