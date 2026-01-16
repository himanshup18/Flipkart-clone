# Flipkart Clone - E-Commerce Platform

A full-stack e-commerce web application that replicates Flipkart's design and functionality, built with Next.js (frontend) and Node.js/Express (backend).

## Features

### Core Features (Implemented)
- ✅ **Product Listing Page**: Grid layout with Flipkart-like product cards, search functionality, and category filters
- ✅ **Product Detail Page**: Image carousel, product specifications, add to cart, and buy now functionality
- ✅ **Shopping Cart**: View cart items, update quantities, remove items, and view cart summary
- ✅ **Order Placement**: Checkout page with shipping address form, order summary, and order confirmation

### Additional Features
- Responsive design for mobile, tablet, and desktop
- Real-time cart count in navigation
- Product search and filtering
- Category-based product browsing
- Order history (via API)

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Backend-as-a-Service (PostgreSQL database)
- **@supabase/supabase-js** - Supabase client library

## Project Structure

```
Flipkart-clone/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── database/
│   │   └── schema.sql           # Database schema
│   ├── routes/
│   │   ├── products.js          # Product routes
│   │   ├── categories.js        # Category routes
│   │   ├── cart.js              # Cart routes
│   │   └── orders.js            # Order routes
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding script
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.js              # Home/Product listing
│   │   ├── product/[id]/
│   │   │   └── page.js          # Product detail
│   │   ├── cart/
│   │   │   └── page.js          # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.js          # Checkout
│   │   └── order-confirmation/[id]/
│   │       └── page.js          # Order confirmation
│   ├── components/
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── Footer.js            # Footer
│   │   ├── ProductCard.js       # Product card component
│   │   ├── SearchBar.js         # Search component
│   │   └── CategoryFilter.js    # Category filter
│   ├── lib/
│   │   └── api.js               # API client functions
│   └── package.json
└── README.md
```

## Database Schema

The application uses Supabase (PostgreSQL) with the following tables:

- **categories**: Product categories
- **products**: Product information with images, specifications, pricing
- **cart**: Shopping cart items (default user_id = 1)
- **orders**: Order information with shipping address
- **order_items**: Individual items in each order

See `backend/database/SUPABASE_SETUP.md` for detailed Supabase setup instructions.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Supabase account (free tier works)
- npm or yarn

### Backend Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be provisioned (takes a few minutes)

2. **Get Supabase Credentials**
   - In Supabase dashboard, go to Settings > API
   - Copy your Project URL and anon public key
   - Copy your service_role key (keep this secret!)

3. **Set Up Database Schema**
   - In Supabase dashboard, go to SQL Editor
   - Create a new query and paste the contents of `backend/database/schema.sql`
   - Run the query to create all tables

4. **Navigate to the backend directory:**
```bash
cd backend
```

5. **Install dependencies:**
```bash
npm install
```

6. **Create a `.env` file in the backend directory:**
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

7. **Seed the database with sample data:**
```bash
npm run seed
```

8. **Start the backend server:**
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

> **Note**: For detailed Supabase setup instructions, see `backend/database/SUPABASE_SETUP.md`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional query params: category, search, sort, order)
- `GET /api/products/:id` - Get single product by ID

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart` - Get cart items for default user
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get all orders for default user
- `GET /api/orders/:id` - Get single order by ID
- `POST /api/orders` - Create new order

## Assumptions

1. **Default User**: The application assumes a default user with `user_id = 1` is logged in. No authentication system is implemented as per assignment requirements.

2. **Images**: Product images use Unsplash placeholder URLs. In production, you would upload actual product images to Supabase Storage or another CDN.

3. **Shipping**: Free shipping is assumed for all orders.

4. **Payment**: Payment processing is not implemented. Orders are placed directly after checkout.

5. **Stock Management**: Stock is decremented when orders are placed, but no real-time stock validation is performed during cart operations.

6. **Supabase RLS**: Row Level Security may need to be configured or disabled for development. See `backend/database/SUPABASE_SETUP.md` for details.

## Deployment

### Backend Deployment (Render/Railway/Vercel)
1. Set environment variables in your hosting platform:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed for seeding)
2. Ensure your Supabase project is accessible
3. Run database schema and seed script (if not already done)
4. Deploy the Node.js application

### Frontend Deployment (Vercel/Netlify)
1. Set `NEXT_PUBLIC_API_URL` environment variable to your backend API URL
2. Deploy the Next.js application
3. Ensure CORS is properly configured on the backend

## Future Enhancements

- User authentication and authorization
- Order history page in frontend
- Wishlist functionality
- Email notifications on order placement
- Payment gateway integration
- Product reviews and ratings
- Advanced search and filters
- Admin dashboard

## License

This project is created for educational purposes as part of an assignment.

## Author

Created as part of SDE Intern Fullstack Assignment
