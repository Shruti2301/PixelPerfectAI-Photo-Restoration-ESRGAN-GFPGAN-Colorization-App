// server/authUtils.ts

// FIX: Use the default import pattern for jsonwebtoken as required by Esbuild/ESM environment.
import pkg from "jsonwebtoken";
// Destructure the required functions from the default imported package object.
const { sign, verify } = pkg; 

// FIX: Use named imports for bcrypt, which is generally reliable, 
// but if this fails later, you would apply the same default import pattern.
import { hash, compare } from "bcrypt";


// --- Configuration ---
// IMPORTANT: Set a strong secret in your .env file (JWT_SECRET)!
const JWT_SECRET = process.env.JWT_SECRET || "a_very_strong_default_secret_for_dev";
const SALT_ROUNDS = 10;

// --- Types ---

interface TokenPayload {
  id: string;
  isAdmin: boolean;
}

// --- Hashing Functions ---

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  // Use the directly imported 'hash' function
  return hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password to a stored hash.
 */
export async function comparePassword(password: string, hashValue: string): Promise<boolean> {
  // Use the directly imported 'compare' function
  return compare(password, hashValue);
}

// --- JWT Functions ---

/**
 * 
 * // ===========================================================
// File: server/authUtils.ts
// Author: Shruti Mandaokar
// Date: October 2025
//
// Purpose: Provides utility functions for authentication, 
//          including password hashing and JWT generation/verification.
// Environment: Node.js with ESM support
// Dependencies:
//    - jsonwebtoken: Used for creating and verifying JWTs
//    - bcrypt: Used for hashing and comparing passwords
// Notes:
//    - JWT_SECRET should be set in the environment variables
//      for production; a default secret is provided for development.
//    - All functions are exported for use in authentication flows.
//    - TypeScript types are used to ensure payload integrity.
// ===========================================================


 * Generates a JSON Web Token (JWT) for the user session.
 */
export function generateToken(payload: TokenPayload): string {
  // Use the destructured 'sign' function
  return sign(payload, JWT_SECRET, { expiresIn: '1d' }); 
}

/**
 * Verifies a JWT and returns the decoded payload, or an error string.
 */
export function verifyToken(token: string): TokenPayload | string | undefined {
  try {
    // Use the destructured 'verify' function
    const decoded = verify(token, JWT_SECRET) as TokenPayload; 
    return decoded;
  } catch (error) {
    // Returns an error message string if verification fails (e.g., token expired)
    return 'Invalid or expired token'; 
  }
}