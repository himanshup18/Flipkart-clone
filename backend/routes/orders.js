const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { getUserIdFromToken } = require('../middleware/auth');

const DEFAULT_USER_ID = 1;

// Generate unique order number
function generateOrderNumber() {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
}

// Get all orders for authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
        }

        return {
          ...order,
          items: items || []
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw orderError;
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      throw itemsError;
    }

    order.items = items || [];

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { shipping_address } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select(`
        *,
        products (
          name,
          price,
          stock
        )
      `)
      .eq('user_id', userId);

    if (cartError) {
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItemsData = cartItems.map(item => {
      const price = parseFloat(item.products.price);
      const quantity = item.quantity;
      const subtotal = price * quantity;
      totalAmount += subtotal;
      
      return {
        product_id: item.product_id,
        product_name: item.products.name,
        product_price: price,
        quantity: quantity,
        subtotal: subtotal
      };
    });

    // Create order
    const orderNumber = generateOrderNumber();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_address: shipping_address,
        status: 'confirmed'
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItemsToInsert = orderItemsData.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      // Try to delete the order if items insertion fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Update product stock
    for (const item of cartItems) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });

      // If RPC doesn't exist, use update
      if (stockError) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id);
        }
      }
    }

    // Clear cart
    const { error: clearCartError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (clearCartError) {
      console.error('Error clearing cart:', clearCartError);
    }

    // Fetch order with items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    order.items = items || [];

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
