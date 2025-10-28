/**
 * Login.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * Login page for PixelPerfectAI. Allows users to sign in using email and password.
 * Redirects authenticated users automatically to the dashboard.
 *
 * Features:
 *   - Responsive centered login card using Tailwind CSS
 *   - Form validation with required fields
 *   - Loading state during login
 *   - Redirects using `useLocation` from Wouter
 *   - Links to signup page for new users
 *
 * Technical Details:
 *   - React functional component with hooks for state management
 *   - `useAuth` custom hook manages authentication and user session
 *   - `Card`, `Input`, and `Button` components used from UI library
 *   - Icons provided via Lucide-react (Sparkles)
 *   - Accessible form and button states
 */

import { useState } from "react";
// FIX: Import useLocation
import { Link, useLocation } from "wouter"; 
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  
  // FIX: Use useLocation to get the navigate function as the second element
  const [, navigate] = useLocation(); 
  
  // Redirect authenticated users automatically
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Redirect after successful login
      navigate('/dashboard', { replace: true }); 
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-16">
      <Card className="w-full max-w-sm p-6 bg-white shadow-2xl border border-gray-200">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">PixelPerfectAI</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700">Sign in</h1>
          <p className="text-sm text-gray-500">to continue to PixelPerfectAI</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
            <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90" 
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-center pt-4">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup">
                <a className="text-primary hover:underline font-medium">Create one</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
