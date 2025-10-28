// client/src/pages/About.tsx
// =============================================================
// About Page Component
// -------------------------------------------------------------
// Author: Shruti Mandaokar
// Date: October 2025
//
// This React component renders the "About" page for PixelPerfectAI.
//
// Sections included:
//   1. Header (Navigation)
//   2. Hero Section - Brief intro about the platform
//   3. Story Section - Company history and mission
//   4. Values Section - Core company values with icons
//   5. Stats Section - Key platform metrics and achievements
//   6. Team Section - Overview of the team behind PixelPerfectAI
//   7. Footer (Site footer and links)
//
// Dependencies:
//   - Header & Footer components
//   - Card component for styled containers
//   - Lucide React icons for visual representation
// =============================================================

import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, Heart, Sparkles } from "lucide-react";

/**
 * About page component.
 * Renders company information, values, stats, and team overview.
 */
export default function About() {
  // Define core company values with icons, title, and description
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "Making professional-grade AI image enhancement accessible to everyone.",
    },
    {
      icon: Users,
      title: "Customer-First",
      description: "Every feature we build starts with understanding our users' needs.",
    },
    {
      icon: Heart,
      title: "Quality Focused",
      description: "We never compromise on the quality of results or user experience.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly exploring new AI models and techniques to serve you better.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Site Header / Navigation */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section: Page intro */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About PixelPerfectAI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your image and watch AI Enhance it in seconds.
          </p>
        </section>

        {/* Story Section: Company background */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 mb-20">
          <Card className="p-8 md:p-12 border-card-border">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                PixelPerfectAI was founded in 2025 with a simple belief: everyone deserves access
                to professional-grade image enhancement tools, regardless of their technical expertise
                or budget.
              </p>
              <p>
                We saw that while AI technology was advancing rapidly, most solutions were either
                too expensive, too complex, or produced inconsistent results. We set out to change that.
              </p>
              <p>
                Our target users range from professional photographers
                and designers to hobbyists and content creators. Our platform will help people bring their visual content to life.
              </p>
              <p>
                We're just getting started. Our team consists of Merey Yerbolat, Shruti Mandaokar, Rahul Alladi and Aalekh Srivastava. We are constantly working on new features, models,
                and improvements to make PixelPerfectAI the best image enhancement platform.
              </p>
            </div>
          </Card>
        </section>

        {/* Values Section: Core company values with icons */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-6 border-card-border text-center hover-elevate transition-all"
                  data-testid={`value-${index}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section: Company metrics */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <Card className="p-8 md:p-12 border-card-border bg-gradient-to-br from-primary/5 to-chart-2/5">
            <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">~4x</div>
                <div className="text-sm text-muted-foreground">Max Resolution Upscale</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                <div className="text-sm text-muted-foreground">Early Adopters</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Advanced ML Models Integrated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">90%+</div>
                <div className="text-sm text-muted-foreground">Positive Feedback Rating</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Team Section: Overview of the team */}
        <section className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Built by AI Enthusiasts
          </h2>
          <Card className="p-8 md:p-12 border-card-border text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Our team combines expertise in artificial intelligence, computer vision, and user experience
              design. We're passionate about making advanced technology accessible and useful for everyone.
            </p>
          </Card>
        </section>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
