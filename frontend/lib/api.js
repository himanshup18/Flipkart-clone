import axios from 'axios';

// Ensure API_URL always ends with /api
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  // If URL doesn't end with /api, add it
  return url.endsWith('/api') ? url : url.endsWith('/') ? `${url}api` : `${url}/api`
}

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

// Wishlist API
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist', { product_id: productId });
  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await api.delete(`/wishlist/${wishlistId}`);
  return response.data;
};

export const checkWishlist = async (productId) => {
  const response = await api.get('/wishlist/check', { params: { product_id: productId } });
  return response.data;
};

export default api;
