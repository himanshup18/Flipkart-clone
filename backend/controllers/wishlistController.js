import supabase from '../config/database.js';
import { getUserIdFromToken } from '../middleware/auth.js';

// Get wishlist items for authenticated user
const getWishlist = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (
          id,
          name,
          price,
          original_price,
          discount_percent,
          images,
          stock,
          brand,
          rating,
          review_count
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to flatten product fields
    const transformedData = (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      created_at: item.created_at,
      product: item.products
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in wishlist
    const { data: existingItem, error: existingError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Insert new item
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: product_id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if product is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.json({ inWishlist: false });
    }
    
    const { product_id } = req.query;
    
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ inWishlist: !!data });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};
