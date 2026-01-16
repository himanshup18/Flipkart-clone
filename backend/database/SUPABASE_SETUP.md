# Supabase Database Setup

This guide will help you set up the database schema in Supabase.

## Steps to Set Up Database in Supabase

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `flipkart-clone` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the closest region
5. Wait for the project to be created (takes a few minutes)

### 2. Get Your Supabase Credentials
1. Go to Project Settings (gear icon)
2. Click on "API" in the sidebar
3. Copy the following:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 3. Run the Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to execute the SQL

Alternatively, you can run the schema using the Supabase CLI or by executing the SQL file directly in the SQL Editor.

### 4. Set Up Environment Variables
Create a `.env` file in the `backend` directory with:

```env
PORT=5000
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Seed the Database
After setting up the schema, run the seed script:

```bash
cd backend
npm run seed
```

This will populate your database with sample categories and products.

## Database Schema Overview

The schema includes the following tables:

- **categories**: Product categories (Electronics, Fashion, etc.)
- **products**: Product information with images, specifications, pricing
- **cart**: Shopping cart items (default user_id = 1)
- **orders**: Order information with shipping address
- **order_items**: Individual items in each order

## Row Level Security (RLS)

By default, Supabase enables Row Level Security. For this project, we're using the anon key which should work for basic operations. If you encounter permission issues:

1. Go to Authentication > Policies in Supabase dashboard
2. For each table, you may need to create policies to allow anonymous access
3. Or use the service_role key for admin operations (not recommended for production)

For development, you can temporarily disable RLS on tables:
```sql
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

## Troubleshooting

### Connection Issues
- Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check that your Supabase project is active

### Permission Errors
- Ensure RLS policies allow the operations you need
- Use service_role key for seeding (admin operations)

### Schema Errors
- Make sure you run the schema.sql file completely
- Check that all tables are created successfully
- Verify foreign key relationships are set up correctly
