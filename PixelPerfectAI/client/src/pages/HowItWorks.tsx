/**
 * HowItWorks.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * Step-by-step guide explaining how PixelPerfectAI enhances images using AI.
 * Includes hero, process steps, technology overview, and CTA section.
 *
 * Features:
 *   - Four-step walkthrough with alternating layout
 *   - Detailed list of features for each step
 *   - Visual icons representing each step
 *   - Technology highlights section for models used
 *   - Call-to-action to start enhancing images
 *
 * Technical Details:
 *   - Uses React functional component with JSX
 *   - Tailwind CSS for styling and responsive design
 *   - Lucide-react icons for step illustrations
 *   - Reusable Card components for step and tech layout
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Cpu, Download, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      number: "01",
      title: "Upload Your Image",
      description: "Drag and drop or click to upload your image. We support JPEG, PNG, and WEBP formats up to 10MB.",
      details: [
        "Instant validation and preview",
        "Secure encrypted upload",
        "No registration required for first try",
      ],
    },
    {
      icon: Sparkles,
      number: "02",
      title: "Choose Enhancement Type",
      description: "Select from our range of AI-powered enhancements tailored to your needs.",
      details: [
        "2x or 4x super resolution upscaling",
        "Noise reduction and deblurring",
        "Color enhancement and restoration",
      ],
    },
    {
      icon: Cpu,
      number: "03",
      title: "AI Processing",
      description: "Our deep learning models analyze and enhance your image in seconds.",
      details: [
        "Real-ESRGAN for super resolution",
        "GFPGAN for face enhancement",
        "Advanced neural networks",
      ],
    },
    {
      icon: Download,
      number: "04",
      title: "Download & Compare",
      description: "Preview the results with our interactive comparison tool and download your enhanced image.",
      details: [
        "Side-by-side comparison slider",
        "Multiple format options",
        "Original quality preserved",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your images in four simple steps using our AI-powered enhancement pipeline
          </p>
        </section>

        {/* Steps Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 items-center`}
                  data-testid={`step-${index}`}
                >
                  {/* Step Card */}
                  <div className="flex-1">
                    <Card className="p-8 h-full border-card-border">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-6xl font-bold text-primary/20">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  {/* Visual Icon / Illustration */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-lg flex items-center justify-center border border-border">
                      <Icon className="w-24 h-24 text-primary/30" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technology Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
          <div className="bg-card border border-card-border rounded-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
              We use state-of-the-art deep learning models that have been trained on millions of images
              to deliver professional-grade results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Real-ESRGAN</div>
                <p className="text-muted-foreground">Super Resolution Model</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">GFPGAN</div>
                <p className="text-muted-foreground">Face Enhancement</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Cloud GPU</div>
                <p className="text-muted-foreground">Lightning Fast Processing</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Try it now with 50 free credits - no credit card required
          </p>
          <a href="/api/login" data-testid="button-get-started">
            <Button size="lg" className="text-base px-8">
              Start Enhancing Now
            </Button>
          </a>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
