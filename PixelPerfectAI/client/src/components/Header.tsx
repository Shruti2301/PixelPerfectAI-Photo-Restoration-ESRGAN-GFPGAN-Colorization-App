/**
 * =====================================================================
 * File: Header.tsx
 * Project: PixelPerfectAI - AI-Powered Image Enhancement
 * Description:
 *    Defines the Header component — a responsive top navigation bar
 *    that adapts between desktop and mobile layouts. It handles routing,
 *    authentication states (login/logout), and admin access links.
 *
 * Functions / Responsibilities:
 *    - Displays brand logo and navigation links.
 *    - Provides conditional rendering for authenticated users.
 *    - Manages mobile menu open/close state.
 *    - Integrates logout functionality via custom authentication hook.
 *
 * Technologies Used:
 *    - React + TypeScript
 *    - Wouter for client-side routing
 *    - Tailwind CSS for layout and styling
 *    - Lucide-react for icons (Menu, X, Sparkles)
 * // Author: Shruti Mandaokar
   // Created: October 2025
 * */

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  // Get logout function from the hook
  const { isAuthenticated, user, logout } = useAuth(); 

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/gallery", label: "Gallery" },
    { href: "/features", label: "Features" }, 
    { href: "/documentation", label: "Documentation" }, 
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close menu on mobile
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate rounded-md px-2 -ml-2 py-1" data-testid="link-home">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PixelPerfectAI</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <a data-testid="link-dashboard">
                    <Button variant="ghost" size="default">
                      Dashboard
                    </Button>
                  </a>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin">
                    <a data-testid="link-admin">
                      <Button variant="secondary" size="default">
                        Admin
                      </Button>
                    </a>
                  </Link>
                )}
                {/* Use the handleLogout function */}
                <Button 
                    variant="outline" 
                    size="default" 
                    onClick={handleLogout} 
                    data-testid="link-logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Link to new Login page */}
                <Link href="/login">
                  <a data-testid="link-login">
                    <Button variant="ghost" size="default">
                      Login
                    </Button>
                  </a>
                </Link>
                {/* Link to new Signup page */}
                <Link href="/signup">
                  <a data-testid="link-signup">
                    <Button variant="default" size="default">
                      Get Started Free
                    </Button>
                  </a>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover-elevate rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-background">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-4 py-3 rounded-md text-sm font-medium hover-elevate ${
                    location === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <a onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-dashboard">
                      <Button variant="ghost" size="default" className="w-full">
                        Dashboard
                      </Button>
                    </a>
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <a onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-admin">
                        <Button variant="secondary" size="default" className="w-full">
                          Admin
                        </Button>
                      </a>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="w-full"
                    onClick={handleLogout} // Use the logout handler
                    data-testid="mobile-link-logout"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <a onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-login">
                      <Button variant="ghost" size="default" className="w-full">
                        Login
                      </Button>
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-signup">
                      <Button variant="default" size="default" className="w-full">
                        Get Started Free
                      </Button>
                    </a>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}