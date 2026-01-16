# Deployment Guide for Render.com

## Backend Deployment (Node.js/Express)

### Render Service Configuration:

**Build Command:** (Leave empty or use:)
```
npm install
```

**Start Command:**
```
npm start
```

**Environment Variables to Set:**
- `PORT` - Will be automatically set by Render (default: 5000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for seeding)
- `JWT_SECRET` - A secure random string for JWT tokens

**Pre-Deploy Command (Optional):**
```
npm run seed
```
(Only if you want to seed the database on each deploy - usually not recommended)

### Important Notes:
- Backend doesn't need a build step (it's plain Node.js)
- Use `npm start` for production (not `npm run dev`)
- Make sure all environment variables are set in Render dashboard

## Frontend Deployment (Next.js)

### Render/Vercel Configuration:

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

### Vercel Deployment (Recommended for Next.js):

Vercel is optimized for Next.js. Just connect your GitHub repo and it will auto-detect Next.js settings.

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL

## Database Setup

1. Run the SQL schema in Supabase SQL Editor
2. Run the `add_users_table.sql` script
3. Seed the database: `npm run seed` (run locally or via Render shell)

## CORS Configuration

Make sure your backend CORS is configured to allow requests from your frontend domain.
