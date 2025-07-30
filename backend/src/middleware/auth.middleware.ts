// This file contains the middleware for authentication.
// It is used to authenticate the user and get the user's information.
// It is used to protect the routes that are only accessible to authenticated users.

// Authentication middleware checks if a user is logged in before allowing access to protected routes. 

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  
  console.log(`🔐 [${requestId}] 🔒 AUTH MIDDLEWARE: Starting authentication check`);
  console.log(`🔐 [${requestId}] 🔒 AUTH MIDDLEWARE: Authorization header: ${req.header('Authorization')?.substring(0, 20)}...`);
  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
   
    // If no token is provided, return a 401 error
    if (!token) {
      console.log(`🔐 [${requestId}] ❌ AUTH MIDDLEWARE: No token provided`);
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log(`🔐 [${requestId}] 🔄 AUTH MIDDLEWARE: Verifying JWT token...`);

    // Verify the token
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'default-secret');
    req.user = decoded;
    
    console.log(`🔐 [${requestId}] ✅ AUTH MIDDLEWARE: Token verified successfully`);
    console.log(`🔐 [${requestId}] 👤 AUTH MIDDLEWARE: User authenticated:`, { 
      userId: (decoded as any)?.userId || (decoded as any)?.id,
      email: (decoded as any)?.email 
    });
    
    return next();
  } catch (error) {
    console.log(`🔐 [${requestId}] ❌ AUTH MIDDLEWARE: Token verification failed:`, error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Note : We prefixed "_res" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
export const optionalAuthMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  
  console.log(`🔐 [${requestId}] 🔓 OPTIONAL AUTH MIDDLEWARE: Starting optional authentication check`);
  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      console.log(`🔐 [${requestId}] 🔄 OPTIONAL AUTH MIDDLEWARE: Token found, attempting verification...`);
      const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'default-secret');
      req.user = decoded;
      console.log(`🔐 [${requestId}] ✅ OPTIONAL AUTH MIDDLEWARE: Token verified, user authenticated`);
    } else {
      console.log(`🔐 [${requestId}] ℹ️ OPTIONAL AUTH MIDDLEWARE: No token provided, continuing without auth`);
    }
    
    next();
  } catch (error) {
    console.log(`🔐 [${requestId}] ⚠️ OPTIONAL AUTH MIDDLEWARE: Token verification failed, continuing without auth:`, error);
    // Continue without authentication
    next();
  }
}; 