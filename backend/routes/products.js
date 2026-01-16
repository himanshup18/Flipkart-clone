const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'id', order = 'ASC' } = req.query;
    
    // First, get category ID if category slug is provided
    let categoryId = null;
    if (category) {
      const { data: categoryData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (!catError && categoryData) {
        categoryId = categoryData.id;
      }
    }
    
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `);

    // Filter by category
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Validate sort column to prevent issues
    const allowedSortColumns = ['id', 'name', 'price', 'rating', 'created_at'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'id';
    const sortOrder = order.toUpperCase() === 'DESC' ? false : true;

    query = query.order(sortColumn, { ascending: sortOrder });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform data to match expected format
    const transformedData = (data || []).map(product => ({
      ...product,
      category_name: product.categories?.name || null,
      category_slug: product.categories?.slug || null,
      categories: undefined // Remove nested object
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      throw error;
    }

    // Transform data to match expected format
    const product = {
      ...data,
      category_name: data.categories?.name || null,
      category_slug: data.categories?.slug || null,
      categories: undefined
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
