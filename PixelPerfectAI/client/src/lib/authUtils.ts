/**
 * FILE: isUnauthorizedError.ts
 * PURPOSE: Utility function for error handling in client-side API calls.
 * FUNCTIONALITY: Specifically checks if a given JavaScript Error object 
 * represents an HTTP 401 Unauthorized response based on 
 * its message content.
 * USAGE: Helps client code (e.g., in a TanStack Query 'onError' callback) 
 * determine if a failed request is due to an unauthenticated session 
 * or bad credentials, allowing for targeted handling like redirecting 
 * to a login page or clearing user data.
 * -----------------------------------------------------------------------------
 * Author: Shruti Mandaokar
 * Date: October 2025
 * -----------------------------------------------------------------------------
 */
/**
 * Checks whether the given error indicates an "Unauthorized" (HTTP 401) response.
 * * This is useful for distinguishing authentication or session-related errors 
 * (e.g., expired tokens, invalid credentials) from other server or network errors.
 * * @param error - The Error object to inspect.
 * @returns `true` if the error message starts with "401: ...Unauthorized", otherwise `false`.
 */
export function isUnauthorizedError(error: Error): boolean {
  // The regex checks if the error message follows the pattern:
  // "^401: " (starts with "401: ")
  // ".*" (followed by any characters)
  // "Unauthorized" (and ends with or contains "Unauthorized")
  // matching cases like:
  // "401: Unauthorized", "401: Token Unauthorized", etc.
  return /^401: .*Unauthorized/.test(error.message);
}