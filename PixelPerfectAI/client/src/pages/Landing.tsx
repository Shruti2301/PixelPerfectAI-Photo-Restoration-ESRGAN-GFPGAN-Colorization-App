/**
 * Landing.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * Main landing page for PixelPerfectAI showcasing hero, stats, features, and CTA sections.
 * Designed to attract users to sign up, view gallery, and explore product capabilities.
 *
 * Features:
 *   - Hero section with gradient background, headline, and CTAs
 *   - Key statistics highlighting the platform's capabilities
 *   - Feature cards explaining AI-powered enhancements
 *   - Call-to-action section encouraging free trial and pricing exploration
 *
 * Technical Details:
 *   - React functional component using JSX
 *   - Tailwind CSS for responsive layout and styling
 *   - Lucide-react icons for feature illustrations
 *   - Reusable Card components for feature and stats layouts
 *   - Wouter used for internal navigation links
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Enhancement",
      description: "State-of-the-art deep learning models enhance your images with incredible detail and clarity.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process images in seconds with our optimized AI pipeline and cloud infrastructure.",
    },
    {
      icon: TrendingUp,
      title: "Super Resolution",
      description: "Upscale images 2x or 4x while preserving and enhancing fine details.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your images are encrypted and automatically deleted after processing.",
    },
    {
      icon: ImageIcon,
      title: "Multiple Formats",
      description: "Support for JPEG, PNG, and WEBP with flexible output options.",
    },
    {
      icon: CheckCircle2,
      title: "Professional Quality",
      description: "Get studio-grade results used by photographers and designers worldwide.",
    },
  ];
  
  const stats = [
    { value: "~4x", label: "Max Resolution Upscale" },
    { value: "5+", label: "Early Adopters" },
    { value: "3", label: "Advanced ML Models Integrated" },
    { value: "90%+", label: "Positive Feedback Rating" },
];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-2/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Deep Learning AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
              Transform Your Images
              <br />
              with AI Magic
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Enhance, upscale, and restore photos using cutting-edge artificial intelligence.
              Professional-grade results in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="/api/login" data-testid="button-hero-get-started">
                <Button size="lg" className="text-base px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link href="/gallery">
                <a data-testid="button-hero-view-examples">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    View Examples
                  </Button>
                </a>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card" id="features">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose PixelPerfectAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-leading AI models and infrastructure designed for professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover-elevate transition-all duration-300 border-card-border"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Enhance Your Images?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals using PixelPerfectAI every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/api/login" data-testid="button-cta-get-started">
              <Button size="lg" className="text-base px-8">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link href="/pricing">
              <a data-testid="button-cta-view-pricing">
                <Button size="lg" variant="outline" className="text-base px-8">
                  View Pricing
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
