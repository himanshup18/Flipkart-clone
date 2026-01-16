import express from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

export default router;
