-- Add users table to existing Supabase database
-- Copy and paste this entire query into Supabase SQL Editor and run it

-- Step 1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 3: Create a default user with id=1 if it doesn't exist
-- This is needed because existing orders/cart might reference user_id=1
INSERT INTO users (id, name, email, password)
VALUES (1, 'Default User', 'default@flipkart.com', '$2a$10$dummyhashedpasswordfordefaultuser')
ON CONFLICT (id) DO NOTHING;

-- Step 4: Reset the sequence to ensure next user gets id=2
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);

-- Step 5: Update cart table to reference users
-- Remove default value from user_id if it exists
DO $$ 
BEGIN
    -- Check if default exists and remove it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cart' 
        AND column_name = 'user_id' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE cart ALTER COLUMN user_id DROP DEFAULT;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'cart_user_id_fkey' 
        AND table_name = 'cart'
    ) THEN
        ALTER TABLE cart 
            ADD CONSTRAINT cart_user_id_fkey 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- Step 6: Update orders table to reference users
-- Remove default value from user_id if it exists
DO $$ 
BEGIN
    -- Check if default exists and remove it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'user_id' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE orders ALTER COLUMN user_id DROP DEFAULT;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_user_id_fkey' 
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE orders 
            ADD CONSTRAINT orders_user_id_fkey 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE SET NULL;
    END IF;
END $$;

-- Verification: Check if table was created successfully
SELECT 
    'Users table created successfully!' as status,
    COUNT(*) as total_users
FROM users;
