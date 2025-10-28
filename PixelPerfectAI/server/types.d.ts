// server/types.d.ts
/**
 * ---------------------------------------------------------------------------
 * Custom Type Definitions for Express Requests
 * ---------------------------------------------------------------------------
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Purpose:
 * This file extends the default Express `Request` interface to include
 * a strongly typed `user` property, which represents the payload
 * decoded from a verified JWT. It ensures type safety for authentication
 * throughout the backend.
 *
 * Key Features:
 * 1. `AuthUserPayload`:
 *    - Represents the minimal JWT payload expected from the authentication system.
 *    - Contains `id` for user lookups and `isAdmin` for role-based access control.
 *
 * 2. Express `Request` Extension:
 *    - Adds an optional `user` property to `req`.
 *    - Type-safe access to authenticated user data without casting or using `any`.
 *
 * Notes:
 *  - `req.user` can be `undefined` or `null` if the request is unauthenticated.
 *  - This type definition is used across all routes and middleware for authentication.
 */

// The minimal payload we expect from a successfully verified JWT
interface AuthUserPayload {
  id: string; // The primary field used for database lookups
  isAdmin: boolean;
}

// Extend the Express Request interface to include our custom 'user' property
declare namespace Express {
  interface Request {
    // This makes req.user optional and correctly typed (AuthUserPayload or null)
    user?: AuthUserPayload | null; 
  }
}