import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../db/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const NONCE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export interface NonceData {
  nonce: string;
  wallet: string;
  created_at: number;
}

export interface User {
  id: number;
  wallet: string;
  display_name: string | null;
  created_at: string;
}

// In-memory nonce store (in production, use database)
const nonceStore = new Map<string, NonceData>();

export const authService = {
  /**
   * Generate a random nonce for wallet verification
   */
  generateNonce: (): { nonce: string; expiresIn: number } => {
    const nonce = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    nonceStore.set(nonce, {
      nonce,
      wallet: '',
      created_at: timestamp
    });

    // Clean up expired nonces
    const expiryTime = Date.now() - NONCE_EXPIRY;
    for (const [key, value] of nonceStore.entries()) {
      if (value.created_at < expiryTime) {
        nonceStore.delete(key);
      }
    }

    return { nonce, expiresIn: NONCE_EXPIRY / 1000 };
  },

  /**
   * Verify nonce exists and hasn't expired
   */
  verifyNonce: (nonce: string): boolean => {
    const data = nonceStore.get(nonce);
    if (!data) return false;

    const isExpired = Date.now() - data.created_at > NONCE_EXPIRY;
    if (isExpired) {
      nonceStore.delete(nonce);
      return false;
    }

    return true;
  },

  /**
   * Store nonce with wallet association
   */
  storeNonceForWallet: (nonce: string, wallet: string): void => {
    const data = nonceStore.get(nonce);
    if (data) {
      data.wallet = wallet;
    }
  },

  /**
   * Generate JWT token
   */
  generateToken: (wallet: string): string => {
    return jwt.sign(
      { wallet },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  /**
   * Verify JWT token
   */
  verifyToken: (token: string): { wallet: string } | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { wallet: string };
      return decoded;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get or create user by wallet
   */
  getOrCreateUser: async (wallet: string): Promise<User> => {
    try {
      // Check if user exists
      const result = await db.query(
        'SELECT * FROM users WHERE wallet = $1',
        [wallet]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // Create new user
      const insertResult = await db.query(
        'INSERT INTO users (wallet) VALUES ($1) RETURNING *',
        [wallet]
      );

      return insertResult.rows[0];
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw error;
    }
  },

  /**
   * Get user by wallet
   */
  getUserByWallet: async (wallet: string): Promise<User | null> => {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE wallet = $1',
        [wallet]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getUserByWallet:', error);
      throw error;
    }
  }
};
