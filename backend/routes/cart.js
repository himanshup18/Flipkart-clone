import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

// Get cart items for authenticated user
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update cart item quantity
router.put('/:id', updateCartItem);

// Remove item from cart
router.delete('/:id', removeFromCart);

// Clear cart
router.delete('/', clearCart);

export default router;
