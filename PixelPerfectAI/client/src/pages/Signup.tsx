/**
 * Signup.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * Signup Page Component for PixelPerfectAI. Allows users to create a new account.
 *
 * Features:
 *  - Collects email and password input
 *  - Uses useAuth hook for signup and auto-login
 *  - Displays loading state during account creation
 *  - Redirects authenticated users to dashboard
 *  - Responsive card layout with Tailwind CSS
 *
 * Technical Details:
 *  - Uses `useLocation` from Wouter to programmatically navigate
 *  - Uses `Card`, `Input`, and `Button` components from the UI library
 *  - Displays gradient-branded logo with Lucide-react Sparkles icon
 */

import { useState } from "react";
import { Link, useLocation } from "wouter"; 
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export default function Signup() {
  // State hooks for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Destructure signup function and auth state from custom hook
  const { signup, isAuthenticated } = useAuth();
  
  // Get navigate function from Wouter's useLocation hook
  const [_, navigate] = useLocation();

  // Redirect already authenticated users to dashboard
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null; 
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup(email, password);
      // Navigate to dashboard after successful signup
      navigate('/dashboard', { replace: true }); 
    } catch (error) {
      // Stop loading if an error occurs (toast handled in useAuth)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-16">
      <Card className="w-full max-w-sm p-6 bg-white shadow-2xl border border-gray-200">
        
        {/* Header Section */}
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">PixelPerfectAI</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700">Create your account</h1>
        </CardHeader>

        {/* Form Section */}
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
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="flex flex-col text-sm text-center pt-4">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link href="/login">
                <a className="text-primary hover:underline font-medium">Sign in</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
