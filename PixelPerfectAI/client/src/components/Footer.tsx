/**
 * =====================================================================
 * File: Footer.tsx
 * Project: PixelPerfectAI - AI-Powered Image Enhancement
 * Description:
 *    This file defines the Footer component, which serves as the 
 *    website’s main footer section. It includes navigation links, 
 *    brand identity, company info, and social media integration.
 *
 * Functions / Responsibilities:
 *    - Displays brand name and tagline.
 *    - Provides quick navigation to key site sections (Product, Company).
 *    - Highlights PixelPerfectAI’s quality and security commitments.
 *    - Includes social media links with icons.
 *
 * Technologies Used:
 *    - React with TypeScript
 *    - Wouter for lightweight client-side routing
 *    - Lucide-react for SVG icons
 *    - Tailwind CSS for styling
 *
// Author: Shruti Mandaokar
// Created: October 2025
 * =====================================================================
 */

import { Link } from "wouter";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Main container for footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* === Top Footer Grid Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand Section */}
          <div>
            <Link href="/">
              <a className="flex items-center gap-2 mb-4">
                {/* Logo icon with gradient background */}
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PixelPerfectAI</span>
              </a>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform your images with cutting-edge AI technology.
            </p>
          </div>

          {/* Product Links Section */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-how-it-works"
                  >
                    How It Works
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-pricing"
                  >
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-gallery"
                  >
                    Gallery
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/architecture">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-architecture"
                  >
                    Architecture
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links Section */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-about"
                  >
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-faq"
                  >
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand Message / Compliance Section */}
          <div>
            <h3 className="font-semibold mb-4">Our Commitment</h3>
            <ul className="space-y-3">
              <li>
                <div
                  className="text-sm text-muted-foreground"
                  data-testid="footer-message-quality"
                >
                  High-Fidelity AI Processing
                </div>
              </li>
              <li>
                <div
                  className="text-sm text-muted-foreground"
                  data-testid="footer-message-secure"
                >
                  Data Security & Deletion
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* === Bottom Bar Section === */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 PixelPerfectAI. All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-github"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-linkedin"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
