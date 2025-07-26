// This file contains the authentication service.
// It is used to register, login, logout, refresh token, get profile, generate access token and generate refresh token.

// Import the necessary modules
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/models/User';
import { createError } from '@/middleware/error.middleware';

// Define the auth service
export const authService = {
  async register(userData: { email: string; password: string; name: string }) {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw createError('User already exists', 400);
    }

    // Hash password
    const saltRounds = parseInt(process.env['BCRYPT_ROUNDS'] || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    };
  },

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    };
  },

  async logout(_userId: string) {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    return true;
  },

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env['JWT_REFRESH_SECRET'] || 'refresh-secret') as any;
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        throw createError('User not found', 404);
      }

      const newAccessToken = this.generateAccessToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  },

  // Note : We used Type assertion to tell typescript that the object is of type SignOptions
  // Typescript protects us from passing in the wrong type of object to the jwt.sign function
  // But because we KNOW that the object is of type SignOptions, we can use type assertion to tell typescript that it is of type SignOptions
  // This is a way to tell typescript that we know what we are doing and we want to bypass the type checking
  // This is NOT a replacement for proper type checking
  // TODO : Replace the type assertion with a proper type check instead
  generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env['JWT_SECRET'] || 'default-secret',
      { expiresIn: process.env['JWT_EXPIRES_IN'] || '1h' } as SignOptions
    );
  },

  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
      { expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d' } as SignOptions
    );
  }
}; 