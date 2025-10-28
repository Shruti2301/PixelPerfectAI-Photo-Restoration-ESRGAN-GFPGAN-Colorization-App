// client/src/hooks/useAuth.ts
// -----------------------------------------------------------------------------
// FILE: useAuth.ts
// PURPOSE: Custom React Hook for authentication state management.
// FUNCTIONALITY: Provides login, signup, and logout functions, and access to 
//                the current user data and authentication status.
// TECHNOLOGY: Implements session state and aggressive caching using 
//             **TanStack Query** (React Query) to minimize unnecessary network 
//             requests to the `/api/session` endpoint.
// -----------------------------------------------------------------------------
// Author: Shruti Mandaokar
// Date: October 2025
// -----------------------------------------------------------------------------

import { createContext, useContext, useMemo } from 'react';
import * as React from 'react';
import { useToast } from './use-toast.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 

// -----------------------------------------------------------------------------
// TYPE DEFINITIONS
// -----------------------------------------------------------------------------

/**
 * Interface representing a user object from the backend session endpoint.
 */
interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  credits: number;
  firstName?: string;
  subscriptionTier?: string; 
}

/**
 * Structure of the authentication context exposed by the useAuth hook.
 * 'user' can be User, null (logged out), or undefined (initial loading state).
 */
interface AuthContextType {
  user: User | null | undefined; 
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; 
}

// -----------------------------------------------------------------------------
// CONTEXT CREATION & HELPERS
// -----------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The TanStack Query key for the session data
const SESSION_QUERY_KEY = ["api", "session"];

/**
 * Helper function to fetch the user session from the backend.
 * Returns User object if authenticated, or null otherwise.
 */
const fetchSession = async (): Promise<User | null> => {
  const response = await fetch('/api/session');
  // Return null for unauthenticated status (e.g., 401) or other non-OK responses
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  // Expect data.user or null if the API response is structured to return { user: User | null }
  return data.user || null;
};

/**
 * Helper function to handle failed authentication responses.
 * Parses the error message and shows a toast notification.
 */
const handleAuthError = async (response: Response, toast: ReturnType<typeof useToast>['toast']) => {
    try {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorData.message || "An unknown error occurred. Please try again.",
      });
    } catch (e) {
      // Fallback for non-JSON or unreadable server responses
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to server or process response.",
      });
    }
    // Throw an error to stop execution in the calling login/signup function
    throw new Error('Authentication failed');
};


// -----------------------------------------------------------------------------
// PROVIDER COMPONENT
// -----------------------------------------------------------------------------

/**
 * The main provider component that wraps the application.
 * It manages the authentication state using TanStack Query.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use useQuery to fetch the initial session and manage its state and caching.
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    
    // CRITICAL CACHING CONFIGURATION to prevent excessive server calls (spam):
    // 1. staleTime: Infinity - Data is never considered 'stale', so it won't
    //    automatically refetch unless manually invalidated.
    // 2. refetchOnMount: false - Prevents a fetch on every mount.
    // 3. refetchOnWindowFocus: false - Prevents a fetch when the window regains focus.
    staleTime: Infinity,          
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Derived state: True if 'user' is an object (not null and not undefined)
  const isAuthenticated = !!user;

  // ---------------------------------------------------------------------------
  // Core Authentication Functions
  // ---------------------------------------------------------------------------
  
  /**
   * Logs a user in and updates the TanStack Query cache on success.
   */
  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: User = await response.json();
      
      // Manually update the 'api/session' cache with the new User data
      // This immediately makes the user available to all consuming components
      queryClient.setQueryData(SESSION_QUERY_KEY, data);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.firstName || data.email}.`, 
      });
    } else {
      await handleAuthError(response, toast);
    }
  };

  /**
   * Registers a new user and updates the TanStack Query cache on success.
   */
  const signup = async (email: string, password: string): Promise<void> => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: User = await response.json();
      
      // Manually update the 'api/session' cache with the newly created User data
      queryClient.setQueryData(SESSION_QUERY_KEY, data);

      toast({
        title: "Signup Successful",
        description: `Account created for ${data.email}.`,
      });
    } else {
      await handleAuthError(response, toast);
    }
  };

  /**
   * Logs out the user, clears the session cache, and invalidates other user-dependent data.
   */
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      
      // Set the session cache data to null (logged out state)
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      
      // Invalidate all queries that depend on the user being logged in 
      // (e.g., a query for a user's private data like "/api/enhancements")
      queryClient.invalidateQueries({ queryKey: ["/api/enhancements"] });

      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ---------------------------------------------------------------------------
  // Memoized context value
  // ---------------------------------------------------------------------------
  // Memoize the context value to prevent unnecessary re-renders in consumers.
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      isLoading,
    }),
    [user, isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// HOOK: useAuth
// -----------------------------------------------------------------------------

/**
 * useAuth Hook
 * Custom hook to easily access the authentication state and functions
 * from any component wrapped by AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This guards against using the hook outside of the provider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};