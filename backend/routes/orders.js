import express from 'express';
import { getOrders, getOrderById, createOrder } from '../controllers/ordersController.js';

const router = express.Router();

// Get all orders for authenticated user
router.get('/', getOrders);

// Get single order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

export default router;
