# Supabase Quick Start Guide

## 1. Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait 2-3 minutes for provisioning

## 2. Get Your Credentials

In Supabase Dashboard → Settings → API:
- **Project URL** → `SUPABASE_URL`
- **anon public** key → `SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (for seeding)

## 3. Set Up Database

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of `backend/database/schema.sql`
4. Paste and click **Run**

## 4. Configure Environment

Create `backend/.env`:
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 5. Install & Run

```bash
cd backend
npm install
npm run seed  # Populate with sample data
npm run dev   # Start server
```

## 6. Row Level Security (RLS)

For development, you may need to disable RLS or create policies:

**Option 1: Disable RLS (Development Only)**
Run in SQL Editor:
```sql
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

**Option 2: Create Policies (Recommended)**
Create policies that allow anonymous access for development.

## Troubleshooting

- **Connection errors**: Verify credentials in `.env`
- **Permission errors**: Check RLS settings
- **Schema errors**: Ensure all tables created successfully
- **Seed errors**: Use service_role key for seeding

## Next Steps

- Frontend setup: See main README.md
- Detailed setup: See `backend/database/SUPABASE_SETUP.md`
