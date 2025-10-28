// client/src/lib/queryClient.ts
// =============================================================
// Centralized Query Client configuration for React Query
// -------------------------------------------------------------
// This module defines utilities for performing authenticated API 
// requests and standardizing how network errors (especially 401 
// Unauthorized) are handled across the app.
//
// It exports:
//  - `apiRequest`: wrapper for fetch with JSON support & credentials
//  - `getQueryFn`: factory for query functions with flexible 401 handling
//  - `queryClient`: a preconfigured React Query client
//
// Author: Shruti Mandaokar
// Date: October 2025
// =============================================================

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Utility function to throw an Error if a `fetch` response is not OK (res.ok === false).
 * * It reads and includes the response text in the error message for better debugging context.
 *
 * @param res - The Fetch API Response object.
 * @throws {Error} - When the response status is not OK.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    // Example error message: "404: Not Found" or "401: Unauthorized"
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * A generic API request helper wrapping the Fetch API.
 *
 * It:
 * - Adds `Content-Type: application/json` automatically when `data` is provided.
 * - Includes cookies by default (`credentials: "include"`).
 * - Throws an error if the response is not OK (via `throwIfResNotOk`).
 *
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param url - The API endpoint URL.
 * @param data - Optional request body (serialized as JSON if provided).
 * @returns A Promise resolving to the raw Response object if successful.
 * @throws {Error} If the response is not OK (non-2xx).
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Include cookies (important for auth sessions)
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Determines how to handle 401 (Unauthorized) responses in queries.
 * * - `"returnNull"`: Resolve query to `null` (useful for optional user sessions).
 * - `"throw"`: Propagate the error normally (useful for protected routes).
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Factory for creating a standardized React Query `queryFn`.
 * * This ensures all data fetching within React Query uses consistent
 * error handling and authentication logic.
 * * @param options.on401 - Behavior when a 401 Unauthorized is returned.
 * @returns A `QueryFunction` suitable for React Query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Construct URL from query key parts (e.g., ["api", "user"] → "/api/user")
    const url = queryKey.join("/") as string;
    
    // Check if the URL starts with /api/
    const res = await fetch(url.startsWith('/') ? url : '/' + url, {
      credentials: "include",
    });

    // Handle session expiration or missing auth gracefully if configured
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Global React Query client with sensible defaults:
 * * - `staleTime: Infinity`: Data never becomes stale by default.
 * - `refetchOnWindowFocus: false`: Avoids unnecessary network calls.
 * - `retry: false`: Disable automatic retries for deterministic behavior.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  // The problematic 'queryCache' block has been removed to fix the type error.
});