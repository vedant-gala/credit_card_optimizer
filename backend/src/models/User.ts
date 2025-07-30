// This file contains the user model.
// It is used to create, find, update and delete users in the database.

// Import the necessary modules
import { query } from '@/config/database';

// Define the user interface
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the create user data interface
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

// Define the user model
export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password, name } = userData;
    
    const result = await query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    
    return result.rows[0];
  }

  // Find a user by id
  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  // Find a user by email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  // Update a user
  static async update(id: string, updates: Partial<CreateUserData>): Promise<User | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const queryText = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    
    const result = await query(queryText, [id, ...values]);
    
    return result.rows[0] || null;
  }

  // Delete a user
  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  }

  // Find all users
  static async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }
}

export const User = UserModel; 