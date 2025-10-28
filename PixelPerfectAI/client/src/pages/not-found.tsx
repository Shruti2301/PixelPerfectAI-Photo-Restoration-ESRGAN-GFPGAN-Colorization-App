/**
 * NotFound.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * 404 Page Component for PixelPerfectAI. Displayed when a user navigates to a route that does not exist.
 *
 * Features:
 *  - Prominent 404 error code and message
 *  - User-friendly explanation of missing page
 *  - Call-to-action button to navigate back to home
 *  - Responsive design using Tailwind CSS
 *
 * Technical Details:
 *  - Uses `Link` from Wouter for client-side navigation
 *  - `Button` and `Home` icon imported from UI components and Lucide-react
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
        
        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Back to Home Button */}
        <Link href="/">
          <a data-testid="button-home">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
