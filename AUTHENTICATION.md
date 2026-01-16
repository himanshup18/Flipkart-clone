# Authentication Setup Guide

This application uses standard email/password authentication with JWT tokens.

## Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Add JWT secret to `.env`:**
```env
JWT_SECRET=your_very_secure_secret_key_here
```

3. **Update database schema:**
   - Run the updated `schema.sql` in your Supabase SQL Editor
   - This creates the `users` table with unique email constraint

## Frontend Setup

No additional environment variables needed for authentication. The frontend uses the same API URL.

## Features

- **User Registration**: Users can create accounts with name, email, and password
- **Email Uniqueness**: Email field is unique - prevents duplicate accounts
- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure token-based authentication
- **User Login**: Secure login with email and password
- **Protected Routes**: Cart and Checkout pages require authentication
- **User Profile**: Shows user name/email in navbar dropdown
- **Logout**: Users can logout from the dropdown menu
- **Token Persistence**: Tokens stored in localStorage for session persistence

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: `{ user, token }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`
  
- `GET /api/auth/me` - Get current user (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

## User Flow

1. **Sign Up**: Users visit `/signup` to create an account
   - Email must be unique
   - Password must be at least 6 characters
   
2. **Login**: Users visit `/login` to sign in
   - Validates email and password
   
3. **Shopping**: Authenticated users can add items to cart
   - Token is automatically included in API requests
   
4. **Checkout**: Only authenticated users can place orders
   - Protected route redirects to login if not authenticated
   
5. **Logout**: Users can logout from the navbar dropdown
   - Clears token and user data from localStorage

## Security Features

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Email uniqueness enforced at database level
- Tokens verified on protected routes
- Unauthorized requests return 401 status

## Database Schema

The `users` table includes:
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
