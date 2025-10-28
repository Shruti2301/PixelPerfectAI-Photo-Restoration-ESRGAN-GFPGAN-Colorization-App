// client/src/pages/Architecture.tsx
// =============================================================
// Architecture Page
// -------------------------------------------------------------
// Author: Shruti Mandaokar
// Date: October 2025
//
// Overview of PixelPerfectAI's system architecture, technology stack,
// AI models, and image processing pipeline.
//
// Features:
//   - Hero section with page introduction
//   - System architecture diagram
//   - Technology stack cards
//   - AI model details
//   - Image processing pipeline visualization
// =============================================================

import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Database, Cpu, Cloud, Lock, Zap, GitBranch } from "lucide-react";

// Architecture page component
export default function Architecture() {
  const components = [
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Built on reliable cloud services with 99.9% uptime guarantee",
      tech: ["Replit Hosting", "PostgreSQL Database", "CDN Distribution"],
    },
    {
      icon: Cpu,
      title: "AI Models",
      description: "State-of-the-art deep learning models for image enhancement",
      tech: ["Real-ESRGAN", "GFPGAN", "Replicate API"],
    },
    {
      icon: Database,
      title: "Data Layer",
      description: "Secure and scalable data storage with automatic backups",
      tech: ["PostgreSQL", "Drizzle ORM", "Session Management"],
    },
    {
      icon: Lock,
      title: "Security",
      description: "Enterprise-grade security for your data and images",
      tech: ["OAuth 2.0", "Encrypted Storage", "HTTPS/TLS"],
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimized for speed with intelligent caching and processing",
      tech: ["Edge Caching", "Async Processing", "Load Balancing"],
    },
    {
      icon: GitBranch,
      title: "API Architecture",
      description: "RESTful API design with comprehensive documentation",
      tech: ["Express.js", "TypeScript", "Rate Limiting"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Architecture
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with cutting-edge technology for reliability, performance, and scale
          </p>
        </section>

        {/* System Architecture Diagram */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <Card className="p-8 md:p-12 border-card-border">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              System Overview
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-lg p-6 border border-primary/20">
                <h3 className="font-semibold mb-2">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">
                  React + TypeScript • Tailwind CSS • Vite • Responsive Design
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-border" />
              </div>
              <div className="bg-gradient-to-r from-chart-3/10 to-primary/10 rounded-lg p-6 border border-chart-3/20">
                <h3 className="font-semibold mb-2">Backend API</h3>
                <p className="text-sm text-muted-foreground">
                  Express.js • Node.js • TypeScript • RESTful Endpoints • Authentication
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-6 border border-card-border">
                  <h4 className="font-semibold mb-2 text-sm">Database</h4>
                  <p className="text-xs text-muted-foreground">PostgreSQL</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-card-border">
                  <h4 className="font-semibold mb-2 text-sm">AI Processing</h4>
                  <p className="text-xs text-muted-foreground">Replicate API</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-card-border">
                  <h4 className="font-semibold mb-2 text-sm">Payments</h4>
                  <p className="text-xs text-muted-foreground">Stripe</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Components / Tech Stack */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component, index) => {
              const Icon = component.icon;
              return (
                <Card
                  key={index}
                  className="p-6 border-card-border hover-elevate transition-all"
                  data-testid={`component-${index}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{component.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {component.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {component.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-muted rounded text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* AI Models Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            AI Models We Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 border-card-border">
              <h3 className="text-2xl font-bold mb-4">Real-ESRGAN</h3>
              <p className="text-muted-foreground mb-4">
                Enhanced Super-Resolution Generative Adversarial Network for realistic image upscaling.
                Trained on millions of high-quality images to preserve and enhance fine details.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Use Case:</span>
                  <span className="font-medium">General upscaling (2x, 4x)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="font-medium">Textures & details</span>
                </div>
              </div>
            </Card>
            <Card className="p-8 border-card-border">
              <h3 className="text-2xl font-bold mb-4">GFPGAN</h3>
              <p className="text-muted-foreground mb-4">
                Generative Facial Prior GAN specifically designed for face restoration and enhancement.
                Excellent for portraits and photos with people.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Use Case:</span>
                  <span className="font-medium">Face enhancement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="font-medium">Portrait restoration</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Processing Pipeline */}
        <section className="max-w-6xl mx-auto px-4 md:px-8">
          <Card className="p-8 md:p-12 border-card-border bg-gradient-to-br from-background to-primary/5">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Processing Pipeline
            </h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "Upload & Validation", desc: "Secure upload with file type and size validation" },
                { step: 2, title: "Pre-processing", desc: "Image analysis and optimization for AI models" },
                { step: 3, title: "AI Enhancement", desc: "Deep learning model processes and enhances the image" },
                { step: 4, title: "Post-processing & Delivery", desc: "Format conversion and secure delivery to user" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{s.title}</h4>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
