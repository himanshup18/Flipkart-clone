// Middleware to extract and verify user ID from JWT token

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function getUserIdFromToken(req) {
  // Extract user ID from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      console.error('Invalid or expired token:', error.message);
      return null;
    }
    console.error('Error parsing token:', error);
    return null;
  }
}
