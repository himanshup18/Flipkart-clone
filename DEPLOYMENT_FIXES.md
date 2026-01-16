# Deployment Fixes - 404 Error on Auth Routes

## Issues Found and Fixed:

### 1. **Frontend API URL Configuration** ✅ FIXED
**Problem:** If `NEXT_PUBLIC_API_URL` is set without `/api`, requests go to wrong endpoints.

**Solution:** Updated both `frontend/lib/api.js` and `frontend/contexts/AuthContext.js` to automatically append `/api` if missing.

### 2. **CORS Configuration** ✅ FIXED
**Problem:** CORS might not allow requests from frontend domain.

**Solution:** Updated `backend/server.js` to accept `FRONTEND_URL` environment variable.

### 3. **Missing Route Handler** ✅ FIXED
**Problem:** No root route or 404 handler for debugging.

**Solution:** Added root route and 404 handler in `backend/server.js`.

## Environment Variables Setup:

### Backend (Render.com):
```
PORT=5000 (auto-set by Render)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_secure_random_string
FRONTEND_URL=https://your-frontend-domain.com (optional, for CORS)
```

### Frontend (Vercel/Render):
```
NEXT_PUBLIC_API_URL=https://flipkart-clone-2feu.onrender.com/api
```
**IMPORTANT:** Must include `/api` at the end!

## Testing Steps:

1. **Check Backend Health:**
   ```
   GET https://flipkart-clone-2feu.onrender.com/api/health
   ```
   Should return: `{ status: 'OK', message: 'Server is running' }`

2. **Check Root Route:**
   ```
   GET https://flipkart-clone-2feu.onrender.com/
   ```
   Should return API information

3. **Test Auth Endpoint:**
   ```
   POST https://flipkart-clone-2feu.onrender.com/api/auth/register
   ```
   Should return user data or error message

## Common Issues:

### Issue: 404 on `/auth/login`
**Cause:** `NEXT_PUBLIC_API_URL` doesn't include `/api`
**Fix:** Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

### Issue: CORS Error
**Cause:** Frontend domain not allowed
**Fix:** Set `FRONTEND_URL` in backend environment variables

### Issue: Database Connection Error
**Cause:** Missing Supabase credentials
**Fix:** Verify all Supabase environment variables are set

### Issue: JWT Error
**Cause:** Missing or weak JWT_SECRET
**Fix:** Set a strong random string for `JWT_SECRET`

## Verification Checklist:

- [ ] Backend deployed and accessible
- [ ] `/api/health` endpoint returns OK
- [ ] All environment variables set in Render
- [ ] `NEXT_PUBLIC_API_URL` includes `/api` in frontend
- [ ] Frontend deployed with correct environment variable
- [ ] Database tables created (users, products, etc.)
- [ ] CORS allows frontend domain

## Quick Fix Commands:

If you need to test locally:
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:5000/api npm run dev
```
