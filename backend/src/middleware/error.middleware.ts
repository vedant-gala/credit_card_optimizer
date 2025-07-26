// This file contains the middleware for error handling.
// It is used to catch and process errors consistently across an application.

// Error handling middleware catches and processes errors consistently across an application

import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

// Define the AppError interface
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Define the error middleware
// Note : We prefixed "_next" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    message: process.env['NODE_ENV'] === 'production' ? 'Internal Server Error' : message,
    ...(process.env['NODE_ENV'] !== 'production' && { stack: error.stack })
  };

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

// Define the createError function
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}; 