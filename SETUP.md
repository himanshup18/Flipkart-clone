# Quick Setup Guide

## Step-by-Step Setup

### 1. Supabase Database Setup

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and wait for provisioning

#### Get Credentials
1. Go to Project Settings > API
2. Copy:
   - Project URL (SUPABASE_URL)
   - anon public key (SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

#### Run Schema
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste contents of `backend/database/schema.sql`
4. Click "Run" to execute

> See `backend/database/SUPABASE_SETUP.md` for detailed instructions

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add your Supabase credentials:
# SUPABASE_URL=your_project_url
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Seed database with sample products
npm run seed

# Start server (development mode)
npm run dev
```

Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

Frontend should now be running on `http://localhost:3000`

### 4. Verify Setup

1. Open browser: `http://localhost:3000`
2. You should see product listing page
3. Click on any product to view details
4. Add products to cart
5. Proceed to checkout and place an order

## Troubleshooting

### Database Connection Error
- Verify Supabase project is active
- Check SUPABASE_URL and SUPABASE_ANON_KEY in `.env`
- Ensure database schema has been run in Supabase SQL Editor
- Check Supabase dashboard for any project issues

### Port Already in Use
- Backend: Change `PORT` in `.env` (default: 5000)
- Frontend: Next.js will automatically use next available port

### Images Not Loading
- Images use Unsplash placeholders
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Cart Not Updating
- Ensure backend is running
- Check browser console for API errors
- Verify CORS is enabled in backend
